import * as Fetch from './server';
import util from './util'

//鉴权失败，
let sessionDismiss = function(){
    if(!window.dismiss) {
        window.dismiss = true;
        DingTalkPC.device.notification.alert({
            message: '会话失效，请重进应用',
            title: '提示',//可传空
            buttonName: '确定',
            onSuccess : function() {
                /*回调TODO关闭页面*/
            },
            onFail : function(err) {}
        });
    }
}
/**
 * dingding JSSDK初始化函数
 * 调用get_free_login_cfg接口获取 config 相关参数
 * 执行dd.config
 * 设置dd.error和dd.ready监听
 * @param {any} cb 回调函数
 */
let dd_config = function (cfg) {
    let _corpId = window.localStorage.getItem('corpId') || util.getUrlParam('corpId') || util.getUrlParam('corpId', location.herf);
    if(!_corpId){
        sessionDismiss();
        return;
    }
    let config = Object.assign({}, {
        agentId: '', // 必填，微应用ID
        corpId: _corpId, //必填，企业ID
        timeStamp: '123', // 必填，生成签名的时间戳
        nonceStr: '', // 必填，生成签名的随机串
        signature: '', // 必填，签名
        type: 0, //选填。0表示微应用的jsapi,1表示服务窗的jsapi。不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
        jsApiList: ['runtime.info',
        'runtime.permission.requestAuthCode', //免登授权码
        'runtime.permission.requestOperateAuthCode', //用户反馈式授权码
        'biz.contact.choose', 'biz.util.uploadImage',
        'biz.util.openSlidePanel', 'biz.navigation.quit',
        'biz.ding.post', 'biz.util.previewImage',
        'device.notification.confirm', 'device.notification.prompt',
        'biz.cspace.preview','biz.navigation.setLeft','biz.navigation.setTitle',
        'ui.webViewBounce.disable','biz.util.uploadAttachment'
        ] // 必填，需要使用的jsapi列表，注意：不要带dd。
    }, cfg);
    
    //缓存到sessionStorage
    sessionStorage.setItem('spaceId', cfg.spaceId);
    sessionStorage.setItem('cId', cfg.cId);
    sessionStorage.setItem('signature', cfg.signature);
    sessionStorage.setItem('nonceStr', cfg.nonStr);
    sessionStorage.setItem('timeStamp', cfg.timeStamp);
    sessionStorage.setItem('agentId', cfg.agentId);

    config['signature'] = cfg.signature;
    config['nonceStr'] = cfg.nonStr;
    config['timeStamp'] = cfg.timeStamp;
    config['corpId'] = cfg.corpId;
    config['agentId'] = cfg.agentId;
    window.config = config;

    return new Promise(function(resolve, reject){
        //dd.ready
        DingTalkPC.ready(function(res){
            console.log('dd ready1');
            // cb && cb()
            resolve(true);
        })
        DingTalkPC.error(function(error){
            console.log('DingTalkPC error', JSON.stringify(error))
            reject(false);
        })
        try {
            DingTalkPC && DingTalkPC.config(config);
        } catch (e) {
            console.log('DingTalkPC.config报错：'+JSON.stringify(e))
        }
    })
}
/**
 * 获取授权码
 * 成功获取后调用免登接口get_free_login_auth
 * @param {function} cb1 回调函数:获取授权码后调用
 * @param {function} cb2 回调函数:成功免登后调用
 */
let getAuthCode = function () {
    console.log('getAuthCode start')
    return new Promise(function(resolve, reject){
        DingTalkPC.runtime.permission.requestAuthCode({
            corpId: localStorage.getItem('corpId'), //企业id
            onSuccess: function (info) {
                console.log('getAuthCode success:' + info.code);
                //进行免登
                sessionStorage.setItem('code', info.code);
                resolve(info.code);
            },
            onFail: function (err) {
                reject()
            }
        });
    })
}
/**
 * 获取微应用反馈式操作的临时授权码
 * @param {any} params
 */
let getRequestOperateAuthCode = function (params) {
    DingTalkPC.runtime.permission.requestOperateAuthCode({
        corpId: localStorage.getItem('corpId'),
        agentId: sessionStorage.getItem('agentId'),
        onSuccess: function(result) {
            Fetch.send_corp_msg_by_code({
                'code': result.code,
                'agentid': sessionStorage.getItem('agentId'), //企业当前使用应用的agentId，如不传，则默认使用圆桌的agentId
                'userIdArray': params.userIdArray, //员工id列表,消息接收者
                'messageType': 'oa', //text|image|voice|file|link|oa
                'msgContents': params.msgContents //消息体
            })
        },
        onFail : function(err) {
            console.log(err)
        }
    })
}
/**
 * 选择企业用户
 * @param {Object} opt
 */
let dd_biz_contact_choose = function(opt){
    if(!opt) return
    DingTalkPC.biz.contact.choose({
        multiple: opt.multiple || true, //是否多选： true多选 false单选； 默认true
        users: opt.users || [], //默认选中的用户列表，员工userid；成功回调中应包含该信息
        corpId: localStorage.getItem('corpId'), //企业id
        max: opt.max || 1500, //人数限制，当multiple为true才生效，可选范围1-1500
        onSuccess: function(data) {
            /* data结构
            [{
                "name": "张三", //姓名
                "avatar": "http://g.alicdn.com/avatar/zhangsan.png" //头像图片url，可能为空
                "emplId": '0573', //员工userid
            },
            ...
            ]
            */
            opt.success && opt.success(data)
        },
        onFail : function(err) {
            opt.error && opt.error(err)
        }
    });
}
/**
 * 打开侧边面板
 * @param {Object} opt
 */
let dd_biz_util_openSlidePanel = function(opt){
    if(!opt || !opt.url) return
    DingTalkPC.biz.util.openSlidePanel({
        url: opt.url || 'about:blank', //打开侧边栏的url
        title: opt.title || 'title', //侧边栏顶部标题
        onSuccess : function(result) {
           /*
                调用biz.navigation.quit接口进入onSuccess, result为调用biz.navigation.quit传入的数值
            */
            opt.success && opt.success(result);
        },
        onFail : function() {
            /*
                tips:点击右上角上角关闭按钮会进入onFail
             */
            opt.error && opt.error();
        }
    })
}
/**
 * 关闭侧边面板 在侧边面板上面调用
 * @param {any} opt
 */
let dd_biz_navigation_quit = function(opt){
    DingTalkPC.biz.navigation.quit({
        message: opt.message || '',//退出信息，传递给openModal或者openSlidePanel的onSuccess函数的result参数
        onSuccess : function(result) {
            opt.success && opt.success(result)
        },
        onFail : function() {}
    })
}
/**
 * 发钉
 * @param {any} opt
 */
let dd_biz_ding_post = function(opt){
    let options = Object.assign({}, {
        users: [],
        corpId: localStorage.getItem('corpId'),
        type: 1,
        alertType: 2,
        // alertDate: {"format":"yyyy-MM-dd HH:mm","value":"2015-05-09 08:00"},
        // attachment: {
        //     images: [''], //只取第一个image
        // }, //附件信息
        text: '',
        onSuccess : function() {
            opt.success && opt.success();
        },
        onFail : function() {
            opt.error && opt.error();
        }
    }, opt);
    DingTalkPC.biz.ding.post(options);
}

let dingApi = {
    dd_config,
    getAuthCode,
    getRequestOperateAuthCode,
    dd_biz_contact_choose,
    dd_biz_util_openSlidePanel,
    dd_biz_navigation_quit,
    dd_biz_ding_post
};
module.exports = dingApi;
