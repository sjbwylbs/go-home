/**************************************************
 * Filename: Util.java
 * Version: v1.0
 * CreatedDate: 2011-11-24
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

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Vector;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.htmlparser.Attribute;
import org.htmlparser.Parser;
import org.htmlparser.Tag;
import org.htmlparser.util.ParserException;
import org.htmlparser.visitors.NodeVisitor;

/**
 * 功能描述
 * 
 * @author cafebabe
 * @since 2011-11-24
 * @version 1.0
 */
public class Util {
	private static Map<String, String> cityName2Code = new HashMap<String, String>();
	static {		
		String city[] = Constants.CITYS.split("@");
		for (String tmp : city) {
			if (tmp.isEmpty()) continue;
			String temp[] = tmp.split("\\|");
			cityName2Code.put(temp[1], temp[2]);
		}
	}
	public final static String DEFAULT_PATTERN = "yyyy-MM-dd HH:mm:ss";
	public static final String DATE_PART_FORMAT = "yyyy-MM-dd";
	public static final String TIME_PART_FORMAT = "HH:mm:ss.SSS";

//	public final static DateFormat default_datetime_format = new SimpleDateFormat(
//			DEFAULT_PATTERN);
	public final static DateFormat default_date_format = new SimpleDateFormat(
			DATE_PART_FORMAT);
//	public final static DateFormat default_time_format = new SimpleDateFormat(
//			TIME_PART_FORMAT);

	/**
	 * 返回当前日期时间
	 * 
	 * @return e.g. 2006-06-06 12:12:50
	 */
	public static String getCurDateTime() {
		return getCurDateTime(DEFAULT_PATTERN);
	}
	
	/**
	 * 返回当前日期
	 * @return e.g. 2006-06-06
	 */
	public static String getCurDate() {
		return getCurDateTime(DATE_PART_FORMAT);
	}
	
	/**
	 * 根据给定的格式返回当前日期或时间
	 * @param formatStr
	 * @return
	 */
	public static String getCurDateTime(String formatStr) {
		SimpleDateFormat sdf = new SimpleDateFormat(formatStr);
		String now = sdf.format(new Date());
		return now;
	}

	
	public static String getCityCode(String cityName) {
		return cityName2Code.get(cityName);
	}
	
	/**
	 * 查询返回字符对象化
	 * @param response
	 * @return
	 */
 	public static List<TrainQueryInfo> parserQueryInfo(String response) {
		List<TrainQueryInfo> tqis = new ArrayList<TrainQueryInfo>();
		response = response.replaceAll("&nbsp;", "");
		String st[] = response.split(",");
		for (int i = 0; i < st.length;) {
			if (st[i].trim().startsWith("<span")) {
				TrainQueryInfo tqi = new TrainQueryInfo();
				String info1 = st[i++];
				try {
					parserSpan(info1, tqi);
				
				String temp2[] = st[i++].split("<br>");
				if (temp2[0].startsWith("<img")) {
					tqi.setFromStation(temp2[0].split(">")[1]);
				} else {
					tqi.setFromStation(temp2[0]);
				}
				tqi.setStartTime(temp2[1]);
				String temp3[] = st[i++].split("<br>");
				if (temp3[0].startsWith("<img")) {
					tqi.setToStation(temp3[0].split(">")[1]);
				} else {
					tqi.setToStation(temp3[0]);
				}
				tqi.setEndTime(temp3[1]);
				tqi.setTakeTime(st[i++]);
				tqi.setBuss_seat(parserFont(st[i++]));
				tqi.setBest_seat(parserFont(st[i++]));
				tqi.setOne_seat(parserFont(st[i++]));
				tqi.setTwo_seat(parserFont(st[i++]));
				tqi.setVag_sleeper(parserFont(st[i++]));
				tqi.setSoft_sleeper(parserFont(st[i++]));
				tqi.setHard_sleeper(parserFont(st[i++]));
				tqi.setSoft_seat(parserFont(st[i++]));
				tqi.setHard_seat(parserFont(st[i++]));
				tqi.setNone_seat(parserFont(st[i++]));
				tqi.setOther_seat(parserFont(st[i++]));
				} catch (ParserException e) {
					e.printStackTrace();
				}
				tqis.add(tqi);
			} else {
				i++;
			}
		}
		return tqis;
	}

	/**
	 * 解析font节点
	 * @param font
	 * @return
	 * @throws ParserException
	 */
	private static String parserFont(String font) throws ParserException {
		String ans = font;
		if (font.startsWith("<font")) {
			int beginIndex = font.indexOf("'>");
			int endIndex = font.indexOf("</");
			ans = font.substring(beginIndex+2, endIndex);
		} 
		
		return ans;
	}

