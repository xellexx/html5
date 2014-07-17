var _Config = {
	Home : "http://m.dabuwawa.com/",
	Server : "http://m.dabuwawa.com/index.ashx",
	//Server : "http://27.115.38.242/index.ashx",
	Time_out : 10 * 1000,
	
	PageSize : 20,	
};

var _Const = {
	LS_CLS0 : "_LS_CLS0_",
};

function successCB(r, cb) {
	if (r && r.ReturnCode === -100) {
		window.location.href = "http://m.dabuwawa.com/login.aspx";
		return;
	}
	
	cb && cb(r);
}

function getJson(url, param, sCallback, fCallBack) {
	url = url?url:_Config.Server;

    param = param?param:{};
    param["t"] = (new Date()).getTime();
	var rtn;
	try
	{
		/*
		rtn = $.ajax(        
			{
				"url": url,
				"async":false,
				"data": param,

				"type": "GET",
				"timeout": _Config.Time_out,

				"dataType" : "jsonp", 
				"success": sCallback,                
				"error": fCallBack,
			}
		);
		*/

		$.jsonp({
			url: url,
			data: param,
			timeout: _Config.Time_out,
			callbackParameter: "callback",
			success: function(r) {
				successCB(r, sCallback);
			},
			error:fCallBack,
			
//			complete:function(xOptions, textStatus) {
//				$("#msg").append("Json:complete</br>");
//			}

		});
	}
	catch (ex)
	{
		fCallBack && fCallBack(null, ex.message);
	}

}

var _IF = {
	
	_Do: function(i, param, cb, error) {
		try {
			!param && (param={});
			param["type"] = i;
			getJson(null, param, cb, error);
		} catch(e) {
			typeof(error)=="function" && error();
		}
	},
	
	//获得商品分类接口
	GetCls0Data: function(cb, error) {
		getJson(null, {"type": "PinkDoll.WX.Web.Shop.Product.GetProductType"}, cb, error);
	},
	
	//获得商品标签
	GetTag: function(cb, error) {
		getJson(null, {"type": "PinkDoll.WX.Web.Shop.Product.GetProductTag"}, cb, error);
	},
	
	//获得商品列表
	GetPList: function(param, cb, error) {
		_IF._Do("PinkDoll.WX.Web.Shop.Product.GetProductList", param, cb, error);
	},
	
	GetPDetail: function(param, cb, error) {
		_IF._Do("PinkDoll.WX.Web.Shop.Product.GetProductDetail", param, cb, error);
	},
	
	GetCList: function(param, cb, error) {
		_IF._Do("PinkDoll.WX.Web.Shop.Order.GetShoppingCart", param, cb, error);
	},
	
	AddCart: function(param, cb, error) {
		_IF._Do("PinkDoll.WX.Web.Shop.Order.AddShoppingCart", param, cb, error);
	},
	
	UpdCart: function(param, cb, error) {
		_IF._Do("PinkDoll.WX.Web.Shop.Order.UpdateShoppingCart", param, cb, error);
	},
	
	DelCart: function(param, cb, error) {
		_IF._Do("PinkDoll.WX.Web.Shop.Order.DeleteShoppingCart", param, cb, error);
	},
	
	GetAddr: function(param, cb, error) {
		_IF._Do("PinkDoll.WX.Web.Shop.Order.GetAddress", param, cb, error);
	},
	
	AddAddr: function(param, cb, error) {
		_IF._Do("PinkDoll.WX.Web.Shop.Order.AddAddress", param, cb, error);
	},
	
	UpdAddr: function(param, cb, error) {
		_IF._Do("PinkDoll.WX.Web.Shop.Order.EditAddress", param, cb, error);
	},
	
	DelAddr: function(param, cb, error) {
		_IF._Do("PinkDoll.WX.Web.Shop.Order.DeleteAddress", param, cb, error);
	},
	
	GetBalance: function(param, cb, error) {
		_IF._Do("PinkDoll.WX.Web.Shop.Order.GetBalance", param, cb, error);
	},
	
	GetOrderCoupon: function(param, cb, error) {
		_IF._Do("PinkDoll.WX.Web.Shop.Order.GetCoupon", param, cb, error);
	},
	
	SubmitOrder: function(param, cb, error) {
		_IF._Do("PinkDoll.WX.Web.Shop.Order.SubmitOrder", param, cb, error);
	},
	
	GetPayMsg: function(param, cb, error) {
		_IF._Do("PinkDoll.WX.Web.Shop.Pay.GetPayMsg", param, cb, error);
	},

	GetPayResult: function(param, cb, error) {
		_IF._Do("PinkDoll.WX.Web.Shop.Pay.SearchOrderStatus", param, cb, error);
	},
	
	//--董宁宁 js添加开始
	//获得活动列表
	GetActionList:function(param,cb,error){
		_IF._Do("PinkDoll.WX.Web.Shop.Action.GetActionList", param, cb, error);
	},
	//获得活动详细
	GetActionDetail:function(param,cb,error){
		_IF._Do("PinkDoll.WX.Web.Shop.Action.GetActionDetail", param, cb, error);
	},
	//获得门店列表
	GetShopList:function(param,cb,error){
		_IF._Do("PinkDoll.WX.Web.Shop.Shop.GetShopList", param, cb, error);
	},
	//领取优惠券
	ReceiveCoupon:function(param,cb,error){
		_IF._Do("PinkDoll.WX.Web.Shop.Coupon.ReceiveCoupon", param, cb ,error);
	},
	//获得优惠券列表
	GetCouponList:function(param,cb,error){
		_IF._Do("PinkDoll.WX.Web.Shop.Coupon.GetCouponList", param, cb ,error);
	},
	//添加时间：2014-03-05
	GetOrderList:function(param,cb,error){
		_IF._Do("PinkDoll.WX.Web.User.GetOrderLst", param, cb, error);
	},
	//添加时间：2014-03-12
	UpdateUserInfo:function(param,cb,error){
		_IF._Do("PinkDoll.WX.Web.User.UpdateUserInfo", param ,cb ,error);
	},
	GetUserInfo:function(param,cb,error){
		_IF._Do("PinkDoll.WX.Web.User.GetUserInfo" ,param ,cb ,error);
	}
	//--董宁宁 js添加结束
}

