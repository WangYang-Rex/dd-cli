
import React from 'react';
import {
    Modal,
    Checkbox,
    message,
    Select
} from 'antd';

class Rolemodal extends React.Component {

	constructor(props) {
        super(props);
        this.state = {
            selectRole: []
        };
    }

	componentWillMount() {
        let selectRole = [];
        this.props.editRolePerson.roles.map((role)=>{
            selectRole.push(role.roleId)
        })
        this.setState({
            selectRole: selectRole
        })
    }
    
    onOk(){
        let {selectRole} = this.state;
        if(selectRole.length == 0){
            message.warning('请选择角色');
            return
        }
        let {roleList} = this.props;
        let _roleList = [];
        roleList.map((role) => {
            selectRole.indexOf(role.roleId)>=0
                && _roleList.push({ roleId: role.roleId, roleName: role.roleName});
        })
        this.props.onOk(_roleList);
    }

	render() {
        let t = this,
        { selectRole } = this.state,
        { editRolePerson, roleList } = this.props;
        let options = [];
        roleList.map((role)=>{
            options.push({
                label: role.roleName,
                value: role.roleId
            })
        });
        
		return (
			<Modal
                title="编辑角色"
                visible={true}
                onOk={() => {this.onOk()}}
                onCancel={this.props.onCancel}
                >
                <div className="personmanage-editRole">
                    <div className="role-wrap t-FBH">
                        <div className="title">角色:</div>
                        <div className="t-FB1">
                            <Checkbox.Group
                                options={options}
                                defaultValue={selectRole}
                                onChange={this.onCheckBoxChange.bind(t)}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
		);
    }

    onCheckBoxChange(checkedValues){
        this.setState({
            selectRole: checkedValues
        })
    }
}

export default Rolemodal;
