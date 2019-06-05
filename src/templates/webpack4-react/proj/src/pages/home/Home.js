import React from 'react';
import {connect} from 'react-redux';
import * as Act from 'actions';
import './Home.styl';
// import util from 'util';
import { Table, Modal, message } from 'antd';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    let t = this, { goalTypes } = t.state;
    return (
      <div className="home main">
        home12
      </div>
    );
  }
  componentWillMount() {
  }
  componentDidMount(){
  }
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }
  componentWillUnmount() {
  }
}

const mapStateToProps = state => {
  return {
  };
};

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps)(Home);
