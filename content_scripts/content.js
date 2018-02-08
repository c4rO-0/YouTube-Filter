//================================FUNCTIONS====================================

function convertSearchToFeed(ObjM, VedioInfo, vYoutube = 0) {
	// 替换观看历史
	// 替换标题
	// 替换up主
	ObjM_local = ObjM.clone();

	if(vYoutube == 0){

		// 首先替换封面
		$(ObjM_local).find("span.yt-thumb-simple").find("img").attr('src', VedioInfo.coverUrl);
		//console.log($(ObjList).find("img").attr("width"));
		// 替换封面链接

		
		$(ObjM_local).find("div.yt-lockup-thumbnail.contains-addto").find("a.yt-uix-sessionlink.spf-link")
		.attr("href",  $(VedioInfo.il).find("h3.yt-lockup-title").find("a").attr("href"));	
		
		// 替换时长
		$(ObjM_local).find("span.video-time").text(VedioInfo.videoTime);

		// 替换标题
		//删除原标题
		$(ObjM_local).find("h3.yt-lockup-title.contains-action-menu").children().remove();
		// 添加新标题,时长
		$(ObjM_local).find("h3.yt-lockup-title.contains-action-menu").prepend($(VedioInfo.il).find("h3.yt-lockup-title").children());

		// 替换up
		$(ObjM_local).find("div.yt-lockup-byline.yt-ui-ellipsis.yt-ui-ellipsis-2").children().remove();
		$(ObjM_local).find("div.yt-lockup-byline.yt-ui-ellipsis.yt-ui-ellipsis-2").prepend($(VedioInfo.il).find("div.yt-lockup-byline").children());

		// 替换观看次数 更新时间
		$(ObjM_local).find("ul.yt-lockup-meta-info").children().remove();
		$(VedioInfo.il).find("ul.yt-lockup-meta-info").children().each(function (index) {
			$(ObjM_local).find("ul.yt-lockup-meta-info").prepend($(this));
		});


		// 检查视频是否观看过
		$(ObjM_local).find("span.resume-playback-background").remove();
		$(ObjM_local).find("span.resume-playback-progress-bar").remove();
		Objresume = $(VedioInfo.il).find("span.resume-playback-progress-bar");
		if ($(Objresume).length > 0) {
			$(ObjM_local).find("div.yt-lockup-thumbnail.contains-percent-duration-watched.contains-addto").append($(VedioInfo.il).find("span.resume-playback-background"));
			$(ObjM_local).find("div.yt-lockup-thumbnail.contains-percent-duration-watched.contains-addto").append($(Objresume));

		}
	}else if(vYoutube == 1){

		// console.log("1");
		// 首先替换封面
		$(ObjM_local).find("img#img").attr('src', VedioInfo.coverUrl);
		//console.log($(ObjList).find("img").attr("width"));
		// console.log("2");
		// 替换封面链接
		// console.log($(ObjM_local).find("a#thumbnail").attr("href"));
		// console.log($(VedioInfo.il).find("h3.yt-lockup-title").find("a").attr("href"));
		$(ObjM_local).find("a#thumbnail")
		.attr("href",  $(VedioInfo.il).find("h3.yt-lockup-title").find("a").attr("href"));	

		// console.log("3");
		// 替换时长
		// console.log($(ObjM_local).find("span.style-scope.ytd-thumbnail-overlay-time-status-renderer").text());
		$(ObjM_local).find("span.style-scope.ytd-thumbnail-overlay-time-status-renderer").text(VedioInfo.videoTime);
		// console.log("4");
		// 替换标题
		$(ObjM_local).find("h3.style-scope.ytd-grid-video-renderer").find("a#video-title")
		.attr('href', $(VedioInfo.il).find("h3.yt-lockup-title").find("a").attr("href")); 

		$(ObjM_local).find("h3.style-scope.ytd-grid-video-renderer").find("a#video-title")
		.attr('aria-label', "YTSE");  // 抹掉之前的信息

		$(ObjM_local).find("h3.style-scope.ytd-grid-video-renderer").find("a#video-title")
		.attr('title', $(VedioInfo.il).find("h3.yt-lockup-title").find("a").attr("title")); 

		$(ObjM_local).find("h3.style-scope.ytd-grid-video-renderer").find("a#video-title")
		.text($(VedioInfo.il).find("h3.yt-lockup-title").find("a").text()); 
		// console.log("5");
		// 替换up

		$(ObjM_local).find("yt-formatted-string#byline").find("a")
		.attr('href', $(VedioInfo.il).find("div.yt-lockup-byline").find("a.yt-uix-sessionlink").attr('href'));

		$(ObjM_local).find("yt-formatted-string#byline").find("a")
		.text($(VedioInfo.il).find("div.yt-lockup-byline").find("a.yt-uix-sessionlink").text());

		// console.log("6");
		// 替换观看次数 更新时间
		// 新版本 : 观看次数 更新时间
		$($(ObjM_local).find("div#metadata-line").children()[0])
		.text($($(VedioInfo.il).find("ul.yt-lockup-meta-info").children()[1]).text());
		$($(ObjM_local).find("div#metadata-line").children()[1])
		.text($($(VedioInfo.il).find("ul.yt-lockup-meta-info").children()[0]).text());



		// 检查视频是否观看过
		// $(ObjM_local).find("span.resume-playback-background").remove();
		// $(ObjM_local).find("span.resume-playback-progress-bar").remove();
		// Objresume = $(VedioInfo.il).find("span.resume-playback-progress-bar");
		// if ($(Objresume).length > 0) {
		// 	$(ObjM_local).find("div.yt-lockup-thumbnail.contains-percent-duration-watched.contains-addto").append($(VedioInfo.il).find("span.resume-playback-background"));
		// 	$(ObjM_local).find("div.yt-lockup-thumbnail.contains-percent-duration-watched.contains-addto").append($(Objresume));

		// }
	}else{
		// 未知版本
	}

	return ObjM_local;
}

