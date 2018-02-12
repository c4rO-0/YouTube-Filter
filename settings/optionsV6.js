const limit = 10

function labelToKeyword(index) {
    // console.log("saving one item...")
    let spKeyword = $("#ulKeyword .spKeyword:visible:eq(" + index + ")")
    // console.log(spKeyword)//debug
    let longOutput = $(".labKeyword", spKeyword).prop("longOutput")
    // console.log(longOutput)//debug
    let [keyword, channel] = parseInputLine(longOutput)
    let tempKeyword
    if ($(".ckPlaylist", spKeyword).prop("checked")) {
        tempKeyword = new keyWord([""], channel, keyword.join())
    } else {
        tempKeyword = new keyWord(keyword, channel, "")
    }
    if ($(".ckOnoff", spKeyword).prop("checked") == false) {
        tempKeyword.onOff = false
    }
    return tempKeyword
    // return browser.storage.local.get("list_KeyWord").then((o) => {
    //     o.list_KeyWord[index] = tempKeyword
    //     return browser.storage.local.set({ list_KeyWord: o.list_KeyWord })
    // })
}


function handleSortUpdate() {
    // console.log($(this).sortable("toArray"))//debug
    let order = $(this).sortable("toArray")
    let newList = new Array()
    //set sort id
    $("#ulKeyword .liKeyword:visible").each(function (idx, elm) {
        $(this).prop("id", idx)
    })
    browser.storage.local.get("list_KeyWord").then((o) => {
        for (let i = 0; i < o.list_KeyWord.length; i++) {
            newList[i] = o.list_KeyWord[order[i]]
        }
        return browser.storage.local.set({ list_KeyWord: newList })
    })
}

function handleLabel() {
    $(this).prev().prop("value", $(this).prop("longOutput"))
    $(this).prev().css("display", "inline").focus()
    $(this).css("display", "none")
}

function handleTextfield() {
    $(this).next().css("display", "inline")
    $(this).css("display", "none")
    // console.log( saveOneChange($(this).closest(".liKeyword").index()))
}

function handlePlaylist() {
    let index = $(this).closest(".liKeyword").index()
    browser.storage.local.get("list_KeyWord").then((o) => {
        o.list_KeyWord[index] = labelToKeyword(index)
        return browser.storage.local.set({ list_KeyWord: o.list_KeyWord })
    }).then(() => {
        browser.runtime.sendMessage({ idxToBeInit: index })
    })
}

function handleOnoff() {
    let offList = new Array()
    let count = 0
    let last = 0
    let index = $(this).closest(".liKeyword").index()
    let isChecked, isThisChecked = $(this).prop("checked")
    let wait
    //check all On/Off checkbox
    $(".liKeyword").each(function (idx) {
        isChecked = $(".ckOnoff", this).prop("checked")
        // console.log(idx + ": " + $(".ckOnoff", this).prop("checked"))//debug
        //count
        if ($(".ckOnoff", this).prop("checked")) { count++ }
        //if greater than limit number, uncheck it
        if (count > limit) {
            //great than limit and not present entry
            if (idx != index) {
                // console.log("!=")//debug
                offList.push(idx)
                $(".ckOnoff", this).prop("checked", false)
                //present entry is great than limit, uncheck last one
            } else {
                // console.log("==")//debug
                // console.log("last:" + last)//debug
                $(".liKeyword:eq(" + last + ") .ckOnoff").prop("checked", false)
                offList.push(last)
            }
        }
        if (isChecked) {
            last = idx
            // console.log("lllllast: " + last)//debug
        }
    })
    // console.log(offList)

    let save = browser.storage.local.get("list_KeyWord").then((o) => {
        o.list_KeyWord[index].onOff = isThisChecked
        //save
        // console.log("saving...................")
        for (let i = 0; i < offList.length; i++) {
            o.list_KeyWord[offList[i]].onOff = false
        }
        // console.log(o.list_KeyWord)
        return browser.storage.local.set({ list_KeyWord: o.list_KeyWord })
    })
    if (isThisChecked) {
        save.then(() => {
            browser.runtime.sendMessage({ idxToBeInit: index })
        })
    }
}


