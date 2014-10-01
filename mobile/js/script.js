var _CLICK = "click"

var _Home = "rout.html";

var _HomePage = "P0101";

var _MS_ROOT = "js/module/";
!(window._MS_ROUTE) && (window._MS_ROUTE={});


$(function(){
	__init();
})

function __init(){
	var ww = window.innerWidth;
	var wh = window.innerHeight;

	//$("body").width(ww);
}

function _TITLE(t) {
	!t && (t="");
	$("#_ROOT_TITLE_").text(t);
}

var _Step_Key = 0;
function _ResetStepKey() {
	_Step_Key = (new Date()).getTime();
}

var __M_MS = {};

var __V_Stack = [];
var __V_ID = null;
var __V_Param = null;
var __V_M = null;
function _Param() {
	if (__V_Stack && __V_Stack.length > 0) {
		return __V_Stack[__V_Stack.length-1].param;
	}
	return null;
}

function _Router(url) {
	if (!url) {
		url = window.location.href;
	}
	var p = ParseUrl(url);
	var param = null;
	if (p.hash) {
		var i = p.hash.indexOf("#!/");
		if (i == 0) {
			var _p = p.hash.substring(3);
			if (_p) {
				param = arrParamStrToParam(_p.split("&"));
			}
		}
	} 
	var page = param&&param["_page_"]?param._page_:"P0101";
	param && (delete param._page_);
	
	_loadRoot(page, param);
}

function _MakeUrl(page, param) {
	var url = _Home+"#!/_page_="+page;
	if (param) {
		var i=0;
		for (var key in param) {
			url += "&"+key+"="+param[key];
		}
	}
	
	return url;
}


function _loadRoot(page, param) {
	_load(page, param, true);
}

function _load(page, param, isRoot) {
	var $b = $("body");
	
	!param && (param={});
	
	var st = $(window).scrollTop();
	
	/*  打开下一个画面前，当前画面保存处理，修改栈顶  */
	if (__V_Stack.length>0) {
		
		var node = __V_Stack[__V_Stack.length-1];
		
		//画面暂停，保存
		node.module._status_ = 1;
		var ch = $b.children();
		ch.detach();
		node.page = ch;
		node.scroll = st;
	} else {
		$b.children().remove();
	}
	
	
	//将下一个画面压栈，history压栈
	_PushState(page, param);
	var module = (window["_Ctrl"] && typeof(window["_Ctrl"][page])==="function")?(new window["_Ctrl"][page]()):null;
	!module && (module = {});
	(module._status_=2); //等待载入状态
	//压栈
	__V_Stack.push({
		"key" :(new Date()).getTime(),
		"id": page,
		//"page": ch,
		"param": param ? param : {},
		//"scroll": st,
		"module": module,
	});
	var _VN = __V_Stack[__V_Stack.length-1];
	
_loadingStart();

	(function(){

		//没有代码配置
		if (!_MS_ROUTE[page]) {
			loadHtml();
		} 
		//有配置，但已经下载过代码
		else if (__M_MS[page]) {
			loadHtml();
		} 
		else {
			//下载代码
			$.ajax({
				url: _MS_ROOT+_MS_ROUTE[page]+"?_t="+(new Date()).getTime(),
				dataType: "script",
				success: function(p){
					__M_MS[page] = true;
					
					if (_VN.module._status_ != 2){
_loadingEnd()
						return;
					}
					
					//下载页面
					loadHtml();
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
_loadingEnd()
					if (_VN.module._status_ != 2) return;
					//载入失败
					_back();
				}
			})
		}

		function loadHtml() {
			//$b.load(page+".html?_t="+(new Date()).getTime(), function() {
			$.ajax({ url: page+".html?_t="+(new Date()).getTime(), dataType: "html", success: function(p){
_loadingEnd()
				
				if (_VN.module._status_ != 2){
					if (_VN.module._status_ != 2) return;
					return;
				}

				//新页面载入成功				
				if (typeof(p) === "string" && p != "" ) {
					if (isRoot !== true) {
						//执行前画面离开事件
						if (__V_Stack.length >= 2) {
							var oldModule = __V_Stack[__V_Stack.length-2].module
							_RunEvent(oldModule, "Leave", null, true);
						}
					}
				} else {
					//载入失败
					_back();
					return;
				}


				//清空画面堆栈
				if (isRoot === true) {
					for (var i=0; i<__V_Stack.length-1; i++) {
						try {
							var n = __V_Stack[i];
							
							n.module && (n.module_status_=-1);
							_RunEvent(n.module, "Remove", null, true);
							
							n.page.remove();
							
							delete n.page, n.id, n.param;
							delete n.module._PD;
							delete n.module;
							delete n;
							
							delete __V_Stack[i];
						}catch(ex) {}
					}
					
					__V_Stack[0] = __V_Stack[__V_Stack.length-1];
					__V_Stack.length = 1;
					
					_ResetStepKey();
					
					_ReplaceState(page, __V_Stack[0].param);
				}
				
				$b2 = $("body");
				$b2.css("display", "none");
				$b2.html(p);

				//再次获取module
				var module = (window["_Ctrl"] && typeof(window["_Ctrl"][page])==="function")?(new window["_Ctrl"][page]()):null;
				!module && (module = {});
				module && (module._status_=0);
				__V_Stack[__V_Stack.length-1]["module"] = module;
				
				var param = __V_Stack[__V_Stack.length-1].param;

				var pe = _RunEvent(module, "Init", param);
				
				//$b2.fadeIn("fast");
				$b2.css("display", "block");
				$(window).scrollTop(0);
				
				if (pe === false) {
					return;
				}
				
				pe = _RunEvent(module, "Load", param);
				if (pe === false) {
					return;
				}
				
				var foot = $b2.find(".ui-foot");
				if (foot.length > 0) $b2.find(".wrapper").css("min-height", window.innerHeight-50-foot.height());
			},
			"error": function() {
				if (_VN.module._status_ != 2) return;
				_back();
			}
			});
		}
	}).call();
}

