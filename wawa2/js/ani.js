// JavaScript Document

;(function($, window, document){

	$.fn.ani = function(css, duration, cb, tfn) {
		if (!css) {
			return;
		}
		
		var style = css;
		if (typeof(css) === "string") {
			style = $.parseJSON(css)
		} else {
			var tmp = "";
			for (var key in css) {
				tmp += key+":" + css[key] + ";";
			}
			
			if (tmp === "") {
				return;
			}
			
			css = "{"+tmp+"}";
		}
		
		if (typeof(duration) === "function") {
			cb = duration;
			tfn = cb;
			duration = null;
		}
		
		var t = (new Date()).getTime();
		var cssname = "_ANI_CSS_"+t;
		var framename = "_ANI_CSS_F_"+t;
		var styleNode = $("<style id='" + cssname + "'></style>");
		
		var dur = 1;
		if (duration === "fast") {
			dur = .3;
		} else if (duration === "normal") {
			dur = .7;
		} else if (duration === "slow") {
			dur = 1.2;
		} else if (typeof(duration) === "number") {
			dur = duration/1000;
		}
		
		tfn = tfn?tfn:"ease-out";
		
	
		var h = "."+cssname+"{"+
				"-webkit-animation-delay: 0s; \n" +
				"-webkit-animation-name:" + framename + "; \n" + 
				"-webkit-animation-duration :" + dur + "s; \n" +
				"-webkit-animation-timing-function: "+tfn+"; \n" +
				"}\n" +
				"@-webkit-keyframes " + framename + " { \n" +
				"to " + css + "\n" +
				"}";
				
		$(this).one("webkitAnimationEnd", function(){
			try {
				$(this).css(style);
				$(this).removeClass(cssname);
			} catch(ex) {}
			$("#"+cssname).remove();

			try {
				typeof(cb) === "function" && cb();
			} catch(ex) {}
		})
		
		styleNode.html(h);
		$(document.head).prepend(styleNode);
		$(this).addClass(cssname);
	}

})(jQuery, window, document);