//subtle save version done
function handleTextfieldChange() {
    let [keyword, channel] = parseInputLine($(this).prop("value"))
    let longOutput = reverseParseKeyword(keyword, channel)
    let shortOutput = keyword.join(",") + ";" + channel
    $(this).next().text(shortOutput)
    $(this).next().prop("longOutput", longOutput)
    let index = $(this).closest(".liKeyword").index()
    //send this message
    // labelToKeyword(index)
    browser.storage.local.get("list_KeyWord").then((o) => {
        o.list_KeyWord[index] = labelToKeyword(index)
        return browser.storage.local.set({ list_KeyWord: o.list_KeyWord })
    }).then(() => {
        browser.runtime.sendMessage({ idxToBeInit: index })
    })
}

//subtle save version
function handleDelete() {
    let index = $(this).closest(".liKeyword").index()
    //delete on paage
    $(this).closest(".liKeyword").remove()
    //delete in browser
    browser.storage.local.get("list_KeyWord").then((o) => {
        o.list_KeyWord.splice(index, 1)
        browser.storage.local.set({ list_KeyWord: o.list_KeyWord })
    })
    // save()
}

function parseInputLine(keyString) {
    //find the character before semicolon
    // console.log("parseR1: "+keyString)
    let preSemicolon = keyString.match(/[^\\];/g)
    if (preSemicolon === null) { preSemicolon = [""] }
    // console.log(preSemicolon)
    for (let i = 0; i < preSemicolon.length; i++) {
        preSemicolon[i] = preSemicolon[i].slice(0, -1)
    }
    // console.log(preSemicolon)
    //split keyString with semicolon
    // let [keyword, channel] = $("#tfAdd").prop("value").split(/[^\\];/, 2)
    let [keyword, channel] = keyString.split(/[^\\];/, 2)
    // console.log("parseR2: " + keyword + "|" + channel)
    // console.log(preSemicolon)
    if (preSemicolon[0] !== undefined) { keyword += preSemicolon[0] }
    //if there is no channel given
    if (channel === undefined) { channel = "" }
    if (preSemicolon[1] !== undefined) { channel += preSemicolon[1] }
    //clear \;
    keyword = keyword.replace(/\\;/g, ";")
    channel = channel.replace(/\\;/g, ";")

    //to true keyword
    let preComma = keyword.match(/[^\\],/g)
    if (preComma === null) { preComma = [""] }
    for (let i = 0; i < preComma.length; i++) {
        preComma[i] = preComma[i].slice(0, -1)
    }
    // console.log(preComma)
    let keywordArray = keyword.split(/[^\\],/g)
    for (let i = 0; i < keywordArray.length; i++) {
        if (preComma[i] !== undefined) { keywordArray[i] += preComma[i] }
        keywordArray[i] = keywordArray[i].replace(/\\,/g, ",")
    }
    // console.log("parseR3: " + keywordArray + "|" + channel)
    return [keywordArray, channel]
}

function reverseParseKeyword(keywordArray, channel) {
    // console.log(keywordArray)
    let result
    if (jQuery.type(keywordArray) === "array") {
        let keyword = new Array(keywordArray.length)
        for (let i = 0; i < keywordArray.length; i++) {
            // console.log(keywordArray[i])
            keyword[i] = keywordArray[i].replace(/,/g, "\\,")
        }
        // console.log(keyword)
        result = keyword.join(",")
    } else if (jQuery.type(keywordArray) === "string") {
        result = keywordArray.replace(/,/g, "\\,")
    }
    result = result.replace(/;/g, "\\;")
    result += ";"
    result += channel.replace(/;/g, "\\;")
    // console.log("reverse: " + result)
    return result
}

function htmlSnippet(shortOutput, longOutput) {
    return '\
    <li class="liKeyword">\
        <span class="spKeyword">\
            <input name="textfield" type="text" class="tfKeyword" style="display:none">\
            <label for="textfield2" class="labKeyword" title="' + shortOutput + '">' + shortOutput + '</label>\
            <span class="spRight">\
                <input type="checkbox" class="ckPlaylist">\
                <label>Playlist</label>\
                <input type="checkbox" class="ckOnoff">\
                <label>On/Off</label>\
                <input type="button" class="btDelete" value="Delete">\
            </span>\
        </span>\
    </li>'
}

