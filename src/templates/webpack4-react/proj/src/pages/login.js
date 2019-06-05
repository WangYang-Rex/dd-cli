import React from 'react';
import {connect} from 'react-redux';
import * as Act from 'actions';

class login extends React.PureComponent {
  componentDidMount () {
    // this.props.dispatch ({
    //   type: Act.DD_CONFIG,
    //   needAuth: true,
    // });
  }
  render () {
    return (
      <div className="meeting-loading"></div>
    );
  }
}

function mapStateToProps (state) {
  const props = {};
  return props;
}
export default connect (mapStateToProps) (login);