var _JUMP = {
	
	To: function(url, aParam) {
		function isParam(p) {
			return (typeof(p) == "string" && p.trim()!=="" || typeof(p) == "number");
		}
		
		var up = "";
		for (var key in aParam) isParam(aParam[key]) && (up += ((up=="")?"?":"&") + encodeURIComponent(key) + "=" + encodeURIComponent(aParam[key]));
		
		window.location.href = url+up;
	},
	
	ToList: function(title, typeid, typeid2, tag, name, code) {
		var url = "list.html";
		
		_JUMP.To(url,
			{
				"title": title, "typeid":typeid, "typeid2":typeid2, "tag":tag, "name":name, "code":code,
			}
		)
	},
	
	Back: function() {
		window.history.back();
	}
}

var _Storage = {
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

	SaveSelAddr: function(SRVID, name, addr, phone) {
		window.localStorage.setItem("_addrlist_sel_SRVID", SRVID);
		window.localStorage.setItem("_addrlist_sel_NAME", name);
		window.localStorage.setItem("_addrlist_sel_ADDR", addr);
		window.localStorage.setItem("_addrlist_sel_PHONE", phone);
	},

	GetSelAddr: function() {
		return {
			SRVID: window.localStorage.getItem("_addrlist_sel_SRVID"),
			ReceiveName: window.localStorage.getItem("_addrlist_sel_NAME"),
			Address: window.localStorage.getItem("_addrlist_sel_ADDR"),
			Mobile: window.localStorage.getItem("_addrlist_sel_PHONE"),
		};
	},
	
	DelSelAddr: function() {
		window.localStorage.removeItem("_addrlist_sel_SRVID");
		window.localStorage.removeItem("_addrlist_sel_NAME");
		window.localStorage.removeItem("_addrlist_sel_ADDR");
		window.localStorage.removeItem("_addrlist_sel_PHONE");
	},
}

