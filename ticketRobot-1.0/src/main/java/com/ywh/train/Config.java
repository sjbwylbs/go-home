/**************************************************
 * 上海美峰数码科技有限公司(http://www.morefuntek.com)
 * 模块名称: Config
 * 功能描述：
 * 文件名：Config.java
 **************************************************
 */
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
			System.err.println("加载配置文件出错 " + e);
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
	
	public static void main(String[] args) {
		System.out.println(isUseProxy());
		System.out.println(getProxyIp());
		System.out.println(getProxyPort());
	}
}
