// JavaScript Document
function _AsideSetting(aside, main, type) {
	aside.addClass("ui-aside-hide");
	main.addClass("ui-lmenu-hide");
	
	aside[0].style["height"] = window.innerHeight-$(".ui-head").height()+"px";
	
	var asc = "ui-aside-show";
	var mac = "ui-lmenu-show";
	if (type=="main-stop") {
		mac = null;
	} else if (type=="main-half") {
		mac = "ui-lmenu-show-half";
	}

	var _t = {};
	_t.fnShow = function() {

		//var s = $("<div class='shadow' style='height:"+window.innerHeight+"px; width:"+window.innerWidth+"px;'></div>")
		var s = $("<div class='shadow' ></div>")
		$("body").append(s);

		aside.removeClass("ui-aside-hide").addClass(asc);
		//aside.css("-webkit-transition-duration", "500ms");
		//aside.css("-webkit-transform", "translate(150px,0) translateZ(0)");
		mac && main.removeClass("ui-lmenu-hide").addClass(mac);

		s.one(_CLICK, function(e){
			_t.fnClose();
		})
	}
	
	_t.fnClose = function(cb, scope) {		

		(mac?main:aside).one('webkitTransitionEnd', function () {
			$(".shadow").remove();
			
			cb && cb.call(scope);
		});
		
		aside.removeClass(asc).addClass("ui-aside-hide");
		//aside.css("transition-duration", "");
		//aside.css("transform", "");
		mac && main.removeClass(mac).addClass("ui-lmenu-hide");

	}
	
	return _t;
}


function getQueryString(url) {
    var result = url.match(new RegExp("[\?\&][^\?\&]+=[^\?\&]+", "g"));
    for (var i = 0; result && i < result.length; i++) {
        result[i] = result[i].substring(1);
    }
    
    if (!result) {
        result = [];
    }
    return result;
}

function getQueryStringByName(url, name) {
    var result = url.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
}

function getQueryStringByIndex(url, index) {
    if (index == null) {
        return "";
    }
    var queryStringList = getQueryString(url);
    if (index >= queryStringList.length) {
        return "";
    }
    var result = queryStringList[index];
    var startIndex = result.indexOf("=") + 1;
    result = result.substring(startIndex);
    return result;
}

function getQueryStringParam(url) {
   

    var queryStringList = getQueryString(url);
    return arrParamStrToParam(queryStringList);
}

function arrParamStrToParam(queryStringList) {
	 var param = {};
    for (var i=0; queryStringList && i< queryStringList.length; i++) {
        var result = queryStringList[i];
        var startIndex = result.indexOf("=") + 1;
        var value = result.substring(startIndex);
        var name = result.substring(0, startIndex-1);
        
        param[name] = value;
    }    
    
    return param;
}


var ParseUrl_R = {
    protocol: /([^\/]+:)\/\/(.*)/i,
    host: /(^[^\:\/]+)((?:\/|:|$)?.*)/,
    port: /\:?([^\/]*)(\/?.*)/,
    pathname: /([^\?#]+)(\??[^#]*)(#?.*)/
};

function ParseUrl(url) {
    var tmp, res = {};
    res["href"] = url;
    for (p in ParseUrl_R) {
        tmp = ParseUrl_R[p].exec(url);
		if (!tmp || tmp.length < 2)
		{
			res[p] = null;
			continue;
		}
        res[p] = tmp[1];
        url = tmp[2];
        if (url === "") {
            url = "/";
        }
        if (p === "pathname") {
            res["pathname"] = tmp[1];
            res["search"] = tmp[2];
            res["hash"] = tmp[3];
        }
    }
    //console.log(url);
    return res;
};

function _RHS(strSendTxt){
	if (strSendTxt == null) {
		return "";
	}

	if (strSendTxt === "") {
		return strSendTxt;
	}

	strSendTxt = strSendTxt.replace(new RegExp("&","gm"), "&amp;");
	strSendTxt = strSendTxt.replace(new RegExp("<","gm"), "&lt;");
	strSendTxt = strSendTxt.replace(new RegExp(">","gm"), "&gt;");
	strSendTxt = strSendTxt.replace(new RegExp(" ","gm"), "&nbsp;");

	return strSendTxt;

}

Array.prototype.contains = function(obj) {
	var i = this.length;
	while(i--) if (this[i]===obj) return true;
	return false;
}
var _ARR_NUM = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

function _hasNumChar(input) {
	var i = input.length;
	while(i--) if (_ARR_NUM.contains(input.substr(i,1))) return true;
	
	return false;
}

function _isNumChar(input) {
	var reg = new RegExp("^[0-9]*$");
	return reg.test(input)
}
function loadImage(url, callback) {
    var img = new Image(); //创建一个Image对象，实现图片的预下载
     img.src = url;
  
    if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
         callback.call(img);
        return; // 直接返回，不用再处理onload事件
     }

     img.onload = function () { //图片下载完毕时异步调用callback函数。
         callback.call(img);//将回调函数的this替换为Image对象
     };
};

var __LOADING_COVER_ = $("<div class='loading-bg valign halign' ><div><img src='images/loading-2.png' /></div></div>");

function _loadingStart() {
	__LOADING_COVER_.width(window.width);
	__LOADING_COVER_.height(window.height);
	$("body").append(__LOADING_COVER_);
}

function _loadingEnd() {
	$(".loading-bg").detach();
}