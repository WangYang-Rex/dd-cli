import React from 'react';
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
                component abc
            </div>
		);
    }
    
    componentWillMount() {}
    componentDidMount() {}
    componentWillReceiveProps(nextProps) {}
    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }
    componentWillUpdate(nextProps, nextState) {}
    componentDidUpdate(prevProps, prevState) {}
    componentWillUnmount() {}
}

export default Abc;
