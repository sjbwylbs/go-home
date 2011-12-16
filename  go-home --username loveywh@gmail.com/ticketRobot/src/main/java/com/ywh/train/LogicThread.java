/**************************************************
 * Filename: LogicThread.java
 * Version: v1.0
 * CreatedDate: 2011-11-27
 * Copyright (C) 2011 By cafebabe.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 *
 * If you would like to negotiate alternate licensing terms, you may do
 * so by contacting the author: talentyao@foxmail.com
 ***************************************************/

package com.ywh.train;

import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.util.Collections;
import java.util.List;

import javax.swing.ImageIcon;
import javax.swing.JLabel;
import javax.swing.JOptionPane;

import tk.mystudio.ocr.OCR;

import com.ywh.train.gui.RobTicket;

/**
 * 订票逻辑
 * 
 * @author cafebabe
 * @since 2011-11-27
 * @version 1.0
 */
public class LogicThread extends Thread {

	private UserInfo ui;
	private TrainClient client;
	private boolean isEnd = false;
	private RobTicket rob;

	/**
	 * 构造函数
	 * 
	 * @param robTicket
	 */
	public LogicThread(UserInfo ui, TrainClient client, RobTicket rob) {
		this.ui = ui;
		this.client = client;
		this.rob = rob;
	}

