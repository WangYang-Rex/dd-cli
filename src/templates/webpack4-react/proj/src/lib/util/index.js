import { takeEvery, takeLatest } from 'redux-saga/effects';
// import _ from 'lib/lodash';
// import moment from 'moment';
// import {inspectRegExp} from 'lib/util/RegExp';

// import {sendError} from './../../error'

export let callTakeEvery = function* (action, method) {
  return yield takeEvery(action, function* (...arg) {
    try {
      return yield method(...arg);
    } catch (e) {

      // message.warning(e && e.message, 3)
      // sendError({ errorType: 'callTakeEvery', errorMessage:e.message, hash: location.href,DingTalkPC: DingTalkPC.ua, });
      console.log('callTakeEvery error: ', e && e.message);
      console.error(e);
    }
  });
};

export let callTakeLatest = function* (action, method) {
  return yield takeLatest(action, function* (...arg) {
    try {
      return yield method(...arg);
    } catch (e) {
      // message.warning(e && e.message, 3)
      // sendError({ errorType: 'callTakeLatest', errorMessage:e.message, hash: location.href,DingTalkPC: DingTalkPC.ua, });
      console.log('callTakeLatest error: ', e && e.message);
      console.error(e);
    }
  });
};

/**
 * 时间格式化函数
 *
 * @param {string} time 时间戳，为空则取当前时间
 * @param {string} format format格式，为空则返回扩展过的date对象
 * @returns format格式时间或者扩展过的date对象
 */
let dateFormat = function (time, format) {
  let date;
  if (time) {
    //兼容ios 把yyyy-MM-dd hh:mm 改为 yyyy/MM/dd hh:mm
    if (typeof time == 'string') {
      time = time.replace(/\s+/g, ' '); //转换中文空格
      time = time.replace(/-/g, '/');
    }
    if (typeof time == 'string' && time.indexOf('24:') >= 0) {
      time = time.replace('24:', '23:');
      var _temp_date = new Date(time);
      date = new Date(_temp_date.getTime() + 60 * 60 * 1000);
    } else {
      date = new Date(time);
    }
  } else {
    date = new Date();
  }
  let _time = date.getTime(),
    _year = date.getFullYear(),
    _month = date.getMonth() + 1,
    _date = date.getDate(),
    _hour = date.getHours(),
    _minute = date.getMinutes(),
    _second = date.getSeconds();
  if (format) {
    //大小写转换
    format = format.replace(/Y/g, 'y');
    format = format.replace(/D/g, 'd');
    format = format.replace(/H/g, 'h');
    format = format.replace(/S/g, 's');
    //yyyy-MM-dd hh:mm:ss 2006-07-02 08:09:04
    format = format.replace('yyyy', _year);
    format = format.replace('MM', _month < 10 ? '0' + _month : _month);
    format = format.replace('dd', _date < 10 ? '0' + _date : _date);
    format = format.replace('hh', _hour < 10 ? '0' + _hour : _hour);
    format = format.replace('mm', _minute < 10 ? '0' + _minute : _minute);
    format = format.replace('ss', _second < 10 ? '0' + _second : _second);

    //yyyy-M-d h:m:s hh:mm:ss 2006-7-2 8:9:4.18
    format = format.replace('M', _month);
    format = format.replace('d', _date);
    format = format.replace('h', _hour);
    format = format.replace('m', _minute);
    format = format.replace('s', _second);

    // alert('dateFormat:'+format);
    return format;
  } else {
    let _dateTime = new Date(_year + '/' + _month + '/' + _date + ' 00:00');
    let obj = {
      year: _year,
      month: _month,
      day: _date,
      hour: _hour,
      minute: _minute,
      second: _second,

      time: _time, // 毫秒数
      dateTime: _dateTime.getTime(),
      date: date,
    };
    return obj;
  }
};

/**
 * 获取浏览器的params
 *
 * @param {string} key
 * @returns string
 */
let getUrlParam = function (key, _url) {
  let url = _url ? _url : location.href;
  // debugger
  if (url.lastIndexOf('?') < 0) {
    return '';
  }
  let arr = url.substring(url.lastIndexOf('?') + 1).split('&');

  for (let i = 0; i < arr.length; i++) {
    let _cks = arr[i].split('=');
    if (_cks[0] == key) {
      return _cks[1];
    }
  }
  return '';
};
/**
 * 从cookie获取获取用户信息
 *
 * @returns userInfo
 */
