/**************************************************
 * Filename: TrainQueryInfo.java
 * Version: v1.0
 * CreatedDate: 2011-11-23
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
 * 功能描述
 * 
 * @author cafebabe
 * @since 2011-11-23
 * @version 1.0
 */
public class TrainQueryInfo {
	/**
	 * 功能描述
	 * @author cafebabe
	 * @since 2011-11-27 
	 * @version 1.0
	 */
	private String trainCode;// 序号
	private String trainNo; // 车次
	// private String codeLink; // 车次链接
	private String fromStation;// 发站
	private String fromStationCode; // 发站code
	private String startTime;// 发时
	private String toStation;// 到站
	private String toStationCode;// 到站code
	private String endTime; // 到时
	private String takeTime;// 历时

	private String buss_seat; // 商务座
	private String best_seat;// 特等座(余票)
	private String one_seat;// 一等座(余票)
	private String two_seat;// 二等座(余票)
	private String vag_sleeper;// 高级软卧(余票)
	private String soft_sleeper;// 软卧(余票)
	private String hard_sleeper;// 硬卧(余票)
	private String soft_seat;// 软座(余票)
	private String hard_seat;// 硬座(余票)
	private String none_seat;// 无座(余票)
	private String other_seat;// 其他
	
	public String getTrainCode() {
		return trainCode;
	}
	public void setTrainCode(String trainCode) {
		this.trainCode = trainCode;
	}
	public String getTrainNo() {
		return trainNo;
	}
	public void setTrainNo(String trainNo) {
		this.trainNo = trainNo;
	}
	public String getFromStation() {
		return fromStation;
	}
	public void setFromStation(String fromStation) {
		this.fromStation = fromStation;
	}
	public String getFromStationCode() {
		return fromStationCode;
	}
	public void setFromStationCode(String fromStationCode) {
		this.fromStationCode = fromStationCode;
	}
	public String getStartTime() {
		return startTime;
	}
	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}
	public String getToStation() {
		return toStation;
	}
	public void setToStation(String toStation) {
		this.toStation = toStation;
	}
	public String getToStationCode() {
		return toStationCode;
	}
	public void setToStationCode(String toStationCode) {
		this.toStationCode = toStationCode;
	}
	public String getEndTime() {
		return endTime;
	}
	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}
	public String getTakeTime() {
		return takeTime;
	}
	public void setTakeTime(String takeTime) {
		this.takeTime = takeTime;
	}
	public String getBuss_seat() {
		return buss_seat;
	}
	public void setBuss_seat(String buss_seat) {
		this.buss_seat = buss_seat;
	}
	public String getBest_seat() {
		return best_seat;
	}
	public void setBest_seat(String best_seat) {
		this.best_seat = best_seat;
	}
	public String getOne_seat() {
		return one_seat;
	}
	public void setOne_seat(String one_seat) {
		this.one_seat = one_seat;
	}
	public String getTwo_seat() {
		return two_seat;
	}
	public void setTwo_seat(String two_seat) {
		this.two_seat = two_seat;
	}
	public String getVag_sleeper() {
		return vag_sleeper;
	}
	public void setVag_sleeper(String vag_sleeper) {
		this.vag_sleeper = vag_sleeper;
	}
	public String getSoft_sleeper() {
		return soft_sleeper;
	}
	public void setSoft_sleeper(String soft_sleeper) {
		this.soft_sleeper = soft_sleeper;
	}
	public String getHard_sleeper() {
		return hard_sleeper;
	}
	public void setHard_sleeper(String hard_sleeper) {
		this.hard_sleeper = hard_sleeper;
	}
	public String getSoft_seat() {
		return soft_seat;
	}
	public void setSoft_seat(String soft_seat) {
		this.soft_seat = soft_seat;
	}
	public String getHard_seat() {
		return hard_seat;
	}
	public void setHard_seat(String hard_seat) {
		this.hard_seat = hard_seat;
	}
	public String getNone_seat() {
		return none_seat;
	}
	public void setNone_seat(String none_seat) {
		this.none_seat = none_seat;
	}
	public String getOther_seat() {
		return other_seat;
	}
	public void setOther_seat(String other_seat) {
		this.other_seat = other_seat;
	}
	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("TrainQueryInfo [trainCode=");
		builder.append(trainCode);
		builder.append(", trainNo=");
		builder.append(trainNo);
		builder.append(", fromStation=");
		builder.append(fromStation);
		builder.append(", fromStationCode=");
		builder.append(fromStationCode);
		builder.append(", startTime=");
		builder.append(startTime);
		builder.append(", toStation=");
		builder.append(toStation);
		builder.append(", toStationCode=");
		builder.append(toStationCode);
		builder.append(", endTime=");
		builder.append(endTime);
		builder.append(", takeTime=");
		builder.append(takeTime);
		builder.append(", buss_seat=");
		builder.append(buss_seat);
		builder.append(", best_seat=");
		builder.append(best_seat);
		builder.append(", one_seat=");
		builder.append(one_seat);
		builder.append(", two_seat=");
		builder.append(two_seat);
		builder.append(", vag_sleeper=");
		builder.append(vag_sleeper);
		builder.append(", soft_sleeper=");
		builder.append(soft_sleeper);
		builder.append(", hard_sleeper=");
		builder.append(hard_sleeper);
		builder.append(", soft_seat=");
		builder.append(soft_seat);
		builder.append(", hard_seat=");
		builder.append(hard_seat);
		builder.append(", none_seat=");
		builder.append(none_seat);
		builder.append(", other_seat=");
		builder.append(other_seat);
		builder.append("]");
		return builder.toString();
	}

	
}
