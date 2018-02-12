
// 对infoVideo数组中,视频更新顺序进行排序. 从新到旧
function videoMergeSort(array) {  //采用自上而下的递归方法
	var length = array.length;
	if (length < 2) {
		return array;
	}
	var m = (length >> 1),
		left = array.slice(0, m),
		right = array.slice(m); //拆分为两个子数组
	return merge(videoMergeSort(left), videoMergeSort(right));//子数组继续递归拆分,然后再合并
}
function merge(left, right) { //合并两个子数组
	var result = [];
	while (left.length && right.length) {
		var item = left[0].upTime >= right[0].upTime ? left.shift() : right.shift();//注意:判断的条件是小于或等于,如果只是小于,那么排序将不稳定.
		result.push(item);
	}
	return result.concat(left.length ? left : right);
}
//for debug
function popUpNotification(message) {
	browser.notifications.create({
		"type": "basic",
		"title": "Hey boy",
		"message": message
	});
}
//for debug
function checkResponse(xhr) {
	// console.log(xhr.response)
	// console.log(xhr.getResponseHeader("Content-Type"))
	let blobFile = new Blob([xhr.response], { type: "text/html;charset=UTF-8" })
	// var blobFile = new Blob([xmlHttp.response], { type: "text/plain;charset=UTF-8" })
	let blobUrl = URL.createObjectURL(blobFile)
	let creating = browser.tabs.create({
		url: blobUrl
	})
}
// 根据关键字列表索取youtube页面
function searchListOnline(list) {
	let url;
	let url_list;
	let list_p = new Array(list.length);
	for (let i = 0; i < list.length; i++) {
		if (list[i].self.join() != "") {
			if (list[i].channel != "") {
				if (list[i].channelUrl != "") {
					url = "https://www.youtube.com" + list[i].channelUrl + "/search?sp=CAISAhAB&query=" + removeNCharInArray(list[i].self).join(' ');
					list_p[i] = asynHttpRequestDelay("GET", url);
				} else {
					list_p[i] = "";
				}
			} else {
				url = "https://www.youtube.com/results?sp=CAI%253D&search_query=" + removeNCharInArray(list[i].self).join(' ');
				list_p[i] = asynHttpRequestDelay("GET", url);
			}
		} else if (list[i].playList != "") {
			if (list[i].channel != "") {
				if (list[i].channelUrl != "") {
					url = "https://www.youtube.com" + list[i].channelUrl + "/search?sp=CAISAhAB&query=" + removeNChar(list[i].playList);
					list_p[i] = asynHttpRequestDelay("GET", url);
				} else {
					list_p[i] = "";
				}
			} else {
				url = "https://www.youtube.com/results?sp=EgIQAw%253D%253D&search_query=" + removeNChar(list[i].playList);
				list_p[i] = asynHttpRequestDelay("GET", url);
			}
		} else {
			url = "https://www.youtube.com/results?sp=EgIQAg%253D%253D&search_query=" + removeNChar(list[i].channel);
			list_p[i] = asynHttpRequestDelay("GET", url);
		}
		// UI输出
		list_p[i].then(() => {
			let max_strOut = 10;
			let strOut = "searching : ";
			// browser.runtime.sendMessage({ debugOutput: "searching" })
			if (list[i].self.join(' ').length + list[i].playList.length > max_strOut) {
				strOut += (list[i].self.join(' ') + list[i].playList).substring(0, max_strOut) + "...";
			} else {
				strOut += (list[i].self.join(' ') + list[i].playList);
			}
			strOut += " ";
			if (list[i].channel.length > max_strOut) {
				strOut += list[i].channel.substring(0, max_strOut) + "..."
			} else {
				strOut += list[i].channel
			}
			browser.runtime.sendMessage({ debugOutput: strOut })
		})
	}
	return Promise.all(list_p);
}

