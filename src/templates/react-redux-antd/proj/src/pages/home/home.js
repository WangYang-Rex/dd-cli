
import React from 'react';
require('./home.styl');

import { Input } from 'antd';


class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isShopwFilter : true
        };
    }
    render() {
        return (
            <div className="home">
                首页
            </div>
        );
    }
}

module.exports = Home;
