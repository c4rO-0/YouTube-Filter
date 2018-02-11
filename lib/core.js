
//-----------------------------CLASS DEFINITION--------------------------------
class keyWord {
    constructor(keyWord = [""], channel = "", playList = "") {
		/*\ 
		|| youtube含有两种youtuber 1. channel 2. user
		|| 这两种youtuber在主页url的区别是 
		|| - 1. youtube.com/channel/....
		|| - 2. youtube.com/user/....
		|| 在这里我们不明确的区分这两种youtuber,统一用'channle'来储存名字
		|| channelUrl里储存user/,channel/ 关键字
		\*/
        this.self = keyWord
        this.channel = channel
        this.channelUrl = ''
        this.playList = playList
        this.playListUrl = ''
        this.onOff = true
    };

    show() {
        console.log("------->");
        console.log("keyword : " + this.self);
        console.log("channel : " + this.channel);
        console.log("channelUrl : " + this.channelUrl);
        console.log("playList : " + this.playList);
        console.log("playListUrl : " + this.playListUrl);
        console.log("<-------");
        return;
    };

    clone(target) {
        target.self = this.self;
        target.channel = this.channel;
        target.channelUrl = this.channelUrl;
        target.playList = this.playList;
        target.playListUrl = this.playListUrl;
    }

}

class infoVideo {
    constructor(il = "", title = "", videoUrl = "", coverUrl = "", videoTime = "", channelName = "", channelUrl = "", upTime = "", time = "", updateTime = "") {
		/*\ 
		|| 用来储存视频信息
		\*/
        //il储存原始html信息
        this.il = il;

        this.title = title;
        this.videoUrl = videoUrl; // 对于列表, 该地址是列表地址. 不是播放地址

        //获取时长,和封面
        this.coverUrl = coverUrl;
        this.videoTime = videoTime;

        // 获取频道信息
        this.channelName = channelName;
        this.channelUrl = channelUrl;

        this.upTime = upTime;

        this.time = time;  // 查询词条的当前时间
        this.updateTime = updateTime
    };


    show() {

        console.log("title : ", this.title);
        console.log("video Url : ", this.videoUrl);
        console.log("cover : ", this.coverUrl);
        console.log("last time : ", this.videoTime);
        console.log("channel : ", this.channelName);
        console.log("channel url : ", this.channelUrl);
        console.log("uptime : ", this.upTime);
        console.log("time : ", this.time);
        console.log("updateTime : ", this.updateTime)
        return;

    };

    clone(target) {
        target.il = this.il;

        target.title = this.title;
        target.videoUrl = this.videoUrl;

        //获取时长,和封面
        target.overUrl = this.coverUrl;
        target.videoTime = this.videoTime;

        // 获取频道信息
        target.channelName = this.channelName;
        target.channelUrl = this.channelUrl;

        target.upTime = this.upTime;

        target.time = this.time;  // 查询词条的当前时间
        //target.time =  Object.assign({}, this.time);
        target.updateTime = this.updateTime
    }

}

// class HttpRequest{
//     constructor(method = "",url = "") {
// 		/*\ 
// 		|| 储存Http Request, 方便储存
// 		\*/
//         this.method = method;
//         this.url = url;

//     };    
// }

//=============================global variations==================
// let queueHttp = new Array();
let numOfQueueHttp; // 初始化放在background中


//-------------------------FUNCTION DEFINITION---------------------------------
//promise based asynchronous xmlHttpRequest
function asynHttpRequest(method, url) {

    return new Promise((resolve, reject) => {
        console.log("%c" + "requesting...: " + url, "color:#00ff00")//DEBUG
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.onload = () => {
            // checkResponse(xhr);//DEBUG
            resolve(xhr.response);
        };
        xhr.onerror = () => {
            console.log("error occur while accessing " + url);
            reject("error when http requesting");
        };
        if (method == "POST") {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        };//needed in post mode
        //counter-anit-scraping
        xhr.setRequestHeader('User-Agent', 'Mozilla/5.0 (Windows NT 5.1; rv:37.0) Gecko/20100101 Firefox/37.0');
        xhr.send();
        // popUpNotification("in asyn... request sent");//DEBUG)
    });

}

