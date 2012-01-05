/**************************************************
 * Filename: Test.java
 * Version: v1.0
 * CreatedDate: 2011-12-29
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

import java.util.ArrayList;
import java.util.List;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;

import com.ywh.train.bean.TrainQueryInfo;

/**
 * 功能描述
 * @author YAOWENHAO
 * @since 2011-11-23 
 * @version 1.0
 */
public class Test {
	public static void main(String[] args) throws Exception {
		List<NameValuePair> parameters = new ArrayList<NameValuePair>();
		parameters.add(new BasicNameValuePair("includeStudent", "00"));
		parameters.add(new BasicNameValuePair("orderRequest.from_station_telecode", "SHH"));
		parameters.add(new BasicNameValuePair("orderRequest.start_time_str", "00:00--24:00"));
		parameters.add(new BasicNameValuePair("orderRequest.to_station_telecode", "CSQ"));
		parameters.add(new BasicNameValuePair("orderRequest.train_date", "2011-11-24"));
		parameters.add(new BasicNameValuePair("orderRequest.train_no", ""));		
		parameters.add(new BasicNameValuePair("seatTypeAndNum", ""));
		parameters.add(new BasicNameValuePair("trainClass", "QB#D#Z#T#K#QT#"));
		parameters.add(new BasicNameValuePair("trainPassType", "QB"));		

		String responseBody = "0,<span id='id_5l0000D10502' class='base_txtdiv' onmouseover=javascript:onStopHover('5l0000D10502#AOH#CSQ') onmouseout='onStopOut()'>D105</span>,<img src='/otsweb/images/tips/first.gif'>&nbsp;&nbsp;上海虹桥&nbsp;&nbsp;<br>&nbsp;&nbsp;&nbsp;&nbsp;09:08,<img src='/otsweb/images/tips/last.gif'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;长沙&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>&nbsp;&nbsp;&nbsp;&nbsp;18:21,09:13,--,--,<font color='darkgray'>无</font>,<font color='#008800'>有</font>,--,--,--,--,--,--,--,<input type='button' class='yuding_u' onmousemove=this.className='yuding_u_over' onmousedown=this.className='yuding_u_down' onmouseout=this.className='yuding_u' onclick=javascript:getSelected('D105#553#09:08#5l0000D10502#AOH#CSQ') value='预订'></input>," +												
				"<span id='id_5l0000D10502' class='base_txtdiv' onmouseover=javascript:onStopHover('5l0000D10502#EPH#PXG') onmouseout='onStopOut()'>D105</span>,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;嘉兴南&nbsp;&nbsp;&nbsp;&nbsp;<br>&nbsp;&nbsp;&nbsp;&nbsp;09:38,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;萍乡&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>&nbsp;&nbsp;&nbsp;&nbsp;17:09,07:31,--,--,<font color='darkgray'>无</font>,<font color='darkgray'>无</font>,--,--,--,--,--,--,--,<input type='button' class='yuding_x'  value='预订'></input>";
		
		List<TrainQueryInfo> tqis = Util.parserQueryInfo(responseBody);
		
		for (TrainQueryInfo tqi : tqis) {
			System.out.println(tqi);
		}
		
		
		String citys ="@bji|北京|BJP|0@bjn|北京南|VNP|1@bjx|北京西|BXP|2@cqb|重庆北|CUW|3@sha|上海|SHH|4@shn|上海南|SNH|5@shq|上海虹桥|AOH|6@shx|上海西|SXH|7@tji|天津|TJP|8@tjn|天津南|TIP|9@tjx|天津西|TXP|10@cch|长春|CCT|11@cdd|成都东|ICW|12@cdu|成都|CDW|13@csh|长沙|CSQ|14@csn|长沙南|CWQ|15@fzh|福州|FZS|16@fzn|福州南|FYS|17@gzb|广州北|GBQ|18@gzd|广州东|GGQ|19@gzh|广州|GZQ|20@gzn|广州南|IZQ|21@heb|哈尔滨|HBB|22@hfe|合肥|HFH|23@hkd|海口东|HMQ|24@hko|海口|VUQ|25@hzh|杭州|HZH|26@hzn|杭州南|XHH|27@jna|济南|JNK|28@jnd|济南东|JAK|29@jnx|济南西|JGK|30@lzh|兰州|LZJ|31@nch|南昌|NCG|32@nji|南京|NJH|33@njn|南京南|NKH|34@sjb|石家庄北|VVP|35@sjz|石家庄|SJP|36@sya|沈阳|SYT|37@syb|沈阳北|SBT|38@tyu|太原|TYV|39@wha|武汉|WHN|40@xab|西安北|EAY|41@xan|西安|XAY|42@zzh|郑州|ZZF|43@aya|安阳|AYF|44@bbu|蚌埠|BBH|45@bji|宝鸡|BJY|46@cna|苍南|CEH|47@czh|常州|CZH|48@djy|都江堰|DDW|49@dli|大连|DLT|50@dsq|大石桥|DQT|51@dzh|达州|RXW|52@fdi|福鼎|FES|53@han|淮安|AUH|54@hda|邯郸|HDP|55@hko|汉口|HKN|56@hnx|海宁西|EUH|57@hsh|衡水|HSP|58@hsh|黄石|HSN|59@jan|吉安|VAG|60@jgs|井冈山|JGG|61@jhx|金华西|JBH|62@jji|九江|JJG|63@jli|吉林|JLL|64@jsh|江山|JUH|65@kfe|开封|KFF|66@ksn|昆山南|KNH|67@lan|六安|UAH|68@lhe|漯河|LON|69@ljy|龙家营|LKP|70@lym|洛阳龙门|LLF|71@lzh|辽中|LZD|72@nbd|宁波东|NVH|73@nch|南充|NCW|74@nto|南通|NUH|75@pxi|萍乡|PXG|76@pxx|郫县西|PCW|77@qcs|青城山|QSW|78@qda|青岛|QDK|79@qzh|衢州|QEH|80@qzh|泉州|QYS|81@shg|山海关|SHD|82@sni|遂宁|NIW|83@spi|四平|SPT|84@sqi|商丘|SQF|85@sra|上饶|SRG|86@sya|十堰|SNN|87@sya|三亚|SEQ|88@szh|随州|SZN|89@szh|苏州|SZH|90@szh|深圳|SZQ|91@tgu|塘沽|TGP|92@tli|铁岭|TLT|93@tsb|唐山北|FUP|94@tsh|唐山|TSP|95@wch|武昌|WCN|96@wfd|瓦房店|WDT|97@wna|渭南|WNY|98@wxi|无锡|WXH|99@wys|武夷山|WAS|100@wzn|温州南|VRH|101@xch|许昌|XCF|102@xhu|新会|EFQ|103@xmb|厦门北|XKS|104@xme|厦门|XMS|105@xxi|新乡|XXF|106@xya|信阳|XUN|107@xya|襄阳|XFN|108@xyu|新余|XUG|109@xzh|徐州|XCH|110@yan|延安|YWY|111@ych|盐城|AFH|112@ych|宜春|YCG|113@yta|鹰潭|YTG|114@ywu|义乌|YWH|115@yxi|阳新|YON|116@yzh|扬州|YLH|117@zbo|淄博|ZBK|118@zhb|珠海北|ZIQ|119@zji|镇江|ZJH|120@zmd|驻马店|ZDN|121@zzh|株洲|ZZQ|122@zzh|枣庄|ZEK|123@zzx|枣庄西|ZFK|124@aji|鳌江|ARH|125@atb|安亭北|ASH|126@bao|博鳌|BWQ|127@bbn|蚌埠南|BMH|128@bdh|北戴河|BEP|129@bdi|保定|BDP|130@bhs|宝华山|BWH|131@bji|北滘|IBQ|132@bji|碧江|BLQ|133@cbb|赤壁北|CIN|134@cle|昌乐|CLK|135@czb|常州北|ESH|136@czh|滁州|CXH|137@czx|郴州西|ICQ|138@czx|沧州西|CBP|139@dan|德安|DAG|140@dgu|东莞|DAQ|141@dsh|东升|DRQ|142@dtu|丹徒|RUH|143@dya|丹阳|DYH|144@dyb|丹阳北|EXH|145@dyd|大英东|IAW|146@dyu|定远|EWH|147@dzd|德州东|DIP|148@dzh|定州|DXP|149@ezh|鄂州|ECN|150@fan|福安|FAS|151@fdo|肥东|FIH|152@fhu|奉化|FHH|153@fqi|福清|FQS|154@gmi|高密|GMK|155@gqc|共青城|GAG|156@gyn|巩义南|GYF|157@gzh|古镇|GNQ|158@hax|海安县|HIH|159@hax|红安西|VXN|160@hch|合川|WKW|161@hgz|红光镇|IGW|162@hji|涵江|HJS|163@hlb|葫芦岛北|HPD|164@hni|海宁|HNH|165@hqi|花桥|VQH|166@hsb|华山北|HDY|167@hsh|惠山|VCH|168@hsx|衡山西|HEQ|169@hyd|衡阳东|HVQ|170@hzh|黄州|VON|171@jji|晋江|JJS|172@jme|江门|JWQ|173@jsb|金山北|EGH|174@jsn|嘉善南|EAH|175@jxi|嘉兴|JXH|176@jxn|嘉兴南|EPH|177@jzb|胶州北|JZK|178@jzh|金寨|JZH|179@jzn|锦州南|JOD|180@lbx|灵宝西|LPF|181@lch|聊城|UCK|182@lfa|廊坊|LJP|183@lha|临海|UFH|184@lji|连江|LKS|185@lsh|庐山|LSG|186@lsh|陵水|LIQ|187@lxi|滦县|UXP|188@lyo|龙游|LMH|189@lyu|罗源|LVS|190@lyx|耒阳西|LPQ|191@mcb|麻城北|MBN|192@mcn|渑池南|MNF|193@mla|美兰|MHQ|194@mld|汨罗东|MQQ|195@nde|宁德|NES|196@nha|宁海|NHH|197@nla|南朗|NNQ|198@nxb|南翔北|NEH|199@pjb|盘锦北|PBD|200@pti|莆田|PTS|201@qfd|曲阜东|QAK|202@qha|琼海|QYQ|203@qji|全椒|INH|204@qsy|戚墅堰|QYH|205@qyu|清远|QBQ|206@qzs|青州市|QZK|207@ran|瑞安|RAH|208@rch|瑞昌|RCG|209@rgu|容桂|RUQ|210@sde|顺德|ORQ|211@sfa|绅坊|OLH|212@sgu|韶关|SNQ|213@sjn|松江南|IMH|214@slo|石龙|SLQ|215@smn|三门峡南|SCF|216@smx|三门县|OQH|217@sxi|绍兴|SOH|218@syu|上虞|BDH|219@szb|绥中北|SND|220@szb|苏州北|OHH|221@szd|宿州东|SRH|222@szq|苏州新区|ITH|223@szq|苏州园区|KAH|224@tan|台安|TID|225@tan|泰安|TMK|226@tms|太姥山|TLS|227@tna|潼南|TVW|228@txi|桐乡|TCH|229@tzd|滕州东|TEK|230@tzh|台州|TZH|231@wch|文昌|WEQ|232@wfa|潍坊|WFK|233@wli|温岭|VHH|234@wnb|渭南北|WBY|235@wni|万宁|WNQ|236@wqi|武清|WWP|237@wxd|无锡东|WGH|238@wxq|无锡新区|IFH|239@xga|孝感|XGN|240@xla|小榄|EAQ|241@xli|仙林|XPH|242@xnb|咸宁北|XRN|243@xpu|霞浦|XOS|244@xpu|犀浦|XIW|245@xta|邢台|XTP|246@xzd|徐州东|UUH|247@ych|阳澄湖|AIH|248@yds|雁荡山|YGH|249@yha|余杭|EVH|250@yji|永嘉|URH|251@ylw|亚龙湾|TWQ|252@ylz|杨陵镇|YSY|253@yqb|阳泉北|YPP|254@yqi|乐清|UPH|255@yxi|永修|ACG|256@yya|余姚|YYH|257@yyd|岳阳东|YIQ|258@zji|诸暨|ZDH|259@zjn|镇江南|ZEH|260@zmt|樟木头|ZOQ|261@zqi|章丘|ZTK|262@zsb|中山北|ZGQ|263@zsh|中山|ZSQ|264@zzx|株洲西|ZAQ|265";
		String city[] = citys.split("@");
		System.out.println("---------start--------");
		for (String tmp : city) {
			System.out.println(tmp);
		}
		System.out.println("---------end--------");
		
		//String test = "我的订单		 	          邬建功  我的订单     未完成订单     订单查询     退票     改签     我的信息     常用联系人     个人资料     密码修改    用户注销           -->   	       未完成订单    您没有未完成的订单！       	       总票价: 260.0(元)-->       订单时间： Sat Nov 26 14:04:16 CST 2011       总张数：1    车次信息        座位信息        旅客信息        车票状态       Mon Nov 28 00:00:00 CST 2011        D105        上海虹桥—长沙        Thu Jan 01 09:08:00 CST 1970开        02车厢        052座       二等座        成人票,        260.0元        邬建功       二代身份证    待支付  	        	    -->    	        		        网上支付 -->	         	         	         继续支付       			       		  	        		        		        取消订单";
		String test = "1 vxv";
		System.out.println(test.replaceAll("\\s", ""));
		
	}

}
