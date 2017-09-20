## 此文件夹是放置路由组件的
```js

import React from 'react';
import {connect} from 'react-redux';
import * as Act from 'actions';

require('demo.styl');

class Demo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isShopwFilter : true
        };
    }
    initState = (props) => {
        let na = props.address;
        this.setState({
        });
    }
    //调用initState 设置 state
    componentWillMount() {
        this.initState(this.props);
    }
    //调用initState 重置 state
    componentWillReceiveProps(newProps) {
        this.initState(newProps);
    }

    render() {
        return (
            <div className="demo">
              Please edit [demo].js to update this component!
            </div>
        );
    }
}


// Uncomment properties you need
// PersonmanageComponent.propTypes = {};
// PersonmanageComponent.defaultProps = {};

const mapStateToProps = state => {
  // get state from store
  return {
      // trade: state.trade.draft
  }
}

const mapDispatchToProps = dispatch => {
    /*return {
        save: address => {
            if (address.id) {
                dispatch({type: Act.UPDATE_ADDRESS, address});
            } else {
                // 创建一个
                address.id = new Date().getTime();
                dispatch({type: Act.ADD_ADDRESS, address});
                location.href = '#/address/' + address.type;
            }
        },
        quickSetAddress: address => {
            dispatch({type: Act.QUICK_SET_ADDRESS, address});
        }
    }*/
    return {}
}

export default connect(mapStateToProp, mapDispatchToProps)(Demo);


```