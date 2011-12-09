package com.ywh.train;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import javax.swing.ImageIcon;
import javax.swing.JFrame;
import javax.swing.JLabel;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URLEncodedUtils;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HTTP;
import org.apache.log4j.Logger;

/**
 * HttpClient 4 使用POST方式提交普通表单数据的例子.
 * 
 */
public class TrainClient {
	Logger log = Logger.getLogger(getClass());
	private HttpClient httpclient = null;
	
	/**
	 * 构造函数 
	 */
	public TrainClient(HttpClient client) {
		this.httpclient = client;
	}

	/**
	 * 获取令牌
	 * @return
	 */
	 
	String getToken() {
		log.debug("-------------------get token start-------------------");
		HttpGet get = new HttpGet(Constants.GET_TOKEN_URL);
		String token = null;
		try {
			HttpResponse response = httpclient.execute(get);
			HttpEntity entity = response.getEntity();
			BufferedReader br = new BufferedReader(new InputStreamReader(
					entity.getContent()));
			String line = null;			
			while ((line = br.readLine()) != null) {
				if (line.indexOf("org.apache.struts.taglib.html.TOKEN") > -1) {
					token = line;
				}
			}
		} catch (Exception e) {
			log.error(e);
		} 
		if (token != null) {
			int start = token.indexOf("value=\"");
			int end = token.indexOf("\"></div>");
			token = token.substring(start + 7, end);
		} else {
			log.warn("book tikte error, can't get token!");
		}
		log.debug("TOKEN = " + token);
		log.debug("-------------------get token end-------------------");
		return token;
	}

	/** 
	 * 预订车票

	 * @param rangDate
	 * @param startDate
	 * @param train
	 * @return
	 */
	public Result book(String rangDate, String startDate, TrainQueryInfo train) {		
		log.debug("-------------------book start-------------------");
		Result rs = new Result();
		HttpPost post = new HttpPost(Constants.BOOK_URL);
		List<NameValuePair> formparams = new ArrayList<NameValuePair>();
		formparams.add(new BasicNameValuePair("from_station_telecode", train.getFromStationCode())); //"AOH"
		formparams.add(new BasicNameValuePair("from_station_telecode_name",	train.getFromStation()));//"上海"
		formparams.add(new BasicNameValuePair("include_student", "00"));
		formparams.add(new BasicNameValuePair("lishi", "" + Util.getHour2Min(train.getTakeTime()))); //"553"
		formparams.add(new BasicNameValuePair("round_start_time_str", rangDate)); //"00:00--24:00"
		formparams.add(new BasicNameValuePair("round_train_date", Util.getCurDate())); //"2011-11-23"
		formparams.add(new BasicNameValuePair("seattype_num", ""));
		formparams.add(new BasicNameValuePair("single_round_type", "1"));
		formparams.add(new BasicNameValuePair("start_time_str", rangDate)); //"00:00--24:00"
		formparams.add(new BasicNameValuePair("station_train_code",	train.getTrainCode())); //"5l0000D10502"
		formparams.add(new BasicNameValuePair("to_station_telecode", train.getToStationCode())); //"CSQ"
		formparams.add(new BasicNameValuePair("to_station_telecode_name", train.getToStation())); //"长沙"
		formparams.add(new BasicNameValuePair("train_class_arr", "QB#D#Z#T#K#QT#"));
		formparams.add(new BasicNameValuePair("train_date", startDate)); //"2011-11-28"
		formparams.add(new BasicNameValuePair("train_pass_type", "QB"));
		formparams.add(new BasicNameValuePair("train_start_time", train.getStartTime())); //"09:08"
		try {
			UrlEncodedFormEntity uef = new UrlEncodedFormEntity(formparams, HTTP.UTF_8);
			post.setEntity(uef);
			HttpResponse response = httpclient.execute(post);
			HttpEntity entity = response.getEntity();
			
			log.debug(response.getStatusLine());
			
			BufferedReader br = new BufferedReader(new InputStreamReader(
					entity.getContent()));
			while ((br.readLine()) != null) {		
//				System.out.println(line);
			}
			rs.setState(Result.SUCC);
			rs.setMsg(response.getStatusLine().toString());
		} catch (Exception e) {
			log.error(e);
		}
		log.debug("-------------------book end-------------------");
		return rs;
		
	}