function _WX_DoFn(fn, orderNo, param, success) {
	try { typeof(fn)=="function" && fn(orderNo, param, success); } catch(ex) {};
}

/*
cb可以有两个参数
p1:订单号
p2:订单支付结果（该接口的返回值）
p3:支付是否成功

p2不存在：订单没有支付
    存在：进行过支付操作，p3存在返回值false/true
*/
function _WX_Pay(totalFee, SRVID, Coupon, SKU, num, cb) {
	_IF.SubmitOrder(
		{
			"TotalFee": totalFee, 
			"SRVID": SRVID, 
			"CouponDID": Coupon, 
			"SKUID":SKU,
			"Num":num
		},
		function(r) {
			if (!r || r.ReturnCode !== 0 ||
				!r.Data || (r.Data.OrderNo=TrimStr(r.Data.OrderNo)) == "" ) {

				_ALERT((r&&typeof(r.ReturnMsg)=="string")?TrimStr(r.ReturnMsg):"生成订单失败", null, function() {
					_WX_DoFn(cb);
				});				
				return;
			}

/*
			if (typeof(r.Data.Payment)!="number" || r.Data.Payment==0 ||
				!confirm("订单已生成，现在是否支付？\n共计￥"+r.Data.Payment+"元")) {

				_WX_DoFn(cb, r.Data.OrderNo);
				return;
			}
*/
			_WX_PayOrder(r.Data.OrderNo, cb);
		}, 
		function() {
			_ALERT("订单没有生成", "", function(){
				_WX_DoFn(cb);
			});
		}
	);
}

/*
cb可以有两个参数
p1:订单号
p2:订单支付结果（该接口的返回值）
p3:支付是否成功

p2不存在：订单没有支付
    存在：进行过支付操作，p3存在返回值false/true
*/
function _WX_PayOrder(orderNo, cb) {
	_IF.GetPayMsg({"OrderNo": orderNo},
		function(r) {
			try {
				if (!r || r.ReturnCode !== 0 || !r.Data) {
					_ALERT((r&&typeof(r.ReturnMsg)=="string")?TrimStr(r.ReturnMsg):"暂不支持微信支付", null, function(){
						_WX_DoFn(cb, orderNo);
					});
					return;
				};
				var dt = r.Data;
				!dt.AppId && (dt.AppId="");
				!dt.NonceStr && (dt.NonceStr="");
				!dt.Package && (dt.Package="");
				!dt.SignType && (dt.SignType="");
				!dt.TimeStamp && (dt.TimeStamp="");
				!dt.paySign && (dt.paySign="");
				
				_WX_Payment(dt, orderNo, cb);
			} catch(ex) {
				_ALERT("暂不支持微信支付", null, function(){
					_WX_DoFn(cb, orderNo,null,false);
				});
				
				return;
			}
		},
		function() {
			_ALERT("暂不支持微信支付", null, function(){
				_WX_DoFn(cb, orderNo,null,false);
			});
		}
	);
}

function _WX_Payment(dt, orderNo, cb) {

	if (!WeixinJSBridge || typeof(WeixinJSBridge.invoke) != "function") {
		_ALERT("请在微信内部浏览进行支付", null, function(){
			_WX_DoFn(cb, orderNo,null,false);
		});
		return;
	}
	
	var param = {
		"appId": dt.AppId,
		"timeStamp": dt.TimeStamp,
		"nonceStr": dt.NonceStr,
		"package": dt.Package,
		"signType": dt.SignType,
		"paySign": dt.paySign,
	};

	WeixinJSBridge.invoke('getBrandWCPayRequest', param,
		function (res) {
			if (res.err_msg == "get_brand_wcpay_request:ok") {
				_WX_GetPayResult(orderNo, cb, true);
			} else {
				_ALERT("支付没有成功哦，再试试？", null, function(){
					_WX_GetPayResult(orderNo, cb, false);
				});
			}
		}
	)
}

function _WX_GetPayResult(orderNo, cb, success) {
	_IF.GetPayResult({"OrderNo": orderNo},
		function(r) {
			_WX_DoFn(cb, orderNo, r, success);
		},
		function() {
			_WX_DoFn(cb, orderNo, {}, success);
		}
	);
}