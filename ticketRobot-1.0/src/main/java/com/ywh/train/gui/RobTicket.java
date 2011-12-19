/**************************************************
 * Filename: RobTicket.java
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
 
package com.ywh.train.gui;

import java.awt.EventQueue;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.net.URL;
import java.text.ParseException;

import javax.swing.AbstractAction;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JFormattedTextField;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JMenu;
import javax.swing.JMenuBar;
import javax.swing.JMenuItem;
import javax.swing.JOptionPane;
import javax.swing.JPasswordField;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.ScrollPaneConstants;
import javax.swing.SwingConstants;
import javax.swing.UIManager;
import javax.swing.border.BevelBorder;
import javax.swing.text.MaskFormatter;

import org.apache.http.client.HttpClient;
import org.apache.http.impl.client.DefaultHttpClient;

import tk.mystudio.ocr.OCR;

import com.ywh.train.Constants;
import com.ywh.train.LogicThread;
import com.ywh.train.TrainClient;
import com.ywh.train.UserInfo;
import com.ywh.train.Util;

/**
 * 订票机器人
 * @author cafebabe
 * @since 2011-11-27 
 * @version 1.0
 */
public class RobTicket {

	private JFrame frame;
	private JLabel lblRc;
	private JTextField txtUsername;
	private JTextField txtPassword;
	private JTextField txtRandCode;
	private JTextField txtUserID;
	private JTextField txtName;
	private JTextField txtPhone;
	private JTextField txtStartDate;
	private JTextField txtFromStation;
	private JTextField txtToStation;
	private JCheckBox boxkDFirst;
	private JCheckBox boxkSleepFirst;
	private JCheckBox boxkIsAuto;
	private JComboBox BoxoRang;
	private JTextArea textArea;
	private JButton btnSORE;
	