//subtle save version done except handler for checkbox
function handleAdd() {
    if ($("#tfAdd").prop("value") == "") { return }
    console.log("adding keyword...")
    let [keyword, channel] = parseInputLine($("#tfAdd").prop("value"))
    $("#tfAdd").prop("value", "")
    let longOutput = reverseParseKeyword(keyword, channel)
    let shortOutput = keyword.join(",") + ";" + channel
    // console.log(longOutput)
    // console.log(shortOutput)
    //count how many ON
    let countOnOff = 0
    $(".liKeyword").each(function () { if ($(".ckOnoff", this).prop("checked")) { countOnOff++ } })
    $("#ulKeyword").prepend(htmlSnippet(shortOutput, longOutput))
    $("#ulKeyword .spKeyword:first .labKeyword").prop("longOutput", longOutput)
    //turn it on or off
    if (countOnOff < limit) {
        $("#ulKeyword .spKeyword:first .ckOnoff").prop("checked", true)
    } else {
        $("#ulKeyword .spKeyword:first .ckOnoff").prop("checked", false)
    }

    // console.log($("#ulKeyword span:first"))
    //add event listener
    $("#ulKeyword .spKeyword:first .labKeyword").on("dblclick", handleLabel)
    $("#ulKeyword .spKeyword:first .tfKeyword").on("change", handleTextfieldChange)
    $("#ulKeyword .spKeyword:first .tfKeyword").on("focusout", handleTextfield)
    $("#ulKeyword .spKeyword:first .tfKeyword").on("keypress", function (e) {
        let code = e.keyCode || e.which
        if (code == 13) { this.blur() }
    })
    $("#ulKeyword .spKeyword:first .btDelete").on("click", handleDelete)
    $("#ulKeyword .spKeyword:first .ckPlaylist").on("click", handlePlaylist)
    $("#ulKeyword .spKeyword:first .ckOnoff").on("click", handleOnoff)
    // set tooltip
    $("#ulKeyword .labKeyword").tooltip({
        open: function () {
            if (this.offsetWidth == this.scrollWidth) {
                $(this).tooltip("disable")
                $(this).tooltip("enable")
            }
        }
    })
    $("#ulKeyword").on("sortstart", function () { $("#ulKeyword .labKeyword").tooltip("disable") })
    $("#ulKeyword").on("sortstop", function () { $("#ulKeyword .labKeyword").tooltip("enable") })
    //set sort id
    $("#ulKeyword .liKeyword:visible").each(function (idx, elm) {
        $(this).prop("id", idx)
    })
    // save()
    browser.storage.local.get("list_KeyWord").then((o) => {
        if (o.list_KeyWord === undefined) {
            return browser.storage.local.set({ list_KeyWord: [labelToKeyword(0)] })
        } else {
            o.list_KeyWord.unshift(labelToKeyword(0))
            return browser.storage.local.set({ list_KeyWord: o.list_KeyWord })
        }
    }).then(() => {
        browser.runtime.sendMessage({ idxToBeInit: 0 })
    })
}