let getUserInfo = function () {
  let cookies = document.cookie.split(';');
  let userInfo = {
    isAdmin: false,
    corpActiveStatus: false,
    id: '',
    userDept: []
  };
  for (let i = 0; i < cookies.length; i++) {
    let _cks = cookies[i].split('=');
    if (_cks[0].trim() == 'yzuid') {
      userInfo.id = decodeURIComponent(decodeURIComponent(_cks[1].trim()));
    }
    if (_cks[0].trim() == 'yzuname') {
      userInfo.name = decodeURIComponent(_cks[1].trim());
    }
    if (_cks[0].trim() == 'yzuavatar') {
      userInfo.avatar = decodeURIComponent(_cks[1].trim());
    }
    if (_cks[0].trim() == 'yzadminflag') {
      userInfo.isAdmin = _cks[1].trim() == '1' ? true : false;
    }
    // 企业初始化状态
    if (_cks[0].trim() == 'corpActiveStatus') {
      userInfo.corpActiveStatus = _cks[1].trim() == '1' ? true : false;
    }
    // 企业名称
    if (_cks[0].trim() == 'yzcname') {
      userInfo.corpName = _cks[1].trim() == '1' ? true : false;
    }
    // 所属部门 userDept
    if (_cks[0].trim() == 'userDept') {
      userInfo.userDept = JSON.parse(decodeURIComponent(_cks[1].trim()));
    }
  }

  let spaceId = window.sessionStorage.getItem('spaceId');
  if (spaceId) {
    userInfo.spaceId = spaceId;
  }
  if (localStorage.getItem('corpId')) {
    userInfo.corpId = localStorage.getItem('corpId');
  }
  return userInfo;
};
/**
 * cookie取值
 *
 * @param {any} key
 * @returns
 */
let getValueFromCookieByKey = function (key) {
  let cookies = document.cookie.split(';');
  let obj = cookies
    .map(ck => {
      let _cks = ck.split('=');
      return {
        key: typeof _cks[0] == 'string' && _cks[0].trim(),
        value: typeof _cks[1] == 'string' && _cks[1].trim(),
      };
    })
    .filter(item => {
      return item.key === key;
    })[0];
  return obj && obj.value ? obj.value : null;
};
/**
 * 链接地址切换成https
 * @param {any} url
 * @returns
 */
let urlFormat = function (url) {
  if (url.indexOf('http://') > -1) {
    return url.replace('http://', 'https://');
  }
  return url;
};
/**
 * 返回设备类型
 * @returns android/iphone/pc
 */
let getDevice = function () {
  if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    //判断iPhone|iPad|iPod|iOS
    return 'iphone';
  } else if (/(Android)/i.test(navigator.userAgent)) {
    //判断Android
    return 'android';
  } else {
    //pc
    return 'pc';
  }
};

/**
 * 打点函数
 * @param {any} params
 */
let clickPoint = function (point) {
  var user = getUserInfo();
  if (!user.id) {
    return;
  }
  var $img = $(
    '<img style="position:absolute;bottom:0;left:-100px;width:0;height:0;" />'
  ),
    keyMap = {
      app_type: 'url_tj', // 必须是这个才能统计出来
      log_type: 'click',
      taobaoNick: user.id,
      point: point,
      type: 'dingding_tj',
      userId: user.id,
      userName: user.name,
      corpId: getValueFromCookieByKey("corpid"),
      corpName: user.corpName,
      role: user.isAdmin ? 'admin' : '',
      rad: Math.random(),
    };
  var queryStr = $.param($.extend({}, keyMap));
  $img.attr('src', '//ftj.superboss.cc/tj.jpg?' + queryStr);
  $img.on('load', function () {
    $img.remove();
  });
  $('body').append($img);
};
// 拷贝对象
let getValue = function (value) {
  return JSON.parse(JSON.stringify(value));
};

/**
 * 将对象数组转为 key的obj
 * example: let arr = [{"dataId":'a',b:1},{"dataId":'b',b:1}]
 * getObjByKey(arr, 'dataId')
 * return {'a':{"dataId":'a',b:1},'b':{"dataId":'b',b:1}}
 * @param {any} params
 */
let getObjByKey = function (arrObj, key) {
  if (!arrObj) return {};
  let res = {};
  arrObj.map(item => {
    item[key] || item[key] == 0 ? (res[item[key]] = item) : null;
  });
  return res;
};
/**
 * 检查对象是否为空
 * @param {*} obj
 */
