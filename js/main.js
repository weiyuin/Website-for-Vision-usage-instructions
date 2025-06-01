//载入时自动根据屏幕大小自动缩放图片
function scaleimg() {
	var imges = $("img");
	var screnwidth = window.parent.getframewidth();
	imges.each(function() {
		var imgwidth = $(this).width();
		if(imgwidth > screnwidth) {
			var size = (screnwidth) * 100 / imgwidth;
			this.style.zoom = size + '%';
			
		}
	});
	imges.attr("onclick", "sendmessage(this);");
}
//载入时根据图片位置尺寸自动排列图片
function listimg() {
	var imges = $("img");
	var arraynodes = new Array();
	var size = 0;
	imges.each(function() {
		imges.attr("onclick", "sendmessage(this);");
		var nextnode = $(this).next();
		if(nextnode != null && nextnode.is("img")&&$(this).parent().html().indexOf("<") == 0) {
			size = arraynodes.push($(this));
		} else {
			if(size > 0) {
				size = arraynodes.push($(this));
				var totlewidth = 0;
				for(var i = 0; i < size; i++) {
					var imgnode = arraynodes[i];
					totlewidth = totlewidth + imgnode.width();
				}
				var windowwidth = $(this).parent().width() - 20;
				if(totlewidth < windowwidth) {
					var spacewidth = (windowwidth - totlewidth) / ((size + 1) * 2);
					for(var i = 0; i < size; i++) {
						var imgnode = arraynodes[i];
						imgnode.attr("style", "display: inline;margin-top: 10px;margin-bottom: 10px;margin-left:" + spacewidth + "px ;" + "margin-right:" + spacewidth + "px ;");
					}
					var nextparent = $(this).parent().next();
					if(nextparent.is("p")) {
						var arrayimgnotes = nextparent.children();
						var psize = arrayimgnotes.length;
						if(size == psize && nextparent.children(":first").is("imgnote")) {
							for(var i = 0; i < size; i++) {
								var imgnote = arrayimgnotes.eq(i);
								var imgnode = arraynodes[i];
								var pwidth = imgnode.width() + spacewidth * 2;
								imgnote.attr("style", "display: inline-block;text-align:center;width:" + pwidth + "px;");

							}
							nextparent.attr("style", "text-align:center;");
							nextparent = nextparent.next();
							if(nextparent.is("p")) {
								arrayimgnotes = nextparent.children();
								if(arrayimgnotes.length == 1 && nextparent.children(":first").is("imgnote")) {
									nextparent.attr("style", "text-align:center;");
								}
							}
						}
					}
				}
				$(this).parent().attr("style", "text-align:center;");
				arraynodes = new Array();
				size=0;
			} else {
				var imgchildnodes = $(this).parent().children();
				if($(this).parent().is("p") && imgchildnodes.length == 1) {
					if($(this).parent().html().indexOf("<") == 0||$(this).parent().html().indexOf(" ") == 0) {
						$(this).parent().attr("style", "text-align: center;");
					}else{
						$(this).attr("style","vertical-align:middle;height: 30px;")
					}
				}
			}
		}
	});
}

function centerimgnote() {
	var imgnotes = $("imgnote");
	imgnotes.each(function() {
		var parentimgnote = $(this).parent();
		if(parentimgnote.is("p")){
			parentimgnote.attr("style", "text-align:center;");
		}
	});
}

function changea() {
	var imges = $("a");
	imges.each(function() {
		$(this).attr("href", "javascript:");
		$(this).attr("onclick", "openwindow(this)");
	});
}
function replacehtml() {
	var html=$("body").html();
	var re=new RegExp("<p>```python","g");
	html=html.replace(re,"<pre><p>");
	re=new RegExp("```</p>","g");
	html=html.replace(re,"</p></pre>");
	re=new RegExp("<p></p>","g");
	html=html.replace(re,"");
	re=new RegExp("<code>python","g");
	html=html.replace(re,"<code>");
	var html=$("body").html(html);
	var pres = $("pre");
	pres.each(function() {
		var prehtml=$(this).html();
		var preexp=new RegExp("<h1>","g");
		prehtml=prehtml.replace(preexp,"<prenote>##");
		preexp=new RegExp("</h1>","g");
		prehtml=prehtml.replace(preexp,"</prenote>");
		preexp=new RegExp("<h2>","g");
		prehtml=prehtml.replace(preexp,"<prenote>##");
		preexp=new RegExp("</h2>","g");
		prehtml=prehtml.replace(preexp,"</prenote>");
		$(this).html(prehtml);
	});
}
function inittable() {
	var tables = $("table");
	tables.each(function() {
		var trs=$(this).find("tr");
		var tdfirst;
		var i=1;
		var lasthtml="";
		trs.each(function() {
			var td=$(this).children(":first");
			var tdhtml=td.html();
			var re=new RegExp(" ","g");
			tdhtml=tdhtml.replace(re,"");
			lasthtml=tdhtml;
			if(tdhtml==""){
				i=i+1;
				td.remove();
			}else{				
				if(i!=1){
					tdfirst.attr("rowspan",i);
					tdfirst.attr("style","background: #F4E9E9;");
				}
				tdfirst=td;
				i=1;
			}
		});
		if(lasthtml==""){
			tdfirst.attr("rowspan",i);
			tdfirst.attr("style","background: #F4E9E9;");
		}
	});
}

function postheight(){
	var lastnode = $("body").children(":last");
	var height = lastnode.offset().top + lastnode.height();
	window.parent.postMessage(height, '*');
}

$(document).ready(function() {
	replacehtml();
	initframe();
	inittable();
	window.parent.postMessage(100000, '*');
	setTimeout(function(){postheight();},100);
});

window.addEventListener('message', function (e){
   		var value = e.data;
   		if(value == "getheight")
   		{
   			postheight();
   		}
	}, false);

function addpre(){
	$("code").wrap("<pre></pre>");
}

function initframe() {
	//scaleimg();
	centerimgnote();
	listimg();
	changea();
	addpre();
}

function sendmessage(obj) {
	if(obj != null && obj.src != null) {
		window.parent.getmessage(obj.src);
	}
}

function openwindow(obja) {
	var atext = $(obja).text();
	var aurl = window.parent.geturl(atext);
	if(aurl != null && aurl != "") {
		window.open(aurl);
	}
}