// 根据关键字列表索取youtube页面
function searchPlayListOnline(list) {
	let url
	let url_list
	let list_playList = new Array(list.length);
	for (let i = 0; i < list.length; i++) {
		if (list[i].self.join() != "") {
			// 对keyword查询
			if (list[i].channel != "") {
				if (list[i].channelUrl != "") {
					list_playList[i] = ""
				} else {
					// 需要更新channel信息
					list_playList[i] = ""
				}
			} else {
				list_playList[i] = ""
			}
		} else if (list[i].list != "") {
			// 对list进行查询
			url_list = "https://www.youtube.com" + list[i].playListUrl;
			list_playList[i] = asynHttpRequestDelay("GET", url_list);
		} else {
			// 只含有channel信息,返回空
			list_playList[i] = ""
		}
	}
	return Promise.all(list_playList);
}

function removeNCharInArray(strArray) {
	let result = new Array(strArray.length)
	for (let i = 0; i < strArray.length; i++) {
		result[i] = removeNChar(strArray[i])
	}
	return result
}

//移除youtube不识别的字符
function removeNChar(str) {
	var result = "";
	//console.log(str.length);
	for (var i = 0; i < str.length; i++) {
		//console.log(str[i],str.charCodeAt(i));
		if (str.charCodeAt(i) == 12298) { //《
			result += " "; //String.fromCharCode(str.charCodeAt(i)-12256);
		} else if (str.charCodeAt(i) == 12299) { //》
			result += " "; //String.fromCharCode(str.charCodeAt(i)-12256);
		} else if (str.charCodeAt(i) == 35) {  //#
			result += "%23"; //String.fromCharCode(str.charCodeAt(i)-12256);
		} else {
			result += String.fromCharCode(str.charCodeAt(i));
		}
	}
	return result;
}

// 获得频道信息
function getChannelInfo(il_video) {
	/*\ 
	|| 
	\*/
	// 不是列表
	channelObj = $(il_video).find("a.yt-uix-tile-link.yt-ui-ellipsis.yt-ui-ellipsis-2.yt-uix-sessionlink.spf-link");
	var channelName = $(channelObj).text();
	// console.log(channelName)
	var channelUrl = $(channelObj).attr("href");

	//获取时长,和封面
	coverObj = $(il_video).find("a.yt-uix-sessionlink.spf-link").find("div.yt-thumb.video-thumb").find("span.yt-thumb-simple");

	var coverUrl_onload = $(coverObj).find("img").attr("data-thumb");
	if (coverUrl_onload === undefined) {
		var coverUrl = $(coverObj).find("img").attr("src");
	} else {
		var coverUrl = coverUrl_onload;
	}
	var tNow = new Date();
	uptimeStr = tNow.valueOf();
	vInfo = new infoVideo($(il_video).html(), "", "", coverUrl, "", channelName, channelUrl, "", tNow);
	return vInfo;
}