const isEmptyObj = obj => {
  for (const i in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, i)) {
      return false;
    }
  }
  return true;
};
/**
 *
 * @param {排序} property  属性
 *  type true 是降序 false 升序
 */
const compare = (property, type) => {
  return (a, b) => {
    var value1 = a[property];
    var value2 = b[property];
    if (!type) {
      return value1 - value2;
    } else {
      return value2 - value1;
    }

  }
}

/**
 * 判断是否是真正的非 null 的对象， 可以是 [] 或者 {}
 * @param {any} obj
 * @return {bool}
 */
const isObject = (obj) => typeof obj === "object" && obj !== null;

/**
 * 节流防抖结合
 * @param fn
 * @param delay
 * 用 Throttle 来优化 Debounce
 */
const throttle = (fn, delay) => {
  let last = 0;
  let timer = null;
  // 将throttle处理结果当作函数返回
  return function () {
    // 保留调用时的this上下文
    let context = this;
    // 保留调用时传入的参数
    let args = arguments;
    // 记录本次触发回调的时间
    let now = +new Date()

    // 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
    if (now - last < delay) {
      clearTimeout(timer)
      timer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, delay)
    } else {
      // 如果时间间隔超出了我们设定的时间间隔阈值，那就不等了，无论如何要反馈给用户一次响应
      last = now
      fn.apply(context, args)
    }
  }
}
// 防抖 以最后一次触发为准
const debounce = (fn, delay) => {
  // 定时器
  let timer = null;
  // 将debounce处理结果当做函数返回
  return function () {
    // 保留调用时的this上下文
    let context = this;
    // 保留调用时传入的参数
    let args = arguments;
    // 每次事件被触发时，都去清除之前的旧定时器
    if (timer) {
      clearTimeout(timer)
    }
    // 设立新的定时器
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}

//显示loading
let showLoading = function () {
  let $loading = $('<div class="meeting-loading"></div>');
  $('body').append($loading);
}
let default_showLoading = function () {
  let $loading = $('<div class="meeting-loadings"></div>');
  $('body').append($loading);
}
//隐藏index.html loading
let hideLoading = function () {
  let $dom = document.querySelector('.meeting-loading');
  $dom && $dom.remove();
  let $doms = document.querySelector('.meeting-loadings');
  $doms && $doms.remove();
}
//显示透明遮罩
let showMask = function () {
  let $mask = $('<div class="meeting-mask" style="position: fixed;right: 0;background: rgba(0,0,0,.3);top: 0;bottom: 0;left: 0;z-index: 999;cursor: pointer;"></div>');
  $('body').append($mask);
  $mask.on('click', function () {
    $mask.off('click').remove();
    $(".filter").css("left", "100%")
  })
}
//隐藏透明遮罩
let hideMask = function () {
  $('.meeting-mask').off('click').remove();
  localStorage.removeItem("meetingInput")
}
let showMask2 = function () {
  let $mask = $('<div class="meeting-mask" style="position: fixed;right: 0;background: rgba(0,0,0,.3);top: 0;bottom: 0;left: 0;z-index: 999;cursor: pointer;"></div>');
  $('body').append($mask);
}
let setTitle = function (title) {
  if (!title) {
    return
  }
  DingTalkPC && DingTalkPC.biz.navigation.setTitle({
    title: title, //标题
    onSuccess: function (result) {
      /**/
    },
    onFail: function () { }
  })
}

// 时长格式化
let timeFormat = function (time, time2) {
  let _time = 0;
  if (time2) {
    _time = (dateFormat(time2).time - dateFormat(time).time) / 60 / 1000
  } else {
    _time = time;
  }
  let hour = parseInt(_time / 60),
    minute = parseInt(_time % 60);
  return (hour > 0 ? hour + '小时' : '') + (minute > 0 ? minute + '分钟' : '')
}
let setLeft = function (text, cb) {
  DingTalkPC.biz.navigation.setLeft({
    text: text, //显示文字信息
    onSuccess: function (result) {
      /**/

      cb && cb();
    },
    onFail: function () { }
  })
}
let addrListFormat = function (addressList, defaultAddress) {
  let content = JSON.parse(JSON.stringify(addressList)),
    multi = 0,
    cities = [];
  if (content.length == 0) {
    multi = 0; //没有会议地点
  } else {
    multi = 1; //有会议地点
  }
  content.map(function (province) {
    province.list.map(function (city) {
      city.list.map(function (building) {
        building.list.map(function (num) {
          //给每一栋楼追加一个选中楼层的参数
          let selectedfloor = [];
          let addr1;
          if (num.name) {
            addr1 = province.name + city.name + building.road + building.name + num.name;
          } else {
            addr1 = province.name + city.name + building.road + building.name;
          }
          if (JSON.parse(JSON.stringify(defaultAddress))) {
            //这里处理选中的情况
            defaultAddress.map(function (item) {
              let addr2;
              if (item.num) {
                addr2 = item.province + item.city + item.road + item.building + item.num;
              } else {
                addr2 = item.province + item.city + item.road + item.building;
              }
              if (JSON.stringify(addr1) == JSON.stringify(addr2)) {
                selectedfloor.push(item.floor)
              }
            })
          }
          num.selectedfloor = selectedfloor;
        })
      })
      cities.push({
        "province": province.name,
        "city": city.name,
        "detail": city.list
      })
    })
  })
  return {
    multi: multi,
    cities: cities
  }
}
let getSelectAddrList = function (cities) {
  let selectAddressList = [];
  cities.map(function (item) {
    item.detail.map(function (building) {
      building.list.map(function (num) {
        num.selectedfloor.map(function (floor) {
          let addr = {
            province: item.province,
            city: item.city,
            district: building.district,
            road: building.road,
            building: building.name,
            floor: floor
          }
          if (num.name) {
            addr.num = num.name
          }
          selectAddressList.push(addr)
        })
      })
    })
  })
  return selectAddressList
}
let beginTimeFormat = function (beginTime) {
  let beginArr = beginTime.split(":");
  let minutes = beginArr[1];
  if (minutes >= 0 && minutes < 15) {
    minutes = "00"
  } else if (minutes >= 15 && minutes < 30) {
    minutes = 15
  } else if (minutes >= 30 && minutes < 45) {
    minutes = 30
  } else if (minutes >= 45) {
    minutes = 45
  }
  return beginArr[0] + ":" + minutes;
}
let success = function (content) {
  Message.success(content, 0.5)
}
let error = function (content) {
  Message.error(content, 0.8)
}
let info = function (content) {
  Message.info(content, 1)
}
let loading = function (content) {
  // Message.loading(content ? content : "", 0.3)
}
/**
* 获取版本信息
*/
let getorderInfo = () => {
  let orderInfo = {};
  let isvCorp = {}
  let userInfo = {}
  if (JSON.parse(localStorage.getItem('orderInfo'))) {
    orderInfo = JSON.parse(localStorage.getItem('orderInfo')).corpAppServerInfo;
    isvCorp = JSON.parse(localStorage.getItem('orderInfo')).isvCorp
    userInfo = JSON.parse(localStorage.getItem('orderInfo')).userInfo
  };
  orderInfo.currentVersion = Number(orderInfo.itemCode)
  orderInfo.orderStartTime = isvCorp.serverStartTime
  orderInfo.serviceStopTime = isvCorp.serverEndTime
  orderInfo.lastLogin = userInfo.lastLogin
  orderInfo.ifTryOut = isvCorp.ifTryOut
  orderInfo.nowTime = JSON.parse(localStorage.getItem('orderInfo')).nowTime
  //8月1号之后的用户
  orderInfo.created = false
  orderInfo.createdTime = isvCorp.created;
  // if(isvCorp.created > 1533052800000){
  //     orderInfo.created = true
  // }
  if (!isvCorp.serverEndTime && !isvCorp.serverStartTime) {
    orderInfo.itemName = "免费版"
    orderInfo.currentVersion = '0'
  }
  orderInfo.isNewUser = false
  // if(orderInfo.created && !isvCorp.serverEndTime && !isvCorp.serverStartTime){
  //     orderInfo.isNewUser = true
  // }   
  return orderInfo
}

/**
* 
* 获取订单剩余时间
* @param {any} t1 当前时间
* @param {any} t2 服务器停止时间
* @memberof Home
*/
let timestamp = (t1, t2) => {
  let time = t2 - t1;
  let days = Math.floor(time / (24 * 3600 * 1000));
  let obj = {
    time: days,
    state: 0,
    // overdue: t2
  };
  if (days < 1) { //已到期
    obj.state = 1;
    obj.time = 0
    return obj
  } else {
    if (days <= 7) { //7天提醒
      obj.state = 2;
      return obj
    } else if (days <= 30) { //30天提醒
      obj.state = 3;
      return obj
    } else {
      return obj
    }
  }
}
/**
* 返回时间戳
* @param {*} time 
*/
let getTimeFlows = (time) => {
  let date = new Date(time);
  return date.getTime();
}
//版本升级提示弹窗
let vsUpDialog = (vsion) => {
  let currentVersion = getorderInfo().currentVersion
  let userInfo = getUserInfo()
  let text = ""
  if (userInfo.isAdmin) {
    DingTalkPC.device.notification.confirm({
      message: currentVersion == 0 ? vsion == 1 ? "您当前版本为免费版，该功能为有成会议标准版功能，是否升级？" : "您当前版本为免费版，该功能为有成会议专业版功能，是否升级？" : "您当前版本为标准版，该功能为有成会议专业版功能，是否升级？",
      title: "提示",
      buttonLabels: ['立即升级', '取消'],
      onSuccess: function (result) {
        if (result.buttonIndex == 0) {
          hideMask()
          DingTalkPC.biz.navigation.quit({
            message: 'quit',//退出信息，传递给openModal或者openSlidePanel的onSuccess函数的result参数
            onSuccess: function (result) {
            },
            onFail: function () {
            }
          })
          location.hash = '/mypage'
        }
      },
      onFail: function (err) { }
    });
  } else {
    DingTalkPC.device.notification.alert({
      message: currentVersion == 0 ? vsion == 1 ? "您当前版本为免费版，该功能为有成会议标准版功能,请联系管理员升级" : "您当前版本为免费版，该功能为有成会议专业版功能,请联系管理员升级" : "您当前版本为标准版，该功能为有成会议专业版功能,请联系管理员升级",
      title: "提示", //可传空
      buttonName: "知道了",
      onSuccess: function () {
        /*回调*/
      },
      onFail: function (err) { }
    });
  }
}
//审核提示
let checkDialog = () => {
  let currentVersion = getorderInfo().currentVersion
  let userInfo = getUserInfo()
  let text = ""
  if (userInfo.isAdmin) {
    DingTalkPC.device.notification.confirm({
      message: "您当前版本为免费版，会议室单层审核功能为有成会议标准版功能，是否升级？",
      title: "提示",
      buttonLabels: ['立即升级', '取消'],
      onSuccess: function (result) {
        if (result.buttonIndex == 0) {
          location.hash = '/mypage'
        }
      },
      onFail: function (err) { }
    });
  } else {
    DingTalkPC.device.notification.alert({
      message: "您当前版本为免费版，会议室单层审核为有成会议标准版功能,请联系管理员升级",
      title: "提示", //可传空
      buttonName: "知道了",
      onSuccess: function () {
        /*回调*/
      },
      onFail: function (err) { }
    });
  }
}
//根据日期获取周几
let getWeek = (day) => {
  var weekArray = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
  var week = weekArray[new Date(day).getDay()];
  return week
}
// 表单提交
let formSubmit = ({ url, params }) => {
  var form = $("<form>");//定义一个form表单
  form.attr("style", "display:none");
  form.attr("target", "");
  form.attr("method", "post");//请求类型
  form.attr("action", url);//请求地址
  $("body").append(form);//将表单放置在web中

  for (var key in params) {
    var input = $("<input>");
    input.attr("type", "hidden");
    input.attr("name", key);
    input.attr("value", params[key]);
    form.append(input);
  }
  form.submit();//表单提交
};
let util = {
  callTakeEvery,
  callTakeLatest,
  dateFormat,
  getUrlParam,
  getUserInfo,
  getValueFromCookieByKey,
  urlFormat,
  getDevice,
  clickPoint,
  getValue,
  getObjByKey,
  isEmptyObj,
  compare,
  isObject,
  throttle,
  debounce,

  //以下会议的方法
  showLoading,
  default_showLoading,
  hideLoading,
  showMask,
  hideMask,
  showMask2,
  setTitle,
  timeFormat,
  setLeft,
  addrListFormat,
  getSelectAddrList,
  beginTimeFormat,
  success,
  error,
  info,
  loading,
  getorderInfo,
  timestamp,
  getTimeFlows,
  vsUpDialog,
  checkDialog,
  getWeek,
  formSubmit
}
window.util = util;
module.exports = util;
export default util;