function addListKeyword(listKeyword) {
    let keywordContent, shortOutput, longOutput, isPlaylist, countOnOff
    for (let i = 0; i < listKeyword.length; i++) {
        isPlaylist = false
        if (listKeyword[i].playList == "") {
            keywordContent = listKeyword[i].self
            shortOutput = listKeyword[i].self.join(",") + ";" + listKeyword[i].channel
        } else {
            isPlaylist = true
            keywordContent = listKeyword[i].playList
            shortOutput = listKeyword[i].playList + ";" + listKeyword[i].channel
        }
        longOutput = reverseParseKeyword(keywordContent, listKeyword[i].channel)
        //count how many ON
        countOnOff = 0
        $(".liKeyword").each(function () { if ($(".ckOnoff", this).prop("checked")) { countOnOff++ } })
        $("#ulKeyword").append(htmlSnippet(shortOutput, longOutput))
        $("#ulKeyword .spKeyword:last .labKeyword").prop("longOutput", longOutput)
        if (countOnOff < limit) {
            // console.log(countOnOff + ": " + i + ": false")
            $("#ulKeyword .spKeyword:last .ckOnoff").prop("checked", listKeyword[i].onOff)
        } else {
            // console.log(countOnOff + ": " + i + ": " + listKeyword[i].onOff)
            $("#ulKeyword .spKeyword:last .ckOnoff").prop("checked", false)
            listKeyword[i].onOff = false
        }
        $("#ulKeyword .spKeyword:last .ckPlaylist").prop("checked", isPlaylist)
        //add event listener
        $("#ulKeyword .spKeyword:last .labKeyword").on("dblclick", handleLabel)
        $("#ulKeyword .spKeyword:last .tfKeyword").on("change", handleTextfieldChange)
        $("#ulKeyword .spKeyword:last .tfKeyword").on("focusout", handleTextfield)
        $("#ulKeyword .spKeyword:last .tfKeyword").on("keypress", function (e) {
            let code = e.keyCode || e.which
            if (code == 13) { this.blur() }
        })
        $("#ulKeyword .spKeyword:last .btDelete").on("click", handleDelete)
        $("#ulKeyword .spKeyword:last .ckPlaylist").on("click", handlePlaylist)
        $("#ulKeyword .spKeyword:last .ckOnoff").on("click", handleOnoff)
        //set tooltip
        $("#ulKeyword .spKeyword .labKeyword").tooltip({
            open: function () {
                if (this.offsetWidth == this.scrollWidth) {
                    $(this).tooltip("disable")
                    $(this).tooltip("enable")
                }
            }
        })
        $("#ulKeyword").on("sortstart", function () { $("#ulKeyword .labKeyword").tooltip("disable") })
        $("#ulKeyword").on("sortstop", function () { $("#ulKeyword .labKeyword").tooltip("enable") })
    }
    //set sort id
    $("#ulKeyword .liKeyword:visible").each(function (idx, elm) {
        $(this).prop("id", idx)
    })
    //save keyword list
    browser.storage.local.get("list_KeyWord").then((o) => {
        let allList
        if (o.list_KeyWord === undefined) {
            return browser.storage.local.set({ list_KeyWord: listKeyword })
        } else {
            allList = o.list_KeyWord.concat(listKeyword)
            return browser.storage.local.set({ list_KeyWord: allList })
        }//maybe don't need to sendMessage, if need check handleAdd()
    }).then(() => {
        browser.runtime.sendMessage({ bottomFewToBeInit: listKeyword.length })
    })
}

