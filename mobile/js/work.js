// JavaScript Document
var _Config = {
	Home : "http://www.qyllm.com:9031/",
	Server : "http://www.qyllm.com:9031/CMS.aspx",
	
	Time_out : 10 * 1000,
	
	PageSize : 20,	
};

function _MakeImgUrl(url) {
	if (typeof(url)!== "string") {
		return url;
	}
	
	url = url.trim();
	
	return (url.indexOf("http")!=0?_Config.Home+url:url)
}


(function() {
	if (!window["_P_M_"]) window["_P_M_"] = {};

	window._IF = {};

	window._IF.getJson = function(scope, url, param, sCallback, fCallBack, showMask) {
		url = url?url:_Config.Server;
	
		param = param?param:{};
		param["t"] = (new Date()).getTime();
		var rtn;
		var t = scope?scope:window;
		try
		{
			if (showMask !== false) _loadingStart();
			$.jsonp({
				url: url,
				data: param,
				timeout: _Config.Time_out,
				callbackParameter: "callback",
				success: function(r) {
					if (showMask !== false) _loadingEnd();
					
					//画面隐藏或者被删除，不操作
					if (t && (t._status_===-1 || t._status_===1)) return;

					sCallback && sCallback.call(t, r);
				},
				error: function(p1, p2) {
					if (showMask !== false) _loadingEnd();
					
					if (t && (t._status_===-1 || t._status_===1)) return;
					
					fCallBack && fCallBack.call(t, p1, p2);
				},
			});
		}
		catch (ex)
		{
			if (showMask !== false) _loadingEnd();
			
			if (t && (t._status_===-1 || t._status_===1)) return;
			
			fCallBack && fCallBack.call(t, null, ex.message);
		}
	
	};
	
	window._IF._Do = function(scope, i, param, cb, error) {
		try {
			!param && (param={});
			param["type"] = i;
			this.getJson(scope, null, param, cb, error);
		} catch(e) {
			typeof(error)=="function" && error.call(this);
		}
	};
	
	//第3方链接一览
	window._IF.EI_ListContent = function(scope, param, cb, error) {
		!param && (param={});
		param["Action"] = "LMCMS.ListContent";
		this.getJson(scope, null, param, cb, error);
	};
	
	//第3方链接一览(More)
	window._IF.EI_ListContentM = function(scope, param, cb, error) {
		!param && (param={});
		param["Action"] = "LMCMS.ListContentM";
		this.getJson(scope, null, param, cb, error);
	};
	
	//第3方链接详细
	window._IF.EI_ListContentInfo = function(scope, param, cb, error) {
		!param && (param={});
		param["Action"] = "LMCMS.ListContentInfo";
		this.getJson(scope, null, param, cb, error);
	};
}).call(window);


var _L_STG = {
	Save: function(k, v) {
		k && window.localStorage.setItem(k, v);
	},
	
	Remove: function(k) {
		k && window.localStorage.removeItem(k);
	},
	
	Get: function(k) {
		if (k) {
			return window.localStorage.getItem(k);
		}
		
		return null;
	},
}
