/**************************************************
 * Filename: TestJS.java
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

package com.ywh.train;

import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.Properties;

import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

/**
 * 功能描述
 * 
 * @author cafebabe
 * @since 2011-11-27
 * @version 1.0
 */
public class TestJS {

	public static Object callCityMd5(String city, String pwd)
			throws Exception {

//		ResourceBundle bundle = ResourceBundle.getBundle("config");
		String jsName = "alert.js";//bundle.getString("MD5JSFILE");

		String funcName = "a1ert";
		Object result = null;
		String SCRIPT_NAME = "JavaScript";
		// Get the JavaScript engine
		ScriptEngineManager manager = new ScriptEngineManager();
		ScriptEngine engine = manager.getEngineByName(SCRIPT_NAME);
		if (engine == null) {
			throw new ScriptException("Can not initialize " + SCRIPT_NAME
					+ " engine!");
		}

		// Run *.js
		Reader scriptReader = new InputStreamReader(ClassLoader.getSystemResourceAsStream(jsName));
//				new FileInputStream(jsName), "utf-8");
		try {
			engine.eval(scriptReader);
		} finally {
			if (null != scriptReader) {
				scriptReader.close();
				scriptReader = null;
			}
		}

		// Invoke a JavaScript function
		if (engine instanceof Invocable) {
			Invocable invEngine = (Invocable) engine;
			result = invEngine.invokeFunction(funcName, city, pwd);
			System.out.println("[Java] result: " + result);
			// System.out.println("    Java object: " +
			// result.getClass().getName());
		} else {
			System.out.println("Engine does not support Invocable interface!");
			throw new ScriptException(
					"Engine does not support Invocable interface!");
		}
		return result;
	}
	
	public static void main(String[] args) {
		try {
			for(int i=0; i<5; i++) {
				callCityMd5("上海", "liusheng");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