function getFeedVideoInfo(il_video,vYoutube=0) {
    /*\ 
    || vYoutube youtube页面版本
	\*/
	if(vYoutube == 0){
		if ($(il_video).find("ul.yt-lockup-meta.yt-lockup-playlist-items").length > 0) {
			// 在对channel页面进行搜索的时候无法屏蔽列表,所以这里过滤一下是否为列表
			//该条目是列表
			vInfo = new infoVideo(il_video);
			return vInfo;
		} else {
			// 不是列表

			// 获取更新时间
			timeObj = $(il_video).find("div.yt-lockup-content").find("div.yt-lockup-meta").find("ul.yt-lockup-meta-info");
			var tNow = new Date();
			if ($(timeObj).find("li").toArray().length == 2) {
				uptimeli = $(timeObj).find("li").toArray()[1];
				uptimeStr = convertReTime2Int($(uptimeli).text()) + tNow.valueOf();
			} else {
				// 可能在直播
				if ($(il_video).find("div.yt-lockup-content").find("div.yt-lockup-badges").find("ul.yt-badge-list").find("span.yt-badge.yt-badge-live").length > 0) {
					// 在直播
					uptimeStr = tNow.valueOf();
				} else {
					// 不知道类别
					uptimeStr = tNow.valueOf();
				}
			}



			//vInfo = new infoVideo($(il_video).html(), title, videoUrl, coverUrl, videoTime, channelName, channelUrl, uptimeStr, tNow);
			vInfo = new infoVideo("", "", "", "", "", "", "", uptimeStr, tNow);

			//vInfo.show();
			return vInfo;

		}
	}else if(vYoutube == 1){ // 新版本
		// 获取更新时间

		var tNow = new Date();
		// console.log($(il_video).find("div#metadata-line").children.length);
		if($(il_video).find("div#metadata-line").children.length == 2){
			// 不是直播
			timeObj = $(il_video).find("div#metadata-line").children()[1];
			//console.log(timeObj);
			uptimeStr = convertReTime2Int($(timeObj).text()) + tNow.valueOf();
		}else{
			// 是直播
			
			uptimeStr = tNow.valueOf();
		}
		vInfo = new infoVideo("", "", "", "", "", "", "", uptimeStr, tNow);

		// vInfo.show();
		return vInfo;		
	}else{
		// 没有版本号对应
		vInfo = new infoVideo(il_video);
		return vInfo;		
	}

    // vInfo.show();

}