function asynHttpRequestDelay(method, url) {
    numOfQueueHttp++;
    let timeGap = 1000; //ms
    console.log("Delay request : ", numOfQueueHttp);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            numOfQueueHttp--;

            console.log("%c" + "requesting...: " + url, "color:#00ff00")//DEBUG
            const xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.onload = () => {
                // checkResponse(xhr);//DEBUG
                resolve(xhr.response);
            };
            xhr.onerror = () => {
                console.log("error occur while accessing " + url);
                reject("error when http requesting");
            };
            if (method == "POST") {
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
            };//needed in post mode
            //counter-anit-scraping
            xhr.setRequestHeader('User-Agent', 'Mozilla/5.0 (Windows NT 5.1; rv:37.0) Gecko/20100101 Firefox/37.0');
            xhr.send();
            // popUpNotification("in asyn... request sent");//DEBUG)

        }, numOfQueueHttp * timeGap);
    });
}



// 判断obj是否为空
// 可以用在判断从browser.storage.local.get拿到的obj是否为空
function isObjEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

// convertTime
function convertAbTime2Int(timeStr) {
    /*\ 
    || 将字符串返回的时间,给出整数时间
    || 该函数给出的是绝对时间
    \*/
    //console.log(timeStr);

    list_month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    if (timeStr.includes("年")) {
        // 中文
        var year = parseInt(timeStr.split("年")[0]);
        var month = parseInt(timeStr.split("年")[1].split("月")[0]) - 1;
        var day = parseInt(timeStr.split("年")[1].split("月")[1].split("日")[0]);

        var timeDate = new Date(year, month, day);
        timeDate.setFullYear(year);

        return timeDate.valueOf();
    } else if (list_month.indexOf(timeStr.substring(0, 3)) >= 0) {
        // console.log(list_month)
        var month = list_month.findIndex(function (element) {
            return timeStr.substring(0, 3) == element;
        });

        var day = parseInt(timeStr.substring(4).split(",")[0]);
        var year = parseInt(timeStr.substring(4).split(",")[1]);

        var timeDate = new Date(year, month, day);
        timeDate.setFullYear(year);

        // console.log(year,month,day)
        // console.log(timeDate)
        // console.log(timeDate.valueOf())
        return timeDate.valueOf();
    }
}

