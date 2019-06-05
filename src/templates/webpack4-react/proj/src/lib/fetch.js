/*
 * @Author: wangyang
 * @Date: 2017-09-26 16:17:55
 * @Last Modified by: heicao
 * @Last Modified time: 2018-12-27 10:57:57
 */
// https://github.com/github/fetch
import 'whatwg-fetch';
import {message, Modal} from 'antd';
import React from 'react';

// import {sendError} from './../error';
// import {messageUtil} from 'lib/util/message.tsx';
const apiParams = {};

let defaultOption = {
  credentials: 'same-origin',
  withCredentials: true,
};

let getFullUrl = url => {
  if (url.indexOf ('rjson') > -1) {
    //
    return url;
  } else {
    return `${url}.rjson`;
  }
};

// const commonResError = res => {
//   return res.then (e => {
//     messageUtil ('error', e.message, 0.8);
//     throw e;
//   });
// };

// const retryPost = async (params, type, text) => {
//   params.retryCount--;
//   if (params.retryCount == 0) {
//     messageUtil ('error', '系统异常,请稍后重试...', 0.8);
//     delete apiParams[type];
//     console.log (text);
//     if (type.indexOf ('errinfo/add.rjson') == -1) {
//       //避免发生错误信息接口
//       sendError ({
//         errorType: 'api-retryPost 重新加载',
//         errorMessage: text,
//         hash: location.href,
//         DingTalkPC: DingTalkPC.ua,
//       });
//     }
//   } else {
//     messageUtil ('loading', `正在进行第${2 - params.retryCount}次重新加载,请稍后...`, 40);
//     const retryData = await fetch (getFullUrl (params.url), params.option);
//     if (retryData.status == '502') {
//       delete apiParams[type];
//       return {result: 313, message: '系统异常,请稍后重试...'};
//     } else {
//       delete apiParams[type];
//       return retryData.json ();
//     }
//   }
// };
/**
 *  需要重连的错误码 服务器挂了 接口不存在  响应超时
 */
const errorCode = [502, 404, 408];


/**
 *
 * @param {*} params 整个api对象
 * @param {*} url 后端返回接口
 * @param {*} text
 */
const retryPost = async (params, url) => {
  // messageUtil ('loading', `正在进行重新加载,请稍后...`, 40);
  const retryData = await fetch(getFullUrl(params.url), params.option) || {};
  delete apiParams[url];
	if (retryData &&  errorCode.includes(retryData.status)) {
		// console.log(url,url.indexOf ('errinfo/add'))
		// 	console.log(e, "e2")
		if (url.indexOf ('errinfo/add') == -1) {
			//避免发生错误信息接口
			// sendError ({
			// 	errorType: 'api-retry',
			// 	errorMessage: `${retryData.status} ${url}`,
			// 	hash: location.href,
			// 	DingTalkPC: DingTalkPC.ua,
      //   api: params.url,
      //   params: JSON.stringify(params.option)
			// });
		}
    return {result: 313, message: '系统异常,请稍后重试...'};
  } else {
    return retryData && retryData.json ();
  }
};

let commonRes = (p, url, data) => {
  return p
    .then (async res => {
      // if(res){
      //   if (errorCode.includes(res.status)) {
      //     return await retryPost (
      //       apiParams[res.url],
      //       res.url,
      //     );
      //   } else if (res.status == 313) {
      //     if (apiParams[res.url]) {
      //       delete apiParams[res.url]
      //     }
      //     return commonResError (
      //       new Promise ((resolve, reject) => {
      //         resolve ({result: 313, message: '操作太频繁,请稍后重试'});
      //       })
      //     );

      //   } else {
      //     if (apiParams[res.url]) {
      //       delete apiParams[res.url]
      //     }
      //     return res.json ();
      //   }
      // }
      return res && res.json();
    }) //序列化res
    .then(res => {
      if(res){
        if (res.result >= 100 && res.result <= 200) {
          if (res.data === false) {
            return false;
          }
          return res.data || true;
        } else if (res.result == 327) {
          // 判断授权是否超过上限
          Modal.info ({
            title: '超过授权上限了',
            content: (
              <div>
                <p>
                  当前用户版本，最多支持
                  {util.getValueFromCookieByKey ('crm_item_max_people')}
                  人，已授权
                  {util.getValueFromCookieByKey ('crm_item_max_people')}
                  人了
                </p>
                <p>请联系客服进行升级，电话：13018967365</p>
              </div>
            ),
            onOk () {},
          });
          return;
        } else if (res.status && res.status.code) {
          // 请求番茄别单后台写打接口，他的数据根式为{data:{数据}， status:{code:200,message:""}}
          if (res.status.code === 200) {
            return res.data;
          } else {
            message.destroy ();
            message.error (res.status.message);
          }
        } else if (res.result === 707 || res.result === 708) {
          // 后台 陈沛文 定义返回，
          // 707 --> 需要弹出当前企业下所有员工，单选一个，userId调用ERP创建公司接口
          // 708 --> 企业未开通ERP功能，请联系客服开通该功能
          message.destroy ();
          message.info (res.message);
          const data = res.data || {};
          data.result = res.result;
          return data;
        } else {
          if (res.result == 702 || res.result == 703) {
            location.hash = '/login?needAuth=true&expired=true';
            return;
          }
          message.destroy ();
          message.error (res.message);
          throw res;
        }
      }
    })
		.catch(e => {
			// console.log(url, "url")
			// console.log(data, "data") // 参数
			// console.log(e, "e1")
      if (e.message.indexOf ('errinfo/add.rjson') == -1) {
        //避免发生错误信息接口
        sendError ({
          errorType: 'api-catch',
          errorMessage: e.message,
          hash: location.href,
          DingTalkPC: DingTalkPC.ua,
					api:url,
					params: JSON.stringify(data)
        });
      }
      // 需要统一的处理错误方式，避免每次都catch
    });
};

let commonReq = p => {
  return p;
};

let get = (url, data) => {
  let tmp = [];
  if (data) {
    Object.keys (data).map (key => {
      tmp.push (key + '=' + data[key]);
    });
  }

  let query = tmp.join ('&');
  if (url.indexOf ('?') > -1) {
    url += '&' + query;
  } else url += '?' + query;
  return commonRes (fetch (getFullUrl (url), defaultOption), url, data);
};
let post = (url, data = {}) => {
  let option = Object.assign ({}, defaultOption, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
    },
    // withCredentials: true,
    body: JSON.stringify (data),
    credentials: 'include',
  });
  // const allUrl = `${location.origin}${url}.rjson`;
  // if (url.indexOf('add') > -1) {
  //   if (apiParams[allUrl]) {
  //     return commonResError (
  //       new Promise ((resolve, reject) => {
  //         resolve ({result: 313, message: '操作太频繁,请稍后重试'});
  //       })
  //     );
  //   } else {
  //     apiParams[allUrl] = {
  //       retryCount: 2, //次数
  //       url, //url
  //       option, //参数
  //     };
  //     return commonRes (fetch (getFullUrl (url), option));
  //   }
  // } else {
    return commonRes (fetch (getFullUrl (url), option), url, data);
  // }



};

window.Fetch = {
  get: commonReq (get),
  post: commonReq (post),
};
module.exports = {
  get: commonReq (get),
  post: commonReq (post),
};

export default {
  get: commonReq (get),
  post: commonReq (post),
}