// =============================START FROM HERE================================
//let test=new keyWord("this is a test")
//test.show()
//window.alert("Hey boy")




// 读取已获得的列表
console.log("load video list");
sLastTime="<ytd-thumbnail-overlay-time-status-renderer class=\"style-scope ytd-thumbnail\"\
 overlay-style=\"DEFAULT\"><span class=\"style-scope ytd-thumbnail-overlay-time-status-renderer\" aria-label=\"\">\
4:57\
</span></ytd-thumbnail-overlay-time-status-renderer>";

//let  getListVedio = browser.storage.local.get("list_vedio");
//getListVedio.then(onGot);
function Insert(){
		// 检查页面是否已经被加载
	if($("#insertYtse").length){
		console.log("have inserted");
	}else{
		console.log("insert now");
		let vYoutube = 0; //区分youtube版本， 旧版为0，新版为1. 考虑以后有更多版本，为整数
		let gettingItem = browser.storage.local.get("list_vedio");
		let array_insertObj = new Array();
		// let indexArray = new Array();
		gettingItem.then((Obj) => {
			if (isObjEmpty(Obj)) {
				//console.log("list is empty");
		
				return [];
			} else {
				//console.log("list is not empty");
				//console.log(Obj);
				//console.log(Obj.list_vedio.length);
				return (Obj.list_vedio);
			}
		}).then((list_vedio) => {
		
			console.log("load " + list_vedio.length + " videos");
		
			// 开始解析网页
			$(document).ready(function () {
				console.log("ready to load");
				//Obj = $("div.multirow-shelf").find("ul.shelf-content");
				//尝试插入
				//console.log("<ytd-grid-video-renderer class=\"style-scope ytd-grid-renderer\">"+
				//  list_vedio[0].il +
				//  "</ytd-grid-video-renderer>");
				//$("<ytd-grid-video-renderer class=\"style-scope ytd-grid-renderer\">"+
				//  list_vedio[0].il +
				//  "</ytd-grid-video-renderer>").insertAfter($("div.style-scope.ytd-grid-renderer"));
				//debug_1 = new infoVideo();
				//debug_1 = getVideoInfo(list_vedio[0].il);
				//debug_1.show();
		
				//新版
				//$("<ytd-grid-video-renderer class=\"style-scope ytd-grid-renderer\">"+
				//  list_vedio[0].il +
				//  "</ytd-grid-video-renderer>").insertAfter(
				//								  $("ytd-grid-renderer.style-scope.ytd-shelf-renderer")
				//								  .find("div.style-scope.ytd-grid-renderer")
				//								  .find("ytd-grid-video-renderer.style-scope.ytd-grid-renderer"));
		
				//旧版
				// 首先复制一个视频作为模板
				Obj = $("div.multirow-shelf").find("ul.shelf-content").find("li.yt-shelf-grid-item"); // 旧版
				
				if(Obj.length == 0){
					// 可能是新版
					Obj = $("div#items").children(); //("ytd-item-section-renderer.style-scope.ytd-section-list-renderer"); 
					//console.log(Obj);
					vYoutube = 1;
					if(Obj.length == 0){
						// 既不是新版也不是旧版
						return ;
					}
				}
				console.log("Youtube version : ", vYoutube);
				//console.log("<li class=\"yt-shelf-grid-item\">"+list_vedio[0].il +"</li>");

				ObjInsertModel= $($(Obj).toArray()[0]).clone();
				
				if(vYoutube == 1){
					// 新版本,模板缺少关键字, 需要补充
					// 补充视频时长
					$(ObjInsertModel).find("#overlays").prepend(sLastTime);
				}
				// $(Obj).each(function (index) {
				// 	if (index == 0) {
				// 		ObjInsertModel = $(this).clone();
				// 		//console.log(ObjInsertModel);
				// 	}
		
				// });
				
				
				// 准备插入
				let indexBegin = 0;
				for (let i = 0; i < list_vedio.length; i++) {
					let haveLoaded = false;
					$(Obj).each(function (index) {
						if (index >= indexBegin && !haveLoaded ) {
							// console.log(i,index);
							//$(convertSearchToFeed(ObjInsertModel, list_vedio[13])).insertAfter($(this));
							// 输出订阅列表时间
							//let vInfo = new infoVideo();
							vInfo = getFeedVideoInfo(this, vYoutube); // 没有title和videoUrl
							if(vInfo.upTime < list_vedio[i].upTime){
								// console.log(i,index);

								ObjIn = $(convertSearchToFeed(ObjInsertModel, list_vedio[i], vYoutube));
								// console.log($(ObjIn).html());
								
								$(ObjIn).attr("insert","insert");
								$(ObjIn).css("border", "1px dashed #4CAF50"); //outline: #4CAF50 solid 10px;
								//$(ObjIn).css("outline", "#4CAF50 solid 5px"); 
								
								array_insertObj.push($(ObjIn).html());
								$(ObjIn).insertBefore($(this));
								// console.log($(ObjIn).find("a#thumbnail").attr("href"));
								
								// indexArray.push(index);
								indexBegin = indexBegin + 1;
								haveLoaded = true;
							}
							//vInfo.show();
						}

					});
				}
				
				// 插入结束后,在页面做标记
				markLoaded = "<div id=\"insertYtse\"></div>"
				$("#content").append( $(markLoaded ) );
				//console.log(list_vedio[13].il);
				

				// 对于新版本Youtube会抹除掉视频信息. 用延时多次写入避免该问题
				if(vYoutube == 1){
					let iSecond = 0;
					setTimeout(() => {
						console.log("start second");
						Obj = $("div#items").children();
						$(Obj).each(function (index) {
							
							if($(this).attr("insert") == "insert"){
								// 一步一步替换
								//虽然全部替换，但是只有题目加载出来了
								
								$(this).find("#dismissable").remove();
								$(this).prepend($(array_insertObj[iSecond]).toArray()[0]);

								// console.log($($(array_insertObj[iSecond]).toArray()[0]).find("a#thumbnail").attr("href"));
								// $(this).find("div#dismissable").find("a#thumbnail").attr("href","test");
								// console.log($(this).find("div#dismissable").find("a#thumbnail").attr("href"));
								$(this).find("div#dismissable").find("a#thumbnail").attr("href",
									$($(array_insertObj[iSecond]).toArray()[0]).find("a#thumbnail").attr("href"));

								// 替换img
								ObjImgP = $(this).find("img#img").parent();
								$(this).find("img#img").remove();
								$(ObjImgP).prepend(	$($(array_insertObj[iSecond]).toArray()[0]).find("img#img") );

								// 添加时长
								// console.log($($(array_insertObj[iSecond]).toArray()[0])
								// .find("div#overlays").html());
								// $(this).find("div#mouseover-overlay").prepend("<div test=\"test\"></div>");
								// console.log($(this).find("div#mouseover-overlay"));
								// console.log($($(array_insertObj[iSecond]).toArray()[0]).find("div#mouseover-overlay").children());
								$(this).find("div#overlays").prepend(
									$($(array_insertObj[iSecond]).toArray()[0])
									.find("div#overlays").children());
								// $(this).find("div#overlays").prepend($($(array_insertObj[iSecond]).toArray()[0]).find("div#overlays").children());

								// 替换 up
								$(this).find("#byline").remove();
								$(this).find("#byline-container").prepend(
									$($(array_insertObj[iSecond]).toArray()[0])
									.find("#byline"));

								iSecond ++;
							}

						});
						setTimeout(() => {
							console.log("start third");
							let iSecond = 0;
							Obj = $("div#items").children();
							$(Obj).each(function (index) {
								
								if($(this).attr("insert") == "insert"){
									// 一步一步替换
									//虽然全部替换，但是只有题目加载出来了
									$(this).find("div#dismissable").find("a#thumbnail").attr("href", 
										$($(array_insertObj[iSecond]).toArray()[0]).find("a#thumbnail").attr("href"));

									// 替换img
									ObjImgP = $(this).find("img#img").parent();
									$(this).find("img#img").remove();
									$(ObjImgP).prepend(	$($(array_insertObj[iSecond]).toArray()[0]).find("img#img") );	

									// 添加时长
									// $(this).find("div#mouseover-overlay").prepend("<div test=\"test\"></div>");									
									$(this).find("div#overlays").prepend(
										$($(array_insertObj[iSecond]).toArray()[0])
										.find("div#overlays").children());

									$(this).find("span.style-scope.ytd-thumbnail-overlay-time-status-renderer").text(
										$($(array_insertObj[iSecond]).toArray()[0]).find("span.style-scope.ytd-thumbnail-overlay-time-status-renderer").text()
									);
									// $(this).find("div#overlays").prepend($($(array_insertObj[iSecond]).toArray()[0]).find("div#overlays").children());

									
									// 替换 up
									$(this).find("#byline").prepend(
										$($(array_insertObj[iSecond]).toArray()[0])
										.find("#byline").find("a"));
									iSecond ++;
								}
	
							});		
							setTimeout(() => {
								console.log("start 4th");
								let iSecond = 0;
								Obj = $("div#items").children();
								$(Obj).each(function (index) {
									
									if($(this).attr("insert") == "insert"){
	
										// 添加时长
										$(this).find("span.style-scope.ytd-thumbnail-overlay-time-status-renderer").text(
											$($(array_insertObj[iSecond]).toArray()[0]).find("span.style-scope.ytd-thumbnail-overlay-time-status-renderer").text()
										);
										iSecond ++;
									}
		
								});							
							}, 100);
						}, 100);
					}, 100);	
				}
			});
		});
	}
}

