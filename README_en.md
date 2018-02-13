# Youtube Filter

[中文](https://github.com/c4rO-0/YouTube-Filter/blob/master/README.md) | [English](https://github.com/c4rO-0/YouTube-Filter/blob/master/README_en.md)

Youtube Filter could help you to keep updated about your concerened videos on Youtube, by specific keywords you provided.

adding keywords

![](https://media.giphy.com/media/3ohs4dmQK9B9GCnNFC/giphy.gif)

check your videos

![](https://media.giphy.com/media/l4pTdjCrc7h0OxFPG/giphy.gif)

## guide

- for developer [this page](https://github.com/c4rO-0/YouTube-Filter)
- for user [Wiki](https://github.com/c4rO-0/YouTube-Filter/wiki/%E4%B8%BB%E9%A1%B5)
- for feedback [feedback](https://github.com/c4rO-0/YouTube-Filter/issues)

## load temporary add-on

- download beta version of Youtube-Filter from [github](https://github.com/c4rO-0/YouTube-Filter/releases), newest b.1.0.0
- open firefox, input "about:debugging" in address bar, enter
- click "load temporary add-on"
- choose "manifest.json" from extracted folder  

[reference](https://youtu.be/cer9EUKegG4)

## structure
this add-on is developed in javascript, includes 5 parts

**lib**: common classes and functions, include jQuery  
**settings**: add and edit keywords  
**background**: search keywords  
**content**: run on youtube subscription page, to display results.(unfinished)  
**popup**: popup a window to display results  