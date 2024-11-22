// ==UserScript==
// @name         Add font color
// @namespace    PoleStar
// @version      0.7.1
// @description  为自己所看小说页面字体添加字体颜色
// @author       PoleStar
// @match      *://www.xbiquzw.com/*
// @match      *://www.199zw.com/yuedu/*
// @match      *://www.shuhuang.la/xs/*
// @match      *://www.zxcs.info/*
// @match      *://www.aishangba4.com/*
// @match      *://www.xlewen4.com/*
// @match      *://www.biququ.la/*
// @match      *://www.bqgbi.cc/*
// @match      *://www.tzkczc.com/*
// @match      *://www.mjzww.com/*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    //屏蔽 eslint:no-undef - '$' is not defined 报错，添加如下 /* globals jQuery, $, waitForKeyElements */内容即可
    /* globals jQuery, $, waitForKeyElements */
    //通用属性定义
    var url = window.location.host;
    var fontSet="font-size:26px;font-family:'黑体';color:#00F";
    var colorSet="rgb(204, 232, 207)";
    //通用id定义
    var divId=$('#content');
    //background-color: rgb(204, 232, 207);

    //排除不需要覆盖背景色的
     if(url.indexOf('zxcs')!=-1||url.indexOf('bqgbi')!=-1){
         //bqgbi  单独附加字体颜色
         if(url.indexOf('bqgbi')!=-1){
             $('#chaptercontent').attr("style",fontSet);
         }
     }else{
         document.body.style.backgroundColor="rgb(204, 232, 207)";
     }
     //判定小说网站数组
    var mycars=new Array("biqu","199zw","shuhuang","aishangba4","tzkczc","mjzww");

    for(var i=0;i<mycars.length;i++){
        if(url.indexOf(mycars[i])!=-1){
            if(divId.length==1){//通用
                //alert("hello world");
                divId.attr("style",fontSet);
            }
            //独自处理
           /* if(i==1){//次元猫更改为书虫网
                $('#center').css("background-color",colorSet);
            }
            if(i==2){//小说屋
                $("#c1").removeAttr("style","");
                $('#c1').css("background-color",colorSet);
            }
            if(i==3){//混混小说
                $("#wrapper").removeAttr("style","");
            }*/

        }
    }
    if(url.indexOf('biquge98')!=-1||url.indexOf('biquge')!=-1){
        if(divId.length==1){
            // alert("hello world");
            divId.attr("style",fontSet);
        }
    }
    /*if(url.indexOf('rzlib')!=-1){
        var id=$('#chapter_content')
        if(id.length ==1){
              id.attr("style",fontSet);
        }
    }*/

    if(url.indexOf('mjzww')!=-1){//199中文网<'199zw'>  补充键盘按键，网站本身无
        $(document).keydown(function(event){
            if(event.keyCode == 37){//space down event ←
                //标签无id无class故根据标签a在整个页面A标签数组的第几个来进行点击操作
                document.getElementsByTagName("a")[46].click();
            }
            if(event.keyCode == 39){//space down event →
                document.getElementsByTagName("a")[48].click();
                //alert(document.getElementsByTagName("a")[48].href);
            }
        });
    }

    if(url.indexOf('tzkczc')!=-1){//天籁小说网  补充键盘按键，网站本身无
        $(document).keydown(function(event){
            if(event.keyCode == 37){//space down event ←
                //标签无id无class故根据标签a在整个页面A标签数组的第几个来进行点击操作
                document.getElementsByTagName("a")[47].click();
            }
            if(event.keyCode == 39){//space down event →
                document.getElementsByTagName("a")[49].click();
                //alert(document.getElementsByTagName("a")[49].href);
            }
        });
    }

    if(url.indexOf('zxcs')!=-1){//知轩藏书  补充键盘按键，网站本身无
        $(document).keydown(function(event){
            if(event.keyCode == 37){//space down event ←
                //alert(document.getElementById("j_chapterPrev").attributes["href"].value);
                //无法添加直接点击事件进行页面跳转，获取上一章地址，自行触发
                window.location.href=document.getElementById("j_chapterPrev").attributes.href.value;
            }
            if(event.keyCode == 39){//space down event →
                window.location.href=document.getElementById("j_chapterNext").attributes.href.value;
            }
        });
    }
    // Your code here...
})();