function convertReTime2Int(timeStr) {
    /*\ 
    || 将字符串返回的时间,给出整数时间
    || 该函数给出的是相对时间
    \*/

    list_Zh = ["年前", "个月前", "天前", "周前", "小时前", "分钟前"];
    list_En = ["hour ago", "hours ago", "week ago", "weeks ago", "day ago", "days ago", "year ago", "years ago", "minute ago", "minutes ago", "month ago", "months ago"];

    // 曾经直播标志
    var stream_Zh = "直播时间：";
    var stream_Zhf = "曾經串流";
    var stream_En = "Streamed";

    // console.log(timeStr);
    var timeStr_local
    if (timeStr.includes("前") || timeStr.includes("日") || timeStr.includes("天")) {
        if (timeStr.includes(stream_Zh)) {
            timeStr_local = timeStr.substring(stream_Zh.length);
        } else if (timeStr.includes(stream_Zhf)) { //5 小時前曾經串流
            timeStr_local = timeStr.substring(0, timeStr.length - stream_Zhf.length);
        } else {
            timeStr_local = timeStr;
        }
        if (timeStr_local.includes("年前")) {
            var timel = "年前";
            var cont = parseInt(timeStr_local.substring(0, timeStr_local.length - timel.length));
            //console.log(cont);
            return -cont * 31557600000;
        } else if (timeStr_local.includes("个月前")) {
            var timel = "个月前";
            var cont = parseInt(timeStr_local.substring(0, timeStr_local.length - timel.length));
            //console.log(cont);
            return -cont * 2629800000;
        } else if (timeStr_local.includes("個月前")) {
            var timel = "個月前";
            var cont = parseInt(timeStr_local.substring(0, timeStr_local.length - timel.length));
            //console.log(cont);
            return -cont * 2629800000;
        } else if (timeStr_local.includes("天前")) {
            var timel = "天前";
            var cont = parseInt(timeStr_local.substring(0, timeStr_local.length - timel.length));
            //console.log(cont);
            return -cont * 86400000;
        } else if (timeStr_local.includes("周前")) {
            var timel = "周前";
            var cont = parseInt(timeStr_local.substring(0, timeStr_local.length - timel.length));
            //console.log(cont);
            return -cont * 604800016;
        } else if (timeStr_local.includes("週前")) {
            var timel = "週前";
            var cont = parseInt(timeStr_local.substring(0, timeStr_local.length - timel.length));
            //console.log(cont);
            return -cont * 604800016;
        } else if (timeStr_local.includes("小时前")) {
            var timel = "小时前";
            var cont = parseInt(timeStr_local.substring(0, timeStr_local.length - timel.length));
            //console.log(cont);
            return -cont * 3600000;
        } else if (timeStr_local.includes("小時前")) {
            var timel = "小時前";
            var cont = parseInt(timeStr_local.substring(0, timeStr_local.length - timel.length));
            //console.log(cont);
            return -cont * 3600000;
        } else if (timeStr_local.includes("分钟前")) {
            var timel = "分钟前";
            var cont = parseInt(timeStr_local.substring(0, timeStr_local.length - timel.length));
            //console.log(cont);
            return -cont * 60000;
        } else if (timeStr_local.includes("分鐘前")) {
            var timel = "分鐘前";
            var cont = parseInt(timeStr_local.substring(0, timeStr_local.length - timel.length));
            //console.log(cont);
            return -cont * 60000;
        } else if (timeStr_local.includes("秒前")) {
            var timel = "秒前";
            var cont = parseInt(timeStr_local.substring(0, timeStr_local.length - timel.length));
            //console.log(cont);
            return -cont * 1000;
        } else if (timeStr_local.includes("今日")) {
            // console.log("choose : today");
            var timel = "今日";
            var cont = parseInt(timeStr_local.substring(0, timeStr_local.length - timel.length));
            //console.log(cont);
            var cont = 0;
            var dnow = new Date();
            var dtoday = new Date(dnow.getFullYear(), dnow.getMonth(), dnow.getDate());
            // console.log(dtoday,dnow);
            // console.log(dnow.getFullYear(),dnow.getMonth(),dnow.getDate());
            return dtoday.valueOf() - dnow.valueOf();
        } else if (timeStr_local.includes("昨日")) {
            var timel = "昨日";
            var cont = parseInt(timeStr_local.substring(0, timeStr_local.length - timel.length));
            //console.log(cont);
            var cont = 0;
            var dnow = new Date();
            var dtoday = new Date(dnow.getFullYear(), dnow.getMonth(), dnow.getDate());
            return dtoday.valueOf() - dnow.valueOf() - 86400000;
        } else if (timeStr_local.includes("昨天")) {
            var timel = "昨天";
            var cont = parseInt(timeStr_local.substring(0, timeStr_local.length - timel.length));
            //console.log(cont);
            var cont = 0;
            var dnow = new Date();
            var dtoday = new Date(dnow.getFullYear(), dnow.getMonth(), dnow.getDate());
            return dtoday.valueOf() - dnow.valueOf() - 86400000;
        } else {
            // 没有合适的
            console.log("error : no switched time tag : " + timeStr_local);
            return 0;
        }

    } else if (timeStr.includes("ago")) {
        // 英文
        if (timeStr.includes(stream_En)) {
            timeStr_local = timeStr.substring(stream_En.length);
        } else {
            timeStr_local = timeStr;
        }
        if (timeStr_local.includes("year ago")) {
            var timel = "year ago";
            var cont = parseInt(timeStr_local.substring(0, timeStr_local.length - timel.length));
            //console.log(cont);
            return -cont * 31557600000;
        } else if (timeStr_local.includes("years ago")) {
            var timel = "years ago";
            var cont = parseInt(timeStr_local.substring(0, timeStr_local.length - timel.length));
            //console.log(cont);
            return -cont * 31557600000;
        } else if (timeStr_local.includes("month ago")) {
            var timel = "month ago";
            var cont = parseInt(timeStr_local.substring(0, timeStr_local.length - timel.length));
            //console.log(cont);
            return -cont * 2629800000;
        } else if (timeStr_local.includes("months ago")) {
            var timel = "months ago";
            var cont = parseInt(timeStr_local.substring(0, timeStr_local.length - timel.length));
            //console.log(cont);
            return -cont * 2629800000;
        } else if (timeStr_local.includes("day ago")) {
            var timel = "day ago";
            var cont = parseInt(timeStr_local.substring(0, timeStr_local.length - timel.length));
            //console.log(cont);
            return -cont * 86400000;
        } else if (timeStr_local.includes("days ago")) {
            var timel = "days ago";
            var cont = parseInt(timeStr_local.substring(0, timeStr_local.length - timel.length));
            //console.log(cont);
            return -cont * 86400000;
        } else if (timeStr_local.includes("week ago")) {
            var timel = "week ago";
            var cont = parseInt(timeStr_local.substring(0, timeStr_local.length - timel.length));
            //console.log(cont);
            return -cont * 604800016;
        } else if (timeStr_local.includes("weeks ago")) {
            var timel = "weeks ago";
            var cont = parseInt(timeStr_local.substring(0, timeStr_local.length - timel.length));
            //console.log(cont);
            return -cont * 604800016;
        } else if (timeStr_local.includes("hour ago")) {
            var timel = "hour ago";
            var cont = parseInt(timeStr_local.substring(0, timeStr_local.length - timel.length));
            //console.log(cont);
            return -cont * 3600000;
        } else if (timeStr_local.includes("hours ago")) {
            var timel = "hours ago";
            var cont = parseInt(timeStr_local.substring(0, timeStr_local.length - timel.length));
            //console.log(cont);
            return -cont * 3600000;
        } else if (timeStr_local.includes("minute ago")) {
            var timel = "minute ago";
            var cont = parseInt(timeStr_local.substring(0, timeStr_local.length - timel.length));
            //console.log(cont);
            return -cont * 60000;
        } else if (timeStr_local.includes("minutes ago")) {
            var timel = "minutes ago";
            var cont = parseInt(timeStr_local.substring(0, timeStr_local.length - timel.length));
            //console.log(cont);
            return -cont * 60000;
        } else if (timeStr_local.includes("second ago")) {
            var timel = "second ago";
            var cont = parseInt(timeStr_local.substring(0, timeStr_local.length - timel.length));
            //console.log(cont);
            return -cont * 1000;
        } else if (timeStr_local.includes("seconds ago")) {
            var timel = "seconds ago";
            var cont = parseInt(timeStr_local.substring(0, timeStr_local.length - timel.length));
            //console.log(cont);
            return -cont * 1000;
        } else if (timeStr_local.includes("today")) {
            var timel = "today";
            var cont = 0;
            var dnow = new Date();
            var dtoday = new Date(dnow.getFullYear(), dnow.getMonth(), dnow.getDate());
            return dtoday.valueOf() - dnow.valueOf();
        } else if (timeStr_local.includes("yesterday")) {
            var timel = "yesterday";
            var cont = 0;
            var dnow = new Date();
            var dtoday = new Date(dnow.getFullYear(), dnow.getMonth(), dnow.getDate());
            return dtoday.valueOf() - dnow.valueOf() - 86400000;
        } else {
            // 没有合适的
            console.log("error : no switched time tag : " + timeStr_local);
            return 0;
        }
    }
}

