/**************************************************
 * Filename: TrainComparator.java
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

package com.ywh.train.logic;

import java.util.Comparator;

import com.ywh.train.Constants;
import com.ywh.train.Util;
import com.ywh.train.bean.TrainQueryInfo;

/**
 * 列车排序
 * 
 * @author cafebabe
 * @since 2011-11-27
 * @version 1.0
 */
public class TrainComparator implements Comparator<TrainQueryInfo> {

	/**
	 * override 方法
	 * 
	 * @see java.util.Comparator#compare(java.lang.Object, java.lang.Object)
	 */
	public int compare(TrainQueryInfo t1, TrainQueryInfo t2) {
		String t1Type = t1.getTrainNo().substring(0, 1);
		String t2Type = t2.getTrainNo().substring(0, 1);
		
		// 检查有票否
		if (Util.getSeatAI(t1) == null) {
			return 1;
		}
		if (Util.getSeatAI(t2) == null) {
			return -1;
		}

		// 首先车次排
		if (Constants.getTrainPriority(t1Type) > Constants
				.getTrainPriority(t2Type)) {
			return 1;
		}
		if (Constants.getTrainPriority(t1Type) < Constants
				.getTrainPriority(t2Type)) {
			return -1;
		}

		// 二等座优先
		if (Constants.getTrainSeat(t1.getTwo_seat()) > Constants
				.getTrainSeat(t2.getTwo_seat())) {
			return -1;
		}
		if (Constants.getTrainSeat(t1.getTwo_seat()) < Constants
				.getTrainSeat(t2.getTwo_seat())) {
			return 1;
		}

		// 一等座
		if (Constants.getTrainSeat(t1.getOne_seat()) > Constants
				.getTrainSeat(t2.getOne_seat())) {
			return -1;
		}
		if (Constants.getTrainSeat(t1.getOne_seat()) < Constants
				.getTrainSeat(t2.getOne_seat())) {
			return 1;
		}

		// 硬卧
		if (Constants.getTrainSeat(t1.getHard_sleeper()) > Constants
				.getTrainSeat(t2.getHard_sleeper())) {
			return -1;
		}
		if (Constants.getTrainSeat(t1.getHard_sleeper()) < Constants
				.getTrainSeat(t2.getHard_sleeper())) {
			return 1;
		}

		// 硬座
		if (Constants.getTrainSeat(t1.getHard_seat()) > Constants
				.getTrainSeat(t2.getHard_seat())) {
			return -1;
		}
		if (Constants.getTrainSeat(t1.getHard_seat()) < Constants
				.getTrainSeat(t2.getHard_seat())) {
			return 1;
		}

		// 无座
		if (Constants.getTrainSeat(t1.getNone_seat()) > Constants
				.getTrainSeat(t2.getNone_seat())) {
			return -1;
		}
		if (Constants.getTrainSeat(t1.getNone_seat()) < Constants
				.getTrainSeat(t2.getNone_seat())) {
			return 1;
		}

		return 0;
	}

}
