var _CLICK = "click"

var _HomePage = "P1010";

$(function(){
	__init();
})

function _footClick() {
	$(".ui-foot li:not(.active)").on(_CLICK,
		function() {
			if (this.id === "footHome") {
				_loadRoot(_HomePage);
			} else if (this.id === "footSearch") {
				_loadRoot("P3010");
			} else if (this.id === "footChart") {
				_load("P4010");
			} else if (this.id === "footUser") {
				_loadRoot("P6000");
			} else if (this.id === "footGift") {
				_loadRoot("P5010");
			}			
		}
	)
}

function __init(){
	var ww = window.innerWidth;
	var wh = window.innerHeight;

	$("body").width(ww);
}

function __initUiBody() {
	var ot = $("ui-foot,ui-head"), oh=0;
	for (var i=0; i<ot.length; i){
		oh += $(ot[i]).height();
	}
}

function __initNum() {
	$(".num-select").delegate("span.add", _CLICK, function(){
		var s = $(this).next(".sum");
		var ns = new Number($.trim(s.text()));
		if (!s.text() || ns <= 0) {
			$(this).undelegate();
		} else {
			var m = s.attr("_max");
			var nm = new Number($.trim(m));
			if (!m || !nm || ns < nm) ns++
			else return;
		}
		s.text(ns);
	})
	
	$(".num-select").delegate("span.sub", _CLICK, function(){
		var s = $(this).prev(".sum");
		var ns = new Number($.trim(s.text()));
		if (!s.text() || ns <= 0) {
			$(this).undelegate();
		} else {
			if (ns==1) {
				return;
			}
			ns--;
		}
		s.text(ns);
	})
}


var __V_Stack = [];
var __V_ID = null;
var __V_Param = null;
function _Param() {
	return __V_Param;
}

function _loadRoot(page, param) {
	_load(page, param, true);
}

function _load(page, param, isRoot) {
	var $b = $("body");
	
	//清空画面堆栈
	if (isRoot === true) {
		for (var i=0; i<__V_Stack.length; i++) {
			try {
				var p = __V_Stack.pop();
				p.page.remove();
				delete p.page;
				delete p.id;
				delete p.param;
				delete p;
			}catch(ex) {}
		}
		
		__V_ID = null;
		__V_Param = null;
	}

	var st = $(window).scrollTop();
	//$b.fadeOut("fast", function() {
	$b.css("display", "block");
	(function(){
		
		var ch = $b.children();
		
		//根画面场合,不需要压栈
		if (isRoot === true) {
			ch.remove();
		} else {
			ch.detach();
			
			__V_Stack.push({
				"id": __V_ID,
				"page": ch,
				"param": __V_Param,
				"scroll": st,
			});
		}

		$b.load(page+".html", function() {
			if ($.trim($b.html()) === "") {
				if (__V_Stack.length>0) {
					_back();
				} else {
					_loadRoot(_HomePage);
				}
				return;
			}

			__V_ID = page;
			__V_Param = param;

			_footClick();

			$b.find(".wrapper").css("min-height", window.innerHeight-50);
			
			//$b.fadeIn("fast");
			$b.css("display", "block");
			$(window).scrollTop(0);
			
			typeof(onLoad) && onLoad();
			
			var foot = $b.find(".ui-foot");
			if (foot.length > 0) $b.find(".wrapper").css("min-height", window.innerHeight-50-foot.height());
		});
	}).call();
}

function _back(paramb) {

	if (!__V_Stack || __V_Stack.length === 0) {
		_loadRoot(_HomePage);
		return;
	}

	var $b = $("body");
	//$b.fadeOut("fast", function() {
	$b.css("display", "none");
	(function(){
		var ch = $b.children();
		ch.remove();
		delete ch;
		
		var p = __V_Stack.pop();
		
		__V_Param = p.param;
		__V_ID = p.id;
		
		$b.html(p.page);
		
		/*
		$b.fadeIn("fast", function(){
			$(window).scrollTop(p.scroll);
		});
		*/
		$b.css("display", "block");
		$(window).scrollTop(p.scroll);
	}).call();
}
