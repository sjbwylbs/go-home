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

import java.io.InputStreamReader;
import java.io.Reader;

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
@SuppressWarnings("restriction")
public class TestJS {

	public static Object callCityMd5(String city, String pwd) {

		String SCRIPT_NAME = "JavaScript";
		String jsName = "alert.js";
		String funcName = "a1ert";

		Object result = null;
		Reader scriptReader = null;
		// Get the JavaScript engine
		ScriptEngineManager manager = new ScriptEngineManager();
		ScriptEngine engine = manager.getEngineByName(SCRIPT_NAME);
		try {
			if (engine == null) {
				throw new ScriptException("Can not initialize " + SCRIPT_NAME
						+ " engine!");
			}
			scriptReader = new InputStreamReader(
					ClassLoader.getSystemResourceAsStream(jsName));
			engine.eval(scriptReader);
			if (engine instanceof Invocable) {
				Invocable invEngine = (Invocable) engine;
				// Invoke a JavaScript function
				result = invEngine.invokeFunction(funcName, city, pwd);
				System.out.println("[JavaScript] result: " + result);
			} else {
				throw new ScriptException(
						"Engine does not support Invocable interface!");
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (null != scriptReader) {
					scriptReader.close();
					scriptReader = null;
				}
			} catch (Exception e) {
			}
		}

		return result;
	}

	public static void main(String[] args) {
		try {
			for (int i = 0; i < 5; i++) {
				callCityMd5("上海", "liusheng");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