function _back(paramb, nohispop) {

	//只有popState调用back
	//否则，只处罚popState，不调用_back的逻辑
	if (nohispop !== true) {
		window.history.back();
		return;
	}


	if (__V_Stack && __V_Stack.length == 1) {
var t = __V_Stack[0];
_PushState(t.id, t.param);
		return;
	}

	var $b = $("body");
	$b.css("display", "none");
	(function(){

		//堆栈异常
		if (!__V_Stack || __V_Stack.length == 0) {
			_Router();
			return;
		}

		//出栈		
		//画面删除
		var node = __V_Stack.pop();
		var module = node.module;
		//预加载状态
		if (module && module._status_ == 2) {
			module && (module._status_=-1);
		} else{
			module && (module._status_=-1);
			_RunEvent(module, "Remove", null, true);
			var ch = $b.children();
			ch.remove();
			delete ch;
		}

		if (!__V_Stack || __V_Stack.length == 0) {
			_Router();
			return;
		}
		
		var p = __V_Stack[__V_Stack.length-1];
_PushState(p.id, p.param);

		//画面恢复
		$b.html(p.page);
		p.module && (p.module._status_ = 0);

		$b.css("display", "block");
		$(window).scrollTop(p.scroll);
setTimeout("$(window).scrollTop("+p.scroll+");", 10);
		_RunEvent(module, "Back", paramb);
	}).call();
}

function _PushState(page, param) {
var url = _MakeUrl(page, param);
history.pushState(null, null, url);
/*
	if (history && history.pushState) {
		var url = "#!/_page_="+page;
		if (param) {
			var i=0;
			for (var key in param) {
				url += "&"+key+"="+param[key];
			}
		}
		
		history.pushState({"STEP": _Step_Key}, null, url);
	}
*/
}

function _ReplaceState(page, param) {
/*
	
	if (history && history.pushState) {
		var url = "#!/_page_="+page;
		if (param) {
			var i=0;
			for (var key in param) {
				url += "&"+key+"="+param[key];
			}
		}
		
		history.replaceState({"STEP": _Step_Key}, null, url);
	}
	
*/
}

if (history && history.pushState) {
	var loaded = false;
	if (!loaded) {
		loaded = true;	

		window.addEventListener("popstate", function(evt) {

			_back(null, true);

		}, false);
	}
}

function _RunEvent(scope, evt, p, ignore) {
	if (!scope || scope._status_ != 0 && ignore !== true) return;
	
	var rtn = null;
	evt = "on"+evt;
	scope!=null && typeof(scope[evt])==="function" && (rtn=scope[evt].call(scope, p));
	
	return rtn;
}

(function() {
	if (!window["_P_M_"]) window["_P_M_"] = {};
	
	_P_M_.on = function(jqo, evt, fn) {
		var t = this;
		jqo.on(evt, function(){
			if (t && (t._status_===-1 || t._status_===1)) return;
			fn.call(t, this);
		});
	};

	_P_M_._popHtml=
			"<div class=\"ui-pop-cover\">"+
				"<div class=\"ui-pop-box\">"+
					"<pre></pre>"+
					"<ul>"+
						"<li>确 认</li>"+
						"<li>取 消</li>"+
					"</ul>"+
				"</div>"+
			"</div>";

	_P_M_._popWin = function (isAlert, txt, fn, fnCancel) {
		var popwin = $(this._popHtml);
		popwin.find("pre").text(txt);
	
		this.on(popwin.find("li:first-child"), _CLICK, function(){
			this._closePop();
			try {
				typeof(fn)==="function" && fn.call(this, true);
			} catch(ex) {}
		});
			
		if (isAlert===true) {
			popwin.find("li:last-child").remove();
		} else {
		
			this.on(popwin.find("li:last-child"), _CLICK, function(){
				this._closePop();
				try {
					typeof(fnCancel)==="function" && fnCancel(this, true);
				} catch(ex) {}
			});
		}
		
		$(".ui-head, .wrapper, .ui-foot, .ui-blur").addClass("blur");
		$("body").append(popwin);
	};

	_P_M_._closePop = function() {
		$(".ui-head, .wrapper, .ui-foot, .ui-blur").removeClass("blur");
		$(".ui-pop-cover").remove();
	};
	
	_P_M_._Alert = function(txt, fn) {
		this._popWin(true, txt, fn);
	};
	
	_P_M_._Confirm = function(txt, fn, fnCancel) {
		this._popWin(false, txt, fn, fnCancel);
	};

}).call(window);

window["_Ctrl"] = {};

function _CreateModule(moduleId, handle) {
	var pm = function() {
		for(var k in handle) {
			this[k] = handle[k];
		}
		
		this._status_ = 0;
		
		this._PD = {};
	};
	
	pm.prototype = _P_M_;
	
	window["_Ctrl"][moduleId] = pm;
}


