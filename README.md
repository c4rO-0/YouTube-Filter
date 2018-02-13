# Youtube Filter
[中文](https://github.com/c4rO-0/YouTube-Filter/blob/master/README.md) | [English](https://github.com/c4rO-0/YouTube-Filter/blob/master/README_en.md)

通过该火狐浏览器插件可以利用关键词查询视频更新状态

添加关键字

![](https://media.giphy.com/media/3ohs4dmQK9B9GCnNFC/giphy.gif)

查看视频

![](https://media.giphy.com/media/l4pTdjCrc7h0OxFPG/giphy.gif)

## 导向

- 开发者 [本页面](https://github.com/c4rO-0/YouTube-Filter)
- 用户指南 [维基页面](https://github.com/c4rO-0/YouTube-Filter/wiki/%E4%B8%BB%E9%A1%B5) 
- 用户反馈 [反馈页面](https://github.com/c4rO-0/YouTube-Filter/issues)

## 源码安装
- 在[本项目release页面](https://github.com/c4rO-0/YouTube-Filter/releases)选择beta版进行下载。目前最新为b.1.0.0。
- 打开火狐浏览器,在地址栏输入`about:debugging`打开`附加组件`页面
- 点击`附加组件`页面右上角`临时载入附加组件`按钮
- 在解压后的文件夹中选择`manifest.json`文件

[参考](https://youtu.be/cer9EUKegG4)

## 插件介绍
本插件使用javascript开发. 总共分为5部分.

**库(lib)** : 包含公共类，函数，及jQuery

**设置页面(settings)** : 添加或修改关键词

**后台运行(background)** : 查询网址, 过滤等指令执行的地方.

**页面脚本(content)** : 在youtube订阅页面执行的脚本，用于展示结果（未完成）

**图标弹窗(popup)** : 弹出窗口显示结果