	/**
	 * 提交订单
	 * 功能描述
	 * @param randCode
	 * @param token
	 * @param user
	 * @param train
	 * @return
	 */
	public Result submiOrder(String randCode, String token, UserInfo user, TrainQueryInfo train) {
		log.debug("-------------------submit order start-------------------");
		Result rs = new Result();
		HttpPost post = new HttpPost(Constants.SUBMIT_URL);
		List<NameValuePair> formparams = new ArrayList<NameValuePair>();
		formparams.add(new BasicNameValuePair("checkbox0", "0"));
		formparams.add(new BasicNameValuePair("checkbox9", "Y"));
		formparams.add(new BasicNameValuePair("checkbox9", "Y"));
		formparams.add(new BasicNameValuePair("checkbox9", "Y"));
		formparams.add(new BasicNameValuePair("checkbox9", "Y"));
		formparams.add(new BasicNameValuePair("checkbox9", "Y"));
		formparams.add(new BasicNameValuePair("oldPassengers", user.getSimpleText())); //"邬建功,1,500383197108186415"
		formparams.add(new BasicNameValuePair("oldPassengers", ""));
		formparams.add(new BasicNameValuePair("oldPassengers", ""));
		formparams.add(new BasicNameValuePair("oldPassengers", ""));
		formparams.add(new BasicNameValuePair("oldPassengers", ""));
		formparams.add(new BasicNameValuePair("orderRequest.bed_level_order_num", "000000000000000000000000000000"));
		formparams.add(new BasicNameValuePair("orderRequest.cancel_flag", "1"));
		formparams.add(new BasicNameValuePair("orderRequest.end_time", train.getEndTime())); //"18:21"
		formparams.add(new BasicNameValuePair("orderRequest.from_station_name",	train.getFromStation())); //"上海虹桥"
		formparams.add(new BasicNameValuePair("orderRequest.from_station_telecode", train.getFromStationCode())); //"AOH"
		formparams.add(new BasicNameValuePair("orderRequest.id_mode", user.getIdMode())); //"Y"
		formparams.add(new BasicNameValuePair("orderRequest.reserve_flag", "A"));
		formparams.add(new BasicNameValuePair("orderRequest.seat_type_code", ""));
		formparams.add(new BasicNameValuePair("orderRequest.start_time", train.getStartTime()));//"09:08"
		formparams.add(new BasicNameValuePair("orderRequest.station_train_code", train.getTrainNo())); //"D105"
		formparams.add(new BasicNameValuePair("orderRequest.ticket_type_order_num", ""));
		formparams.add(new BasicNameValuePair("orderRequest.to_station_name", train.getToStation())); //"长沙"
		formparams.add(new BasicNameValuePair("orderRequest.to_station_telecode", train.getToStationCode())); //"CSQ"
		formparams.add(new BasicNameValuePair("orderRequest.train_date", user.getStartDate()));  //"2011-11-28"
		formparams.add(new BasicNameValuePair("orderRequest.train_no", train.getTrainCode())); // "5l0000D10502"
		formparams.add(new BasicNameValuePair("org.apache.struts.taglib.html.TOKEN", token));
		formparams.add(new BasicNameValuePair("passengerTickets", user.getText())); //"O,1,邬建功,1,500383197108186415,15021553714,Y"
		formparams.add(new BasicNameValuePair("passenger_1_cardno",	user.getID())); //"500383197108186415"
		formparams.add(new BasicNameValuePair("passenger_1_cardtype", user.getCardType())); //"1"
		formparams.add(new BasicNameValuePair("passenger_1_mobileno", user.getPhone())); //"15021553714"
		formparams.add(new BasicNameValuePair("passenger_1_name", user.getName())); //"邬建功"
		formparams.add(new BasicNameValuePair("passenger_1_seat", user.getSeatType())); //"O"
		formparams.add(new BasicNameValuePair("passenger_1_ticket", user.getTickType())); //"1"
		formparams.add(new BasicNameValuePair("randCode", randCode));
		formparams.add(new BasicNameValuePair("textfield", "中文或拼音首字母"));
		String responseBody = null;
		try {
			UrlEncodedFormEntity uef = new UrlEncodedFormEntity(formparams, HTTP.UTF_8);
			post.setEntity(uef);
			ResponseHandler<String> responseHandler = new BasicResponseHandler();
			responseBody = httpclient.execute(post, responseHandler);
		} catch (Exception e) {
			log.error(e);
		} 
		String ans = Util.getMessageFromHtml(responseBody);
		if (ans.isEmpty()) {
			rs.setState(Result.SUCC);
			rs.setMsg("好像订票成功了");
		} else {
			if (ans.contains("由于您取消次数过多")) {
				rs.setState(Result.CANCEL_TIMES_TOO_MUCH);
				rs.setMsg(ans);
			} else if (ans.contains("验证码不正确")){
				rs.setState(Result.RAND_CODE_ERROR);
				rs.setMsg(ans);
			} else if (ans.contains("售票实行实名制")){
				rs.setState(Result.REPEAT_BUY_TICKET);
				rs.setMsg(ans);
			} else if (ans.contains("号码输入有误")) {
				rs.setState(Result.ERROR_CARD_NUMBER);
				rs.setMsg(ans);
			} else {
				rs.setState(Result.OTHER);	
				rs.setMsg(ans);
			}
		}
		log.debug(ans);		
		log.debug("-------------------submit order end-------------------");
		return rs;
	}

