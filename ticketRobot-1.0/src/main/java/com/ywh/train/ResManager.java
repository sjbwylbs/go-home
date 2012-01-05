/**************************************************
 * Filename: ResManager.java
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

import java.net.URL;
import java.util.MissingResourceException;
import java.util.ResourceBundle;

import javax.swing.ImageIcon;

/**
 * 资源管理器
 * @author YAOWENHAO
 * @since 2011-12-21 
 * @version 1.0
 */
public class ResManager {
	private static final String BUNDLE_NAME = "resources.ticketrob"; //$NON-NLS-1$
	private static final String IMAGES_PATH = "/resources/images/";

	private static final ResourceBundle RESOURCE_BUNDLE = ResourceBundle
			.getBundle(BUNDLE_NAME);

	private ResManager() {
	}

	public static String getString(String key) {
		try {
			return RESOURCE_BUNDLE.getString(key);
		} catch (MissingResourceException e) {
			return '!' + key + '!';
		}
	}

	public static ImageIcon createImageIcon(String filename) {
		return new ImageIcon(getFileURL(filename));
	}
	
	public static URL getFileURL(String filename) {
		String path = IMAGES_PATH + filename;
		return ClassLoader.class.getResource(path);
	}
}
