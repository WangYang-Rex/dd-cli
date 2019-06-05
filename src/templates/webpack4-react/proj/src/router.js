import React, { Component } from 'react';
import {  Switch, Route } from 'react-router-dom';

import { importPath } from './loadable';

import Login from 'pages/login.js'

let router = [
  {
    path: '/',
    exact: true,
    component:importPath({
      loader: () => import("pages/home"),
    }),
  },
  {
    path: '/home',
    exact: true,
    component:importPath({
      loader: () => import("pages/home"),
    }),
  },
  {
    path: '/login',
    exact: true,
    component: Login,
  },
]

const Routers = () => (
  <main>
    <Switch>
      {
        router.map(({component, path, exact},index)=>{
          return <Route exact={exact}  path={path} component={component} key={path} />
        })
      }
    </Switch>
  </main>
);

export default Routers;