	/**
	 * 查询列车信息
	 * @param from
	 * @param to
	 * @param startDate
	 * @param rangDate
	 * @return
	 */
	public List<TrainQueryInfo> queryTrain(String from, String to, String startDate, String rangDate) {
		log.debug("-------------------query train start-------------------");
		if (rangDate == null || rangDate.isEmpty()) {
			rangDate = "00:00--24:00";
		}
		List<NameValuePair> parameters = new ArrayList<NameValuePair>();
		parameters.add(new BasicNameValuePair("method", "queryLeftTicket"));
		parameters.add(new BasicNameValuePair("includeStudent", "00"));
		parameters.add(new BasicNameValuePair("orderRequest.from_station_telecode", Util.getCityCode(from)));
		parameters.add(new BasicNameValuePair("orderRequest.start_time_str", rangDate));
		parameters.add(new BasicNameValuePair("orderRequest.to_station_telecode", Util.getCityCode(to)));
		parameters.add(new BasicNameValuePair("orderRequest.train_date", startDate));
		parameters.add(new BasicNameValuePair("orderRequest.train_no", ""));
		parameters.add(new BasicNameValuePair("seatTypeAndNum", ""));
		parameters.add(new BasicNameValuePair("trainClass", "QB#D#Z#T#K#QT#"));
		parameters.add(new BasicNameValuePair("trainPassType", "QB"));
		HttpGet get = new HttpGet(Constants.QUERY_TRAIN_URL + URLEncodedUtils.format(parameters, HTTP.UTF_8));
		ResponseHandler<String> responseHandler = new BasicResponseHandler();
		String responseBody = null;
		try {
			responseBody = httpclient.execute(get, responseHandler);
		} catch (Exception e) {
			log.error(e);
		}
		List<TrainQueryInfo> all = Util.parserQueryInfo(responseBody); 
		for(TrainQueryInfo tInfo : all) {
			log.debug(tInfo);
		}
		log.debug("-------------------query train end-------------------");
		return all;
		
	}

