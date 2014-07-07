var imgReady = (function(){
	var list = [], intervalId = null,
	
	// 用来执行队列
	tick = function () {
		var i = 0;
		for (; i < list.length; i++) {
			list[i].end ? list.splice(i--, 1) : list[i]();
		};
		!list.length && stop();
	},

	// 停止所有定时器队列
	stop = function () {
		clearInterval(intervalId);
		intervalId = null;
	};

	return function (url, ready, load, error) {
		var check, width, height, newWidth, newHeight,
			img = new Image();
		
		
		if(!url){
			error && error();
			return;
		}
		
		img.src = url;

		// 如果图片被缓存，则直接返回缓存数据
		if (img.complete) {
			ready(img.width, img.height);
			load && load(img.width, img.height);
			return;
		};
		
		// 检测图片大小的改变
		width = img.width;
		height = img.height;
		check = function () {
			newWidth = img.width;
			newHeight = img.height;
			if (newWidth !== width || newHeight !== height ||
				// 如果图片已经在其他地方加载可使用面积检测
				newWidth * newHeight > 1024
			) {
				ready(newWidth, newHeight);
				check.end = true;
			};
		};
		check();
		
		// 加载错误后的事件
		img.onerror = function () {
			error && error();
			check.end = true;
			img = img.onload = img.onerror = null;
		};
		
		// 完全加载完毕的事件
		img.onload = function () {
			load && load(img.width, img.height);
			!check.end && check();
			// IE gif动画会循环执行onload，置空onload即可
			img = img.onload = img.onerror = null;
		};

		// 加入队列中定期执行
		if (!check.end) {
			list.push(check);
			// 无论何时只允许出现一个定时器，减少浏览器性能损耗
			if (intervalId === null) intervalId = setInterval(tick, 40);
		};
	};
})();


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
    var param = {};

    var queryStringList = getQueryString(url);
    for (var i=0; queryStringList && i< queryStringList.length; i++) {
        var result = queryStringList[i];
        var startIndex = result.indexOf("=") + 1;
        var value = result.substring(startIndex);
        var name = result.substring(0, startIndex-1);
        
        param[name] = value;
    }    
    
    return param;
}

/**
 * 格式化number
 * @param num
 * @returns {String}
 */
function formatCurrency(num) {
  if (num===0) {
	return "0.00";
  }
  if (!num)
    return "";
  num = num.toString().replace(/\$|\,/g, '');//去除$符号
  if (isNaN(num))
    num = "";
  sign = (num == (num = Math.abs(num)));
  num = Math.floor(num * 100 + 0.50000000001);
  cents = num % 100;
  num = Math.floor(num / 100).toString();
  if (cents < 10)
    cents = "0" + cents;
  for ( var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
    num = num.substring(0, num.length - (4 * i + 3)) +  num.substring(num.length - (4 * i + 3));
  return (((sign) ? '' : '-') + '' + num + '.' + cents);
}

function isEmptyStrTrim(obj) {
	return typeof(obj)==="string" && obj.trim()==="";
}

function isEmptyStrTrim(obj) {
	return typeof(obj)==="string" && obj==="";
}

function TrimStr(obj) {
	if (obj===null || obj===undefined) {
		return "";
	} else if(typeof(obj)!=="string") {
		obj = String(obj);
	}
	
	return isEmptyStrTrim(obj)?"":obj.trim();
}

function ToNumber(obj) {
	try {
		return Number(obj);
	} catch(ex) {
		return 0;
	}
}

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