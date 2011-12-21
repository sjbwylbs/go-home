/*
 * OCR.java
 *
 * Created on December 24, 2007, 12:38 AM
 */

package tk.mystudio.ocr;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class OCR {
	protected transient final static Logger logger = LoggerFactory.getLogger("OCR");
	private final static String LANG_OPTION = "-l";
	private final static String EOL = System.getProperty("line.separator");
	private static String tessPath = new File("tesseract").getAbsolutePath();

	public static String read(byte[] image) {
		File file = new File("tesseract", System.currentTimeMillis()+"");
		String randCode = "";
		try {
			DataOutputStream dos = new DataOutputStream(new FileOutputStream(file));
			dos.write(image);
			dos.flush();
			dos.close();
			randCode = read(file);			
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			file.delete();
		}
		randCode = randCode.replaceAll("\\s", "");
		return randCode;
	}
	
	public static String read(File imageFile) throws Exception {
		String result = "";
		File outputFile = new File(imageFile.getParentFile(), "output");
		StringBuffer strB = new StringBuffer();

		List<String> cmd = new ArrayList<String>();
		cmd.add(tessPath + "\\tesseract");
		cmd.add("");
		cmd.add(outputFile.getName());
		cmd.add(LANG_OPTION);
		cmd.add("eng");

		ProcessBuilder pb = new ProcessBuilder();
		pb.directory(imageFile.getParentFile());

		cmd.set(1, imageFile.getName());
		pb.command(cmd);
		pb.redirectErrorStream(true);
		Process process = pb.start();

		int w = process.waitFor();
		logger.debug("Exit value = {}", w);

		if (w == 0) {
			BufferedReader in = new BufferedReader(new InputStreamReader(
					new FileInputStream(outputFile.getAbsolutePath() + ".txt"),
					"UTF-8"));

			String str;

			while ((str = in.readLine()) != null) {
				strB.append(str).append(EOL);
			}
			in.close();
		} else {
			String msg;
			switch (w) {
			case 1:
				msg = "Errors accessing files. There may be spaces in your image's filename.";
				break;
			case 29:
				msg = "Cannot recognize the image or its selected region.";
				break;
			case 31:
				msg = "Unsupported image format.";
				break;
			default:
				msg = "Errors occurred.";
			}
			throw new RuntimeException(msg);
		}

		new File(outputFile.getAbsolutePath() + ".txt").delete();
		result = strB.toString().trim();
		return result;
	}

}
