let browserInfo=getBrowserInfo()
let browserType
if(browserInfo["name"]=="Firefox"){
    browserType=browser;
}else if(browserInfo["name"]=="Chrome"){
    browserType=chrome;
    // browserType.extension.getBackgroundPage().console.log(Number(browserInfo["version"].split(".",1)[0])) 
}else{
	browserType=browser;
}


function handleFile() {
   browserType.extension.getBackgroundPage().console.log("got a file")
   browserType.extension.getBackgroundPage().console.log($("#fileField"))
    let file = $("#fileField")[0]
    // let file =document.getElementById("fileField").files[0]
   browserType.extension.getBackgroundPage().console.log(file.files[0])
    let reader = new FileReader()
    reader.readAsText(file.files[0])
    reader.onload = (myFile) => {
        //browserType.extension.getBackgroundPage().console.log(myFile.target.result)
        let ob = JSON.parse(myFile.target.result)
       browserType.extension.getBackgroundPage().console.log(ob[1])
    }
}

function htmlSnippet(videoInfo) {
    return '\
    <div class="row">\
        <div class="col">\
            <div class="dismissable">\
                <span class="thumbnail">\
                    <a href="https://www.youtube.com' + videoInfo.videoUrl + '" target=\'_newtab\'>\
                        <div>\
                            <img class="img-shadow" src="' + videoInfo.coverUrl + '"\
                            width="168">\
                        </div>\
                    </a>\
                </span>\
                <a href="https://www.youtube.com' + videoInfo.videoUrl + '" target=\'_newtab\'>\
                    <h3>\
                        <span class="video-title">' + videoInfo.title + '</span>\
                    </h3>\
                    <div class="metadata">\
                        <div class="byline">' + videoInfo.channelName + '</div>\
                        <div class="metadate-line">' + videoInfo.videoTime + '</div>\
                        <div class="metadate-line">' + videoInfo.updateTime + '</div>\
                    </div>\
                </a>\
            </div>\
        </div>\
    </div>'
}

function debugHtmlSnippet(debugOutput) {
    return debugOutput + "<br>"
}

function output(htmlString){
    if ($("span").hasClass("thumbnail")) {
        $(".videoList").empty()
        $(".videoList").append(htmlString)
       browserType.extension.getBackgroundPage().console.log("clean up and append")
    } else {
        $(".videoList").append(htmlString)
       browserType.extension.getBackgroundPage().console.log("directly append")
    }
}

function handleReload() {
   browserType.extension.getBackgroundPage().console.log("reloading...")
    output(debugHtmlSnippet("reloading..."))
    storageLocalGet("list_vedio").then((o) => {
        if (o.list_vedio !== undefined && o.list_vedio.length > 0) {
            $(".videoList").empty()
            for (let i = 0; i < o.list_vedio.length; i++) {
                $(".videoList").append(htmlSnippet(o.list_vedio[i]))
            }
        }else{
            output(debugHtmlSnippet("no video found"))
        }
    })
}
$(document).ready(function () {

    // 判断版本
    if(Number(browserInfo["version"].split(".",1)[0]) > 62){
        // 版本符合
        // browserType.extension.getBackgroundPage().console.log($("#version-warning").text())
        
    }else{
        // 版本过低
        $("#version-warning").text("Please update your Chrome. We need version > 62. Current version:"+browserInfo["version"])
    }

    $("#settings").on("click", function () {
        browserType.runtime.openOptionsPage()
    })
    $("#update").on("click", function () {
        browserType.extension.getBackgroundPage().console.log("click update")
        browserType.extension.getBackgroundPage().console.log($(".videoList").attr("status"));
        if($(".videoList").attr("status") == "updated"){

            $(".videoList").attr("status","updating");

            if ($("span").hasClass("thumbnail")) {
                $(".videoList").empty()
            }
            runtimeSendMessage({ updateAll: true })
            browserType.runtime.onMessage.addListener((ms) => {
                if (ms.updateComplete !== undefined) {
                    $(".videoList").attr("status","updated");
                }                
            })
        }
    })
    // $("#reload").on("click", handleReload)
    handleReload()
    browserType.runtime.onMessage.addListener((ms) => {
        //browserType.extension.getBackgroundPage().console.log(ms)
        
        if (ms.debugOutput !== undefined) {
            output(debugHtmlSnippet(ms.debugOutput))
        } else if (ms.updateComplete !== undefined) {
            handleReload()
        }
    })
})