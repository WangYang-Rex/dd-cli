import util from "./util";
import * as Fetch from "server";

//鉴权失败，
const sessionDismiss = function () {
  if (!window.dismiss) {
    window.dismiss = true;
    DingTalkPC.device.notification.alert({
      message: "会话失效，请重进应用",
      title: "提示", //可传空
      buttonName: "确定",
      onSuccess: () => {
        /*回调TODO关闭页面*/
      },
      onFail: (err) => { }
    });
  }
};

/**
 *  获取corpID 
 */
const getCorpId = () => {
  const _corpId = util.getUrlParam("corpId") || localStorage.getItem("corpId") || util.getUrlParam("corpId", location.herf);
  if (!_corpId) {
    sessionDismiss();
    return;
  }
  return _corpId
}

/**
 *  获取 config
 */
const getConfig = (jsApiList = []) => {
  const _corpId = getCorpId();
  return {
    agentId: "", // 必填，微应用ID
    corpId: _corpId, //必填，企业ID
    timeStamp: "123", // 必填，生成签名的时间戳
    nonceStr: "", // 必填，生成签名的随机串
    signature: "", // 必填，签名
    type: 0, //选填。0表示微应用的jsapi,1表示服务窗的jsapi。不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
    jsApiList// 必填，需要使用的jsapi列表，注意：不要带dd。
  };
}

const DingTalkPCReady = (cb) => {
  DingTalkPC.ready(res => {
    console.log(`"dd ready" ${new Date()}`);
    cb()
  });
}
const DingTalkPCError = (cb) => {
  DingTalkPC.error((error) => {
    console.log("DingTalkPC error", JSON.stringify(error));
    // Fetch.js_errorinfo({
    //   "msgtype": "markdown",
    //   "markdown": {
    //     title: 'js鉴权错误',
    //     text: `
    //       ### error
    //       ${JSON.stringify(error)}
    //       ### corpId
    //       ${window.localStorage.getItem("corpId") || util.getUrlParam("corpId") || util.getUrlParam("corpId", location.herf)}
    //       ### device
    //       ${navigator.userAgent}
    //       ### page_url
    //       ${location.href}
    //       ### config
    //       ${JSON.stringify(window.config)}
    //     `
    //   },
    // })
    cb()
  });
}

/**
 * dingding JSSDK初始化函数
 * 调用get_free_login_cfg接口获取 config 相关参数
 * 执行dd.config
 * 设置dd.error和dd.ready监听
 * @param {any} cb 回调函数
 */
let dd_config = function () {
  const _corpId = getCorpId();
  const config = getConfig(["runtime.permission.requestOperateAuthCode"]);
  return new Promise(function (resolve, reject) {
    Fetch.get_free_login_cfg({
      corpId: _corpId,
      redirectURL: location.href.replace(location.hash, ""),
      domain: "meeting",
      // "forceGet": isError ? true : false
    }).then(cfg => {
      if (cfg && typeof cfg == 'boolean' || !cfg) {
        reject(false);
        return
      }
      //缓存到localStorage
      localStorage.setItem("spaceId", cfg && cfg.spaceId);
      localStorage.setItem("cId", cfg.cId);
      localStorage.setItem("signature", cfg.signature);
      localStorage.setItem("nonceStr", cfg.nonStr);
      localStorage.setItem("timeStamp", cfg.timeStamp);
      localStorage.setItem("agentId", cfg.agentId);
      config["signature"] = cfg.signature;
      config["nonceStr"] = cfg.nonStr;
      config["timeStamp"] = cfg.timeStamp;
      config["corpId"] = cfg.corpId;
      config["agentId"] = cfg.agentId;
      window.config = config;

      try {
        DingTalkPC && DingTalkPC.config(config);
      } catch (e) {
        console.log("DingTalkPC.config报错：" + JSON.stringify(e));
      }
      //dd.ready
      DingTalkPCReady(() => {
        resolve(true);
      })
      DingTalkPCError(() => {
        reject(false);
      })
    });
  });
};
/**
 * 获取授权码
 * 成功获取后调用免登接口get_free_login_auth
 * @param {function} cb1 回调函数:获取授权码后调用
 * @param {function} cb2 回调函数:成功免登后调用
 */
