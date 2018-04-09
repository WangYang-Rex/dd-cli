
import React from 'react';
<% if (store) { %>
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Act from 'actions';
<% } %>
import './<%- Name %>.styl';

class <%- Name %> extends React.Component {

	constructor(props) {
    super(props);
    this.state = {
    };
  }
	render() {
		return (
			<div className="<%= name %>">
        page <%= name %>
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
  shouldComponentUpdate(nextProps, nextState) { return true; }
  componentWillUpdate(nextProps, nextState) {}
  componentDidUpdate(prevProps, prevState) {}
  componentWillUnmount() {}
}

<% if (store) { %>
// Uncomment properties you need
// PersonmanageComponent.propTypes = {};
// PersonmanageComponent.defaultProps = {};

function mapDispatchToProps(dispatch) {
  // const actions = {};
  // const actionMap = { actions: bindActionCreators(actions, dispatch) };
  // return actionMap;
  return {}
}
const mapStateToProps = state => {
	return {
	}
}
export default connect(mapStateToProps)(<%- Name %>);
<% } else { %>
export default <%- Name %>;
<% } %>