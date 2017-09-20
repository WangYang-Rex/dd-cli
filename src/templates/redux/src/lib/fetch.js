// https://github.com/github/fetch
import 'whatwg-fetch';

let defaultOption = {
    credentials: 'same-origin',
    withCredentials: true
}

let getFullUrl = (url) => {
    return url;
}

let commonRes = (p) => {
    return p
        .then(res => {return res.json()}) //序列化res
        .then(res => {
            if (res.result == 100) {
                return res.data;
            }
            throw res;
        });
}

let commonReq = (p) => {
    return p;
}

let get = (url, data) => {
    let tmp = [];
    if(data) {
        Object.keys(data).map(key => {
            tmp.push(key + '=' + data[key]);
        });
    }

    let query = tmp.join('&');
    if(url.indexOf('?') > -1) {
        url += '&' + query;
    } else url += '?' + query;
    return commonRes(fetch(getFullUrl(url), defaultOption));
}

let post = (url, data = {}) => {
    let option = Object.assign({}, defaultOption, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        // withCredentials: true,
        body: JSON.stringify(data)
    });
    return commonRes(fetch(getFullUrl(url), option));
}

module.exports = {
    get: commonReq(get),
    post: commonReq(post),
}