// 获得播放列表信息
function getPlayListInfo(il_video) {
	/*\ 
	|| 
	\*/

	titleObj = $(il_video).find("a.yt-uix-tile-link.yt-ui-ellipsis.yt-ui-ellipsis-2.yt-uix-sessionlink.spf-link");
	var title = $(titleObj).text();
	var coverUrl_onload = $(il_video).find("img").attr("data-thumb");
	if (coverUrl_onload === undefined) {
		var coverUrl = $(il_video).find("img").attr("src");
	} else {
		var coverUrl = coverUrl_onload;
	}
	var videoTime = $(il_video).find("span.video-time").text();
	// 获取频道信息
	channelObj = $(il_video).find("div.yt-lockup-content").find("div.yt-lockup-byline").find("a.yt-uix-sessionlink.spf-link");
	var channelName = $(channelObj).text();
	var channelUrl = $(channelObj).attr("href");
	// 获取更新时间
	timeObj = $(il_video).find("div.yt-lockup-content").find("div.yt-lockup-meta").find("ul.yt-lockup-meta-info");
	var tNow = new Date();
	let updateTime
	if ($(timeObj).find("li").toArray().length == 2) {
		uptimeli = $(timeObj).find("li").toArray()[0];
		updateTime = $(uptimeli).text()
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
	listUrlObj = $(il_video).find("div.yt-lockup-content").find("div.yt-lockup-meta").find("a.yt-uix-sessionlink.spf-link");
	var videoUrl = $(listUrlObj).attr("href");
	vInfo = new infoVideo($(il_video).html(), title, videoUrl, coverUrl, videoTime, channelName, channelUrl, uptimeStr, new Date());
	return vInfo;
}

// PlayList更新时间无法在搜索界面找到,只能在主页看到
function updatePlayListInfo(vInfo, ListPage) {
	var Zhtime1 = "最后更新时间：";
	var Zhtime2 = "更新";
	var Zhtime3 = "今日更新"
	var Zhftime1 = "上次更新時間：";
	var Zhftime2 = "更新";
	var Entime1 = "Last updated on ";
	var Entime2 = "Updated";
	var Entime3 = "Updated today"
	// 获取更新时间
	uptimeObj = $(ListPage).find("div.pl-header-content").find("ul.pl-header-details").find("li").toArray()[3];
	var uptimeStr = $(uptimeObj).text();
	vInfo.updateTime = uptimeStr
	if (uptimeStr.includes(Zhftime1)) {
		// 繁体中文 "上次更新時間：xxxx年xx月xx日"
		var timeStr = uptimeStr.substring(Zhftime1.length);
		vInfo.upTime = convertAbTime2Int(timeStr);
	} else if (uptimeStr.includes(Zhtime1)) {
		// 中文 "最后更新时间：xxxx年xx月xx日"
		var timeStr = uptimeStr.substring(Zhtime1.length);
		//console.log(timeStr);
		vInfo.upTime = convertAbTime2Int(timeStr);
	} else if (uptimeStr.includes(Zhtime2)) {
		// 中文 "几天前更新"
		var timeStr = uptimeStr.substring(0, uptimeStr.length - Zhtime2.length);
		var tNow = new Date();
		vInfo.upTime = convertReTime2Int(timeStr) + tNow.valueOf();;
	} else if (uptimeStr.includes(Entime1)) {
		// 英文 Last updated on Jul xx,xxxx
		var timeStr = uptimeStr.substring(Entime1.length);
		vInfo.upTime = convertAbTime2Int(timeStr);
	} else if (uptimeStr.includes(Entime2)) {
		// 英文 Updated xx days ago
		var timeStr = uptimeStr.substring(Entime2.length);
		var tNow = new Date();
		vInfo.upTime = convertReTime2Int(timeStr) + tNow.valueOf();
	} else {
		// 其他语言,没法分析
		// 或者为空
		var tNow = new Date();
		vInfo.upTime = tNow.valueOf();
	}
}

// 针对channel的查找页过滤 仅限initial使用
function filterChannelSearch(list_Keyword, list_SearchResults) {
	/*\ 
	|| 根据关键字过滤搜索页
	\*/
	let list_vInfo = new Array();
	if (list_SearchResults.length != list_Keyword.length) {
		//长度不等
		return;
	}
	for (let i = 0; i < list_SearchResults.length; i++) {
		doc = $($(list_SearchResults[i]))
		if (list_Keyword[i].channel == '') {
		} else {
			// 在频道搜索
			doc.find('ol.item-section').children().each(function (index) {
				vInfo = getChannelInfo(this);
				if (vInfo.channelName == list_Keyword[i].channel) {
					list_vInfo.push(vInfo);
				} else {
				}
			});
			if (list_vInfo.length == 0) {
				vInfo = getChannelInfo(doc.find('ol.item-section').children()[0])
				list_vInfo.push(vInfo);
			}
		}
	}
	return list_vInfo;
}

//过滤播放列表 仅限initial使用
function filterPlayListSearch(list_Keyword, list_SearchResults) {
	/*\ 
	|| 根据关键字过滤搜索页
	\*/
	let list_vInfo = new Array();
	if (list_SearchResults.length != list_Keyword.length) {
		//长度不等
		return;
	}
	for (let i = 0; i < list_SearchResults.length; i++) {
		doc = $($(list_SearchResults[i]))
		if (list_Keyword[i].playList == "") {
			if (list_Keyword[i].channel == '') {
				doc.find('[id*=item-section-]').children().each(function (index) {
					vInfo = getVideoInfo(this);
					if (satisfyKeyWord(list_Keyword[i], vInfo)) {
						list_vInfo.push(vInfo);
					} else {
					}
				});
			} else {
				// 在频道搜索
				doc.find('li.feed-item-container.yt-section-hover-container.browse-list-item-container.branded-page-box').each(function (index) {
					vInfo = getVideoInfo(this);
					if (satisfyKeyWord(list_Keyword[i], vInfo)) {
						list_vInfo.push(vInfo);
					} else {
					}
				});
			}
		} else {
			// playlist不为空
			if (list_Keyword[i].channel == '') {
				doc.find('[id*=item-section-]').children().each(function (index) {
					vInfo = getPlayListInfo(this);
					if (satisfyKeyWord(list_Keyword[i], vInfo)) {
						list_vInfo.push(vInfo);
					} else {
					}
				});
			} else {
				// 在频道搜索
				doc.find('li.feed-item-container.yt-section-hover-container.browse-list-item-container.branded-page-box').each(function (index) {
					vInfo = getPlayListInfo(this);
					if (satisfyKeyWord(list_Keyword[i], vInfo)) {
						list_vInfo.push(vInfo);
					} else {
					}
				});
			}
			if (list_vInfo.length == 0) {
				//强行用第一个作为list
				if (list_Keyword[i].channel == '') {
					vInfo = getPlayListInfo(doc.find('[id*=item-section-]').children()[0]);
					list_vInfo.push(vInfo);
				}else{
					doc.find('li.feed-item-container.yt-section-hover-container.browse-list-item-container.branded-page-box').each(function (index) {
						if(list_vInfo.length < 1){
							vInfo = getPlayListInfo(this);
							if(vInfo.videoUrl.includes("/playlist?list="))
							list_vInfo.push(vInfo);
						}
					})
				}
			}
		}
	}
	return list_vInfo;
}

// 在添加关键字后查找channel或list对应的Url
function initialUrl(key_word) {
	return new Promise((resolve, reject) => {
		// class赋值 直接 key_word_local=key_word 是指针, 两个变量指向一个地址
		let key_word_local = new keyWord(key_word.self, key_word.channel, key_word.playList);
		console.log("----查找URL------");
		let vedio = new Array();
		if (key_word.channel != "") {
			key_word_local.self = [""];
			key_word_local.playList = "";
			if (key_word.channelUrl != "") {
				key_word_local.channelUrl = key_word.channelUrl
				console.log("channel url 已存在");
				console.log("-------------->");
				if (key_word.playList != "") {
					console.log("start initialize playlist");
					vedio = [];
					key_word_local.playList = key_word.playList;
					if(key_word.playListUrl != ""){
						console.log("playlist url 已存在");
						console.log("-------------->");
						resolve(key_word)
					}else{
						searchListOnline([key_word_local]).then((list_SearchResults) => {
							if (key_word.playList != "" && key_word.playListUrl == "") {
								console.log("查找play list");
								vedio.push.apply(vedio, filterPlayListSearch([key_word_local], list_SearchResults));
							}
							if (vedio.length > 0) {
								// 我们只用查找出来第一个的
								if (key_word.playList != "" && key_word.playListUrl == "") {
									key_word.playListUrl = vedio[0].videoUrl;
									key_word.playList = vedio[0].title;
									console.log("找到play list");
								}
								console.log("-------------->");
								resolve(key_word)
							} else {
								//没有查找到list
								console.log("没有找到Url");
								key_word.onOff = false
								resolve(key_word)
								reject("error when initializing " + key_word.self)
							}
						}).catch((error) => {
							// 未知错误
							console.log(error)
							browser.runtime.sendMessage({ debugOutput: "error when checking channel url" })
							key_word.onOff = false
							resolve(key_word)
							reject("error when initializing " + key_word.self)
						});
					}
				}else{
					resolve(key_word)
				}
			} else {
				searchListOnline([key_word_local]).then((list_SearchResults) => {
					return new Promise((reso, reje) => {
						if (key_word.channel != "" && key_word.channelUrl == "") {
							console.log("查找channel");
							vedio.push.apply(vedio, filterChannelSearch([key_word_local], list_SearchResults));
						}
						if (vedio.length > 0) {
							if (key_word.channel != "" && key_word.channelUrl == "") {

								key_word.channel = vedio[0].channelName;
								key_word.channelUrl = vedio[0].channelUrl;

								key_word_local.channel = key_word.channel
								key_word_local.channelUrl = key_word.channelUrl
								console.log("找到Channel");
							}
							console.log("-------------->");
							console.log("return")
							reso(0)
						} else {
							//没有查找到list
							console.log("没有找到Url");
							key_word.onOff = false
							reso(0)
						}
					})
				}).then(() => {
					if (key_word.playList != "") {
						console.log("start initialize playlist");
						vedio = [];
						key_word_local.playList = key_word.playList;
						if(key_word.playListUrl != ""){
							console.log("playlist url 已存在");
							console.log("-------------->");
							resolve(key_word)
						}else{
							searchListOnline([key_word_local]).then((list_SearchResults) => {
								if (key_word.playList != "" && key_word.playListUrl == "") {
									console.log("查找play list");
									vedio.push.apply(vedio, filterPlayListSearch([key_word_local], list_SearchResults));
								}
								if (vedio.length > 0) {
									// 我们只用查找出来第一个的
									if (key_word.playList != "" && key_word.playListUrl == "") {
										key_word.playListUrl = vedio[0].videoUrl;
										key_word.playList = vedio[0].title;
										console.log("找到play list");
									}
									console.log("-------------->");
									resolve(key_word)
								} else {
									//没有查找到list
									console.log("没有找到Url");
									key_word.onOff = false
									resolve(key_word)
									reject("error when initializing " + key_word.self)
								}
							}).catch((error) => {
								// 未知错误
								console.log(error)
								browser.runtime.sendMessage({ debugOutput: "error when checking channel url" })
								key_word.onOff = false
								resolve(key_word)
								reject("error when initializing " + key_word.self)
							});
						}
					}else{
						resolve(key_word)
					}
				})
			}
		} else if (key_word.self.join() != "") {
			// 不需要查找url
			console.log("不需要初始化url");
			resolve(key_word)
		}else if (key_word.playList != "") {
			vedio = [];
			key_word_local.playList = key_word.playList;
			if(key_word.playListUrl != ""){
				console.log("playlist url 已存在");
				console.log("-------------->");
				resolve(key_word)
			}else{
				searchListOnline([key_word_local]).then((list_SearchResults) => {
					if (key_word.playList != "" && key_word.playListUrl == "") {
						console.log("查找play list");
						vedio.push.apply(vedio, filterPlayListSearch([key_word_local], list_SearchResults));
					}
					if (vedio.length > 0) {
						// 我们只用查找出来第一个的
						if (key_word.playList != "" && key_word.playListUrl == "") {
							key_word.channel = vedio[0].channelName;
							key_word.channelUrl = vedio[0].channelUrl;
							key_word.playListUrl = vedio[0].videoUrl;
							key_word.playList = vedio[0].title;
							console.log("找到play list");
						}
						console.log("-------------->");

						resolve(key_word)

					} else {
						//没有查找到list
						console.log("没有找到Url");
						key_word.onOff = false
						resolve(key_word)
						reject("error when initializing " + key_word.self)
					}
					
				}).catch((error) => {
					// 未知错误
					console.log(error)
					browser.runtime.sendMessage({ debugOutput: "error when checking channel url" })
					key_word.onOff = false
					resolve(key_word)
					reject("error when initializing " + key_word.self)

				});
			}
		} else {
			console.log("empty Playlist or channel name")
			key_word.onOff = false
			resolve(key_word)
			reject("error when initializing empty keyword")
		}
		console.log("-------------->");
	})
}

// 查找关键词对应的视频
function updateSearchList(list_KeyWord) {
	// 筛选出符合关键词的视频
	browser.runtime.sendMessage({ debugOutput: "updating..." })
	let list_vedio = new Array();
	let list_KeyWord_local = new Array();
	
	for (let i = 0; i < list_KeyWord.length; i++){

		if(list_KeyWord[i].channel != "" && list_KeyWord[i].channelUrl != ""){
			if(list_KeyWord[i].playList != "" && list_KeyWord[i].playListUrl!= ""){
				list_KeyWord_local.push(list_KeyWord[i]);
			}else if(list_KeyWord[i].playList == ""){
				if(list_KeyWord[i].self.join('') != ""){
					list_KeyWord_local.push(list_KeyWord[i]);
				}
				
			}
		}else if(list_KeyWord[i].channel == ""){
			if(list_KeyWord[i].playList != "" ){
				//playlist一定会有channel
			}else if(list_KeyWord[i].playList == ""){
				if(list_KeyWord[i].self.join('') != ""){
					list_KeyWord_local.push(list_KeyWord[i]);
				}
			}
		}

	}
	searchListOnline(list_KeyWord_local).then((list_SearchResults) => {
		list_vedio.push.apply(list_vedio, filterSearch(list_KeyWord_local, list_SearchResults));
		return searchPlayListOnline(list_KeyWord_local);
	}).then((list_Playlistmainpage) => {
		browser.runtime.sendMessage({ debugOutput: "got " + list_vedio.length + " video(s)" })
		// 或得playList更新时间
		for (let i = 0; i < list_KeyWord_local.length; i++) {
			if (list_KeyWord_local[i].playList != "") {
				for (let j = 0; j < list_vedio.length; j++) {
					if (list_KeyWord_local[i].channel == list_vedio[j].channelName && list_KeyWord[i].playList == list_vedio[j].title) {
						updatePlayListInfo(list_vedio[j], list_Playlistmainpage[i]);
					}
				}
			}
		}
		list_vedio = videoMergeSort(list_vedio);
		let storageVideo = browser.storage.local.set({ list_vedio });
		storageVideo.then(() => {
			browser.runtime.sendMessage({ updateComplete: "update complete" })
		})
	});
}

function updateActivatedList() {
	browser.storage.local.get("list_KeyWord").then((o) => {
		let activatedList = new Array()
		for (let i = 0; i < o.list_KeyWord.length; i++) {
			if (o.list_KeyWord[i].onOff) {
				activatedList.push(o.list_KeyWord[i])
			}
		}
		updateSearchList(activatedList)
	})
}


//======================================================START FROM HERE===============================
// 关键词储存在对象里
// 对象KeyWord
// word 储存关键字, 空为不指定
// channel 储存所属频道, 空为不指定
// list 储存关键字所属列表, 空为不指定
// word channel list 三个变量不能同时为零

// 储存关键词
// 关键词对应的搜索页面

numOfQueueHttp = 0;

// 自动更新视频列表
function initialAllUrl() {
	browser.storage.local.get("list_KeyWord").then((o) => {
		let listPromise = new Array()
		if (o.list_KeyWord !== undefined) {
			for (let i = 0; i < o.list_KeyWord.length; i++) {
				// searchChannelNum(list_KeyWord[i]);
				if (o.list_KeyWord[i].onOff) {
					listPromise.push(initialUrl(o.list_KeyWord[i]))
				}
			}
			Promise.all(listPromise).then((list) => {
				browser.storage.local.set({ list_KeyWord: o.list_KeyWord })
				browser.runtime.sendMessage({ debugOutput: "finish initialization" })
			})
		}
	})
}


function updateSearchListIterator(timeGap) {
	// 如果list_KeyWord更新了,这里list_KeyWord是否也会更新?
	browser.storage.local.get("list_KeyWord").then((o) => {

		if (o.list_KeyWord !== undefined) {
			let activatedList = new Array()
			for (let i = 0; i < o.list_KeyWord.length; i++) {
				if (o.list_KeyWord[i].onOff) {
					activatedList.push(o.list_KeyWord[i])
				}
			}
			updateSearchList(activatedList);
		}
	})
	setTimeout(() => { updateSearchListIterator(timeGap) }, timeGap)

}

initialAllUrl()
let timeGap = 60 * 60 * 1000; // 60 min
setTimeout(() => {
	updateSearchListIterator(timeGap);
}, 50 * 1000); //浏览器启动50秒后再执行


function handleTabUpdate(tabId, changeInfo, tabInfo) {
	if (String(changeInfo.url).includes("https://www.youtube.com/feed/subscriptions")) {
		browser.tabs.query({
			url: "*://*.youtube.com/feed/subscription*"
		}).then((tabs) => {
			for (let tab of tabs) {
				browser.tabs.reload(tab.Id)
			}
			browser.tabs.onUpdated.removeListener(handleTabUpdate)

			setTimeout(() => { browser.tabs.onUpdated.addListener(handleTabUpdate) }, 30000)

		}).catch((error) => { console.log(`Error:${error}`) })
	}
}

function sendMessageToTabs(tabs) {
	for (let tab of tabs) {
		browser.tabs.sendMessage(
			tab.id,
			{ greeting: "Hi from background script" }
		).then(response => {
		}).catch((error) => { console.log(`sendMessageToTabs :${error}`) });
	}
}

function handleTabUpdate(tabId, changeInfo, tabInfo) {
	if (String(changeInfo.url).includes("https://www.youtube.com/feed/subscriptions")) {
		browser.tabs.query({
			active: true,
			lastFocusedWindow: true,
			url: "*://*.youtube.com/feed/subscription*"
		}).then((tabs) => {
			sendMessageToTabs(tabs);
		}).catch((error) => { console.log(`browser.tabs.query :${error}`) })
	}
}
browser.tabs.onUpdated.addListener(handleTabUpdate);


browser.browserAction.onClicked.addListener(() => {
	browser.storage.local.get("list_KeyWord").then((o) => {
		if (o.list_KeyWord !== undefined) {
			updateSearchList(o.list_KeyWord);
		}
	})
})

browser.runtime.onMessage.addListener((ms) => {
	if (ms.idxToBeInit !== undefined) {
		browser.storage.local.get("list_KeyWord").then((o) => {
			initialUrl(o.list_KeyWord[ms.idxToBeInit]).then((initializedKeyword) => {
				o.list_KeyWord[ms.idxToBeInit] = initializedKeyword
				browser.storage.local.set({ list_KeyWord: o.list_KeyWord })
				browser.runtime.sendMessage({ debugOutput: "finish initialization" })
			})
		})
	} else if (ms.topFewToBeInit !== undefined) {
		browser.storage.local.get("list_KeyWord").then((o) => {
			let promiseArray = new Array()
			for (let i = 0; i < ms.topFewToBeInit; i++) {
				if (o.list_KeyWord[i].onOff) {
					promiseArray.push(initialUrl(o.list_KeyWord[i]))
				}
			}
			Promise.all(promiseArray).then((list) => {
				browser.storage.local.set({ list_KeyWord: o.list_KeyWord })
				browser.runtime.sendMessage({ debugOutput: "finish initialization" })
			})
		})
	} else if (ms.bottomFewToBeInit !== undefined) {
		browser.storage.local.get("list_KeyWord").then((o) => {
			let promiseArray = new Array()
			for (let i = 0; i < ms.bottomFewToBeInit; i++) {
				if (o.list_KeyWord[o.list_KeyWord.length - 1 - i].onOff) {
					promiseArray.push(initialUrl(o.list_KeyWord[o.list_KeyWord.length - 1 - i]))
				}
			}
			Promise.all(promiseArray).then((list) => {
				browser.storage.local.set({ list_KeyWord: o.list_KeyWord })
				browser.runtime.sendMessage({ debugOutput: "finish initialization" })
			})
		})
	} else if (ms.updateAll == true) {
		browser.storage.local.get("list_KeyWord").then((o) => {
			updateActivatedList()
		})
	}
})
