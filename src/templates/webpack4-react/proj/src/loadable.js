import Loadable from 'react-loadable';

import React, { Component } from 'react';
export const Loading = props => {
  if (props.error) {
    // props.retry&&props.retry();
    window.location.reload();
    return <div >加载失败</div>
  } else if (props.timedOut) {
    // props.retry&&props.retry();
    window.location.reload();
    return <div >加载超时</div>
  } else if (props.pastDelay) {
    return <div >正在拼命加载中...</div>
  }
  return null
};


export const importPath = ({loader}) => {
  return  Loadable({
    loader,
    loading:Loading,
    delay: 200,
    timeout: 10000,
  })
}
