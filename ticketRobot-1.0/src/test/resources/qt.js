/**
 * 
 */
dhtmlxAjax = {
	get : function(url, callback) {
		var t = new dtmlXMLLoaderObject(true);
		t.async = (arguments.length < 3);
		t.waitCall = callback;
		t.loadXML(url);
		return t;
	},
	post : function(url, post, callback) {
		var t = new dtmlXMLLoaderObject(true);
		t.async = (arguments.length < 4);
		t.waitCall = callback;
		t.loadXML(url, true, post);
		return t;
	},
	getSync : function(url) {
		return this.get(url, null, true);
	},
	postSync : function(url, post) {
		return this.post(url, post, null, true);
	}
};
function dtmlXMLLoaderObject(funcObject, dhtmlObject, async, rSeed) {
	this.xmlDoc = "";
	if (typeof (async) != "undefined") {
		this.async = async;
	} else {
		this.async = true;
	}
	this.onloadAction = funcObject || null;
	this.mainObject = dhtmlObject || null;
	this.waitCall = null;
	this.rSeed = rSeed || false;
	return this;
}
dtmlXMLLoaderObject.prototype.waitLoadFunction = function(dhtmlObject) {
	var once = true;
	this.check = function() {
		if ((dhtmlObject) && (dhtmlObject.onloadAction != null)) {
			if ((!dhtmlObject.xmlDoc.readyState)
					|| (dhtmlObject.xmlDoc.readyState == 4)) {
				if (!once) {
					return;
				}
				once = false;
				if (typeof dhtmlObject.onloadAction == "function") {
					dhtmlObject.onloadAction(dhtmlObject.mainObject, null,
							null, null, dhtmlObject);
				}
				if (dhtmlObject.waitCall) {
					dhtmlObject.waitCall.call(this, dhtmlObject);
					dhtmlObject.waitCall = null;
				}
			}
		}
	};
	return this.check;
};
dtmlXMLLoaderObject.prototype.getXMLTopNode = function(tagName, oldObj) {
	if (this.xmlDoc.responseXML) {
		var temp = this.xmlDoc.responseXML.getElementsByTagName(tagName);
		if (temp.length == 0 && tagName.indexOf(":") != -1) {
			var temp = this.xmlDoc.responseXML.getElementsByTagName((tagName
					.split(":"))[1]);
		}
		var z = temp[0];
	} else {
		var z = this.xmlDoc.documentElement;
	}
	if (z) {
		this._retry = false;
		return z;
	}
	if ((_isIE) && (!this._retry)) {
		var xmlString = this.xmlDoc.responseText;
		var oldObj = this.xmlDoc;
		this._retry = true;
		this.xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		this.xmlDoc.async = false;
		this.xmlDoc["loadXM" + "L"](xmlString);
		return this.getXMLTopNode(tagName, oldObj);
	}
	dhtmlxError.throwError("LoadXML", "Incorrect XML", [
			(oldObj || this.xmlDoc), this.mainObject ]);
	return document.createElement("DIV");
};
dtmlXMLLoaderObject.prototype.loadXMLString = function(xmlString) {
	try {
		var parser = new DOMParser();
		this.xmlDoc = parser.parseFromString(xmlString, "text/xml");
	} catch (e) {
		this.xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		this.xmlDoc.async = this.async;
		this.xmlDoc["loadXM" + "L"](xmlString);
	}
	this.onloadAction(this.mainObject, null, null, null, this);
	if (this.waitCall) {
		this.waitCall();
		this.waitCall = null;
	}
};
dtmlXMLLoaderObject.prototype.loadXML = function(filePath, postMode, postVars,
		rpc) {
	if (this.rSeed) {
		filePath += ((filePath.indexOf("?") != -1) ? "&" : "?")
				+ "a_dhx_rSeed=" + (new Date()).valueOf();
	}
	this.filePath = filePath;
	if ((!_isIE) && (window.XMLHttpRequest)) {
		this.xmlDoc = new XMLHttpRequest();
	} else {
		if (document.implementation && document.implementation.createDocument) {
			this.xmlDoc = document.implementation.createDocument("", "", null);
			this.xmlDoc.onload = new this.waitLoadFunction(this);
			this.xmlDoc.load(filePath);
			return;
		} else {
			this.xmlDoc = new ActiveXObject("Microsoft.XMLHTTP");
		}
	}
	if (this.async) {
		this.xmlDoc.onreadystatechange = new this.waitLoadFunction(this);
	}
	this.xmlDoc.open(postMode ? "POST" : "GET", filePath, this.async);
	if (rpc) {
		this.xmlDoc.setRequestHeader("User-Agent", "dhtmlxRPC v0.1 ("
				+ navigator.userAgent + ")");
		this.xmlDoc.setRequestHeader("Content-type", "text/xml");
	} else {
		if (postMode) {
			this.xmlDoc.setRequestHeader("Content-type",
					"application/x-www-form-urlencoded");
		}
	}
	this.xmlDoc.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	this.xmlDoc.send(null || postVars);
	if (!this.async) {
		(new this.waitLoadFunction(this))();
	}
};
dtmlXMLLoaderObject.prototype.destructor = function() {
	this.onloadAction = null;
	this.mainObject = null;
	this.xmlDoc = null;
	return null;
};
dtmlXMLLoaderObject.prototype.xmlNodeToJSON = function(node) {
	var t = {};
	for ( var i = 0; i < node.attributes.length; i++) {
		t[node.attributes[i].name] = node.attributes[i].value;
	}
	t["_tagvalue"] = node.firstChild ? node.firstChild.nodeValue : "";
	for ( var i = 0; i < node.childNodes.length; i++) {
		var name = node.childNodes[i].tagName;
		if (name) {
			if (!t[name]) {
				t[name] = [];
			}
			t[name].push(this.xmlNodeToJSON(node.childNodes[i]));
		}
	}
	return t;
};
function callerFunction(funcObject, dhtmlObject) {
	this.handler = function(e) {
		if (!e) {
			e = window.event;
		}
		funcObject(e, dhtmlObject);
		return true;
	};
	return this.handler;
}
function getAbsoluteLeft(htmlObject) {
	var xPos = htmlObject.offsetLeft;
	var temp = htmlObject.offsetParent;
	while (temp != null) {
		xPos += temp.offsetLeft;
		temp = temp.offsetParent;
	}
	return xPos;
}
function getAbsoluteTop(htmlObject) {
	var yPos = htmlObject.offsetTop;
	var temp = htmlObject.offsetParent;
	while (temp != null) {
		yPos += temp.offsetTop;
		temp = temp.offsetParent;
	}
	return yPos;
}
function convertStringToBoolean(inputString) {
	if (typeof (inputString) == "string") {
		inputString = inputString.toLowerCase();
	}
	switch (inputString) {
	case "1":
	case "true":
	case "yes":
	case "y":
	case 1:
	case true:
		return true;
		break;
	default:
		return false;
	}
}
function getUrlSymbol(str) {
	if (str.indexOf("?") != -1) {
		return "&";
	} else {
		return "?";
	}
}
function dhtmlDragAndDropObject() {
	if (window.dhtmlDragAndDrop) {
		return window.dhtmlDragAndDrop;
	}
	this.lastLanding = 0;
	this.dragNode = 0;
	this.dragStartNode = 0;
	this.dragStartObject = 0;
	this.tempDOMU = null;
	this.tempDOMM = null;
	this.waitDrag = 0;
	window.dhtmlDragAndDrop = this;
	return this;
}
dhtmlDragAndDropObject.prototype.removeDraggableItem = function(htmlNode) {
	htmlNode.onmousedown = null;
	htmlNode.dragStarter = null;
	htmlNode.dragLanding = null;
};
dhtmlDragAndDropObject.prototype.addDraggableItem = function(htmlNode,
		dhtmlObject) {
	htmlNode.onmousedown = this.preCreateDragCopy;
	htmlNode.dragStarter = dhtmlObject;
	this.addDragLanding(htmlNode, dhtmlObject);
};
dhtmlDragAndDropObject.prototype.addDragLanding = function(htmlNode,
		dhtmlObject) {
	htmlNode.dragLanding = dhtmlObject;
};
dhtmlDragAndDropObject.prototype.preCreateDragCopy = function(e) {
	if (e && (e || event).button == 2) {
		return;
	}
	if (window.dhtmlDragAndDrop.waitDrag) {
		window.dhtmlDragAndDrop.waitDrag = 0;
		document.body.onmouseup = window.dhtmlDragAndDrop.tempDOMU;
		document.body.onmousemove = window.dhtmlDragAndDrop.tempDOMM;
		return false;
	}
	window.dhtmlDragAndDrop.waitDrag = 1;
	window.dhtmlDragAndDrop.tempDOMU = document.body.onmouseup;
	window.dhtmlDragAndDrop.tempDOMM = document.body.onmousemove;
	window.dhtmlDragAndDrop.dragStartNode = this;
	window.dhtmlDragAndDrop.dragStartObject = this.dragStarter;
	document.body.onmouseup = window.dhtmlDragAndDrop.preCreateDragCopy;
	document.body.onmousemove = window.dhtmlDragAndDrop.callDrag;
	if ((e) && (e.preventDefault)) {
		e.preventDefault();
		return false;
	}
	return false;
};
dhtmlDragAndDropObject.prototype.callDrag = function(e) {
	if (!e) {
		e = window.event;
	}
	dragger = window.dhtmlDragAndDrop;
	if ((e.button == 0) && (_isIE)) {
		return dragger.stopDrag();
	}
	if (!dragger.dragNode && dragger.waitDrag) {
		dragger.dragNode = dragger.dragStartObject._createDragNode(
				dragger.dragStartNode, e);
		if (!dragger.dragNode) {
			return dragger.stopDrag();
		}
		dragger.gldragNode = dragger.dragNode;
		document.body.appendChild(dragger.dragNode);
		document.body.onmouseup = dragger.stopDrag;
		dragger.waitDrag = 0;
		dragger.dragNode.pWindow = window;
		dragger.initFrameRoute();
	}
	if (dragger.dragNode.parentNode != window.document.body) {
		var grd = dragger.gldragNode;
		if (dragger.gldragNode.old) {
			grd = dragger.gldragNode.old;
		}
		grd.parentNode.removeChild(grd);
		var oldBody = dragger.dragNode.pWindow;
		if (_isIE) {
			var div = document.createElement("Div");
			div.innerHTML = dragger.dragNode.outerHTML;
			dragger.dragNode = div.childNodes[0];
		} else {
			dragger.dragNode = dragger.dragNode.cloneNode(true);
		}
		dragger.dragNode.pWindow = window;
		dragger.gldragNode.old = dragger.dragNode;
		document.body.appendChild(dragger.dragNode);
		oldBody.dhtmlDragAndDrop.dragNode = dragger.dragNode;
	}
	dragger.dragNode.style.left = e.clientX + 15
			+ (dragger.fx ? dragger.fx * (-1) : 0)
			+ (document.body.scrollLeft || document.documentElement.scrollLeft)
			+ "px";
	dragger.dragNode.style.top = e.clientY + 3
			+ (dragger.fy ? dragger.fy * (-1) : 0)
			+ (document.body.scrollTop || document.documentElement.scrollTop)
			+ "px";
	if (!e.srcElement) {
		var z = e.target;
	} else {
		z = e.srcElement;
	}
	dragger.checkLanding(z, e);
};
dhtmlDragAndDropObject.prototype.calculateFramePosition = function(n) {
	if (window.name) {
		var el = parent.frames[window.name].frameElement.offsetParent;
		var fx = 0;
		var fy = 0;
		while (el) {
			fx += el.offsetLeft;
			fy += el.offsetTop;
			el = el.offsetParent;
		}
		if ((parent.dhtmlDragAndDrop)) {
			var ls = parent.dhtmlDragAndDrop.calculateFramePosition(1);
			fx += ls.split("_")[0] * 1;
			fy += ls.split("_")[1] * 1;
		}
		if (n) {
			return fx + "_" + fy;
		} else {
			this.fx = fx;
		}
		this.fy = fy;
	}
	return "0_0";
};
dhtmlDragAndDropObject.prototype.checkLanding = function(htmlObject, e) {
	if ((htmlObject) && (htmlObject.dragLanding)) {
		if (this.lastLanding) {
			this.lastLanding.dragLanding._dragOut(this.lastLanding);
		}
		this.lastLanding = htmlObject;
		this.lastLanding = this.lastLanding.dragLanding._dragIn(
				this.lastLanding, this.dragStartNode, e.clientX, e.clientY, e);
		this.lastLanding_scr = (_isIE ? e.srcElement : e.target);
	} else {
		if ((htmlObject) && (htmlObject.tagName != "BODY")) {
			this.checkLanding(htmlObject.parentNode, e);
		} else {
			if (this.lastLanding) {
				this.lastLanding.dragLanding._dragOut(this.lastLanding,
						e.clientX, e.clientY, e);
			}
			this.lastLanding = 0;
			if (this._onNotFound) {
				this._onNotFound();
			}
		}
	}
};
dhtmlDragAndDropObject.prototype.stopDrag = function(e, mode) {
	dragger = window.dhtmlDragAndDrop;
	if (!mode) {
		dragger.stopFrameRoute();
		var temp = dragger.lastLanding;
		dragger.lastLanding = null;
		if (temp) {
			temp.dragLanding._drag(dragger.dragStartNode,
					dragger.dragStartObject, temp, (_isIE ? event.srcElement
							: e.target));
		}
	}
	dragger.lastLanding = null;
	if ((dragger.dragNode) && (dragger.dragNode.parentNode == document.body)) {
		dragger.dragNode.parentNode.removeChild(dragger.dragNode);
	}
	dragger.dragNode = 0;
	dragger.gldragNode = 0;
	dragger.fx = 0;
	dragger.fy = 0;
	dragger.dragStartNode = 0;
	dragger.dragStartObject = 0;
	document.body.onmouseup = dragger.tempDOMU;
	document.body.onmousemove = dragger.tempDOMM;
	dragger.tempDOMU = null;
	dragger.tempDOMM = null;
	dragger.waitDrag = 0;
};
dhtmlDragAndDropObject.prototype.stopFrameRoute = function(win) {
	if (win) {
		window.dhtmlDragAndDrop.stopDrag(1, 1);
	}
	for ( var i = 0; i < window.frames.length; i++) {
		if ((window.frames[i] != win) && (window.frames[i].dhtmlDragAndDrop)) {
			window.frames[i].dhtmlDragAndDrop.stopFrameRoute(window);
		}
	}
	if ((parent.dhtmlDragAndDrop) && (parent != window) && (parent != win)) {
		parent.dhtmlDragAndDrop.stopFrameRoute(window);
	}
};
dhtmlDragAndDropObject.prototype.initFrameRoute = function(win, mode) {
	if (win) {
		window.dhtmlDragAndDrop.preCreateDragCopy();
		window.dhtmlDragAndDrop.dragStartNode = win.dhtmlDragAndDrop.dragStartNode;
		window.dhtmlDragAndDrop.dragStartObject = win.dhtmlDragAndDrop.dragStartObject;
		window.dhtmlDragAndDrop.dragNode = win.dhtmlDragAndDrop.dragNode;
		window.dhtmlDragAndDrop.gldragNode = win.dhtmlDragAndDrop.dragNode;
		window.document.body.onmouseup = window.dhtmlDragAndDrop.stopDrag;
		window.waitDrag = 0;
		if (((!_isIE) && (mode)) && ((!_isFF) || (_FFrv < 1.8))) {
			window.dhtmlDragAndDrop.calculateFramePosition();
		}
	}
	if ((parent.dhtmlDragAndDrop) && (parent != window) && (parent != win)) {
		parent.dhtmlDragAndDrop.initFrameRoute(window);
	}
	for ( var i = 0; i < window.frames.length; i++) {
		if ((window.frames[i] != win) && (window.frames[i].dhtmlDragAndDrop)) {
			window.frames[i].dhtmlDragAndDrop.initFrameRoute(window,
					((!win || mode) ? 1 : 0));
		}
	}
};
var _isFF = false;
var _isIE = false;
var _isOpera = false;
var _isKHTML = false;
var _isMacOS = false;
if (navigator.userAgent.indexOf("Macintosh") != -1) {
	_isMacOS = true;
}
if ((navigator.userAgent.indexOf("Safari") != -1)
		|| (navigator.userAgent.indexOf("Konqueror") != -1)) {
	var _KHTMLrv = parseFloat(navigator.userAgent.substr(navigator.userAgent
			.indexOf("Safari") + 7, 5));
	if (_KHTMLrv > 525) {
		_isFF = true;
		var _FFrv = 1.9;
	} else {
		_isKHTML = true;
	}
} else {
	if (navigator.userAgent.indexOf("Opera") != -1) {
		_isOpera = true;
		_OperaRv = parseFloat(navigator.userAgent.substr(navigator.userAgent
				.indexOf("Opera") + 6, 3));
	} else {
		if (navigator.appName.indexOf("Microsoft") != -1) {
			_isIE = true;
		} else {
			_isFF = true;
			var _FFrv = parseFloat(navigator.userAgent.split("rv:")[1]);
		}
	}
}
function isIE() {
	if (navigator.appName.indexOf("Microsoft") != -1) {
		if (navigator.userAgent.indexOf("Opera") == -1) {
			return true;
		}
	}
	return false;
}
dtmlXMLLoaderObject.prototype.doXPath = function(xpathExp, docObj, namespace,
		result_type) {
	if ((_isKHTML)) {
		return this.doXPathOpera(xpathExp, docObj);
	}
	if (_isIE) {
		if (!docObj) {
			if (!this.xmlDoc.nodeName) {
				docObj = this.xmlDoc.responseXML;
			} else {
				docObj = this.xmlDoc;
			}
		}
		if (!docObj) {
			dhtmlxError.throwError("LoadXML", "Incorrect XML", [
					(docObj || this.xmlDoc), this.mainObject ]);
		}
		if (namespace != null) {
			docObj.setProperty("SelectionNamespaces", "xmlns:xsl='" + namespace
					+ "'");
		}
		if (result_type == "single") {
			return docObj.selectSingleNode(xpathExp);
		} else {
			return docObj.selectNodes(xpathExp) || new Array(0);
		}
	} else {
		var nodeObj = docObj;
		if (!docObj) {
			if (!this.xmlDoc.nodeName) {
				docObj = this.xmlDoc.responseXML;
			} else {
				docObj = this.xmlDoc;
			}
		}
		if (!docObj) {
			dhtmlxError.throwError("LoadXML", "Incorrect XML", [
					(docObj || this.xmlDoc), this.mainObject ]);
		}
		if (docObj.nodeName.indexOf("document") != -1) {
			nodeObj = docObj;
		} else {
			nodeObj = docObj;
			docObj = docObj.ownerDocument;
		}
		var retType = XPathResult.ANY_TYPE;
		if (result_type == "single") {
			retType = XPathResult.FIRST_ORDERED_NODE_TYPE;
		}
		var rowsCol = new Array();
		var col = docObj.evaluate(xpathExp, nodeObj, function(pref) {
			return namespace;
		}, retType, null);
		if (retType == XPathResult.FIRST_ORDERED_NODE_TYPE) {
			return col.singleNodeValue;
		}
		var thisColMemb = col.iterateNext();
		while (thisColMemb) {
			rowsCol[rowsCol.length] = thisColMemb;
			thisColMemb = col.iterateNext();
		}
		return rowsCol;
	}
};
function _dhtmlxError(type, name, params) {
	if (!this.catches) {
		this.catches = new Array();
	}
	return this;
}
_dhtmlxError.prototype.catchError = function(type, func_name) {
	this.catches[type] = func_name;
};
_dhtmlxError.prototype.throwError = function(type, name, params) {
	if (this.catches[type]) {
		return this.catches[type](type, name, params);
	}
	if (this.catches["ALL"]) {
		return this.catches["ALL"](type, name, params);
	}
	return null;
};
window.dhtmlxError = new _dhtmlxError();
dtmlXMLLoaderObject.prototype.doXPathOpera = function(xpathExp, docObj) {
	var z = xpathExp.replace(/[\/]+/gi, "/").split("/");
	var obj = null;
	var i = 1;
	if (!z.length) {
		return [];
	}
	if (z[0] == ".") {
		obj = [ docObj ];
	} else {
		if (z[0] == "") {
			obj = (this.xmlDoc.responseXML || this.xmlDoc)
					.getElementsByTagName(z[i].replace(/\[[^\]]*\]/g, ""));
			i++;
		} else {
			return [];
		}
	}
	for (i; i < z.length; i++) {
		obj = this._getAllNamedChilds(obj, z[i]);
	}
	if (z[i - 1].indexOf("[") != -1) {
		obj = this._filterXPath(obj, z[i - 1]);
	}
	return obj;
};
dtmlXMLLoaderObject.prototype._filterXPath = function(a, b) {
	var c = new Array();
	var b = b.replace(/[^\[]*\[\@/g, "").replace(/[\[\]\@]*/g, "");
	for ( var i = 0; i < a.length; i++) {
		if (a[i].getAttribute(b)) {
			c[c.length] = a[i];
		}
	}
	return c;
};
dtmlXMLLoaderObject.prototype._getAllNamedChilds = function(a, b) {
	var c = new Array();
	if (_isKHTML) {
		b = b.toUpperCase();
	}
	for ( var i = 0; i < a.length; i++) {
		for ( var j = 0; j < a[i].childNodes.length; j++) {
			if (_isKHTML) {
				if (a[i].childNodes[j].tagName
						&& a[i].childNodes[j].tagName.toUpperCase() == b) {
					c[c.length] = a[i].childNodes[j];
				}
			} else {
				if (a[i].childNodes[j].tagName == b) {
					c[c.length] = a[i].childNodes[j];
				}
			}
		}
	}
	return c;
};
function dhtmlXHeir(a, b) {
	for ( var c in b) {
		if (typeof (b[c]) == "function") {
			a[c] = b[c];
		}
	}
	return a;
}
function dhtmlxEvent(el, event, handler) {
	if (el.addEventListener) {
		el.addEventListener(event, handler, false);
	} else {
		if (el.attachEvent) {
			el.attachEvent("on" + event, handler);
		}
	}
}
dtmlXMLLoaderObject.prototype.xslDoc = null;
dtmlXMLLoaderObject.prototype.setXSLParamValue = function(paramName,
		paramValue, xslDoc) {
	if (!xslDoc) {
		xslDoc = this.xslDoc;
	}
	if (xslDoc.responseXML) {
		xslDoc = xslDoc.responseXML;
	}
	var item = this.doXPath("/xsl:stylesheet/xsl:variable[@name='" + paramName
			+ "']", xslDoc, "http://www.w3.org/1999/XSL/Transform", "single");
	if (item != null) {
		item.firstChild.nodeValue = paramValue;
	}
};
dtmlXMLLoaderObject.prototype.doXSLTransToObject = function(xslDoc, xmlDoc) {
	if (!xslDoc) {
		xslDoc = this.xslDoc;
	}
	if (xslDoc.responseXML) {
		xslDoc = xslDoc.responseXML;
	}
	if (!xmlDoc) {
		xmlDoc = this.xmlDoc;
	}
	if (xmlDoc.responseXML) {
		xmlDoc = xmlDoc.responseXML;
	}
	if (!isIE()) {
		if (!this.XSLProcessor) {
			this.XSLProcessor = new XSLTProcessor();
			this.XSLProcessor.importStylesheet(xslDoc);
		}
		var result = this.XSLProcessor.transformToDocument(xmlDoc);
	} else {
		var result = new ActiveXObject("Msxml2.DOMDocument.3.0");
		xmlDoc.transformNodeToObject(xslDoc, result);
	}
	return result;
};
dtmlXMLLoaderObject.prototype.doXSLTransToString = function(xslDoc, xmlDoc) {
	return this.doSerialization(this.doXSLTransToObject(xslDoc, xmlDoc));
};
dtmlXMLLoaderObject.prototype.doSerialization = function(xmlDoc) {
	if (!xmlDoc) {
		xmlDoc = this.xmlDoc;
	}
	if (xmlDoc.responseXML) {
		xmlDoc = xmlDoc.responseXML;
	}
	if (!isIE()) {
		var xmlSerializer = new XMLSerializer();
		return xmlSerializer.serializeToString(xmlDoc);
	} else {
		return xmlDoc.xml;
	}
};
function dhtmlXComboFromSelect(parent, size) {
	if (typeof (parent) == "string") {
		parent = document.getElementById(parent);
	}
	size = size
			|| parent.getAttribute("width")
			|| (window.getComputedStyle ? window.getComputedStyle(parent, null)["width"]
					: (parent.currentStyle ? parent.currentStyle["width"] : 0));
	if ((!size) || (size == "auto")) {
		size = parent.offsetWidth || 100;
	}
	var z = document.createElement("SPAN");
	if (parent.style.direction == "rtl") {
		z.style.direction = "rtl";
	}
	parent.parentNode.insertBefore(z, parent);
	parent.style.display = "none";
	var s_type = parent.getAttribute("opt_type");
	var w = new dhtmlXCombo(z, parent.name, size, s_type, parent.tabIndex);
	var x = new Array();
	var sel = 0;
	for ( var i = 0; i < parent.options.length; i++) {
		if (parent.options[i].selected) {
			sel = i;
		}
		var label = parent.options[i].innerHTML;
		var val = parent.options[i].getAttribute("value");
		if ((typeof (val) == "undefined") || (val === null)) {
			val = label;
		}
		x[i] = {
			value : val,
			text : label,
			img_src : parent.options[i].getAttribute("img_src")
		};
	}
	w.addOption(x);
	parent.parentNode.removeChild(parent);
	w.selectOption(sel, null, true);
	if (parent.onchange) {
		w.attachEvent("onChange", parent.onchange);
	}
	return w;
}
var dhtmlXCombo_optionTypes = [];
function dhtmlXCombo(parent, name, width, optionType, tabIndex) {
	if (typeof (parent) == "string") {
		parent = document.getElementById(parent);
	}
	this.dhx_Event();
	this.optionType = (optionType != window.undefined && dhtmlXCombo_optionTypes[optionType]) ? optionType
			: "default";
	this._optionObject = dhtmlXCombo_optionTypes[this.optionType];
	this._disabled = false;
	if (parent.style.direction == "rtl") {
		this.rtl = true;
	} else {
		this.rtl = false;
	}
	if (!window.dhx_glbSelectAr) {
		window.dhx_glbSelectAr = new Array();
		window.dhx_openedSelect = null;
		window.dhx_SelectId = 1;
		dhtmlxEvent(document.body, "click", this.closeAll);
		dhtmlxEvent(document.body, "keydown", function(e) {
			try {
				if ((e || event).keyCode == 9) {
					window.dhx_glbSelectAr[0].closeAll();
				}
			} catch (e) {
			}
			return true;
		});
	}
	if (parent.tagName == "SELECT") {
		return dhtmlXComboFromSelect(parent);
	} else {
		this._createSelf(parent, name, width, tabIndex);
	}
	dhx_glbSelectAr.push(this);
}
dhtmlXCombo.prototype.setSize = function(new_size) {
	this.DOMlist.style.width = new_size + "px";
	if (this.DOMlistF) {
		this.DOMlistF.style.width = new_size + "px";
	}
	this.DOMelem.style.width = new_size + "px";
	this.DOMelem_input.style.width = (new_size - 19) + "px";
};
dhtmlXCombo.prototype.enableFilteringMode = function(mode, url, cache,
		autosubload) {
	this._filter = convertStringToBoolean(mode);
	if (url) {
		this._xml = url;
		this._autoxml = convertStringToBoolean(autosubload);
	}
	if (convertStringToBoolean(cache)) {
		this._xmlCache = [];
	}
};
dhtmlXCombo.prototype.setFilteringParam = function(name, value) {
	if (!this._prs) {
		this._prs = [];
	}
	this._prs.push([ name, value ]);
};
dhtmlXCombo.prototype.disable = function(mode) {
	var z = convertStringToBoolean(mode);
	if (this._disabled == z) {
		return;
	}
	this.DOMelem_input.disabled = z;
	this._disabled = z;
};
dhtmlXCombo.prototype.readonly = function(mode, autosearch) {
	this.DOMelem_input.readOnly = mode ? true : false;
	if (autosearch === false || mode === false) {
		this.DOMelem.onkeyup = function(ev) {
		};
	} else {
		var that = this;
		this.DOMelem.onkeyup = function(ev) {
			ev = ev || window.event;
			if (ev.keyCode != 9) {
				ev.cancelBubble = true;
			}
			if ((ev.keyCode >= 48 && ev.keyCode <= 57)
					|| (ev.keyCode >= 65 && ev.keyCode <= 90)) {
				for ( var i = 0; i < that.optionsArr.length; i++) {
					var text = that.optionsArr[i].text;
					if (text.toString().toUpperCase().indexOf(
							String.fromCharCode(ev.keyCode)) == 0) {
						that.selectOption(i);
						break;
					}
				}
				ev.cancelBubble = true;
			}
		};
	}
};
dhtmlXCombo.prototype.getOption = function(value) {
	for ( var i = 0; i < this.optionsArr.length; i++) {
		if (this.optionsArr[i].value == value) {
			return this.optionsArr[i];
		}
	}
	return null;
};
dhtmlXCombo.prototype.getOptionByLabel = function(value) {
	value = value.replace(/&/g, "&amp;");
	for ( var i = 0; i < this.optionsArr.length; i++) {
		if (this.optionsArr[i].text == value) {
			return this.optionsArr[i];
		}
	}
	return null;
};
dhtmlXCombo.prototype.getOptionByIndex = function(ind) {
	return this.optionsArr[ind];
};
dhtmlXCombo.prototype.clearAll = function(all) {
	if (all) {
		this.setComboText("");
	}
	this.optionsArr = new Array();
	this.redrawOptions();
	if (all) {
		this._confirmSelection();
	}
};
dhtmlXCombo.prototype.deleteOption = function(value) {
	var ind = this.getIndexByValue(value);
	if (ind < 0) {
		return;
	}
	if (this.optionsArr[ind] == this._selOption) {
		this._selOption = null;
	}
	this.optionsArr.splice(ind, 1);
	this.redrawOptions();
};
dhtmlXCombo.prototype.render = function(mode) {
	this._skiprender = (!convertStringToBoolean(mode));
	this.redrawOptions();
	this.unSelectOption();
};
dhtmlXCombo.prototype.updateOption = function(oldvalue, avalue, atext, acss) {
	var dOpt = this.getOption(oldvalue);
	if (typeof (avalue) != "object") {
		avalue = {
			text : atext,
			value : avalue,
			css : acss
		};
	}
	dOpt.setValue(avalue);
	this.redrawOptions();
};
dhtmlXCombo.prototype.addOption = function(options) {
	if (!arguments[0].length || typeof (arguments[0]) != "object") {
		args = [ arguments ];
	} else {
		args = options;
	}
	this.render(false);
	for ( var i = 0; i < args.length; i++) {
		var attr = args[i];
		if (attr.length) {
			attr.value = attr[0] || "";
			attr.text = attr[1] || "";
			attr.css = attr[2] || "";
		}
		this._addOption(attr);
	}
	this.render(true);
};
dhtmlXCombo.prototype._addOption = function(attr) {
	dOpt = new this._optionObject();
	this.optionsArr.push(dOpt);
	dOpt.setValue.apply(dOpt, [ attr ]);
	this.redrawOptions();
};
dhtmlXCombo.prototype.getIndexByValue = function(val) {
	for ( var i = 0; i < this.optionsArr.length; i++) {
		if (this.optionsArr[i].value == val) {
			return i;
		}
	}
	return -1;
};
dhtmlXCombo.prototype.getSelectedValue = function() {
	return (this._selOption ? this._selOption.value : null);
};
dhtmlXCombo.prototype.getComboText = function() {
	return this.DOMelem_input.value;
};
dhtmlXCombo.prototype.ls_selectAll = function() {
	this.DOMelem_input.select();
};
dhtmlXCombo.prototype.setComboText = function(text) {
	this.DOMelem_input.value = text;
};
dhtmlXCombo.prototype.setComboValue = function(text) {
	this.setComboText(text);
	for ( var i = 0; i < this.optionsArr.length; i++) {
		if (this.optionsArr[i].data()[0] == text) {
			return this.selectOption(i, null, true);
		}
	}
	this.DOMelem_hidden_input.value = text;
};
dhtmlXCombo.prototype.getActualValue = function() {
	return this.DOMelem_hidden_input.value;
};
dhtmlXCombo.prototype.getSelectedText = function() {
	return (this._selOption ? this._selOption.text : "");
};
dhtmlXCombo.prototype.getSelectedIndex = function() {
	for ( var i = 0; i < this.optionsArr.length; i++) {
		if (this.optionsArr[i] == this._selOption) {
			return i;
		}
	}
	return -1;
};
dhtmlXCombo.prototype.setName = function(name) {
	this.DOMelem_hidden_input.name = name;
	this.DOMelem_hidden_input2 = name + "_new_value";
	this.name = name;
};
dhtmlXCombo.prototype.show = function(mode) {
	if (convertStringToBoolean(mode)) {
		this.DOMelem.style.display = "";
	} else {
		this.DOMelem.style.display = "none";
	}
};
dhtmlXCombo.prototype.destructor = function() {
	var _sID = this._inID;
	this.DOMParent.removeChild(this.DOMelem);
	this.DOMlist.parentNode.removeChild(this.DOMlist);
	var s = dhx_glbSelectAr;
	this.DOMParent = this.DOMlist = this.DOMelem = 0;
	this.DOMlist.combo = this.DOMelem.combo = 0;
	for ( var i = 0; i < s.length; i++) {
		if (s[i]._inID == _sID) {
			s[i] = null;
			s.splice(i, 1);
			return;
		}
	}
};
dhtmlXCombo.prototype._createSelf = function(selParent, name, width, tab) {
	if (width.toString().indexOf("%") != -1) {
		var self = this;
		var resWidht = parseInt(width) / 100;
		window.setInterval(function() {
			if (!selParent.parentNode) {
				return;
			}
			var ts = selParent.parentNode.offsetWidth * resWidht - 2;
			if (ts < 0) {
				return;
			}
			if (ts == self._lastTs) {
				return;
			}
			self.setSize(self._lastTs = ts);
		}, 500);
		var width = parseInt(selParent.offsetWidth);
	}
	var width = parseInt(width || 100);
	this.ListPosition = "Bottom";
	this.DOMParent = selParent;
	this._inID = null;
	this.name = name;
	this._selOption = null;
	this.optionsArr = Array();
	var opt = new this._optionObject();
	opt.DrawHeader(this, name, width, tab);
	this.DOMlist = document.createElement("DIV");
	this.DOMlist.className = "dhx_combo_list";
	if (this.rtl) {
		this.DOMlist.className = "dhx_combo_list_rtl";
	}
	this.DOMlist.style.width = width - (_isIE ? 0 : 0) + "px";
	if (_isOpera || _isKHTML) {
		this.DOMlist.style.overflow = "auto";
	}
	this.DOMlist.style.display = "none";
	document.body.insertBefore(this.DOMlist, document.body.firstChild);
	if (_isIE) {
		this.DOMlistF = document.createElement("IFRAME");
		this.DOMlistF.style.border = "0px";
		this.DOMlistF.className = "dhx_combo_list";
		this.DOMlistF.style.width = width - (_isIE ? 0 : 0) + "px";
		this.DOMlistF.style.display = "none";
		this.DOMlistF.src = "javascript:false;";
		document.body.insertBefore(this.DOMlistF, document.body.firstChild);
	}
	this.DOMlist.combo = this.DOMelem.combo = this;
	this.DOMelem_input.onkeydown = this._onKey;
	this.DOMelem_input.onkeypress = this._onKeyF;
	this.DOMelem_input.onblur = this._onBlur;
	this.DOMelem.onclick = this._toggleSelect;
	this.DOMlist.onclick = this._selectOption;
	this.DOMlist.onmousedown = function() {
		this._skipBlur = true;
	};
	this.DOMlist.onkeydown = function(e) {
		this.combo.DOMelem_input.focus();
		(e || event).cancelBubble = true;
		this.combo.DOMelem_input.onkeydown(e);
	};
	this.DOMlist.onmouseover = this._listOver;
};
dhtmlXCombo.prototype._listOver = function(e) {
	e = e || event;
	e.cancelBubble = true;
	var node = (_isIE ? event.srcElement : e.target);
	var that = this.combo;
	if (node.parentNode == that.DOMlist) {
		if (that._selOption) {
			that._selOption.deselect();
		}
		if (that._tempSel) {
			that._tempSel.deselect();
		}
		var i = 0;
		for (i; i < that.DOMlist.childNodes.length; i++) {
			if (that.DOMlist.childNodes[i] == node) {
				break;
			}
		}
		var z = that.optionsArr[i];
		that._tempSel = z;
		that._tempSel.select();
		if ((that._autoxml) && ((i + 1) == that._lastLength)) {
			that._fetchOptions(i + 1, that._lasttext || "");
		}
	}
};
dhtmlXCombo.prototype._positList = function() {
	var pos = this.getPosition(this.DOMelem);
	if (this.ListPosition == "Bottom") {
		this.DOMlist.style.top = pos[1] + this.DOMelem.offsetHeight + "px";
		this.DOMlist.style.left = pos[0] + "px";
	} else {
		if (this.ListPosition == "Top") {
			this.DOMlist.style.top = pos[1] - this.DOMlist.offsetHeight + "px";
			this.DOMlist.style.left = pos[0] + "px";
		} else {
			this.DOMlist.style.top = pos[1] + "px";
			this.DOMlist.style.left = pos[0] + this.DOMelem.offsetWidth + "px";
		}
	}
};
dhtmlXCombo.prototype.getPosition = function(oNode, pNode) {
	if (!pNode) {
		var pNode = document.body;
	}
	var oCurrentNode = oNode;
	var iLeft = 0;
	var iTop = 0;
	while ((oCurrentNode) && (oCurrentNode != pNode)) {
		iLeft += oCurrentNode.offsetLeft - oCurrentNode.scrollLeft;
		iTop += oCurrentNode.offsetTop - oCurrentNode.scrollTop;
		oCurrentNode = oCurrentNode.offsetParent;
	}
	if (pNode == document.body) {
		if (_isIE) {
			if (document.documentElement.scrollTop) {
				iTop += document.documentElement.scrollTop;
			}
			if (document.documentElement.scrollLeft) {
				iLeft += document.documentElement.scrollLeft;
			}
		} else {
			if (!_isFF) {
				iLeft += document.body.offsetLeft;
				iTop += document.body.offsetTop;
			}
		}
	}
	return new Array(iLeft, iTop);
};
dhtmlXCombo.prototype._correctSelection = function() {
	if (this.getComboText() != "") {
		for ( var i = 0; i < this.optionsArr.length; i++) {
			if (!this.optionsArr[i].isHidden()) {
				return this.selectOption(i, true, false);
			}
		}
	}
	this.unSelectOption();
};
dhtmlXCombo.prototype.selectNext = function(step) {
	var z = this.getSelectedIndex() + step;
	while (this.optionsArr[z]) {
		if (!this.optionsArr[z].isHidden()) {
			return this.selectOption(z, false, false);
		}
		z += step;
	}
};
dhtmlXCombo.prototype._onKeyF = function(e) {
	var that = this.parentNode.combo;
	var ev = e || event;
	ev.cancelBubble = true;
	if (ev.keyCode == "13" || ev.keyCode == "9") {
		that._confirmSelection();
		that.closeAll();
	} else {
		if (ev.keyCode == "27") {
			that._resetSelection();
			that.closeAll();
		} else {
			that._activeMode = true;
		}
	}
	if (ev.keyCode == "13" || ev.keyCode == "27") {
		that.callEvent("onKeyPressed", [ ev.keyCode ]);
		return false;
	}
	return true;
};
dhtmlXCombo.prototype._onKey = function(e) {
	var that = this.parentNode.combo;
	(e || event).cancelBubble = true;
	var ev = (e || event).keyCode;
	if (ev > 15 && ev < 19) {
		return true;
	}
	if (ev == 27) {
		return;
	}
	if ((that.DOMlist.style.display != "block") && (ev != "13") && (ev != "9")
			&& ((!that._filter) || (that._filterAny))) {
		that.DOMelem.onclick(e || event);
	}
	if ((ev != "13") && (ev != "9")) {
		window.setTimeout(function() {
			that._onKeyB(ev);
		}, 1);
		if (ev == "40" || ev == "38") {
			return false;
		}
	} else {
		if (ev == 9) {
			that.closeAll();
			(e || event).cancelBubble = false;
		}
	}
};
dhtmlXCombo.prototype._onKeyB = function(ev) {
	if (ev == "40") {
		var z = this.selectNext(1);
	} else {
		if (ev == "38") {
			this.selectNext(-1);
		} else {
			this.callEvent("onKeyPressed", [ ev ]);
			if (this._filter) {
				return this.filterSelf((ev == 8) || (ev == 46));
			}
			for ( var i = 0; i < this.optionsArr.length; i++) {
				if (this.optionsArr[i].data()[1] == this.DOMelem_input.value) {
					this.selectOption(i, false, false);
					return false;
				}
			}
			this.unSelectOption();
		}
	}
	return true;
};
dhtmlXCombo.prototype._onBlur = function() {
	var self = this.parentNode._self;
	window.setTimeout(function() {
		if (self.DOMlist._skipBlur) {
			return !(self.DOMlist._skipBlur = false);
		}
		self._confirmSelection();
		self.callEvent("onBlur", []);
	}, 100);
};
dhtmlXCombo.prototype.redrawOptions = function() {
	if (this._skiprender) {
		return;
	}
	for ( var i = this.DOMlist.childNodes.length - 1; i >= 0; i--) {
		this.DOMlist.removeChild(this.DOMlist.childNodes[i]);
	}
	for ( var i = 0; i < this.optionsArr.length; i++) {
		this.DOMlist.appendChild(this.optionsArr[i].render());
	}
};
dhtmlXCombo.prototype.loadXML = function(url, afterCall) {
	this._load = true;
	if ((this._xmlCache) && (this._xmlCache[url])) {
		this._fillFromXML(this, null, null, null, this._xmlCache[url]);
		if (afterCall) {
			afterCall();
		}
	} else {
		var xml = (new dtmlXMLLoaderObject(this._fillFromXML, this, true, true));
		if (afterCall) {
			xml.waitCall = afterCall;
		}
		if (this._prs) {
			for ( var i = 0; i < this._prs.length; i++) {
				url += [ getUrlSymbol(url), escape(this._prs[i][0]), "=",
						escape(this._prs[i][1]) ].join("");
			}
		}
		xml._cPath = url;
		xml.loadXML(url);
	}
};
dhtmlXCombo.prototype.loadXMLString = function(astring) {
	var xml = (new dtmlXMLLoaderObject(this._fillFromXML, this, true, true));
	xml.loadXMLString(astring);
};
dhtmlXCombo.prototype._fillFromXML = function(obj, b, c, d, xml) {
	if (obj._xmlCache) {
		obj._xmlCache[xml._cPath] = xml;
	}
	var toptag = xml.getXMLTopNode("complete");
	if (toptag.tagName != "complete") {
		return;
	}
	var top = xml.doXPath("//complete");
	var options = xml.doXPath("//option");
	obj.render(false);
	if ((!top[0]) || (!top[0].getAttribute("add"))) {
		obj.clearAll();
		obj._lastLength = options.length;
		if (obj._xml) {
			if ((!options) || (!options.length)) {
				obj.closeAll();
			} else {
				if (obj._activeMode) {
					obj._positList();
					obj.DOMlist.style.display = "block";
					if (_isIE) {
						obj._IEFix(true);
					}
				}
			}
		}
	} else {
		obj._lastLength += options.length;
	}
	for ( var i = 0; i < options.length; i++) {
		var attr = new Object();
		attr.text = options[i].firstChild ? options[i].firstChild.nodeValue
				: "";
		for ( var j = 0; j < options[i].attributes.length; j++) {
			var a = options[i].attributes[j];
			if (a) {
				attr[a.nodeName] = a.nodeValue;
			}
		}
		obj._addOption(attr);
	}
	obj.render(true);
	if ((obj._load) && (obj._load !== true)) {
		obj.loadXML(obj._load);
	} else {
		obj._load = false;
		if ((!obj._lkmode) && (!obj._filter)) {
			obj._correctSelection();
			obj.unSelectOption();
		}
	}
	var selected = xml.doXPath("//option[@selected]");
	if (selected.length) {
		obj.selectOption(
				obj.getIndexByValue(selected[0].getAttribute("value")), false,
				true);
	}
};
dhtmlXCombo.prototype.unSelectOption = function() {
	if (this._selOption) {
		this._selOption.deselect();
	}
	this._selOption = null;
};
dhtmlXCombo.prototype._confirmSelection = function(data, status) {
	if (arguments.length == 0) {
		var z = this.getOptionByLabel(this.DOMelem_input.value);
		data = z ? z.value : this.DOMelem_input.value;
		status = (z == null);
		if (data == this.getActualValue()) {
			return;
		}
	}
	this.DOMelem_hidden_input.value = data;
	this.DOMelem_hidden_input2.value = (status ? "true" : "false");
	this.callEvent("onChange", []);
	this._activeMode = false;
};
dhtmlXCombo.prototype._resetSelection = function(data, status) {
	var z = this.getOption(this.DOMelem_hidden_input.value);
	this.setComboValue(z ? z.data()[0] : this.DOMelem_hidden_input.value);
	this.setComboText(z ? z.data()[1] : this.DOMelem_hidden_input.value);
};
dhtmlXCombo.prototype.selectOption = function(ind, filter, conf) {
	if (arguments.length < 3) {
		conf = true;
	}
	this.unSelectOption();
	var z = this.optionsArr[ind];
	if (!z) {
		return;
	}
	this._selOption = z;
	this._selOption.select();
	var corr = this._selOption.content.offsetTop
			+ this._selOption.content.offsetHeight - this.DOMlist.scrollTop
			- this.DOMlist.offsetHeight;
	if (corr > 0) {
		this.DOMlist.scrollTop += corr;
	}
	corr = this.DOMlist.scrollTop - this._selOption.content.offsetTop;
	if (corr > 0) {
		this.DOMlist.scrollTop -= corr;
	}
	var data = this._selOption.data();
	if (conf) {
		this.setComboText(data[1]);
		this._confirmSelection(data[0], false);
	}
	if ((this._autoxml) && ((ind + 1) == this._lastLength)) {
		this._fetchOptions(ind + 1, this._lasttext || "");
	}
	if (filter) {
	} else {
		this.setComboText(data[1]);
	}
	this._selOption.RedrawHeader(this);
	this.callEvent("onSelectionChange", []);
};
dhtmlXCombo.prototype._selectOption = function(e) {
	(e || event).cancelBubble = true;
	var node = (_isIE ? event.srcElement : e.target);
	var that = this.combo;
	while (!node._self) {
		node = node.parentNode;
		if (!node) {
			return;
		}
	}
	var i = 0;
	for (i; i < that.DOMlist.childNodes.length; i++) {
		if (that.DOMlist.childNodes[i] == node) {
			break;
		}
	}
	that.selectOption(i, false, true);
	that.closeAll();
	that.callEvent("onBlur", []);
	that._activeMode = false;
};
dhtmlXCombo.prototype.openSelect = function() {
	if (this._disabled) {
		return;
	}
	this.closeAll();
	this._positList();
	this.DOMlist.style.display = "block";
	this.callEvent("onOpen", []);
	if (this._tempSel) {
		this._tempSel.deselect();
	}
	if (this._selOption) {
		this._selOption.select();
	}
	if (this._selOption) {
		var corr = this._selOption.content.offsetTop
				+ this._selOption.content.offsetHeight - this.DOMlist.scrollTop
				- this.DOMlist.offsetHeight;
		if (corr > 0) {
			this.DOMlist.scrollTop += corr;
		}
		corr = this.DOMlist.scrollTop - this._selOption.content.offsetTop;
		if (corr > 0) {
			this.DOMlist.scrollTop -= corr;
		}
	}
	if (_isIE) {
		this._IEFix(true);
	}
	this.DOMelem_input.focus();
	if (this._filter) {
		this.filterSelf();
	}
};
dhtmlXCombo.prototype._toggleSelect = function(e) {
	var that = this.combo;
	if (that.DOMlist.style.display == "block") {
		that.closeAll();
	} else {
		that.openSelect();
	}
	(e || event).cancelBubble = true;
};
dhtmlXCombo.prototype._fetchOptions = function(ind, text) {
	if (text == "") {
		this.closeAll();
		return this.clearAll();
	}
	var url = this._xml + ((this._xml.indexOf("?") != -1) ? "&" : "?") + "pos="
			+ ind + "&mask=" + encodeURIComponent(text);
	this._lasttext = text;
	if (this._load) {
		this._load = url;
	} else {
		this.loadXML(url);
	}
};
dhtmlXCombo.prototype.filterSelf = function(mode) {
	var text = this.getComboText();
	if (this._xml) {
		this._lkmode = mode;
		this._fetchOptions(0, text);
	}
	try {
		var filter = new RegExp("^" + text, "i");
	} catch (e) {
		var filter = new RegExp("^"
				+ text.replace(/([\[\]\{\}\(\)\+\*\\])/g, "\\$1"));
	}
	this.filterAny = false;
	for ( var i = 0; i < this.optionsArr.length; i++) {
		var z = filter.test(this.optionsArr[i].text);
		for ( var j = 0; j < this.optionsArr[i].text.length; j++) {
			if (this.optionsArr[i].text.charAt(j) == "/") {
				this.optionsArr[i].text2 = this.optionsArr[i].text.substring(
						j + 1, this.optionsArr[i].text.length);
				var z2 = filter.test(this.optionsArr[i].text2);
				z = z || z2;
			}
		}
		this.filterAny |= z;
		this.optionsArr[i].hide(!z);
	}
	if (!this.filterAny) {
		this.closeAll();
		this._activeMode = true;
	} else {
		if (this.DOMlist.style.display != "block") {
			this.openSelect();
		}
		if (_isIE) {
			this._IEFix(true);
		}
	}
	if (!mode) {
		this._correctSelection();
	} else {
		this.unSelectOption();
	}
};
dhtmlXCombo.prototype._IEFix = function(mode) {
	this.DOMlistF.style.display = (mode ? "block" : "none");
	this.DOMlistF.style.top = this.DOMlist.style.top;
	this.DOMlistF.style.left = this.DOMlist.style.left;
};
dhtmlXCombo.prototype.closeAll = function() {
	if (window.dhx_glbSelectAr) {
		for ( var i = 0; i < dhx_glbSelectAr.length; i++) {
			if (dhx_glbSelectAr[i].DOMlist.style.display == "block") {
				dhx_glbSelectAr[i].DOMlist.style.display = "none";
				if (_isIE) {
					dhx_glbSelectAr[i]._IEFix(false);
				}
			}
			dhx_glbSelectAr[i]._activeMode = false;
		}
	}
};
dhtmlXCombo_defaultOption = function() {
	this.init();
};
dhtmlXCombo_defaultOption.prototype.init = function() {
	this.value = null;
	this.text = "";
	this.selected = false;
	this.css = "";
};
dhtmlXCombo_defaultOption.prototype.select = function() {
	if (this.content) {
		this.content.className = "dhx_selected_option";
	}
};
dhtmlXCombo_defaultOption.prototype.hide = function(mode) {
	this.render().style.display = mode ? "none" : "";
};
dhtmlXCombo_defaultOption.prototype.isHidden = function() {
	return (this.render().style.display == "none");
};
dhtmlXCombo_defaultOption.prototype.deselect = function() {
	if (this.content) {
		this.render();
	}
	this.content.className = "";
};
dhtmlXCombo_defaultOption.prototype.setValue = function(attr) {
	this.value = attr.value || "";
	this.text = attr.text || "";
	this.css = attr.css || "";
	this.content = null;
};
dhtmlXCombo_defaultOption.prototype.render = function() {
	if (!this.content) {
		this.content = document.createElement("DIV");
		this.content._self = this;
		this.content.style.cssText = "width:100%;overflow:hidden;" + this.css;
		if (_isOpera || _isKHTML) {
			this.content.style.padding = "2px 0px 2px 0px";
		}
		this.content.innerHTML = this.text;
		this._ctext = _isIE ? this.content.innerText : this.content.textContent;
	}
	return this.content;
};
dhtmlXCombo_defaultOption.prototype.data = function() {
	if (this.content) {
		return [ this.value, this._ctext ? this._ctext : this.text ];
	}
};
dhtmlXCombo_defaultOption.prototype.DrawHeader = function(self, name, width,
		tab) {
	var z = document.createElement("DIV");
	z.style.width = width + "px";
	z.className = "dhx_combo_box";
	z._self = self;
	self.DOMelem = z;
	this._DrawHeaderInput(self, name, width, tab);
	this._DrawHeaderButton(self, name, width);
	self.DOMParent.appendChild(self.DOMelem);
};
dhtmlXCombo_defaultOption.prototype._DrawHeaderInput = function(self, name,
		width, tab) {
	if (self.rtl && _isIE) {
		var z = document.createElement("textarea");
		z.style.overflow = "hidden";
		z.style.whiteSpace = "nowrap";
	} else {
		var z = document.createElement("input");
		z.setAttribute("autocomplete", "off");
		z.type = "text";
	}
	z.className = "dhx_combo_input";
	if (self.rtl) {
		z.style.left = "18px";
		z.style.direction = "rtl";
		z.style.unicodeBidi = "bidi-override";
	}
	if (tab) {
		z.tabIndex = tab;
	}
	z.style.width = (width - 19) + "px";
	self.DOMelem.appendChild(z);
	self.DOMelem_input = z;
	z = document.createElement("input");
	z.type = "hidden";
	z.name = name;
	self.DOMelem.appendChild(z);
	self.DOMelem_hidden_input = z;
	z = document.createElement("input");
	z.type = "hidden";
	z.name = name + "_new_value";
	z.value = "true";
	self.DOMelem.appendChild(z);
	self.DOMelem_hidden_input2 = z;
};
dhtmlXCombo_defaultOption.prototype._DrawHeaderButton = function(self, name,
		width) {
	var z = document.createElement("img");
	z.className = (self.rtl) ? "dhx_combo_img_rtl" : "dhx_combo_img";
	z.src = (window.dhx_globalImgPath ? dhx_globalImgPath : "")
			+ "combo_select.gif";
	self.DOMelem.appendChild(z);
	self.DOMelem_button = z;
};
dhtmlXCombo_defaultOption.prototype.RedrawHeader = function(self) {
};
dhtmlXCombo_optionTypes["default"] = dhtmlXCombo_defaultOption;
dhtmlXCombo.prototype.dhx_Event = function() {
	this.dhx_SeverCatcherPath = "";
	this.attachEvent = function(original, catcher, CallObj) {
		CallObj = CallObj || this;
		original = "ev_" + original;
		if ((!this[original]) || (!this[original].addEvent)) {
			var z = new this.eventCatcher(CallObj);
			z.addEvent(this[original]);
			this[original] = z;
		}
		return (original + ":" + this[original].addEvent(catcher));
	};
	this.callEvent = function(name, arg0) {
		if (this["ev_" + name]) {
			return this["ev_" + name].apply(this, arg0);
		}
		return true;
	};
	this.checkEvent = function(name) {
		if (this["ev_" + name]) {
			return true;
		}
		return false;
	};
	this.eventCatcher = function(obj) {
		var dhx_catch = new Array();
		var m_obj = obj;
		var func_server = function(catcher, rpc) {
			catcher = catcher.split(":");
			var postVar = "";
			var postVar2 = "";
			var target = catcher[1];
			if (catcher[1] == "rpc") {
				postVar = '<?xml version="1.0"?><methodCall><methodName>'
						+ catcher[2] + "</methodName><params>";
				postVar2 = "</params></methodCall>";
				target = rpc;
			}
			var z = function() {
			};
			return z;
		};
		var z = function() {
			if (dhx_catch) {
				var res = true;
			}
			for ( var i = 0; i < dhx_catch.length; i++) {
				if (dhx_catch[i] != null) {
					var zr = dhx_catch[i].apply(m_obj, arguments);
					res = res && zr;
				}
			}
			return res;
		};
		z.addEvent = function(ev) {
			if (typeof (ev) != "function") {
				if (ev && ev.indexOf && ev.indexOf("server:") == 0) {
					ev = new func_server(ev, m_obj.rpcServer);
				} else {
					ev = eval(ev);
				}
			}
			if (ev) {
				return dhx_catch.push(ev) - 1;
			}
			return false;
		};
		z.removeEvent = function(id) {
			dhx_catch[id] = null;
		};
		return z;
	};
	this.detachEvent = function(id) {
		if (id != false) {
			var list = id.split(":");
			this[list[0]].removeEvent(list[1]);
		}
	};
};
dhtmlXCombo.prototype.enableOptionAutoPositioning = function(fl) {
	if (!this.ListAutoPosit) {
		this.ListAutoPosit = 1;
	}
	this.attachEvent("onOpen", function() {
		this._setOptionAutoPositioning(fl);
	});
};
dhtmlXCombo.prototype._setOptionAutoPositioning = function(fl) {
	if ((typeof (fl) != "undefined") && (!convertStringToBoolean(fl))) {
		this.ListPosition = "Bottom";
		this.ListAutoPosit = 0;
		return true;
	}
	var pos = this.getPosition(this.DOMelem);
	var bottom = this._getClientHeight() - pos[1] - this.DOMelem.offsetHeight;
	var height = (this.autoHeight) ? (this.DOMlist.scrollHeight)
			: parseInt(this.DOMlist.offsetHeight);
	if ((bottom < height) && (pos[1] > height)) {
		this.ListPosition = "Top";
	} else {
		this.ListPosition = "Bottom";
	}
	this._positList();
};
dhtmlXCombo.prototype._getClientHeight = function() {
	return ((document.compatMode == "CSS1Compat") && (!window.opera)) ? document.documentElement.clientHeight
			: document.body.clientHeight;
};
dhtmlXCombo.prototype.setOptionWidth = function(width) {
	if (arguments.length > 0) {
		this.DOMlist.style.width = width + "px";
		if (this.DOMlistF) {
			this.DOMlistF.style.width = width + "px";
		}
	}
};
dhtmlXCombo.prototype.setOptionHeight = function(height) {
	if (arguments.length > 0) {
		if (_isIE) {
			this.DOMlist.style.height = this.DOMlistF.style.height = height
					+ "px";
		} else {
			this.DOMlist.style.height = height + "px";
		}
		this._positList();
	}
};
dhtmlXCombo.prototype.enableOptionAutoWidth = function(fl) {
	if (!this._listWidthConf) {
		this._listWidthConf = parseInt(this.DOMlist.style.width);
	}
	if (arguments.length == 0) {
		var fl = 1;
	}
	if (convertStringToBoolean(fl)) {
		this.autoOptionWidth = 1;
		awOnOpen = this.attachEvent("onOpen", function() {
			this._setOptionAutoWidth();
		});
	} else {
		if (typeof (awOnOpen) != "undefined") {
			this.autoOptionWidth = 0;
			this.detachEvent(awOnOpen);
			this.setOptionWidth(this._listWidthConf);
		}
	}
};
dhtmlXCombo.prototype._setOptionAutoWidth = function() {
	this.setOptionWidth(1);
	var x = this.DOMlist.offsetWidth;
	for ( var i = 0; i < this.optionsArr.length; i++) {
		var optWidth = (_isFF) ? (this.DOMlist.childNodes[i].scrollWidth - 2)
				: this.DOMlist.childNodes[i].scrollWidth;
		if (optWidth > x) {
			x = this.DOMlist.childNodes[i].scrollWidth;
		}
	}
	this.setOptionWidth(x);
};
dhtmlXCombo.prototype.enableOptionAutoHeight = function(fl, maxHeight) {
	if (!this._listHeightConf) {
		this._listHeightConf = (this.DOMlist.style.height == "") ? 100
				: parseInt(this.DOMlist.style.height);
	}
	if (arguments.length == 0) {
		var fl = 1;
	}
	this.autoHeight = convertStringToBoolean(fl);
	if (this.autoHeight) {
		ahOnOpen = this.attachEvent("onOpen", function() {
			this._setOptionAutoHeight(fl, maxHeight);
			if (_isIE) {
				this._setOptionAutoHeight(fl, maxHeight);
			}
		});
	} else {
		if (typeof (ahOnOpen) != "undefined") {
			this.detachEvent(ahOnOpen);
			this.setOptionHeight(this._listHeightConf);
		}
	}
};
dhtmlXCombo.prototype._setOptionAutoHeight = function(fl, maxHeight) {
	if (convertStringToBoolean(fl)) {
		this.setOptionHeight(1);
		var height = 0;
		if (this.optionsArr.length > 0) {
			if (this.DOMlist.scrollHeight > this.DOMlist.offsetHeight) {
				height = this.DOMlist.scrollHeight + 2;
			} else {
				height = this.DOMlist.offsetHeight;
			}
			if ((arguments.length > 1) && (maxHeight)) {
				var maxHeight = parseInt(maxHeight);
				height = (height > maxHeight) ? maxHeight : height;
			}
			this.setOptionHeight(height);
		}
	}
};
var globalActiveDHTMLGridObject;
String.prototype._dhx_trim = function() {
	return this.replace(/&nbsp;/g, " ").replace(/(^[ \t]*)|([ \t]*$)/g, "");
};
function dhtmlxArray(ar) {
	return dhtmlXHeir((ar || new Array()), dhtmlxArray._master);
}
dhtmlxArray._master = {
	_dhx_find : function(pattern) {
		for ( var i = 0; i < this.length; i++) {
			if (pattern == this[i]) {
				return i;
			}
		}
		return -1;
	},
	_dhx_insertAt : function(ind, value) {
		this[this.length] = null;
		for ( var i = this.length - 1; i >= ind; i--) {
			this[i] = this[i - 1];
		}
		this[ind] = value;
	},
	_dhx_removeAt : function(ind) {
		this.splice(ind, 1);
	},
	_dhx_swapItems : function(ind1, ind2) {
		var tmp = this[ind1];
		this[ind1] = this[ind2];
		this[ind2] = tmp;
	}
};
function dhtmlXGridObject(id) {
	if (_isIE) {
		try {
			document.execCommand("BackgroundImageCache", false, true);
		} catch (e) {
		}
	}
	if (id) {
		if (typeof (id) == "object") {
			this.entBox = id;
			this.entBox.id = "cgrid2_" + this.uid();
		} else {
			this.entBox = document.getElementById(id);
		}
	} else {
		this.entBox = document.createElement("DIV");
		this.entBox.id = "cgrid2_" + this.uid();
	}
	this.dhx_Event();
	var self = this;
	this._wcorr = 0;
	this.cell = null;
	this.row = null;
	this.editor = null;
	this._f2kE = true;
	this._dclE = true;
	this.combos = new Array(0);
	this.defVal = new Array(0);
	this.rowsAr = {};
	this.rowsBuffer = dhtmlxArray();
	this.rowsCol = dhtmlxArray();
	this._data_cache = {};
	this._ecache = {};
	this._ud_enabled = true;
	this.xmlLoader = new dtmlXMLLoaderObject(this.doLoadDetails, this, true,
			this.no_cashe);
	this._maskArr = [];
	this.selectedRows = dhtmlxArray();
	this.UserData = {};
	this.entBox.className += " gridbox";
	this.entBox.style.width = this.entBox.getAttribute("width")
			|| (window.getComputedStyle ? (this.entBox.style.width || window
					.getComputedStyle(this.entBox, null)["width"])
					: (this.entBox.currentStyle ? this.entBox.currentStyle["width"]
							: this.entBox.style.width || 0)) || "100%";
	this.entBox.style.height = this.entBox.getAttribute("height")
			|| (window.getComputedStyle ? (this.entBox.style.height || window
					.getComputedStyle(this.entBox, null)["height"])
					: (this.entBox.currentStyle ? this.entBox.currentStyle["height"]
							: this.entBox.style.height || 0)) || "100%";
	this.entBox.style.cursor = "default";
	this.entBox.onselectstart = function() {
		return false;
	};
	this.obj = document.createElement("TABLE");
	this.obj.cellSpacing = 0;
	this.obj.cellPadding = 0;
	this.obj.style.width = "100%";
	this.obj.style.tableLayout = "fixed";
	this.obj.className = "c_obj".substr(2);
	this.hdr = document.createElement("TABLE");
	this.hdr.style.border = "1px solid gray";
	this.hdr.cellSpacing = 0;
	this.hdr.cellPadding = 0;
	if ((!_isOpera) || (_OperaRv >= 8.5)) {
		this.hdr.style.tableLayout = "fixed";
	}
	this.hdr.className = "c_hdr".substr(2);
	this.hdr.width = "100%";
	this.xHdr = document.createElement("TABLE");
	this.xHdr.className = "xhdr";
	this.xHdr.cellPadding = 0;
	this.xHdr.cellSpacing = 0;
	this.xHdr.style.width = "100%";
	var r = this.xHdr.insertRow(0);
	var c = r.insertCell(0);
	r.insertCell(1).innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
	r.childNodes[1].style.width = "100%";
	c.appendChild(this.hdr);
	this.objBuf = document.createElement("DIV");
	this.objBuf.appendChild(this.obj);
	this.entCnt = document.createElement("TABLE");
	this.entCnt.insertRow(0).insertCell(0);
	this.entCnt.insertRow(1).insertCell(0);
	this.entCnt.cellPadding = 0;
	this.entCnt.cellSpacing = 0;
	this.entCnt.width = "100%";
	this.entCnt.height = "100%";
	this.entCnt.style.tableLayout = "fixed";
	this.objBox = document.createElement("DIV");
	this.objBox.style.width = "100%";
	this.objBox.style.height = this.entBox.style.height;
	this.objBox.style.overflow = "auto";
	this.objBox.style.position = "relative";
	this.objBox.appendChild(this.objBuf);
	this.objBox.className = "objbox";
	this.hdrBox = document.createElement("DIV");
	this.hdrBox.style.width = "100%";
	if (((_isOpera) && (_OperaRv < 9))) {
		this.hdrSizeA = 25;
	} else {
		this.hdrSizeA = 200;
	}
	this.hdrBox.style.height = this.hdrSizeA + "px";
	if (_isIE) {
		this.hdrBox.style.overflowX = "hidden";
	} else {
		this.hdrBox.style.overflow = "hidden";
	}
	this.hdrBox.style.position = "relative";
	this.hdrBox.appendChild(this.xHdr);
	this.preloadImagesAr = new Array(0);
	this.sortImg = document.createElement("IMG");
	this.sortImg.style.display = "none";
	this.hdrBox.insertBefore(this.sortImg, this.xHdr);
	this.entCnt.rows[0].cells[0].vAlign = "top";
	this.entCnt.rows[0].cells[0].appendChild(this.hdrBox);
	this.entCnt.rows[1].cells[0].appendChild(this.objBox);
	this.entBox.appendChild(this.entCnt);
	this.entBox.grid = this;
	this.objBox.grid = this;
	this.hdrBox.grid = this;
	this.obj.grid = this;
	this.hdr.grid = this;
	this.cellWidthPX = new Array(0);
	this.cellWidthPC = new Array(0);
	this.cellWidthType = this.entBox.cellwidthtype || "px";
	this.delim = this.entBox.delimiter || ",";
	this._csvDelim = ",";
	this.hdrLabels = [];
	this.columnIds = [];
	this.columnColor = [];
	this.cellType = dhtmlxArray();
	this.cellAlign = [];
	this.initCellWidth = [];
	this.fldSort = [];
	this.imgURL = "./";
	this.isActive = false;
	this.isEditable = true;
	this.useImagesInHeader = false;
	this.pagingOn = false;
	this.rowsBufferOutSize = 0;
	dhtmlxEvent(window, "unload", function() {
		try {
			self.destructor();
		} catch (e) {
		}
	});
	this.setSkin = function(name) {
		this.entBox.className = "gridbox gridbox_" + name;
		this.enableAlterCss("ev_" + name, "odd_" + name, this.isTreeGrid());
		this._fixAlterCss();
		this._sizeFix = this._borderFix = 0;
		switch (name) {
		case "clear":
			this._topMb = document.createElement("DIV");
			this._topMb.className = "topMumba";
			this._topMb.innerHTML = "<img style='left:0px' src='" + this.imgURL
					+ "skinC_top_left.gif'><img style='right:0px' src='"
					+ this.imgURL + "skinC_top_right.gif'>";
			this.entBox.appendChild(this._topMb);
			this._botMb = document.createElement("DIV");
			this._botMb.className = "bottomMumba";
			this._botMb.innerHTML = "<img style='left:0px' src='" + this.imgURL
					+ "skinD_bottom_left.gif'><img style='right:0px' src='"
					+ this.imgURL + "skinD_bottom_right.gif'>";
			this.entBox.appendChild(this._botMb);
			this.entBox.style.position = "relative";
			this._gcCorr = 20;
			break;
		case "modern":
		case "light":
			this.forceDivInHeader = true;
			this._sizeFix = 1;
			break;
		case "xp":
			this.forceDivInHeader = true;
			this._srdh = 22;
			this._sizeFix = 1;
			break;
		case "mt":
			this._srdh = 22;
			this._sizeFix = 1;
			this._borderFix = (_isIE ? 1 : 0);
			break;
		case "gray":
			if ((_isIE) && (document.compatMode != "BackCompat")) {
				this._srdh = 22;
			}
			this._sizeFix = 1;
			this._borderFix = (_isIE ? 1 : 0);
			break;
		case "sbdark":
			if (_isFF) {
				this._gcCorr = 1;
			}
			break;
		}
		if (_isIE && this.hdr) {
			var d = this.hdr.parentNode;
			d.removeChild(this.hdr);
			d.appendChild(this.hdr);
		}
		this.setSizes();
	};
	if (_isIE) {
		this.preventIECaching(true);
	}
	this.dragger = new dhtmlDragAndDropObject();
	this._doOnScroll = function(e, mode) {
		this.callEvent("onScroll", [ this.objBox.scrollLeft,
				this.objBox.scrollTop ]);
		this.doOnScroll(e, mode);
	};
	this.doOnScroll = function(e, mode) {
		this.hdrBox.scrollLeft = this.objBox.scrollLeft;
		if (this.ftr) {
			this.ftr.parentNode.scrollLeft = this.objBox.scrollLeft;
		}
		if (mode) {
			return;
		}
		if (this._srnd) {
			if (this._dLoadTimer) {
				window.clearTimeout(this._dLoadTimer);
			}
			this._dLoadTimer = window.setTimeout(function() {
				self._update_srnd_view();
			}, 100);
		}
	};
	this.attachToObject = function(obj) {
		obj.appendChild(this.entBox);
		this.objBox.style.height = this.entBox.style.height;
	};
	this.init = function(fl) {
		if ((this.isTreeGrid()) && (!this._h2)) {
			this._h2 = new dhtmlxHierarchy();
			if ((this._fake) && (!this._realfake)) {
				this._fake._h2 = this._h2;
			}
			this._tgc = {
				imgURL : null
			};
		}
		if (!this._hstyles) {
			return;
		}
		this.editStop();
		this.lastClicked = null;
		this.resized = null;
		this.fldSorted = this.r_fldSorted = null;
		this.gridWidth = 0;
		this.gridHeight = 0;
		this.cellWidthPX = new Array(0);
		this.cellWidthPC = new Array(0);
		if (this.hdr.rows.length > 0) {
			this.clearAll(true);
		}
		var hdrRow = this.hdr.insertRow(0);
		for ( var i = 0; i < this.hdrLabels.length; i++) {
			hdrRow.appendChild(document.createElement("TH"));
			hdrRow.childNodes[i]._cellIndex = i;
			hdrRow.childNodes[i].style.height = "0px";
		}
		if (_isIE) {
			hdrRow.style.position = "absolute";
		} else {
			hdrRow.style.height = "auto";
		}
		var hdrRow = this.hdr.insertRow(_isKHTML ? 2 : 1);
		hdrRow._childIndexes = new Array();
		var col_ex = 0;
		for ( var i = 0; i < this.hdrLabels.length; i++) {
			hdrRow._childIndexes[i] = i - col_ex;
			if ((this.hdrLabels[i] == this.splitSign) && (i != 0)) {
				if (_isKHTML) {
					hdrRow.insertCell(i - col_ex);
				}
				hdrRow.cells[i - col_ex - 1].colSpan = (hdrRow.cells[i - col_ex
						- 1].colSpan || 1) + 1;
				hdrRow.childNodes[i - col_ex - 1]._cellIndex++;
				col_ex++;
				hdrRow._childIndexes[i] = i - col_ex;
				continue;
			}
			hdrRow.insertCell(i - col_ex);
			hdrRow.childNodes[i - col_ex]._cellIndex = i;
			hdrRow.childNodes[i - col_ex]._cellIndexS = i;
			this.setColumnLabel(i, this.hdrLabels[i]);
		}
		if (col_ex == 0) {
			hdrRow._childIndexes = null;
		}
		this._cCount = this.hdrLabels.length;
		if (_isIE) {
			window.setTimeout(function() {
				self.setSizes();
			}, 1);
		}
		if (!this.obj.firstChild) {
			this.obj.appendChild(document.createElement("TBODY"));
		}
		var tar = this.obj.firstChild;
		if (!tar.firstChild) {
			tar.appendChild(document.createElement("TR"));
			tar = tar.firstChild;
			if (_isIE) {
				tar.style.position = "absolute";
			} else {
				tar.style.height = "auto";
			}
			for ( var i = 0; i < this.hdrLabels.length; i++) {
				tar.appendChild(document.createElement("TH"));
				tar.childNodes[i].style.height = "0px";
			}
		}
		this._c_order = null;
		if (this.multiLine != true) {
			this.obj.className += " row20px";
		}
		this.sortImg.style.position = "absolute";
		this.sortImg.style.display = "none";
		this.sortImg.src = this.imgURL + "sort_desc.gif";
		this.sortImg.defLeft = 0;
		this.entCnt.rows[0].style.display = "";
		if (this.noHeader) {
			this.entCnt.rows[0].style.display = "none";
		} else {
			this.noHeader = false;
		}
		if (this._ivizcol) {
			this.setColHidden();
		}
		this.attachHeader();
		this.attachHeader(0, 0, "_aFoot");
		this.setSizes();
		if (fl) {
			this.parseXML();
		}
		this.obj.scrollTop = 0;
		if (this.dragAndDropOff) {
			this.dragger.addDragLanding(this.entBox, this);
		}
		if (this._initDrF) {
			this._initD();
		}
		if (this._init_point) {
			this._init_point();
		}
	};
	this.setSizes = function(fl) {
		if ((!this.hdr.rows[0])) {
			return;
		}
		if (!this.entBox.offsetWidth) {
			if (this._sizeTime) {
				window.clearTimeout(this._sizeTime);
			}
			this._sizeTime = window.setTimeout(function() {
				self.setSizes();
			}, 250);
			return;
		}
		if (((_isFF) && (this.entBox.style.height == "100%"))
				|| (this._fixLater)) {
			this.entBox.style.height = this.entBox.parentNode.clientHeight;
			this._fixLater = true;
		}
		if (fl && this.gridWidth == this.entBox.offsetWidth
				&& this.gridHeight == this.entBox.offsetHeight) {
			return false;
		} else {
			if (fl) {
				this.gridWidth = this.entBox.offsetWidth;
				this.gridHeight = this.entBox.offsetHeight;
			}
		}
		if ((!this.hdrBox.offsetHeight) && (this.hdrBox.offsetHeight > 0)) {
			this.entCnt.rows[0].cells[0].height = this.hdrBox.offsetHeight
					+ "px";
		}
		var gridWidth = parseInt(this.entBox.offsetWidth) - (this._gcCorr || 0);
		var gridHeight = parseInt(this.entBox.offsetHeight)
				- (this._sizeFix || 0);
		var _isVSroll = (this.objBox.scrollHeight > this.objBox.offsetHeight);
		if (((!this._ahgr) && (_isVSroll))
				|| ((this._ahgrM) && (this._ahgrM < this.objBox.scrollHeight))) {
			gridWidth -= (this._scrFix || (_isFF ? 17 : 17));
		}
		var len = this.hdr.rows[0].cells.length;
		for ( var i = 0; i < this._cCount; i++) {
			if (this.cellWidthType == "px" && this.cellWidthPX.length < len) {
				this.cellWidthPX[i] = this.initCellWidth[i] - this._wcorr;
			} else {
				if (this.cellWidthType == "%" && this.cellWidthPC.length < len) {
					this.cellWidthPC[i] = this.initCellWidth[i];
				}
			}
			if (this.cellWidthType == "%" && this.cellWidthPC.length != 0
					&& this.cellWidthPC[i]) {
				this.cellWidthPX[i] = parseInt(gridWidth * this.cellWidthPC[i]
						/ 100);
			}
		}
		var wcor = this.entBox.offsetWidth - this.entBox.clientWidth;
		var summ = 0;
		var fcols = new Array();
		for ( var i = 0; i < this._cCount; i++) {
			if ((this.initCellWidth[i] == "*")
					&& ((!this._hrrar) || (!this._hrrar[i]))) {
				fcols[fcols.length] = i;
			} else {
				summ += parseInt(this.cellWidthPX[i]);
			}
		}
		if (fcols.length) {
			var ms = Math.floor((gridWidth - summ - wcor) / fcols.length);
			if (ms < 0) {
				ms = 1;
			}
			for ( var i = 0; i < fcols.length; i++) {
				var min = (this._drsclmW ? this._drsclmW[fcols[i]] : 0);
				this.cellWidthPX[fcols[i]] = (min ? (min > ms ? min : ms) : ms)
						- this._wcorr;
				summ += ms;
			}
		}
		var summ = 0;
		for ( var i = 0; i < this._cCount; i++) {
			summ += parseInt(this.cellWidthPX[i]);
		}
		if (_isOpera) {
			summ -= 1;
		}
		this.chngCellWidth();
		if ((this._awdth) && (this._awdth[0])) {
			if (this.cellWidthType == "%") {
				this.cellWidthType = "px";
				this.cellWidthPC = [];
			}
			var gs = (summ > this._awdth[1] ? this._awdth[1]
					: (summ < this._awdth[2] ? this._awdth[2] : summ))
					+ this._borderFix * 2;
			if (this._fake) {
				for ( var i = 0; i < this._fake._cCount; i++) {
					gs += parseInt(this._fake.cellWidthPX[i]);
				}
			}
			this.entBox.style.width = gs
					+ ((_isVSroll && !this._ahgr) ? (_isFF ? 20 : 18) : 0)
					+ "px";
			if (this._fake && !this._realfake) {
				this._fake._correctSplit();
			}
		}
		this.objBuf.style.width = summ + "px";
		if ((this.ftr) && (!this._realfake)) {
			this.ftr.style.width = summ + "px";
		}
		this.objBuf.childNodes[0].style.width = summ + "px";
		this.doOnScroll(0, 1);
		this.hdr.style.border = "0px solid gray";
		var zheight = this.hdr.offsetHeight
				+ (this._borderFix ? this._borderFix : 0);
		if (this.ftr) {
			zheight += this.ftr.offsetHeight;
		}
		if (this._ahgr) {
			if (this.objBox.scrollHeight) {
				if (_isIE) {
					var z2 = this.objBox.scrollHeight;
				} else {
					var z2 = this.objBox.childNodes[0].scrollHeight;
				}
				var scrfix = this.parentGrid ? 1
						: ((this.objBox.offsetWidth < this.objBox.scrollWidth) ? (_isFF ? 20
								: 18)
								: 1);
				if (this._ahgrMA) {
					z2 = this.entBox.parentNode.offsetHeight - zheight - scrfix
							- (this._sizeFix ? this._sizeFix : 0) * 2;
				}
				if (((this._ahgrM) && ((this._ahgrF ? (z2 + zheight + scrfix)
						: z2) > this._ahgrM))) {
					gridHeight = this._ahgrM * 1
							+ (this._ahgrF ? 0 : (zheight + scrfix));
				} else {
					gridHeight = z2 + zheight + scrfix;
				}
				this.entBox.style.height = gridHeight + "px";
			}
		}
		if (this.ftr) {
			zheight -= this.ftr.offsetHeight;
		}
		var aRow = this.entCnt.rows[1].cells[0].childNodes[0];
		if (!this.noHeader) {
			aRow.style.top = (zheight - this.hdrBox.offsetHeight + ((_isIE && !window.XMLHttpRequest) ? (-wcor)
					: 0))
					+ "px";
		}
		if (this._topMb) {
			this._topMb.style.top = (zheight || 0) + "px";
			this._topMb.style.width = (gridWidth + 20) + "px";
		}
		if (this._botMb) {
			this._botMb.style.top = (gridHeight - 3) + "px";
			this._botMb.style.width = (gridWidth + 20) + "px";
		}
		aRow.style.height = (((gridHeight - zheight - 1) < 0 && _isIE) ? 20
				: (gridHeight - zheight - 1))
				- (this.ftr ? this.ftr.offsetHeight : 0) + "px";
		if (this.ftr && this.entBox.offsetHeight > this.ftr.offsetHeight) {
			this.entCnt.style.height = this.entBox.offsetHeight
					- this.ftr.offsetHeight + "px";
		}
		if (this._srdh) {
			this.doOnScroll();
		}
	};
	this.chngCellWidth = function() {
		if ((_isOpera) && (this.ftr)) {
			this.ftr.width = this.objBox.scrollWidth + "px";
		}
		var l = this._cCount;
		for ( var i = 0; i < l; i++) {
			this.hdr.rows[0].cells[i].style.width = this.cellWidthPX[i] + "px";
			this.obj.rows[0].childNodes[i].style.width = this.cellWidthPX[i]
					+ "px";
			if (this.ftr) {
				this.ftr.rows[0].cells[i].style.width = this.cellWidthPX[i]
						+ "px";
			}
		}
	};
	this.setDelimiter = function(delim) {
		this.delim = delim;
	};
	this.setInitWidthsP = function(wp) {
		this.cellWidthType = "%";
		this.initCellWidth = wp.split(this.delim.replace(/px/gi, ""));
		this._setAutoResize();
	};
	this._setAutoResize = function() {
		var el = window;
		var self = this;
		if (el.addEventListener) {
			if ((_isFF) && (_FFrv < 1.8)) {
				el.addEventListener("resize", function() {
					if (!self.entBox) {
						return;
					}
					var z = self.entBox.style.width;
					self.entBox.style.width = "1px";
					window.setTimeout(function() {
						self.entBox.style.width = z;
						self.setSizes();
						if (self._fake) {
							self._fake._correctSplit();
						}
					}, 10);
				}, false);
			} else {
				el.addEventListener("resize", function() {
					if (self.setSizes) {
						self.setSizes();
					}
					if (self._fake) {
						self._fake._correctSplit();
					}
				}, false);
			}
		} else {
			if (el.attachEvent) {
				el.attachEvent("onresize", function() {
					if (self._resize_timer) {
						window.clearTimeout(self._resize_timer);
					}
					if (self.setSizes) {
						self._resize_timer = window.setTimeout(function() {
							self.setSizes();
							if (self._fake) {
								self._fake._correctSplit();
							}
						}, 500);
					}
				});
			}
		}
		this._setAutoResize = function() {
		};
	};
	this.setInitWidths = function(wp) {
		this.cellWidthType = "px";
		this.initCellWidth = wp.split(this.delim);
		if (_isFF) {
			for ( var i = 0; i < this.initCellWidth.length; i++) {
				if (this.initCellWidth[i] != "*") {
					this.initCellWidth[i] = parseInt(this.initCellWidth[i]) - 2;
				}
			}
		}
	};
	this.enableMultiline = function(state) {
		this.multiLine = convertStringToBoolean(state);
	};
	this.enableMultiselect = function(state) {
		this.selMultiRows = convertStringToBoolean(state);
	};
	this.setImagePath = function(path) {
		this.imgURL = path;
	};
	this.changeCursorState = function(ev) {
		var el = ev.target || ev.srcElement;
		if (el.tagName != "TD") {
			el = this.getFirstParentOfType(el, "TD");
		}
		if ((el.tagName == "TD") && (this._drsclmn)
				&& (!this._drsclmn[el._cellIndex])) {
			return el.style.cursor = "default";
		}
		var check = ev.layerX
				+ (((!_isIE) && (ev.target.tagName == "DIV")) ? el.offsetLeft
						: 0);
		if ((el.offsetWidth - (ev.offsetX || (parseInt(this.getPosition(el,
				this.hdrBox)) - check)
				* -1)) < 10) {
			el.style.cursor = "E-resize";
		} else {
			el.style.cursor = "default";
		}
		if (_isOpera) {
			this.hdrBox.scrollLeft = this.objBox.scrollLeft;
		}
	};
	this.startColResize = function(ev) {
		this.resized = null;
		var el = ev.target || ev.srcElement;
		if (el.tagName != "TD") {
			el = this.getFirstParentOfType(el, "TD");
		}
		var x = ev.clientX;
		var tabW = this.hdr.offsetWidth;
		var startW = parseInt(el.offsetWidth);
		if (el.tagName == "TD" && el.style.cursor != "default") {
			if ((this._drsclmn) && (!this._drsclmn[el._cellIndex])) {
				return;
			}
			this.entBox.onmousemove = function(e) {
				this.grid.doColResize(e || window.event, el, startW, x, tabW);
			};
			document.body.onmouseup = new Function("",
					"document.getElementById('" + this.entBox.id
							+ "').grid.stopColResize()");
		}
	};
	this.stopColResize = function() {
		this.entBox.onmousemove = "";
		document.body.onmouseup = "";
		this.setSizes();
		this.doOnScroll(0, 1);
		this.callEvent("onResizeEnd", [ this ]);
	};
	this.doColResize = function(ev, el, startW, x, tabW) {
		el.style.cursor = "E-resize";
		this.resized = el;
		var fcolW = startW + (ev.clientX - x);
		var wtabW = tabW + (ev.clientX - x);
		if (!(this.callEvent("onResize", [ el._cellIndex, fcolW, this ]))) {
			return;
		}
		if (_isIE) {
			this.objBox.scrollLeft = this.hdrBox.scrollLeft;
		}
		if (el.colSpan > 1) {
			var a_sizes = new Array();
			for ( var i = 0; i < el.colSpan; i++) {
				a_sizes[i] = Math
						.round(fcolW
								* this.hdr.rows[0].childNodes[el._cellIndexS
										+ i].offsetWidth / el.offsetWidth);
			}
			for ( var i = 0; i < el.colSpan; i++) {
				this._setColumnSizeR(el._cellIndexS + i * 1, a_sizes[i]);
			}
		} else {
			this._setColumnSizeR(el._cellIndex, fcolW);
		}
		this.doOnScroll(0, 1);
		if (_isOpera) {
			this.setSizes();
		}
		this.objBuf.childNodes[0].style.width = "";
	};
	this._setColumnSizeR = function(ind, fcolW) {
		if (fcolW > ((this._drsclmW && !this._notresize) ? (this._drsclmW[ind] || 10)
				: 10)) {
			this.obj.firstChild.firstChild.childNodes[ind].style.width = fcolW
					+ "px";
			this.hdr.rows[0].childNodes[ind].style.width = fcolW + "px";
			if (this.ftr) {
				this.ftr.rows[0].childNodes[ind].style.width = fcolW + "px";
			}
			if (this.cellWidthType == "px") {
				this.cellWidthPX[ind] = fcolW;
			} else {
				var gridWidth = parseInt(this.entBox.offsetWidth);
				if (this.objBox.scrollHeight > this.objBox.offsetHeight) {
					gridWidth -= (this._scrFix || (_isFF ? 17 : 17));
				}
				var pcWidth = Math.round(fcolW / gridWidth * 100);
				this.cellWidthPC[ind] = pcWidth;
			}
		}
	};
	this.setSortImgState = function(state, ind, order, row) {
		order = (order || "asc").toLowerCase();
		if (!convertStringToBoolean(state)) {
			this.sortImg.style.display = "none";
			this.fldSorted = null;
			return;
		}
		if (order == "asc") {
			this.sortImg.src = this.imgURL + "sort_asc.gif";
		} else {
			this.sortImg.src = this.imgURL + "sort_desc.gif";
		}
		this.sortImg.style.display = "";
		this.fldSorted = this.hdr.rows[0].childNodes[ind];
		var r = this.hdr.rows[row || 1];
		for ( var i = 0; i < r.childNodes.length; i++) {
			if (r.childNodes[i]._cellIndex == ind) {
				this.r_fldSorted = r.childNodes[i];
			}
		}
		this.setSortImgPos();
	};
	this.setSortImgPos = function(ind, mode, hRowInd, el) {
		if (!el) {
			if (!ind) {
				var el = this.r_fldSorted;
			} else {
				var el = this.hdr.rows[hRowInd || 0].cells[ind];
			}
		}
		if (el != null) {
			var pos = this.getPosition(el, this.hdrBox);
			var wdth = el.offsetWidth;
			this.sortImg.style.left = Number(pos[0] + wdth - 13) + "px";
			this.sortImg.defLeft = parseInt(this.sortImg.style.left);
			this.sortImg.style.top = Number(pos[1] + 5) + "px";
			if ((!this.useImagesInHeader) && (!mode)) {
				this.sortImg.style.display = "inline";
			}
			this.sortImg.style.left = this.sortImg.defLeft + "px";
		}
	};
	this.setActive = function(fl) {
		if (arguments.length == 0) {
			var fl = true;
		}
		if (fl == true) {
			if (globalActiveDHTMLGridObject
					&& (globalActiveDHTMLGridObject != this)) {
				globalActiveDHTMLGridObject.editStop();
			}
			globalActiveDHTMLGridObject = this;
			this.isActive = true;
		} else {
			this.isActive = false;
		}
	};
	this._doClick = function(ev) {
		var selMethod = 0;
		var el = this.getFirstParentOfType(_isIE ? ev.srcElement : ev.target,
				"TD");
		var fl = true;
		if (this.markedCells) {
			var markMethod = 0;
			if (ev.shiftKey || ev.metaKey) {
				markMethod = 1;
			}
			if (ev.ctrlKey) {
				markMethod = 2;
			}
			this.doMark(el, markMethod);
			return true;
		}
		if (this.selMultiRows != false) {
			if (ev.shiftKey && this.row != null) {
				selMethod = 1;
			}
			if (ev.ctrlKey || ev.metaKey) {
				selMethod = 2;
			}
		}
		this.doClick(el, fl, selMethod);
	};
	this._doContClick = function(ev) {
		var el = this.getFirstParentOfType(_isIE ? ev.srcElement : ev.target,
				"TD");
		if ((!el) || (typeof (el.parentNode.idd) == "undefined")) {
			return true;
		}
		if (ev.button == 2 || (_isMacOS && ev.ctrlKey)) {
			if (!this.callEvent("onRightClick", [ el.parentNode.idd,
					el._cellIndex, ev ])) {
				var z = function(e) {
					document.body.oncontextmenu = Function("return true;");
					(e || event).cancelBubble = true;
					return false;
				};
				if (_isIE) {
					ev.srcElement.oncontextmenu = z;
				} else {
					if (!_isMacOS) {
						document.body.oncontextmenu = z;
					}
				}
				return false;
			}
			if (this._ctmndx) {
				if (!(this.callEvent("onBeforeContextMenu", [
						el.parentNode.idd, el._cellIndex, this ]))) {
					return true;
				}
				el.contextMenuId = el.parentNode.idd + "_" + el._cellIndex;
				el.contextMenu = this._ctmndx;
				el.a = this._ctmndx._contextStart;
				if (_isIE) {
					ev.srcElement.oncontextmenu = function() {
						event.cancelBubble = true;
						return false;
					};
				}
				el.a(el, ev);
				el.a = null;
			}
		} else {
			if (this._ctmndx) {
				this._ctmndx._contextEnd();
			}
		}
		return true;
	};
	this.doClick = function(el, fl, selMethod, show) {
		var psid = this.row ? this.row.idd : 0;
		this.setActive(true);
		if (!selMethod) {
			selMethod = 0;
		}
		if (this.cell != null) {
			this.cell.className = this.cell.className.replace(/cellselected/g,
					"");
		}
		if (el.tagName == "TD") {
			if (this.checkEvent("onSelectStateChanged")) {
				var initial = this.getSelectedId();
			}
			var prow = this.row;
			if (selMethod == 1) {
				var elRowIndex = this.rowsCol._dhx_find(el.parentNode);
				var lcRowIndex = this.rowsCol._dhx_find(this.lastClicked);
				if (elRowIndex > lcRowIndex) {
					var strt = lcRowIndex;
					var end = elRowIndex;
				} else {
					var strt = elRowIndex;
					var end = lcRowIndex;
				}
				for ( var i = 0; i < this.rowsCol.length; i++) {
					if ((i >= strt && i <= end)) {
						if (this.rowsCol[i] && (!this.rowsCol[i]._sRow)) {
							if (this.rowsCol[i].className
									.indexOf("rowselected") == -1
									&& this.callEvent("onBeforeSelect", [
											this.rowsCol[i].idd, psid ])) {
								this.rowsCol[i].className += " rowselected";
								this.selectedRows[this.selectedRows.length] = this.rowsCol[i];
							}
						} else {
							this.clearSelection();
							return this.doClick(el, fl, 0, show);
						}
					}
				}
			} else {
				if (selMethod == 2) {
					if (el.parentNode.className.indexOf("rowselected") != -1) {
						el.parentNode.className = el.parentNode.className
								.replace(/rowselected/g, "");
						this.selectedRows._dhx_removeAt(this.selectedRows
								._dhx_find(el.parentNode));
						var skipRowSelection = true;
					}
				}
			}
			this.editStop();
			if (typeof (el.parentNode.idd) == "undefined") {
				return true;
			}
			if ((!skipRowSelection) && (!el.parentNode._sRow)) {
				if (this.callEvent("onBeforeSelect",
						[ el.parentNode.idd, psid ])) {
					if (selMethod == 0) {
						this.clearSelection();
					}
					this.cell = el;
					if ((prow == el.parentNode) && (this._chRRS)) {
						fl = false;
					}
					this.row = el.parentNode;
					this.row.className += " rowselected";
					if (this.selectedRows._dhx_find(this.row) == -1) {
						this.selectedRows[this.selectedRows.length] = this.row;
					}
				}
			}
			if (this.cell
					&& this.cell.parentNode.className.indexOf("rowselected") != -1) {
				this.cell.className = this.cell.className.replace(
						/cellselected/g, "")
						+ " cellselected";
			}
			if (selMethod != 1) {
				if (!this.row) {
					return;
				}
			}
			this.lastClicked = el.parentNode;
			var rid = this.row.idd;
			var cid = this.cell._cellIndex;
			if (fl && typeof (rid) != "undefined") {
				self.onRowSelectTime = setTimeout(function() {
					self.callEvent("onRowSelect", [ rid, cid ]);
				}, 100);
			}
			if (this.checkEvent("onSelectStateChanged")) {
				var afinal = this.getSelectedId();
				if (initial != afinal) {
					this.callEvent("onSelectStateChanged", [ afinal ]);
				}
			}
		}
		this.isActive = true;
		if (show !== false && this.cell && this.cell.parentNode.id) {
			this.moveToVisible(this.cell);
		}
	};
	this.selectAll = function() {
		this.clearSelection();
		this.selectedRows = dhtmlxArray([].concat(this.rowsCol));
		for ( var i = this.rowsCol.length - 1; i >= 0; i--) {
			if (this.rowsCol[i]._cntr) {
				this.selectedRows.splice(i, 1);
			} else {
				this.rowsCol[i].className += " rowselected";
			}
		}
		if (this.selectedRows.length) {
			this.row = this.selectedRows[0];
			this.cell = this.row.cells[0];
		}
		if ((this._fake) && (!this._realfake)) {
			this._fake.selectAll();
		}
	};
	this.selectCell = function(r, cInd, fl, preserve, edit, show) {
		if (!fl) {
			fl = false;
		}
		if (typeof (r) != "object") {
			r = this.rowsCol[r];
		}
		if (!r) {
			return null;
		}
		if (r._childIndexes) {
			var c = r.childNodes[r._childIndexes[cInd]];
		} else {
			var c = r.childNodes[cInd];
		}
		if (!c) {
			c = r.childNodes[0];
		}
		if (preserve) {
			this.doClick(c, fl, 3, show);
		} else {
			this.doClick(c, fl, 0, show);
		}
		if (edit) {
			this.editCell();
		}
	};
	this.moveToVisible = function(cell_obj, onlyVScroll) {
		if (!cell_obj.offsetHeight) {
			var h = this.rowsBuffer._dhx_find(cell_obj.parentNode) * this._srdh;
			return this.objBox.scrollTop = h;
		}
		try {
			var distance = cell_obj.offsetLeft + cell_obj.offsetWidth + 20;
			var scrollLeft = 0;
			if (distance > (this.objBox.offsetWidth + this.objBox.scrollLeft)) {
				if (cell_obj.offsetLeft > this.objBox.scrollLeft) {
					scrollLeft = cell_obj.offsetLeft - 5;
				}
			} else {
				if (cell_obj.offsetLeft < this.objBox.scrollLeft) {
					distance -= cell_obj.offsetWidth * 2 / 3;
					if (distance < this.objBox.scrollLeft) {
						scrollLeft = cell_obj.offsetLeft - 5;
					}
				}
			}
			if ((scrollLeft) && (!onlyVScroll)) {
				this.objBox.scrollLeft = scrollLeft;
			}
			var distance = cell_obj.offsetTop + cell_obj.offsetHeight + 20;
			if (distance > (this.objBox.offsetHeight + this.objBox.scrollTop)) {
				var scrollTop = distance - this.objBox.offsetHeight;
			} else {
				if (cell_obj.offsetTop < this.objBox.scrollTop) {
					var scrollTop = cell_obj.offsetTop - 5;
				}
			}
			if (scrollTop) {
				this.objBox.scrollTop = scrollTop;
			}
		} catch (er) {
		}
	};
	this.editCell = function() {
		if (this.editor && this.cell == this.editor.cell) {
			return;
		}
		this.editStop();
		if ((this.isEditable != true) || (!this.cell)) {
			return false;
		}
		var c = this.cell;
		if (c.parentNode._locked) {
			return false;
		}
		this.editor = this.cells4(c);
		if (this.editor != null) {
			if (this.editor.isDisabled()) {
				this.editor = null;
				return false;
			}
			if (this.callEvent("onEditCell", [ 0, this.row.idd,
					this.cell._cellIndex ]) != false
					&& this.editor.edit) {
				this._Opera_stop = (new Date).valueOf();
				c.className += " editable";
				this.editor.edit();
				this.callEvent("onEditCell", [ 1, this.row.idd,
						this.cell._cellIndex ]);
			} else {
				this.editor = null;
			}
		}
	};
	this.editStop = function(mode) {
		if (_isOpera) {
			if (this._Opera_stop) {
				if ((this._Opera_stop * 1 + 50) > (new Date).valueOf()) {
					return;
				}
				this._Opera_stop = null;
			}
		}
		if (this.editor && this.editor != null) {
			this.editor.cell.className = this.editor.cell.className.replace(
					"editable", "");
			if (mode) {
				var t = this.editor.val;
				this.editor.detach();
				this.editor.setValue(t);
				this.editor = null;
				return;
			}
			if (this.editor.detach()) {
				this.cell.wasChanged = true;
			}
			var g = this.editor;
			this.editor = null;
			var z = this.callEvent("onEditCell", [ 2, this.row.idd,
					this.cell._cellIndex, g.getValue(), g.val ]);
			if ((typeof (z) == "string") || (typeof (z) == "number")) {
				g[g.setImage ? "setLabel" : "setValue"](z);
			} else {
				if (!z) {
					g[g.setImage ? "setLabel" : "setValue"](g.val);
				}
			}
		}
	};
	this._nextRowCell = function(row, dir, pos) {
		row = this._nextRow(this.rowsCol._dhx_find(row), dir);
		if (!row) {
			return null;
		}
		return row.childNodes[row._childIndexes ? row._childIndexes[pos] : pos];
	};
	this._getNextCell = function(acell, dir, i) {
		acell = acell || this.cell;
		var arow = acell.parentNode;
		if (this._tabOrder) {
			i = this._tabOrder[acell._cellIndex];
			if (typeof i != "undefined") {
				if (i < 0) {
					acell = this._nextRowCell(arow, dir, Math.abs(i) - 1);
				} else {
					acell = arow.childNodes[i];
				}
			}
		} else {
			var i = acell._cellIndex + dir;
			if (i >= 0 && i < this._cCount) {
				if (arow._childIndexes) {
					i = arow._childIndexes[acell._cellIndex] + dir;
				}
				acell = arow.childNodes[i];
			} else {
				acell = this._nextRowCell(arow, dir, (dir == 1 ? 0
						: (this._cCount - 1)));
			}
		}
		if (!acell) {
			if ((dir == 1) && this.tabEnd) {
				this.tabEnd.focus();
				this.tabEnd.focus();
			}
			if ((dir == -1) && this.tabStart) {
				this.tabStart.focus();
				this.tabStart.focus();
			}
			return null;
		}
		if (acell.style.display != "none"
				&& (!this.smartTabOrder || !this.cells(acell.parentNode.idd,
						acell._cellIndex).isDisabled())) {
			return acell;
		}
		return this._getNextCell(acell, dir);
	};
	this._nextRow = function(ind, dir) {
		var r = this.rowsCol[ind + dir];
		if (r && r.style.display == "none") {
			return this._nextRow(ind + dir, dir);
		}
		return r;
	};
	this.scrollPage = function(dir) {
		var new_ind = Math.floor((this.getRowIndex(this.row.idd) || 0) + (dir)
				* this.objBox.offsetHeight / (this._srdh || 20));
		if (new_ind < 0) {
			new_ind = 0;
		}
		if (this._srnd && !this.rowsCol[new_ind]) {
			this.objBox.scrollTop += this.objBox.offsetHeight * dir;
		} else {
			if (new_ind >= this.rowsCol.length) {
				new_ind = this.rowsCol.length - 1;
			}
			this.selectCell(new_ind, this.cell._cellIndex, true);
		}
	};
	this.doKey = function(ev) {
		if (!ev) {
			return true;
		}
		if ((ev.target || ev.srcElement).value !== window.undefined) {
			var zx = (ev.target || ev.srcElement);
			if ((!zx.parentNode)
					|| (zx.parentNode.className.indexOf("editable") == -1)) {
				return true;
			}
		}
		if ((globalActiveDHTMLGridObject)
				&& (this != globalActiveDHTMLGridObject)) {
			return globalActiveDHTMLGridObject.doKey(ev);
		}
		if (this.isActive == false) {
			return true;
		}
		if (this._htkebl) {
			return true;
		}
		if (!this.callEvent("onKeyPress", [ ev.keyCode, ev.ctrlKey,
				ev.shiftKey, ev ])) {
			return false;
		}
		var code = "k" + ev.keyCode + "_" + (ev.ctrlKey ? 1 : 0) + "_"
				+ (ev.shiftKey ? 1 : 0);
		if (this.cell) {
			if (this._key_events[code]) {
				if (false === this._key_events[code].call(this)) {
					return true;
				}
				if (ev.preventDefault) {
					ev.preventDefault();
				}
				ev.cancelBubble = true;
				return false;
			}
			if (this._key_events["k_other"]) {
				this._key_events.k_other.call(this, ev);
			}
		}
		return true;
	};
	this.getRow = function(cell) {
		if (!cell) {
			cell = window.event.srcElement;
		}
		if (cell.tagName != "TD") {
			cell = cell.parentElement;
		}
		r = cell.parentElement;
		if (this.cellType[cell._cellIndex] == "lk") {
			eval(this.onLink + "('" + this.getRowId(r.rowIndex) + "',"
					+ cell._cellIndex + ")");
		}
		this.selectCell(r, cell._cellIndex, true);
	};
	this.selectRow = function(r, fl, preserve, show) {
		if (typeof (r) != "object") {
			r = this.rowsCol[r];
		}
		this.selectCell(r, 0, fl, preserve, false, show);
	};
	this.wasDblClicked = function(ev) {
		var el = this.getFirstParentOfType(_isIE ? ev.srcElement : ev.target,
				"TD");
		if (el) {
			var rowId = el.parentNode.idd;
			return this.callEvent("onRowDblClicked", [ rowId, el._cellIndex ]);
		}
	};
	this._onHeaderClick = function(e, el) {
		var that = this.grid;
		el = el
				|| that.getFirstParentOfType(_isIE ? event.srcElement
						: e.target, "TD");
		if (this.grid.resized == null) {
			if (!(this.grid.callEvent("onHeaderClick", [ el._cellIndexS,
					(e || window.event) ]))) {
				return false;
			}
			that.sortField(el._cellIndexS, false, el);
		}
	};
	this.deleteSelectedRows = function() {
		var num = this.selectedRows.length;
		if (num == 0) {
			return;
		}
		var tmpAr = this.selectedRows;
		this.selectedRows = dhtmlxArray();
		for ( var i = num - 1; i >= 0; i--) {
			var node = tmpAr[i];
			if (!this.deleteRow(node.idd, node)) {
				this.selectedRows[this.selectedRows.length] = node;
			} else {
				if (node == this.row) {
					var ind = i;
				}
			}
		}
		if (ind) {
			try {
				if (ind + 1 > this.rowsCol.length) {
					ind--;
				}
				this.selectCell(ind, 0, true);
			} catch (er) {
				this.row = null;
				this.cell = null;
			}
		}
	};
	this.getSelectedRowId = function() {
		var selAr = new Array(0);
		var uni = {};
		for ( var i = 0; i < this.selectedRows.length; i++) {
			var id = this.selectedRows[i].idd;
			if (uni[id]) {
				continue;
			}
			selAr[selAr.length] = id;
			uni[id] = true;
		}
		if (selAr.length == 0) {
			return null;
		} else {
			return selAr.join(this.delim);
		}
	};
	this.getSelectedCellIndex = function() {
		if (this.cell != null) {
			return this.cell._cellIndex;
		} else {
			return -1;
		}
	};
	this.getColWidth = function(ind) {
		return parseInt(this.cellWidthPX[ind]) + ((_isFF) ? 2 : 0);
	};
	this.setColWidth = function(ind, value) {
		if (this.cellWidthType == "px") {
			this.cellWidthPX[ind] = parseInt(value) - +((_isFF) ? 2 : 0);
		} else {
			this.cellWidthPC[ind] = parseInt(value);
		}
		this.setSizes();
	};
	this.getRowIndex = function(row_id) {
		for ( var i = 0; i < this.rowsBuffer.length; i++) {
			if (this.rowsBuffer[i] && this.rowsBuffer[i].idd == row_id) {
				return i;
			}
		}
	};
	this.getRowId = function(ind) {
		return this.rowsBuffer[ind] ? this.rowsBuffer[ind].idd : this.undefined;
	};
	this.setRowId = function(ind, row_id) {
		var r = this.rowsCol[ind];
		this.changeRowId(r.idd, row_id);
	};
	this.changeRowId = function(oldRowId, newRowId) {
		if (oldRowId == newRowId) {
			return;
		}
		var row = this.rowsAr[oldRowId];
		row.idd = newRowId;
		if (this.UserData[oldRowId]) {
			this.UserData[newRowId] = this.UserData[oldRowId];
			this.UserData[oldRowId] = null;
		}
		if (this._h2 && this._h2.get[oldRowId]) {
			this._h2.get[newRowId] = this._h2.get[oldRowId];
			this._h2.get[newRowId].id = newRowId;
			delete this._h2.get[oldRowId];
		}
		this.rowsAr[oldRowId] = null;
		this.rowsAr[newRowId] = row;
		for ( var i = 0; i < row.childNodes.length; i++) {
			if (row.childNodes[i]._code) {
				row.childNodes[i]._code = this._compileSCL(
						row.childNodes[i]._val, row.childNodes[i]);
			}
		}
	};
	this.setColumnIds = function(ids) {
		this.columnIds = ids.split(this.delim);
	};
	this.setColumnId = function(ind, id) {
		this.columnIds[ind] = id;
	};
	this.getColIndexById = function(id) {
		for ( var i = 0; i < this.columnIds.length; i++) {
			if (this.columnIds[i] == id) {
				return i;
			}
		}
	};
	this.getColumnId = function(cin) {
		return this.columnIds[cin];
	};
	this.getColumnLabel = function(cin, ind) {
		var z = this.hdr.rows[(ind || 0) + 1];
		var n = z.cells[z._childIndexes ? z._childIndexes[parseInt(cin)] : cin];
		return (_isIE ? n.innerText : n.textContent);
	};
	this.setRowTextBold = function(row_id) {
		var r = this.getRowById(row_id);
		if (r) {
			r.style.fontWeight = "bold";
		}
	};
	this.setRowTextStyle = function(row_id, styleString) {
		var r = this.getRowById(row_id);
		if (!r) {
			return;
		}
		for ( var i = 0; i < r.childNodes.length; i++) {
			var pfix = "";
			if ((this._hrrar) && (this._hrrar[i])) {
				pfix = "display:none;";
			}
			if (_isIE) {
				r.childNodes[i].style.cssText = pfix + "width:"
						+ r.childNodes[i].style.width + ";" + styleString;
			} else {
				r.childNodes[i].style.cssText = pfix + "width:"
						+ r.childNodes[i].style.width + ";" + styleString;
			}
		}
	};
	this.setRowColor = function(row_id, color) {
		var r = this.getRowById(row_id);
		for ( var i = 0; i < r.childNodes.length; i++) {
			r.childNodes[i].bgColor = color;
		}
	};
	this.setCellTextStyle = function(row_id, ind, styleString) {
		var r = this.getRowById(row_id);
		if (!r) {
			return;
		}
		var cell = r.childNodes[r._childIndexes ? r._childIndexes[ind] : ind];
		if (!cell) {
			return;
		}
		var pfix = "";
		if ((this._hrrar) && (this._hrrar[ind])) {
			pfix = "display:none;";
		}
		if (_isIE) {
			cell.style.cssText = pfix + "width:" + cell.style.width + ";"
					+ styleString;
		} else {
			cell.style.cssText = pfix + "width:" + cell.style.width + ";"
					+ styleString;
		}
	};
	this.setRowTextNormal = function(row_id) {
		var r = this.getRowById(row_id);
		if (r) {
			r.style.fontWeight = "normal";
		}
	};
	this.doesRowExist = function(row_id) {
		if (this.getRowById(row_id) != null) {
			return true;
		} else {
			return false;
		}
	};
	this.getColumnsNum = function() {
		return this._cCount;
	};
	this.moveRowUp = function(row_id) {
		var r = this.getRowById(row_id);
		if (this.isTreeGrid()) {
			return this.moveRowUDTG(row_id, -1);
		}
		var rInd = this.rowsCol._dhx_find(r);
		if ((r.previousSibling) && (rInd != 0)) {
			r.parentNode.insertBefore(r, r.previousSibling);
			this.rowsCol._dhx_swapItems(rInd, rInd - 1);
			this.setSizes();
			var bInd = this.rowsBuffer._dhx_find(r);
			this.rowsBuffer._dhx_swapItems(bInd, bInd - 1);
			if (this._cssEven) {
				this._fixAlterCss(rInd - 1);
			}
		}
	};
	this.moveRowDown = function(row_id) {
		var r = this.getRowById(row_id);
		if (this.isTreeGrid()) {
			return this.moveRowUDTG(row_id, 1);
		}
		var rInd = this.rowsCol._dhx_find(r);
		if (r.nextSibling) {
			this.rowsCol._dhx_swapItems(rInd, rInd + 1);
			if (r.nextSibling.nextSibling) {
				r.parentNode.insertBefore(r, r.nextSibling.nextSibling);
			} else {
				r.parentNode.appendChild(r);
			}
			this.setSizes();
			var bInd = this.rowsBuffer._dhx_find(r);
			this.rowsBuffer._dhx_swapItems(bInd, bInd + 1);
			if (this._cssEven) {
				this._fixAlterCss(rInd);
			}
		}
	};
	this.getCombo = function(col_ind) {
		if (!this.combos[col_ind]) {
			this.combos[col_ind] = new dhtmlXGridComboObject();
		}
		return this.combos[col_ind];
	};
	this.setUserData = function(row_id, name, value) {
		try {
			if (row_id == "") {
				row_id = "gridglobaluserdata";
			}
			if (!this.UserData[row_id]) {
				this.UserData[row_id] = new Hashtable();
			}
			this.UserData[row_id].put(name, value);
		} catch (er) {
		}
	};
	this.getUserData = function(row_id, name) {
		this.getRowById(row_id);
		if (row_id == "") {
			row_id = "gridglobaluserdata";
		}
		var z = this.UserData[row_id];
		return (z ? z.get(name) : "");
	};
	this.setEditable = function(fl) {
		this.isEditable = convertStringToBoolean(fl);
	};
	this.selectRowById = function(row_id, multiFL, show, call) {
		if (!call) {
			call = false;
		}
		this.selectCell(this.getRowById(row_id), 0, call, multiFL, false, show);
	};
	this.clearSelection = function() {
		this.editStop();
		for ( var i = 0; i < this.selectedRows.length; i++) {
			var r = this.rowsAr[this.selectedRows[i].idd];
			if (r) {
				r.className = r.className.replace(/rowselected/g, "");
			}
		}
		this.selectedRows = dhtmlxArray();
		this.row = null;
		if (this.cell != null) {
			this.cell.className = this.cell.className.replace(/cellselected/g,
					"");
			this.cell = null;
		}
	};
	this.copyRowContent = function(from_row_id, to_row_id) {
		var frRow = this.getRowById(from_row_id);
		if (!this.isTreeGrid()) {
			for ( var i = 0; i < frRow.cells.length; i++) {
				this.cells(to_row_id, i).setValue(
						this.cells(from_row_id, i).getValue());
			}
		} else {
			this._copyTreeGridRowContent(frRow, from_row_id, to_row_id);
		}
		if (!_isIE) {
			this.getRowById(from_row_id).cells[0].height = frRow.cells[0].offsetHeight;
		}
	};
	this.setColumnLabel = function(c, label, ind) {
		var z = this.hdr.rows[ind || 1];
		var col = (z._childIndexes ? z._childIndexes[c] : c);
		if (!this.useImagesInHeader) {
			var hdrHTML = "<div class='hdrcell'>";
			if (label.indexOf("img:[") != -1) {
				var imUrl = label.replace(/.*\[([^>]+)\].*/, "$1");
				label = label.substr(label.indexOf("]") + 1, label.length);
				hdrHTML += "<img width='18px' height='18px' align='absmiddle' src='"
						+ imUrl + "' hspace='2'>";
			}
			hdrHTML += label;
			hdrHTML += "</div>";
			z.cells[col].innerHTML = hdrHTML;
			if (this._hstyles[col]) {
				z.cells[col].style.cssText = this._hstyles[col];
			}
		} else {
			z.cells[col].style.textAlign = "left";
			z.cells[col].innerHTML = "<img src='" + this.imgURL + "" + label
					+ "' onerror='this.src = \"" + this.imgURL
					+ "imageloaderror.gif\"'>";
			var a = new Image();
			a.src = this.imgURL + "" + label.replace(/(\.[a-z]+)/, ".desc$1");
			this.preloadImagesAr[this.preloadImagesAr.length] = a;
			var b = new Image();
			b.src = this.imgURL + "" + label.replace(/(\.[a-z]+)/, ".asc$1");
			this.preloadImagesAr[this.preloadImagesAr.length] = b;
		}
		if ((label || "").indexOf("#") != -1) {
			var t = label.match(/(^|{)#([^}]+)(}|$)/);
			if (t) {
				var tn = "_in_header_" + t[2];
				if (this[tn]) {
					this[tn]((this.forceDivInHeader ? z.cells[col].firstChild
							: z.cells[col]), col, label.split(t[0]));
				}
			}
		}
	};
	this.clearAll = function(header) {
		if (this._h2) {
			this._h2 = new dhtmlxHierarchy();
			if (this._fake) {
				if (this._realfake) {
					this._h2 = this._fake._h2;
				} else {
					this._fake._h2 = this._h2;
				}
			}
		}
		this.limit = this._limitC = 0;
		this.editStop(true);
		if (this._dLoadTimer) {
			window.clearTimeout(this._dLoadTimer);
		}
		if (this._dload) {
			this.objBox.scrollTop = 0;
			this.limit = this._limitC || 0;
			this._initDrF = true;
		}
		var len = this.rowsCol.length;
		len = this.obj.rows.length;
		for ( var i = len - 1; i > 0; i--) {
			var t_r = this.obj.rows[i];
			t_r.parentNode.removeChild(t_r);
		}
		if (header && this.obj.rows[0]) {
			this._master_row = null;
			this.obj.rows[0].parentNode.removeChild(this.obj.rows[0]);
			for ( var i = this.hdr.rows.length - 1; i >= 0; i--) {
				var t_r = this.hdr.rows[i];
				t_r.parentNode.removeChild(t_r);
			}
			if (this.ftr) {
				this.ftr.parentNode.removeChild(this.ftr);
				this.ftr = null;
			}
			this._aHead = this.ftr = this._aFoot = null;
			this._hrrar = [];
			this.columnIds = [];
		}
		this.row = null;
		this.cell = null;
		this.rowsCol = dhtmlxArray();
		this.rowsAr = [];
		this.rowsBuffer = dhtmlxArray();
		this.UserData = [];
		this.selectedRows = dhtmlxArray();
		if (this.pagingOn || this._srnd) {
			this.xmlFileUrl = "";
		}
		if (this.pagingOn) {
			this.changePage(1);
		}
		if (this._contextCallTimer) {
			window.clearTimeout(this._contextCallTimer);
		}
		if (this._sst) {
			this.enableStableSorting(true);
		}
		this._fillers = this.undefined;
		this.setSortImgState(false);
		this.setSizes();
		this.callEvent("onClearAll", []);
	};
	this.sortField = function(ind, repeatFl, r_el) {
		if (this.getRowsNum() == 0) {
			return false;
		}
		var el = this.hdr.rows[0].cells[ind];
		if (!el) {
			return;
		}
		if (el.tagName == "TH" && (this.fldSort.length - 1) >= el._cellIndex
				&& this.fldSort[el._cellIndex] != "na") {
			if ((((this.sortImg.src.indexOf("_desc.gif") == -1) && (!repeatFl)) || ((this.sortImg.style.filter != "") && (repeatFl)))
					&& (this.fldSorted == el)) {
				var sortType = "des";
			} else {
				var sortType = "asc";
			}
			if (!this.callEvent("onBeforeSorting", [ ind, this.fldSort[ind],
					sortType ])) {
				return;
			}
			this.sortImg.src = this.imgURL + "sort_"
					+ (sortType == "asc" ? "asc" : "desc") + ".gif";
			if (this.useImagesInHeader) {
				var cel = this.hdr.rows[1].cells[el._cellIndex].firstChild;
				if (this.fldSorted != null) {
					var celT = this.hdr.rows[1].cells[this.fldSorted._cellIndex].firstChild;
					celT.src = celT.src.replace(/\.[ascde]+\./, ".");
				}
				cel.src = cel.src.replace(/(\.[a-z]+)/, "." + sortType + "$1");
			}
			this.sortRows(el._cellIndex, this.fldSort[el._cellIndex], sortType);
			this.fldSorted = el;
			this.r_fldSorted = r_el;
			var c = this.hdr.rows[1];
			var c = r_el.parentNode;
			var real_el = c._childIndexes ? c._childIndexes[el._cellIndex]
					: el._cellIndex;
			this.setSortImgPos(false, false, false, r_el);
			this.callEvent("onAfterSorting",
					[ ind, this.fldSort[ind], sortType ]);
		}
	};
	this.setCustomSorting = function(func, col) {
		if (!this._customSorts) {
			this._customSorts = new Array();
		}
		this._customSorts[col] = (typeof (func) == "string") ? eval(func)
				: func;
		this.fldSort[col] = "cus";
	};
	this.enableHeaderImages = function(fl) {
		this.useImagesInHeader = fl;
	};
	this.setHeader = function(hdrStr, splitSign, styles) {
		if (typeof (hdrStr) != "object") {
			var arLab = this._eSplit(hdrStr);
		} else {
			arLab = [].concat(hdrStr);
		}
		var arWdth = new Array(0);
		var arTyp = new dhtmlxArray(0);
		var arAlg = new Array(0);
		var arVAlg = new Array(0);
		var arSrt = new Array(0);
		for ( var i = 0; i < arLab.length; i++) {
			arWdth[arWdth.length] = Math.round(100 / arLab.length);
			arTyp[arTyp.length] = "ed";
			arAlg[arAlg.length] = "left";
			arVAlg[arVAlg.length] = "";
			arSrt[arSrt.length] = "na";
		}
		this.splitSign = splitSign || "#cspan";
		this.hdrLabels = arLab;
		this.cellWidth = arWdth;
		this.cellType = arTyp;
		this.cellAlign = arAlg;
		this.cellVAlign = arVAlg;
		this.fldSort = arSrt;
		this._hstyles = styles || [];
	};
	this._eSplit = function(str) {
		if (![].push) {
			return str.split(this.delim);
		}
		var a = "r" + (new Date()).valueOf();
		var z = this.delim.replace(/([\|\+\*\^])/g, "\\$1");
		return (str || "").replace(RegExp(z, "g"), a).replace(
				RegExp("\\\\" + a, "g"), this.delim).split(a);
	};
	this.getColType = function(cInd) {
		return this.cellType[cInd];
	};
	this.getColTypeById = function(cID) {
		return this.cellType[this.getColIndexById(cID)];
	};
	this.setColTypes = function(typeStr) {
		this.cellType = dhtmlxArray(typeStr.split(this.delim));
		this._strangeParams = new Array();
		for ( var i = 0; i < this.cellType.length; i++) {
			if ((this.cellType[i].indexOf("[") != -1)) {
				var z = this.cellType[i].split(/[\[\]]+/g);
				this.cellType[i] = z[0];
				this.defVal[i] = z[1];
				if (z[1].indexOf("=") == 0) {
					this.cellType[i] = "math";
					this._strangeParams[i] = z[0];
				}
			}
		}
	};
	this.setColSorting = function(sortStr) {
		this.fldSort = sortStr.split(this.delim);
		for ( var i = 0; i < this.fldSort.length; i++) {
			if (((this.fldSort[i]).length > 4)
					&& (typeof (window[this.fldSort[i]]) == "function")) {
				if (!this._customSorts) {
					this._customSorts = new Array();
				}
				this._customSorts[i] = window[this.fldSort[i]];
				this.fldSort[i] = "cus";
			}
		}
	};
	this.setColAlign = function(alStr) {
		this.cellAlign = alStr.split(this.delim);
	};
	this.setColVAlign = function(valStr) {
		this.cellVAlign = valStr.split(this.delim);
	};
	this.setNoHeader = function(fl) {
		this.noHeader = convertStringToBoolean(fl);
	};
	this.showRow = function(rowID) {
		this.getRowById(rowID);
		if (this.pagingOn) {
			this.changePage(Math.floor(this.getRowIndex(rowID)
					/ this.rowsBufferOutSize) + 1);
		}
		if (this._h2) {
			this.openItem(this._h2.get[rowID].parent.id);
		}
		var c = this.getRowById(rowID).cells[0];
		while (c && c.style.display == "none") {
			c = c.nextSibling;
		}
		if (c) {
			this.moveToVisible(c, true);
		}
	};
	this.setStyle = function(ss_header, ss_grid, ss_selCell, ss_selRow) {
		this.ssModifier = [ ss_header, ss_grid, ss_selCell, ss_selCell,
				ss_selRow ];
		var prefs = [
				"#" + this.entBox.id + " table.hdr td",
				"#" + this.entBox.id + " table.obj td",
				"#" + this.entBox.id
						+ " table.obj tr.rowselected td.cellselected",
				"#" + this.entBox.id + " table.obj td.cellselected",
				"#" + this.entBox.id + " table.obj tr.rowselected td" ];
		for ( var i = 0; i < prefs.length; i++) {
			if (this.ssModifier[i]) {
				if (_isIE) {
					document.styleSheets[0].addRule(prefs[i],
							this.ssModifier[i]);
				} else {
					document.styleSheets[0].insertRule(prefs[i] + " {"
							+ this.ssModifier[i] + " };", 0);
				}
			}
		}
	};
	this.setColumnColor = function(clr) {
		this.columnColor = clr.split(this.delim);
	};
	this.enableAlterCss = function(cssE, cssU, perLevel, levelUnique) {
		if (cssE || cssU) {
			this.attachEvent("onGridReconstructed", function() {
				if (!this._cssSP) {
					this._fixAlterCss();
					if (this._fake) {
						this._fake._fixAlterCss();
					}
				}
			});
		}
		this._cssSP = perLevel;
		this._cssSU = levelUnique;
		this._cssEven = cssE;
		this._cssUnEven = cssU;
	};
	this._fixAlterCss = function(ind) {
		if (this._cssSP && this._h2) {
			return this._fixAlterCssTGR(ind);
		}
		if (!this._cssEven && !this._cssUnEven) {
			return;
		}
		ind = ind || 0;
		var j = ind;
		for ( var i = ind; i < this.rowsCol.length; i++) {
			if (!this.rowsCol[i]) {
				continue;
			}
			if (this.rowsCol[i].style.display != "none") {
				if (this.rowsCol[i].className.indexOf("rowselected") != -1) {
					if (j % 2 == 1) {
						this.rowsCol[i].className = this._cssUnEven
								+ " rowselected" + (this.rowsCol[i]._css || "");
					} else {
						this.rowsCol[i].className = this._cssEven
								+ " rowselected" + (this.rowsCol[i]._css || "");
					}
				} else {
					if (j % 2 == 1) {
						this.rowsCol[i].className = this._cssUnEven
								+ (this.rowsCol[i]._css || "");
					} else {
						this.rowsCol[i].className = this._cssEven
								+ (this.rowsCol[i]._css || "");
					}
				}
				j++;
			}
		}
	};
	this.clearChangedState = function() {
		for ( var i = 0; i < this.rowsCol.length; i++) {
			var row = this.rowsCol[i];
			var cols = row.childNodes.length;
			for ( var j = 0; j < cols; j++) {
				row.childNodes[j].wasChanged = false;
			}
		}
	};
	this.getChangedRows = function() {
		var res = new Array();
		this.forEachRow(function(id) {
			var row = this.rowsAr[id];
			var cols = row.childNodes.length;
			for ( var j = 0; j < cols; j++) {
				if (row.childNodes[j].wasChanged) {
					res[res.length] = row.idd;
					break;
				}
			}
		});
		return res.join(this.delim);
	};
	this._sUDa = false;
	this._sAll = false;
	this.setSerializationLevel = function(userData, fullXML, config,
			changedAttr, onlyChanged, asCDATA) {
		this._sUDa = userData;
		this._sAll = fullXML;
		this._sConfig = config;
		this._chAttr = changedAttr;
		this._onlChAttr = onlyChanged;
		this._asCDATA = asCDATA;
	};
	this.setSerializableColumns = function(list) {
		if (!list) {
			this._srClmn = null;
			return;
		}
		this._srClmn = (list || "").split(",");
		for ( var i = 0; i < this._srClmn.length; i++) {
			this._srClmn[i] = convertStringToBoolean(this._srClmn[i]);
		}
	};
	this._serialise = function(rCol, inner, closed) {
		this.editStop();
		var out = [];
		var close = "</" + this.xml.s_row + ">";
		if (this.isTreeGrid()) {
			this._h2.forEachChildF(0, function(el) {
				var temp = this._serializeRow(this.render_row_tree(-1, el.id));
				out.push(temp);
				if (temp) {
					return true;
				} else {
					return false;
				}
			}, this, function() {
				out.push(close);
			});
		} else {
			for ( var i = 0; i < this.rowsBuffer.length; i++) {
				if (this.rowsBuffer[i]) {
					var temp = this._serializeRow(this.render_row(i));
					out.push(temp);
					if (temp) {
						out.push(close);
					}
				}
			}
		}
		return [ out.join("") ];
	};
	this._serializeRow = function(r, i) {
		var out = [];
		var ra = this.xml.row_attrs;
		var ca = this.xml.cell_attrs;
		out.push("<" + this.xml.s_row);
		out.push(" id='" + r.idd + "'");
		if ((this._sAll) && this.selectedRows._dhx_find(r) != -1) {
			out.push("selected='1'");
		}
		if (this._h2 && this._h2.get[r.idd].state == "minus") {
			out.push("open='1'");
		}
		if (ra.length) {
			for ( var i = 0; i < ra.length; i++) {
				out.push(" " + ra[i] + "='" + r._attrs[ra[i]] + "'");
			}
		}
		out.push(">");
		if (this._sUDa && this.UserData[r.idd]) {
			keysAr = this.UserData[r.idd].getKeys();
			for ( var ii = 0; ii < keysAr.length; ii++) {
				out.push("<userdata name='" + keysAr[ii] + "'>"
						+ this.UserData[r.idd].get(keysAr[ii]) + "</userdata>");
			}
		}
		var changeFl = false;
		for ( var jj = 0; jj < this._cCount; jj++) {
			if ((!this._srClmn) || (this._srClmn[jj])) {
				var zx = this.cells3(r, jj);
				out.push("<cell");
				if (ca.length) {
					for ( var i = 0; i < ca.length; i++) {
						out.push(" " + ca[i] + "='" + zx.cell._attrs[ca[i]]
								+ "'");
					}
				}
				zxVal = zx[this._agetm]();
				if (this._asCDATA) {
					zxVal = "<![CDATA[" + zxVal + "]]>";
				}
				if ((this._ecspn) && (zx.cell.colSpan) && cvx.colSpan > 1) {
					out.push(' colspan="' + cvx.colSpan + '" ');
				}
				if (this._chAttr) {
					if (zx.wasChanged()) {
						out.push(' changed="1"');
						changeFl = true;
					}
				} else {
					if ((this._onlChAttr) && (zx.wasChanged())) {
						changeFl = true;
					}
				}
				if (this._sAll) {
					out.push((this._h2 ? (" image='"
							+ this._h2.get[r.idd].image + "'") : "")
							+ ">" + zxVal + "</cell>");
				} else {
					out.push(">" + zxVal + "</cell>");
				}
				if ((this._ecspn) && (zx.cell.colSpan)) {
					for ( var u = 0; u < zx.cell.colSpan - 1; u++) {
						out.push("<cell/>");
						jj++;
					}
				}
			}
		}
		if ((this._onlChAttr) && (!changeFl) && (!r._added)) {
			return "";
		}
		return out.join("");
	};
	this._serialiseConfig = function() {
		var out = "<head>";
		for ( var i = 0; i < this.hdr.rows[0].cells.length; i++) {
			out += "<column width='"
					+ this.cellWidthPX[i]
					+ "' align='"
					+ this.cellAlign[i]
					+ "' type='"
					+ this.cellType[i]
					+ "' sort='"
					+ this.fldSort[i]
					+ "' color='"
					+ this.columnColor[i]
					+ "'"
					+ (this.columnIds[i] ? (" id='" + this.columnIds[i] + "'")
							: "") + ">";
			out += this.getHeaderCol(i);
			var z = this.getCombo(i);
			if (z) {
				for ( var j = 0; j < z.keys.length; j++) {
					out += "<option value='" + z.keys[j] + "'>" + z.values[j]
							+ "</option>";
				}
			}
			out += "</column>";
		}
		return out += "</head>";
	};
	this.serialize = function() {
		var out = '<?xml version="1.0"?><rows>';
		if (this._mathSerialization) {
			this._agetm = "getMathValue";
		} else {
			this._agetm = "getValue";
		}
		if (this._sUDa && this.UserData["gridglobaluserdata"]) {
			var keysAr = this.UserData["gridglobaluserdata"].getKeys();
			for ( var i = 0; i < keysAr.length; i++) {
				out += "<userdata name='" + keysAr[i] + "'>"
						+ this.UserData["gridglobaluserdata"].get(keysAr[i])
						+ "</userdata>";
			}
		}
		if (this._sConfig) {
			out += this._serialiseConfig();
		}
		out += this._serialise();
		out += "</rows>";
		return out;
	};
	this.getPosition = function(oNode, pNode) {
		if (!pNode) {
			var pNode = document.body;
		}
		var oCurrentNode = oNode;
		var iLeft = 0;
		var iTop = 0;
		while ((oCurrentNode) && (oCurrentNode != pNode)) {
			iLeft += oCurrentNode.offsetLeft - oCurrentNode.scrollLeft;
			iTop += oCurrentNode.offsetTop - oCurrentNode.scrollTop;
			oCurrentNode = oCurrentNode.offsetParent;
		}
		if (pNode == document.body) {
			if (_isIE) {
				if (document.documentElement.scrollTop) {
					iTop += document.documentElement.scrollTop;
				}
				if (document.documentElement.scrollLeft) {
					iLeft += document.documentElement.scrollLeft;
				}
			} else {
				if (!_isFF) {
					iLeft += document.body.offsetLeft;
					iTop += document.body.offsetTop;
				}
			}
		}
		return new Array(iLeft, iTop);
	};
	this.getFirstParentOfType = function(obj, tag) {
		while (obj && obj.tagName != tag && obj.tagName != "BODY") {
			obj = obj.parentNode;
		}
		return obj;
	};
	this.objBox.onscroll = function() {
		this.grid._doOnScroll();
	};
	if ((!_isOpera) || (_OperaRv > 8.5)) {
		this.hdr.onmousemove = function(e) {
			this.grid.changeCursorState(e || window.event);
		};
		this.hdr.onmousedown = function(e) {
			return this.grid.startColResize(e || window.event);
		};
	}
	this.obj.onmousemove = this._drawTooltip;
	this.obj.onclick = function(e) {
		this.grid._doClick(e || window.event);
		if (this.grid._sclE) {
			this.grid.editCell(e || window.event);
		}
		(e || event).cancelBubble = true;
	};
	if (_isMacOS) {
		this.entBox.oncontextmenu = function(e) {
			return this.grid._doContClick(e || window.event);
		};
	}
	this.entBox.onmousedown = function(e) {
		return this.grid._doContClick(e || window.event);
	};
	this.obj.ondblclick = function(e) {
		if (!this.grid.wasDblClicked(e || window.event)) {
			return false;
		}
		if (this.grid._dclE) {
			this.grid.editCell(e || window.event);
		}
		(e || event).cancelBubble = true;
	};
	this.hdr.onclick = this._onHeaderClick;
	this.sortImg.onclick = function() {
		self._onHeaderClick.apply({
			grid : self
		}, [ null, self.r_fldSorted ]);
	};
	this.hdr.ondblclick = this._onHeaderDblClick;
	if (!document.body._dhtmlxgrid_onkeydown) {
		dhtmlxEvent(document, "keydown", function(e) {
			if (globalActiveDHTMLGridObject) {
				return globalActiveDHTMLGridObject.doKey(e || window.event);
			}
		});
		document.body._dhtmlxgrid_onkeydown = true;
	}
	dhtmlxEvent(document.body, "click", function() {
		if (self.editStop) {
			self.editStop();
		}
	});
	this.entBox.onbeforeactivate = function() {
		this._still_active = null;
		this.grid.setActive();
		event.cancelBubble = true;
	};
	this.entBox.onbeforedeactivate = function() {
		if (this.grid._still_active) {
			this.grid._still_active = null;
		} else {
			this.grid.isActive = false;
		}
		event.cancelBubble = true;
	};
	if (this.entBox.style.height.toString().indexOf("%") != -1) {
		this._setAutoResize();
	}
	this.setColHidden = this.setColumnsVisibility;
	this.enableCollSpan = this.enableColSpan;
	this.setMultiselect = this.enableMultiselect;
	this.setMultiLine = this.enableMultiline;
	this.deleteSelectedItem = this.deleteSelectedRows;
	this.getSelectedId = this.getSelectedRowId;
	this.getHeaderCol = this.getColumnLabel;
	this.isItemExists = this.doesRowExist;
	this.getColumnCount = this.getColumnsNum;
	this.setSelectedRow = this.selectRowById;
	this.setHeaderCol = this.setColumnLabel;
	this.preventIECashing = this.preventIECaching;
	this.enableAutoHeigth = this.enableAutoHeight;
	this.getUID = this.uid;
	return this;
}
dhtmlXGridObject.prototype = {
	getRowAttribute : function(id, name) {
		return this.getRowById(id)._attrs[name];
	},
	setRowAttribute : function(id, name, value) {
		this.getRowById(id)._attrs[name] = value;
	},
	isTreeGrid : function() {
		return (this.cellType._dhx_find("tree") != -1);
	},
	setRowHidden : function(id, state) {
		var f = convertStringToBoolean(state);
		var row = this.getRowById(id);
		if (!row) {
			return;
		}
		if (row.expand === "") {
			this.collapseKids(row);
		}
		if ((state) && (row.style.display != "none")) {
			row.style.display = "none";
			var z = this.selectedRows._dhx_find(row);
			if (z != -1) {
				row.className = row.className.replace("rowselected", "");
				for ( var i = 0; i < row.childNodes.length; i++) {
					row.childNodes[i].className = row.childNodes[i].className
							.replace(/cellselected/g, "");
				}
				this.selectedRows._dhx_removeAt(z);
			}
			this.callEvent("onGridReconstructed", []);
		}
		if ((!state) && (row.style.display == "none")) {
			row.style.display = "";
			this.callEvent("onGridReconstructed", []);
		}
		this.setSizes();
	},
	setColumnHidden : function(ind, state) {
		if (!this.hdr.rows.length) {
			if (!this._ivizcol) {
				this._ivizcol = [];
			}
			return this._ivizcol[ind] = state;
		}
		if ((this.fldSorted) && (this.fldSorted.cellIndex == ind) && (state)) {
			this.sortImg.style.display = "none";
		}
		var f = convertStringToBoolean(state);
		if (f) {
			if (!this._hrrar) {
				this._hrrar = new Array();
			} else {
				if (this._hrrar[ind]) {
					return;
				}
			}
			this._hrrar[ind] = "display:none;";
			this._hideShowColumn(ind, "none");
		} else {
			if ((!this._hrrar) || (!this._hrrar[ind])) {
				return;
			}
			this._hrrar[ind] = "";
			this._hideShowColumn(ind, "");
		}
		if ((this.fldSorted) && (this.fldSorted.cellIndex == ind) && (!state)) {
			this.sortImg.style.display = "inline";
		}
	},
	isColumnHidden : function(ind) {
		if ((this._hrrar) && (this._hrrar[ind])) {
			return true;
		}
		return false;
	},
	setColumnsVisibility : function(list) {
		if (list) {
			this._ivizcol = list.split(",");
		}
		if (this.hdr.rows.length && this._ivizcol) {
			for ( var i = 0; i < this._ivizcol.length; i++) {
				this.setColumnHidden(i, this._ivizcol[i]);
			}
		}
	},
	_fixHiddenRowsAll : function(pb, ind, prop, state) {
		var z = pb.rows.length;
		for ( var i = 0; i < z; i++) {
			var x = pb.rows[i].cells;
			if (x.length != this._cCount) {
				for ( var j = 0; j < x.length; j++) {
					if (x[j]._cellIndex == ind) {
						x[j].style[prop] = state;
						break;
					}
				}
			} else {
				x[ind].style[prop] = state;
			}
		}
	},
	_hideShowColumn : function(ind, state) {
		var hind = ind;
		if ((this.hdr.rows[1]._childIndexes)
				&& (this.hdr.rows[1]._childIndexes[ind] != ind)) {
			hind = this.hdr.rows[1]._childIndexes[ind];
		}
		if (state == "none") {
			this.hdr.rows[0].cells[ind]._oldWidth = this.hdr.rows[0].cells[ind].style.width;
			this.hdr.rows[0].cells[ind]._oldWidthP = this.cellWidthPC[ind];
			this.obj.rows[0].cells[ind].style.width = "0px";
			this._fixHiddenRowsAll(this.obj, ind, "display", "none");
			if (this._fixHiddenRowsAllTG) {
				this._fixHiddenRowsAllTG(ind, "none");
			}
			if ((_isOpera && _OperaRv < 9) || _isKHTML || (_isFF)) {
				this._fixHiddenRowsAll(this.hdr, ind, "display", "none");
				if (this.ftr) {
					this._fixHiddenRowsAll(this.ftr.childNodes[0], ind,
							"display", "none");
				}
			}
			this._fixHiddenRowsAll(this.hdr, ind, "whiteSpace", "nowrap");
			if (!this.cellWidthPX.length && !this.cellWidthPC.length) {
				this.cellWidthPX = [].concat(this.initCellWidth);
			}
			if (this.cellWidthPX[ind]) {
				this.cellWidthPX[ind] = 0;
			}
			if (this.cellWidthPC[ind]) {
				this.cellWidthPC[ind] = 0;
			}
		} else {
			if (this.hdr.rows[0].cells[ind]._oldWidth) {
				var zrow = this.hdr.rows[0].cells[ind];
				if (_isOpera || _isKHTML || (_isFF)) {
					this._fixHiddenRowsAll(this.hdr, ind, "display", "");
				}
				if (this.ftr) {
					this._fixHiddenRowsAll(this.ftr.childNodes[0], ind,
							"display", "");
				}
				this.obj.rows[0].cells[ind].style.width = this.hdr.rows[0].cells[ind]._oldWidth;
				this._fixHiddenRowsAll(this.obj, ind, "display", "");
				if (this._fixHiddenRowsAllTG) {
					this._fixHiddenRowsAllTG(ind, "");
				}
				zrow.style.width = zrow._oldWidth;
				this._fixHiddenRowsAll(this.hdr, ind, "whiteSpace", "normal");
				if (zrow._oldWidthP) {
					this.cellWidthPC[ind] = zrow._oldWidthP;
				}
				if (zrow._oldWidth) {
					this.cellWidthPX[ind] = parseInt(zrow._oldWidth);
				}
			}
		}
		this.setSizes();
		if ((!_isIE) && (!_isFF)) {
			this.obj.border = 1;
			this.obj.border = 0;
		}
	},
	enableColSpan : function(mode) {
		this._ecspn = convertStringToBoolean(mode);
	},
	enableRowsHover : function(mode, cssClass) {
		this._hvrCss = cssClass;
		if (convertStringToBoolean(mode)) {
			if (!this._elmnh) {
				this.obj._honmousemove = this.obj.onmousemove;
				this.obj.onmousemove = this._setRowHover;
				if (_isIE) {
					this.obj.onmouseleave = this._unsetRowHover;
				} else {
					this.obj.onmouseout = this._unsetRowHover;
				}
				this._elmnh = true;
			}
		} else {
			if (this._elmnh) {
				this.obj.onmousemove = this.obj._honmousemove;
				if (_isIE) {
					this.obj.onmouseleave = null;
				} else {
					this.obj.onmouseout = null;
				}
				this._elmnh = false;
			}
		}
	},
	enableEditEvents : function(click, dblclick, f2Key) {
		this._sclE = convertStringToBoolean(click);
		this._dclE = convertStringToBoolean(dblclick);
		this._f2kE = convertStringToBoolean(f2Key);
	},
	enableLightMouseNavigation : function(mode) {
		if (convertStringToBoolean(mode)) {
			if (!this._elmn) {
				this.entBox._onclick = this.entBox.onclick;
				this.entBox.onclick = function() {
					return true;
				};
				this.obj._onclick = this.obj.onclick;
				this.obj.onclick = function(e) {
					var c = this.grid.getFirstParentOfType(e ? e.target
							: event.srcElement, "TD");
					this.grid.editStop();
					this.grid.doClick(c);
					this.grid.editCell();
					(e || event).cancelBubble = true;
				};
				this.obj._onmousemove = this.obj.onmousemove;
				this.obj.onmousemove = this._autoMoveSelect;
				this._elmn = true;
			}
		} else {
			if (this._elmn) {
				this.entBox.onclick = this.entBox._onclick;
				this.obj.onclick = this.obj._onclick;
				this.obj.onmousemove = this.obj._onmousemove;
				this._elmn = false;
			}
		}
	},
	_unsetRowHover : function(e, c) {
		if (c) {
			that = this;
		} else {
			that = this.grid;
		}
		if ((that._lahRw) && (that._lahRw != c)) {
			for ( var i = 0; i < that._lahRw.childNodes.length; i++) {
				that._lahRw.childNodes[i].className = that._lahRw.childNodes[i].className
						.replace(that._hvrCss, "");
			}
			that._lahRw = null;
		}
	},
	_setRowHover : function(e) {
		var c = this.grid.getFirstParentOfType(e ? e.target : event.srcElement,
				"TD");
		if (c && c.parentNode != this.grid._lahRw) {
			this.grid._unsetRowHover(0, c);
			c = c.parentNode;
			for ( var i = 0; i < c.childNodes.length; i++) {
				c.childNodes[i].className += " " + this.grid._hvrCss;
			}
			this.grid._lahRw = c;
		}
		this._honmousemove(e);
	},
	_autoMoveSelect : function(e) {
		if (!this.grid.editor) {
			var c = this.grid.getFirstParentOfType(e ? e.target
					: event.srcElement, "TD");
			if (c.parentNode.idd) {
				this.grid.doClick(c, true, 0);
			}
		}
		this._onmousemove(e);
	},
	enableDistributedParsing : function(mode, count, time) {
		if (convertStringToBoolean(mode)) {
			this._ads_count = count || 10;
			this._ads_time = time || 250;
		} else {
			this._ads_count = 0;
		}
	},
	destructor : function() {
		if (this._sizeTime) {
			this._sizeTime = window.clearTimeout(this._sizeTime);
		}
		if (this.formInputs) {
			for ( var i = 0; i < this.formInputs.length; i++) {
				this.parentForm.removeChild(this.formInputs[i]);
			}
		}
		var a;
		this.xmlLoader = this.xmlLoader.destructor();
		for ( var i = 0; i < this.rowsCol.length; i++) {
			if (this.rowsCol[i]) {
				this.rowsCol[i].grid = null;
			}
		}
		for (i in this.rowsAr) {
			if (this.rowsAr[i]) {
				this.rowsAr[i] = null;
			}
		}
		this.rowsCol = new dhtmlxArray();
		this.rowsAr = new Array();
		this.entBox.innerHTML = "";
		this.entBox.onclick = function() {
		};
		this.entBox.onmousedown = function() {
		};
		this.entBox.onbeforeactivate = function() {
		};
		this.entBox.onbeforedeactivate = function() {
		};
		this.entBox.onbeforedeactivate = function() {
		};
		this.entBox.onselectstart = function() {
		};
		this.entBox.grid = null;
		for (a in this) {
			if ((this[a]) && (this[a].m_obj)) {
				this[a].m_obj = null;
			}
			this[a] = null;
		}
		if (this == globalActiveDHTMLGridObject) {
			globalActiveDHTMLGridObject = null;
		}
		return null;
	},
	getSortingState : function() {
		var z = new Array();
		if (this.fldSorted) {
			z[0] = this.fldSorted._cellIndex;
			z[1] = (this.sortImg.src.indexOf("sort_desc.gif") != -1) ? "des"
					: "asc";
		}
		return z;
	},
	enableAutoHeight : function(mode, maxHeight, countFullHeight) {
		this._ahgr = convertStringToBoolean(mode);
		this._ahgrF = convertStringToBoolean(countFullHeight);
		this._ahgrM = maxHeight || null;
		if (maxHeight == "auto") {
			this._ahgrM = null;
			this._ahgrMA = true;
			this._setAutoResize();
		}
	},
	enableStableSorting : function(mode) {
		this._sst = convertStringToBoolean(mode);
		this.rowsCol.stablesort = function(cmp) {
			var size = this.length - 1;
			for ( var i = 0; i < this.length - 1; i++) {
				for ( var j = 0; j < size; j++) {
					if (cmp(this[j], this[j + 1]) > 0) {
						var temp = this[j];
						this[j] = this[j + 1];
						this[j + 1] = temp;
					}
				}
				size--;
			}
		};
	},
	enableKeyboardSupport : function(mode) {
		this._htkebl = !convertStringToBoolean(mode);
	},
	enableContextMenu : function(menu) {
		this._ctmndx = menu;
	},
	setScrollbarWidthCorrection : function(width) {
		this._scrFix = parseInt(width);
	},
	enableTooltips : function(list) {
		this._enbTts = list.split(",");
		for ( var i = 0; i < this._enbTts.length; i++) {
			this._enbTts[i] = convertStringToBoolean(this._enbTts[i]);
		}
	},
	enableResizing : function(list) {
		this._drsclmn = list.split(",");
		for ( var i = 0; i < this._drsclmn.length; i++) {
			this._drsclmn[i] = convertStringToBoolean(this._drsclmn[i]);
		}
	},
	setColumnMinWidth : function(width, ind) {
		if (arguments.length == 2) {
			if (!this._drsclmW) {
				this._drsclmW = new Array();
			}
			this._drsclmW[ind] = width;
		} else {
			this._drsclmW = width.split(",");
		}
	},
	enableCellIds : function(mode) {
		this._enbCid = convertStringToBoolean(mode);
	},
	lockRow : function(rowId, mode) {
		var z = this.getRowById(rowId);
		if (z) {
			z._locked = convertStringToBoolean(mode);
			if ((this.cell) && (this.cell.parentNode.idd == rowId)) {
				this.editStop();
			}
		}
	},
	_getRowArray : function(row) {
		var text = new Array();
		for ( var ii = 0; ii < row.childNodes.length; ii++) {
			var a = this.cells3(row, ii);
			if (a.cell._code) {
				text[ii] = a.cell._val;
			} else {
				text[ii] = a.getValue();
			}
		}
		return text;
	},
	setDateFormat : function(mask) {
		this._dtmask = mask;
	},
	setNumberFormat : function(mask, cInd, p_sep, d_sep) {
		var nmask = mask.replace(/[^0\,\.]*/g, "");
		var pfix = nmask.indexOf(".");
		if (pfix > -1) {
			pfix = nmask.length - pfix - 1;
		}
		var dfix = nmask.indexOf(",");
		if (dfix > -1) {
			dfix = nmask.length - pfix - 2 - dfix;
		}
		if (typeof p_sep != "string") {
			p_sep = this.i18n.decimal_separator;
		}
		if (typeof d_sep != "string") {
			d_sep = this.i18n.group_separator;
		}
		var pref = mask.split(nmask)[0];
		var postf = mask.split(nmask)[1];
		this._maskArr[cInd] = [ pfix, dfix, pref, postf, p_sep, d_sep ];
	},
	_aplNFb : function(data, ind) {
		var a = this._maskArr[ind];
		if (!a) {
			return data;
		}
		var ndata = parseFloat(data.toString().replace(/[^0-9]*/g, ""));
		if (data.toString().substr(0, 1) == "-") {
			ndata = ndata * -1;
		}
		if (a[0] > 0) {
			ndata = ndata / Math.pow(10, a[0]);
		}
		return ndata;
	},
	_aplNF : function(data, ind) {
		var a = this._maskArr[ind];
		if (!a) {
			return data;
		}
		var c = (parseFloat(data) < 0 ? "-" : "") + a[2];
		data = Math.abs(
				Math
						.round(parseFloat(data)
								* Math.pow(10, a[0] > 0 ? a[0] : 0)))
				.toString();
		data = (data.length < a[0] ? Math.pow(10, a[0] + 1 - data.length)
				.toString().substr(1, a[0] + 1)
				+ data.toString() : data).split("").reverse();
		data[a[0]] = (data[a[0]] || "0") + a[4];
		if (a[1] > 0) {
			for ( var j = (a[0] > 0 ? 0 : 1) + a[0] + a[1]; j < data.length; j += a[1]) {
				data[j] += a[5];
			}
		}
		return c + data.reverse().join("") + a[3];
	},
	_launchCommands : function(arr) {
		for ( var i = 0; i < arr.length; i++) {
			var args = new Array();
			for ( var j = 0; j < arr[i].childNodes.length; j++) {
				if (arr[i].childNodes[j].nodeType == 1) {
					args[args.length] = arr[i].childNodes[j].firstChild.data;
				}
			}
			this[arr[i].getAttribute("command")].apply(this, args);
		}
	},
	_parseHead : function(xmlDoc) {
		var hheadCol = this.xmlLoader.doXPath("//rows/head", xmlDoc);
		if (hheadCol.length) {
			var headCol = this.xmlLoader.doXPath("//rows/head/column",
					hheadCol[0]);
			var asettings = this.xmlLoader.doXPath("//rows/head/settings",
					hheadCol[0]);
			var awidthmet = "setInitWidths";
			var split = false;
			if (asettings[0]) {
				for ( var s = 0; s < asettings[0].childNodes.length; s++) {
					switch (asettings[0].childNodes[s].tagName) {
					case "colwidth":
						if (asettings[0].childNodes[s].firstChild
								&& asettings[0].childNodes[s].firstChild.data == "%") {
							awidthmet = "setInitWidthsP";
						}
						break;
					case "splitat":
						split = (asettings[0].childNodes[s].firstChild ? asettings[0].childNodes[s].firstChild.data
								: false);
						break;
					}
				}
			}
			this._launchCommands(this.xmlLoader.doXPath(
					"//rows/head/beforeInit/call", hheadCol[0]));
			if (headCol.length > 0) {
				var sets = [ [], [], [], [], [], [], [], [], [] ];
				var attrs = [ "", "width", "type", "align", "sort", "color",
						"format", "hidden", "id" ];
				var calls = [ "setHeader", awidthmet, "setColTypes",
						"setColAlign", "setColSorting", "setColumnColor", "",
						"", "setColumnIds" ];
				for ( var i = 0; i < headCol.length; i++) {
					for ( var j = 1; j < attrs.length; j++) {
						sets[j].push(headCol[i].getAttribute(attrs[j]));
					}
					sets[0]
							.push((headCol[i].firstChild ? headCol[i].firstChild.data
									: "")
									.replace(/^\s*((.|\n)*.+)\s*$/gi, "$1"));
				}
				for ( var i = 0; i < calls.length; i++) {
					if (calls[i]) {
						this[calls[i]](sets[i].join(this.delim));
					}
				}
				for ( var i = 0; i < headCol.length; i++) {
					if ((this.cellType[i].indexOf("co") == 0)
							|| (this.cellType[i] == "clist")) {
						var optCol = this.xmlLoader.doXPath("./option",
								headCol[i]);
						if (optCol.length) {
							var resAr = new Array();
							if (this.cellType[i] == "clist") {
								for ( var j = 0; j < optCol.length; j++) {
									resAr[resAr.length] = optCol[j].firstChild ? optCol[j].firstChild.data
											: "";
								}
								this.registerCList(i, resAr);
							} else {
								var combo = this.getCombo(i);
								for ( var j = 0; j < optCol.length; j++) {
									combo
											.put(
													optCol[j]
															.getAttribute("value"),
													optCol[j].firstChild ? optCol[j].firstChild.data
															: "");
								}
							}
						}
					} else {
						if (sets[6][i]) {
							if ((this.cellType[i] == "calendar")
									|| (this.fldSort[i] == "date")) {
								this.setDateFormat(sets[6][i], i);
							} else {
								this.setNumberFormat(sets[6][i], i);
							}
						}
					}
				}
				this.init();
				if (this.setColHidden) {
					this.setColHidden(sets[7].join(this.delim));
				}
				if ((split) && (this.splitAt)) {
					this.splitAt(split);
				}
			}
			this._launchCommands(this.xmlLoader.doXPath(
					"//rows/head/afterInit/call", hheadCol[0]));
		}
		var gudCol = this.xmlLoader.doXPath("//rows/userdata", xmlDoc);
		if (gudCol.length > 0) {
			if (!this.UserData["gridglobaluserdata"]) {
				this.UserData["gridglobaluserdata"] = new Hashtable();
			}
			for ( var j = 0; j < gudCol.length; j++) {
				this.UserData["gridglobaluserdata"].put(gudCol[j]
						.getAttribute("name"),
						gudCol[j].firstChild ? gudCol[j].firstChild.data : "");
			}
		}
	},
	getCheckedRows : function(col_ind) {
		var d = new Array();
		this.forEachRow(function(id) {
			if (this.cells(id, col_ind).getValue() != 0) {
				d.push(id);
			}
		});
		return d.join(",");
	},
	_drawTooltip : function(e) {
		var c = this.grid.getFirstParentOfType(e ? e.target : event.srcElement,
				"TD");
		if ((this.grid.editor) && (this.grid.editor.cell == c)) {
			return true;
		}
		var r = c.parentNode;
		if (!r.idd || r.idd == "__filler__") {
			return;
		}
		var el = (e ? e.target : event.srcElement);
		if (r.idd == window.unknown) {
			return true;
		}
		if (!this.grid.callEvent("onMouseOver", [ r.idd, c._cellIndex ])) {
			return true;
		}
		if ((this.grid._enbTts) && (!this.grid._enbTts[c._cellIndex])) {
			if (el.title) {
				el.title = "";
			}
			return true;
		}
		if (c._cellIndex >= this.grid._cCount) {
			return;
		}
		var ced = this.grid.cells(r.idd, c._cellIndex);
		if (!ced) {
			return;
		}
		if (el._title) {
			ced.cell.title = "";
		}
		if (!ced.cell._attrs["title"]) {
			el._title = true;
		}
		if (ced) {
			el.title = ced.cell._attrs["title"]
					|| (ced.getTitle ? ced.getTitle() : (ced.getValue() || "")
							.toString().replace(/<[^>]*>/gi, ""));
		}
		return true;
	},
	enableCellWidthCorrection : function(size) {
		if (_isFF) {
			this._wcorr = parseInt(size);
		}
	},
	getAllRowIds : function(separator) {
		var ar = [];
		for ( var i = 0; i < this.rowsBuffer.length; i++) {
			if (this.rowsBuffer[i]) {
				ar.push(this.rowsBuffer[i].idd);
			}
		}
		return ar.join(separator || this.delim);
	},
	getAllItemIds : function() {
		return this.getAllRowIds();
	},
	setColspan : function(row_id, col_ind, colspan) {
		if (!this._ecspn) {
			return;
		}
		var r = this.getRowById(row_id);
		if ((r._childIndexes) && (r.childNodes[r._childIndexes[col_ind]])) {
			var j = r._childIndexes[col_ind];
			var n = r.childNodes[j];
			var m = n.colSpan;
			n.colSpan = 1;
			if ((m) && (m != 1)) {
				for ( var i = 1; i < m; i++) {
					var c = document.createElement("TD");
					if (n.nextSibling) {
						r.insertBefore(c, n.nextSibling);
					} else {
						r.appendChild(c);
					}
					r._childIndexes[col_ind + i] = j + i;
					c._cellIndex = col_ind + i;
					c.align = this.cellAlign[i];
					c.style.verticalAlign = this.cellVAlign[i];
					n = c;
					this.cells3(r, j + i - 1).setValue("");
				}
			}
			for ( var z = col_ind * 1 + 1 * m; z < r._childIndexes.length; z++) {
				r._childIndexes[z] += (m - 1) * 1;
			}
		}
		if ((colspan) && (colspan > 1)) {
			if (r._childIndexes) {
				var j = r._childIndexes[col_ind];
			} else {
				var j = col_ind;
				r._childIndexes = new Array();
				for ( var z = 0; z < r.childNodes.length; z++) {
					r._childIndexes[z] = z;
				}
			}
			r.childNodes[j].colSpan = colspan;
			for ( var z = 1; z < colspan; z++) {
				r._childIndexes[r.childNodes[j + 1]._cellIndex] = j;
				r.removeChild(r.childNodes[j + 1]);
			}
			var c1 = r.childNodes[r._childIndexes[col_ind]]._cellIndex;
			for ( var z = c1 * 1 + 1 * colspan; z < r._childIndexes.length; z++) {
				r._childIndexes[z] -= (colspan - 1);
			}
		}
	},
	preventIECaching : function(mode) {
		this.no_cashe = convertStringToBoolean(mode);
		this.xmlLoader.rSeed = this.no_cashe;
	},
	enableColumnAutoSize : function(mode) {
		this._eCAS = convertStringToBoolean(mode);
	},
	_onHeaderDblClick : function(e) {
		var that = this.grid;
		var el = that.getFirstParentOfType(_isIE ? event.srcElement : e.target,
				"TD");
		if (!that._eCAS) {
			return false;
		}
		that.adjustColumnSize(el._cellIndexS);
	},
	adjustColumnSize : function(cInd, complex) {
		this._notresize = true;
		var m = 0;
		this._setColumnSizeR(cInd, 20);
		for ( var j = 1; j < this.hdr.rows.length; j++) {
			var a = this.hdr.rows[j];
			a = a.childNodes[(a._childIndexes) ? a._childIndexes[cInd] : cInd];
			if ((a) && ((!a.colSpan) || (a.colSpan < 2))) {
				if ((a.childNodes[0])
						&& (a.childNodes[0].className == "hdrcell")) {
					a = a.childNodes[0];
				}
				m = Math.max(m,
						((_isFF || _isOpera) ? (a.textContent.length * 7)
								: a.scrollWidth));
			}
		}
		var l = this.obj.rows.length;
		for ( var i = 1; i < l; i++) {
			var z = this.obj.rows[i];
			if (z._childIndexes && z._childIndexes[cInd] != cInd
					|| !z.childNodes[cInd]) {
				continue;
			}
			if (_isFF || _isOpera || complex) {
				z = z.childNodes[cInd].textContent.length * 7;
			} else {
				z = z.childNodes[cInd].scrollWidth;
			}
			if (z > m) {
				m = z;
			}
		}
		m += 20 + (complex || 0);
		this._setColumnSizeR(cInd, m);
		this._notresize = false;
		this.setSizes();
	},
	detachHeader : function(index, hdr) {
		hdr = hdr || this.hdr;
		var row = hdr.rows[index + 1];
		if (row) {
			row.parentNode.removeChild(row);
		}
		this.setSizes();
	},
	detachFooter : function(index) {
		this.detachHeader(index, this.ftr);
	},
	attachHeader : function(values, style, _type) {
		if (typeof (values) == "string") {
			values = this._eSplit(values);
		}
		if (typeof (style) == "string") {
			style = style.split(this.delim);
		}
		_type = _type || "_aHead";
		if (this.hdr.rows.length) {
			if (values) {
				this._createHRow([ values, style ],
						this[(_type == "_aHead") ? "hdr" : "ftr"]);
			} else {
				if (this[_type]) {
					for ( var i = 0; i < this[_type].length; i++) {
						this.attachHeader.apply(this, this[_type][i]);
					}
				}
			}
		} else {
			if (!this[_type]) {
				this[_type] = new Array();
			}
			this[_type][this[_type].length] = [ values, style, _type ];
		}
	},
	_createHRow : function(data, parent) {
		if (!parent) {
			this.entBox.style.position = "relative";
			var z = document.createElement("DIV");
			z.className = "c_ftr".substr(2);
			this.entBox.appendChild(z);
			var t = document.createElement("TABLE");
			t.cellPadding = t.cellSpacing = 0;
			if (!_isIE) {
				t.width = "100%";
				t.style.paddingRight = "20px";
			}
			t.style.tableLayout = "fixed";
			z.appendChild(t);
			t.appendChild(document.createElement("TBODY"));
			this.ftr = parent = t;
			var hdrRow = t.insertRow(0);
			var thl = ((this.hdrLabels.length <= 1) ? data[0].length
					: this.hdrLabels.length);
			for ( var i = 0; i < thl; i++) {
				hdrRow.appendChild(document.createElement("TH"));
				hdrRow.childNodes[i]._cellIndex = i;
			}
			if (_isIE) {
				hdrRow.style.position = "absolute";
			} else {
				hdrRow.style.height = "auto";
			}
		}
		var st1 = data[1];
		var z = document.createElement("TR");
		parent.rows[0].parentNode.appendChild(z);
		for ( var i = 0; i < data[0].length; i++) {
			if (data[0][i] == "#cspan") {
				var pz = z.cells[z.cells.length - 1];
				pz.colSpan = (pz.colSpan || 1) + 1;
				continue;
			}
			if ((data[0][i] == "#rspan") && (parent.rows.length > 1)) {
				var pind = parent.rows.length - 2;
				var found = false;
				var pz = null;
				while (!found) {
					var pz = parent.rows[pind];
					for ( var j = 0; j < pz.cells.length; j++) {
						if (pz.cells[j]._cellIndex == i) {
							found = j + 1;
							break;
						}
					}
					pind--;
				}
				pz = pz.cells[found - 1];
				pz.rowSpan = (pz.rowSpan || 1) + 1;
				continue;
			}
			var w = document.createElement("TD");
			w._cellIndex = w._cellIndexS = i;
			if (this._hrrar && this._hrrar[i] && !_isIE) {
				w.style.display = "none";
			}
			if (this.forceDivInHeader) {
				w.innerHTML = "<div class='hdrcell'>" + data[0][i] + "</div>";
			} else {
				w.innerHTML = data[0][i];
			}
			if ((data[0][i] || "").indexOf("#") != -1) {
				var t = data[0][i].match(/(^|{)#([^}]+)(}|$)/);
				if (t) {
					var tn = "_in_header_" + t[2];
					if (this[tn]) {
						this[tn]((this.forceDivInHeader ? w.firstChild : w), i,
								data[0][i].split(t[0]));
					}
				}
			}
			if (st1) {
				w.style.cssText = st1[i];
			}
			z.appendChild(w);
		}
		var self = parent;
		if (_isKHTML) {
			if (parent._kTimer) {
				window.clearTimeout(parent._kTimer);
			}
			parent._kTimer = window.setTimeout(function() {
				parent.rows[1].style.display = "none";
				window.setTimeout(function() {
					parent.rows[1].style.display = "";
				}, 1);
			}, 500);
		}
	},
	attachFooter : function(values, style) {
		this.attachHeader(values, style, "_aFoot");
	},
	setCellExcellType : function(rowId, cellIndex, type) {
		this.changeCellType(this.rowsAr[rowId], cellIndex, type);
	},
	changeCellType : function(r, ind, type) {
		type = type || this.cellType[ind];
		var z = this.cells3(r, ind);
		var v = z.getValue();
		z.cell._cellType = type;
		var z = this.cells3(r, ind);
		z.setValue(v);
	},
	setRowExcellType : function(rowId, type) {
		var z = this.rowsAr[rowId];
		for ( var i = 0; i < z.childNodes.length; i++) {
			this.changeCellType(z, i, type);
		}
	},
	setColumnExcellType : function(colIndex, type) {
		for ( var i = 0; i < this.rowsCol.length; i++) {
			this.changeCellType(this.rowsCol[i], colIndex, type);
		}
	},
	dhx_Event : function() {
		this.dhx_SeverCatcherPath = "";
		this.attachEvent = function(original, catcher, CallObj) {
			CallObj = CallObj || this;
			original = "ev_" + original;
			if ((!this[original]) || (!this[original].addEvent)) {
				var z = new this.eventCatcher(CallObj);
				z.addEvent(this[original]);
				this[original] = z;
			}
			return (original + ":" + this[original].addEvent(catcher));
		};
		this.callEvent = function(name, arg0) {
			if (this["ev_" + name]) {
				return this["ev_" + name].apply(this, arg0);
			}
			return true;
		};
		this.checkEvent = function(name) {
			if (this["ev_" + name]) {
				return true;
			}
			return false;
		};
		this.eventCatcher = function(obj) {
			var dhx_catch = new Array();
			var m_obj = obj;
			var z = function() {
				if (dhx_catch) {
					var res = true;
				}
				for ( var i = 0; i < dhx_catch.length; i++) {
					if (dhx_catch[i] != null) {
						var zr = dhx_catch[i].apply(m_obj, arguments);
						res = res && zr;
					}
				}
				return res;
			};
			z.addEvent = function(ev) {
				if (typeof (ev) != "function") {
					ev = eval(ev);
				}
				if (ev) {
					return dhx_catch.push(ev) - 1;
				}
				return false;
			};
			z.removeEvent = function(id) {
				dhx_catch[id] = null;
			};
			return z;
		};
		this.detachEvent = function(id) {
			if (id != false) {
				var list = id.split(":");
				this[list[0]].removeEvent(list[1]);
			}
		};
	},
	forEachRow : function(custom_code) {
		for (a in this.rowsAr) {
			if (this.rowsAr[a] && this.rowsAr[a].idd) {
				custom_code.apply(this, [ this.rowsAr[a].idd ]);
			}
		}
	},
	forEachCell : function(rowId, custom_code) {
		var z = this.rowsAr[rowId];
		if (!z) {
			return;
		}
		for ( var i = 0; i < this._cCount; i++) {
			custom_code(this.cells3(z, i), i);
		}
	},
	enableAutoWidth : function(mode, max_limit, min_limit) {
		this._awdth = [ convertStringToBoolean(mode), (max_limit || 99999),
				(min_limit || 0) ];
	},
	updateFromXML : function(url, insert_new, del_missed, afterCall) {
		if (typeof insert_new == "undefined") {
			insert_new = true;
		}
		this._refresh_mode = [ true, insert_new, del_missed ];
		this.load(url, afterCall);
	},
	_refreshFromXML : function(xml) {
		if (window.eXcell_tree) {
			eXcell_tree.prototype.setValueX = eXcell_tree.prototype.setValue;
			eXcell_tree.prototype.setValue = function(content) {
				if (this.grid._h2.get[this.cell.parentNode.idd]) {
					this.setLabel(content[1]);
					if (content[3]) {
						this.setImage(content[3]);
					}
				} else {
					this.setValueX(content);
				}
			};
		}
		var tree = this.cellType._dhx_find("tree");
		xml.getXMLTopNode("rows");
		var pid = xml.doXPath("//rows")[0].getAttribute("parent") || 0;
		var del = {};
		if (this._refresh_mode[2]) {
			if (tree != -1) {
				this._h2.forEachChild(pid, function(obj) {
					del[obj.id] = true;
				}, this);
			} else {
				this.forEachRow(function(id) {
					del[id] = true;
				});
			}
		}
		var rows = xml.doXPath("//row");
		for ( var i = 0; i < rows.length; i++) {
			var row = rows[i];
			var id = row.getAttribute("id");
			del[id] = false;
			var pid = row.parentNode.getAttribute("id") || pid;
			if (this.rowsAr[id] && this.rowsAr[id].tagName != "TR") {
				this.rowsAr[id].data = row;
			} else {
				if (this.rowsAr[id]) {
					this._process_xml_row(this.rowsAr[id], row, -1);
					this._postRowProcessing(this.rowsAr[id]);
				} else {
					if (this._refresh_mode[1]) {
						this.rowsBuffer.push({
							idd : id,
							data : row,
							_parser : this._process_xml_row,
							_locator : this._get_xml_data
						});
						this.rowsAr[id] = row;
						row = this.render_row(this.rowsBuffer.length - 1);
						this._insertRowAt(row, -1);
					}
				}
			}
		}
		if (this._refresh_mode[2]) {
			for (id in del) {
				if (del[id] && this.rowsAr[id]) {
					this.deleteRow(id);
				}
			}
		}
		this._refresh_mode = null;
		if (window.eXcell_tree) {
			eXcell_tree.prototype.setValue = eXcell_tree.prototype.setValueX;
		}
		this.callEvent("onXLE", [ this, rows.length ]);
	},
	getCustomCombo : function(id, ind) {
		var cell = this.cells(id, ind).cell;
		if (!cell._combo) {
			cell._combo = new dhtmlXGridComboObject();
		}
		return cell._combo;
	},
	setTabOrder : function(order) {
		var t = order.split(this.delim);
		this._tabOrder = [];
		for ( var i = 0; i < this._cCount; i++) {
			t[i] = {
				c : parseInt(t[i]),
				ind : i
			};
		}
		t.sort(function(a, b) {
			return (a.c > b.c ? 1 : -1);
		});
		for ( var i = 0; i < this._cCount; i++) {
			if (!t[i + 1] || (typeof t[i].c == "undefined")) {
				this._tabOrder[t[i].ind] = (t[0].ind + 1) * -1;
			} else {
				this._tabOrder[t[i].ind] = t[i + 1].ind;
			}
		}
	},
	i18n : {
		loading : "Loading",
		decimal_separator : ".",
		group_separator : ","
	},
	_key_events : {
		k13_1_0 : function() {
			var rowInd = this.rowsCol._dhx_find(this.row);
			this.selectCell(this.rowsCol[rowInd + 1], this.cell._cellIndex,
					true);
		},
		k13_0_1 : function() {
			var rowInd = this.rowsCol._dhx_find(this.row);
			this.selectCell(this.rowsCol[rowInd - 1], this.cell._cellIndex,
					true);
		},
		k13_0_0 : function() {
			this.editStop();
			this.callEvent("onEnter", [ (this.row ? this.row.idd : null),
					(this.cell ? this.cell._cellIndex : null) ]);
			this._still_active = true;
		},
		k9_0_0 : function() {
			this.editStop();
			var z = this._getNextCell(null, 1);
			if (z) {
				this.selectCell(z.parentNode, z._cellIndex,
						(this.row != z.parentNode), false, true);
				this._still_active = true;
			}
		},
		k9_0_1 : function() {
			this.editStop();
			var z = this._getNextCell(null, -1);
			if (z) {
				this.selectCell(z.parentNode, z._cellIndex,
						(this.row != z.parentNode), false, true);
				this._still_active = true;
			}
		},
		k113_0_0 : function() {
			if (this._f2kE) {
				this.editCell();
			}
		},
		k32_0_0 : function() {
			var c = this.cells4(this.cell);
			if (!c.changeState || (c.changeState() === false)) {
				return false;
			}
		},
		k27_0_0 : function() {
			this.editStop(true);
		},
		k33_0_0 : function() {
			if (this.pagingOn) {
				this.changePage(this.currentPage - 1);
			} else {
				this.scrollPage(-1);
			}
		},
		k34_0_0 : function() {
			if (this.pagingOn) {
				this.changePage(this.currentPage + 1);
			} else {
				this.scrollPage(1);
			}
		},
		k37_0_0 : function() {
			if (!this.editor && this.isTreeGrid()) {
				this.collapseKids(this.row);
			} else {
				return false;
			}
		},
		k39_0_0 : function() {
			if (!this.editor && this.isTreeGrid()) {
				this.expandKids(this.row);
			} else {
				return false;
			}
		},
		k40_0_0 : function() {
			if (this.editor && this.editor.combo) {
				this.editor.shiftNext();
			} else {
				var rowInd = this.rowsCol._dhx_find(this.row) + 1;
				if (rowInd != this.rowsCol.length
						&& rowInd != this.obj.rows.length - 1) {
					var nrow = this._nextRow(rowInd - 1, 1);
					this.selectCell(nrow, this.cell._cellIndex, true);
				} else {
					this._key_events.k34_0_0.apply(this, []);
					if (this.pagingOn && this.rowsCol[0]) {
						this.selectCell(0, 0, true);
					}
				}
			}
			this._still_active = true;
		},
		k38_0_0 : function() {
			if (this.editor && this.editor.combo) {
				this.editor.shiftPrev();
			} else {
				var rowInd = this.rowsCol._dhx_find(this.row) + 1;
				if (rowInd != -1 && (!this.pagingOn || (rowInd != 1))) {
					var nrow = this._nextRow(rowInd - 1, -1);
					this.selectCell(nrow, this.cell._cellIndex, true);
				} else {
					this._key_events.k33_0_0.apply(this, []);
					if (this.pagingOn
							&& this.rowsCol[this.rowsBufferOutSize - 1]) {
						this.selectCell(this.rowsBufferOutSize - 1, 0, true);
					}
				}
			}
			this._still_active = true;
		}
	},
	_build_master_row : function() {
		var t = document.createElement("DIV");
		var html = [ "<table><tr>" ];
		for ( var i = 0; i < this._cCount; i++) {
			html.push("<td></td>");
		}
		html.push("</tr></table>");
		t.innerHTML = html.join("");
		this._master_row = t.firstChild.rows[0];
	},
	_prepareRow : function(new_id) {
		if (!this._master_row) {
			this._build_master_row();
		}
		var r = this._master_row.cloneNode(true);
		for ( var i = 0; i < r.childNodes.length; i++) {
			r.childNodes[i]._cellIndex = i;
			if (this.dragAndDropOff) {
				this.dragger.addDraggableItem(r.childNodes[i], this);
			}
		}
		r.idd = new_id;
		r.grid = this;
		return r;
	},
	_process_jsarray_row : function(r, data) {
		r._attrs = {};
		for ( var j = 0; j < r.childNodes.length; j++) {
			r.childNodes[j]._attrs = {};
		}
		this._fillRow(r, (this._c_order ? this._swapColumns(data) : data));
		return r;
	},
	_get_jsarray_data : function(data, ind) {
		return data[ind];
	},
	_process_json_row : function(r, data) {
		r._attrs = {};
		for ( var j = 0; j < r.childNodes.length; j++) {
			r.childNodes[j]._attrs = {};
		}
		this._fillRow(r, (this._c_order ? this._swapColumns(data.data)
				: data.data));
		return r;
	},
	_get_json_data : function(data, ind) {
		return data.data[ind];
	},
	_process_csv_row : function(r, data) {
		r._attrs = {};
		for ( var j = 0; j < r.childNodes.length; j++) {
			r.childNodes[j]._attrs = {};
		}
		this._fillRow(r, (this._c_order ? this._swapColumns(data
				.split(this.csv.cell)) : data.split(this.csv.cell)));
		return r;
	},
	_get_csv_data : function(data, ind) {
		return data.split(this.csv.cell)[ind];
	},
	_process_xml_row : function(r, xml) {
		var cellsCol = this.xmlLoader.doXPath("./cell", xml);
		var strAr = [];
		r._attrs = this._xml_attrs(xml);
		if (this._ud_enabled) {
			var udCol = this.xmlLoader.doXPath("./userdata", xml);
			for ( var i = udCol.length - 1; i >= 0; i--) {
				this.setUserData(r.idd, udCol[i].getAttribute("name"),
						udCol[i].firstChild ? udCol[i].firstChild.data : "");
			}
		}
		for ( var j = 0; j < cellsCol.length; j++) {
			var cellVal = cellsCol[j];
			var exc = cellVal.getAttribute("type");
			if (r.childNodes[j]) {
				if (exc) {
					r.childNodes[j]._cellType = exc;
				}
				r.childNodes[j]._attrs = this._xml_attrs(cellsCol[j]);
			}
			if (cellVal.getAttribute("xmlcontent")) {
				cellVal = cellsCol[j];
			} else {
				if (cellVal.firstChild) {
					cellVal = cellVal.firstChild.data;
				} else {
					cellVal = "";
				}
			}
			strAr.push(cellVal);
		}
		for (j < cellsCol.length; j < r.childNodes.length; j++) {
			r.childNodes[j]._attrs = {};
		}
		if (r.parentNode && r.parentNode.tagName == "row") {
			r._attrs["parent"] = r.parentNode.getAttribute("idd");
		}
		this._fillRow(r, (this._c_order ? this._swapColumns(strAr) : strAr));
		return r;
	},
	_get_xml_data : function(data, ind) {
		data = data.firstChild;
		while (true) {
			if (!data) {
				return "";
			}
			if (data.tagName == "cell") {
				ind--;
			}
			if (ind < 0) {
				break;
			}
			data = data.nextSibling;
		}
		return (data.firstChild ? data.firstChild.data : "");
	},
	_fillRow : function(r, text) {
		if (this.editor) {
			this.editStop();
		}
		for ( var i = 0; i < r.childNodes.length; i++) {
			if ((i < text.length) || (this.defVal[i])) {
				var val = text[i];
				var aeditor = this.cells5(r.childNodes[i],
						(r.childNodes[i]._cellType || this.cellType[i]));
				if ((this.defVal[i])
						&& ((val == "") || (typeof (val) == "undefined"))) {
					val = this.defVal[i];
				}
				aeditor.setValue(val);
			} else {
				var val = "&nbsp;";
				r.childNodes[i].innerHTML = val;
				r.childNodes[i]._clearCell = true;
			}
		}
		return r;
	},
	_postRowProcessing : function(r) {
		if (r._attrs["class"]) {
			r.className = r._attrs["class"];
		}
		if (r._attrs.locked) {
			r._locked = true;
		}
		if (r._attrs.bgColor) {
			r.bgColor = r._attrs.bgColor;
		}
		var cor = 0;
		for ( var i = 0; i < r.childNodes.length; i++) {
			c = r.childNodes[i + cor];
			var s = c._attrs.style || r._attrs.style;
			if (s) {
				c.style.cssText += ";" + s;
			}
			if (c._attrs["class"]) {
				c.className = c._attrs["class"];
			}
			s = c._attrs.align || this.cellAlign[i];
			if (s) {
				c.align = s;
			}
			c.style.verticalAlign = c._attrs.valign || this.cellVAlign[i];
			var color = c._attrs.bgColor || this.columnColor[i];
			if (color) {
				c.bgColor = color;
			}
			if (c._attrs["colspan"]) {
				this.setColspan(r.idd, i, c._attrs["colspan"]);
				cor += (1 - c._attrs["colspan"]);
				i -= (1 - c._attrs["colspan"]);
			}
			if (this._hrrar && this._hrrar[i]) {
				c.style.display = "none";
			}
		}
		this.callEvent("onRowCreated", [ r.idd, r, null ]);
	},
	load : function(url, call, type) {
		this.callEvent("onXLS", [ this ]);
		if (arguments.length == 2 && typeof call != "function") {
			type = call;
			call = null;
		}
		type = type || "xml";
		if (!this.xmlFileUrl) {
			this.xmlFileUrl = url;
		}
		this._data_type = type;
		this.xmlLoader.onloadAction = function(that, b, c, d, xml) {
			xml = that["_process_" + type](xml);
			if (!that._contextCallTimer) {
				that.callEvent("onXLE", [ that, 0, 0, xml ]);
			}
			if (call) {
				call();
				call = null;
			}
		};
		this.xmlLoader.loadXML(url);
	},
	loadXMLString : function(str, afterCall) {
		var t = new dtmlXMLLoaderObject(function() {
		});
		t.loadXMLString(str);
		this.parse(t, afterCall, "xml");
	},
	loadXML : function(url, afterCall) {
		this.load(url, afterCall, "xml");
	},
	parse : function(data, call, type) {
		if (arguments.length == 2 && typeof call != "function") {
			type = call;
			call = null;
		}
		type = type || "xml";
		this._data_type = type;
		data = this["_process_" + type](data);
		if (!this._contextCallTimer) {
			this.callEvent("onXLE", [ this, 0, 0, data ]);
		}
		if (call) {
			call();
		}
	},
	xml : {
		top : "rows",
		row : "./row",
		cell : "./cell",
		s_row : "row",
		s_cell : "cell",
		row_attrs : [],
		cell_attrs : []
	},
	csv : {
		row : "\n",
		cell : ","
	},
	_xml_attrs : function(node) {
		var data = {};
		if (node.attributes.length) {
			for ( var i = 0; i < node.attributes.length; i++) {
				data[node.attributes[i].name] = node.attributes[i].value;
			}
		}
		return data;
	},
	_process_xml : function(xml) {
		if (this._refresh_mode) {
			return this._refreshFromXML(xml);
		}
		if (!xml.doXPath) {
			var t = new dtmlXMLLoaderObject(function() {
			});
			if (typeof xml == "string") {
				t.loadXMLString(xml);
			} else {
				if (xml.responseXML) {
					t.xmlDoc = xml;
				} else {
					t.xmlDoc = {};
				}
				t.xmlDoc.responseXML = xml;
			}
			xml = t;
		}
		this._parsing = true;
		var top = xml.getXMLTopNode(this.xml.top);
		if (top.tagName.toLowerCase() != this.xml.top) {
			return;
		}
		this._parseHead(top);
		var rows = xml.doXPath(this.xml.row, top);
		var cr = parseInt(xml.doXPath("//" + this.xml.top)[0]
				.getAttribute("pos") || 0);
		var total = parseInt(xml.doXPath("//" + this.xml.top)[0]
				.getAttribute("total_count") || 0);
		if (total && !this.rowsBuffer[total - 1]) {
			this.rowsBuffer[total - 1] = null;
		}
		if (this.isTreeGrid()) {
			return this._process_tree_xml(xml);
		}
		for ( var i = 0; i < rows.length; i++) {
			if (this.rowsBuffer[i + cr]) {
				continue;
			}
			var id = rows[i].getAttribute("id");
			this.rowsBuffer[i + cr] = {
				idd : id,
				data : rows[i],
				_parser : this._process_xml_row,
				_locator : this._get_xml_data
			};
			this.rowsAr[id] = rows[i];
		}
		this.render_dataset();
		this._parsing = false;
		return xml.xmlDoc.responseXML ? xml.xmlDoc.responseXML : xml.xmlDoc;
	},
	_process_jsarray : function(data) {
		this._parsing = true;
		if (data && data.xmlDoc) {
			eval("data=" + data.xmlDoc.responseText + ";");
		}
		for ( var i = 0; i < data.length; i++) {
			var id = i + 1;
			this.rowsBuffer.push({
				idd : id,
				data : data[i],
				_parser : this._process_jsarray_row,
				_locator : this._get_jsarray_data
			});
			this.rowsAr[id] = data[i];
		}
		this.render_dataset();
		this._parsing = false;
	},
	_process_csv : function(data) {
		this._parsing = true;
		if (data.xmlDoc) {
			data = data.xmlDoc.responseText;
		}
		data = data.replace(/\r/g, "");
		data = data.split(this.csv.row);
		if (this._csvHdr) {
			this.clearAll();
			this.setHeader(data.splice(0, 1).split(this.csv.cell).join(
					this.delim));
			this.init();
		}
		for ( var i = 0; i < data.length; i++) {
			if (this._csvAID) {
				var id = i + 1;
				this.rowsBuffer.push({
					idd : id,
					data : data[i],
					_parser : this._process_csv_row,
					_locator : this._get_csv_data
				});
			} else {
				var temp = data[i].split(this.csv.cell);
				var id = temp.splice(0, 1)[0];
				this.rowsBuffer.push({
					idd : id,
					data : temp,
					_parser : this._process_jsarray_row,
					_locator : this._get_jsarray_data
				});
			}
			this.rowsAr[id] = data[i];
		}
		this.render_dataset();
		this._parsing = false;
	},
	_process_json : function(data) {
		this._parsing = true;
		if (data && data.xmlDoc) {
			eval("data=" + data.xmlDoc.responseText + ";");
		}
		for ( var i = 0; i < data.rows.length; i++) {
			var id = data.rows[i].id;
			this.rowsBuffer.push({
				idd : id,
				data : data.rows[i],
				_parser : this._process_json_row,
				_locator : this._get_json_data
			});
			this.rowsAr[id] = data[i];
		}
		this.render_dataset();
		this._parsing = false;
	},
	render_dataset : function(min, max) {
		if (this._srnd) {
			if (this._fillers) {
				return this._update_srnd_view();
			}
			max = Math.min(this._get_view_size(), this.rowsBuffer.length);
		}
		if (this.pagingOn) {
			min = (this.currentPage - 1) * this.rowsBufferOutSize;
			max = Math
					.min(min + this.rowsBufferOutSize, this.rowsBuffer.length);
		} else {
			min = min || 0;
			max = max || this.rowsBuffer.length;
		}
		for ( var i = min; i < max; i++) {
			var r = this.render_row(i);
			if (r == -1) {
				if (this.xmlFileUrl) {
					this.load(this.xmlFileUrl + getUrlSymbol(this.xmlFileUrl)
							+ "posStart=" + i + "&count="
							+ (this._dpref ? this._dpref : (max - i)),
							this._data_type);
				}
				max = i;
				break;
			}
			if (!r.parentNode || !r.parentNode.tagName) {
				this._insertRowAt(r, i);
				if (r._attrs["selected"]) {
					this.selectRow(r, false, true);
					delete r._attrs["selected"];
				}
			}
			if (this._ads_count && i - min == this._ads_count) {
				var that = this;
				return this._contextCallTimer = window.setTimeout(function() {
					that._contextCallTimer = null;
					that.render_dataset(i, max);
					if (!that._contextCallTimer) {
						that.callEvent("onXLE", []);
					}
				}, this._ads_time);
			}
		}
		if (this._srnd && !this._fillers) {
			this._fillers = [ this._add_filler(max, this.rowsBuffer.length
					- max) ];
		}
		this.setSizes();
	},
	render_row : function(ind) {
		if (!this.rowsBuffer[ind]) {
			return -1;
		}
		if (this.rowsBuffer[ind]._parser) {
			var r = this.rowsBuffer[ind];
			var row = this._prepareRow(r.idd);
			this.rowsBuffer[ind] = row;
			this.rowsAr[r.idd] = row;
			r._parser.call(this, row, r.data);
			this._postRowProcessing(row);
			return row;
		}
		return this.rowsBuffer[ind];
	},
	_get_cell_value : function(row, ind, method) {
		if (row._locator) {
			if (this._c_order) {
				ind = this._c_order[ind];
			}
			return row._locator.call(this, row.data, ind);
		}
		return this.cells3(row, ind)[method ? method : "getValue"]();
	},
	sortRows : function(col, type, order) {
		order = (order || "asc").toLowerCase();
		type = (type || this.fldSort[col]);
		col = col || 0;
		if (this.isTreeGrid()) {
			return this.sortTreeRows(col, type, order);
		}
		var arrTS = {};
		var atype = this.cellType[col];
		var amet = "getValue";
		if (atype == "link") {
			amet = "getContent";
		}
		if (atype == "dhxCalendar" || atype == "dhxCalendarA") {
			amet = "getDate";
		}
		for ( var i = 0; i < this.rowsBuffer.length; i++) {
			arrTS[this.rowsBuffer[i].idd] = this._get_cell_value(
					this.rowsBuffer[i], col, amet);
		}
		this._sortRows(col, type, order, arrTS);
	},
	_sortCore : function(col, type, order, arrTS, s) {
		var sort = "sort";
		if (this._sst) {
			s["stablesort"] = this.rowsCol.stablesort;
			sort = "stablesort";
		}
		if (type.length > 4) {
			type = window[type];
		}
		if (type == "cus") {
			var cstr = this._customSorts[col];
			s[sort](function(a, b) {
				return cstr(arrTS[a.idd], arrTS[b.idd], order, a.idd, b.idd);
			});
		} else {
			if (typeof (type) == "function") {
				s[sort]
						(function(a, b) {
							return type(arrTS[a.idd], arrTS[b.idd], order,
									a.idd, b.idd);
						});
			} else {
				if (type == "str") {
					s[sort](function(a, b) {
						if (order == "asc") {
							return arrTS[a.idd] > arrTS[b.idd] ? 1 : -1;
						} else {
							return arrTS[a.idd] < arrTS[b.idd] ? 1 : -1;
						}
					});
				} else {
					if (type == "int") {
						s[sort](function(a, b) {
							var aVal = parseFloat(arrTS[a.idd]);
							aVal = isNaN(aVal) ? -99999999999999 : aVal;
							var bVal = parseFloat(arrTS[b.idd]);
							bVal = isNaN(bVal) ? -99999999999999 : bVal;
							if (order == "asc") {
								return aVal - bVal;
							} else {
								return bVal - aVal;
							}
						});
					} else {
						if (type == "date") {
							s[sort](function(a, b) {
								var aVal = Date.parse(arrTS[a.idd])
										|| (Date.parse("01/01/1900"));
								var bVal = Date.parse(arrTS[b.idd])
										|| (Date.parse("01/01/1900"));
								if (order == "asc") {
									return aVal - bVal;
								} else {
									return bVal - aVal;
								}
							});
						}
					}
				}
			}
		}
	},
	_sortRows : function(col, type, order, arrTS) {
		this._sortCore(col, type, order, arrTS, this.rowsBuffer);
		this._reset_view();
		this.callEvent("onGridReconstructed", []);
	},
	_reset_view : function(skip) {
		var tb = this.obj.rows[0].parentNode;
		var tr = tb.removeChild(tb.childNodes[0], true);
		if (_isKHTML) {
			for ( var i = tb.parentNode.childNodes.length - 1; i >= 0; i--) {
				if (tb.parentNode.childNodes[i].tagName == "TR") {
					tb.parentNode
							.removeChild(tb.parentNode.childNodes[i], true);
				}
			}
		} else {
			if (_isIE) {
				for ( var i = tb.childNodes.length - 1; i >= 0; i--) {
					tb.childNodes[i].removeNode(true);
				}
			} else {
				tb.innerHTML = "";
			}
		}
		tb.appendChild(tr);
		this.rowsCol = dhtmlxArray();
		this._fillers = this.undefined;
		if (!skip) {
			this.render_dataset();
		}
	},
	deleteRow : function(row_id, node) {
		if (!node) {
			node = this.getRowById(row_id);
		}
		if (!node) {
			return;
		}
		this.editStop();
		if (this.callEvent("onBeforeRowDeleted", [ row_id ]) == false) {
			return false;
		}
		if (this.cellType._dhx_find("tree") != -1) {
			this._removeTrGrRow(node);
		} else {
			if (node.parentNode) {
				node.parentNode.removeChild(node);
			}
			var ind = this.rowsCol._dhx_find(node);
			if (ind != -1) {
				this.rowsCol._dhx_removeAt(ind);
			}
			for ( var i = 0; i < this.rowsBuffer.length; i++) {
				if (this.rowsBuffer[i] && this.rowsBuffer[i].idd == row_id) {
					this.rowsBuffer._dhx_removeAt(i);
					ind = i;
					break;
				}
			}
		}
		this.rowsAr[row_id] = null;
		for ( var i = 0; i < this.selectedRows.length; i++) {
			if (this.selectedRows[i].idd == row_id) {
				this.selectedRows._dhx_removeAt(i);
			}
		}
		if (this._srnd) {
			for ( var i = 0; i < this._fillers.length; i++) {
				var f = this._fillers[i];
				if (f[0] >= ind) {
					f[0] = f[0] - 1;
				} else {
					if (f[1] >= ind) {
						f[1] = f[1] - 1;
					}
				}
			}
			this._update_srnd_view();
		}
		if (this.pagingOn) {
			this.changePage();
		}
		this.callEvent("onGridReconstructed", []);
		return true;
	},
	_addRow : function(new_id, text, ind) {
		if (ind == -1 || typeof ind == "undefined") {
			ind = this.rowsBuffer.length;
		}
		if (typeof text == "string") {
			text = text.split(this.delim);
		}
		var row = this._prepareRow(new_id);
		row._attrs = {};
		for ( var j = 0; j < row.childNodes.length; j++) {
			row.childNodes[j]._attrs = {};
		}
		this.rowsAr[row.idd] = row;
		this._fillRow(row, text);
		this._postRowProcessing(row);
		if (this._skipInsert) {
			this._skipInsert = false;
			return this.rowsAr[row.idd] = row;
		}
		if (this.pagingOn) {
			this.rowsBuffer._dhx_insertAt(ind, row);
			this.rowsAr[row.idd] = row;
			return row;
		}
		if (this._fillers) {
			this.rowsCol._dhx_insertAt(ind, null);
			this.rowsBuffer._dhx_insertAt(ind, row);
			this.rowsAr[row.idd] = row;
			var found = false;
			for ( var i = 0; i < this._fillers.length; i++) {
				var f = this._fillers[i];
				if (f && f[0] <= ind && (f[0] + f[1]) >= ind) {
					f[1] = f[1] + 1;
					found = true;
				}
				if (f && f[0] >= ind) {
					f[0] = f[0] + 1;
				}
			}
			if (!found) {
				this._fillers.push(this._add_filler(ind, 1, (ind == 0 ? {
					parentNode : this.obj.rows[0].parentNode,
					nextSibling : (this.rowsCol[1])
				} : this.rowsCol[ind - 1])));
			}
			return row;
		}
		this.rowsBuffer._dhx_insertAt(ind, row);
		return this._insertRowAt(row, ind);
	},
	addRow : function(new_id, text, ind) {
		var r = this._addRow(new_id, text, ind);
		if (!this.dragContext) {
			this.callEvent("onRowAdded", [ new_id ]);
		}
		if (this.pagingOn) {
			this.changePage(this.currentPage);
		}
		if (this._srnd) {
			this._update_srnd_view();
		}
		r._added = true;
		if (this._ahgr) {
			this.setSizes();
		}
		this.callEvent("onGridReconstructed", []);
		return r;
	},
	_insertRowAt : function(r, ind, skip) {
		this.rowsAr[r.idd] = r;
		if (this._skipInsert) {
			this._skipInsert = false;
			return r;
		}
		if ((ind < 0) || ((!ind) && (parseInt(ind) !== 0))) {
			ind = this.rowsCol.length;
		} else {
			if (ind > this.rowsCol.length) {
				ind = this.rowsCol.length;
			}
		}
		if (this._cssEven) {
			if ((this._cssSP ? this.getLevel(r.idd) : ind) % 2 == 1) {
				r.className += " "
						+ this._cssUnEven
						+ (this._cssSU ? (this._cssUnEven + "_" + this
								.getLevel(r.idd)) : "");
			} else {
				r.className += " "
						+ this._cssEven
						+ (this._cssSU ? (" " + this._cssEven + "_" + this
								.getLevel(r.idd)) : "");
			}
		}
		if (!skip) {
			if ((ind == (this.obj.rows.length - 1)) || (!this.rowsCol[ind])) {
				if (_isKHTML) {
					this.obj.appendChild(r);
				} else {
					this.obj.firstChild.appendChild(r);
				}
			} else {
				this.rowsCol[ind].parentNode.insertBefore(r, this.rowsCol[ind]);
			}
		}
		this.rowsCol._dhx_insertAt(ind, r);
		return r;
	},
	getRowById : function(id) {
		var row = this.rowsAr[id];
		if (row) {
			if (row.tagName != "TR") {
				for ( var i = 0; i < this.rowsBuffer.length; i++) {
					if (this.rowsBuffer[i] && this.rowsBuffer[i].idd == id) {
						return this.render_row(i);
					}
				}
				if (this._h2) {
					return this.render_row(null, row.idd);
				}
			}
			return row;
		}
		return null;
	},
	cellById : function(row_id, col) {
		return this.cells(row_id, col);
	},
	cells : function(row_id, col) {
		if (arguments.length == 0) {
			return this.cells4(this.cell);
		} else {
			var c = this.getRowById(row_id);
		}
		var cell = (c._childIndexes ? c.childNodes[c._childIndexes[col]]
				: c.childNodes[col]);
		return this.cells4(cell);
	},
	cellByIndex : function(row_index, col) {
		return this.cells2(row_index, col);
	},
	cells2 : function(row_index, col) {
		var c = this.render_row(row_index);
		var cell = (c._childIndexes ? c.childNodes[c._childIndexes[col]]
				: c.childNodes[col]);
		return this.cells4(cell);
	},
	cells3 : function(row, col) {
		var cell = (row._childIndexes ? row.childNodes[row._childIndexes[col]]
				: row.childNodes[col]);
		return this.cells4(cell);
	},
	cells4 : function(cell) {
		var type = window["eXcell_"
				+ (cell._cellType || this.cellType[cell._cellIndex])];
		if (type) {
			return new type(cell);
		}
	},
	cells5 : function(cell, type) {
		var type = type || (cell._cellType || this.cellType[cell._cellIndex]);
		if (!this._ecache[type]) {
			if (!window["eXcell_" + type]) {
				var tex = eXcell_ro;
			} else {
				var tex = window["eXcell_" + type];
			}
			this._ecache[type] = new tex(cell);
		}
		this._ecache[type].cell = cell;
		return this._ecache[type];
	},
	dma : function(mode) {
		if (!this._ecache) {
			this._ecache = {};
		}
		if (mode && !this._dma) {
			this._dma = this.cells4;
			this.cells4 = this.cells5;
		} else {
			if (!mode && this._dma) {
				this.cells4 = this._dma;
				this._dma = null;
			}
		}
	},
	getRowsNum : function() {
		return this.rowsBuffer.length;
	},
	enableEditTabOnly : function(mode) {
		if (arguments.length > 0) {
			this.smartTabOrder = convertStringToBoolean(mode);
		} else {
			this.smartTabOrder = true;
		}
	},
	setExternalTabOrder : function(start, end) {
		var grid = this;
		this.tabStart = (typeof (start) == "object") ? start : document
				.getElementById(start);
		this.tabStart.onkeydown = function(e) {
			var ev = (e || window.event);
			ev.cancelBubble = true;
			if (ev.keyCode == 9) {
				grid.selectCell(0, 0, 0, 0, 1);
				if (grid.cells2(0, 0).isDisabled()) {
					grid._key_events["k9_0_0"].call(grid);
				}
				return false;
			}
		};
		this.tabEnd = (typeof (end) == "object") ? end : document
				.getElementById(end);
		this.tabEnd.onkeydown = function(e) {
			var ev = (e || window.event);
			ev.cancelBubble = true;
			if ((ev.keyCode == 9) && ev.shiftKey) {
				grid.selectCell((grid.getRowsNum() - 1),
						(grid.getColumnCount() - 1), 0, 0, 1);
				if (grid.cells2((grid.getRowsNum() - 1),
						(grid.getColumnCount() - 1)).isDisabled()) {
					grid._key_events["k9_0_1"].call(grid);
				}
				return false;
			}
		};
	},
	uid : function() {
		if (!this._ui_seed) {
			this._ui_seed = (new Date()).valueOf();
		}
		return this._ui_seed++;
	},
	clearAndLoad : function() {
		var t = this._pgn_skin;
		this._pgn_skin = null;
		this.clearAll();
		this._pgn_skin = t;
		this.load.apply(this, arguments);
	},
	getStateOfView : function() {
		if (this.pagingOn) {
			return [
					this.currentPage,
					(this.currentPage - 1) * this.rowsBufferOutSize,
					(this.currentPage - 1) * this.rowsBufferOutSize
							+ this.rowsCol.length, this.rowsBuffer.length ];
		}
		return [ Math.floor(this.objBox.scrollTop / this._srdh),
				Math.ceil(parseInt(this.objBox.offsetHeight) / this._srdh),
				this.limit ];
	}
};
function dhtmlXGridCellObject(obj) {
	this.destructor = function() {
		this.cell.obj = null;
		this.cell = null;
		this.grid = null;
		this.base = null;
		return null;
	};
	this.cell = obj;
	this.getValue = function() {
		if ((this.cell.firstChild)
				&& (this.cell.firstChild.tagName == "TEXTAREA")) {
			return this.cell.firstChild.value;
		} else {
			return this.cell.innerHTML._dhx_trim();
		}
	};
	this.getMathValue = function() {
		if (this.cell._val) {
			return this.cell._val;
		} else {
			return this.getValue();
		}
	};
	this.getFont = function() {
		arOut = new Array(3);
		if (this.cell.style.fontFamily) {
			arOut[0] = this.cell.style.fontFamily;
		}
		if (this.cell.style.fontWeight == "bold"
				|| this.cell.parentNode.style.fontWeight == "bold") {
			arOut[1] = "bold";
		}
		if (this.cell.style.fontStyle == "italic"
				|| this.cell.parentNode.style.fontWeight == "italic") {
			arOut[1] += "italic";
		}
		if (this.cell.style.fontSize) {
			arOut[2] = this.cell.style.fontSize;
		} else {
			arOut[2] = "";
		}
		return arOut.join("-");
	};
	this.getTextColor = function() {
		if (this.cell.style.color) {
			return this.cell.style.color;
		} else {
			return "#000000";
		}
	};
	this.getBgColor = function() {
		if (this.cell.bgColor) {
			return this.cell.bgColor;
		} else {
			return "#FFFFFF";
		}
	};
	this.getHorAlign = function() {
		if (this.cell.style.textAlign) {
			return this.cell.style.textAlign;
		} else {
			if (this.cell.align) {
				return this.cell.align;
			} else {
				return "left";
			}
		}
	};
	this.getWidth = function() {
		return this.cell.scrollWidth;
	};
	this.setFont = function(val) {
		fntAr = val.split("-");
		this.cell.style.fontFamily = fntAr[0];
		this.cell.style.fontSize = fntAr[fntAr.length - 1];
		if (fntAr.length == 3) {
			if (/bold/.test(fntAr[1])) {
				this.cell.style.fontWeight = "bold";
			}
			if (/italic/.test(fntAr[1])) {
				this.cell.style.fontStyle = "italic";
			}
			if (/underline/.test(fntAr[1])) {
				this.cell.style.textDecoration = "underline";
			}
		}
	};
	this.setTextColor = function(val) {
		this.cell.style.color = val;
	};
	this.setBgColor = function(val) {
		if (val == "") {
			val = null;
		}
		this.cell.bgColor = val;
	};
	this.setHorAlign = function(val) {
		if (val.length == 1) {
			if (val == "c") {
				this.cell.style.textAlign = "center";
			} else {
				if (val == "l") {
					this.cell.style.textAlign = "left";
				} else {
					this.cell.style.textAlign = "right";
				}
			}
		} else {
			this.cell.style.textAlign = val;
		}
	};
	this.wasChanged = function() {
		if (this.cell.wasChanged) {
			return true;
		} else {
			return false;
		}
	};
	this.isCheckbox = function() {
		var ch = this.cell.firstChild;
		if (ch && ch.tagName == "INPUT") {
			type = ch.type;
			if (type == "radio" || type == "checkbox") {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	};
	this.isChecked = function() {
		if (this.isCheckbox()) {
			return this.cell.firstChild.checked;
		}
	};
	this.isDisabled = function() {
		return this.cell._disabled;
	};
	this.setChecked = function(fl) {
		if (this.isCheckbox()) {
			if (fl != "true" && fl != 1) {
				fl = false;
			}
			this.cell.firstChild.checked = fl;
		}
	};
	this.setDisabled = function(fl) {
		if (fl != "true" && fl != 1) {
			fl = false;
		}
		if (this.isCheckbox()) {
			this.cell.firstChild.disabled = fl;
			if (this.disabledF) {
				this.disabledF(fl);
			}
		}
		this.cell._disabled = fl;
	};
}
dhtmlXGridCellObject.prototype = {
	getAttribute : function(name) {
		return this.cell._attrs[name];
	},
	setAttribute : function(name, value) {
		this.cell._attrs[name] = value;
	}
};
dhtmlXGridCellObject.prototype.setValue = function(val) {
	if ((typeof (val) != "number")
			&& (!val || val.toString()._dhx_trim() == "")) {
		val = "&nbsp;";
		this.cell._clearCell = true;
	} else {
		this.cell._clearCell = false;
	}
	this.setCValue(val);
};
dhtmlXGridCellObject.prototype.getTitle = function() {
	return (_isIE ? this.cell.innerText : this.cell.textContent);
};
dhtmlXGridCellObject.prototype.setCValue = function(val, val2) {
	this.cell.innerHTML = val;
	this.grid.callEvent("onCellChanged", [ this.cell.parentNode.idd,
			this.cell._cellIndex, (arguments.length > 1 ? val2 : val) ]);
};
dhtmlXGridCellObject.prototype.setCTxtValue = function(val) {
	this.cell.innerHTML = "";
	this.cell.appendChild(document.createTextNode(val));
	this.grid.callEvent("onCellChanged", [ this.cell.parentNode.idd,
			this.cell._cellIndex, val ]);
};
dhtmlXGridCellObject.prototype.setLabel = function(val) {
	this.cell.innerHTML = val;
};
dhtmlXGridCellObject.prototype.getMath = function() {
	if (this._val) {
		return this.val;
	} else {
		return this.getValue();
	}
};
function eXcell() {
	this.obj = null;
	this.val = null;
	this.changeState = function() {
		return false;
	};
	this.edit = function() {
		this.val = this.getValue();
	};
	this.detach = function() {
		return false;
	};
	this.getPosition = function(oNode) {
		var oCurrentNode = oNode;
		var iLeft = 0;
		var iTop = 0;
		while (oCurrentNode.tagName != "BODY") {
			iLeft += oCurrentNode.offsetLeft;
			iTop += oCurrentNode.offsetTop;
			oCurrentNode = oCurrentNode.offsetParent;
		}
		return new Array(iLeft, iTop);
	};
}
eXcell.prototype = new dhtmlXGridCellObject;
function eXcell_ed(cell) {
	if (cell) {
		this.cell = cell;
		this.grid = this.cell.parentNode.grid;
	}
	this.edit = function() {
		this.cell.atag = ((!this.grid.multiLine) && (_isKHTML || _isMacOS || _isFF)) ? "INPUT"
				: "TEXTAREA";
		this.val = this.getValue();
		this.obj = document.createElement(this.cell.atag);
		this.obj.setAttribute("autocomplete", "off");
		this.obj.style.height = (this.cell.offsetHeight - (_isIE ? 4 : 2))
				+ "px";
		this.obj.className = "dhx_combo_edit";
		this.obj.wrap = "soft";
		this.obj.style.textAlign = this.cell.align;
		this.obj.onclick = function(e) {
			(e || event).cancelBubble = true;
		};
		this.obj.onmousedown = function(e) {
			(e || event).cancelBubble = true;
		};
		this.obj.value = this.val;
		this.cell.innerHTML = "";
		this.cell.appendChild(this.obj);
		if (_isFF) {
			this.obj.style.overflow = "visible";
			if ((this.grid.multiLine) && (this.obj.offsetHeight >= 18)
					&& (this.obj.offsetHeight < 40)) {
				this.obj.style.height = "36px";
				this.obj.style.overflow = "scroll";
			}
		}
		this.obj.onselectstart = function(e) {
			if (!e) {
				e = event;
			}
			e.cancelBubble = true;
			return true;
		};
		this.obj.focus();
		this.obj.focus();
	};
	this.getValue = function() {
		if ((this.cell.firstChild)
				&& ((this.cell.atag) && (this.cell.firstChild.tagName == this.cell.atag))) {
			return this.cell.firstChild.value;
		}
		if (this.cell._clearCell) {
			return "";
		}
		return this.cell.innerHTML.toString()._dhx_trim();
	};
	this.detach = function() {
		this.setValue(this.obj.value);
		return this.val != this.getValue();
	};
}
eXcell_ed.prototype = new eXcell;
function eXcell_edtxt(cell) {
	if (cell) {
		this.cell = cell;
		this.grid = this.cell.parentNode.grid;
	}
	this.getValue = function() {
		if ((this.cell.firstChild)
				&& ((this.cell.atag) && (this.cell.firstChild.tagName == this.cell.atag))) {
			return this.cell.firstChild.value;
		}
		if (this.cell._clearCell) {
			return "";
		}
		return (_isIE ? this.cell.innerText : this.cell.textContent);
	};
	this.setValue = function(val) {
		if (!val || val.toString()._dhx_trim() == "") {
			val = " ";
			this.cell._clearCell = true;
		} else {
			this.cell._clearCell = false;
		}
		this.setCTxtValue(val);
	};
}
eXcell_edtxt.prototype = new eXcell_ed;
function eXcell_edn(cell) {
	if (cell) {
		this.cell = cell;
		this.grid = this.cell.parentNode.grid;
	}
	this.getValue = function() {
		if ((this.cell.firstChild)
				&& (this.cell.firstChild.tagName == "TEXTAREA")) {
			return this.cell.firstChild.value;
		}
		if (this.cell._clearCell) {
			return "";
		}
		return this.grid._aplNFb(this.cell.innerHTML.toString()._dhx_trim(),
				this.cell._cellIndex);
	};
	this.detach = function() {
		var tv = this.obj.value;
		this.setValue(tv);
		return this.val != this.getValue();
	};
}
eXcell_edn.prototype = new eXcell_ed;
eXcell_edn.prototype.setValue = function(val) {
	if (!val || val.toString()._dhx_trim() == "") {
		val = "0";
		this.cell._clearCell = true;
	} else {
		this.cell._clearCell = false;
	}
	this.setCValue(this.grid._aplNF(val, this.cell._cellIndex));
};
function eXcell_ch(cell) {
	if (cell) {
		this.cell = cell;
		this.grid = this.cell.parentNode.grid;
		this.cell.obj = this;
	}
	this.disabledF = function(fl) {
		if ((fl == true) || (fl == 1)) {
			this.cell.innerHTML = this.cell.innerHTML.replace("item_chk0.",
					"item_chk0_dis.").replace("item_chk1.", "item_chk1_dis.");
		} else {
			this.cell.innerHTML = this.cell.innerHTML.replace("item_chk0_dis.",
					"item_chk0.").replace("item_chk1_dis.", "item_chk1.");
		}
	};
	this.changeState = function() {
		if ((!this.grid.isEditable) || (this.cell.parentNode._locked)
				|| (this.isDisabled())) {
			return;
		}
		if (this.grid.callEvent("onEditCell", [ 0, this.cell.parentNode.idd,
				this.cell._cellIndex ])) {
			this.val = this.getValue();
			if (this.val == "1") {
				this.setValue("0");
			} else {
				this.setValue("1");
			}
			this.cell.wasChanged = true;
			this.grid.callEvent("onEditCell", [ 1, this.cell.parentNode.idd,
					this.cell._cellIndex ]);
			this.grid.callEvent("onCheckbox", [ this.cell.parentNode.idd,
					this.cell._cellIndex, (this.val != "1") ]);
			this.grid.callEvent("onCheck", [ this.cell.parentNode.idd,
					this.cell._cellIndex, (this.val != "1") ]);
		} else {
			this.editor = null;
		}
	};
	this.getValue = function() {
		return this.cell.chstate ? this.cell.chstate.toString() : "0";
	};
	this.isCheckbox = function() {
		return true;
	};
	this.isChecked = function() {
		if (this.getValue() == "1") {
			return true;
		} else {
			return false;
		}
	};
	this.setChecked = function(fl) {
		this.setValue(fl.toString());
	};
	this.detach = function() {
		return this.val != this.getValue();
	};
	this.edit = null;
}
eXcell_ch.prototype = new eXcell;
eXcell_ch.prototype.setValue = function(val) {
	this.cell.style.verticalAlign = "middle";
	if (val) {
		val = val.toString()._dhx_trim();
		if ((val == "false") || (val == "0")) {
			val = "";
		}
	}
	if (val) {
		val = "1";
		this.cell.chstate = "1";
	} else {
		val = "0";
		this.cell.chstate = "0";
	}
	var obj = this;
	this
			.setCValue(
					"<img src='"
							+ this.grid.imgURL
							+ "item_chk"
							+ val
							+ ".gif' onclick='new eXcell_ch(this.parentNode).changeState();(arguments[0]||event).cancelBubble=true;'>",
					this.cell.chstate);
};
function eXcell_ra(cell) {
	this.base = eXcell_ch;
	this.base(cell);
	this.grid = cell.parentNode.grid;
	this.disabledF = function(fl) {
		if ((fl == true) || (fl == 1)) {
			this.cell.innerHTML = this.cell.innerHTML.replace("radio_chk0.",
					"radio_chk0_dis.")
					.replace("radio_chk1.", "radio_chk1_dis.");
		} else {
			this.cell.innerHTML = this.cell.innerHTML.replace(
					"radio_chk0_dis.", "radio_chk0.").replace(
					"radio_chk1_dis.", "radio_chk1.");
		}
	};
	this.changeState = function() {
		if ((!this.grid.isEditable) || (this.cell.parentNode._locked)) {
			return;
		}
		if (this.grid.callEvent("onEditCell", [ 0, this.cell.parentNode.idd,
				this.cell._cellIndex ]) != false) {
			this.val = this.getValue();
			if (this.val == "1") {
				this.setValue("0");
			} else {
				this.setValue("1");
			}
			this.cell.wasChanged = true;
			this.grid.callEvent("onEditCell", [ 1, this.cell.parentNode.idd,
					this.cell._cellIndex ]);
			this.grid.callEvent("onCheckbox", [ this.cell.parentNode.idd,
					this.cell._cellIndex, (this.val != "1") ]);
			this.grid.callEvent("onCheck", [ this.cell.parentNode.idd,
					this.cell._cellIndex, (this.val != "1") ]);
		} else {
			this.editor = null;
		}
	};
	this.edit = null;
}
eXcell_ra.prototype = new eXcell_ch;
eXcell_ra.prototype.setValue = function(val) {
	this.cell.style.verticalAlign = "middle";
	if (val) {
		val = val.toString()._dhx_trim();
		if ((val == "false") || (val == "0")) {
			val = "";
		}
	}
	if (val) {
		if (!this.grid._RaSeCol) {
			this.grid._RaSeCol = [];
		}
		if (this.grid._RaSeCol[this.cell._cellIndex]) {
			var z = this.grid.cells4(this.grid._RaSeCol[this.cell._cellIndex]);
			z.setValue("0");
			if (this.grid.rowsAr[z.cell.parentNode.idd]) {
				this.grid.callEvent("onEditCell", [ 1, z.cell.parentNode.idd,
						z.cell._cellIndex ]);
			}
		}
		this.grid._RaSeCol[this.cell._cellIndex] = this.cell;
		val = "1";
		this.cell.chstate = "1";
	} else {
		val = "0";
		this.cell.chstate = "0";
	}
	var obj = this;
	this.setCValue("<img src='" + this.grid.imgURL + "radio_chk" + val
			+ ".gif' onclick='this.parentNode.obj.changeState()'>",
			this.cell.chstate);
};
function eXcell_txt(cell) {
	if (cell) {
		this.cell = cell;
		this.grid = this.cell.parentNode.grid;
	}
	this.edit = function() {
		this.val = this.getValue();
		this.obj = document.createElement("TEXTAREA");
		this.obj.className = "dhx_textarea";
		this.obj.onclick = function(e) {
			(e || event).cancelBubble = true;
		};
		var arPos = this.grid.getPosition(this.cell);
		if (!this.cell._clearCell) {
			this.obj.value = this.val;
		}
		this.obj.style.display = "";
		this.obj.style.textAlign = this.cell.align;
		if (_isFF) {
			var z_ff = document.createElement("DIV");
			z_ff.appendChild(this.obj);
			z_ff.style.overflow = "auto";
			z_ff.className = "dhx_textarea";
			this.obj.style.margin = "0px 0px 0px 0px";
			this.obj.style.border = "0px";
			this.obj = z_ff;
		}
		document.body.appendChild(this.obj);
		this.obj.onkeydown = function(e) {
			var ev = (e || event);
			if (ev.keyCode == 9) {
				globalActiveDHTMLGridObject.entBox.focus();
				globalActiveDHTMLGridObject.doKey({
					keyCode : ev.keyCode,
					shiftKey : ev.shiftKey,
					srcElement : "0"
				});
				return false;
			}
		};
		this.obj.style.left = arPos[0] + "px";
		this.obj.style.top = arPos[1] + this.cell.offsetHeight + "px";
		if (this.cell.scrollWidth < 200) {
			var pw = 200;
		} else {
			var pw = this.cell.scrollWidth;
		}
		this.obj.style.width = pw + (_isFF ? 18 : 16) + "px";
		if (_isFF) {
			this.obj.firstChild.style.width = parseInt(this.obj.style.width)
					+ "px";
			this.obj.firstChild.style.height = this.obj.offsetHeight - 3 + "px";
		}
		if (_isFF) {
			this.obj.firstChild.focus();
		} else {
			this.obj.focus();
			this.obj.focus();
		}
	};
	this.detach = function() {
		var a_val = "";
		if (_isFF) {
			a_val = this.obj.firstChild.value;
		} else {
			a_val = this.obj.value;
		}
		if (a_val == "") {
			this.cell._clearCell = true;
		} else {
			this.cell._clearCell = false;
		}
		this.setValue(a_val);
		document.body.removeChild(this.obj);
		return this.val != this.getValue();
	};
	this.getValue = function() {
		if (this.cell.firstChild) {
			if (this.cell.firstChild.tagName == "TEXTAREA") {
				return this.obj.firstChild.value;
			} else {
				if (this.cell.firstChild.tagName == "DIV") {
					return this.obj.firstChild.firstChild.value;
				}
			}
		}
		if (this.cell._clearCell) {
			return "";
		}
		if ((!this.grid.multiLine)) {
			return this.cell._brval || this.cell.innerHTML;
		} else {
			return this.cell.innerHTML.replace(/<br[^>]*>/gi, "\n")._dhx_trim();
		}
	};
}
eXcell_txt.prototype = new eXcell;
function eXcell_txttxt(cell) {
	if (cell) {
		this.cell = cell;
		this.grid = this.cell.parentNode.grid;
	}
	this.getValue = function() {
		if ((this.cell.firstChild)
				&& (this.cell.firstChild.tagName == "TEXTAREA")) {
			return this.cell.firstChild.value;
		}
		if (this.cell._clearCell) {
			return "";
		}
		if ((!this.grid.multiLine) && this.cell._brval) {
			return this.cell._brval;
		}
		return (_isIE ? this.cell.innerText : this.cell.textContent);
	};
	this.setValue = function(val) {
		this.cell._brval = val;
		if (!val || val.toString()._dhx_trim() == "") {
			val = " ";
		}
		this.setCTxtValue(val);
	};
}
eXcell_txttxt.prototype = new eXcell_txt;
eXcell_txt.prototype.setValue = function(val) {
	if (!val || val.toString()._dhx_trim() == "") {
		val = "&nbsp;";
		this.cell._clearCell = true;
	} else {
		this.cell._clearCell = false;
	}
	this.cell._brval = val;
	if ((!this.grid.multiLine)) {
		this.setCValue(val, val);
	} else {
		this.setCValue(val.replace(/\n/g, "<br/>"), val);
	}
};
function eXcell_co(cell) {
	if (cell) {
		this.cell = cell;
		this.grid = this.cell.parentNode.grid;
		this.combo = (this.cell._combo || this.grid
				.getCombo(this.cell._cellIndex));
		this.editable = true;
	}
	this.shiftNext = function() {
		var z = this.list.options[this.list.selectedIndex + 1];
		if (z) {
			z.selected = true;
		}
		this.obj.value = this.list.options[this.list.selectedIndex].text;
		return true;
	};
	this.shiftPrev = function() {
		if (this.list.selectedIndex != 0) {
			var z = this.list.options[this.list.selectedIndex - 1];
			if (z) {
				z.selected = true;
			}
			this.obj.value = this.list.options[this.list.selectedIndex].text;
		}
		return true;
	};
	this.edit = function() {
		this.val = this.getValue();
		this.text = this.getText()._dhx_trim();
		var arPos = this.grid.getPosition(this.cell);
		this.obj = document.createElement("TEXTAREA");
		this.obj.className = "dhx_combo_edit";
		this.obj.style.height = (this.cell.offsetHeight - 4) + "px";
		this.obj.wrap = "soft";
		this.obj.style.textAlign = this.cell.align;
		this.obj.onclick = function(e) {
			(e || event).cancelBubble = true;
		};
		this.obj.value = this.text;
		this.obj.onselectstart = function(e) {
			if (!e) {
				e = event;
			}
			e.cancelBubble = true;
			return true;
		};
		var editor_obj = this;
		this.obj.onkeyup = function(e) {
			var val = this.readonly ? String.fromCharCode((e || event).keyCode)
					: this.value;
			var c = editor_obj.list.options;
			for ( var i = 0; i < c.length; i++) {
				if (c[i].text.indexOf(val) == 0) {
					return c[i].selected = true;
				}
			}
		};
		this.list = document.createElement("SELECT");
		this.list.className = "dhx_combo_select";
		this.list.style.width = this.cell.offsetWidth + "px";
		this.list.style.left = arPos[0] + "px";
		this.list.style.top = arPos[1] + this.cell.offsetHeight + "px";
		this.list.onclick = function(e) {
			var ev = e || window.event;
			var cell = ev.target || ev.srcElement;
			if (cell.tagName == "OPTION") {
				cell = cell.parentNode;
			}
			editor_obj.setValue(cell.value);
			editor_obj.editable = false;
			editor_obj.grid.editStop();
		};
		var comboKeys = this.combo.getKeys();
		var fl = false;
		var selOptId = 0;
		for ( var i = 0; i < comboKeys.length; i++) {
			var val = this.combo.get(comboKeys[i]);
			this.list.options[this.list.options.length] = new Option(val,
					comboKeys[i]);
			if (comboKeys[i] == this.val) {
				selOptId = this.list.options.length - 1;
				fl = true;
			}
		}
		if (fl == false) {
			this.list.options[this.list.options.length] = new Option(this.text,
					this.val === null ? "" : this.val);
			selOptId = this.list.options.length - 1;
		}
		document.body.appendChild(this.list);
		this.list.size = "6";
		this.cstate = 1;
		if (this.editable) {
			this.cell.innerHTML = "";
		} else {
			this.obj.style.width = "1px";
			this.obj.style.height = "1px";
		}
		this.cell.appendChild(this.obj);
		this.list.options[selOptId].selected = true;
		if ((!_isFF) || (this.editable)) {
			this.obj.focus();
			this.obj.focus();
		}
		if (!this.editable) {
			this.obj.style.visibility = "hidden";
			this.list.focus();
			this.list.onkeydown = function(e) {
				e = e || window.event;
				editor_obj.grid.setActive(true);
				if (e.keyCode < 30) {
					return editor_obj.grid.doKey({
						target : editor_obj.cell,
						keyCode : e.keyCode,
						shiftKey : e.shiftKey,
						ctrlKey : e.ctrlKey
					});
				}
			};
		}
	};
	this.getValue = function() {
		return ((this.cell.combo_value == window.undefined) ? ""
				: this.cell.combo_value);
	};
	this.detach = function() {
		if (this.val != this.getValue()) {
			this.cell.wasChanged = true;
		}
		if (this.list.parentNode != null) {
			if (this.editable) {
				if (this.obj.value._dhx_trim() != this.text) {
					if (this.list.selectedIndex
							&& this.list.options[this.list.selectedIndex].text == this.obj.value) {
						this.setValue(this.list.value);
					} else {
						this.setValue(this.obj.value);
					}
				} else {
					this.setValue(this.val);
				}
			} else {
				this.setValue(this.list.value);
			}
		}
		if (this.list.parentNode) {
			this.list.parentNode.removeChild(this.list);
		}
		if (this.obj.parentNode) {
			this.obj.parentNode.removeChild(this.obj);
		}
		return this.val != this.getValue();
	};
}
eXcell_co.prototype = new eXcell;
eXcell_co.prototype.getText = function() {
	return this.cell.innerHTML;
};
eXcell_co.prototype.setValue = function(val) {
	if (typeof (val) == "object") {
		var optCol = this.grid.xmlLoader.doXPath("./option", val);
		if (optCol.length) {
			this.cell._combo = new dhtmlXGridComboObject();
		}
		for ( var j = 0; j < optCol.length; j++) {
			this.cell._combo.put(optCol[j].getAttribute("value"),
					optCol[j].firstChild ? optCol[j].firstChild.data : "");
		}
		val = val.firstChild.data;
	}
	if ((val || "").toString()._dhx_trim() == "") {
		val = null;
	}
	if (val !== null) {
		this.setCValue((this.cell._combo || this.grid
				.getCombo(this.cell._cellIndex)).get(val)
				|| val, val);
	} else {
		this.setCValue("&nbsp;", val);
	}
	this.cell.combo_value = val;
};
function eXcell_coro(cell) {
	this.base = eXcell_co;
	this.base(cell);
	this.editable = false;
}
eXcell_coro.prototype = new eXcell_co;
function eXcell_cotxt(cell) {
	this.base = eXcell_co;
	this.base(cell);
}
eXcell_cotxt.prototype = new eXcell_co;
eXcell_cotxt.prototype.getText = function() {
	return (_isIE ? this.cell.innerText : this.cell.textContent);
};
eXcell_cotxt.prototype.setValue = function(val) {
	if (typeof (val) == "object") {
		var optCol = this.grid.xmlLoader.doXPath("./option", val);
		if (optCol.length) {
			this.cell._combo = new dhtmlXGridComboObject();
		}
		for ( var j = 0; j < optCol.length; j++) {
			this.cell._combo.put(optCol[j].getAttribute("value"),
					optCol[j].firstChild ? optCol[j].firstChild.data : "");
		}
		val = val.firstChild.data;
	}
	if ((val || "").toString()._dhx_trim() == "") {
		val = null;
	}
	if (val !== null) {
		this.setCTxtValue((this.cell._combo || this.grid
				.getCombo(this.cell._cellIndex)).get(val)
				|| val, val);
	} else {
		this.setCTxtValue(" ", val);
	}
	this.cell.combo_value = val;
};
function eXcell_corotxt(cell) {
	this.base = eXcell_co;
	this.base(cell);
	this.editable = false;
}
eXcell_corotxt.prototype = new eXcell_cotxt;
function eXcell_cp(cell) {
	try {
		this.cell = cell;
		this.grid = this.cell.parentNode.grid;
	} catch (er) {
	}
	this.edit = function() {
		this.val = this.getValue();
		this.obj = document.createElement("SPAN");
		this.obj.style.border = "1px solid black";
		this.obj.style.position = "absolute";
		var arPos = this.grid.getPosition(this.cell);
		this.colorPanel(4, this.obj);
		document.body.appendChild(this.obj);
		this.obj.style.left = arPos[0] + "px";
		this.obj.style.top = arPos[1] + this.cell.offsetHeight + "px";
	};
	this.toolDNum = function(value) {
		if (value.length == 1) {
			value = "0" + value;
		}
		return value;
	};
	this.colorPanel = function(index, parent) {
		var tbl = document.createElement("TABLE");
		parent.appendChild(tbl);
		tbl.cellSpacing = 0;
		tbl.editor_obj = this;
		tbl.style.cursor = "default";
		tbl.style.cursor = "table-layout:fixed";
		tbl.onclick = function(e) {
			var ev = e || window.event;
			var cell = ev.target || ev.srcElement;
			var ed = cell.parentNode.parentNode.parentNode.editor_obj;
			ed.setValue(cell.style.backgroundColor);
			ed.grid.editStop();
		};
		var cnt = 256 / index;
		for ( var j = 0; j <= (256 / cnt); j++) {
			var r = tbl.insertRow(j);
			for ( var i = 0; i <= (256 / cnt); i++) {
				for ( var n = 0; n <= (256 / cnt); n++) {
					R = new Number(cnt * j) - (j == 0 ? 0 : 1);
					G = new Number(cnt * i) - (i == 0 ? 0 : 1);
					B = new Number(cnt * n) - (n == 0 ? 0 : 1);
					var rgb = this.toolDNum(R.toString(16)) + ""
							+ this.toolDNum(G.toString(16)) + ""
							+ this.toolDNum(B.toString(16));
					var c = r.insertCell(i);
					c.width = "10px";
					c.innerHTML = "&nbsp;";
					c.title = rgb.toUpperCase();
					c.style.backgroundColor = "#" + rgb;
					if (this.val != null
							&& "#" + rgb.toUpperCase() == this.val
									.toUpperCase()) {
						c.style.border = "2px solid white";
					}
				}
			}
		}
	};
	this.getValue = function() {
		return this.cell.firstChild.style ? this.cell.firstChild.style.backgroundColor
				: "";
	};
	this.getRed = function() {
		return Number(parseInt(this.getValue().substr(1, 2), 16));
	};
	this.getGreen = function() {
		return Number(parseInt(this.getValue().substr(3, 2), 16));
	};
	this.getBlue = function() {
		return Number(parseInt(this.getValue().substr(5, 2), 16));
	};
	this.detach = function() {
		if (this.obj.offsetParent != null) {
			document.body.removeChild(this.obj);
		}
		return this.val != this.getValue();
	};
}
eXcell_cp.prototype = new eXcell;
eXcell_cp.prototype.setValue = function(val) {
	this.setCValue("<div style='width:100%;height:"
			+ (this.cell.offsetHeight - 2) + ";background-color:" + (val || "")
			+ ";border:0px;'>&nbsp;</div>", val);
};
function eXcell_img(cell) {
	try {
		this.cell = cell;
		this.grid = this.cell.parentNode.grid;
	} catch (er) {
	}
	this.getValue = function() {
		if (this.cell.firstChild.tagName == "IMG") {
			return this.cell.firstChild.src
					+ (this.cell.titFl != null ? "^" + this.cell.tit : "");
		} else {
			if (this.cell.firstChild.tagName == "A") {
				var out = this.cell.firstChild.firstChild.src
						+ (this.cell.titFl != null ? "^" + this.cell.tit : "");
				out += "^" + this.cell.lnk;
				if (this.cell.trg) {
					out += "^" + this.cell.trg;
				}
				return out;
			}
		}
	};
}
eXcell_img.prototype = new eXcell;
eXcell_img.prototype.getTitle = function() {
	return this.cell.tit;
};
eXcell_img.prototype.setValue = function(val) {
	var title = val;
	if (val.indexOf("^") != -1) {
		var ar = val.split("^");
		val = ar[0];
		title = ar[1];
		if (ar.length > 2) {
			this.cell.lnk = ar[2];
			if (ar[3]) {
				this.cell.trg = ar[3];
			}
		}
		this.cell.titFl = "1";
	}
	this.setCValue("<img src='" + (val || "")._dhx_trim() + "' border='0'>",
			val);
	if (this.cell.lnk) {
		this.cell.innerHTML = "<a href='" + this.cell.lnk + "' target='"
				+ this.cell.trg + "'>" + this.cell.innerHTML + "</a>";
	}
	this.cell.tit = title;
};
function eXcell_price(cell) {
	this.base = eXcell_ed;
	this.base(cell);
	this.getValue = function() {
		if (this.cell.childNodes.length > 1) {
			return this.cell.childNodes[1].innerHTML.toString()._dhx_trim();
		} else {
			return "0";
		}
	};
}
eXcell_price.prototype = new eXcell_ed;
eXcell_price.prototype.setValue = function(val) {
	if (isNaN(parseFloat(val))) {
		val = this.val || 0;
	}
	var color = "green";
	if (val < 0) {
		color = "red";
	}
	this.setCValue("<span>$</span><span style='padding-right:2px;color:"
			+ color + ";'>" + val + "</span>", val);
};
function eXcell_dyn(cell) {
	this.base = eXcell_ed;
	this.base(cell);
	this.getValue = function() {
		return this.cell.firstChild.childNodes[1].innerHTML.toString()
				._dhx_trim();
	};
}
eXcell_dyn.prototype = new eXcell_ed;
eXcell_dyn.prototype.setValue = function(val) {
	if (!val || isNaN(Number(val))) {
		val = 0;
	}
	if (val > 0) {
		var color = "green";
		var img = "dyn_up.gif";
	} else {
		if (val == 0) {
			var color = "black";
			var img = "dyn_.gif";
		} else {
			var color = "red";
			var img = "dyn_down.gif";
		}
	}
	this
			.setCValue(
					"<div style='position:relative;padding-right:2px;width:100%;'><img src='"
							+ this.grid.imgURL
							+ ""
							+ img
							+ "' height='15' style='position:absolute;top:0px;left:0px;'><span style='width:100%;color:"
							+ color + ";'>" + val + "</span></div>", val);
};
function eXcell_ro(cell) {
	if (cell) {
		this.cell = cell;
		this.grid = this.cell.parentNode.grid;
	}
	this.edit = function() {
	};
	this.isDisabled = function() {
		return true;
	};
}
eXcell_ro.prototype = new eXcell;
function eXcell_ron(cell) {
	this.cell = cell;
	this.grid = this.cell.parentNode.grid;
	this.edit = function() {
	};
	this.isDisabled = function() {
		return true;
	};
	this.getValue = function() {
		return this.cell._clearCell ? "" : this.grid._aplNFb(
				this.cell.innerHTML.toString()._dhx_trim(),
				this.cell._cellIndex);
	};
}
eXcell_ron.prototype = new eXcell;
eXcell_ron.prototype.setValue = function(val) {
	if (val === 0) {
		val = "0";
	} else {
		if (!val || val.toString()._dhx_trim() == "") {
			this.setCValue("&nbsp;");
			return this.cell._clearCell = true;
		}
	}
	this.setCValue(this.grid._aplNF(val, this.cell._cellIndex));
	this.cell._clearCell = false;
};
function eXcell_rotxt(cell) {
	this.cell = cell;
	this.grid = this.cell.parentNode.grid;
	this.edit = function() {
	};
	this.isDisabled = function() {
		return true;
	};
	this.setValue = function(val) {
		if (!val || val.toString()._dhx_trim() == "") {
			val = " ";
		}
		this.setCTxtValue(val);
	};
}
eXcell_rotxt.prototype = new eXcell;
function dhtmlXGridComboObject() {
	this.keys = new dhtmlxArray();
	this.values = new dhtmlxArray();
	this.put = function(key, value) {
		for ( var i = 0; i < this.keys.length; i++) {
			if (this.keys[i] == key) {
				this.values[i] = value;
				return true;
			}
		}
		this.values[this.values.length] = value;
		this.keys[this.keys.length] = key;
	};
	this.get = function(key) {
		for ( var i = 0; i < this.keys.length; i++) {
			if (this.keys[i] == key) {
				return this.values[i];
			}
		}
		return null;
	};
	this.clear = function() {
		this.keys = new dhtmlxArray();
		this.values = new dhtmlxArray();
	};
	this.remove = function(key) {
		for ( var i = 0; i < this.keys.length; i++) {
			if (this.keys[i] == key) {
				this.keys._dhx_removeAt(i);
				this.values._dhx_removeAt(i);
				return true;
			}
		}
	};
	this.size = function() {
		var j = 0;
		for ( var i = 0; i < this.keys.length; i++) {
			if (this.keys[i] != null) {
				j++;
			}
		}
		return j;
	};
	this.getKeys = function() {
		var keyAr = new Array(0);
		for ( var i = 0; i < this.keys.length; i++) {
			if (this.keys[i] != null) {
				keyAr[keyAr.length] = this.keys[i];
			}
		}
		return keyAr;
	};
	this.save = function() {
		this._save = new Array();
		for ( var i = 0; i < this.keys.length; i++) {
			this._save[i] = [ this.keys[i], this.values[i] ];
		}
	};
	this.restore = function() {
		if (this._save) {
			this.keys[i] = new Array();
			this.values[i] = new Array();
			for ( var i = 0; i < this._save.length; i++) {
				this.keys[i] = this._save[i][0];
				this.values[i] = this._save[i][1];
			}
		}
	};
	return this;
}
function Hashtable() {
	this.keys = new dhtmlxArray();
	this.values = new dhtmlxArray();
	return this;
}
Hashtable.prototype = new dhtmlXGridComboObject;
function eXcell_link(cell) {
	this.cell = cell;
	this.grid = this.cell.parentNode.grid;
	this.isDisabled = function() {
		return true;
	};
	this.edit = function() {
	};
	this.getValue = function() {
		if (this.cell.firstChild.getAttribute) {
			return this.cell.firstChild.innerHTML + "^"
					+ this.cell.firstChild.getAttribute("href");
		} else {
			return "";
		}
	};
	this.setValue = function(val) {
		if ((typeof (val) != "number")
				&& (!val || val.toString()._dhx_trim() == "")) {
			this.setCValue("&nbsp;", valsAr);
			return (this.cell._clearCell = true);
		}
		var valsAr = val.split("^");
		if (valsAr.length == 1) {
			valsAr[1] = "";
		} else {
			if (valsAr.length > 1) {
				valsAr[1] = "href='" + valsAr[1] + "'";
				if (valsAr.length == 3) {
					valsAr[1] += " target='" + valsAr[2] + "'";
				} else {
					valsAr[1] += " target='_blank'";
				}
			}
		}
		this.setCValue("<a " + valsAr[1]
				+ " onclick='(_isIE?event:arguments[0]).cancelBubble = true;'>"
				+ valsAr[0] + "</a>", valsAr);
	};
}
eXcell_link.prototype = new eXcell;
eXcell_link.prototype.getTitle = function() {
	var z = this.cell.firstChild;
	return ((z && z.tagName) ? z.getAttribute("href") : "");
};
eXcell_link.prototype.getContent = function() {
	var z = this.cell.firstChild;
	return ((z && z.tagName) ? z.innerHTML : "");
};
function fYear() {
	var today = new Date();
	var year = today.getFullYear();
	return year;
}
function fMonth() {
	var today = new Date();
	var month = today.getMonth();
	month += 1;
	if (month <= 9) {
		month = "0" + month;
	}
	return month;
}
function fDay() {
	var today = new Date();
	var day = today.getDate();
	if (day <= 9) {
		day = "0" + day;
	}
	return day;
}
function fDay6() {
	var today = new Date();
	var day = today.getDate() + 1;
	if (day <= 9) {
		day = "0" + day;
	}
	return day;
}
function getOptionDay1() {
	if (null != mm1 && null != dd1) {
		var obj = document.getElementById("yyyy1");
		var nYear;
		if (obj != null) {
			nYear = obj.getComboText();
		} else {
			nYear = fYear();
		}
		var nMonth = mm1.getComboText();
		var nday = dd1.getComboText();
		var flag;
		if (nYear % 4 == 0 && nYear % 100 != 0 || nYear % 400 == 0) {
			flag = 1;
		} else {
			flag = 0;
		}
		switch (nMonth) {
		case "01":
		case "03":
		case "05":
		case "07":
		case "08":
		case "10":
		case "12":
			dd1.clearAll();
			dd1.addOption([ [ "01", "01" ], [ "02", "02" ], [ "03", "03" ],
					[ "04", "04" ], [ "05", "05" ], [ "06", "06" ],
					[ "07", "07" ], [ "08", "08" ], [ "09", "09" ],
					[ "10", "10" ], [ "11", "11" ], [ "12", "12" ],
					[ "13", "13" ], [ "14", "14" ], [ "15", "15" ],
					[ "16", "16" ], [ "17", "17" ], [ "18", "18" ],
					[ "19", "19" ], [ "20", "20" ], [ "21", "21" ],
					[ "22", "22" ], [ "23", "23" ], [ "24", "24" ],
					[ "25", "25" ], [ "26", "26" ], [ "27", "27" ],
					[ "28", "28" ], [ "29", "29" ], [ "30", "30" ],
					[ "31", "31" ] ]);
			if (dd1 > 31) {
				dd1.setComboText("31");
			}
			break;
		case "04":
		case "06":
		case "09":
		case "11":
			dd1.clearAll();
			dd1.addOption([ [ "01", "01" ], [ "02", "02" ], [ "03", "03" ],
					[ "04", "04" ], [ "05", "05" ], [ "06", "06" ],
					[ "07", "07" ], [ "08", "08" ], [ "09", "09" ],
					[ "10", "10" ], [ "11", "11" ], [ "12", "12" ],
					[ "13", "13" ], [ "14", "14" ], [ "15", "15" ],
					[ "16", "16" ], [ "17", "17" ], [ "18", "18" ],
					[ "19", "19" ], [ "20", "20" ], [ "21", "21" ],
					[ "22", "22" ], [ "23", "23" ], [ "24", "24" ],
					[ "25", "25" ], [ "26", "26" ], [ "27", "27" ],
					[ "28", "28" ], [ "29", "29" ], [ "30", "30" ] ]);
			if (nday > 30) {
				dd1.setComboText("30");
			}
			break;
		case "02":
			if (flag == 0) {
				dd1.clearAll();
				dd1.addOption([ [ "01", "01" ], [ "02", "02" ], [ "03", "03" ],
						[ "04", "04" ], [ "05", "05" ], [ "06", "06" ],
						[ "07", "07" ], [ "08", "08" ], [ "09", "09" ],
						[ "10", "10" ], [ "11", "11" ], [ "12", "12" ],
						[ "13", "13" ], [ "14", "14" ], [ "15", "15" ],
						[ "16", "16" ], [ "17", "17" ], [ "18", "18" ],
						[ "19", "19" ], [ "20", "20" ], [ "21", "21" ],
						[ "22", "22" ], [ "23", "23" ], [ "24", "24" ],
						[ "25", "25" ], [ "26", "26" ], [ "27", "27" ],
						[ "28", "28" ] ]);
				if (nday > 28) {
					dd1.setComboText("28");
				}
			} else {
				dd1.clearAll();
				dd1.addOption([ [ "01", "01" ], [ "02", "02" ], [ "03", "03" ],
						[ "04", "04" ], [ "05", "05" ], [ "06", "06" ],
						[ "07", "07" ], [ "08", "08" ], [ "09", "09" ],
						[ "10", "10" ], [ "11", "11" ], [ "12", "12" ],
						[ "13", "13" ], [ "14", "14" ], [ "15", "15" ],
						[ "16", "16" ], [ "17", "17" ], [ "18", "18" ],
						[ "19", "19" ], [ "20", "20" ], [ "21", "21" ],
						[ "22", "22" ], [ "23", "23" ], [ "24", "24" ],
						[ "25", "25" ], [ "26", "26" ], [ "27", "27" ],
						[ "28", "28" ], [ "29", "29" ] ]);
				if (nday > 29) {
					dd1.setComboText("29");
				}
			}
			break;
		default:
			break;
		}
	}
}
function getOptionDay2() {
	var obj = document.getElementById("yyyy2");
	var nYear;
	if (obj != null) {
		nYear = obj.getComboText();
	} else {
		nYear = fYear();
	}
	var nMonth = mm2.getComboText();
	var nday = dd2.getComboText();
	var flag;
	if (nYear % 4 == 0 && nYear % 100 != 0 || nYear % 400 == 0) {
		flag = 1;
	} else {
		flag = 0;
	}
	switch (nMonth) {
	case "01":
	case "03":
	case "05":
	case "07":
	case "08":
	case "10":
	case "12":
		dd2.clearAll();
		dd2
				.addOption([ [ "01", "01" ], [ "02", "02" ], [ "03", "03" ],
						[ "04", "04" ], [ "05", "05" ], [ "06", "06" ],
						[ "07", "07" ], [ "08", "08" ], [ "09", "09" ],
						[ "10", "10" ], [ "11", "11" ], [ "12", "12" ],
						[ "13", "13" ], [ "14", "14" ], [ "15", "15" ],
						[ "16", "16" ], [ "17", "17" ], [ "18", "18" ],
						[ "19", "19" ], [ "20", "20" ], [ "21", "21" ],
						[ "22", "22" ], [ "23", "23" ], [ "24", "24" ],
						[ "25", "25" ], [ "26", "26" ], [ "27", "27" ],
						[ "28", "28" ], [ "29", "29" ], [ "30", "30" ],
						[ "31", "31" ] ]);
		if (nday > 31) {
			dd2.setComboText("31");
		}
		break;
	case "04":
	case "06":
	case "09":
	case "11":
		dd2.clearAll();
		dd2.addOption([ [ "01", "01" ], [ "02", "02" ], [ "03", "03" ],
				[ "04", "04" ], [ "05", "05" ], [ "06", "06" ], [ "07", "07" ],
				[ "08", "08" ], [ "09", "09" ], [ "10", "10" ], [ "11", "11" ],
				[ "12", "12" ], [ "13", "13" ], [ "14", "14" ], [ "15", "15" ],
				[ "16", "16" ], [ "17", "17" ], [ "18", "18" ], [ "19", "19" ],
				[ "20", "20" ], [ "21", "21" ], [ "22", "22" ], [ "23", "23" ],
				[ "24", "24" ], [ "25", "25" ], [ "26", "26" ], [ "27", "27" ],
				[ "28", "28" ], [ "29", "29" ], [ "30", "30" ] ]);
		if (nday > 30) {
			dd2.setComboText("30");
		}
		break;
	case "02":
		if (flag == 0) {
			dd2.clearAll();
			dd2.addOption([ [ "01", "01" ], [ "02", "02" ], [ "03", "03" ],
					[ "04", "04" ], [ "05", "05" ], [ "06", "06" ],
					[ "07", "07" ], [ "08", "08" ], [ "09", "09" ],
					[ "10", "10" ], [ "11", "11" ], [ "12", "12" ],
					[ "13", "13" ], [ "14", "14" ], [ "15", "15" ],
					[ "16", "16" ], [ "17", "17" ], [ "18", "18" ],
					[ "19", "19" ], [ "20", "20" ], [ "21", "21" ],
					[ "22", "22" ], [ "23", "23" ], [ "24", "24" ],
					[ "25", "25" ], [ "26", "26" ], [ "27", "27" ],
					[ "28", "28" ] ]);
			if (nday > 28) {
				dd2.setComboText("28");
			}
		} else {
			dd2.clearAll();
			dd2.addOption([ [ "01", "01" ], [ "02", "02" ], [ "03", "03" ],
					[ "04", "04" ], [ "05", "05" ], [ "06", "06" ],
					[ "07", "07" ], [ "08", "08" ], [ "09", "09" ],
					[ "10", "10" ], [ "11", "11" ], [ "12", "12" ],
					[ "13", "13" ], [ "14", "14" ], [ "15", "15" ],
					[ "16", "16" ], [ "17", "17" ], [ "18", "18" ],
					[ "19", "19" ], [ "20", "20" ], [ "21", "21" ],
					[ "22", "22" ], [ "23", "23" ], [ "24", "24" ],
					[ "25", "25" ], [ "26", "26" ], [ "27", "27" ],
					[ "28", "28" ], [ "29", "29" ] ]);
			if (nday > 29) {
				dd2.setComboText("29");
			}
		}
		break;
	default:
		break;
	}
}
function getOptionDay3() {
	var obj = document.getElementById("yyyy3");
	var nYear;
	if (obj != null) {
		nYear = obj.getComboTest();
	} else {
		nYear = fYear();
	}
	var nMonth = mm3.getComboText();
	var nday = dd3.getComboText();
	var flag;
	if (nYear % 4 == 0 && nYear % 100 != 0 || nYear % 400 == 0) {
		flag = 1;
	} else {
		flag = 0;
	}
	switch (nMonth) {
	case "01":
	case "03":
	case "05":
	case "07":
	case "08":
	case "10":
	case "12":
		dd3.clearAll();
		dd3
				.addOption([ [ "01", "01" ], [ "02", "02" ], [ "03", "03" ],
						[ "04", "04" ], [ "05", "05" ], [ "06", "06" ],
						[ "07", "07" ], [ "08", "08" ], [ "09", "09" ],
						[ "10", "10" ], [ "11", "11" ], [ "12", "12" ],
						[ "13", "13" ], [ "14", "14" ], [ "15", "15" ],
						[ "16", "16" ], [ "17", "17" ], [ "18", "18" ],
						[ "19", "19" ], [ "20", "20" ], [ "21", "21" ],
						[ "22", "22" ], [ "23", "23" ], [ "24", "24" ],
						[ "25", "25" ], [ "26", "26" ], [ "27", "27" ],
						[ "28", "28" ], [ "29", "29" ], [ "30", "30" ],
						[ "31", "31" ] ]);
		if (nday > 31) {
			dd3.setComboText("31");
		}
		break;
	case "04":
	case "06":
	case "09":
	case "11":
		dd3.clearAll();
		dd3.addOption([ [ "01", "01" ], [ "02", "02" ], [ "03", "03" ],
				[ "04", "04" ], [ "05", "05" ], [ "06", "06" ], [ "07", "07" ],
				[ "08", "08" ], [ "09", "09" ], [ "10", "10" ], [ "11", "11" ],
				[ "12", "12" ], [ "13", "13" ], [ "14", "14" ], [ "15", "15" ],
				[ "16", "16" ], [ "17", "17" ], [ "18", "18" ], [ "19", "19" ],
				[ "20", "20" ], [ "21", "21" ], [ "22", "22" ], [ "23", "23" ],
				[ "24", "24" ], [ "25", "25" ], [ "26", "26" ], [ "27", "27" ],
				[ "28", "28" ], [ "29", "29" ], [ "30", "30" ] ]);
		if (nday > 30) {
			dd3.setComboText("30");
		}
		break;
	case "02":
		if (flag == 0) {
			dd3.clearAll();
			dd3.addOption([ [ "01", "01" ], [ "02", "02" ], [ "03", "03" ],
					[ "04", "04" ], [ "05", "05" ], [ "06", "06" ],
					[ "07", "07" ], [ "08", "08" ], [ "09", "09" ],
					[ "10", "10" ], [ "11", "11" ], [ "12", "12" ],
					[ "13", "13" ], [ "14", "14" ], [ "15", "15" ],
					[ "16", "16" ], [ "17", "17" ], [ "18", "18" ],
					[ "19", "19" ], [ "20", "20" ], [ "21", "21" ],
					[ "22", "22" ], [ "23", "23" ], [ "24", "24" ],
					[ "25", "25" ], [ "26", "26" ], [ "27", "27" ],
					[ "28", "28" ] ]);
			if (nday > 28) {
				dd3.setComboText("28");
			}
		} else {
			dd3.clearAll();
			dd3.addOption([ [ "01", "01" ], [ "02", "02" ], [ "03", "03" ],
					[ "04", "04" ], [ "05", "05" ], [ "06", "06" ],
					[ "07", "07" ], [ "08", "08" ], [ "09", "09" ],
					[ "10", "10" ], [ "11", "11" ], [ "12", "12" ],
					[ "13", "13" ], [ "14", "14" ], [ "15", "15" ],
					[ "16", "16" ], [ "17", "17" ], [ "18", "18" ],
					[ "19", "19" ], [ "20", "20" ], [ "21", "21" ],
					[ "22", "22" ], [ "23", "23" ], [ "24", "24" ],
					[ "25", "25" ], [ "26", "26" ], [ "27", "27" ],
					[ "28", "28" ], [ "29", "29" ] ]);
			if (nday > 29) {
				dd3.setComboText("29");
			}
		}
		break;
	default:
		break;
	}
}
function getOptionDay4() {
	var obj = document.getElementById("yyyy4");
	var nYear;
	if (obj != null) {
		nYear = obj.getComboTest();
	} else {
		nYear = fYear();
	}
	var nMonth = mm4.getComboText();
	var nday = dd4.getComboText();
	var flag;
	if (nYear % 4 == 0 && nYear % 100 != 0 || nYear % 400 == 0) {
		flag = 1;
	} else {
		flag = 0;
	}
	switch (nMonth) {
	case "01":
	case "03":
	case "05":
	case "07":
	case "08":
	case "10":
	case "12":
		dd4.clearAll();
		dd4
				.addOption([ [ "01", "01" ], [ "02", "02" ], [ "03", "03" ],
						[ "04", "04" ], [ "05", "05" ], [ "06", "06" ],
						[ "07", "07" ], [ "08", "08" ], [ "09", "09" ],
						[ "10", "10" ], [ "11", "11" ], [ "12", "12" ],
						[ "13", "13" ], [ "14", "14" ], [ "15", "15" ],
						[ "16", "16" ], [ "17", "17" ], [ "18", "18" ],
						[ "19", "19" ], [ "20", "20" ], [ "21", "21" ],
						[ "22", "22" ], [ "23", "23" ], [ "24", "24" ],
						[ "25", "25" ], [ "26", "26" ], [ "27", "27" ],
						[ "28", "28" ], [ "29", "29" ], [ "30", "30" ],
						[ "31", "31" ] ]);
		if (nday > 31) {
			dd4.setComboText("31");
		}
		break;
	case "04":
	case "06":
	case "09":
	case "11":
		dd4.clearAll();
		dd4.addOption([ [ "01", "01" ], [ "02", "02" ], [ "03", "03" ],
				[ "04", "04" ], [ "05", "05" ], [ "06", "06" ], [ "07", "07" ],
				[ "08", "08" ], [ "09", "09" ], [ "10", "10" ], [ "11", "11" ],
				[ "12", "12" ], [ "13", "13" ], [ "14", "14" ], [ "15", "15" ],
				[ "16", "16" ], [ "17", "17" ], [ "18", "18" ], [ "19", "19" ],
				[ "20", "20" ], [ "21", "21" ], [ "22", "22" ], [ "23", "23" ],
				[ "24", "24" ], [ "25", "25" ], [ "26", "26" ], [ "27", "27" ],
				[ "28", "28" ], [ "29", "29" ], [ "30", "30" ] ]);
		if (nday > 30) {
			dd4.setComboText("30");
		}
		break;
	case "02":
		if (flag == 0) {
			dd4.clearAll();
			dd4.addOption([ [ "01", "01" ], [ "02", "02" ], [ "03", "03" ],
					[ "04", "04" ], [ "05", "05" ], [ "06", "06" ],
					[ "07", "07" ], [ "08", "08" ], [ "09", "09" ],
					[ "10", "10" ], [ "11", "11" ], [ "12", "12" ],
					[ "13", "13" ], [ "14", "14" ], [ "15", "15" ],
					[ "16", "16" ], [ "17", "17" ], [ "18", "18" ],
					[ "19", "19" ], [ "20", "20" ], [ "21", "21" ],
					[ "22", "22" ], [ "23", "23" ], [ "24", "24" ],
					[ "25", "25" ], [ "26", "26" ], [ "27", "27" ],
					[ "28", "28" ] ]);
			if (nday > 28) {
				dd4.setComboText("28");
			}
		} else {
			dd4.clearAll();
			dd4.addOption([ [ "01", "01" ], [ "02", "02" ], [ "03", "03" ],
					[ "04", "04" ], [ "05", "05" ], [ "06", "06" ],
					[ "07", "07" ], [ "08", "08" ], [ "09", "09" ],
					[ "10", "10" ], [ "11", "11" ], [ "12", "12" ],
					[ "13", "13" ], [ "14", "14" ], [ "15", "15" ],
					[ "16", "16" ], [ "17", "17" ], [ "18", "18" ],
					[ "19", "19" ], [ "20", "20" ], [ "21", "21" ],
					[ "22", "22" ], [ "23", "23" ], [ "24", "24" ],
					[ "25", "25" ], [ "26", "26" ], [ "27", "27" ],
					[ "28", "28" ], [ "29", "29" ] ]);
			if (nday > 29) {
				dd4.setComboText("29");
			}
		}
		break;
	default:
		break;
	}
}
function getOptionDay6() {
	var obj = document.getElementById("yyyy6");
	var nYear;
	if (obj != null) {
		nYear = obj.getComboTest();
	} else {
		nYear = fYear();
	}
	var nMonth = mm6.getComboText();
	var nday = dd6.getComboText();
	var flag;
	if (nYear % 4 == 0 && nYear % 100 != 0 || nYear % 400 == 0) {
		flag = 1;
	} else {
		flag = 0;
	}
	switch (nMonth) {
	case "01":
	case "03":
	case "05":
	case "07":
	case "08":
	case "10":
	case "12":
		dd6.clearAll();
		dd6
				.addOption([ [ "01", "01" ], [ "02", "02" ], [ "03", "03" ],
						[ "04", "04" ], [ "05", "05" ], [ "06", "06" ],
						[ "07", "07" ], [ "08", "08" ], [ "09", "09" ],
						[ "10", "10" ], [ "11", "11" ], [ "12", "12" ],
						[ "13", "13" ], [ "14", "14" ], [ "15", "15" ],
						[ "16", "16" ], [ "17", "17" ], [ "18", "18" ],
						[ "19", "19" ], [ "20", "20" ], [ "21", "21" ],
						[ "22", "22" ], [ "23", "23" ], [ "24", "24" ],
						[ "25", "25" ], [ "26", "26" ], [ "27", "27" ],
						[ "28", "28" ], [ "29", "29" ], [ "30", "30" ],
						[ "31", "31" ] ]);
		if (nday > 31) {
			dd6.setComboText("31");
		}
		break;
	case "04":
	case "06":
	case "09":
	case "11":
		dd6.clearAll();
		dd6.addOption([ [ "01", "01" ], [ "02", "02" ], [ "03", "03" ],
				[ "04", "04" ], [ "05", "05" ], [ "06", "06" ], [ "07", "07" ],
				[ "08", "08" ], [ "09", "09" ], [ "10", "10" ], [ "11", "11" ],
				[ "12", "12" ], [ "13", "13" ], [ "14", "14" ], [ "15", "15" ],
				[ "16", "16" ], [ "17", "17" ], [ "18", "18" ], [ "19", "19" ],
				[ "20", "20" ], [ "21", "21" ], [ "22", "22" ], [ "23", "23" ],
				[ "24", "24" ], [ "25", "25" ], [ "26", "26" ], [ "27", "27" ],
				[ "28", "28" ], [ "29", "29" ], [ "30", "30" ] ]);
		if (nday > 30) {
			dd6.setComboText("30");
		}
		break;
	case "02":
		if (flag == 0) {
			dd6.clearAll();
			dd6.addOption([ [ "01", "01" ], [ "02", "02" ], [ "03", "03" ],
					[ "04", "04" ], [ "05", "05" ], [ "06", "06" ],
					[ "07", "07" ], [ "08", "08" ], [ "09", "09" ],
					[ "10", "10" ], [ "11", "11" ], [ "12", "12" ],
					[ "13", "13" ], [ "14", "14" ], [ "15", "15" ],
					[ "16", "16" ], [ "17", "17" ], [ "18", "18" ],
					[ "19", "19" ], [ "20", "20" ], [ "21", "21" ],
					[ "22", "22" ], [ "23", "23" ], [ "24", "24" ],
					[ "25", "25" ], [ "26", "26" ], [ "27", "27" ],
					[ "28", "28" ] ]);
			if (nday > 28) {
				dd6.setComboText("28");
			}
		} else {
			dd6.clearAll();
			dd6.addOption([ [ "01", "01" ], [ "02", "02" ], [ "03", "03" ],
					[ "04", "04" ], [ "05", "05" ], [ "06", "06" ],
					[ "07", "07" ], [ "08", "08" ], [ "09", "09" ],
					[ "10", "10" ], [ "11", "11" ], [ "12", "12" ],
					[ "13", "13" ], [ "14", "14" ], [ "15", "15" ],
					[ "16", "16" ], [ "17", "17" ], [ "18", "18" ],
					[ "19", "19" ], [ "20", "20" ], [ "21", "21" ],
					[ "22", "22" ], [ "23", "23" ], [ "24", "24" ],
					[ "25", "25" ], [ "26", "26" ], [ "27", "27" ],
					[ "28", "28" ], [ "29", "29" ] ]);
			if (nday > 29) {
				dd6.setComboText("29");
			}
		}
		break;
	default:
		break;
	}
}
