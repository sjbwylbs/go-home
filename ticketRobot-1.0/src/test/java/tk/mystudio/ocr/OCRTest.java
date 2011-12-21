/**************************************************
 * 上海美峰数码科技有限公司(http://www.morefuntek.com)
 * 模块名称: OCRTest
 * 功能描述：
 * 文件名：OCRTest.java
 **************************************************
 */
package tk.mystudio.ocr;

import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

import javax.swing.ImageIcon;
import javax.swing.JFrame;
import javax.swing.JLabel;

import org.apache.http.impl.client.DefaultHttpClient;

import com.ywh.train.Constants;
import com.ywh.train.logic.TrainClient;

/**
 * 功能描述
 * @author YAOWENHAO
 * @since 2011-11-28 
 * @version 1.0
 */
public class OCRTest {
	static TrainClient client = new TrainClient(new DefaultHttpClient());
	
	public static void main(String[] args) {
		JFrame frame = new JFrame("验证码");
		
		final JLabel label = new JLabel(new ImageIcon(),
				JLabel.CENTER);
		byte[] image = client.getCodeByte(Constants.LOGIN_CODE_URL);
		String randCodeByRob = OCR.read(image);			
		label.setIcon(new ImageIcon(image));
		label.setText(randCodeByRob);
		label.addMouseListener(new MouseAdapter() {
			@Override
			public void mouseClicked(MouseEvent e) {
				byte[] image = client.getCodeByte(Constants.LOGIN_CODE_URL);
				String randCodeByRob = OCR.read(image);			
				label.setIcon(new ImageIcon(image));
				label.setText(randCodeByRob);
				System.out.println(randCodeByRob);
			}
		});
		frame.add(label);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.setSize(300, 200);
		frame.setLocationRelativeTo(null);
		frame.setVisible(true);
		
	}
}
