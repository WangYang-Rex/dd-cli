import {
    takeEvery,
    takeLatest
} from 'redux-saga/effects';
import { message } from 'antd';

let callTakeEvery = function* (action, method) {
    return yield takeEvery(action, function*(...arg) {
        try {
            return yield method(...arg);
        } catch (e) {
            message.warning(e && e.message, 3)
            console.log('callTakeEvery error: ', e && e.message);
        }
    });
}

let callTakeLatest = function *(action, method) {
    return yield takeLatest(action, function*(...arg) {
        try {
            return yield method(...arg);
        } catch (e) {
            message.warning(e && e.message, 3)
            console.log('callTakeLatest error: ', e && e.message);
        }
    });
}

/**
 * 时间格式化函数
 *
 * @param {string} time 时间戳，为空则取当前时间
 * @param {string} format format格式，为空则返回扩展过的date对象
 * @returns format格式时间或者扩展过的date对象
 */
let dateFormat = function (time, format) {
    let date;
    if(time) {
        //兼容ios 把yyyy-MM-dd hh:mm 改为 yyyy/MM/dd hh:mm
        if(typeof(time) == 'string'){
            time = time.replace(/-/g,'/');
        }
        if(typeof(time) == 'string' && time.indexOf('24:') >= 0) {
            time = time.replace('24:','23:')
            var _temp_date = new Date(time);
            date = new Date(_temp_date.getTime() + 60*60*1000)
        } else {
            date = new Date(time);
        }
    } else {
        date = new Date();
    }
    let _time = date.getTime(),

    _year = date.getFullYear(),
    _month = date.getMonth()+1,
    _date = date.getDate(),

    _hour = date.getHours(),
    _minute = date.getMinutes(),
    _second = date.getSeconds();
    if(format){
        //yyyy-MM-dd hh:mm:ss 2006-07-02 08:09:04
        format = format.replace('yyyy',_year);
        format = format.replace('MM', _month<10 ? '0'+_month : _month);
        format = format.replace('dd', _date<10 ? '0'+_date : _date);
        format = format.replace('hh', _hour<10 ? '0'+_hour : _hour);
        format = format.replace('mm', _minute<10 ? '0'+_minute : _minute);
        format = format.replace('ss',_second<10 ? '0'+_second : _second);

        //yyyy-M-d h:m:s hh:mm:ss 2006-7-2 8:9:4.18
        format = format.replace('M', _month);
        format = format.replace('d', _date);
        format = format.replace('h', _hour);
        format = format.replace('m', _minute);
        format = format.replace('s', _second);

        // alert('dateFormat:'+format);
        return format
    } else {
        let _dateTime = new Date(_year+'/'+_month+'/'+_date + ' 00:00');
        let obj = {
            year: _year,
            month: _month,
            day: _date,
            hour: _hour,
            minute: _minute,
            second: _second,

            time: _time, // 毫秒数
            dateTime: _dateTime.getTime(),
            date: date
        };
        // if(!window.showDate){
            // alert('dateFormat:'+JSON.stringify(obj))
            // window.showDate = true;
        // }

        return obj;
    }
}
/**
 * 获取浏览器的params
 *
 * @param {string} key
 * @returns string
 */
let getUrlParam = function (key, _url) {
    let url = _url ? _url : location.href;
    if(url.lastIndexOf('?')<0){
        return ''
    }
    let arr = url.substring(url.lastIndexOf('?')+1).split('&');

    for(let i = 0;i<arr.length; i++){
        let _cks = arr[i].split('=');
        if(_cks[0] == key){
            return _cks[1]
        }
    }
    return '';
}
/**
 * 从cookie获取获取用户信息
 *
 * @returns userInfo
 */
let getUserInfo = function () {
    let cookies = document.cookie.split(';');
    let userInfo = {
        isAdmin: false
    };
    for(let i = 0; i<cookies.length; i++){
        let _cks = cookies[i].split('=');
        if(_cks[0].trim() == 'yzuid'){
            userInfo.id = decodeURIComponent(decodeURIComponent(_cks[1].trim()));
        }
        if(_cks[0].trim() == 'yzuname'){
            userInfo.name = decodeURIComponent(_cks[1].trim());
        }
        if(_cks[0].trim() == 'yzuavatar'){
            userInfo.avatar = decodeURIComponent(_cks[1].trim());
        }
        if(_cks[0].trim() == 'yzadminflag'){
            userInfo.isAdmin = _cks[1].trim() == '1' ? true : false;
        }
    }
    let spaceId = window.sessionStorage.getItem('spaceId');
    if(spaceId) {
        userInfo.spaceId = spaceId;
    }
    if(localStorage.getItem('corpId')){
        userInfo.corpId = localStorage.getItem('corpId');
    }
    return userInfo;
}
/**
 * cookie取值
 *
 * @param {any} key
 * @returns
 */
let getValueFromCookieByKey = function (key) {
    let cookies = document.cookie.split(';');
    let obj = cookies.map(ck => {
        let _cks = ck.split('=');
        return {
            key: typeof(_cks[0])=='string' && _cks[0].trim(),
            value: typeof(_cks[1])=='string' && _cks[1].trim()
        }
    }).filter(item => {
        return item.key === key
    })[0];
    return obj && obj.value ? obj.value : null;
}
/**
 * 链接地址切换成https
 * @param {any} url
 * @returns
 */
let urlFormat = function (url){
    if(url.indexOf('http://')>-1){
        return url.replace('http://', 'https://')
    }
    return url
}
/**
 * 返回设备类型
 * @returns android/iphone/pc
 */
let getDevice = function(){
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {  //判断iPhone|iPad|iPod|iOS
        return 'iphone'
    } else if (/(Android)/i.test(navigator.userAgent)) {   //判断Android
        return 'android'
    } else {  //pc
        return 'pc'
    };
}
/**
 * 打点函数
 * @param {any} params
 */
let clickPoint = function(point){
    var user = getUserInfo();
    if(!user.id) {
        return;
    }
    var $img = $('<img style="position:absolute;bottom:0;left:-100px;width:0;height:0;" />'),
        keyMap = {
            app_type: 'url_tj', // 必须是这个才能统计出来
            log_type: 'click',
            taobaoNick: user.name,
            taobaoId: user.id,
            corpId: user.corpId,
            role: user.isAdmin ? 'admin' : '',
            point: point,
            rad: Math.random(),
        };

    var queryStr = $.param($.extend({}, keyMap));
    $img.attr('src', 'http://f.superboss.cc/tj.jpg?' + queryStr);
    $img.on('load', function() {
        $img.remove();
    });
    $('body').append($img);
}

let util = {
    callTakeEvery,
    callTakeLatest,
    dateFormat,
    getUrlParam,
    getUserInfo,
    getValueFromCookieByKey,
    urlFormat,
    getDevice,
    clickPoint
}

module.exports = util;
