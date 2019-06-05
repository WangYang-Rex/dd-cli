import Fetch from '../fetch';

// demo
export let demo = (...arg) => Fetch.post('/demo', ...arg);
/************* 免登 初始化 **************/
// 免登配置信息请求
export let get_free_login_cfg = (...arg) => Fetch.post('/jsTicket/getCfg', ...arg);
// 免登认证
export let get_free_login_auth = (...arg) => Fetch.post('/jsTicket/auth', ...arg);
// 企业会话消息(用户反馈方法)发送
export let send_corp_msg_by_code = (...arg) => Fetch.post('/message/sendCorpMsgByCode', ...arg);
// 企业会话消息(用户反馈方法)发送oa消息
export let send_msg_authorized_by_code = (...arg) => Fetch.post('/send/msg/authorized/by/code', ...arg);
// 授权用户访问企业下的自定义空间
export let pan_auth = (...arg) => Fetch.post('/jsTicket/panAuth', ...arg);
