# Youtube Filter
通过该火狐浏览器插件可以利用关键词查询视频更新状态

---
中文 English

## 导向

- 开发者 [本页面](https://github.com/c4rO-0/YouTube-Filter)
- 用户指南 [维基页面](https://github.com/c4rO-0/YouTube-Filter/wiki) 
- 用户反馈 [反馈页面](https://github.com/c4rO-0/YouTube-Filter/issues)

## 源码安装
- 在[本项目git主页面](https://github.com/c4rO-0/YouTube-Filter)选择`clone or download`获取下载链接. 将源码保存在本地.
- 打开火狐浏览器,在地址栏输入`about:debugging`打开`附加组件`页面.
- 点击`附加组件`页面右上角`临时载入附加组件`按钮. 找到本地源码,选择`manifest.json`文件.

## 插件介绍
本插件使用javascript开发. 总共分为5部分.
### 内核(core)
各部分需要共用的函数, 以及类的构造.
包含 : 关键字类(keyWord), 视频信息类(infoVideo), 索取网页函数(asynHttpRequest)等.

**依赖文件** :
```
lib
├── jquery-3.2.1.min.js
├── jquery-ui.min.css
└── jquery-ui.min.js
```

**包含文件** :
```
lib
├── core.js
```

### 设置页面(settings)
设置页面的脚本和html.

**依赖文件** :
```
lib
├── core.js
├── jquery-3.2.1.min.js
├── jquery-ui.min.css
└── jquery-ui.min.js
```
**包含文件** :
```
settings
├── optionsV6.css
├── optionsV6.html
└── optionsV6.js
```

### 后台运行(background)
查询网址, 过滤等指令执行的地方.

**依赖文件** :

```
lib
├── core.js
├── jquery-3.2.1.min.js
├── jquery-ui.min.css
└── jquery-ui.min.js
```

**包含文件** :
``` background.js ```

### content
在youtube订阅页面执行的脚本.

**依赖文件** :
```
├── background.js
├── lib
│   ├── core.js
│   ├── jquery-3.2.1.min.js
│   ├── jquery-ui.min.css
│   └── jquery-ui.min.js
```

**包含文件** :
```
content_scripts
└── content.js
```

### 图标弹窗
不知道叫什么

**依赖文件** :
```
├── background.js
├── icons
│   ├── c4r_16.png
│   ├── c4r_32.png
│   ├── c4r_48.png
│   ├── c4r_64.png
│   └── c4r_96.png
├── lib
│   ├── core.js
│   ├── jquery-3.2.1.min.js
│   ├── jquery-ui.min.css
│   └── jquery-ui.min.js
```


**包含文件** :
```
popup
├── popup.css
├── popup.html
└── popup.js
```