let getAuthCode = function () {
  console.log("getAuthCode start");
  return new Promise(function (resolve, reject) {
    DingTalkPC.runtime.permission.requestAuthCode({
      corpId: getCorpId(), //企业id
      onSuccess: (info) => {
        console.log("getAuthCode success:" + info.code);
        //进行免登
        sessionStorage.setItem("code", info.code);
        resolve(info.code);
        const config = {
          ...window.config, ...{
            jsApiList: [
              "runtime.permission.requestOperateAuthCode",
              'biz.contact.choose', 'biz.util.uploadImage',
              'biz.ding.post',
              'biz.cspace.preview',
              "biz.util.uploadAttachment", "biz.customContact.multipleChoose",
            ]
          }
        };
        console.log(config, '---------config')
        DingTalkPC && DingTalkPC.config(config)
      },
      onFail: function (err) {
        reject();
      }
    });
  });
};
/**
 * 获取微应用反馈式操作的临时授权码
 * @param {any} params
 */
let getRequestOperateAuthCode = function (params) {
  try {
    DingTalkPC.runtime.permission.requestOperateAuthCode({
      corpId: getCorpId(),
      agentId: localStorage.getItem("agentId"),
      onSuccess: function (result) {
        Fetch.send_corp_msg_by_code({
          code: result.code,
          agentid: localStorage.getItem('agentId'), //企业当前使用应用的agentId，如不传，则默认使用有成的agentId
          userIdList: params.userIdArray || [], //员工id列表,消息接收者
          messageType: "oa", //text|image|voice|file|link|oa
          msgContents: params.msgContents //消息体
        });
      },
      onFail: function (err) {
        console.log(err);
      }
    });
  } catch (e) {
    console.error("dingApi.getRequestOperateAuthCode error", e);
  }
};
/**
 * 选择企业用户
 * @param {Object} opt
 */
let dd_biz_contact_choose = function (opt = {}) {
  if (!opt) return;
  DingTalkPC.biz.contact.choose({
    multiple: opt.multiple || true, //是否多选： true多选 false单选； 默认true
    users: opt.users || [], //默认选中的用户列表，员工userid；成功回调中应包含该信息
    corpId: getCorpId(), //企业id
    // max: opt.max, //人数限制，当multiple为true才生效，可选范围1-1500
    onSuccess: function (data) {
      /* data结构
			[{
					"name": "张三", //姓名
					"avatar": "http://g.alicdn.com/avatar/zhangsan.png" //头像图片url，可能为空
					"emplId": '0573', //员工userid
			},
			...
			]
			*/
      opt.success && opt.success(data);
    },
    onFail: function (err) {
      opt.error && opt.error(err);
    }
  });
};
/**
 * 打开侧边面板
 * @param {Object} opt
 */
let dd_biz_util_openSlidePanel = function (opt) {
  if (!opt || !opt.url) return;
  DingTalkPC.biz.util.openSlidePanel({
    url: opt.url || "about:blank", //打开侧边栏的url
    title: opt.title || "title", //侧边栏顶部标题
    onSuccess: function (result) {
      /* 调用biz.navigation.quit接口进入onSuccess, result为调用biz.navigation.quit传入的数值 */
      opt.success && opt.success(result);
    },
    onFail: function () {
      /* tips:点击右上角上角关闭按钮会进入onFail */
      opt.error && opt.error();
    }
  });
};
/**
 * 关闭侧边面板 在侧边面板上面调用
 * @param {any} opt
 */
let dd_biz_navigation_quit = function (opt) {
  DingTalkPC.biz.navigation.quit({
    message: opt.message || "", //退出信息，传递给openModal或者openSlidePanel的onSuccess函数的result参数
    onSuccess: function (result) {
      opt.success && opt.success(result);
    },
    onFail: function () { }
  });
};
/**
 * 发钉
 * @param {any} opt
 */