Insert(); //新版可以直接加载

// 旧版需要使用监听...
browser.runtime.onMessage.addListener(request => {
  //console.log("Message from the background script:");
  //console.log(request.greeting);
  Insert();
  return Promise.resolve({response: "Hi from content script"});
});

// //接收到消息插入信息

// // $(document).ready(function () {
// $(window).ready(function () {
// 	browser.runtime.onMessage.addListener((request) => {
// 		console.log(request.greeting)
// 		console.log("load video list");
// 		let gettingItem = browser.storage.local.get("list_vedio");
// 		gettingItem.then((Obj) => {
// 			if (isObjEmpty(Obj)) {
// 				return [];
// 			} else {
// 				return (Obj.list_vedio);
// 			}
// 		}).then((list_vedio) => {
// 			console.log("load " + list_vedio.length + " videos");
// 			//$(document).ready(function () {
// 			console.log("ready to load");
// 			Obj = $("div.multirow-shelf").find("ul.shelf-content").find("li.yt-shelf-grid-item");
// 			$(Obj).each(function (index) {
// 				if (index == 0) {
// 					ObjInsertModel = $(this).clone();
// 				}
// 			});
// 			$(Obj).each(function (index) {
// 				if (index == 1) {
// 					$(convertSearchToFeed(ObjInsertModel, list_vedio[0])).insertAfter($(this));
// 				}
// 			});
// 			//});
// 		});
// 		return Promise.resolve({ response: "Hi, from content script" })
// 	})
// });

