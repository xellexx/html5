// JavaScript Document

_CreateModule("P0101", {
	//画面载入后
	onInit: function(p) {
		this._PD["PARAM"] = p;
		
		//测试用
		p["CID"] = "3";
		
		this._PD["IN_SEARCH"] = false;
		
		//用户AccountMD5，此处是否有用，不知道
		this._PD["AccountMD5"] = null;
		
		//前一个章节的id
		this._PD["C_PCHAPTERID"] = null;
		//后一个章节的id
		this._PD["C_NCHAPTERID"] = null;
		//当前章节的id
		this._PD["C_TERMTAXID"] = null;
		//翻页用当前最优一条记录的id
		this._PD["C_LISTCONTENTID"] = null;
		
		//判断是否还有翻页
		this._PD["C_ISMORE"] = false;
		
		//初始化title
		this.fnSetTitle("");
		
		//设置菜单状态
		var as = _AsideSetting($("aside"), $("#ListContent"), "main-half");
		this._PD["ASIDE_SCRIPT"] = as;
		//绑定菜单打开事件
		this.on($("#btnMenu"), _CLICK, as.fnShow);

		this.on($("#btnRefresh"), _CLICK, this.fnRefresh);
	},
	
	//画面显示后
	onLoad: function(p) {
		
		var _t = this;
		//滚动条事件处理函数
		var winScroll = function() {
			//非活动窗口
			if (_t && (_t._status_===-1 || _t._status_===1)) {
				return;
			}
			
			var st = $(this).scrollTop();
			
			//到达底部
			if (_t._PD["C_ISMORE"] && $(document).height() <= window.innerHeight + st) {
				_t.fnMore();
			}
		}
		
		//绑定窗口滚动条事件
		this._PD["winScroll"] = winScroll;		
		$(window).scroll(this._PD["winScroll"]);
		
		this.fnInit();
	},
	
	//从下一个画面返回本画面
	onBack: function(bp) {
	},
	
	//离开当前画面，想下个画面跳转前
	onLeave: function() {
	},
	
	//画面结束时
	onRemove: function() {
		$(window).unbind("scroll", this._PD["winScroll"]);
		delete this._PD["winScroll"];
		
		delete this._PD["ASIDE_SCRIPT"];
	},
	
	//初始化
	fnInit: function() {
		var parm = this._PD["PARAM"];
		
		if (this._PD["IN_SEARCH"]) return;
		this._PD["IN_SEARCH"] = true;
		
		_IF.EI_ListContent(this, 
			{
				"CommunityID":parm.CID,"termTaxID":parm.termTaxID,"isReLoad": "false"
			}, 
			this.fnSetData,
			function(){
				this._PD["IN_SEARCH"] = false;
			});
	},
	
	//翻页
	fnMore: function() {
		var parm = this._PD["PARAM"];

		if (this._PD["IN_SEARCH"]) return;
		this._PD["IN_SEARCH"] = true;

		_IF.EI_ListContentM(this, 
			{
				"termTaxID": this._PD["C_TERMTAXID"], "LISTCONTENTID": this._PD["C_LISTCONTENTID"], 
				"isReLoad": "false", "CommunityID":parm.CID
			}, 
			function(r) {
				this.fnSetData(r, true);
			},
			function(){
				this._PD["IN_SEARCH"] = false;
			});
	},
	
	//以固定的分类id进行检索
	fnChapterList: function(termTaxID) {
		var parm = this._PD["PARAM"];

		if (this._PD["IN_SEARCH"]) return;
		this._PD["IN_SEARCH"] = true;

		this._PD["C_TERMTAXID"] = termTaxID;
		_IF.EI_ListContent(this, 
			{
				"CommunityID":parm.CID, "termTaxID":termTaxID, "isReLoad": "true"
			}, 
			this.fnSetData,
			function(){
				this._PD["IN_SEARCH"] = false;
			});
	},
	
	fnRefresh: function() {
		this.fnChapterList(this._PD["C_TERMTAXID"]);
	},
	
	//设置数据
	fnSetData: function(r, more) {
		this._PD["IN_SEARCH"] = false;
		
	    this.fnSetTitle(r.MenuName);

		//处理异常
		if (!r || !r.RtnCode || r.RtnCode < 0) {
			return;
		}
		
		this._PD["AccountMD5"] = r.AccountMD5;
		this._PD["C_PCHAPTERID"] = r.PCHAPTERID;
		this._PD["C_NCHAPTERID"] = r.NCHAPTERID;
		
		this._PD["C_TERMTAXID"] = r.termTaxID;
		this._PD["C_LISTCONTENTID"] = r.ListContentid;
		
		more!==true && ($("#ListContent").empty());
		//设置一览
		//无数据
		if(r.RtnCode==1){
			more!==true && (this._PD["C_LISTCONTENTID"] = null);
			this._Alert("No Data");
		} else {
			this.fnSetList(r.dt, more);
		}
		
		this._PD["C_ISMORE"] = r.isMore;
		
		//设置菜单
		this.fnSetMenuItem(r.Menu);
	},
	
	//设置一览数据
	fnSetList: function(dt, more) {
		var lst = $("#ListContent");
		
		for (var i=0; i<dt.length; i++) {
			var r = dt[i];
			var hasImg = (r.GroupClass !="");
			
			var li = $(
'<li>'+
	(hasImg?('<div class="img"><img src="'+r.GroupClass+'"/></div>'):"")+
	'<div class="title '+(hasImg?"":"no-img")+'">'+
		'<span class="main">'+_RHS(r.GroupName)+'</span>'+
		'<span class="sub">'+_RHS(r.UDate)+'</span>'+
	'</div>'+
'</li>'
			);
			
			li.attr("postsId", r.ID);
			//li.attr("post_title", r.GroupName);
			li.attr("guid", r.guid);
			li.attr("post_modified", r.UDate);

			lst.append(li);
			
			this.on(li, _CLICK, this.fnSelect);
		}
		
		more!==true && ($(window).scrollTop(0));
	},
	
	//设置菜单内容
	fnSetMenuItem: function(dt) {
		if (!dt || dt.length == 0) return;
		
		var menu = $("#ListMenu");
		menu.empty();
		
		menu.append("<li class='active'><span>全部</span></li>")

		for (var i=0; i<dt.length; i++) {
			var r = dt[i];
			
			var li = $("<li><span></span></li>");
			li.find("span").text(r.name);
			li.attr("term_taxonomy_id", r.term_taxonomy_id);
			li.attr("term_id", r.term_id);
			li.attr("parent", r.parent);
			
			menu.append(li);
			
			//Menu当前选择项
			if (r.CURRTERMID == r.term_taxonomy_id){
				li.siblings().removeClass("active");
				li.addClass("active");
			}
		}
		
		this.fnSetTitle(menu.find("li.active").text());
		
		//添加menu事件
		this.on(menu.find("li"), _CLICK, this.fnSetActiveMenu)
	},
	
	
	//菜单选中
	fnSetActiveMenu: function(el) {
		var _t = $(el);
		if (_t.hasClass("active")) return;
		
		//设置菜单选中式样
		_t.siblings().removeClass("active");
		_t.addClass("active");
		
		this._PD["ASIDE_SCRIPT"].fnClose(function(){
			//设置标题文字
			//this.fnSetTitle(_t.text())
			
			//检索数据
		
			this.fnChapterList(_t.attr("term_taxonomy_id"));
		}, this);

	},
	
	fnSelect: function(el) {
		_load("P0102", { "postsId": $(el).attr("postsId") });
	},
	
	//设置title
	fnSetTitle: function(txt) {
		$(".ui-head .title").text(txt);
		_TITLE(txt);
	},

});