let dd_biz_ding_post = function (opt) {
  DingTalkPC.biz.ding.post({
    users: opt.users || [],
    corpId: getCorpId(),
    type: opt.type || 1,
    alertType: opt.alertType || 2,
    text: opt.text || "",
    onSuccess: function () {
      opt.success && opt.success();
    },
    onFail: function () {
      opt.error && opt.error();
    }
  });
};
let preview_image = function (urls, pic) {
  DingTalkPC.biz.util.previewImage({
    urls: urls, //图片地址列表
    current: pic, //当前显示的图片链接
    onSuccess: function (result) {
      /**/
    },
    onFail: function () { }
  });
};
/**
 * 图片预览，不需要js授权
 * @param {any} opt
 */
let previewImage = function (opt) {
  DingTalkPC.biz.util.previewImage({
    urls: opt.urls || [],
    current: opt.current || "",
    onSuccess: function () {
      opt.onSuccess && opt.onSuccess();
    },
    onFail: function () {
      opt.onFail && opt.onFail();
    }
  });
};

/**
 * 图片上传，需要js授权
 * @param {any} opt
 */
let uploadImage = function (opt) {
  DingTalkPC.biz.util.uploadImage({
    multiple: opt.multiple || true,
    max: opt.max || 9,
    onSuccess: function (result) {
      opt.success && opt.success(result);
    },
    onFail: function () {
      opt.error && opt.error();
    }
  });
};

/**
 * 上传附件，需要js授权
 * @param {any} opt
 */
let uploadAttachment = function (opt) {
  Fetch.pan_auth({
    domain: 'meeting',
    type: 'ADD', // 钉钉目前不区分 add和download, 如果有别的需要，可以试试传 preview info
    duration: 3600,
  }).then(() => {
    DingTalkPC.biz.util.uploadAttachment({
      image: {
        multiple: true,
        max: 9,
        spaceId: localStorage.getItem("spaceId")
      },
      space: {
        corpId: getCorpId(),
        spaceId: localStorage.getItem("spaceId"),
        max: 9
      },
      file: {
        spaceId: localStorage.getItem("spaceId"),
        max: 9
      },
      types: ["photo", "file", "space"],
      onSuccess: function (result) {
        opt.onSuccess && opt.onSuccess(result);
      },
      onFail: function () {
        opt.onFail && opt.onFail();
      }
    });
  })
};

/**
 * 钉盘文件预览，需要js授权
 * @param {any} opt
 */
let cspace_preview = function (opt) {
  Fetch.pan_auth({
    domain: 'crm',
    type: 'ADD', // 钉钉目前不区分 add和download, 如果有别的需要，可以试试传 preview info
    duration: 3600,
  }).then(() => {
    DingTalkPC.biz.cspace.preview({
      corpId: getCorpId(),
      spaceId: localStorage.getItem("spaceId"),
      fileId: opt.fileId,
      fileName: opt.fileName,
      fileSize: opt.fileSize,
      fileType: opt.fileType,
      onSuccess: function (result) {
        opt.onSuccess && opt.onSuccess(result);
      },
      onFail: function () {
        opt.onFail && opt.onFail();
      }
    });
  })
};

// 打开 链接
const openLinkFn = url => {
  DingTalkPC.biz.util.openLink({
    url, //要打开链接的地址
    onSuccess() { },
    onFail() { },
  });
};

// 打开 链接
const openLinkInModal = (url, title, size = 'large') => {
  DingTalkPC.biz.util.openModal({
    size,  // modal的尺寸
    url, //打开modal的内容的url
    title: title, //顶部标题
    onSuccess: function (result) {},
    onFail: function () {}
  })
};

let dingApi = {
  dd_config,
  getAuthCode,
  getRequestOperateAuthCode,
  dd_biz_contact_choose,
  dd_biz_util_openSlidePanel,
  dd_biz_navigation_quit,
  dd_biz_ding_post,
  previewImage,
  uploadImage,
  cspace_preview,
  uploadAttachment,
  preview_image,
  openLinkFn,
  openLinkInModal,
  getCorpId,
};
window.dingApi = dingApi;
module.exports = dingApi;

export default dingApi;