function loadSetting() {
    let prmsSaveList = browser.storage.local.get("list_KeyWord")
    let prmsOffList = browser.storage.local.get("list_OffKeyWord")
    Promise.all([prmsSaveList, prmsOffList]).then((o) => {
        if (o[0].list_KeyWord === undefined && o[1].list_OffKeyWord === undefined) {
            console.log("no settings")
            return
        }
        let allList
        if (o[0].list_KeyWord === undefined) {
            allList = o[1].list_OffKeyWord
        } else if (o[1].list_OffKeyWord === undefined) {
            allList = o[0].list_KeyWord
        } else {
            allList = o[0].list_KeyWord.concat(o[1].list_OffKeyWord)
        }
        // console.log(allList)//debug
        for (let i = 0; i < allList.length; i++) {
            let keywordContent, shortOutput
            let isPlaylist = false
            if (allList[i].playList == "") {
                //if this is keyword
                keywordContent = allList[i].self
                shortOutput = allList[i].self.join(",") + ";" + allList[i].channel
            } else {
                // if this is playlist
                isPlaylist = true
                keywordContent = allList[i].playList
                shortOutput = allList[i].playList + ";" + allList[i].channel
            }
            let longOutput = reverseParseKeyword(keywordContent, allList[i].channel)
            $("#ulKeyword").append(htmlSnippet(shortOutput, longOutput))
            $("#ulKeyword .spKeyword:last .labKeyword").prop("longOutput", longOutput)
            $("#ulKeyword .spKeyword:last .ckOnoff").prop("checked", allList[i].onOff)
            $("#ulKeyword .spKeyword:last .ckPlaylist").prop("checked", isPlaylist)
            //add event listener
            $("#ulKeyword .spKeyword:last .labKeyword").on("dblclick", handleLabel)
            $("#ulKeyword .spKeyword:last .tfKeyword").on("change", handleTextfieldChange)
            $("#ulKeyword .spKeyword:last .tfKeyword").on("focusout", handleTextfield)
            $("#ulKeyword .spKeyword:last .tfKeyword").on("keypress", function (e) {
                let code = e.keyCode || e.which
                if (code == 13) { this.blur() }
            })
            $("#ulKeyword .spKeyword:last .btDelete").on("click", handleDelete)
            $("#ulKeyword .spKeyword:last .ckPlaylist").on("click", handlePlaylist)
            $("#ulKeyword .spKeyword:last .ckOnoff").on("click", handleOnoff)
            //set tooltip
            $("#ulKeyword .spKeyword .labKeyword").tooltip({
                open: function () {
                    if (this.offsetWidth == this.scrollWidth) {
                        $(this).tooltip("disable")
                        $(this).tooltip("enable")
                    }
                }
            })
            $("#ulKeyword").on("sortstart", function () { $("#ulKeyword .labKeyword").tooltip("disable") })
            $("#ulKeyword").on("sortstop", function () { $("#ulKeyword .labKeyword").tooltip("enable") })
        }
        //set sort id
        $("#ulKeyword .liKeyword:visible").each(function (idx, elm) {
            $(this).prop("id", idx)
        })
    })

    // browser.storage.local.get("list_KeyWord").then((o) => {
    //     if (o.list_KeyWord === undefined) {
    //         console.log("no settings")
    //         return
    //     }
    //     console.log("loading...")
    //     for (let i = 0; i < o.list_KeyWord.length; i++) {
    //         let keywordContent, shortOutput
    //         let isPlaylist = false
    //         if (o.list_KeyWord[i].playList == "") {
    //             //if this is keyword
    //             keywordContent = o.list_KeyWord[i].self
    //             shortOutput = o.list_KeyWord[i].self.join(",") + ";" + o.list_KeyWord[i].channel
    //         } else {
    //             // if this is playlist
    //             isPlaylist = true
    //             keywordContent = o.list_KeyWord[i].playList
    //             shortOutput = o.list_KeyWord[i].playList + ";" + o.list_KeyWord[i].channel
    //         }
    //         let longOutput = reverseParseKeyword(keywordContent, o.list_KeyWord[i].channel)
    //         $("#ulKeyword").append(htmlSnippet(shortOutput, longOutput))
    //         $("#ulKeyword .spKeyword:last .labKeyword").prop("longOutput", longOutput)
    //         $("#ulKeyword .spKeyword:last .ckOnoff").prop("checked", o.list_KeyWord[i].onOff)
    //         $("#ulKeyword .spKeyword:last .ckPlaylist").prop("checked", isPlaylist)
    //         //add event listener
    //         $("#ulKeyword .spKeyword:last .labKeyword").on("dblclick", handleLabel)
    //         $("#ulKeyword .spKeyword:last .tfKeyword").on("focusout", handleTextfield)
    //         $("#ulKeyword .spKeyword:last .btDelete").on("click", handleDelete)
    //         $("#ulKeyword .spKeyword:last .ckPlaylist").on("click", save)
    //         $("#ulKeyword .spKeyword:last .ckOnoff").on("click", save)
    //         //set tooltip
    //         $("#ulKeyword .spKeyword .labKeyword").tooltip({
    //             open: function () {
    //                 if (this.offsetWidth == this.scrollWidth) {
    //                     $(this).tooltip("disable")
    //                     $(this).tooltip("enable")
    //                 }
    //             }
    //         })
    //         $("#ulKeyword").on("sortstart", function () { $("#ulKeyword .labKeyword").tooltip("disable") })
    //         $("#ulKeyword").on("sortstop", function () { $("#ulKeyword .labKeyword").tooltip("enable") })
    //     }
    // }, (error) => {
    //     window.alert("error, can't get storage")
    // })
}

