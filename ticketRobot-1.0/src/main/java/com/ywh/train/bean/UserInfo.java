/**************************************************
 * Filename: UserInfo.java
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

package com.ywh.train.bean;

import java.io.Serializable;



/**
 * 用户信息
 * 
 * @author cafebabe
 * @since 2011-11-27
 * @version 1.0
 */
public class UserInfo implements Serializable {
	/**字段注释*/
	private static final long serialVersionUID = 1L;
	// 账号信息
	private String userName;
	private String password;
	private transient String randCode;
	
	// 乘车人信息
	private String ID;
	private String name;
	private String phone;
	private String rangDate;
	private String fromCity;
	private String toCity;
	private String startDate; // 乘车时间

	private String seatType = "O"; // 座位类型
	private String tickType = "1"; // 车票类型
	private String cardType = "1"; // 证件类型
	private String idMode = "Y";
	
	// 癖好参数
	private boolean boxkDFirst;
	private boolean boxkSleepFirst;
	private boolean boxkIsAuto;
	
	
	
	/**
	 * @return Returns the userName.
	 */
	public String getUserName() {
		return userName;
	}

	/**
	 * @param userName The userName to set.
	 */
	public void setUserName(String userName) {
		this.userName = userName;
	}

	/**
	 * @return Returns the password.
	 */
	public String getPassword() {
		return password;
	}

	/**
	 * @param password The password to set.
	 */
	public void setPassword(String password) {
		this.password = password;
	}

	
	/**
	 * @return Returns the randCode.
	 */
	public String getRandCode() {
		return randCode;
	}

	/**
	 * @param randCode The randCode to set.
	 */
	public void setRandCode(String randCode) {
		this.randCode = randCode;
	}

	/**
	 * @return Returns the iD.
	 */
	public String getID() {
		return ID;
	}

	/**
	 * @param iD The iD to set.
	 */
	public void setID(String iD) {
		ID = iD;
	}

	/**
	 * @return Returns the name.
	 */
	public String getName() {
		return name;
	}

	/**
	 * @param name The name to set.
	 */
	public void setName(String name) {
		this.name = name;
	}

	/**
	 * @return Returns the phone.
	 */
	public String getPhone() {
		return phone;
	}

	/**
	 * @param phone The phone to set.
	 */
	public void setPhone(String phone) {
		this.phone = phone;
	}

	/**
	 * @return Returns the seatType.
	 */
	public String getSeatType() {
		return seatType;
	}

	/**
	 * @param seatType The seatType to set.
	 */
	public void setSeatType(String seatType) {
		this.seatType = seatType;
	}

	/**
	 * @return Returns the tickType.
	 */
	public String getTickType() {
		return tickType;
	}

	/**
	 * @param tickType The tickType to set.
	 */
	public void setTickType(String tickType) {
		this.tickType = tickType;
	}

	/**
	 * @return Returns the cardType.
	 */
	public String getCardType() {
		return cardType;
	}

	/**
	 * @param cardType The cardType to set.
	 */
	public void setCardType(String cardType) {
		this.cardType = cardType;
	}

	/**
	 * @return Returns the idMode.
	 */
	public String getIdMode() {
		return idMode;
	}
	

	/**
	 * @return Returns the fromCity.
	 */
	public String getFromCity() {
		return fromCity;
	}

	/**
	 * @param fromCity The fromCity to set.
	 */
	public void setFromCity(String fromCity) {
		this.fromCity = fromCity;
	}

	/**
	 * @return Returns the toCity.
	 */
	public String getToCity() {
		return toCity;
	}

	/**
	 * @param toCity The toCity to set.
	 */
	public void setToCity(String toCity) {
		this.toCity = toCity;
	}

	/**
	 * @return Returns the rangDate.
	 */
	public String getRangDate() {
		return rangDate;
	}

	/**
	 * @param rangDate The rangDate to set.
	 */
	public void setRangDate(String rangDate) {
		this.rangDate = rangDate;
	}

	/**
	 * @return Returns the startDate.
	 */
	public String getStartDate() {
		return startDate;
	}

	/**
	 * @param startDate The startDate to set.
	 */
	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	/**
	 * @param idMode The idMode to set.
	 */
	public void setIdMode(String idMode) {
		this.idMode = idMode;
	}

	
	public boolean isBoxkDFirst() {
		return boxkDFirst;
	}

	public void setBoxkDFirst(boolean boxkDFirst) {
		this.boxkDFirst = boxkDFirst;
	}

	public boolean isBoxkSleepFirst() {
		return boxkSleepFirst;
	}

	public void setBoxkSleepFirst(boolean boxkSleepFirst) {
		this.boxkSleepFirst = boxkSleepFirst;
	}

	public boolean isBoxkIsAuto() {
		return boxkIsAuto;
	}

	public void setBoxkIsAuto(boolean boxkIsAuto) {
		this.boxkIsAuto = boxkIsAuto;
	}

	public String getText() {
		StringBuilder builder = new StringBuilder();
		builder.append(seatType).append(",").append(tickType).append(",")
				.append(getSimpleText()).append(",").append(idMode);
		return builder.toString();
	}
	
	public String getSimpleText() {
		StringBuilder builder = new StringBuilder();
		builder.append(name).append(",").append(cardType)
		.append(",").append(ID).append(",").append(phone);
		return builder.toString();
	}

	/**
	 * override 方法
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("UserInfo [ID=").append(ID).append(", name=")
				.append(name).append(", phone=").append(phone)
				.append(", rangDate=").append(rangDate).append(", startDate=")
				.append(startDate).append(", seatType=").append(seatType)
				.append(", tickType=").append(tickType).append(", cardType=")
				.append(cardType).append(", idMode=").append(idMode)
				.append("]");
		return builder.toString();
	}

	

}