// 获得视频信息
function getVideoInfo(il_video) {
    /*\ 
    || 
    \*/
    if ($(il_video).find("ul.yt-lockup-meta.yt-lockup-playlist-items").length > 0) {
        // 在对channel页面进行搜索的时候无法屏蔽列表,所以这里过滤一下是否为列表
        //该条目是列表
        vInfo = new infoVideo(il_video);
        return vInfo;
    } else {
        // 不是列表
        titleObj = $(il_video).find("a.yt-uix-tile-link.yt-ui-ellipsis.yt-ui-ellipsis-2.yt-uix-sessionlink.spf-link");
        var title = $(titleObj).text();
        var videoUrl = $(titleObj).attr("href");

        //获取时长,和封面
        //coverObj = $(il_video).find("a.yt-uix-sessionlink.spf-link").find("div.yt-thumb.video-thumb").find("span.yt-thumb-simple");
        //if(coverObj === undefined){
        //	var coverUrl_onload = $(coverObj).find("img").attr("data-thumb");
        //}else{
        //	var coverUrl_onload = $(coverObj).find("img").attr("data-thumb");
        //	if (coverUrl_onload === undefined) {
        //		var coverUrl = $(coverObj).find("img").attr("src");
        //	} else {
        //		var coverUrl = coverUrl_onload;
        //	}			
        //}
        var coverUrl_onload = $(il_video).find("img").attr("data-thumb");
        if (coverUrl_onload === undefined) {
            var coverUrl = $(il_video).find("img").attr("src");
        } else {
            var coverUrl = coverUrl_onload;
        }

        var videoTime = $(il_video).find("span.video-time").text();
        //console.log(videoTime);
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



        vInfo = new infoVideo($(il_video).html(), title, videoUrl, coverUrl, videoTime, channelName, channelUrl, uptimeStr, tNow, updateTime);

        //vInfo.show();
        return vInfo;

    }

    // vInfo.show();

}

