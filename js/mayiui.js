/*
 * 软件名称：mayiui
 * 版本:1.9
 * 版权：www.mayiui.com
 * 开源协议：MIT
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.mayiui = factory());
}(this, function () { 'use strict';
    /*
     * varObjectDefault
     * 功能：静态变量,默认播放配置，当外部传递过来的配置有未包含在varsDefault里的，则使用varsDefault里的配置
     */
    var varObjectDefault= {
        type: 0,//类型
        mode:0,//模式，0=普通，1=精致,2=通栏
        style: '',//风格
        input:'',//是否使用input
        ico: '',//图标
        icoColor: '#FFFFFF',//图标颜色
        icoBgColor:'#28a745',//图标背景色
        el: null,//tip对象,mark对象
        title: '网页消息',//用于弹出询问框的标题还有框架的标题
        titleColor:'',//标题颜色
        fontSize:'',//字体大小
        content: '',//内容
        contentColor:'',//内容颜色
        button: null,//按钮
        buttonBig:false,//是否启用大按钮
        maximize: true,//最大化
        minimize: true,//最小化
        closeButton: true,//是否包含关闭铵钮
        closeHandler:null,//监听关闭事件
        loadedHandler:null,//iframe加载完成事件
        mask: null,//是否采用遮罩层
        maskClickClose: false,//遮罩层点击关闭
        maskBg: '#00000033',//遮罩层背景
        drag: true,//是否可拖动
        position: 0,//出现位置
        deviation: 0,//距离偏移量
        size: null,//宽高
        overflow: null,
        scrolling: 'auto',
        animate: 2,//缓动类型，0=无，1=缓动,2=变大,3=翻转,4=抖动
        animateTime: 300,//缓动时间
        pi:0,//程序智能化
        time: 0,//-1不使用定时，0=自动
        zIndex: 0//自定义深度
    };
    var ICO=['check','exclamation','question','frown','smile'];
    var cBody=null;
    var embed={
        alert:function(content, obj) {
            var newObject = {};
            if (obj) {
                newObject = obj;
            }
            newObject['content'] = content;
            newObject['type'] = 0;
            if(isUndefined(newObject['style']) || newObject['style']=='' || newObject['style']=='default'){
                newObject['style']='white';
            }
            return embedInto(newObject);
        },
        msg:function(content, obj) {
            var newObject = {};
            if (obj) {
                newObject = obj;
            }
            newObject['content'] = content;
            newObject['type'] = 1;
            if (isUndefined(newObject['closeButton'])) {
                newObject['closeButton'] = false;
            }
            if(isUndefined(newObject['style']) || newObject['style']=='' || newObject['style']=='default'){
                newObject['style']='darkgrey';
            }
            eleClose('msg');
            return embedInto(newObject);
        },
        tip:function(el, content, obj) {
            var newObject = {};
            if (obj) {
                newObject = obj;
            }
            newObject['content'] = content;
            newObject['type'] = 2;
            newObject['el'] = el;
            if (isUndefined(newObject['deviation'])) {
                newObject['deviation'] = 3;
            }
            if(isUndefined(newObject['style']) || newObject['style']=='' || newObject['style']=='default'){
                newObject['style']='darkgrey';
            }
            eleClose('tip');
            return embedInto(newObject);
        },
        level:function(content, obj) {
            var newObject = {};
            if (obj) {
                newObject = obj;
            }
            newObject['content'] = content;
            newObject['type'] = 3;
            if (isUndefined(newObject['size'])) {
                newObject['size'] = ['90%', '90%'];
            }
            if(isUndefined(newObject['style']) || newObject['style']=='' || newObject['style']=='default'){
                newObject['style']='white';
            }
            return embedInto(newObject);
        },
        iframe:function(content, obj) {
            var newObject = {};
            if (obj) {
                newObject = obj;
            }
            newObject['content'] = content;
            newObject['type'] = 4;
            if (isUndefined(newObject['size'])) {
                newObject['size'] = ['90%', '90%'];
            }
            if(isUndefined(newObject['style']) || newObject['style']=='' || newObject['style']=='default'){
                newObject['style']='white';
            }
            return embedInto(newObject);
        },
        mark:function(el, content, obj) {
            var newObject = {};
            if (obj) {
                newObject = obj;
            }
            newObject['content'] = content;
            newObject['type'] = 5;
            newObject['el'] = el;
            if (isUndefined(newObject['deviation'])) {
                newObject['deviation'] = 10;
            }
            if(isUndefined(newObject['style']) || newObject['style']=='' || newObject['style']=='default'){
                newObject['style'] = 'darkgrey';
            }
            return embedInto(newObject);
        },
        loading:function(obj) {
            var newObject = {};
            if (obj) {
                newObject = obj;
            }
            newObject['type'] = 6;
            if (isUndefined(newObject['mask'])) {
                newObject['mask'] = true;
            }
            if(isUndefined(newObject['style']) || newObject['style']=='' || newObject['style']=='default'){
                newObject['style']='darkgrey';
            }
            if (isUndefined(newObject['maskBg'])) {
                newObject['maskBg'] = '#00000099';
            }
            if (isUndefined(newObject['animate'])) {
                newObject['animate'] = 0;
            }
            eleClose('loading-all');
            return embedInto(newObject);
        },
        close:function(ele){
            eleClose(ele);
        }
    };
    function embedInto(obj){
        var newObj={};
        /*
         * into
         * 功能：页面加载完成后构建
         * @obj=初始化时的配置对象
        */
        return documentReady(function(){
            var path=getPath();
            return loadCss(path+'mayiui.css',function(){
                if (valType(obj) == 'object') {
                    newObj = standardization(varObjectDefault, obj);
                    if (newObj['type'] != 6 && newObj['type'] != 0 && !newObj['content']) {
                        return;
                    }
                    if (newObj['type'] < 3 && newObj['type'] > 0) {
                        newObj['title'] = '';
                        newObj = standardization(newObj, obj);
                    }
                    if (valType(newObj['animate']) != 'number') {
                        newObj['animate'] = 2;
                    }
                    newObj['animate'] = limitNum(newObj['animate'], 0, 4);
                    newObj['position'] = limitNum(newObj['position'], 0, 12);
                    cBody=$('page');
                    if(isUndefined(cBody)){
                        cBody=$('body');
                    }
                    switch (newObj['type']) {
                        case 0:
                            return disAlert(newObj);
                            break;
                        case 1:
                            return disMsg(newObj);
                            break;
                        case 2:
                            return disTip(newObj);
                            break;
                        case 3:
                            return disLevel(newObj);
                            break;
                        case 4:
                            return disIframe(newObj);
                            break;
                        case 5:
                            return disMark(newObj);
                            break;
                        case 6:
                            return disLoading(newObj);
                            break;
                    }
                }
            });
            
        });
    }
    /*===============================================开始主体的六个程序=====================================================================*/
    /*
     * 弹出询问框
     */
    function disAlert(newObj) {
        var i;
        var btnArr = [];//按钮数组
        var ele = createlDiv('mayiui mayiui-alert-dis mayiui-alert'); //总体
        newObj['position'] = limitNum(newObj['position'], 0, 8);
        ele.mayiuiConfigObject = newObj;
        var closeFun = function() {
            eleClose(ele);
        };
        var btn = [
            {
                val: '确定',
                style: newObj['style'] == 'white' ? 'blue' : 'light',
                fun: closeFun
            },
            {
                val: '取消',
                style: newObj['style'] == 'white' ? 'light' : 'white',
                fun: closeFun
            }
        ];
        if (isUndefined(newObj['mask']) || newObj['mask']) {
            disMask(ele); //显示遮罩层
        }
        if (newObj['button'] && valType(newObj['button']) == 'array') {
            var arr = newObj['button'];
            btn = [];
            for (i = 0; i < arr.length; i++) {
                var obj = {};
                if (valType(arr[i]) == 'string') {
                    obj = {
                        val: arr[i],
                        fun: closeFun
                    };
                    if (i == 0) {
                        obj['style'] = 'blue';
                    } else {
                        obj['style'] = 'light';
                    }
                } else {
                    if (!isUndefined(arr[i]['val'])) {
                        obj['val'] = arr[i]['val'];
                        if (!isUndefined(arr[i]['style'])) {
                            obj['style'] = arr[i]['style'];
                        }
                        else {
                            if (i == 0) {
                                obj['style'] = newObj['style']== 'white' ? 'blue' : 'white';
                            } 
                            else {
                                obj['style'] = newObj['style'] == 'white' ? 'light' : 'white';
                            }
                        }
                        if (!isUndefined(arr[i]['fun'])) {
                            obj['fun'] = arr[i]['fun'];
                        } else {
                            obj['fun'] = closeFun;
                        }
                    }
                }
                if (!isUndefined(obj['val'])) {
                    btn.push(obj);
                }
            }
        }
        switch(newObj['mode']){
            case 1:
                ele.addClass('mayiui-alert-delicate');
                break;
            case 2:
                ele.addClass('mayiui-alert-banner');
                break;
            
        }
        if (newObj['style']) {
            ele.addClass('mayiui-bg-' + newObj['style']);
        }
        if (newObj['animate'] > 0) {
            ele.addClass('mayiui-animate');
            ele.addClass(getAnimateClass(newObj));
        }
        cBody.append(ele);
        var title = newObj['title'];
        var content = newObj['content'];
        var topEle=null,titleEle = null,closeEle=null,buttonEle=null;
        if (title || newObj['closeButton']) {
            topEle = createlDiv('mayiui-alert-top');
            ele.append(topEle);
            if (title) {
                titleEle = createlDiv('mayiui-alert-title');
                titleEle.innerHTML = title;
                topEle.append(titleEle);
                if(newObj['titleColor']){
                    titleEle.css('color',newObj['titleColor']);
                }
            }
            else{
                topEle.css({
                    'border-bottom':'0px',
                    'background-color':'transparent'
                });
            }
            if (newObj['closeButton']) {
                closeEle = createlDiv('mayiui-alert-close');
                topEle.append(closeEle);
                var closeButtom=createlButton('mayiui-btn-font'+getButtonColor(newObj['style']),'<i class="mayiuifont mayiui-icon-close"></i>');
                closeButtom.click(function(){
                    closeFun();
                });
                closeEle.append(closeButtom);
            }
            if(title && closeButtom){
                titleEle.css('line-height',closeEle.getHeight()+'px');
            }
        }
        if(newObj['drag']){
            if(topEle){
                topEle.css('cursor', 'move');
                topEle.drag(ele);
            }
            else{
                ele.css('cursor', 'move');
                ele.drag();
            }
        }
        //在提示文字前面放置图标
        var icoEle = null;
        if (newObj['ico']) {
            icoEle=createlDiv('mayiui-alert-ico');
            ele.append(icoEle);
            var ico = newObj['ico'];               
            if (ICO.indexOf(ico)>-1) {
                icoEle.innerHTML ='<div class="mayiui-ico mayiui-ico-circular"><i class="mayiuifont mayiui-icon-'+ico+'"></i></div>';
            } else {
                icoEle.innerHTML = newObj['ico'];
            }
            if (newObj['icoColor']) {
                icoEle.find('.mayiui-ico').eq(0).css('color', newObj['icoColor']);
            }
            if (newObj['icoBgColor']) {
                icoEle.find('.mayiui-ico').eq(0).css('background-color', newObj['icoBgColor']);
            }
        }
        
        var contentEle = null,inputContentEle=null;//定义文本内容框或按钮容器框
        if(!newObj['input']){
            contentEle = createlDiv('mayiui-alert-content',content);
            ele.append(contentEle);
            ele.contentEle=contentEle;
        }
        else{
            inputContentEle=createlDiv('mayiui-alert-input-content');
            var inputEle=createlInput(newObj['input'],content);
            inputContentEle.append(inputEle);
            ele.append(inputContentEle);
            inputEle.addListener('change',function(){
               ele.inputValue=inputEle.value;
               if(btnArr.length>0){
                   for(i=0;i<btnArr.length;i++){
                       btnArr[i].inputValue=inputEle.value;
                   }
               }
            });
        }
        if(contentEle && newObj['contentColor']){
            contentEle.css('color',newObj['contentColor']);
        }
        if(contentEle && newObj['fontSize']){
            contentEle.css('font-size',newObj['fontSize']);
        }
        var buttonBig='';
        if(newObj['buttonBig']){
           buttonBig=' mayiui-btn-lg'; 
        }
        if (btn.length > 0) {
            buttonEle = createlDiv('mayiui-alert-button');
            ele.append(buttonEle);
            for (i = 0;i<btn.length;i++) {
                var btnEle=createlDiv('mayiui-alert-button-li');
                var btnTemp = createlButton('mayiui-btn mayiui-btn-'+btn[i]['style']+buttonBig,btn[i]['val']);
                btnTemp.clickFun=btn[i]['fun'];
                btnEle.append(btnTemp);
                buttonEle.append(btnEle);
                btnTemp.click(function(event){
                    $(this).clickFun(event);
                });
                btnArr.push(btnTemp);
            }
        }
        var zIndex = newObj['zIndex'];
        if (!zIndex) {
            zIndex = getMaxZIndex() + 99;
        };
        ele.css({
            'z-index': zIndex
        });
        if(newObj['mode']<2){
            var maxW = 0;//定义最大宽度
            if (titleEle) {
                maxW = titleEle.getWidth();
            }
            if (closeEle) {
                maxW += closeEle.getWidth();
            }
            
            if (buttonEle) {
                if (maxW < buttonEle.getWidth() + 20) {
                    maxW = buttonEle.getWidth() + 20;
                }
            }
            ele.css('width',maxW + 'px');
        }
        var contentRow='mayiui-alert-morerow';//默认单行样式
        if(icoEle){
            contentRow='mayiui-alert-morerow-ico';
        }
        var reg = /<[^>]+>/g;
        if (contentEle && contentEle.getWidth() < ele.getWidth() - 10 && !reg.test(content)) {
            contentEle.css({
                'text-align': 'center'
            });
            contentRow='mayiui-alert-onerow';//默认单行样式
            if(icoEle){
               contentRow='mayiui-alert-onerow-ico';
            }
        }
        if(contentEle){
            contentEle.addClass(contentRow);
        }       
        if(topEle && titleEle && !closeEle){
            titleEle.css({
                'width':'100%',
                'text-align':'center',
                'line-height':'2.4rem'
            });
        }
        if(contentEle){
            contentEle.css('width','100%');
        }
        if(buttonEle){
            buttonEle.css('width','100%');
        }
        eleShowAnimate(ele);
        setTimeOutClose(ele);
        return ele;
    }
    /*
     * disIframe
     * 弹出框架内容
    */
    function disIframe(newObj) {
        var ele = createlDiv('mayiui mayiui-iframe-dis mayiui-element'); //总体
        ele.mayiuiConfigObject = newObj;
        var closeFun = function() {
            eleClose(ele);
        };
        var arr = [];
        if (!isUndefined(newObj['mask']) || newObj['mask']) {
            disMask(ele); //显示遮罩层
        }
        if (newObj['style']) {
            ele.addClass('mayiui-bg-' + newObj['style']);
        }
        if (newObj['animate'] && newObj['animate'] > 0) {
            ele.addClass('mayiui-animate');
            ele.addClass(getAnimateClass(newObj));
        }
        if (newObj['size'] && valType(newObj['size']) == 'array') {
            arr = formatSize(newObj['size']);
            if (arr.length > 0) {
                ele.css('width', arr[0]);
            }
            if (arr.length > 1) {
                ele.css('height', arr[1]);
            }
        }
        cBody.append(ele);
        var title = newObj['title'];
        var content = newObj['content'];
        var conHeight = 0;
        var box = createlDiv('mayiui-element-box');
        ele.append(box);
        var topEle=null;
        if (title || newObj['closeButton'] || newObj['minimize'] || newObj['maximize']) {
            topEle = createlDiv('mayiui-element-top');
            box.append(topEle);
            ele.topEle = topEle;
            if (title) {
                var titleEle = createlDiv('mayiui-element-title');
                if (title != 'auto') {
                    titleEle.html(title);
                }
                topEle.append(titleEle);
                ele.titleEle = titleEle;
                if(newObj['titleColor']){
                    titleEle.css('color',newObj['titleColor']);
                }
            }
            if (newObj['closeButton']) {
                var closeEle = createlDiv('mayiui-element-close');
                topEle.append(closeEle);
                var closeButtom=createlButton('mayiui-btn-font'+getButtonColor(newObj['style']),'<i class="mayiuifont mayiui-icon-close"></i>');
                closeButtom.click(function(){
                    closeFun();
                });
                closeEle.append(closeButtom);
                ele.closeEle=closeEle;
            }
            if(newObj['maximize']){
                var maxZEle = createlDiv('mayiui-element-maximizebutton');
                topEle.append(maxZEle);
                var maxButtom=createlButton('mayiui-btn-font'+getButtonColor(newObj['style']),'<i class="mayiuifont mayiui-icon-maximize"></i>');
                maxButtom.click(function(){
                    ele.maximize();
                });
                maxZEle.append(maxButtom);
                ele.maxZEle=maxZEle;
            }
            if(newObj['maximize'] || newObj['minimize']){
                var redTEle = createlDiv('mayiui-element-reductionbutton');
                topEle.append(redTEle);
                var redButtom=createlButton('mayiui-btn-font'+getButtonColor(newObj['style']),'<i class="mayiuifont mayiui-icon-reduction"></i>');
                redButtom.click(function(){
                    ele.resetAttribute();
                });
                redTEle.append(redButtom);
                ele.redTEle=redTEle;
            }
            if (newObj['minimize']) {
                var minZEle = createlDiv('mayiui-element-minimizebutton');
                topEle.append(minZEle);
                var minButtom=createlButton('mayiui-btn-font'+getButtonColor(newObj['style']),'<i class="mayiuifont mayiui-icon-minimize"></i>');
                minButtom.click(function(){
                    ele.minimize();
                });
                minZEle.append(minButtom);
                ele.minZEle=minZEle;
            }
        }
        if(title && newObj['closeButton']){
            titleEle.css({
                'height':closeEle.getHeight()+'px',
                'line-height':closeEle.getHeight()+'px'
            });
        }
        var contentEle = createlDiv('mayiui-element-content');
        box.append(contentEle);
        ele.contentEle = contentEle;
        var iframeStyle = {};
        if (!isUndefined(newObj['overflow'])) {
            arr = newObj['overflow'];
            if (arr.length > 0) {
                iframeStyle['overflow-x'] = arr[0];
            }
            if (arr.length > 1) {
                iframeStyle['overflow-y'] = arr[1];
            }
        }
        var iframe = createlIframe('mayiui-element-iframe', {
            width: '100%',
            height: '100%'
        }, {
            scrolling: newObj['scrolling']
        }, iframeStyle);
        iframe.src = content;
        ele.iframe = iframe;
        contentEle.append(iframe);
        iframe.addListener('load', function(event) {
            if (!isUndefined(newObj['loadedHandler'])) {
                newObj['loadedHandler']();
            }
            var iframeTitle = '';
            if (title == 'auto') {
                try {
                    if (!isUndefined(this.contentWindow.document.title)) {
                        iframeTitle = this.contentWindow.document.title;
                    }
                } catch (event) {
                    console.error(event)
                }
                titleEle.html(iframeTitle);
            }
        });
        if (newObj['drag'] && topEle) {
            topEle.css('cursor', 'move');
            topEle.drag(ele);
        }
        conHeight = ele.getHeight();
        if (topEle) {
            conHeight -= topEle.getHeight();
        }
        contentEle.css('height', conHeight + 'px');
        var zIndex = newObj['zIndex'];
        if (!zIndex) {
            zIndex = getMaxZIndex() + 30;
        };
        ele.css({
            'z-index': zIndex
        });
        ele.defaultCss = ele.attr('style');
        eleShowAnimate(ele);
        setTimeOutClose(ele);
        return ele;
    }
    /*
     * disLevel
     * 弹出层内容
    */
    function disLevel(newObj) {
        var ele = null; //总体
        var capture = false; //是否是捕获的元件
        var content = newObj['content'];
        switch (valType(content)) {
            case 'object':
                ele = $(content);
                capture = true;
                break;
            case 'string':
                if (content.substr(0, 1) == '.' || content.substr(0, 1) == '#') {
                    if ($(content).eq) {
                        ele = $(content).eq(0);
                    }
                    else{
                        ele = $(content);
                    }
                    capture = true;
                    break;
                }
                break;
            default:
                break;
        }
        if (capture) {
            if(!ele){
                return;
            }
            if(!isUndefined(ele.parentEle)){
                eleClose(ele);
            }
            if(isUndefined(ele.oldStyle)){
                ele.oldStyle=ele.attr('style');
                if(!ele.oldStyle){
                    ele.oldStyle='';
                }
            }
            if(isUndefined(ele.oldClass)){
                ele.oldClass=ele.attr('class');
            }
            ele.addClass('mayiui mayiui-level-dis mayiui-element');
            ele.parentEle = ele.parentNode;
            ele.show();
            if (!isUndefined(ele.prev())) {
                ele.prevEle = ele.prev();
            }     
            if (!isUndefined(ele.next())) {
                ele.nextEle = ele.next();
            }
            if (newObj['drag']) {
                ele.css('cursor', 'move');
                ele.drag();
            }
        }
        else{ //不是捕获的则开始构建
            ele = createlDiv('mayiui mayiui-level-dis mayiui-element'); //总体
            cBody.append(ele);//该行必需要，因为只有显示出来才能计算样式
            var closeFun = function() {
                eleClose(ele);
            };
            var arr = [];
            if (newObj['style']) {
                ele.addClass('mayiui-bg-' + newObj['style']);
            }
            var title = newObj['title'];
            var content = newObj['content'];
            var conHeight = 0;
            var box = createlDiv('mayiui-element-box');
            ele.append(box);
            var topEle=null;
            if (title || newObj['closeButton'] || newObj['minimize'] || newObj['maximize']) {
                topEle = createlDiv('mayiui-element-top');
                box.append(topEle);
                ele.topEle = topEle;
                if (title) {
                    var titleEle = createlDiv('mayiui-element-title');
                    titleEle.html(title);
                    topEle.append(titleEle);
                    ele.titleEle = titleEle;
                    if(newObj['titleColor']){
                        titleEle.css('color',newObj['titleColor']);
                    }
                }
                if (newObj['closeButton']) {
                    var closeEle = createlDiv('mayiui-element-close');
                    topEle.append(closeEle);
                    var closeButtom=createlButton('mayiui-btn-font'+getButtonColor(newObj['style']),'<i class="mayiuifont mayiui-icon-close"></i>');
                    closeButtom.click(function(){
                        closeFun();
                    });
                    closeEle.append(closeButtom);
                    ele.closeEle=closeEle;
                }
                if (newObj['maximize']) {
                    var maxZEle = createlDiv('mayiui-element-maximizebutton');
                    topEle.append(maxZEle);
                    var maxButtom=createlButton('mayiui-btn-font'+getButtonColor(newObj['style']),'<i class="mayiuifont mayiui-icon-maximize"></i>');
                    maxButtom.click(function(){
                        ele.maximize();
                    });
                    maxZEle.append(maxButtom);
                    ele.maxZEle=maxZEle;
                }
                if(newObj['maximize'] || newObj['minimize']){
                    var redTEle = createlDiv('mayiui-element-reductionbutton');
                    topEle.append(redTEle);
                    var redButtom=createlButton('mayiui-btn-font'+getButtonColor(newObj['style']),'<i class="mayiuifont mayiui-icon-reduction"></i>');
                    redButtom.click(function(){
                        ele.resetAttribute();
                    });
                    redTEle.append(redButtom);
                    ele.redTEle=redTEle;
                }
                if (newObj['minimize']) {
                    var minZEle = createlDiv('mayiui-element-minimizebutton');
                    topEle.append(minZEle);
                    var minButtom=createlButton('mayiui-btn-font'+getButtonColor(newObj['style']),'<i class="mayiuifont mayiui-icon-minimize"></i>');
                    minButtom.click(function(){
                        ele.minimize();
                    });
                    minZEle.append(minButtom);
                    ele.minZEle=minZEle;
                }
            }
            
            var contentEle = createlDiv('mayiui-element-content');
            box.append(contentEle);
            ele.contentEle = contentEle;
            var conStyle = {};
            if (!isUndefined(newObj['overflow'])) {
                arr = newObj['overflow'];
                if (arr.length > 0) {
                    conStyle['overflow-x'] = arr[0];
                }
                if (arr.length > 1) {
                    conStyle['overflow-y'] = arr[1];
                }
            }
            
            contentEle.html(newObj['content']);
            if (newObj['drag'] && !isUndefined(ele.topEle)) {
                topEle.css('cursor', 'move');
                topEle.drag(ele);
            }
            conHeight = ele.getHeight();
            if (topEle) {
                conHeight -= topEle.getHeight();
            }
            contentEle.css('height', conHeight + 'px');
            if(conStyle){
                contentEle.css(conStyle);
            }
            if (newObj['size'] && valType(newObj['size']) == 'array') {
                arr = formatSize(newObj['size']);
                if (arr.length > 0) {
                    ele.css('width', arr[0]);
                }
                if (arr.length > 1) {
                    ele.css('height', arr[1]);
                }
            }
        }
        ele.mayiuiConfigObject = newObj;
        if (!isUndefined(newObj['mask']) || newObj['mask']) {
            disMask(ele); //显示遮罩层
        }
        if (newObj['animate'] && newObj['animate'] > 0) {
            ele.addClass('mayiui-animate');
            ele.addClass(getAnimateClass(newObj));
        }       
        cBody.append(ele);
        if(!isUndefined(ele.titleEle) && !isUndefined(ele.closeEle)){
            titleEle.css({
                'height':closeEle.getHeight()+'px',
                'line-height':closeEle.getHeight()+'px'
            });
        }
        var zIndex = newObj['zIndex'];
        if (!zIndex) {
            zIndex = getMaxZIndex() + 30;
        };
        ele.css({
            'z-index': zIndex
        });
        //判断是否需要外挂一个关闭按钮
        if(capture && newObj['closeButton']){
            var closeEle = createlDiv('mayiui-temp-close');
            ele.append(closeEle);
            var closeButtom=createlButton('mayiui-btn-font'+getButtonColor(newObj['style']),'<i class="mayiuifont mayiui-icon-close"></i>');
            closeButtom.click(function(){
                eleClose(ele);
            });
            closeEle.append(closeButtom);
            closeEle.css({
                'z-index': zIndex
            });
            ele.closeTempEle=closeEle;
        }
        eleShowAnimate(ele);
        setTimeOutClose(ele);
        return ele;
    }
    /*
     * 弹出消息提示
     */
    function disMsg(newObj){
        if(!newObj['content']){
            return;
        }
        var ele = createlDiv('mayiui mayiui-msg-dis'); //总体
        if(newObj['pi'] && valType(newObj['position'])=='number'){//程序智能化，则对偏移量进行自动排版
            newObj['piEle']='msg';
        }
        else{
            newObj['pi']=0;
        }
        if (newObj['time'] === 0) {
            newObj['time'] = byteLength(newObj['content']) * 62;
            if(newObj['time']<800){
                newObj['time']=800;
            }
        }
        
        ele.mayiuiConfigObject = newObj;
        //如果需要显示遮罩，则显示遮罩
        if (!isUndefined(newObj['mask']) && newObj['mask']) {
            disMask(ele); //显示遮罩层
        }
        if (newObj['style']) {
            ele.addClass('mayiui-msg');
            ele.addClass('mayiui-bg-' + newObj['style']);
        }
        if (newObj['animate'] && newObj['animate'] > 0) {
            ele.addClass('mayiui-animate');
            ele.addClass(getAnimateClass(newObj));
        }
        if (newObj['position']==10 || newObj['position']==12) {
            ele.addClass('mayiui-msg-100');
        }
        if(newObj['pi'] && valType(newObj['position'])=='number'){
            ele.addClass('mayiui-msg-pi'+newObj['pi']+'-'+newObj['position']);
        }
        //在提示文字前面放置图标            
        if (newObj['ico']) {
            var ico = newObj['ico'];
            var icoEle = createlDiv('mayiui-msg-ico');
            if (ICO.indexOf(ico)>-1) {
                icoEle.innerHTML ='<div class="mayiui-ico mayiui-ico-circular"><i class="mayiuifont mayiui-icon-'+ico+'"></i></div>';
            } else {
                icoEle.innerHTML = newObj['ico'];
            }
            if (newObj['icoColor']) {
                icoEle.css('color', newObj['icoColor']);
            }
            if (newObj['icoBgColor']) {
                icoEle.find('.mayiui-ico').eq(0).css('background-color', newObj['icoBgColor']);
            }
            ele.append(icoEle);
        }
        //构建提示正文
        var contentEle = createlDiv('mayiui-msg-content');
        contentEle.innerHTML = newObj['content'];
        ele.contentEle=contentEle;
        ele.append(contentEle);
        if(newObj['contentColor']){
            contentEle.css('color',newObj['contentColor']);
        }
        if(newObj['fontSize']){
            contentEle.css('font-size',newObj['fontSize']);
        }
        //构建关闭按钮
        if(newObj['closeButton']){
            var closeDiv = createlDiv('mayiui-msg-close');
            ele.append(closeDiv);
            var closeButtom=createlButton('mayiui-btn-font'+getButtonColor(newObj['style']),'<i class="mayiuifont mayiui-icon-close"></i>');
            closeButtom.click(function(){
                eleClose(ele);
            });
            closeDiv.append(closeButtom);
        }
        //设置深度
        var zIndex = newObj['zIndex'];
        if (!zIndex) {
            zIndex = getMaxZIndex() + 10;
        };
        ele.css({
            'z-index': zIndex
        });
        //添加到页面中
        cBody.append(ele);
        //添加显示效果，必需先加载到页面中才能添加效果
        eleShowAnimate(ele);
        setTimeOutClose(ele)
    }
    /*
     * disTip
     * Tip功能
    */
    function disTip(newObj) {
        if (!newObj['el']) {
            return;
        }
        var el = null;
        if(!isUndefined(newObj['el'])){
            switch (valType(newObj['el'])) {
                case 'htmlarray':
                    el = $(newObj['el']).eq(0);
                    break;
                case 'array':
                    el = $(newObj['el'][0]);
                    break;
                case 'object':
                    if(!isUndefined(newObj['el'].length) && newObj['el'].length>0){
                        newObj['el']=newObj['el'][0];
                    }
                    el = $(newObj['el']);
                    break;    
                default:
                    el = $(newObj['el']);
                    if (valType(el) == 'htmlarray') {
                        el = el.eq(0);
                    }
                    break;
            }
        }
        if(!el || !newObj['content']){
            return;
        }
        if(!isUndefined(el.mayiuiTip)){
            eleClose(el.mayiuiTip,true);
            el.mayiuiTip=null;
        }
        var ele = createlDiv('mayiui mayiui-tip-dis mayiui-tip');
        newObj['position'] = limitNum(newObj['position'], 0, 8);
        ele.mayiuiConfigObject = newObj;
        ele.el = el;
        el.mayiuiTip=ele;
        if (newObj['animate'] && newObj['animate'] > 0) {
            ele.addClass('mayiui-animate');
            ele.addClass(getAnimateClass(newObj))
        }
        cBody.append(ele);
        var contentEle = createlDiv('mayiui-tip-content',newObj['content']);
        if (newObj['style']) {
            contentEle.addClass('mayiui-bg-' + newObj['style']);
        }
        if (newObj['contentColor']) {
            contentEle.css('color',newObj['contentColor']);
        }
        if(newObj['fontSize']){
            contentEle.css('font-size',newObj['fontSize']);
        }
        ele.append(contentEle);
        ele.contentEle = contentEle;
        ele.resize(function() {
            checkTipAttribute(ele);
        });
        ele.scroll(function() {
            checkTipAttribute(ele);
        });
        if (newObj['time'] === 0) {
            newObj['time'] = byteLength(newObj['content']) * 60;
            if(newObj['time']<1000){
                newObj['time']=1000;
            }
        }
        checkTipAttribute(ele);
        setTimeOutClose(ele);
        return ele;
    }
    /*
     * checkTipAttribute
     * 判断tip的位置和样式
    */
    function checkTipAttribute(ele) {
        var el=ele['el'];
        var at = ele.mayiuiConfigObject;
        var pt = at['position'];
        var elOffset = el.offset(); //绑定的节点属性
        var winE = getWindowSize();
        var tw = 8;
        var twC = tw + 'px solid ';
        var twB = tw * 0.5 + 'px solid ';
        var triangle = null;
        var elLeft = elOffset['left'],
            elWidth = el.getWidth(),
            elRight = winE['width'] - elLeft - elWidth;
        var elTop = elOffset['top'],
            elHeight = el.getHeight(),
            elBottom = winE['height'] - elTop - elHeight;
        var conWidth = ele.contentEle.getWidth() + tw,
            conHeight = ele.contentEle.getHeight() + tw;
        if (pt == 0) { //如果是自动，则进行判断
            pt = 8;
            if (conWidth < elRight) { //pt=4,5,6
                if (elTop > conHeight) {
                    pt = 4;
                } else if (elBottom > conHeight) {
                    pt = 6;
                } else {
                    pt = 5;
                }
            } else if (conWidth < elLeft) { //pt=2,1,8
                if (elTop > conHeight) {
                    pt = 2;
                } else if (elBottom > conHeight) {
                    pt = 8;
                } else {
                    pt = 1;
                }
            } else {
                if (elTop > conHeight) {
                    pt = 3;
                } else {
                    pt = 7;
                }
            }
        }
        if (ele.triangle && ele.position != pt) {
            ele.triangle.remove();
            ele.triangle = null;
        }
        ele.position = pt;
        if (!ele.triangle) {
            var triangle = createlDiv('mayiui-tip-triangle');;
            ele.append(triangle);
            ele.triangle = triangle;
            if (pt > 4 && pt < 8) {
                ele.insertBefore(ele.triangle, ele.contentEle);
            }
            //定义三角形形状
            var tg = {};
            var bC = ele.contentEle.css('background-color');
            var old = ele.contentEle.attr('class');
            var xzWidth = 0,
                xzHeight = 0;
            var contentColor=ele.contentEle.css('color');
            var fontSize=ele.contentEle.css('font-size');
            ele.contentEle.attr('class', '');
            ele.contentEle.attr('style', '');
            ele.attr('style', '');
            ele.contentEle.attr('class', old);
            if(contentColor){
                ele.contentEle.css('color',contentColor);
            }
            if(fontSize){
                ele.contentEle.css('font-size',fontSize);
            }
            switch (pt) {
                case 1:
                    //左
                    tg = {
                        'border-top': twC + 'transparent',
                        'border-left': twC + bC,
                        'border-bottom': twC + 'transparent',
                        'margin-top': (ele.contentEle.getHeight() - tw * 2) * 0.5 + 'px'
                    };
                    xzWidth = tw + tw * 0.5;
                    break;
                case 2:
                    //左上
                    tg = {
                        'border-top': twB + 'transparent',
                        'border-left': twC + bC,
                        'border-bottom': twB + 'transparent',
                        'transform': 'rotate(45deg)',
                        'position': 'relative',
                        'left': -(tw * 0.5) + 'px',
                        'top': (ele.contentEle.getHeight() - tw * 0.5) + 'px'
                    };
                    xzWidth = tw + tw * 0.5;
                    xzHeight = tw * 0.5;
                    break;
                case 3:
                    //上
                    tg = {
                        'border-left': twC + 'transparent',
                        'border-top': twC + bC,
                        'border-right': twC + 'transparent',
                        'margin-left': ((ele.contentEle.getWidth() - tw * 2) * 0.5) + 'px'
                    };
                    ele.contentEle.css({
                        'float': 'none'
                    });
                    xzHeight = tw;
                    break;
                case 4:
                    //右上
                    tg = {
                        'border-top': twB + 'transparent',
                        'border-right': twC + bC,
                        'border-bottom': twB + 'transparent',
                        'transform': 'rotate(-45deg)',
                        'position': 'relative',
                        'top': -(tw * 0.5) + 'px'
                    };
                    ele.contentEle.css({
                        'float': 'none',
                        'margin-left': (tw * 0.5) + 'px'
                    });
                    xzWidth = tw + tw * 0.5;
                    xzHeight = tw * 0.5;
                    break;
                case 5:
                    //右
                    tg = {
                        'border-top': twC + 'transparent',
                        'border-right': twC + bC,
                        'border-bottom': twC + 'transparent',
                        'margin-top': (ele.contentEle.getHeight() - tw * 2) * 0.5 + 'px'
                    };
                    xzWidth = tw + tw * 0.5;
                    break;
                case 6:
                    //右下
                    tg = {
                        'border-top': twB + 'transparent',
                        'border-right': twC + bC,
                        'border-bottom': twB + 'transparent',
                        'transform': 'rotate(45deg)'
                    };
                    ele.contentEle.css({
                        'position': 'relative',
                        'left': -(tw * 0.5) + 'px',
                        'top': tw * 0.5 + 'px'
                    });
                    xzWidth = tw + tw * 0.5;
                    xzHeight = tw * 0.5;
                    break;
                case 7:
                    //下
                    tg = {
                        'border-left': twC + 'transparent',
                        'border-bottom': twC + bC,
                        'border-right': twC + 'transparent',
                        'float': 'none',
                        'margin-left': (ele.contentEle.getWidth() - tw * 2) * 0.5 + 'px'
                    };
                    xzHeight = tw;
                    break;
                case 8:
                    //左下
                    tg = {
                        'border-top': twB + 'transparent',
                        'border-left': twC + bC,
                        'border-bottom': twB + 'transparent',
                        'transform': 'rotate(-45deg)',
                        'margin-left': -(tw * 0.5) + 'px'
                    };
                    ele.contentEle.css({
                        'position': 'relative',
                        'top': tw * 0.5 + 'px'
                    });
                    xzWidth = tw + tw * 0.5;
                    xzHeight = tw * 0.5;
                    break;
            }
            ele.triangle.attr('style', '');
            ele.triangle.css(tg);
            var position = 'absolute';
            if (el.fixed()) {
                position = 'fixed';
            }
            var zIndex = getMaxZIndex() + 1;
            if (ele.css('z-index') && ele.css('z-index') != 'auto') {
                zIndex = ele.css('z-index');
            }
            if (at['zIndex']) {
                zIndex = at['zIndex'];
            };
            ele.css({
                'position': position,
                'width': ele.contentEle.getWidth() + xzWidth + 'px',
                'height': ele.contentEle.getHeight() + xzHeight + 'px',
                'z-index': zIndex
            });
        }
        var eleOffset = ele.offset();
        var left = 0,
            top = 0,
            deviation = at['deviation'];
        switch (pt) {
        case 1:
            left = elLeft - ele.getWidth() - deviation;
            top = elTop + (elHeight - ele.getHeight()) * 0.5;
            break;
        case 2:
            left = elLeft - ele.getWidth() - (deviation * 0.5);
            top = elTop - ele.getHeight() - (deviation * 0.5);
            break;
        case 3:
            left = elLeft + (elWidth - ele.getWidth()) * 0.5;
            top = elTop - ele.getHeight() - deviation;
            break;
        case 4:
            left = elLeft + elWidth + (deviation * 0.5);
            top = elTop - ele.getHeight() - (deviation * 0.5);
            break;
        case 5:
            left = elLeft + elWidth + deviation;
            top = elTop + (elHeight - ele.getHeight()) * 0.5;
            break;
        case 6:
            left = elLeft + elWidth + (deviation * 0.5);
            top = elTop + elHeight + (deviation * 0.5);
            break;
        case 7:
            left = elLeft + (elWidth - ele.getWidth()) * 0.5;
            top = elTop + elHeight + deviation;
            break;
        case 8:
            left = elLeft - ele.getWidth() - (deviation * 0.5);
            top = elTop + elHeight + (deviation * 0.5);
            break;
        }
        ele.css({
            'left': left + 'px',
            'top': top + 'px'
        });
        if (at['animateTime']) {          
            ele.css({
                '-webkit-animation-duration': at['animateTime'] * 0.001 + 's',
                'animation-duration': at['animateTime'] * 0.001 + 's'
            });
        }
    }
    /*
     * disMark
     * 角标提示功能
    */
    function disMark(newObj) {
        if (!newObj['el']) {
            return;
        }
        var el = null;
        switch (valType(newObj['el'])) {
            case 'htmlarray':
                el = $(newObj['el']).eq(0);
                break;
            case 'array':
                el = $(newObj['el'][0]);
                break;
            case 'object':
                if(!isUndefined(newObj['el'].length) && newObj['el'].length>0){
                    newObj['el']=newObj['el'][0];
                }
                el = $(newObj['el']);
                break;    
            default:
                el = $(newObj['el']);
                if (valType(el) == 'htmlarray') {
                    el = el.eq(0);
                }
                break;
        }
        if (!el) {
            return;
        }
        if(!isUndefined(el.mayiuiMark)){
            eleClose(el.mayiuiMark);
            el.mayiuiMark=null;
        }
        
        var ele = createlDiv('mayiui mayiui-mark-dis mayiui-mark'); //总体
        newObj['position'] = limitNum(newObj['position'], 0, 8);
        ele.mayiuiConfigObject = newObj;
        ele.el = el;
        el.mayiuiMark=ele;
        var cssName = '';
        var content = newObj['content'];
        if (newObj['style']) {
            ele.addClass('mayiui-bg-' + newObj['style'])
        }
        if (newObj['animate'] && newObj['animate'] > 0) {
            ele.addClass('mayiui-animate');
            ele.addClass(getAnimateClass(newObj))
        }
        if (newObj['size'] && valType(newObj['size']) == 'array') {
            var arr = formatSize(newObj['size']);
            if (arr.length > 0 && arr[0]) {
                ele.css('width', arr[0]);
            }
            if (arr.length > 1 && arr[1]) {
                ele.css('height', arr[1]);
                ele.css('line-height', arr[1]);
            }
            if (arr.length > 2 && arr[2]) {
                ele.css('border-radius', arr[2]);
            }
        }
        ele.innerHTML = newObj['content'];
        if (newObj['contentColor']) {
            ele.css('color',newObj['contentColor']);
        }
        if(newObj['fontSize']){
            ele.css('font-size',newObj['fontSize']);
        }
        cBody.append(ele);
        checkMarkAttribute(el, ele);
        ele.resize(function() {
            checkMarkAttribute(el, ele);
        });
        ele.scroll(function() {
            checkMarkAttribute(el, ele);
        });
        if (newObj['time'] === 0) {
            newObj['time'] = -1;
        }
        setTimeOutClose(ele);
        return ele;
    }
    /*
     * checkMarkAttribute
     * 判断mask的位置和样式
    */
    function checkMarkAttribute(el, ele) {
        var at = ele.mayiuiConfigObject;
        var pt = at['position'];
        var elOffset = el.offset(); //绑定的节点属性
        var winE = getWindowSize();
        var elLeft = elOffset['left'],
            elWidth = el.getWidth(),
            elRight = winE['width'] - elLeft - elWidth;
        var elTop = elOffset['top'],
            elHeight = el.getHeight(),
            elBottom = winE['height'] - elTop - elHeight;
        if (pt == 0) { //如果是自动，则进行判断
            pt = 8;
            if (ele.getWidth() < elRight) { //pt=4,5,6
                if (elTop > ele.getHeight()) {
                    pt = 4;
                } else if (elBottom > ele.getHeight()) {
                    pt = 6;
                } else {
                    pt = 5;
                }
            } else if (ele.getWidth() < elLeft) { //pt=2,1,8
                if (elTop > ele.getHeight()) {
                    pt = 2;
                } else if (elBottom > ele.getHeight()) {
                    pt = 8;
                } else {
                    pt = 1;
                }
            } else {
                if (elTop > ele.getHeight()) {
                    pt = 3;
                } else {
                    pt = 7;
                }
            }
        }
        var position = 'absolute';
        if (el.fixed()) {
            position = 'fixed';
        }
        var zIndex = getMaxZIndex() + 1;
        if (ele.css('z-index') && ele.css('z-index') != 'auto') {
            zIndex = ele.css('z-index');
        }
        if (at['zIndex']) {
            zIndex = at['zIndex'];
        };
        ele.css({
            'position': position,
            'z-index': zIndex
        });
        var eleOffset = ele.offset();
        var left = 0,
            top = 0,
            deviation = at['deviation'];
        switch (pt) {
        case 1:
            left = elLeft - ele.getWidth() + deviation;
            top = elTop + (elHeight - ele.getHeight()) * 0.5;
            break;
        case 2:
            left = elLeft - ele.getWidth() + deviation;
            top = elTop - ele.getHeight() + deviation;
            break;
        case 3:
            left = elLeft + (elWidth - ele.getWidth()) * 0.5;
            top = elTop - ele.getHeight() + deviation;
            break;
        case 4:
            left = elLeft + elWidth - deviation;
            top = elTop - ele.getHeight() + deviation;
            break;
        case 5:
            left = elLeft + elWidth - deviation;
            top = elTop + (elHeight - ele.getHeight()) * 0.5;
            break;
        case 6:
            left = elLeft + elWidth - deviation;
            top = elTop + elHeight - deviation;
            break;
        case 7:
            left = elLeft + (elWidth - ele.getWidth()) * 0.5;
            top = elTop + elHeight - deviation;
            break;
        case 8:
            left = elLeft - ele.getWidth() + deviation;
            top = elTop + elHeight - deviation;
            break;
        }
        ele.css({
            'left': left + 'px',
            'top': top + 'px'
        });
        if (at['animateTime']) {
            ele.css({
                '-webkit-animation-duration': at['animateTime'] * 0.001 + 's',
                'animation-duration': at['animateTime'] * 0.001 + 's'
            });
        }
    }
    /*
     * loading
    */
    function disLoading(newObj) {
        var ele = createlDiv('mayiui mayiui-loading-dis mayiui-loading'); //总体
        if (newObj['time'] === 0) {
            newObj['time'] = -1;
        }
        ele.mayiuiConfigObject = newObj;
        if (!isUndefined(newObj['mask']) && newObj['mask']) {
            disMask(ele); //显示遮罩层
        }
        if(newObj['mode']==1){
            ele.addClass('mayiui-loading-mode-1');
            if (newObj['style']) {
                ele.addClass('mayiui-bg-' + newObj['style'])
            }
        }
        
        cBody.append(ele);
        var icoEle=createlDiv('mayiui-loading-ico-ele');
        var time=0;
        var divI=0;
        var divClass='';
        var divArr=[];
        var timeOut=function(){
            divArr[divI].addClass(divClass);
            divArr[divI].show();
            if(divI<divArr.length-1){
                divI++;
                setTimeout(timeOut,200);
            }
        };
        var am0=function(){
            icoEle.addClass('mayiui-loading-ico-0');
            divClass='mayiui-animate-sizein';
            for(var i=0;i<3;i++){
                var ico=createlDiv('mayiui-loading-ico');
                icoEle.append(ico);
                ico.hide();
                divArr.push(ico);
            }
            timeOut();
        };
        var am1=function(){
            icoEle.addClass('mayiui-loading-ico-1');
            divClass='mayiui-animate-sizerotatein';
            for(var i=0;i<4;i++){
                var ico=createlDiv('mayiui-loading-ico');
                icoEle.append(ico);
                ico.hide();
                divArr.push(ico);
            }
            timeOut();
        };
        var am2=function(){
            icoEle.addClass('mayiui-loading-ico-2');
            var ico=createlDiv('mayiui-loading-ico mayiui-animate-rotatein');
            divArr.push(ico);
            icoEle.append(ico);
        };
        var am3=function(){
            icoEle.addClass('mayiui-loading-ico-3');
            divClass='mayiui-animate-scaley';
            for(var i=0;i<6;i++){
                var ico=createlDiv('mayiui-loading-ico');
                icoEle.append(ico);
                ico.hide();
                divArr.push(ico);
            }
            timeOut();
        };
        switch(parseInt(newObj['animate'])){
            case 1:
                am1();
                break;
            case 2:
                am2();
                break;
            case 3:
                am3();
                break;
            default:
                am0();
                break;
        }
        ele.append(icoEle);
        
        if(newObj['content']){
            var contentEle=createlDiv('mayiui-loading-content',newObj['content']);
            ele.contentEle=contentEle;
            ele.append(contentEle);
            if(newObj['contentColor']){
                 contentEle.css('color',newObj['contentColor']);
                 for(var i=0;i<divArr.length;i++){
                     if(parseInt(newObj['animate'])!=2){
                         divArr[i].css('background',newObj['contentColor']);
                     }
                     else{
                         divArr[i].css('border-color',newObj['contentColor']+' '+newObj['contentColor']+' transparent');
                     }
                 }
            }
            if(newObj['fontSize']){
                contentEle.css('font-size',newObj['fontSize']);
            }
            contentEle.css({
                'float':'none',
                'margin-left':'auto',
                'margin-right':'auto',
                'width':'100%',
                'text-align':'center'
            });
        }
        icoEle.css({
            'float':'none',
            'margin':'auto'
        });
        
        var zIndex = newObj['zIndex'];
        if (!zIndex) {
            zIndex = getMaxZIndex() + 100;
        };
        ele.css({
            'margin-left':-(ele.getWidth()*.5)+'px',
            'margin-top':-(ele.getHeight()*.5)+'px',
            'z-index': zIndex
        });
        setTimeOutClose(ele);
        return ele;
    }
    /*
     * setTimeOutClose
     * 延时关闭
    */
    function setTimeOutClose(ele) {
        var at = ele.mayiuiConfigObject;
        if (at['time'] > 0) {
            setTimeout(function(){
                eleClose(ele);
            },at['time']);
        }
    }
    /*
     * eleShowAnimate
     * 判断动画效果
    */
    function eleShowAnimate(ele) {
        var at = ele.mayiuiConfigObject;
        if (at['animateTime']) {
            ele.css({
                '-webkit-animation-duration': at['animateTime'] * 0.001 + 's',
                'animation-duration': at['animateTime'] * 0.001 + 's'
            });
        }
        var newCss=setUpElePosition({
            ele: ele,
            ption: at['position'],
            deviation: at['deviation'],
            pi:at['pi'],
            piEle:at['piEle']
        });
        ele.css(newCss);
        ele.defaultCss = ele.attr('style');
        if(at['position']==9 || at['position']==10 || at['position']==11 || at['position']==12){
            switch(at['position']){
                case 9:
                    ele.css('left',-ele.getWidth()+'px');
                    ele.animate('left:'+newCss['left'],at['animateTime']);
                    break;
                case 10:
                    ele.css('top',-ele.getHeight()+'px');
                    ele.animate('top:'+newCss['top'],at['animateTime']);
                    break;
                case 11:
                    ele.css('right',-ele.getWidth()+'px');
                    ele.animate('right:'+newCss['right'],at['animateTime']);
                    break;
                case 12:
                    ele.css('bottom',-ele.getHeight()+'px');
                    ele.animate('bottom:'+newCss['bottom'],at['animateTime']);
                    break;
            }
        }
    }
    /*
     * setUpElePosition
     * 初始设置元件显示位置
     * ption设置成数字时0=居中，1=左，2=左上，3=上，4=右上，5=右，6=右下，7=下，8=左下,9=左,10=上，11=右，12=下
     * deviation=偏移量
     * pi=智能化
     * inside=是否在内部，默认是内部
    */
    function setUpElePosition(obj) {
        var attribute = {
            ele: null,
            eleAttr: null,
            ption: 0,
            deviation: 0,
            pi:0,
            piEle:'',
            inside: true
        };
        attribute = standardization(attribute, obj);
        
        var cEA = {
            'width': 0,
            'height': 0
        };
        if (!isUndefined(attribute['ele'])) {
            cEA = {
                'width': attribute['ele'].getWidth(),
                'height': attribute['ele'].getHeight()
            };
        }
        if (!isUndefined(attribute['eleAttr'])) {
            cEA = attribute['eleAttr']; //内容节点属性
        }
        var ption = attribute['ption'];
        var deviation = attribute['deviation'];
        var inside = attribute['inside'];
        var style = {}; //普通样式
        if (valType(ption) == 'array') {
            if (ption.length > 0) {
                style['left'] = ption[0];
            }
            if (ption.length > 1) {
                style['top'] = ption[1];
            }
            if (ption.length > 2) {
                style['opacity'] = parseFloat(ption[2]);
            }
            return style;
        }
        //ption=0，中间对齐，1=左，2=左上，3=上，4=右上，5=右，6=右下，7=下，8=左下，9=下，10=左
        var maxTop=0,maxBottom=0,maxLeft=0,maxRight=0,piMTop=0;
        var eleNum=0,eleLength=0;
        var windowWH=getWindowSize();
        if(attribute['pi'] && attribute['piEle'] && inside){
            if($('.mayiui-'+attribute['piEle']+'-pi'+attribute['pi']+'-'+ption)){
                var eleTemp=$('.mayiui-'+attribute['piEle']+'-pi'+attribute['pi']+'-'+ption);
                eleLength=$('.mayiui-'+attribute['piEle']+'-pi'+attribute['pi']+'-'+ption).length;
                eleTemp.each(function(index,eleObj){
                    if(index<eleLength-1){
                        var offset=eleObj.offset();
                        if(maxBottom<parseInt(eleObj.css('bottom'))+eleObj.getHeight()){
                            maxBottom=parseInt(eleObj.css('bottom'))+eleObj.getHeight();
                        }
                        if(maxBottom>windowWH['height']-eleObj.getHeight()){
                            maxBottom=0
                        }
                        
                        if(maxTop<offset['top']+eleObj.getHeight()){
                            maxTop=offset['top']+eleObj.getHeight();
                        }
                        if(maxTop>windowWH['height']-eleObj.getHeight()){
                            maxTop=0
                        }
                        if(maxLeft<offset['left']+eleObj.getWidth()){
                            maxLeft=offset['left']+eleObj.getWidth();
                        }
                        if(maxLeft>windowWH['width']-eleObj.getWidth()){
                            maxLeft=0
                        }
                        if(maxRight<parseInt(eleObj.css('right'))+eleObj.getWidth()){
                            maxRight=parseInt(eleObj.css('right'))+eleObj.getWidth();
                        }
                        if(maxRight>windowWH['width']-eleObj.getWidth()){
                            maxRight=0
                        }
                        piMTop+=cEA['height']+deviation;
                        if(piMTop>windowWH['height']*0.5){
                            piMTop=0;
                        }
                        var marginTop=0,marginLeft=0,left=0,top=0,right=0,bottom=0;
                        var newStyle=styleToObject(eleObj.attr('style'));
                        if(attribute['pi']==2){
                            switch (ption) {
                                case 0:
                                    marginTop=parseInt(newStyle['margin-top']);
                                    if(marginTop>(deviation+eleObj.getHeight())-windowWH['height']*0.5){
                                        marginTop-=deviation;
                                        marginTop-=eleObj.getHeight();
                                    }
                                    newStyle['margin-top']=marginTop+'px';
                                    break;
                                case 1:
                                case 9:
                                    left=parseInt(newStyle['left']);
                                    if(left<windowWH['width']-(deviation+eleObj.getWidth())*2){
                                        left+=deviation;
                                        left+=eleObj.getWidth();
                                    }
                                    newStyle['left']=left+'px';
                                    break;
                                case 2:
                                    left=parseInt(newStyle['left']);
                                    if(left<windowWH['width']-(deviation+eleObj.getWidth())*2){
                                        left+=deviation;
                                    }
                                    newStyle['left']=left+'px';
                                    top=parseInt(newStyle['top']);
                                    if(top<windowWH['height']-deviation-eleObj.getHeight()){
                                        top+=deviation;
                                        top+=eleObj.getHeight();
                                    }
                                    newStyle['top']=top+'px';
                                    break;
                                case 3:
                                case 10:
                                    top=parseInt(newStyle['top']);
                                    if(top<windowWH['height']-deviation-eleObj.getHeight()){
                                        top+=deviation;
                                        top+=eleObj.getHeight();
                                    }
                                    newStyle['top']=top+'px';
                                    break;
                                case 4:
                                    right=parseInt(newStyle['right']);
                                    if(right<windowWH['width']-deviation-eleObj.getWidth()){
                                        right+=deviation;
                                    }
                                    newStyle['right']=right+'px';
                                    top=parseInt(newStyle['top']);
                                    if(top<windowWH['height']-deviation-eleObj.getHeight()*2){
                                        top+=deviation;
                                        top+=eleObj.getHeight();
                                    }
                                    newStyle['top']=top+'px';
                                    break;
                                case 5:
                                case 11:
                                    right=parseInt(newStyle['right']);
                                    if(right<windowWH['width']-(deviation+eleObj.getWidth())*2){
                                        right+=deviation;
                                        right+=eleObj.getWidth();
                                    }
                                    newStyle['right']=right+'px';
                                    break;
                                case 6:
                                    right=parseInt(newStyle['right']);
                                    if(right<windowWH['width']-(deviation+eleObj.getWidth())*2){
                                        right+=deviation;
                                    }
                                    newStyle['right']=right+'px';
                                    bottom=parseInt(newStyle['bottom']);
                                    if(bottom<windowWH['height']-deviation-eleObj.getHeight()){
                                        bottom+=deviation;
                                        bottom+=eleObj.getHeight();
                                    }
                                    newStyle['bottom']=bottom+'px';
                                    break;
                                case 7:
                                case 12:
                                    bottom=parseInt(newStyle['bottom']);
                                    if(bottom<windowWH['height']-deviation-eleObj.getHeight()){
                                        bottom+=deviation;
                                        bottom+=eleObj.getHeight();
                                    }
                                    newStyle['bottom']=bottom+'px';
                                    break;
                                case 8:
                                    left=parseInt(newStyle['left']);
                                    if(left<windowWH['width']-(deviation+eleObj.getWidth())*2){
                                        left+=deviation;
                                    }
                                    newStyle['left']=left+'px';
                                    bottom=parseInt(newStyle['bottom']);
                                    if(bottom<windowWH['height']-deviation-eleObj.getHeight()){
                                        bottom+=deviation;
                                        bottom+=eleObj.getHeight();
                                    }
                                    newStyle['bottom']=bottom+'px';
                                    break;
                            }
                            eleObj.animateStop().animate(animationStyle(newStyle,ption),eleObj.mayiuiConfigObject['animateTime']);
                        }
                        if(attribute['pi']==3){
                            var ptionTemp=ption;
                            switch (ption) {
                                case 0:
                                case 1:
                                case 5:
                                    ptionTemp=0;
                                    marginTop=parseInt(newStyle['margin-top']);
                                    if(marginTop<windowWH['height']*0.5-deviation-eleObj.getHeight()){
                                        marginTop+=deviation;
                                        marginTop+=eleObj.getHeight();
                                    }
                                    newStyle['margin-top']=marginTop+'px';
                                    break;
                                case 2:
                                case 3:
                                case 4:
                                case 10:
                                    ptionTemp=3;
                                    top=parseInt(newStyle['top']);
                                    if(top<windowWH['height']-deviation-eleObj.getHeight()){
                                        top+=deviation;
                                        top+=eleObj.getHeight();
                                    }
                                    newStyle['top']=top+'px';
                                    break;
                                case 6:
                                case 7:
                                case 8:
                                case 12:
                                    ptionTemp=7;
                                    bottom=parseInt(newStyle['bottom']);
                                    if(bottom<windowWH['height']-deviation-eleObj.getHeight()){
                                        bottom+=deviation;
                                        bottom+=eleObj.getHeight();
                                    }
                                    newStyle['bottom']=bottom+'px';
                                    break;
                                case 9:
                                    left=parseInt(newStyle['left']);
                                    if(left<windowWH['width']-(deviation+eleObj.getWidth())*2){
                                        left+=deviation;
                                        left+=eleObj.getWidth();
                                    }
                                    newStyle['left']=left+'px';
                                    break;
                                case 11:
                                    right=parseInt(newStyle['right']);
                                    if(right<windowWH['width']-(deviation+eleObj.getWidth())*2){
                                        right+=deviation;
                                        right+=eleObj.getWidth();
                                    }
                                    newStyle['right']=right+'px';
                                    break;
                            }
                            eleObj.animateStop().animate(animationStyle(newStyle,ptionTemp),eleObj.mayiuiConfigObject['animateTime']);
                        }
                        
                        marginTop=marginLeft=left=top=right=bottom=0;
                    }
                    
                });
            }
        }
        eleNum=eleLength-1;
        if(eleNum==0 || attribute['pi']>1){
            eleNum=0;
            maxTop=maxBottom=maxLeft=maxRight=piMTop=0;
        }
        switch (ption) {
            case 0:
                style = {
                    'left': '50%',
                    'top': '50%',
                    'margin-left': -(cEA['width'] * 0.5) + 'px',
                    'margin-top': -(cEA['height'] * 0.5+piMTop)  + 'px'
                };
                break;
            case 1:
                style = {
                    'left': deviation +maxLeft + 'px',
                    'top': '50%',
                    'margin-top': -cEA['height'] * 0.5 + 'px'
                };
                break;
            case 2:
                style = {
                    'left': deviation +(deviation*eleNum)+ 'px',
                    'top': deviation+maxTop + 'px'
                };
                break;
            case 3:
                style = {
                    'left': '50%',
                    'top': deviation+maxTop + 'px',
                    'margin-left': -cEA['width'] * 0.5 + 'px'
                };
                break;
            case 4:
                style = {
                    'right': deviation +(deviation*eleNum)+ 'px',
                    'top': deviation+maxTop + 'px'
                };
                break;
            case 5:
                style = {
                    'right': deviation+maxRight + 'px',
                    'top': '50%',
                    'margin-top': -cEA['height'] * 0.5 + 'px'
                };
                break;
            case 6:
                style = {
                    'right': deviation +(deviation*eleNum) + 'px',
                    'bottom': deviation+maxBottom + 'px'
                };
                break;
            case 7:
                style = {
                    'left': '50%',
                    'margin-left': -cEA['width'] * 0.5 + 'px',
                    'bottom': deviation+maxBottom + 'px'
                };
                break;
            case 8:
                style = {
                    'left': deviation +(deviation*eleNum)+ 'px',
                    'bottom': deviation+maxBottom + 'px'
                };
                break;
            case 9:
                style = {
                    'left': deviation +maxLeft+ 'px',
                    'top': deviation + 'px',
                    'bottom': deviation + 'px'
                };
                break;
            case 10:
                style = {
                    'left': deviation + 'px',
                    'top': deviation+maxTop + 'px',
                    'right': deviation + 'px'
                };
                break;
            case 11:
                style = {
                    'top': deviation + 'px',
                    'bottom': deviation + 'px',
                    'right': deviation+maxRight + 'px'
                };
                break;
            case 12:
                style = {
                    'left': deviation + 'px',
                    'right': deviation + 'px',
                    'bottom': deviation+maxBottom + 'px'
                };
                break;
            default:
                break;
        }
        if (ption == 10 || ption == 12) {
            style['width'] = 'inherit';
            style['max-height'] = '100%';
        }
        if (ption == 9 || ption == 11) {
            style['height'] = 'inherit';
            style['max-width'] = '100%';
        }
        if (!inside) {
            if (ption == 1 || ption == 2 || ption == 8 || ption == 9) {
                style['left'] = -cEA['width'] + 'px';
            }
            if (ption == 4 || ption == 5 || ption == 6 || ption == 11) {
                style['right'] = -cEA['width'] + 'px';
            }
            if (ption == 2 || ption == 3 || ption == 4 || ption == 10) {
                style['top'] = -cEA['height'] + 'px';
            }
            if (ption == 6 || ption == 7 || ption == 8 || ption == 12) {
                style['bottom'] = -cEA['height'] + 'px';
            }
            if (ption == 0) {
                style['margin-top'] = '0px';
            }
        }
        return style;
    }
    /*
     * disMask
     * 显示遮罩层
    */
    function disMask(bindingEle) {
        var at=bindingEle.mayiuiConfigObject;
        var ele = createlDiv('mayiui-mask'); //构建一个遮罩层
        if(at['maskBg']){
            ele.css('background',at['maskBg']);
        }
        cBody.append(ele);
        var height = '100%';
        if (ele.getHeight() < 5) {
            height = cBody.getHeight() + 'px';
        }
        ele.css({
            'z-index': getMaxZIndex() + 20,
            'height': height
        });
        bindingEle.mask = ele;
        if (!isUndefined(at['maskClickClose']) && at['maskClickClose']) {
            ele.click(function(){
                eleClose(bindingEle);
            });
        }
    }
    /*
     * createlDiv
     * 功能：新建一个DIV节点
    */
    function createlDiv(className,html) {
        var ele = document.createElement('div');
        var eleObject = $(ele);
        if (className) {
            eleObject.addClass(className);
        }
        if(html){
            eleObject.html(html);
        }
        return eleObject;
    }
    /*
     * createlInput
     * 功能新建一个input节点
    */
    function createlInput(type,placeholder) {
        var ele = document.createElement('input'); 
        var eleObject = $(ele);
        eleObject.attr('type',type);
        eleObject.attr('placeholder',placeholder);
        eleObject.attr('value','');
        return eleObject;
    }
    /*
     * createlButton
     * 功能新建一个button节点
    */
    function createlButton(className,html) {
        var ele = document.createElement('button'); 
        var eleObject = $(ele);
        eleObject.attr('type','button');
        if (className) {
            eleObject.addClass(className);
        }
        if(html){
            eleObject.html(html);
        }
        return eleObject;
    }
    /*
     * createlIframe
     * 功能新建一个iframe节点
    */
    function createlIframe(className, obj, attr, style) {
        var ele = document.createElement('iframe'); //总体
        var eleObject = $(ele);
        var key = '';
        if (className) {
            ele.className = className;
        }
        if (style) {
            eleObject.css(style);
        }
        if (obj != null) {
            for (key in obj) {
                ele[key] = obj[key];
            }
        }
        if (attr) {
            for (key in attr) {
                eleObject.attr(key, attr[key]);
            }
        }
        return eleObject;
    }
    /*
     * loadCss
     * 功能：加载js文件并在加载完成后执行callback函数
     * @file：js文件地址
     * @callback：加载完成后执行的函数
    */
    function loadCss(file, callback) {
        var fn =function() {};
        if(!isUndefined(callback)){
            fn=callback;
        }
        if(checkCss(file)){
            return fn();
        }
        var css = document.createElement('link');
        css.rel = 'stylesheet';        
        var isReady = false;
        var timer = null;
        var doReady = function() {
            if(timer){
                clearInterval(timer);
            }
            if(isReady) return;
            isReady = true;
            if(valType(fn) == 'function') {
                return fn();
            }
        };
        var bodyLoad = function() {
            timer = setInterval(function() {
                try {
                    if(!isUndefined(css.readyState) && css.readyState == 'complete') {
                        doReady();
                    }
                } catch(event) {};
            }, 10);
        };
        var w3c = function() {
            if(valType(fn) == 'function') {
                return fn();
            }
            removeListener(css, 'load', w3c);
            removeListener(css, 'error', w3cError);
        };
        var w3cError = function() {
            if(valType(fn) == 'function') {
                fn();
            }
            removeListener(css, 'load', w3c);
            removeListener(css, 'error', w3cError);
        };
        try {
            addListener(css, 'load', w3c);
            addListener(css, 'error', w3cError);
        } catch(event) {
            bodyLoad();
        }
        css.href = file;
        $('head').eq(0).append(css);
    }
    /*
     * doubleClickEvent
     * 功能：注册对象双击功能
     * @ele：注册对象，可以是页面中的任意节点，不支持数组形式
    */
    function doubleClickEvent(ele){
        var setTime=null;//注册延时函数
        var clickTime=0;//记录点击时间
        ele=$(ele);
        ele.click(function(){
            if(!setTime){
                setTime=setTimeout(function(){
                    try{
                        ele.dispatchEvent(new Event('sigClick'));//注册单击，针对视频播放器使用
                    }
                    catch(event){
                        var e = document.createEvent('HTMLEvents');
                        e.initEvent('sigClick', false, true);
                        ele.dispatchEvent(e);
                    }
                    clickTime=0;
                    setTime=null;
                },260);
            }
            if(!clickTime){
                clickTime=new Date().getTime();
            }
            else{
                if(new Date().getTime()-clickTime<230){//认为是双击
                    try{
                        ele.dispatchEvent(new Event('dobClick'));//注册双击
                    }
                    catch(event){
                        var e = document.createEvent('HTMLEvents');
                        e.initEvent('dobClick', false, true);
                        ele.dispatchEvent(e);
                    }
                    clearTimeout(setTime);
                    clickTime=0;
                    setTime=null;
                }
            }
        });
    };
    /*
     * $
     * 功能：根据ID或className或节点节点名称获取对象
    */
    function $(obj, eL) {
        var parent = null;
        if (document) {
            parent = document;
        }
        if (!isUndefined(eL)) {
            parent = eL;
        }
        var res = [];
        if (obj) {
            if (valType(obj) == 'htmlobject' || valType(obj)=='object') {
                res = obj;
                if (!isUndefined(res.mayiuiSayHello)) {
                    return res;
                }
                if(!isUndefined(obj.attr)){
                    if(!isUndefined(obj[0])){
                        res=obj[0];
                    }
                }
            } 
            else if (valType(obj) == 'string' && obj!='') {
                switch (obj.substr(0, 1)) {
                    case '.':
                        obj = obj.substr(1, obj.length);
                        if (parent.getElementsByClassName) {
                            res = parent.getElementsByClassName(obj);
                            if (!res.length) {
                                return null;
                            }
                        } 
                        else if (!parent && document.getElementsByClassName) {
                            res = document.getElementsByClassName(obj);
                            if (!res.length) {
                                return null;
                            }
                        }
                        else {
                            var reg = new RegExp(' ' + obj + ' ', 'i');
                            var ele = null;
                            if (parent.getElementsByTagName) {
                                ele = parent.getElementsByTagName('*');
                            } else {
                                ele = document.getElementsByTagName('*');
                            }
                            for (var i = 0; i < ele.length; i++) {
                                if (reg.test(' ' + ele[i].className + ' ')) {
                                    res.push(ele[i]);
                                }
                            }
                        }
                        if (res) {
                            if (res.length === 0) {
                                res = null;
                            }
                        }
                        break;
                    case '#':
                        obj = obj.substr(1, obj.length);
                        if (parent.getElementById) {
                            res = parent.getElementById(obj);
                        } else {
                            res=document.getElementById(obj);
                        }
                        break;
                    default:
                        var reg = new RegExp(' ' + obj + ' ', 'i');
                        if (parent.getElementsByTagName) {
                            res = parent.getElementsByTagName(obj);
                        } else {
                            res = document.getElementsByTagName(obj);
                        }
                        if (res) {
                            if (obj == 'body' || obj == 'document' || obj == 'html') {
                                res = res[0];
                            } else if (res.length === 0) {
                                res = null;
                            }
                        } else {
                            res = null;
                        }
                        break;
                }
            }
            else {
                res = obj;
            }
        }
        else {
            res = document;
        }
        
        if (res) {
            if (valType(res) == 'htmlobject' || valType(res) == 'object' || valType(res) == 'document' || valType(res) == 'window' ) {
                res.mayiuiSayHello = '您好，朋友！';
                /*
                 * find
                 * 功能：在当前节点中查找指定节点
                */
                res.find = function(obj) {
                    return $(obj, this);
                };
                /*
                 * attr
                 * 功能：修改或获取节点的属性值
                 * @key不能为空，指属性名称，$value不为空则设置属性值，为空则获取属性值
                */
                res.attr = function(key, value) {
                    if (isUndefined(value)) {
                        return this.getAttribute(key);
                    }
                    else {
                        this.setAttribute(key, value);
                        return this;
                    }
                };
                /*
                 * removeAtt
                 * 功能：删除节点的属性值
                 * @key不能为空，指属性名称
                */
                res.removeAttr = function(key) {
                    this.removeAttribute(key);
                    return this;
                };
                /*
                 * css
                 * 功能：修改或获取节点的样式样式
                 * @key不能为空，指属性名称，$value不为空则设置属性值，为空则获取属性值
                */
                res.css = function(key, value) {
                    // 拆解字符串并将第二单词首字母大写
                    var keyNew = function(str) {
                        // 当属性名有横杠时
                        if (str.indexOf('-') != -1) {
                            var arr = str.split('-');
                            var a = arr[0];
                            var b = '',
                                c = '';
                            if (arr.length > 1) {
                                b = arr[1].substr(0, 1).toLocaleUpperCase() + arr[1].substr(1, arr[1].length - 1);
                            }
                            if (arr.length > 2) {
                                b = arr[2].substr(0, 1).toLocaleUpperCase() + arr[2].substr(1, arr[2].length - 1);
                            }
                            return a + b + c;
                        }
                        // 没有横杠就不进行字符串拆解
                        return str;
                    };
                    if (isUndefined(value)){
                        if (!isUndefined(key) && valType(key) == 'string') {
                            if (this.currentStyle) {
                                return this.currentStyle[key];
                            } else {
                                return document.defaultView.getComputedStyle(this, null)[key];
                            }
                        }
                        if (isUndefined(key)) {
                            if (this.currentStyle) {
                                return this.currentStyle;
                            } else {
                                return document.defaultView.getComputedStyle(this, null);
                            }
                        }
                    }
                    // 当传进来的参数key不是一个对象，给节点添加css样式
                    if (valType(key) != 'object') {
                        var newKey = keyNew(key);
                        if (this.length > 1) {
                            // 如果this有多个值，那给每个节点都添加样式
                            for (var i = 0; i < this.length; i++) {
                                this[i].style[newKey] = value;
                            }
                        } else {
                            this.style[newKey] = value;
                        }
                    } else {
                        //如果第一个值是一个对象，遍历这个对象，并将属性名传进函数进行拆解
                        for (var item in key) {
                            var objKey = keyNew(item);
                            if (valType(this) == 'htmlarray') {
                                for (var i = 0; i < this.length; i++) {
                                    this[i].style[objKey] = key[item];
                                }
                            } else {
                                this.style[objKey] = key[item];
                            }
                        }
                    }
                    return this;
                };
                res.hasClass = function(cName) {
                    if (isUndefined(cName)) return false;
                    var reg = new RegExp('(\\s|^)' + cName + '(\\s|$)');
                    if (this.className && this.className.match(reg)) {
                        return true;
                    }
                    return false;
                };
                res.addClass = function(cName) {
                    if (!this.hasClass(cName)) {
                        if (this.className && this.className.substr(this.className.length - 1, 1) != ' ') {
                            this.className += ' ';
                        }
                        this.className += cName;
                    };
                    return this;
                };
                res.removeClass = function(cName) {
                    if (this.hasClass(cName)) {
                        this.className = this.className.replace(new RegExp('(\\s|^)' + cName + '(\\s|$)'), ' ');
                        if (this.className.substr(this.className.length - 1, 1) == ' ') {
                            this.className = this.className.substr(0, this.className.length - 1);
                        }
                        if (!this.className) {
                            this.removeAttribute('class');
                        }
                    };
                    return this;
                };
                res.searchClass = function(cName) {
                    var arr = this.className.split(' ');
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].substr(0, cName.length) == cName) {
                            return arr[i];
                        }
                    }
                    return this;
                };
                res.removeCss=function(cName){
                    var cs=this.attr('style');
                    if(cs){
                        var arr=cs.split(';');
                        var obj={};
                        for(var i=0;i<arr.length;i++){
                            var arrT=arr[i].split(':');
                            if(arrT.length==2 && arrT[0] && arrT[0].trim()!=cName){
                                obj[arrT[0].trim()]=arrT[1].trim();
                            }
                        }
                        this.attr('style','');
                        this.css(obj);
                    }
                };
                res.addListener = function(e, f, t) {
                    return addListener(this, e, f, t);
                };
                res.removeListener = function(e, f, t) {
                    return removeListener(this, e, f, t);
                };
                res.prev = function() {
                    return prev(this);
                };
                res.next = function() {
                    return next(this);
                };
                res.append =function(ele){
                    this.appendChild(ele);
                    return this;
                };
                res.remove = function() {
                    if(!isUndefined(this.parentNode)){
                        this.parentNode.removeChild(this);
                    }
                    return null;
                };
                res.bind=function(e, f, t) {
                    return addListener(this, e, f, t);
                };
                res.unbind =function(e,f){
                    var i=0;var arr=[];
                    if(!isUndefined(f)){
                        res.removeListener(e,f);
                    }
                    else if(!isUndefined(e)){
                        if(!isUndefined(this.listenerList)){
                            arr=this.listenerList;
                            for(i=0;i<arr.length;i++){
                                if(arr[i][0]==e){
                                    res.removeListener(e,arr[i][1]);
                                }
                            }
                        }
                    }
                    else{
                        if(!isUndefined(this.listenerList)){
                            arr=this.listenerList;
                            for(i=0;i<arr.length;i++){
                                res.removeListener(arr[i][0],arr[i][1]);
                            }
                        }
                    }
                };
                /*
                 * htm
                 * 功能：设置或获取html
                */
                res.html=function(val){
                    if(!isUndefined(val)){
                        res.innerHTML=val;
                    }
                    else{
                        return res.innerHTML;
                    }
                };
                /*
                 * htmReplace
                 * 功能：将html中ar替换成val
                */
                res.htmReplace=function(ar,val,html){
                    if(!isUndefined(val) && !isUndefined(ar)){
                        if(isUndefined(this.attr('data-htm'))){
                            this.attr('data-htm',html);
                        }
                        var htm=this.attr('data-htm');
                        var reg = new RegExp(ar , 'g');
                        htm=htm.replace(reg , val);
                        this.html(htm);
                    }
                };
                /*
                 * content
                 * 功能：设置或获取html
                */
                res.content=function(val){
                    if(!isUndefined(val) && !isUndefined(this.contentEle)){
                        return this.contentEle.html(val);
                    }
                };
                /*
                 * offset
                 * 功能：获取节点的绝对坐标
                */
                res.offset = function() {
                    var par = this.offsetParent,
                        //获取当前节点的父参照物（不一定是父节点）
                        left = this.offsetLeft,
                        //获取当前节点相对父节点左偏离
                        top = this.offsetTop;
                        //获取当前节点相对父节点上偏移
                    while (par && par.tagName !== 'BODY') {
                        //判断是否已经到了最外一层 并且判断父参照物存不存在
                        if (!/MSIE 8\.0/.test(navigator.userAgent)){
                            //利用正则表达式判断
                            left += par.clientLeft;
                            top += par.clientTop;
                        }
                        left += par.offsetLeft;
                        //获得节点距离父节点左偏移多少
                        top += par.offsetTop;
                        //获得节点距离父节点上偏移多少
                        par = par.offsetParent;
                    }
                    return {
                        top: top,
                        left: left
                    }
                };
                /*
                 * fixed
                 * 功能：判断节点是否悬浮于页面
                */
                res.fixed = function() {
                    if (this.css('position') == 'fixed') {
                        return true;
                    }
                    if (!isUndefined(this.offsetParent)) {
                        return $(this.offsetParent).fixed();
                    }
                    return false;
                };
                /*
                 * getWidth
                 * 功能：获取节点的宽
                */
                res.getWidth = function() {
                    return this.offsetWidth;
                };
                /*
                 * getHeight
                 * 功能：获取节点的高
                */
                res.getHeight = function() {
                    return this.offsetHeight;
                };
                if(isUndefined(res.width)){
                    res.width=function(){
                        return this.offsetWidth;
                    }
                }
                if(isUndefined(res.height)){
                    res.height=function(){
                        return this.offsetWidth;
                    }
                }
                /*
                 * 制作可拖动
                */
                res.drag = function(ele) {
                    var pos1 = 0,
                        pos2 = 0,
                        pos3 = 0,
                        pos4 = 0;
                    var zIndex = 0;
                    if (isUndefined(ele)) {
                        ele = this;
                    }
                    var elementDrag = function(e) {
                            e = e || window.event;
                            var client = getClient(e);
                            var eleOffset = ele.offset();
                            pos1 = pos3 - client['x'];
                            pos2 = pos4 - client['y'];
                            pos3 = client['x'];
                            pos4 = client['y'];
                            var left = eleOffset['left'] - pos1;
                            var top = eleOffset['top'] - pos2;
                            ele.css({
                                'position': 'fixed',
                                'top': top + 'px',
                                'left': left + 'px',
                                'margin': '',
                                'bottom': '',
                                'right': ''
                            });
                        };

                    var closeDragElement = function() {
                        $(document).removeListener('mousemove', elementDrag);
                        $(document).removeListener('mouseup', closeDragElement);
                    };
                    var dragMouseDown = function(e) {
                            e = e || window.event;
                            var client = getClient(e);
                            pos3 = client['x'];
                            pos4 = client['y'];
                            
                            $(document).mousemove(elementDrag);
                            $(document).mouseup(closeDragElement);
                            zIndex = getMaxZIndex() + 1;
                            ele.css('z-index', zIndex);
                        };
                    var eleMouseDown = function(e) {
                            zIndex = getMaxZIndex() + 1;
                            ele.css('z-index', zIndex);
                        };
                    
                    this.mousedown(dragMouseDown);
                    this.dragFun=dragMouseDown;//用于level回到原来位置时去掉拖动
                    if (!isUndefined(ele.iframe)) {
                        ele.iframe.mousedown(eleMouseDown);
                    } else if (!isUndefined(ele.contentEle)) {
                        ele.contentEle.mousedown(eleMouseDown);
                    }
                };
                /*
                 * 最大化
                */
                res.maximize = function() {
                    if (this.hasClass('mayiui-element-minimize')) {
                        this.resetAttribute();
                        minWinSort();
                        return;
                    }
                    this.defaultCss = this.attr('style');
                    this.resetAttribute();
                    this.css({
                        'width': '100%',
                        'height': '100%',
                        'margin': '',
                        'top': '0px',
                        'right': '',
                        'bottom': '',
                        'left': '0px'
                    });
                    this.addClass('mayiui-element-maximize');
                    this.resetSize();
                    if(this.minZEle){
                        this.minZEle.css('display', 'block');//最小化
                    }
                    this.redTEle.css('display', 'block');//还原
                    if(this.maxZEle){
                        this.maxZEle.css('display', 'none');//最大化
                    }
                   
                };
                /*
                 * 最小化
                */
                res.minimize = function() {
                    if (!this.hasClass('mayiui-element-maximize')) {
                        this.defaultCss = this.attr('style');
                    }
                    this.resetAttribute();
                    var w = 200,
                        h = 0;                 
                    this.css({
                        'width': w + 'px',
                        'height': h + 'px',
                        'margin': '',
                        'top': '',
                        'right': '',
                        'bottom': h + 'px',
                        'left': '0px'
                    });
                    this.addClass('mayiui-element-minimize'); 
                    if(this.minZEle){
                        this.minZEle.css('display', 'none');//最小化
                    }
                    this.redTEle.css('display', 'block');//还原
                    if(this.maxZEle){
                        this.maxZEle.css('display', 'none');//最大化
                    }                    
                    if($(this).find('.mayiui-element-top')){
                        h=$(this).find('.mayiui-element-top').eq(0).getHeight();
                    }
                    if($(this).find('.mayiui-element-top')){
                        h=$(this).find('.mayiui-element-top').eq(0).getHeight();
                    }
                    this.css('height',h+'px');
                    minWinSort();
                };
                /*
                 * 重置框架层的位置大小
                */
                res.resetAttribute = function() {
                    var at = this.mayiuiConfigObject;
                    if (at['size'] && valType(at['size']) == 'array') {
                        var arr = formatSize(at['size']);
                        if (arr.length > 0) {
                            this.css('width', arr[0]);
                        }
                        if (arr.length > 1) {
                            this.css('height', arr[1]);
                        }
                    }
                    var style = this.defaultCss;
                    var styleObj = {};
                    if (style) {
                        styleObj=styleToObject(style);
                        this.attr('style', '');
                        this.css(styleObj);
                    }

                    this.removeClass('mayiui-element-minimize');
                    this.removeClass('mayiui-element-maximize');
                    this.resetSize();
                    if(this.minZEle){
                        this.minZEle.css('display', 'block');
                    }
                    this.redTEle.css('display', 'none');
                    if(this.maxZEle){
                        this.maxZEle.css('display', 'block');
                    }
                };
                /*
                 * 重置框架层的大小
                */
                res.resetSize = function() {
                    var conHeight = this.getHeight();
                    if (!isUndefined(this.topEle)) {
                        conHeight -= this.topEle.getHeight();
                    }
                    this.contentEle.css('height', conHeight + 'px');
                };
                /*
                 * resize
                 * 功能：监听窗口尺寸变化
                 * @fn：窗口变化时执行的函数
                */
                res.resize = function(fn) {
                    addListener(window, 'resize', fn);
                };
                /*
                 * scroll
                 * 功能：监听窗口滚动
                 * @fn：滚动时执行的函数
                */
                res.scroll = function(fn) {
                    addListener(window, 'scroll', fn);
                };
                /*
                 * click
                 * 功能：节点单击时执行的函数
                 * @fn：执行的函数
                */
                res.click =function(fn){
                    addListener(this,'click',fn);
                    return this;
                };
                /*
                 * singleClick
                 * 功能：节点单击事件，当使用该事件时会同时注册双击事件，此时不要使用click函数进行单击事件监听
                 * @fn：执行的函数
                */
                res.singleClick=function(fn){
                    if(isUndefined(this.dbClick)){
                        doubleClickEvent(this);
                        this.dbClick=true;
                    }
                    this.addListener('sigClick',fn);
                    return this;
                };
                /*
                 * doubleClick
                 * 功能：节点双击事件，当使用该事件时会同时注册双击事件，此时不要使用click函数进行单击事件监听
                 * @fn：执行的函数
                */
                res.doubleClick=function(fn){
                    if(isUndefined(this.dbClick)){
                        doubleClickEvent(this);
                        this.dbClick=true;
                    }
                    this.addListener('dobClick',fn);
                    return this;
                };
                /*
                 * mouseover
                 * 功能：鼠标经过节点时执行的函数
                 * @fn：执行的函数
                */
                res.mouseover =function(fn){
                    addListener(this,'mouseover',fn);
                    return this;
                };
                /*
                 * mouseout
                 * 功能：鼠标离开节点时执行的函数
                 * @fn：执行的函数
                */
                res.mouseout =function(fn){
                    addListener(this,'mouseout',fn);
                    return this;
                };
                /*
                 * mousedown
                 * 功能：鼠标在节点上按下时执行的函数
                 * @fn：执行的函数
                */
                res.mousedown =function(fn){
                    addListener(this,'mousedown',fn);
                    return this;
                };
                /*
                 * mouseup
                 * 功能：节点上鼠标弹起时执行的函数
                 * @fn：执行的函数
                */
                res.mouseup =function(fn){
                    addListener(this,'mouseup',fn);
                    return this;
                };
                /*
                 * mousemove
                 * 功能：鼠标在节点上划行时执行的函数
                 * @fn：执行的函数
                */
                res.mousemove =function(fn){
                    addListener(this,'mousemove',fn);
                    return this;
                };
                /*
                 * mouseWheel
                 * 功能：鼠标滚轮在节点上划行时执行的函数
                 * @fn：执行的函数
                */
                res.mouseWheel =function(fn){
                    addListener(this,'mousewheel',fn);
                    addListener(this,'DOMMouseScroll',fn,false);
                    return this;
                };
                /*
                 * mouseleave
                 * 功能：鼠标指针移出节点时执行的函数
                 * @fn：执行的函数
                */
                res.mouseleave =function(fn){
                    addListener(this,'mouseleave',fn);
                    return this;
                };
                /*
                 * touchstart
                 * 功能：移动端鼠标在节点上按下时执行的函数
                 * @fn：执行的函数
                */
                res.touchstart =function(fn){
                    addListener(this,'touchstart',fn);
                    return this;
                };
                /*
                 * touchmove
                 * 功能：移动端鼠标在节点上划行时执行的函数
                 * @fn：执行的函数
                */
                res.touchmove =function(fn){
                    addListener(this,'touchmove',fn);
                    return this;
                };
                /*
                 * touchend
                 * 功能：移动端节点上鼠标弹起时执行的函数
                 * @fn：执行的函数
                */
                res.touchend =function(fn){
                    addListener(this,'touchend',fn);
                    return this;
                };
                /*
                 * show
                 * 功能：显示节点
                */
                res.show=function(){
                    this.css('display','block');
                    return this;
                };
                /*
                 * hide
                 * 功能：隐藏节点
                */
                res.hide=function(){
                    this.css('display','none');
                    return this;
                };
                /*
                 * animate
                 * 功能：缓动效果
                 * parameter:String=需要改变的属性：left,top,width,height,alpha,
                 * easing:String=效果名称,
                 * callBack:完成后的回调函数
                */
                res.animate=function(parameter,totalTime,easing,callBack) {
                    var thisTemp = this;
                    var parNode=cBody;
                    var w =parNode.getWidth(),h = parNode.getHeight();
                    var speed=10;//跳针时间
                    this.timerTween=null;
                    this.tweenPlay=true;
                    this.parameter=parameter;
                    if(isUndefined(parameter)){
                        return this;
                    }
                    if (isUndefined(totalTime) ||  totalTime== 0) {
                        totalTime=1000;
                    }
                    if(isUndefined(easing) || easing==''){
                        easing='None.easeIn';
                    }
                    var effArr = easing.split('.');
                    var tween = {
                        None: { //均速运动
                            easeIn: function(t, b, c, d) {
                                return c * t / d + b;
                            },
                            easeOut: function(t, b, c, d) {
                                return c * t / d + b;
                            },
                            easeInOut: function(t, b, c, d) {
                                return c * t / d + b;
                            }
                        },
                        Quadratic: {
                            easeIn: function(t, b, c, d) {
                                return c * (t /= d) * t + b;
                            },
                            easeOut: function(t, b, c, d) {
                                return - c * (t /= d) * (t - 2) + b;
                            },
                            easeInOut: function(t, b, c, d) {
                                if ((t /= d / 2) < 1) return c / 2 * t * t + b;
                                return - c / 2 * ((--t) * (t - 2) - 1) + b;
                            }
                        },
                        Cubic: {
                            easeIn: function(t, b, c, d) {
                                return c * (t /= d) * t * t + b;
                            },
                            easeOut: function(t, b, c, d) {
                                return c * ((t = t / d - 1) * t * t + 1) + b;
                            },
                            easeInOut: function(t, b, c, d) {
                                if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
                                return c / 2 * ((t -= 2) * t * t + 2) + b;
                            }
                        },
                        Quartic: {
                            easeIn: function(t, b, c, d) {
                                return c * (t /= d) * t * t * t + b;
                            },
                            easeOut: function(t, b, c, d) {
                                return - c * ((t = t / d - 1) * t * t * t - 1) + b;
                            },
                            easeInOut: function(t, b, c, d) {
                                if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
                                return - c / 2 * ((t -= 2) * t * t * t - 2) + b;
                            }
                        },
                        Quintic: {
                            easeIn: function(t, b, c, d) {
                                return c * (t /= d) * t * t * t * t + b;
                            },
                            easeOut: function(t, b, c, d) {
                                return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
                            },
                            easeInOut: function(t, b, c, d) {
                                if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
                                return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
                            }
                        },
                        Sine: {
                            easeIn: function(t, b, c, d) {
                                return - c * Math.cos(t / d * (Math.PI / 2)) + c + b;
                            },
                            easeOut: function(t, b, c, d) {
                                return c * Math.sin(t / d * (Math.PI / 2)) + b;
                            },
                            easeInOut: function(t, b, c, d) {
                                return - c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
                            }
                        },
                        Exponential: {
                            easeIn: function(t, b, c, d) {
                                return (t == 0) ? b: c * Math.pow(2, 10 * (t / d - 1)) + b;
                            },
                            easeOut: function(t, b, c, d) {
                                return (t == d) ? b + c: c * ( - Math.pow(2, -10 * t / d) + 1) + b;
                            },
                            easeInOut: function(t, b, c, d) {
                                if (t == 0) return b;
                                if (t == d) return b + c;
                                if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                                return c / 2 * ( - Math.pow(2, -10 * --t) + 2) + b;
                            }
                        },
                        Circular: {
                            easeIn: function(t, b, c, d) {
                                return - c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
                            },
                            easeOut: function(t, b, c, d) {
                                return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
                            },
                            easeInOut: function(t, b, c, d) {
                                if ((t /= d / 2) < 1) return - c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                                return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
                            }
                        },
                        Elastic: {
                            easeIn: function(t, b, c, d, a, p) {
                                if (t == 0) return b;
                                if ((t /= d) == 1) return b + c;
                                if (!p) p = d * .3;
                                if (!a || a < Math.abs(c)) {
                                    a = c;
                                    var s = p / 4;
                                } else var s = p / (2 * Math.PI) * Math.asin(c / a);
                                return - (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                            },
                            easeOut: function(t, b, c, d, a, p) {
                                if (t == 0) return b;
                                if ((t /= d) == 1) return b + c;
                                if (!p) p = d * .3;
                                if (!a || a < Math.abs(c)) {
                                    a = c;
                                    var s = p / 4;
                                } else var s = p / (2 * Math.PI) * Math.asin(c / a);
                                return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
                            },
                            easeInOut: function(t, b, c, d, a, p) {
                                if (t == 0) return b;
                                if ((t /= d / 2) == 2) return b + c;
                                if (!p) p = d * (.3 * 1.5);
                                if (!a || a < Math.abs(c)) {
                                    a = c;
                                    var s = p / 4;
                                } else var s = p / (2 * Math.PI) * Math.asin(c / a);
                                if (t < 1) return - .5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                                return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
                            }
                        },
                        Back: {
                            easeIn: function(t, b, c, d, s) {
                                if (s == undefined) s = 1.70158;
                                return c * (t /= d) * t * ((s + 1) * t - s) + b;
                            },
                            easeOut: function(t, b, c, d, s) {
                                if (s == undefined) s = 1.70158;
                                return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
                            },
                            easeInOut: function(t, b, c, d, s) {
                                if (s == undefined) s = 1.70158;
                                if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                                return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
                            }
                        },
                        Bounce: {
                            easeIn: function(t, b, c, d) {
                                return c - tween.Bounce.easeOut(d - t, 0, c, d) + b;
                            },
                            easeOut: function(t, b, c, d) {
                                if ((t /= d) < (1 / 2.75)) {
                                    return c * (7.5625 * t * t) + b;
                                } else if (t < (2 / 2.75)) {
                                    return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
                                } else if (t < (2.5 / 2.75)) {
                                    return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
                                } else {
                                    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
                                }
                            },
                            easeInOut: function(t, b, c, d) {
                                if (t < d / 2){
                                    return tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
                                }
                                else{
                                    return tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
                                }
                            }
                        }
                    };
                    if(effArr.length!=2){
                        return null;
                    }
                    if (!(effArr[0] in tween)) {
                        return null;
                    }
                    if (!(effArr[1] in tween[effArr[0]])) {
                        return null;
                    }
                    var tweenFun = tween[effArr[0]][effArr[1]];
                    var getStartAndEnd=function(arr){//分析初始化位置和结束位置
                        var vars=arr[1];
                        var current=0,result=0;
                        switch (arr[0]) {
                            case 'width':
                                current = thisTemp.getWidth();
                                if (vars.substring(vars.length - 1, vars.length) == '%') {
                                    result = parseInt(vars) * h * 0.01;
                                }
                                else{
                                    result=parseInt(vars);
                                }
                                break;
                            case 'height':
                                current = thisTemp.getHeight();
                                if (vars.substring(vars.length - 1, vars.length) == '%') {
                                    result = parseInt(vars) * h * 0.01;
                                }
                                else{
                                    result=parseInt(vars);
                                }
                                break;
                            case 'left':
                                if(!isUndefined(thisTemp.css('left'))){
                                    current=parseInt(thisTemp.css('left'));
                                }
                                else{
                                    current = thisTemp.offset()['left']-parNode.offset()['left'];
                                }
                                if (vars.substring(vars.length - 1, vars.length) == '%') {
                                    result = parseInt(vars) * w * 0.01;
                                }
                                else{
                                    result=parseInt(vars);
                                }
                                thisTemp.css('right','auto');
                                break;
                            case 'right':
                                if(!isUndefined(thisTemp.css('right'))){
                                    current=parseInt(thisTemp.css('right'));
                                }
                                else{
                                    current = parNode.getWidth()-(thisTemp.offset()['left']-parNode.offset()['left']+thisTemp.getWidth());
                                }
                                if (vars.substring(vars.length - 1, vars.length) == '%') {
                                    result = parseInt(vars) * w * 0.01;
                                }
                                else{
                                    result=parseInt(vars);
                                }
                                thisTemp.css('left','auto');
                                break;
                            case 'top':
                                if(!isUndefined(thisTemp.css('top'))){
                                    current=parseInt(thisTemp.css('top'));
                                }
                                else{
                                    current = thisTemp.offset()['top']-parNode.offset()['top'];
                                }
                                if (vars.substring(vars.length - 1, vars.length) == '%') {
                                    result = parseInt(vars) * h * 0.01;
                                }
                                else{
                                    result=parseInt(vars);
                                }
                                thisTemp.css('bottom','auto');
                                break;
                            case 'bottom':
                                if(!isUndefined(thisTemp.css('bottom'))){
                                    current=parseInt(thisTemp.css('bottom'));
                                }
                                else{
                                    current = parNode.getHeight()-(thisTemp.offset()['top']-parNode.offset()['top']+thisTemp.getHeight());
                                }
                                if (vars.substring(vars.length - 1, vars.length) == '%') {
                                    result = parseInt(vars) * h * 0.01;
                                }
                                else{
                                    result=parseInt(vars);
                                }
                                thisTemp.css('top','auto');
                                break;
                            case 'margin-left':
                                if(!isUndefined(thisTemp.css('margin-left'))){
                                    current=parseInt(thisTemp.css('margin-left'));
                                }
                                else{
                                    current = thisTemp.offset()['margin-left']-parNode.offset()['margin-left'];
                                }
                                if (vars.substring(vars.length - 1, vars.length) == '%') {
                                    result = parseInt(vars) * w * 0.01;
                                }
                                else{
                                    result=parseInt(vars);
                                }
                                thisTemp.css('margin-left','auto');
                                break;
                            case 'margin-top':
                                if(!isUndefined(thisTemp.css('margin-top'))){
                                    current=parseInt(thisTemp.css('margin-top'));
                                }
                                if (vars.substring(vars.length - 1, vars.length) == '%') {
                                    result = parseInt(vars) * w * 0.01;
                                }
                                else{
                                    result=parseInt(vars);
                                }
                                thisTemp.css('margin-top','auto');
                                break;
                            case 'alpha':
                                if(!isUndefined(thisTemp.css('filter')) && thisTemp.css('filter')!='none'){
                                    current=Number(thisTemp.css('filter'))*100;
                                }
                                else if(!isUndefined(thisTemp.css('opacity')) && thisTemp.css('opacity')!='none'){
                                    current=thisTemp.css('opacity')*100;
                                }
                                else{
                                    current = 100;
                                }
                                if (vars.substring(vars.length - 1, vars.length) == '%') {
                                    result = parseInt(vars);
                                }
                                else{
                                    result=vars*100;
                                }
                                break;
                        }
                        result-=current;
                        if(current!=result){
                            return {
                                'type':arr[0],
                                'current':current,
                                'result':result
                            };
                        }
                        return null;
                    };
                    this.stopTween = function() {
                        if (thisTemp.timerTween != null) {
                            clearInterval(thisTemp.timerTween);
                            thisTemp.timerTween = null;
                        }
                    };
                    
                    var newCss=[];
                    var parameterArr=[];
                    if(valType(parameter)=='object'){
                        for(var k in parameter){
                            parameterArr.push(k+':'+parameter[k]);
                        }
                    }
                    else{
                        parameter=parameter.replace(/[ ]*,[ ]*|[ ]+/g, ';');
                        var parameterArr=parameter.split(';');
                    }
                    for(var i=0;i<parameterArr.length;i++){
                        var cssArr=parameterArr[i].split(':');
                        if(cssArr.length==2){
                            var temp=getStartAndEnd(cssArr);
                            if(temp){
                                newCss.push(temp)
                            }
                        }
                    }
                    var funTime=0;
                    var timeFun=function(){
                        var styleObj={};
                        if(thisTemp.tweenPlay){
                            if (funTime < totalTime) {
                                funTime += speed;
                                for(var i=0;i<newCss.length;i++){
                                    var ob=newCss[i];
                                    var ap =Math.ceil(tweenFun(funTime, ob['current'], ob['result'], totalTime));
                                    switch(ob['type']){
                                        case 'width':
                                            styleObj['width']=ap + 'px';
                                            styleObj['overflow']='hidden';
                                            break;
                                        case 'height':
                                            styleObj['height']=ap + 'px';
                                            styleObj['overflow']='hidden';
                                            break;
                                        case 'left':
                                            styleObj['left']=ap + 'px';
                                            break;
                                        case 'right':
                                            styleObj['right']=ap + 'px';
                                            break;
                                        case 'top':
                                            styleObj['top']=ap + 'px';
                                            break;
                                        case 'bottom':
                                            styleObj['bottom']=ap + 'px';
                                            break;
                                        case 'margin-left':
                                            styleObj['margin-left']=ap + 'px';
                                            break;
                                        case 'margin-top':
                                            styleObj['margin-top']=ap + 'px';
                                            break;   
                                        case 'alpha':
                                            styleObj['filter']='alpha(opacity:' + ap*0.01 + ')';
                                            styleObj['opacity']=ap*0.01;
                                            break;
                                    }                               
                                }
                                thisTemp.css(styleObj);
                            }
                            else{
                                thisTemp.stopTween();
                                if(!isUndefined(callBack)){
                                    callBack(thisTemp);
                                }
                            }
                        }
                    };
                    this.stopTween();
                    this.timerTween=setInterval(timeFun,speed);
                    return this;
                };
                /*
                 * animatePlay
                 * 功能：播放缓动动画
                 */
                res.animatePlay=function(){
                    if(!isUndefined(this.timerTween)){
                        this.tweenPlay=true;
                    }
                    return this;
                };
                /*
                 * animatePause
                 * 功能：暂停缓动动画
                 */
                res.animatePause=function(){
                    if(!isUndefined(this.timerTween)){
                        this.tweenPlay=false;
                    }
                    return this;
                };
                /*
                 * animateStop
                 * 功能：暂停缓动动画
                 */
                res.animateStop=function(){
                    if(!isUndefined(this.timerTween)){
                        this.stopTween();
                        this.css(this.parameter);
                    }
                    return this;
                };
            } 
            else {
                /*
                 * each
                 * 功能：当相同节点数量大于0时，使用该函数可以进行循环节点
                 * @fn：循环节点时执行的函数
                 */
                res.each = function(fn) {
                    for (var i in this) {
                        if (this.hasOwnProperty(i)) {
                            if (valType(this[i]) == 'htmlobject') {
                                fn(i, this[i]);
                            } else {
                                try {
                                    if (!this[0].nodeName) fn(i, this[i]);
                                } catch (e) {
                                    fn(i, this[i]);
                                }
                            }
                        }
                    }
                };
                /*
                 * eq
                 * 功能：根据索引返回指定节点
                 * @m：为索引数字
                 */
                res.eq = function(m) {
                    if (valType(this) == 'htmlarray') {
                        if (this.length >= m + 1) {
                            return this[m];
                        }
                        return null;
                    }
                    return null;
                };
                for (var i = 0; i < res.length; i++) {
                    if ($) {
                        try {
                            res[i] = $(res[i]);
                        } catch (event) {}
                    }
                }
            }

        }
        return res;
    }
    /*
     * documentReady
     * 功能：判断页面加载完成
     * @fn：页面加载完成后执行的函数
    */
    function documentReady(fn) {
        var isReady = false;
        var timer = null;
        var doReady = function() {
            if(timer) clearInterval(timer);
            if(isReady) return;
            isReady = true;
            if(valType(fn) == 'function') {
                return fn();
            }
        };
        var bodyLoad = function() {
            timer = setInterval(function() {
                try {
                    if(!isUndefined(document.readyState) && document.readyState == 'complete') {
                        doReady();
                    }
                } catch(event) {};
            }, 10);
        };
        var w3c = function() {
            
            if(valType(fn) == 'function') {
                return fn();
            }
            removeListener(window, 'load', w3c);
        };
        if(!isUndefined(document.body)){
            if(valType(fn) == 'function') {
               return fn();
            }
        }
        else{
            try {
                addListener(window, 'load', w3c);
            } catch(event) {
                bodyLoad();
            }
        }
    }
    /*
     * eleClose
     * 关闭项目
     * now=true，是否立刻关闭
    */
   function eleClose(ele,now){
       if(isUndefined(now)){
           now=false;
       }
       var arr=[];
       if(valType(ele)=='htmlobject'){
           arr.push(ele);
       }
       else if(valType(ele)=='htmlarray'){
            ele.each(function(index,eleObj){
                at=eleObj['mayiuiConfigObject'];
                if(at['time']!=-1){
                   arr.push(eleObj);
                }
            });
       }
       else if(ele!='' && valType(ele)=='string'){
           var at={};
           if(ele=='all'){
               if($('.mayiui') && $('.mayiui').length>0){
                     $('.mayiui').each(function(index,eleObj){
                       arr.push($(eleObj));
                   }); 
               }               
           }
           else{
               if(ele.substr(-3)=='all'){
                   if($('.mayiui-'+ele.substr(0,ele.length-4)+'-dis') && $('.mayiui-'+ele.substr(0,ele.length-4)+'-dis').length>0){
                        $('.mayiui-'+ele.substr(0,ele.length-4)+'-dis').each(function(index,eleObj){
                           arr.push(eleObj);
                        });
                   }
                  
               }
               else if($(ele) && $(ele).length>0){
                   $(ele).each(function(index,eleLi){
                       arr.push(eleLi);
                   });
               }
               else{
                   if($('.mayiui-'+ele+'-dis') && $('.mayiui-'+ele+'-dis').length>0){
                        $('.mayiui-'+ele+'-dis').each(function(index,eleObj){
                           at=eleObj['mayiuiConfigObject'];
                           if(at['time']!=-1){
                               arr.push(eleObj);
                           }
                       });
                   }
               }
           }
       }
       else{
           if($('.mayiui') && $('.mayiui').length>0){
                 $('.mayiui').each(function(index,eleObj){
                   at=eleObj['mayiuiConfigObject'];
                   if(at['time']!=-1){
                       arr.push(eleObj);
                   }
               }); 
           }
       }
       var eleRemove=function(eleTemp){
            if(!isUndefined(eleTemp.mask)){
               eleTemp.mask.unbind();
               eleTemp.mask.remove();
            }
            if(!isUndefined(eleTemp.parentEle)){
               var elP=eleTemp.parentEle;
               if (eleTemp.nextEle) {
                    try {
                        elP.insertBefore(eleTemp, eleTemp.nextEle);
                    } catch (event) {
                        elP.append(eleTemp);
                    }
                } else if (eleTemp.prevEle) {
                    try {
                        elP.insertAfter(eleTemp, eleTemp.prevEle);
                    } catch (event) {
                        elP.append(eleTemp);
                    }
                } else {
                    elP.append(eleTemp);
                }
                if(!isUndefined(eleTemp.dragFun)){//如果层有拖动函数，则去掉
                    eleTemp.removeListener('mousedown',eleTemp.dragFun);
                }
                
                if(!isUndefined(eleTemp.oldStyle)){
                    eleTemp.attr('style',eleTemp.oldStyle);
                }
                if(!isUndefined(eleTemp.oldClass)){
                    eleTemp.attr('class',eleTemp.oldClass);
                }
                if(!isUndefined(eleTemp.closeTempEle)){
                    eleTemp.closeTempEle.remove();
                    eleTemp.closeTempEle=null;
                }
           }
           else{
               eleTemp.unbind();
               eleTemp.remove();
           }
           var at=eleTemp.mayiuiConfigObject;
           if(!isUndefined(at['closeHandler']) && valType(at['closeHandler'])=='function'){
               at['closeHandler']();
           }
       };
       for(var i=0;i<arr.length;i++){
           var eleTemp=arr[i];
           var at=eleTemp.mayiuiConfigObject;
           if(now || arr.length>1){
               if(!isUndefined(eleTemp.mask)){
                   eleTemp.mask.unbind();
                   eleTemp.mask.remove();
               }
               eleTemp.unbind();
               eleTemp.remove();
           }
           else if(at['animate']>0 && isUndefined(eleTemp.parentEle)){
               var showClass=getAnimateClass(at).trim();
               var outClass=getAnimateOutClass(at).trim();
               setTimeout(function(){
                   eleRemove(eleTemp);
               },at['animateTime']-100);
               eleTemp.removeClass(showClass);
               eleTemp.addClass(outClass);
           }
           else{
               eleRemove(eleTemp);
           }
       }
   }
    /*
     * getAnimateClass
     * 获取缓动效果样式
    */
    function getAnimateClass(at) {
        var cssName = '';
        switch (at['animate']) {
            case 1:
                cssName += 'mayiui-animate-yin';
                break;
            case 2:
                cssName += 'mayiui-animate-bouncein';
                break;
            case 3:
                cssName += 'mayiui-animate-somersaultin';
                break;
            case 4:
                cssName += 'mayiui-animate-badgein';
                break;
        }
        return cssName;
    }
    /*
     * getAnimateOutClass
     * 获取消失缓动效果样式
    */
    function getAnimateOutClass(at) {
        var cssName = '';
        switch (at['animate']) {
            case 1:
                cssName = 'mayiui-animate-yout';
                break;
            case 2:
                cssName = 'mayiui-animate-bounceout';
                break;
            case 3:
                cssName = 'mayiui-animate-somersaultout';
                break;
            case 4:
                cssName = 'mayiui-animate-badgeout';
                break;
        }
        return cssName;
    }
    /*
     * getPath
     * 功能：获取该js文件所在路径
    */
    function getPath(siz) {
        var scriptList = document.scripts,
            thisPath = scriptList[scriptList.length - 1].src;
        for (var i = 0; i < scriptList.length; i++) {
            var scriptName = scriptList[i].getAttribute('name') || scriptList[i].getAttribute('data-name');
            var src = scriptList[i].src.slice(scriptList[i].src.lastIndexOf('/') + 1, scriptList[i].src.lastIndexOf('.'));
            
            if ((scriptName && (scriptName == 'mayiui' || scriptName == 'mayiui.min')) || (scriptList[i].src && (src == 'mayiui' || src == 'mayiui.min'))) {
                thisPath = scriptList[i].src;
                break;
            }
        }
        var path=thisPath.substring(0, thisPath.lastIndexOf('/') + 1);
        if(!isUndefined(siz)){
            path+=siz+'/';
        }
        return path;
    }
    /*
     * checkCss
     * 功能：判断js是否已加载
     * @file：js文件路径
    */
    function checkCss(file) {
        var linkList = $('link');
        var have=false;
        if(linkList){
            linkList.each(function(index,ele){
                if(ele.attr('href')==file || file.indexOf(ele.attr('href'))>0){
                    have=true;
                }
            });
        }
        
        return have;
    }
    /*
     * getMaxZIndex
     * 功能：获取当前页面最大深度
    */
    function getMaxZIndex() {
        var arr = document.all || document.querySelectorAll('*');
        var maxZ = -1;
        for (var i = 0; i < arr.length; i++) {
            var temp = null;
            try {
                temp = window.getComputedStyle(arr[i], null).zIndex;
            } catch (event) {
                if (arr[i].style) {
                    temp = arr[i].style.zIndex;
                }
            }
            if (temp != 'auto' && parseInt(temp) > maxZ) {
                maxZ = parseInt(temp);
            }
        }
        return maxZ;
    }
    /*
     * getWindowSize
     * 功能：获取window的宽和高
    */
    function getWindowSize() {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }
    /*
     * standardization
     * 功能：将对象Object标准化，将n对象替换进o对象
     * @o:标准化对象，@n：外部传递对象
    */
    function standardization(o, n) {
        var h = {};
        var k;
        for (k in o) {
            h[k] = o[k];
        }
        for (k in n) {
            if(k in h){
                h[k] = n[k];
            }
        }
        return h;
    }
    /*
     * mergeObj
     * 功能：将新对象合并到原对象中，需要确保原对像里有对应的值并且类型一样
     * @o:原对象，@n：新对象
    */
    function mergeObj(o,n){
        var h = {};
        var k;
        for (k in o) {
            h[k] = o[k];
        }
        for (k in n) {
            if(k in h){
                switch(valType(h[k])){
                    case 'object':
                        if(valType(n[k])=='object'){
                            h[k] = mergeObj(h[k],n[k]);
                        }
                        break;
                    default:
                        if(valType(h[k])==valType(n[k]) || isUndefined(h[k])){
                            h[k] = n[k];
                        }
                        break;
                }
            }
        }
        return h;
    }
    /*
     * valType
     * 功能：判断变量类型
    */
    function valType(val) {
        if(typeof val==='undefined') return 'undefined';
        var str=Object.prototype.toString.call(val).split(' ')[1].replace(']','').toLowerCase();
        if(str.substr(0,4)=='html' && (str.substr(-7)=='element' || str.substr(-8)=='document' || str=='window')){
            str='htmlobject';
        }
        if(str=='htmlcollection' || str=='nodelist'){
            str='htmlarray';
        }
        return str;
    }
    /*
     * isUndefined
     * 功能：判断变量是否存在或值是否为undefined
    */
    function isUndefined(val) {
        try {
            return valType(val)==='undefined' || val === undefined || val === null || (valType(val)==='number' && isNaN(val));
        } catch (event) {
            return true;
        }
        return false;
    }
    /*
     * prev
     * 功能：获取指定节点前一个同胞节点
     * @ele：要获取的节点
    */
    function prev(ele) {
        var e = ele.previousSibling;
        if (e == null) { //测试同胞节点是否存在，否则返回空
            return null;
        }
        if (e.nodeType == 3) { //如果同胞节点为文本节点
            var t = prev(e);
            if (t && t.nodeType == 1) {
                return t;
            }
        } else {
            if (e.nodeType == 1) { //确认节点为节点节点才返回
                return e;
            } else {
                return false;
            }
        }
    }
    /*
     * next
     * 功能：获取指定节点下一个同胞节点
     * @ele：要获取的节点
    */
    function next(ele) {
        var e = ele.nextSibling;
        if (e == null) { //测试同胞节点是否存在，否则返回空
            return null;
        }
        if (e.nodeType == 3) { //如果同胞节点为文本节点
            var t = next(e);
            if (t && t.nodeType == 1) {
                return t;
            }
        } else {
            if (e.nodeType == 1) { //确认节点为节点才返回
                return e;
            } else {
                return false;
            }
        }
    }
    /*
     * addListener
     * 功能：事件监听
     * @ele：监听对象，@e：事件名称，@f：返回事件函数
    */
    function addListener(ele, e, f, t) {
        if (isUndefined(t)) {
            t = false;
        }
        if (ele.addEventListener) {
            try {
                ele.addEventListener(e, f, t);
            } catch (event) {}
        } else if (ele.attachEvent) {
            try {
                ele.attachEvent('on' + e, f);
            } catch (event) {}
        } else {
            ele['on' + e] = f;
        }
        if(isUndefined(ele.listenerList)){
            ele.listenerList=[];
        }
        ele.listenerList.push([e,f]);
        return ele;
    };
    /*
     * removeListener
     * 功能：删除事件监听
     * @ele：监听对象，@e：事件名称，@f：返回事件函数
    */
    function removeListener(ele, e, f, t) {
        if (isUndefined(t)) {
            t = false;
        }
        if (ele.removeEventListener) {
            try {
                ele.removeEventListener(e, f, t);
            } catch (e) {}
        } else if (ele.detachEvent) {
            try {
                ele.detachEvent('on' + e, f);
            } catch (e) {}
        } else {
            ele['on' + e] = null;
        }
        if(!isUndefined(ele.listenerList)){
            var temp=[];
            for(var i=0;i<ele.listenerList.length;i++){
                if(ele.listenerList[i][0]!=e || ele.listenerList[i][1]!=f){
                    temp.push(ele.listenerList[i]);
                }
            }
            ele.listenerList=temp;
        }
        return ele;
    }
    /*
     * limitNum
     * 限制位置数字
    */
    function limitNum(num, min, max) {
        if (valType(num) == 'number') {
            if (num > max) {
                num = max;
            }
            if (num < min) {
                num = min;
            }
        }
        return num;
    }
    /*
     * getButtonColor
     * 获取按钮文字颜色，作用是在风格使用深色底色时显示白色
    */
    function getButtonColor(style){
       var arr=['blue','darkgrey','green','red','cyan','orange','black'];
       if(arr.indexOf(style)>-1){
           return ' mayiui-btn-color-white';
       }
       return '';
    }
    /*
     * byteLength
     * 获取字符串的字节数，一个汉字为两个字节
    */
    function byteLength(s) {
        var b = 0,
        l = s.length; //初始化字节数递加变量并获取字符串参数的字符个数
        if (l) { //如果存在字符串，则执行计划
            for (var i = 0; i < l; i++) { //遍历字符串，枚举每个字符
                if (s.charCodeAt(i) > 255) { //字符编码大于255，说明是双字节字符
                    b += 2; //则累加2个
                } else {
                    b++; //否则递加一次
                }
            }
            return b; //返回字节数
        }
        return 0; //如果参数为空，则返回0个
    }
    /*
     * styleToObject
     * 将样式变成对象
    */
    function styleToObject(str){
        var styleObj={};
        var arr=str.split(';');
        for (var i = 0; i < arr.length; i++) {
            var temp = arr[i].split(':');
            if (temp.length == 2) {
                styleObj[temp[0].trim()] = temp[1].trim();
            }
        }
        return styleObj;
    }
    /*
    * getClient
    * 功能：获取clientX和clientY
    */
    function getClient(event) {
        var eve = event || window.event;
        if (isUndefined(eve)) {
            eve = {
                clientX: 0,
                clientY: 0
            };
        }
        var x=eve.clientX + (document.documentElement.scrollLeft || cBody.scrollLeft),
        y=eve.clientY + (document.documentElement.scrollTop || cBody.scrollTop);
        if(isUndefined(x.toString()) || x.toString()=='NaN'){
            x=eve.touches[0].clientX
        }
        if(isUndefined(y.toString()) || y.toString()=='NaN'){
            y=eve.touches[0].clientY
        }
        if(x.toString()=='NaN'){
            x=0;
        }
        if(y.toString()=='NaN'){
            y=0;
        }
        return {
            x: x,
            y: y
        }
    }
    /*
     * animationStyle
     * 使用缓动时需要保留的信息
    */
    function animationStyle(style, ption) {
        var newStyle = {};
        if (valType(ption) == 'array') {
            if (ption.length > 2) {
                newStyle['opacity'] = ption[2];
            }
            ption = 2;
        }
        if (ption == 1 || ption == 2 || ption == 8 || ption == 9) {
            newStyle['left'] = style['left'];
        }
        if (ption == 4 || ption == 5 || ption == 6 || ption == 11) {
            newStyle['right'] = style['right'];
        }
        if (ption == 2 || ption == 3 || ption == 4 || ption == 10) {
            newStyle['top'] = style['top'];
        }
        if (ption == 6 || ption == 7 || ption == 8 || ption == 12) {
            newStyle['bottom'] = style['bottom'];
        }
        if (ption == 0) {
            newStyle['margin-top'] = style['margin-top'];
        }
        return newStyle;
    }
    /*
     * formatSize
     * 格式化宽高
    */
    function formatSize(arr) {
        var win = getWindowSize();
        if (arr.length > 1) {
            if (arr[0].substr(arr[1].length - 1, 1) == '%') {
                arr[0] = win['width'] * parseInt(arr[0]) * 0.01 + 'px';
            }
            if (arr[1].substr(arr[1].length - 1, 1) == '%') {
                arr[1] = win['height'] * parseInt(arr[1]) * 0.01 + 'px';
            }
        }
        return arr;
    }
    /*
     * minWinSort
     * 重新排序最小化的窗口
    */
    function minWinSort() {
        var winWH = getWindowSize();
        var list = $('.mayiui-element-minimize');
        if (!list) return;
        var bottom = 1,
            left = 0;
        var w = 205,
            h = 45;
        var maxBottomHeight = Math.ceil(list.length / parseInt(winWH['width'] / w)) * h;
        for (var i = 0; i < list.length; i++) {
            if (parseInt(list[i].css('bottom')) < maxBottomHeight) {
                list[i].css({
                    'bottom': bottom + 'px',
                    'left': left + 'px',
                    'top': '',
                    'right': ''
                });
                left += w;
                if (left + w > winWH['width']) {
                    left = 0;
                    bottom += h;
                }
            }
        }
    }
    return embed;
}));