	/**
	 * 登录
	 * @param username
	 * @param password
	 * @param randCode
	 * @return
	 */
	
	public Result login(String username, String password, String randCode) {
		log.debug("-----------------login start-----------------------");
		Result rs = new Result();
		HttpPost httppost = new HttpPost(Constants.LOGIN_URL);
		List<NameValuePair> parameters = new ArrayList<NameValuePair>();
		parameters.add(new BasicNameValuePair("method", "login"));
		parameters.add(new BasicNameValuePair("loginUser.user_name", username));
		parameters.add(new BasicNameValuePair("nameErrorFocus", ""));
		parameters.add(new BasicNameValuePair("passwordErrorFocus", ""));
		parameters.add(new BasicNameValuePair("randCode", randCode));
		parameters.add(new BasicNameValuePair("randErrorFocus", ""));
		parameters.add(new BasicNameValuePair("user.password", password));
		String responseBody = null;
		try {
			UrlEncodedFormEntity uef = new UrlEncodedFormEntity(parameters, HTTP.UTF_8);
			httppost.setEntity(uef);
			ResponseHandler<String> responseHandler = new BasicResponseHandler();
			responseBody = httpclient.execute(httppost, responseHandler);
		} catch (Exception e) {
			log.error(e);
		}
		String info = Util.removeTagFromHtml(responseBody);
		if (info.contains("您最后一次登录时间为")) {
			int index = info.indexOf("-->");
			log.debug(info.substring(index + 4));
			rs.setState(Result.SUCC);
			rs.setMsg("用户:"  + username + " 登录成功");
		} else {
			log.warn("用户:"  + username + " 登录失败");
			log.warn(info);
			rs.setState(Result.FAIL);
			rs.setMsg("用户:"  + username + " 登录失败");
		}
		log.debug("-------------------login end---------------------");
		return rs;
	}

	/**
	 * 查询预订信息
	 * 
	 * @param httpclient
	 * @throws IOException
	 * @throws ClientProtocolException
	 */
	public Result queryOrder() {		
		log.debug("-------------------query order start-------------------");
		Result rs = new Result();
		HttpGet httpget = new HttpGet(Constants.QUERY_ORDER_URL);
		StringBuilder responseBody = new StringBuilder();
		try {
			HttpResponse response = httpclient.execute(httpget);
			HttpEntity entity = response.getEntity();
			BufferedReader br = new BufferedReader(new InputStreamReader(
					entity.getContent()));
			String line = null;
			while ((line = br.readLine()) != null) {
				responseBody.append(line);
			}
		} catch (Exception e) {
			log.error(e);
		}
		String msg = Util.removeTagFromHtml(responseBody.toString());
		if (!msg.isEmpty()) {
			int index = msg.indexOf("-->");
			msg = msg.substring(index + 4);
			String[] allInfo = msg.split("！");
			if (allInfo.length > 1) {
				String usefulInfo = allInfo[1];
				if (usefulInfo.contains("待支付")) {
					rs.setState(Result.HAVE_NO_PAY_TICKET);
					String[] detail = allInfo[1].split("-->");
					rs.setMsg(detail[0] + detail[1]);
				} else if (usefulInfo.contains("取消次数过多")) {
					rs.setState(Result.CANCEL_TIMES_TOO_MUCH);
					rs.setMsg(usefulInfo);
				} else {
					rs.setMsg(usefulInfo);
				}
			} else {
				rs.setState(Result.NO_BOOKED_TICKET);
				rs.setMsg(msg);
			}
		} else {
			rs.setMsg(msg);
		}
		log.debug("-------------------query order end---------------------");
		return rs;
	}

	/**
	 * 弹窗显示指定url的验证码并手工输入
	 * @param url
	 * @return
	 * @throws IOException
	 */
	