	/**
	 * override 方法
	 * 
	 * @see java.lang.Runnable#run()
	 */
	@Override
	public void run() {
		while (!isEnd) {
			Result rs = new Result();
			rob.console("用户:" + ui.getUserName() + " 开始登录...");
			rs = client.login(ui.getUserName(), ui.getPassword(),
					ui.getRandCode());
			if (rs.getState() == Result.SUCC) {
				rob.console(rs.getMsg());
			} else {
				rob.console(rs.getMsg());
				JOptionPane.showMessageDialog(null, "输入的登录信息有误请重新输入");
				rob.reset();
				return;
			}
			String randCode = null;
			rob.console("正在查询...");
			List<TrainQueryInfo> allTrain = client.queryTrain(ui.getFromCity(),
					ui.getToCity(), ui.getStartDate(), ui.getRangDate());
			if (allTrain.size() == 0) {
				rs.setState(Result.FAIL);
				rs.setMsg("未找到您选的日期及时间段从" + ui.getFromCity() + "到"
						+ ui.getToCity() + "的可预订列车信息");
				rob.console(rs.getMsg());
				JOptionPane.showMessageDialog(null, "请重新输入列车信息");
				rob.reset();
				return;
			} else {
				rs.setState(Result.SUCC);
				Collections.sort(allTrain, new TrainComparator());
				rs.setMsg("共找到您选定日期及时间段从" + ui.getFromCity() + "到"
						+ ui.getToCity() + "的可预订列车" + allTrain.size() + "趟");
				rob.console(rs.getMsg());
			}
			TrainQueryInfo train = allTrain.get(0);
			rob.console("候选列车为:" + train.getTrainNo() + " 从["
					+ train.getFromStation() + train.getStartTime() + "]开往["
					+ train.getToStation() + train.getEndTime() + "]历时"
					+ train.getTakeTime());
			String seat = Util.getSeatAI(train);
			rob.console("候选席别代码为:" + seat);
			ui.setSeatType(seat);
			rob.console("查询历史订单...");
			rs = client.queryOrder();
			rob.console(rs.getMsg());
			if (rs.getState() == Result.HAVE_NO_PAY_TICKET) {
				JOptionPane.showMessageDialog(null,
						"对不起，您还有待支付的车票，请前往www.12306.cn支付\n" +
						"后才能定其他的票");
				rob.reset();
				return;
			}
			rob.console("开始预定...");
			rs = client.book(ui.getRangDate(), ui.getStartDate(), train);
			randCode = getRandCodeDailog();
			String token = client.getToken();
			rob.console("提交订单...");
			rs = client.submiOrder(randCode, token, ui, train);
			while (rs.getState() == Result.RAND_CODE_ERROR) {
				rob.console(rs.getMsg());
				rs = client.book(ui.getRangDate(), ui.getStartDate(), train);
				randCode = getRandCodeDailog();
				token = client.getToken();
				rs = client.submiOrder(randCode, token, ui, train);
				try {
					Thread.sleep(500);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
			}
			rob.console(rs.getMsg());
			if (rs.getState() == Result.CANCEL_TIMES_TOO_MUCH) {
				JOptionPane.showMessageDialog(null,
						"由于您取消次数过多，今日将不能继续受理您的\n" +
						"订票请求,如需购票请更换账号重新登录");
				rob.reset();
				return;
			}
			if (rs.getState() == Result.REPEAT_BUY_TICKET) {
				JOptionPane.showMessageDialog(null, ui.getName()
						+ "已经买过票了，请更换购票人信息");
				rob.reset();
				return;
			}
			if (rs.getState() == Result.ERROR_CARD_NUMBER) {
				JOptionPane.showMessageDialog(null, "请输入购票人[" + ui.getName()
						+ "]正确的身份证号码");
				rob.reset();
				return;
			}
			rob.console("查询订单...");
			rs = client.queryOrder();
			rob.console(rs.getMsg());
			if (rs.getState() == Result.HAVE_NO_PAY_TICKET) {
				JOptionPane.showMessageDialog(null,
						"恭喜您订票成功，请在30min内登录www.12306.cn完成付款操作");
				rob.reset();
				break;
			}
			rob.reset();
			rob.console("订票逻辑结束");
			break;
		}
	}

	/**
	 * 获得自动识别的验证or用户输入
	 */
	public String getRandCodeDailog() {
		byte[] image = client.getCodeByte(Constants.ORDER_CODE_URL);
		String randCodeByRob = OCR.read(image);
		if (!Constants.ISAUTOCODE) {
			JLabel label = new JLabel(new ImageIcon(), JLabel.CENTER);
			label.setIcon(new ImageIcon(image));
			label.setText(" 自动识别为:" + randCodeByRob);
			CodeMouseAdapter cma = new CodeMouseAdapter(randCodeByRob);
			label.addMouseListener(cma);
			String input = JOptionPane.showInputDialog(null, label, "请输入验证码",
					JOptionPane.DEFAULT_OPTION);
			if (input == null || input.isEmpty()) {
				randCodeByRob = cma.getRandCodeByRob();
			}
		}
		return randCodeByRob;
	}

	class CodeMouseAdapter extends MouseAdapter {
		private String randCodeByRob;

		/**
		 * 构造函数
		 * 
		 * @param randCodeByRob2
		 */

		public CodeMouseAdapter(String randCodeByRob) {
			this.randCodeByRob = randCodeByRob;
		}

		@Override
		public void mouseClicked(MouseEvent e) {
			byte[] image = client.getCodeByte(Constants.ORDER_CODE_URL);
			randCodeByRob = OCR.read(image);
			JLabel label = (JLabel) e.getSource();
			label.setIcon(new ImageIcon(image));
			label.setText(" 自动识别为:" + randCodeByRob);
		}

		public String getRandCodeByRob() {
			return randCodeByRob;
		}
	}

	/**
	 * @return Returns the ui.
	 */
	public UserInfo getUi() {
		return ui;
	}

	/**
	 * @param ui
	 *            The ui to set.
	 */
	public void setUi(UserInfo ui) {
		this.ui = ui;
	}

	/**
	 * @return Returns the client.
	 */
	public TrainClient getClient() {
		return client;
	}

	/**
	 * @param client
	 *            The client to set.
	 */
	public void setClient(TrainClient client) {
		this.client = client;
	}

	/**
	 * @param isEnd
	 *            The isEnd to set.
	 */
	public void setEnd(boolean isEnd) {
		this.isEnd = isEnd;
	}
}