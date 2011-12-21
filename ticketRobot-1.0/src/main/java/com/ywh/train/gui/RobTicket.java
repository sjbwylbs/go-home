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

import java.awt.Color;
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

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
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
import javax.swing.JPanel;
import javax.swing.JPasswordField;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.ScrollPaneConstants;
import javax.swing.SwingConstants;
import javax.swing.ToolTipManager;
import javax.swing.UIManager;
import javax.swing.border.BevelBorder;
import javax.swing.border.TitledBorder;
import javax.swing.text.MaskFormatter;

import org.apache.http.HttpHost;
import org.apache.http.client.HttpClient;
import org.apache.http.conn.params.ConnRoutePNames;
import org.apache.http.conn.scheme.Scheme;
import org.apache.http.conn.ssl.SSLSocketFactory;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.conn.tsccm.ThreadSafeClientConnManager;

import tk.mystudio.ocr.OCR;

import com.ywh.train.Config;
import com.ywh.train.Constants;
import com.ywh.train.ResManager;
import com.ywh.train.Util;
import com.ywh.train.bean.UserInfo;
import com.ywh.train.logic.LogicThread;
import com.ywh.train.logic.TrainClient;

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
	private JComboBox boxoRang;
	private JTextArea textArea;
	private JButton btnSORE;
	
	private HttpClient httpClient = null;
	private TrainClient client = null;
	private LogicThread logic;
	private JPanel panel;
	private JPanel panel_1;

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
	}

	/**
	 * Create the application.
	 */
	public RobTicket() {
		initNetwork();
		initialize();
		Runtime.getRuntime().addShutdownHook(new ExitThread());
	}

	/**
	 * 初始化网络模块
	 */
	private void initNetwork() {
		try {
			//**
			SSLContext ctx = SSLContext.getInstance("TLS"); //$NON-NLS-1$
			X509TrustManager tm = new X509TrustManager() {
				public java.security.cert.X509Certificate[] getAcceptedIssuers() {
					return null;
				}

				public void checkClientTrusted(
						java.security.cert.X509Certificate[] chain,
						String authType)
						throws java.security.cert.CertificateException {

				}

				public void checkServerTrusted(
						java.security.cert.X509Certificate[] chain,
						String authType)
						throws java.security.cert.CertificateException {

				}
			};
			// SecureRandom random = new SecureRandom();
			// byte bytes[] = new byte[20];
			// random.nextBytes(bytes);
			ctx.init(null, new TrustManager[] { tm }, null);
			SSLSocketFactory ssf = new SSLSocketFactory(ctx);
			Scheme sch = new Scheme("https", 443, ssf); //$NON-NLS-1$
			//*/
			ThreadSafeClientConnManager tcm = new ThreadSafeClientConnManager();
			tcm.setMaxTotal(10);
			tcm.getSchemeRegistry().register(sch);
			this.httpClient = new DefaultHttpClient(tcm);
			if (Config.isUseProxy()) {
				HttpHost proxy = new HttpHost(Config.getProxyIp(),
						Config.getProxyPort(), HttpHost.DEFAULT_SCHEME_NAME);
				this.httpClient.getParams().setParameter(
						ConnRoutePNames.DEFAULT_PROXY, proxy);
			}
			this.client = new TrainClient(this.httpClient);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}

	/**
	 * Initialize the contents of the frame.
	 */
	private void initialize() {		
		frame = new JFrame(ResManager.getString("RobTicket.frameName")); //$NON-NLS-1$
		ImageIcon ico = ResManager.createImageIcon("logo.jpg");
		frame.setIconImage(ico.getImage());
		frame.setBounds(100, 100, 493, 458);
		frame.setResizable(false);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.getContentPane().setLayout(null);
		frame.setLocationRelativeTo(null);
		ToolTipManager.sharedInstance().setInitialDelay(0);
		
		panel = new JPanel();
		panel.setBounds(10, 22, 467, 54);
		frame.getContentPane().add(panel);
		panel.setLayout(null);
		panel.setBorder(new TitledBorder(ResManager.getString("RobTicket.panelBorderName"))); //$NON-NLS-1$ //$NON-NLS-2$
		
		JLabel label = new JLabel(ResManager.getString("RobTicket.txtUsername")); //$NON-NLS-1$
		label.setBounds(20, 26, 43, 15);
		panel.add(label);
		label.setHorizontalAlignment(SwingConstants.RIGHT);
		
		txtUsername = new JTextField();
		txtUsername.setToolTipText(ResManager.getString("RobTicket.txtUsernameTip")); //$NON-NLS-1$
		txtUsername.setBounds(67, 23, 84, 21);
		panel.add(txtUsername);
		txtUsername.setColumns(10);
		
		JLabel label_1 = new JLabel(ResManager.getString("RobTicket.txtPassword")); //$NON-NLS-1$
		label_1.setBounds(156, 26, 43, 15);
		panel.add(label_1);
		label_1.setHorizontalAlignment(SwingConstants.RIGHT);
		
		txtPassword = new JPasswordField();
		txtPassword.setToolTipText(ResManager.getString("RobTicket.txtPasswordTip")); //$NON-NLS-1$
		txtPassword.setBounds(204, 23, 66, 21);
		panel.add(txtPassword);
		txtPassword.setColumns(10);
		
		JLabel label_2 = new JLabel(ResManager.getString("RobTicket.txtRandCode")); //$NON-NLS-1$
		label_2.setBounds(280, 26, 43, 15);
		panel.add(label_2);
		label_2.setHorizontalAlignment(SwingConstants.RIGHT);
		txtRandCode = new JTextField();
		txtRandCode.setToolTipText(ResManager.getString("RobTicket.txtRandCodeTip")); //$NON-NLS-1$
		txtRandCode.setBounds(328, 23, 66, 21);
		panel.add(txtRandCode);
		txtRandCode.setColumns(10);
		byte[] imageByte = client.getCodeByte(Constants.LOGIN_CODE_URL);
		txtRandCode.setText(OCR.read(imageByte));
		
		
		lblRc = new JLabel("Click Me"); //$NON-NLS-1$
		lblRc.setToolTipText(ResManager.getString("RobTicket.lblRcTip")); //$NON-NLS-1$
		lblRc.setBounds(396, 23, 61, 21);
		panel.add(lblRc);
		lblRc.setIcon(new ImageIcon(imageByte));
		lblRc.addMouseListener(new RandCodeListener());
		
		panel_1 = new JPanel();
		panel_1.setBorder(new TitledBorder(UIManager.getBorder("TitledBorder.border"), ResManager.getString("RobTicket.panel_1BorderTitle"), TitledBorder.LEADING, TitledBorder.TOP, null, new Color(0, 0, 0))); //$NON-NLS-1$ //$NON-NLS-2$
		panel_1.setBounds(10, 81, 467, 112);
		frame.getContentPane().add(panel_1);
		panel_1.setLayout(null);
		
		JLabel label_3 = new JLabel(ResManager.getString("RobTicket.txtUserID")); //$NON-NLS-1$
		label_3.setBounds(0, 29, 73, 15);
		panel_1.add(label_3);
		label_3.setHorizontalAlignment(SwingConstants.RIGHT);
		
		txtUserID = new JTextField();
		txtUserID.setToolTipText(ResManager.getString("RobTicket.txtUserIDTip")); //$NON-NLS-1$
		txtUserID.setBounds(77, 26, 201, 21);
		panel_1.add(txtUserID);
		txtUserID.setColumns(10);
		
		JLabel label_5 = new JLabel(ResManager.getString("RobTicket.txtName")); //$NON-NLS-1$
		label_5.setBounds(297, 29, 36, 15);
		panel_1.add(label_5);
		label_5.setHorizontalAlignment(SwingConstants.RIGHT);
		
		txtName = new JTextField();
		txtName.setToolTipText(ResManager.getString("RobTicket.txtNameTip")); //$NON-NLS-1$
		txtName.setBounds(338, 26, 66, 21);
		panel_1.add(txtName);
		txtName.setColumns(10);		
		
		JLabel label_6 = new JLabel(ResManager.getString("RobTicket.txtStartDate")); //$NON-NLS-1$
		label_6.setBounds(12, 85, 61, 15);
		panel_1.add(label_6);
		label_6.setHorizontalAlignment(SwingConstants.RIGHT);
		
		MaskFormatter mf = null;
		try {
			mf = new MaskFormatter("####-##-##"); //$NON-NLS-1$
		} catch (ParseException e1) {
			e1.printStackTrace();
		}
		txtStartDate = new JFormattedTextField(mf);
		txtStartDate.setToolTipText(ResManager.getString("RobTicket.txtStartDateTip")); //$NON-NLS-1$
		txtStartDate.setBounds(77, 82, 84, 21);
		panel_1.add(txtStartDate);
		txtStartDate.setColumns(10);
		
		JLabel label_4 = new JLabel(ResManager.getString("RobTicket.txtFromStation")); //$NON-NLS-1$
		label_4.setBounds(166, 85, 43, 15);
		panel_1.add(label_4);
		label_4.setHorizontalAlignment(SwingConstants.RIGHT);
		
		txtFromStation = new JTextField();
		txtFromStation.setToolTipText(ResManager.getString("RobTicket.txtFromStationTip")); //$NON-NLS-1$
		txtFromStation.setBounds(212, 82, 66, 21);
		panel_1.add(txtFromStation);
		txtFromStation.setColumns(10);
		
		JLabel label_7 = new JLabel(ResManager.getString("RobTicket.txtToStation")); //$NON-NLS-1$
		label_7.setBounds(297, 85, 36, 15);
		panel_1.add(label_7);
		label_7.setHorizontalAlignment(SwingConstants.RIGHT);
		
		txtToStation = new JTextField();
		txtToStation.setToolTipText(ResManager.getString("RobTicket.txtToStationTip")); //$NON-NLS-1$
		txtToStation.setBounds(338, 82, 66, 21);
		panel_1.add(txtToStation);
		txtToStation.setColumns(10);
		
		JLabel label_8 = new JLabel(ResManager.getString("RobTicket.txtPhone")); //$NON-NLS-1$
		label_8.setBounds(10, 57, 61, 15);
		panel_1.add(label_8);
		label_8.setHorizontalAlignment(SwingConstants.RIGHT);
		try {
			mf = new MaskFormatter("###########"); //$NON-NLS-1$
		} catch (ParseException e1) {
			e1.printStackTrace();
		}
		txtPhone = new JFormattedTextField(mf);
		txtPhone.setToolTipText(ResManager.getString("RobTicket.txtPhoneTip")); //$NON-NLS-1$
		txtPhone.setBounds(77, 54, 84, 21);
		panel_1.add(txtPhone);
		txtPhone.setColumns(10);
		
		JLabel label_9 = new JLabel(ResManager.getString("RobTicket.boxoRang")); //$NON-NLS-1$
		label_9.setBounds(260, 57, 73, 15);
		panel_1.add(label_9);
		label_9.setHorizontalAlignment(SwingConstants.RIGHT);
		boxoRang = new JComboBox(Constants.trainRang.keySet().toArray());
		boxoRang.setToolTipText(ResManager.getString("RobTicket.boxoRangTip")); //$NON-NLS-1$
		boxoRang.setBounds(338, 54, 66, 21);
		panel_1.add(boxoRang);
		
		boxkDFirst = new JCheckBox(ResManager.getString("RobTicket.boxkDFirst")); //$NON-NLS-1$
		boxkDFirst.setToolTipText(ResManager.getString("RobTicket.boxkDFirstTip")); //$NON-NLS-1$
		boxkDFirst.setBounds(18, 199, 84, 23);
		frame.getContentPane().add(boxkDFirst);
		
		boxkSleepFirst = new JCheckBox(ResManager.getString("RobTicket.boxkSleepFirst")); //$NON-NLS-1$
		boxkSleepFirst.setToolTipText(ResManager.getString("RobTicket.boxkSleepFirstTip")); //$NON-NLS-1$
		boxkSleepFirst.setBounds(113, 199, 93, 23);
		frame.getContentPane().add(boxkSleepFirst);
		
		boxkIsAuto = new JCheckBox(ResManager.getString("RobTicket.boxkIsAuto")); //$NON-NLS-1$
		boxkIsAuto.setToolTipText(ResManager.getString("RobTicket.boxkIsAutoTip")); //$NON-NLS-1$
		boxkIsAuto.setBounds(219, 199, 133, 23);
		frame.getContentPane().add(boxkIsAuto);
		
		JScrollPane scrollPane = new JScrollPane();
		scrollPane.setViewportBorder(new BevelBorder(BevelBorder.LOWERED, null, null, null, null));
		scrollPane.setHorizontalScrollBarPolicy(ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);
		scrollPane.setBounds(10, 228, 465, 192);
		frame.getContentPane().add(scrollPane);
		
		textArea = new JTextArea();
		scrollPane.setViewportView(textArea);
		textArea.setText(ResManager.getString("RobTicket.textAreaContent")); //$NON-NLS-1$
		textArea.setEditable(false);
		textArea.setLineWrap(true);
		
		btnSORE = new JButton(ResManager.getString("RobTicket.btnSORE")); //$NON-NLS-1$
		btnSORE.setToolTipText(ResManager.getString("RobTicket.btnSORETip")); //$NON-NLS-1$
		btnSORE.setBounds(379, 199, 73, 23);
		frame.getContentPane().add(btnSORE);
		
		JMenuBar menuBar = new JMenuBar();
		menuBar.setBounds(0, 0, 487, 21);
		frame.getContentPane().add(menuBar);
		
		JMenu mnOpt = new JMenu(ResManager.getString("RobTicket.mnOpt")); //$NON-NLS-1$
		menuBar.add(mnOpt);
		
		JMenuItem miOpt = new JMenuItem(ResManager.getString("RobTicket.miOpt")); //$NON-NLS-1$
//		mnOpt.add(miOpt);
		miOpt.addActionListener(new UseSkillAction(frame));
		
		JMenuItem miExit = new JMenuItem(ResManager.getString("RobTicket.miExit")); //$NON-NLS-1$
		mnOpt.add(miExit);
		miExit.addActionListener(new ExitAction());
		
		JMenu mnHelp = new JMenu(ResManager.getString("RobTicket.mnHelp")); //$NON-NLS-1$
		menuBar.add(mnHelp);
		
		JMenuItem miAbout = new JMenuItem(ResManager.getString("RobTicket.miAbout")); //$NON-NLS-1$
		mnHelp.add(miAbout);
		miAbout.addActionListener(new AboutAction(frame));
		
		readUserInfo();
		btnSORE.addActionListener(new StartAction());		
	}

	

	/**
	 * 复位操作
	 */
	public void reset() {
		btnSORE.setText(ResManager.getString("RobTicket.btnSORE")); //$NON-NLS-1$
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
		btnSORE.setText(ResManager.getString("RobTicket.btnSORE.end")); //$NON-NLS-1$
		textArea.setText(""); //$NON-NLS-1$
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
			
			JOptionPane.showMessageDialog(null, ResManager.getString("RobTicket.JOptionPane")); //$NON-NLS-1$
			return;
		}
		
		UserInfo ui = new UserInfo();
		String key = (String) boxoRang.getSelectedItem();
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
		ui.setSeatType("O");ui.setTickType("1"); //$NON-NLS-1$ //$NON-NLS-2$
		ui.setName(name);ui.setPhone(phone);
		ui.setID(id); ui.setCardType("1"); //$NON-NLS-1$
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
			oos = new ObjectOutputStream(new FileOutputStream(new File("ui"))); //$NON-NLS-1$
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
			ois = new ObjectInputStream(new FileInputStream(new File("ui"))); //$NON-NLS-1$
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
	
	/**
	 * 功能描述
	 * @author YAOWENHAO
	 * @since 2011-12-21 
	 * @version 1.0
	 */
	class ExitAction implements ActionListener {
		public void actionPerformed(ActionEvent e) {
			System.exit(0);
		}
	}

	/**
	 * 点击切换验证码
	 * @author YAOWENHAO
	 * @since 2011-12-21 
	 * @version 1.0
	 */
	class RandCodeListener extends MouseAdapter {
		@Override
		public void mouseClicked(MouseEvent e) {
			byte[] image = client.getCodeByte(Constants.LOGIN_CODE_URL);
			String randCodeByRob = OCR.read(image);			
			lblRc.setIcon(new ImageIcon(image));
			txtRandCode.setText(randCodeByRob);
		}
	}

	/**
	 * 开始按钮的监听
	 * @author YAOWENHAO
	 * @since 2011-12-21 
	 * @version 1.0
	 */
	class StartAction implements ActionListener {
		public void actionPerformed(ActionEvent e) {
			JButton btn = (JButton) e.getSource();
			if (ResManager.getString("RobTicket.btnSORE").equals(btn.getText())) { //$NON-NLS-1$
				action();
			} else {
				reset();
			}
		}
	}

	/**
	 * 退出线程
	 * @author YAOWENHAO
	 * @since 2011-12-21 
	 * @version 1.0
	 */
	protected class ExitThread extends Thread {
		public void run() {
			httpClient.getConnectionManager().shutdown();
		}
	}

	/**
	 * 菜单关于窗口
	 * @author YAOWENHAO
	 * @since 2011-12-21 
	 * @version 1.0
	 */
	class AboutAction extends AbstractAction {
		/**字段注释*/
		private static final long serialVersionUID = 1L;
		
		JFrame parentsFrame;
		URL img = ResManager.getFileURL("logo.jpg"); //$NON-NLS-1$
		String imagesrc = "<img src=" + img + " width=\"50\" height=\"50\">"; //$NON-NLS-1$ //$NON-NLS-2$
		String message = Constants.ABOUNT_CONTENT;

		protected AboutAction(JFrame frame) {
			this.parentsFrame = frame;
		}

		public void actionPerformed(ActionEvent e) {
			JOptionPane.showMessageDialog(
			    parentsFrame,			    
			    "<html><center>" + imagesrc + "</center><br><center>" + message + "</center><br></html>", //$NON-NLS-1$ //$NON-NLS-2$ //$NON-NLS-3$
			    ResManager.getString("RobTicket.AboutAction.title"), //$NON-NLS-1$
			    JOptionPane.DEFAULT_OPTION
			);

		}
	}
	/**
	 * 使用技巧 
	 * @author YAOWENHAO
	 * @since 2011-12-21 
	 * @version 1.0
	 */
	class UseSkillAction extends AbstractAction {
		/**字段注释*/
		private static final long serialVersionUID = 1L;
		
		JFrame parentsFrame;
		URL img = ResManager.getFileURL("logo.jpg"); //$NON-NLS-1$
		String imagesrc = "<img src=\"" + img + "\" width=\"50\" height=\"50\">"; //$NON-NLS-1$ //$NON-NLS-2$
		String message = ResManager.getString("RobTicket.UseSkillAction.message"); //$NON-NLS-1$

		protected UseSkillAction(JFrame frame) {
			this.parentsFrame = frame;
		}

		public void actionPerformed(ActionEvent e) {
			JOptionPane.showMessageDialog(
			    parentsFrame,
			    "<html>" + imagesrc + "<br><center>" + message + "</center><br></html>", //$NON-NLS-1$ //$NON-NLS-2$ //$NON-NLS-3$
			    ResManager.getString("RobTicket.UseSkillAction.title"), //$NON-NLS-1$
			    JOptionPane.DEFAULT_OPTION
			);

		}
	}

}