	String getCode(String url) throws IOException {
		JFrame frame = new JFrame("验证码");
		JLabel label = new JLabel(new ImageIcon(getCodeByte(url)),
				JLabel.CENTER);
		frame.add(label);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.setSize(300, 200);
		frame.setLocationRelativeTo(null);
		frame.setVisible(true);
		InputStreamReader isr = new InputStreamReader(System.in);
		BufferedReader br = new BufferedReader(isr);
		String rd = br.readLine();
		frame.dispose();
		return rd;
	}

	/**
	 * 获取指定url的验证码图片字节信息
	 * @param url
	 * @return
	 */
	
	public byte[] getCodeByte(String url) {
		log.debug("-------------------get randcode start-------------------");
		HttpGet get = new HttpGet(url);
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		try {
			HttpResponse response = httpclient.execute(get);
			HttpEntity entity = response.getEntity();
			log.debug(response.getStatusLine());
			if (entity != null) {
				InputStream is = entity.getContent();
				byte[] buf = new byte[1024];
				int len = -1;
				while ((len = is.read(buf)) > -1) {
					baos.write(buf, 0, len);
				}
			}
		} catch (Exception e) {
			log.error(e);
		}
		log.debug("-------------------get randcode end-------------------");
		return baos.toByteArray();
	}
	
//	public final static void main(String[] args) throws Exception {
//
//		DefaultHttpClient dhc = new DefaultHttpClient();
//		try {
//			UserInfo ui = new UserInfo();
//			ui.setUserName("sg000001"); ui.setPassword("258456");
//			ui.setStartDate("2011-11-30"); ui.setRangDate("18:00--24:00");
//			ui.setFromCity("上海"); ui.setToCity("苏州"); 
//			ui.setSeatType("O");ui.setTickType("1");
//			ui.setName("邬建功");ui.setPhone("15021553714");
//			ui.setID("500383197108186415"); ui.setCardType("1");
//			
//			TrainClient client = new TrainClient(dhc);
//			Result rs = new Result();
//			rs.setState(true);
//			String randCode = client.getCode(Constant.LOGIN_CODE_URL);
////			System.out.println("开始登陆");
////			rs = client.login("sg000001","258456", randCode);
////			System.out.println(rs);
//			if (rs.isOK()) {
//				System.out.println("正在查询");
//				List<TrainQueryInfo> allTrain = client.queryTrain(ui.getFromCity(), ui.getToCity(), ui.getStartDate(), ui.getRangDate());
//				if (allTrain.size() == 0) {
//					rs.setState(false);
//					rs.setMsg("未找到从"+ui.getFromCity()+"到"+ui.getToCity()+"的可预订列车信息");
//					System.out.println(rs);
//					return;
//				} else {
//					rs.setState(true);
//					Collections.sort(allTrain, new TrainComparator());
//					for (TrainQueryInfo ti : allTrain) {
//						System.out.println(ti);
//					}
//					rs.setMsg(ui.getStartDate() + "共找到从"+ui.getFromCity()+"到"+ui.getToCity()+"的可预订列车" + allTrain.size() +"趟");
//					System.out.println(rs);
//				}
////				TrainQueryInfo train = allTrain.get(0);
////				ui.setSeatType(Util.getSeatAI(train));
////				System.out.println("查询历史订单");
////				rs = client.queryOrder();
////				System.out.println(rs);
////				
////				System.out.println("开始预定");
////				rs = client.book(ui.getRangDate(), ui.getStartDate(), train);
////				System.out.println(rs);
////				randCode = client.getCode(Constant.ORDER_CODE_URL);
////				String token = client.getToken();
////				System.out.println("提交订单");
////				rs = client.submiOrder(randCode, token, ui, train);
////				System.out.println(rs);
////				System.out.println("查询订单");
////				rs = client.queryOrder();
////				System.out.println(rs);
//			}
//		} catch (Exception e) {
//			e.printStackTrace();
//		} finally {
//			dhc.getConnectionManager().shutdown();
//		}
//	}

}