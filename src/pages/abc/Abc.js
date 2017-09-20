
import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Act from 'actions';
import './Abc.styl';
import {
    message
} from 'antd';

class Abc extends React.Component {

	constructor(props) {
        super(props);
        this.state = {
        };
    }
	render() {
		return (
			<div className="abc">
                page abc
            </div>
		);
    }
    componentWillMount() {
		// this.props.dispatch({
		// 	type: Act.GET_DEPT_LIST
		// });
    }

    componentDidMount() {}
    componentWillReceiveProps(nextProps) {}
    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }
    componentWillUpdate(nextProps, nextState) {}
    componentDidUpdate(prevProps, prevState) {}
    componentWillUnmount() {}
}

// Uncomment properties you need
// PersonmanageComponent.propTypes = {};
// PersonmanageComponent.defaultProps = {};

const mapStateToProps = state => {
	return {
	}
}
function mapDispatchToProps(dispatch) {
    // const actions = {};
    // const actionMap = { actions: bindActionCreators(actions, dispatch) };
    // return actionMap;
    return {}
  }
export default connect(mapStateToProps)(Abc);