// satisfyKeyWord
// 判断视频是否满足Keyword
function satisfyKeyWord(keyWord, vInfo) {


    satisfied = true;

    // 是否是指定频道
    if (keyWord.channel != '' && vInfo.channelName != keyWord.channel) {
        satisfied = satisfied && false;
        //console.log(vInfo.channelName);
        //console.log(keyWord.channel);
        //console.log('false channel');
        //console.log("--------");
        return satisfied;

    }

    // 是否是指定的list
    if (keyWord.playList != '') {
        if (vInfo.title == keyWord.playList) {
            satisfied = satisfied && true;
            //console.log(vInfo.title);
            return satisfied;
        } else {
            satisfied = satisfied && false;
            //console.log(vInfo.title);
            //console.log('false list');
            return satisfied;
        }
    }

    if (keyWord.self.join().length > 0) {
        // 是否包含key word
        // list_world = keyWord.self.split(',');

        for (let i = 0; i < keyWord.self.length; i++) {
            // satisfied = satisfied && vInfo.title.includes($.trim(keyWord.self[i]));
            satisfied = satisfied && vInfo.title.toLowerCase().includes($.trim(keyWord.self[i].toLowerCase()));
            if (!satisfied) {
                //console.log('+++++++++');
                //console.log(vInfo.title);
                //console.log(list_world[i]);
                return satisfied;
            }
        }
    }
    return satisfied;
}


// 过滤搜索页
function filterSearch(list_Keyword, list_SearchResults) {
	/*\ 
	|| 根据关键字过滤搜索页
	\*/
    let list_vInfo = new Array();
    if (list_SearchResults.length != list_Keyword.length) {
        console.log("-----length neq-----");
        //长度不等
        return;
    }
    for (let i = 0; i < list_SearchResults.length; i++) {
        //console.log( "K : " +  i + '------------');
        // string to Document
        // doc = $.parseHTML(list_SearchResults[i]);
        doc = $($(list_SearchResults[i]))
        if (list_Keyword[i].playList == "") {
            if (list_Keyword[i].channel == '') {
                doc.find('[id*=item-section-]').children().each(function (index) {
                    //console.log("P : " + index + '------------');
                    //console.log(this);

                    vInfo = getVideoInfo(this);
                    // vInfo.show();ssss
                    if (satisfyKeyWord(list_Keyword[i], vInfo)) {
                        // vInfo.show();
                        list_vInfo.push(vInfo);
                    } else {
                        // console.log("not satisfied keyword.");
                    }

                });
            } else {
                // 在频道搜索
                doc.find('li.feed-item-container.yt-section-hover-container.browse-list-item-container.branded-page-box').each(function (index) {
                    // console.log( "P : " + index + '------------');
                    //console.log(this);

                    vInfo = getVideoInfo(this);
                    if (satisfyKeyWord(list_Keyword[i], vInfo)) {
                        // vInfo.show();
                        list_vInfo.push(vInfo);
                    } else {
                        // console.log("not satisfied keyword.");
                    }

                });

            }
        } else {
            // playlist不为空
            
            if (list_Keyword[i].channel == '') {
                doc.find('[id*=item-section-]').children().each(function (index) {
                    // console.log("Pl : " + index + '------------');
                    //console.log(list_Keyword[i].playList);
    
                    vInfo = getPlayListInfo(this);
                    // vInfo.show();
                    if (satisfyKeyWord(list_Keyword[i], vInfo)) {
                        // vInfo.show();
                        list_vInfo.push(vInfo);
                    } else {
                        // console.log("not satisfied keyword.");
                    }
    
                });
            }else{
                // 在频道搜索
                doc.find('li.feed-item-container.yt-section-hover-container.browse-list-item-container.branded-page-box').each(function (index) {
                    // console.log( "P : " + index + '------------');
                    //console.log(this);

                    vInfo = getPlayListInfo(this);
                    if (satisfyKeyWord(list_Keyword[i], vInfo)) {
                        // vInfo.show();
                        list_vInfo.push(vInfo);
                    } else {
                        // console.log("not satisfied keyword.");
                    }

                });

            }

        }

    }

    return list_vInfo;
}