	private final static HttpClient httpClient = new DefaultHttpClient();
	private TrainClient client = new TrainClient(httpClient);
	private LogicThread logic;

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
					RobTicket window = new RobTicket();
					window.frame.setVisible(true);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
		Runtime.getRuntime().addShutdownHook(new Thread() {
			public void run() {
				httpClient.getConnectionManager().shutdown();
			}
		});
	}

	/**
	 * Create the application.
	 */
	public RobTicket() {
		initialize();
	}

	/**
	 * Initialize the contents of the frame.
	 */
	private void initialize() {		
		frame = new JFrame("我要回家");
		ImageIcon ico = new ImageIcon(ClassLoader.getSystemResource("logo.jpg"));
		frame.setIconImage(ico.getImage());
		frame.setBounds(100, 100, 493, 458);
		frame.setResizable(false);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.getContentPane().setLayout(null);
		frame.setLocationRelativeTo(null);
		
		JLabel label = new JLabel("用户名:");
		label.setHorizontalAlignment(SwingConstants.RIGHT);
		label.setBounds(34, 37, 43, 15);
		frame.getContentPane().add(label);
		
		txtUsername = new JTextField();
		txtUsername.setBounds(81, 34, 84, 21);
		frame.getContentPane().add(txtUsername);
		txtUsername.setColumns(10);
		
		JLabel label_1 = new JLabel("密 码:");
		label_1.setHorizontalAlignment(SwingConstants.RIGHT);
		label_1.setBounds(170, 37, 43, 15);
		frame.getContentPane().add(label_1);
		
		txtPassword = new JPasswordField();
		txtPassword.setBounds(218, 34, 66, 21);
		frame.getContentPane().add(txtPassword);
		txtPassword.setColumns(10);
		
		JLabel label_2 = new JLabel("验证码:");
		label_2.setHorizontalAlignment(SwingConstants.RIGHT);
		label_2.setBounds(294, 37, 43, 15);
		frame.getContentPane().add(label_2);
		
		byte[] imageByte = client.getCodeByte(Constants.LOGIN_CODE_URL);
		txtRandCode = new JTextField();
		txtRandCode.setBounds(342, 34, 66, 21);
		frame.getContentPane().add(txtRandCode);
		txtRandCode.setColumns(10);
		txtRandCode.setText(OCR.read(imageByte));
		
		lblRc = new JLabel("Click Me");
		lblRc.setIcon(new ImageIcon(imageByte));
		lblRc.setBounds(414, 34, 61, 21);
		lblRc.addMouseListener(new MouseAdapter() {
			@Override
			public void mouseClicked(MouseEvent e) {
				byte[] image = client.getCodeByte(Constants.LOGIN_CODE_URL);
				String randCodeByRob = OCR.read(image);			
				lblRc.setIcon(new ImageIcon(image));
				txtRandCode.setText(randCodeByRob);
			}
		});
		frame.getContentPane().add(lblRc);
		
		JLabel label_3 = new JLabel("身份证号码:");
		label_3.setHorizontalAlignment(SwingConstants.RIGHT);
		label_3.setBounds(4, 79, 73, 15);
		frame.getContentPane().add(label_3);
		
		txtUserID = new JTextField();
		txtUserID.setBounds(81, 76, 201, 21);
		frame.getContentPane().add(txtUserID);
		txtUserID.setColumns(10);
		
		JLabel label_5 = new JLabel("姓 名:");
		label_5.setHorizontalAlignment(SwingConstants.RIGHT);
		label_5.setBounds(301, 79, 36, 15);
		frame.getContentPane().add(label_5);
		
		txtName = new JTextField();
		txtName.setBounds(342, 76, 66, 21);
		frame.getContentPane().add(txtName);
		txtName.setColumns(10);		
		
		JLabel label_6 = new JLabel("乘车日期:");
		label_6.setHorizontalAlignment(SwingConstants.RIGHT);
		label_6.setBounds(16, 161, 61, 15);
		frame.getContentPane().add(label_6);
		
		MaskFormatter mf = null;
		try {
			mf = new MaskFormatter("####-##-##");
		} catch (ParseException e1) {
			e1.printStackTrace();
		}
		txtStartDate = new JFormattedTextField(mf);
		txtStartDate.setBounds(81, 158, 84, 21);
		frame.getContentPane().add(txtStartDate);
		txtStartDate.setColumns(10);
		
		JLabel label_4 = new JLabel("发 站:");
		label_4.setHorizontalAlignment(SwingConstants.RIGHT);
		label_4.setBounds(170, 161, 43, 15);
		frame.getContentPane().add(label_4);
		
		txtFromStation = new JTextField();
		txtFromStation.setBounds(216, 158, 66, 21);
		frame.getContentPane().add(txtFromStation);
		txtFromStation.setColumns(10);
		
		JLabel label_7 = new JLabel("到 站:");
		label_7.setHorizontalAlignment(SwingConstants.RIGHT);
		label_7.setBounds(301, 161, 36, 15);
		frame.getContentPane().add(label_7);
		
		txtToStation = new JTextField();
		txtToStation.setBounds(342, 158, 66, 21);
		frame.getContentPane().add(txtToStation);
		txtToStation.setColumns(10);
		
		boxkDFirst = new JCheckBox("动车优先");
		boxkDFirst.setBounds(18, 199, 84, 23);
		frame.getContentPane().add(boxkDFirst);
		
		boxkSleepFirst = new JCheckBox("卧铺优先");
		boxkSleepFirst.setBounds(113, 199, 93, 23);
		frame.getContentPane().add(boxkSleepFirst);
		
		boxkIsAuto = new JCheckBox("自动识别验证码");
		boxkIsAuto.setBounds(219, 199, 133, 23);
		frame.getContentPane().add(boxkIsAuto);
		
		JLabel label_8 = new JLabel("手机号码:");
		label_8.setHorizontalAlignment(SwingConstants.RIGHT);
		label_8.setBounds(16, 119, 61, 15);
		frame.getContentPane().add(label_8);
		
		try {
			mf = new MaskFormatter("###########");
		} catch (ParseException e1) {
			e1.printStackTrace();
		}
		txtPhone = new JFormattedTextField(mf);
		txtPhone.setBounds(81, 116, 84, 21);
		frame.getContentPane().add(txtPhone);
		txtPhone.setColumns(10);
		
		JLabel label_9 = new JLabel("乘车时间段:");
		label_9.setHorizontalAlignment(SwingConstants.RIGHT);
		label_9.setBounds(264, 116, 73, 15);
		frame.getContentPane().add(label_9);
		
		JScrollPane scrollPane = new JScrollPane();
		scrollPane.setViewportBorder(new BevelBorder(BevelBorder.LOWERED, null, null, null, null));
		scrollPane.setHorizontalScrollBarPolicy(ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);
		scrollPane.setBounds(10, 228, 465, 192);
		frame.getContentPane().add(scrollPane);
		
		textArea = new JTextArea();
		scrollPane.setViewportView(textArea);
		textArea.setText("信息输出：\n");
		textArea.setEditable(false);
		textArea.setLineWrap(true);
		
		btnSORE = new JButton("开始");
		btnSORE.setBounds(379, 199, 73, 23);
		frame.getContentPane().add(btnSORE);
		BoxoRang = new JComboBox(Constants.trainRang.keySet().toArray());
		BoxoRang.setBounds(342, 113, 66, 21);
		frame.getContentPane().add(BoxoRang);
		
		JMenuBar menuBar = new JMenuBar();
		menuBar.setBounds(0, 0, 487, 21);
		frame.getContentPane().add(menuBar);
		
		JMenu mnOpt = new JMenu("操作");
		menuBar.add(mnOpt);
		
		JMenuItem miOpt = new JMenuItem("使用技巧");
		mnOpt.add(miOpt);
		miOpt.addActionListener(new UseSkillAction(frame));
		
		JMenu mnHelp = new JMenu("帮助");
		menuBar.add(mnHelp);
		
		JMenuItem miAbout = new JMenuItem("关于");
		mnHelp.add(miAbout);
		miAbout.addActionListener(new AboutAction(frame));
		
		readUserInfo();
		btnSORE.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				JButton btn = (JButton) e.getSource();
				if ("开始".equals(btn.getText())) {
					action();
				} else {
					reset();
				}
			}
		});		
	}

	

	/**
	 * 复位操作
	 */
	public void reset() {
		btnSORE.setText("开始");
		if (logic != null) {
			logic.setEnd(true);
		}
		byte[] image = client.getCodeByte(Constants.LOGIN_CODE_URL);
		String randCodeByRob = OCR.read(image);			
		lblRc.setIcon(new ImageIcon(image));
		txtRandCode.setText(randCodeByRob);
	}

	/**
	 * 启动方法
	 */
	protected void action() {
		// 动车优先
		if (Constants.ISTRAINDFIRST) {
			Constants.setTrainPriority(Constants.TRAIN_D, 40);
		}
		btnSORE.setText("结束");
		textArea.setText("");
		String username = txtUsername.getText().trim();
		String password = txtPassword.getText().trim();
		String randCode = txtRandCode.getText().trim();
		String id = txtUserID.getText().trim();
		String name = txtName.getText().trim();
		String fromCity = txtFromStation.getText().trim();
		String toCity = txtToStation.getText().trim();
		String startDate = txtStartDate.getText().trim();
		String phone = txtPhone.getText().trim();
		if (username.isEmpty() || password.isEmpty() || randCode.isEmpty()
				|| id.isEmpty() || name.isEmpty() || fromCity.isEmpty()
				|| fromCity.isEmpty() || toCity.isEmpty()
				|| startDate.isEmpty() || phone.isEmpty()) {
			
			JOptionPane.showMessageDialog(null, "所有信息均不能为空!");
			return;
		}
		
		UserInfo ui = new UserInfo();
		String key = (String) BoxoRang.getSelectedItem();
		String rangDate = Constants.getTrainRang(key);
		Constants.ISSLEEPFIRST = boxkSleepFirst.isSelected();
		Constants.ISAUTOCODE = boxkIsAuto.isSelected();
		Constants.ISTRAINDFIRST = boxkDFirst.isSelected();
		ui.setBoxkDFirst(Constants.ISTRAINDFIRST);
		ui.setBoxkIsAuto(Constants.ISAUTOCODE);
		ui.setBoxkSleepFirst(Constants.ISSLEEPFIRST);
		ui.setUserName(username); ui.setPassword(password);
		ui.setStartDate(startDate); ui.setRangDate(rangDate);
		ui.setFromCity(fromCity); ui.setToCity(toCity); 
		ui.setSeatType("O");ui.setTickType("1");
		ui.setName(name);ui.setPhone(phone);
		ui.setID(id); ui.setCardType("1");
		ui.setRandCode(randCode);
		writeUserInfo(ui);
	 	logic = new LogicThread(ui, client, this);
	 	logic.start();
	}

	/**
	 * 保存用户信息
	 * @param ui 
	 */
	private void writeUserInfo(UserInfo ui) {
		ObjectOutputStream oos = null;
		try {
			oos = new ObjectOutputStream(new FileOutputStream(new File("ui")));
			oos.writeObject(ui);
			oos.flush();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (oos != null) 
					oos.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}
	
	/**
	 * 读取用户信息
	 */
	private void readUserInfo() {
		ObjectInputStream ois = null;
		try {
			ois = new ObjectInputStream(new FileInputStream(new File("ui")));
			UserInfo ui = (UserInfo) ois.readObject();
			if (ui != null) {
				txtUsername.setText(ui.getUserName());
				txtPassword.setText(ui.getPassword());
				txtUserID.setText(ui.getID());
				txtName.setText(ui.getName());
				txtPhone.setText(ui.getPhone());
				txtStartDate.setText(ui.getStartDate());
				txtFromStation.setText(ui.getFromCity());
				txtToStation.setText(ui.getToCity());
//				BoxoRang.setSelectedItem(ui.getRangDate());
				boxkDFirst.setSelected(ui.isBoxkDFirst());
				boxkSleepFirst.setSelected(ui.isBoxkSleepFirst());
				boxkIsAuto.setSelected(ui.isBoxkIsAuto());
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (ois != null) 
					ois.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	public void console(String content) {
		textArea.append(Util.formatInfo(content));
		textArea.setCaretPosition(textArea.getText().length());
	}
	
	public JFrame getFrame() {
		return frame;
	}
	
	class AboutAction extends AbstractAction {
		/**字段注释*/
		private static final long serialVersionUID = 1L;
		
		JFrame parentsFrame;
		URL img = getClass().getResource("/logo.jpg");
		String imagesrc = "<img src=\"" + img + "\" width=\"50\" height=\"50\">";
		String message = Constants.ABOUNT_CONTENT;

		protected AboutAction(JFrame frame) {
			this.parentsFrame = frame;
		}

		public void actionPerformed(ActionEvent e) {
			JOptionPane.showMessageDialog(
			    parentsFrame,
			    "<html><center>" + imagesrc + "</center><br><center>" + message + "</center><br></html>",
			    "关于 我要回家",
			    JOptionPane.DEFAULT_OPTION
			);

		}
	}
	
	class UseSkillAction extends AbstractAction {
		/**字段注释*/
		private static final long serialVersionUID = 1L;
		
		JFrame parentsFrame;
		URL img = getClass().getResource("/logo.jpg");
		String imagesrc = "<img src=\"" + img + "\" width=\"50\" height=\"50\">";
		String message = "别急还有待整理！";

		protected UseSkillAction(JFrame frame) {
			this.parentsFrame = frame;
		}

		public void actionPerformed(ActionEvent e) {
			JOptionPane.showMessageDialog(
			    parentsFrame,
			    "<html>" + imagesrc + "<br><center>" + message + "</center><br></html>",
			    "使用技巧",
			    JOptionPane.DEFAULT_OPTION
			);

		}
	}

}
