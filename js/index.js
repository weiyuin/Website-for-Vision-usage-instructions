// 默认选中
function selectcite() {
	var cites = $("cite");
	cites.each(function() {
		var str = $(this).html(); //遍历专得到的每一个属jquery对象
		if(str == menuname) {
			$(this).addClass("custom-tree-item-clicked");
		} else {
			$(this).removeClass("custom-tree-item-clicked");
		}
	});
	var toolname=GetQueryString("toolname");
	if(toolname!="index"){
		goscript(toolname);
	}
}

var m_height = 100000;
var m_timer = 0;
$(document).ready(function() {
	window.addEventListener('message', function (e){
   					var value = e.data;
   					myresize(value);
				}, false);
	$("#showimg").viewer();
	var iframemodel = ('<iframe src="' + modelurl + '" class="layadmin-iframe" name="iframeMain" id="iframeMain" frameborder="0" scrolling="yes" /></iframe>');
	$("#frame-model").append(iframemodel);
});

function myresize(height)
{
	if(height == 100000)
	{
		$("#div-window").scrollTop(0);
	}
	m_height = height;
	$("#iframeMain").css('height',height + 100 + 'px');
	$(".div-frame").css('height',height + 110 + 'px');
	$(".div-main").css('height',height + 120 + 'px');
	addcss();
}

window.onresize = function () {		
	resizeframe();
}

function resizeframe(){
		addcss();
		$("#iframeMain").css('height', 2 * m_height + 'px');
		$(".div-frame").css('height', 2 * m_height + 'px');
		$(".div-main").css('height', 2 * m_height  + 'px');
		clearTimeout(m_timer);
		m_timer = setTimeout(function(){
			var iframeChild = document.getElementById("iframeMain").contentWindow; 
			iframeChild.postMessage("getheight", '*');
		},500);
}

function addcss(){
	$(".div-frame").css('width','100%').css('width','-=450px');
	$(".div-menu").css('height','100%').css('height','-=50px');
	$("#classtree").css('height','100%').css('height','-=33px');
}
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return "index";
}

function imgScale(obj) {
	//alert(parseInt(obj.style.zoom,10));
	var zoom = parseInt(obj.style.zoom, 10) || 100;
	zoom += event.wheelDelta / 15;
	if(zoom > 0) {
		obj.style.zoom = zoom + '%';
	} else {
		return false;
	}
}

function showmodel() {
	$("#show-model").addClass("show-type");
	$("#show-all").removeClass("show-type");
	$("#frame-model").attr("class", "div-frame");
	$("#frame-all").attr("class", "div-frame-hidden");
	if(nodeSeleted == null) {
		var iframemodel = ('<iframe src="' + modelurl + '" class="layadmin-iframe" name="iframeMain" id="iframeMain" frameborder="0" scrolling="no" /></iframe>');
		$("#frame-model").append(iframemodel);
	} else {
		var src = nodeSeleted.src;
		$("#iframeMain").remove();
		var iframemodel = ('<iframe src="' + src + '" class="layadmin-iframe" name="iframeMain" id="iframeMain" frameborder="0" scrolling="no" /></iframe>');
		$("#frame-model").append(iframemodel);
	}

	isAll = 0;
}

function iframeonload(obj) {
	obj.height = obj.contentWindow.document.documentElement.scrollHeight + 30;
}

function showall() {
	isAll = 1;
	$("#show-all").addClass("show-type");
	$("#show-model").removeClass("show-type");
	$("#frame-all").attr("class", "div-frame");
	$("#frame-model").attr("class", "div-frame-hidden");
	if(nodeSeleted == null) {
		$("#frame-all").scrollTop(0);
	} else {
		var nodeid = nodeSeleted.id;
		if(nodeid == "2") {
			nodeid = "2-1-0";
		}
		if(nodeid == "2-28") {
			nodeid = "2-28-0";
		}
		var go = 0;
		if($("#" + nodeid).is("iframe")) {
			go = $("#" + nodeid).offset().top;
		} else {
			go = $("#" + nodeid + "-0").offset().top;
		}
		if(go > 0) {
			go = go - size;
		} else {
			go = go - size + 2;
		}
		var value = $("#frame-all").scrollTop();
		$("#frame-all").scrollTop(value + go);

	}
}
//接收消息
function getmessage(obj) {
	if(obj != null) {
		$("#showimg").attr("src", obj);
		$("#showimg").click();
	}
}

function imgclick() {
	var viewer = $("#showimg").next();
	viewer.dblclick(function() {
		var closebtn = viewer.find('div[data-action="mix"]');
		closebtn.click();
	});
}

function getframewidth() {
	var width = 0;
	if($("#frame-model").width() > 0) {
		width = $("#frame-model").width() - 20;
	}
	if($("#frame-all").width() > 0) {
		width = $("#frame-all").width() - 20;
	}
	return width;
}

function geturl(text) {
	var url = "";
	var iframes = $("span");
	iframes.each(function() {
		var src = $(this).attr("src"); //遍历专得到的每一个属jquery对象
		if(src != null && src != "") {
			var name = src.substring(src.indexOf("/") + 1, src.lastIndexOf("/"));
			if(name == text) {
				url = "../../" + src;
			}
		}
	});
	return url;
}
var isopens = new Array();

function searchtree() {
	var val = $("#searchtree").val();
	var cityFirst;
	if(val == null || val == "") {
		if(isopens.length != 0) {
			$("#classtree").find("li").attr("style", "");
			var ies = $("#classtree").find("i[class='layui-icon layui-tree-spread']");
			var i = 0;
			ies.each(function() {
				var ul = $(this).next().next();
				var isopen = isopens[i];
				if(ul.is("ul") && ul.attr("class") == "layui-show" && isopen == 0) {
					$(this).click();
				}
				i = i + 1;
			});
			isopens = new Array();
		}
	} else {
		var ies = $("#classtree").find("i[class='layui-icon layui-tree-spread']");
		ies.each(function() {
			var ul = $(this).next().next();
			if(ul.is("ul") && ul.attr("class") != "layui-show") {
				isopens.push(0);
				$(this).click();
			} else {
				isopens.push(1);
			}
		});
		$("#classtree").find("li").attr("style", "display: none !important;")
		var cites = $("cite");
		cites.each(function() {
			var str = $(this).html(); //遍历专得到的每一个属jquery对象
			if(str.indexOf(val) >= 0) {
				if(val == str)
				{
					cityFirst = $(this);
				}
				var parent = $(this).parent().parent();
				while (parent.is("li")){
					parent.attr("style", "");
					parent = parent.parent().parent();
				}
			}
		});
		cityFirst.click();
	}
}