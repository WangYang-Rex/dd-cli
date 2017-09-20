import React, {
    Component,
    PropTypes
  } from 'react';
  import { connect } from 'react-redux';
  import { bindActionCreators } from 'redux';
  import * as Act from 'actions';
  import dingApi from '../lib/dingApi';
  
  class login extends Component {
    /**
      * 获取授权码 免登
      * @memberof Login
    */
    doAuth() {
      let t = this;
      //获取corpId
      window.needAuth = true;
      dingApi.dd_config()
    }
    componentDidMount() {
      // this.doAuth();
      this.props.dispatch({
        type: Act.LOGIN_DD_CONFIG,
        needAuth: true
      });
    }
    render() {
      const { actions } = this.props;
      return (
        <div className="login">
            page login
        </div>
      );
    }
  
  }
  
  function mapStateToProps(state) {
    const props = {};
    return props;
  }
  
  function mapDispatchToProps(dispatch) {
    // const actions = {};
    // const actionMap = { actions: bindActionCreators(actions, dispatch) };
    // return actionMap;
    return {}
  }
  
  export default connect(mapStateToProps)(login);
  