	/**
	 * 解析span节点
	 * @param responseBody
	 * @param tqi
	 * @throws ParserException
	 */
	private static void parserSpan(String responseBody, final TrainQueryInfo tqi)
			throws ParserException {
		Parser parser = new Parser();
		parser.setInputHTML(responseBody);
		NodeVisitor visitor = new NodeVisitor() {
			public void visitTag(Tag tag) {
				tqi.setTrainNo(tag.getChildren().toHtml());
				Vector<?> atts = tag.getAttributesEx();
				for (int i = 0; i < atts.size(); i++) {
					Attribute att = (Attribute) atts.get(i);
					String name = att.getName();
					if ("onmouseover".equals(name)) {
						String temp[] = att.getValue().split("'");
						String subTemp[] = temp[1].split("#");
						tqi.setTrainCode(subTemp[0]);
						tqi.setFromStationCode(subTemp[1]);
						tqi.setToStationCode(subTemp[2]);
					}
				}
			}
		};
		parser.visitAllNodesWith(visitor);
	}

	/**
	 * 移除html标签
	 * @param content
	 * @return
	 */
	public static String removeTagFromHtml(String content) {
		//定义script的正则表达式{或<script[^>]*?>[\\s\\S]*?<\\/script> } 
		String regEx_script = "<[\\s]*?script[^>]*?>[\\s\\S]*?<[\\s]*?\\/[\\s]*?script[\\s]*?>";
		//定义style的正则表达式{或<style[^>]*?>[\\s\\S]*?<\\/style> } 
		String regEx_style = "<[\\s]*?style[^>]*?>[\\s\\S]*?<[\\s]*?\\/[\\s]*?style[\\s]*?>"; 
		//定义HTML标签的正则表达式 
		String regEx_html = "<[^>]+>"; 

		String temp = content;
		if (content == null || content.isEmpty()) {
			return "ERROR";
		}
		// 去除js
		temp = temp.replaceAll(regEx_script, "");
		// 去除style
		temp = temp.replaceAll(regEx_style, "");
		// 去除html
		temp = temp.replaceAll(regEx_html, "");
		// 合并空格
		temp = temp.replaceAll("\\s+", " ");
		
		return temp.trim();
	}
	
	public static String getMessageFromHtml(String content) {
		String regEx_msg = "[\\s]*?var\\s+message\\s+=\\s+\"([\\S]*?)\"";
		if (content == null) {
			return "ERROR";
		}
		String temp = content.trim();
		Pattern p = null;
		Matcher m = null;
		p = Pattern.compile(regEx_msg);
		m = p.matcher(temp);
		try {
			while (m.find()) {
				temp = m.group(1);
				break;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return temp;
	}
	
	public static int getHour2Min(String hour) {
		int min = 0;
		String hm[] = hour.split(":");
		if (hm.length < 2) {
			min = Integer.parseInt(hour);
		} else {		
			int h = Integer.parseInt(hm[0]) * 60;
			int m = Integer.parseInt(hm[1]);
			min = h + m;
		}
		return min;
	}
	
	/**
	 * 选座算法
	 * @param train
	 * @return
	 */
	public static String getSeatAI(TrainQueryInfo train) {
		if (Constants.ISSLEEPFIRST) {
			if (Constants.getTrainSeat(train.getHard_sleeper()) > 0) {
				return Constants.HARD_SLEEPER;
			}
			if (Constants.getTrainSeat(train.getSoft_sleeper()) > 0) {
				return Constants.SOFT_SLEEPER;
			}
		}
		
		if (Constants.getTrainSeat(train.getTwo_seat())  > 0) {
			return Constants.TWO_SEAT;
		}
		
		if (Constants.getTrainSeat(train.getOne_seat())  > 0) {
			return Constants.ONE_SEAT;
		}
		
		if (Constants.getTrainSeat(train.getHard_seat())  > 0) {
			return Constants.HARD_SEAT;
		}
		
		if (Constants.getTrainSeat(train.getHard_sleeper())  > 0) {
			return Constants.HARD_SLEEPER;
		}
		
		if (Constants.getTrainSeat(train.getNone_seat())  > 0) {
			if (train.getTrainNo().startsWith(Constants.TRAIN_D)) {
				return Constants.TWO_SEAT;
			}
			return Constants.HARD_SEAT;
		}
		
		if (Constants.getTrainSeat(train.getSoft_sleeper()) > 0) {
			return Constants.SOFT_SLEEPER;
		}
		
		if (Constants.getTrainSeat(train.getVag_sleeper()) > 0) {
			return Constants.VAG_SLEEPER;
		}
		
		return null;
	}
	
	public static String formatInfo(String info) {
		return getCurDateTime() + " : " + info + "\n";
	}
	
// 	public static void main(String[] args) {
//		System.out.println(getCityCode("太原"));
//		System.out.println(getHour2Min("09:13"));
//	}
}