// 获取用户已订阅的播放列表
function getFeedPlayList() {
    let url = "https://www.youtube.com/";
    let list_title = new Array();
    let list_href = new Array()
    let list_channel = new Array()
    let homePage = asynHttpRequest("GET", url);

    return homePage.then((Page) => {
        return new Promise((resolve, reject) => {
            $(Page).find("a.guide-item.yt-uix-sessionlink.yt-valign.spf-link.has-subtitle").each(function (index) {
                // console.log($(this).find(".guide-mix-icon").length)
                // console.log($(this))
                if ($(this).find(".guide-mix-icon").length <= 0) {
                    //是playlist
                    list_title.push("≡ | " + $(this).attr("title"));
                } else {
                    //是合集
                    list_title.push("‣ | " + $(this).attr("title"));
                }
                list_href.push($(this).attr("href"))
                list_channel.push($("p.guide-item-subtitle", this).text())
            });
            // console.log(list_title);
            // resolve(list_title)
            resolve({ list_title: list_title, list_href: list_href, list_channel: list_channel })
        })
    });
}

function handleImportPlaylist() {
    $("#dialog").dialog("open")
    getFeedPlayList().then((list) => {
        $("svg").css("display", "none")
        for (let i = 0; i < list.list_title.length; i++) {
            $(".ulDialog").append('\
            <li class="liDialog">\
                <span class="spDialog">\
                    <label class="labDialog">'+ list.list_title[i] + '</label>\
                    <span class="spDialogRight">\
                        <input name="checkbox" type="checkbox" class="ckDialog">\
                    </span>\
                </span>\
            </li>')
            $(".ulDialog .liDialog:last .labDialog").prop("playlistHref", list.list_href[i])
            $(".ulDialog .liDialog:last .labDialog").prop("playlistChannel", list.list_channel[i])
            $(".ulDialog .liDialog:last .labDialog").on("click", function(){
                $(this).next(".spDialogRight").children(".ckDialog").click()
            })
        }
        // console.log(list_title)//debug
    })
}

function handleDialogOK() {
    let newList = new Array()
    let countOnOff
    let isPlaylist = true
    $($(".ulDialog .liDialog").get().reverse()).each(function (idx, elm) {
        if ($(".labDialog", elm).text()[0] == "≡") {
            isPlaylist = true
        } else {
            isPlaylist = false
        }
        let shortOutput = $(".labDialog", elm).text().slice(4)
        let longOutput = shortOutput.replace(/,/g, "\\,")
        shortOutput += ";"
        longOutput += ";"
        if ($(".ckDialog", elm).prop("checked")) {
            countOnOff = 0
            $(".liKeyword").each(function () { if ($(".ckOnoff", this).prop("checked")) { countOnOff++ } })
            $("#ulKeyword").prepend(htmlSnippet(shortOutput, longOutput))
            $("#ulKeyword .spKeyword:first .labKeyword").prop("longOutput", longOutput)
            if (countOnOff < limit) {
                $("#ulKeyword .spKeyword:first .ckOnoff").prop("checked", true)
            } else {
                $("#ulKeyword .spKeyword:first .ckOnoff").prop("checked", false)
            }
            if (isPlaylist) {
                //是播放列表
                $("#ulKeyword .spKeyword:first .ckPlaylist").prop("checked", true)
            } else {
                //是合集
                $("#ulKeyword .spKeyword:first .ckPlaylist").prop("checked", false)
            }
            //add event listener
            $("#ulKeyword .spKeyword:first .labKeyword").on("dblclick", handleLabel)
            $("#ulKeyword .spKeyword:first .tfKeyword").on("change", handleTextfieldChange)
            $("#ulKeyword .spKeyword:first .tfKeyword").on("focusout", handleTextfield)
            $("#ulKeyword .spKeyword:first .tfKeyword").on("keypress", function (e) {
                let code = e.keyCode || e.which
                if (code == 13) { this.blur() }
            })
            $("#ulKeyword .spKeyword:first .btDelete").on("click", handleDelete)
            $("#ulKeyword .spKeyword:first .ckPlaylist").on("click", handlePlaylist)
            $("#ulKeyword .spKeyword:first .ckOnoff").on("click", handleOnoff)
            // set tooltip
            $("#ulKeyword .labKeyword").tooltip({
                open: function () {
                    if (this.offsetWidth == this.scrollWidth) {
                        $(this).tooltip("disable")
                        $(this).tooltip("enable")
                    }
                }
            })
            $("#ulKeyword").on("sortstart", function () { $("#ulKeyword .labKeyword").tooltip("disable") })
            $("#ulKeyword").on("sortstop", function () { $("#ulKeyword .labKeyword").tooltip("enable") })
            newList.unshift(labelToKeyword(0))
            newList[0].playListUrl = $(".labDialog", elm).prop("playlistHref")
            if (isPlaylist) {
                newList[0].channel = $(".labDialog", elm).prop("playlistChannel")
            }
        }//if end
    })//loop end
    $("#ulKeyword .liKeyword:visible").each(function (idx, elm) {
        $(this).prop("id", idx)
    })
    //save
    let count = newList.length
    browser.storage.local.get("list_KeyWord").then((o) => {
        if (o.list_KeyWord === undefined) {
            return browser.storage.local.set({ list_KeyWord: newList })
        } else {
            newList = newList.concat(o.list_KeyWord)
            return browser.storage.local.set({ list_KeyWord: newList })
        }
    }).then(() => {
        browser.runtime.sendMessage({ topFewToBeInit: count })

    })

    $(".ulDialog").empty()
    $("svg").css("display", "inline")
    $("#dialog").dialog("close")
}

