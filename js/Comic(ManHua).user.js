// ==UserScript==
// @name         漫画快速上下话切换
// @namespace    Kuaikan
// @icon         https://festatic.v3mh.com/static-resource/img/32x32/favicon.ico
// @version      0.1
// @description  为快看小说添加上下话键盘操作。</p>键盘方向键← 为上一话 || 方向键→ 为下一话
// @author       PoleStar
// @match        https://www.kuaikanmanhua.com/*
// @match        http://www.qiman59.com/*
// @match        *://*.hmanhuapi.com/*
// @match        *://www.gdzhongju.com/*
// @match        *://www.colamanga.com/*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    //屏蔽 eslint:no-undef - '$' is not defined 报错，添加如下 /* globals jQuery, $, waitForKeyElements */内容即可
    /* globals jQuery, $, waitForKeyElements */
    var url = window.location.host;
    var TagName = document.getElementsByTagName("a");
    var TagId;
    var href;
    var TagImg;

    // Your code here...
    $(document).keydown(function(event){
        if(url.indexOf('kuaikanmanhua')!=-1){
            //快看漫画

            TagName =document.getElementsByTagName("a");
            kuaikan();
        }else if(url.indexOf('qiman59')!=-1){
            //奇漫屋漫画
            TagId =document.getElementById("mainControlNext");
            TagName =document.getElementsByTagName("a");

            TagImg =document.getElementsByTagName("img");
            qiman();
        }else if(url.indexOf('hmanhuapi')!=-1){
            hmanhuapi();
        }else if(url.indexOf('gdzhongju')!=-1){
            gdzhongju();
        }else if (url.indexOf('colamanga')!=-1){
            //集云漫画
        }
    });

    function kuaikan(){
        if(event.keyCode == 37){//space down event ←
            for(var i =0;i<TagName.length;i++){
                if("上一话"==TagName[i].innerText){
                    href = TagName[i].attributes.href.value;
                    break;
                }
            }
            window.location.href=href;
        }
        if(event.keyCode == 39){//space down event →
            for(var ii =0;ii<TagName.length;ii++){
                if("下一话"==TagName[ii].innerText){
                    href = TagName[ii].attributes.href.value;
                    break;
                }
            }

            window.location.href=href;
        }
    }

    function qiman(){
        //页面右侧有上下一章图片触发，未弄明白
        if(event.keyCode == 37){//space down event ←
            for(var i =0;i<TagImg.length;i++){
                //if("上一话"==TagName[i].innerText){
                if("imgFloat_1"==TagImg[i].className){
                    //已能定位到图片，但是不知道如何获取上一层的a标签属性
                }

                // break;
                //}
            }
            // window.location.href=href;
        }
        //章节最下面的，【点击进入下一话】
        if(event.keyCode == 39){//space down event →
            href = TagId.attributes.href.value;
            window.location.href=href;
        }
    }

    function hmanhuapi(){
        //小键盘keyCode是kp_0 到 kp_9
        if(event.keyCode == 96 ){//kp_0
            for(var iii = 0;iii<TagName.length;iii++){
                if("下一章"==TagName[iii].innerText){
                    href = TagName[iii].attributes.href.value;
                    break;
                }
            }

            window.location.href=href;
        }
        if(event.keyCode == 37){//space down event ←
            for(var i =0;i<TagName.length;i++){
                if("上一页"==TagName[i].innerText){
                    href = TagName[i].attributes.href.value;
                    break;
                }
            }
            window.location.href=href;
        }
        if(event.keyCode == 39){//space down event →
            for(var ii =0;ii<TagName.length;ii++){
                if("下一页"==TagName[ii].innerText){
                    href = TagName[ii].attributes.href.value;
                    break;
                }else if("下一章"==TagName[ii].innerText){
                    href = TagName[ii].attributes.href.value;
                    break;
                }
            }
            window.location.href=href;
        }
    }

    function gdzhongju(){
        if(event.keyCode == 96 ){//kp_0
            for(var mh_1 =0;mh_1<TagName.length;mh_1++){
                if("下一话"==TagName[mh_1].innerText){
                    href = TagName[mh_1].attributes._href.value;
                    break;
                }
            }
             window.location.href=href;
        }
    }
})();
