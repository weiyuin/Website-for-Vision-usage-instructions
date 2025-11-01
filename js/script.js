function goscript(val) {
	var cites = $("cite");
	cites.each(function() {
		var str = $(this).html(); //遍历专得到的每一个属jquery对象
		var str = $.md5(str);
		if(str == val) {
			var parent = $(this).parent().parent();
			while(parent.is("li")) {
				var notei = parent.children(":first");
					if(notei.is("i")) {
						notei.click();
					} 
				parent = parent.parent().parent();
			}
		}
		if(str == val) {
			$(this).click();
			$(this).addClass("custom-tree-item-clicked");
			var go=$(this).offset().top-100;
			$("#classtree").scrollTop(go);
		} else {
			$(this).removeClass("custom-tree-item-clicked");
		}
	});
}

