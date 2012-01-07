/**************************************************
 * Filename: Config.java
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

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Properties;

/**
 * 功能描述
 * @author YAOWENHAO
 * @since 2011-12-20 
 * @version 1.0
 */
public class Config {
	private static Properties prop = new Properties();
	
	static {
		FileInputStream fis = null;
		try {
			fis = new FileInputStream("config.properties");
			InputStreamReader isr = new InputStreamReader(fis,"UTF-8");
			prop.load(isr);
			isr.close();
		} catch (IOException e) {
			System.err.println("加载配置文件出错  " + e);
		} finally {
			try {
				fis.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	public static String getProperty(String key) {
		return prop.getProperty(key);
	}
	
	public static boolean isUseProxy() {
		return "true".equals(getProperty("userproxy"));
	}
	
	public static String getProxyIp() {
		return getProperty("ip");
	}
	
	public static int getProxyPort() {
		return Integer.parseInt(getProperty("port"));
	}
	
	public static String getTrainCode() {
		return getProperty("traincode").trim();
	}
	
	public static int getSleepTime() {
		return Integer.parseInt(getProperty("sleeptime"));
	}
	
	public static void main(String[] args) {
		System.out.println(isUseProxy());
		System.out.println(getProxyIp());
		System.out.println(getProxyPort());
		System.out.println(getSleepTime());
		System.out.println(getTrainCode());
	}
}