function handleExport() {
    browser.storage.local.get("list_KeyWord").then((o) => {
        if (o.list_KeyWord !== undefined) {
            let jsonString = JSON.stringify(o.list_KeyWord)
            // console.log(jsonString)
            let jsonBlob = new Blob([jsonString], { type: "application/json" })
            browser.downloads.download({
                url: URL.createObjectURL(jsonBlob),
                filename: "YoutTube_Filter_Settings.json",
                conflictAction: "overwrite",
                saveAs: true
            })
        }
    })
}

function handleImport() {
    // console.log(this.files[0])//debug
    let settingFile = this.files[0]
    fileReader = new FileReader()
    fileReader.readAsText(settingFile)
    fileReader.onload = (event) => {
        let parseObj = JSON.parse(event.target.result)
        // console.log(parseObj)//debug
        addListKeyword(parseObj)
    }
}

function handleResize(event, ui) {
    console.log(ui.size)
    browser.storage.local.set({ uiSize: ui.size })
}

$(document).ready(function () {
    browser.storage.local.get("uiSize").then((o) => {
        if (o.uiSize !== undefined) {
            $(".col > ul").css("width", o.uiSize.width)
            $(".col > ul").css("height", o.uiSize.height)
        }
    })
    $(".col > ul").resizable({
        stop: handleResize
    })
    $("button").button()
    $("#dialog").dialog({
        width: 600,
        autoOpen: false
    });
    $("#dlHelp").dialog({
        width: 600,
        autoOpen: false
    })
    $("#Help").on("click", function () {
        $("#dlHelp").dialog("open")
    })


    $("#ulKeyword").sortable({
        axis: "y",
        update: handleSortUpdate
    })
    $("#btAdd").on("click", handleAdd)
    $("#tfAdd").on("keypress", function (e) {
        let code = e.keyCode || e.which
        if (code == 13) {
            handleAdd()
            $(this).prop("value", "")
        }
    })
    //setting for function buttons
    $("#ImportPlaylist").on("click", handleImportPlaylist)
    $("button.ui-button.ui-corner-all.ui-widget.ui-button-icon-only.ui-dialog-titlebar-close").on("click", () => {
        $(".ulDialog").empty()
        $("svg").css("display", "inline")
    })
    $("#DialogOK").on("click", handleDialogOK)
    $("#Export").on("click", handleExport)
    $("#Import").on("click", function () { $("#flImport").click() })
    $("#flImport").on("change", handleImport)

    loadSetting()


})