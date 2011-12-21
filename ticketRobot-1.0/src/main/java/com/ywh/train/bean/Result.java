/**************************************************
 * Filename: Result.java
 * Version: v1.0
 * CreatedDate: 2011-11-26
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
 
package com.ywh.train.bean;

/**
 * 请求返回结果
 * @author cafebabe
 * @since 2011-11-26 
 * @version 1.0
 */
public class Result {
	public final static byte SUCC = 100;
	public final static byte FAIL = 101;
	public final static byte OTHER = 103;
	public final static byte RAND_CODE_ERROR = 104;	
	
	public final static byte NO_BOOKED_TICKET = 11;
	public final static byte HAVE_NO_PAY_TICKET = 12;
	public final static byte CANCEL_TIMES_TOO_MUCH = 13;
	public final static byte REPEAT_BUY_TICKET = 14;
	public final static byte ERROR_CARD_NUMBER = 15;
	
	private byte state = FAIL; // 请求处理状态 
	private String msg = "未知错误"; // 有效提示信息

	public byte getState() {
		return state;
	}
	
	public void setState(byte state) {
		this.state = state;
	}
	
	/**
	 * @return Returns the msg.
	 */
	public String getMsg() {
		return msg;
	}
	/**
	 * @param msg The msg to set.
	 */
	public void setMsg(String msg) {
		this.msg = msg;
	}
	
	/**
	 * override 方法
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("Result [state=").append(state).append(", msg=")
				.append(msg).append("]");
		return builder.toString();
	}
	
	
}
