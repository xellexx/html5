// JavaScript Document

_CreateModule("P0102", {
	onInit: function(p) {
		$("#sCM").empty();
		$("#spnName").empty();
		$("#sOther").empty();
	},
	
	onLoad: function(p) {
		
		_IF.EI_ListContentInfo(this, 
			{
				"postsId": p.postsId
			}, 
			this.fnSetData,
			null);
	},
	
	onBack: function(bp) {
	},
	
	onLeave: function() {
	},
	
	onRemove: function() {
	},

	fnSetData: function(r) {
		if (!r || !r.RtnCode || r.RtnCode < 0) {
			return;
		}

		//No Data
		if (r.RtnCode==1 || r.dt.length == 0) {
			return;
		}
		
		var d = r.dt;
		
		//设置窗口title
		_TITLE(r.dt[0].post_title);
		
		$("#sCM").html(r.name);
		$("#spnName").html(d[0].post_title);
		$("#sOther").html(d[0].post_modified+"&nbsp;|&nbsp;"+d[0].user_nicename);
		
		var content = $(".content");
        for(var i=0;i<d.length;i++){
            var strHtml = 
            "<li style='border:none' post_title=\""+d[i].post_title+"\" guid=\""+d[i].guid+"\" post_modified=\""+d[i].post_modified+"\"  class='lnkHisType'>"+
            "<div class='liDiv'>"+
            "<div >"+d[i].post_content+"</div>"+
            "</div></li>";
			
            content.append(strHtml);
        }
		
	},
});