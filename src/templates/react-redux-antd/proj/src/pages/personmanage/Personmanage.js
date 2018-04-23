/*
 * @Author: wangyang
 * @Date: 2017-09-19 17:30:09
 * @Last Modified by: wangyang
 * @Last Modified time: 2017-09-19 17:34:30
 */

import React from 'react';
import {connect} from 'react-redux';
import * as Act from 'actions';
import dingApi from 'dingApi';

require('./personmanage.styl');

import {
    Button,
    Tree,
    Breadcrumb,
    Table,
    Pagination,
    message
} from 'antd';

const TreeNode = Tree.TreeNode;
import Rolemodal from './RoleModal'
class Personmanage extends React.Component {

	constructor(props) {
        super(props);
        this.state = {
            pagesLoading: false,
            //角色弹窗参数
            editRolePerson: {},
            editRoleModalvisible: false,
            editRoleModalData: {
            }
        };
    }

	componentWillMount() {
        this.props.dispatch({
            type: Act.GET_USER_LIST,
            userPages: {
                deptId: ''
            }
		});
		this.props.dispatch({
			type: Act.GET_DEPT_LIST
		});
	}

	render() {
		let t = this,
			{dept_tree, dept_list, user_list, total, userPages, roleList, selectDept, breadDept} = this.props,
			{editRolePerson} = t.state;

		//递归遍历 gData
        const loop = data => data.map((item) => {
            if (item.children && item.children.length) {
                return <TreeNode key={item.key} title={item.title}>{loop(item.children)}</TreeNode>;
            }
            return <TreeNode key={item.key} title={item.title} />;
        });

        const columns = [
            {
                title: '姓名',
                dataIndex: 'userName',
                key: 'userName',
                width: '15%'
                // render: text => <a href="#">{text}</a>,
            }, {
                title: '在职',
                render: ()=>(<span>在职</span>),
                key: 'atwork',
                width: '15%'
            }, {
                title: '角色',
                // dataIndex: 'role',
                render: (record)=>{
                    let roleNames = [];
                    record.roles && record.roles.map(function(role){
                        roleNames.push(role.roleName);
                    })
                    // console.log(record);
                    return (<span>{roleNames.join(',')}</span>)
                },
                key: 'roles',
                width: '30%'
            }, {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                <span>
                    <a onClick={()=>{this.clickPerson(record.userId, 'editRole')}}>编辑角色</a>
                    <span className="ant-divider" />
                    <a onClick={()=>{this.clickPerson(record.userId, 'changeWork')}}>工作交接</a>
                </span>
                )
            }
        ];
		return (
			<div className="personmanage main t-FBV">
                <div className="containerheader">
                    <div className="headerName">员工管理</div>
                    <div className="headRight">
                        <span>上次更新：2017-07-27 17:54</span>
                        <Button onClick={()=>this.user_info_dept_sync()}>更新组织架构</Button>
                    </div>
                </div>
                <div className="contentWrap t-FB1 t-FBH">
                    <div className="t-FB1 t-FBH">
                        <div className="departments">
                            {
                                dept_tree.length >0 && (
                                    <Tree
                                        defaultExpandAll
                                        onSelect={this.onDeptSelect}
                                    >
                                        {loop(dept_tree)}
                                    </Tree>
                                )
                            }
                            
                        </div>
                        <div className="department-wrap t-FB1 t-FBV">
                            <div className="dep-top-wrap t-FB1 t-FBV">
                                <p className="dep-title">{selectDept && selectDept.deptName}</p>
                                <Breadcrumb separator=">">
                                    {
                                        breadDept.map((item)=>{
                                            return <Breadcrumb.Item key={item.deptId} onClick={()=>{this.onDeptSelect(item.deptId)}}>{item.deptName}</Breadcrumb.Item>
                                        })
                                    }
                                </Breadcrumb>
                                <div className="dep-desc">员工管理，请进入钉钉管理后台。在钉钉后台删除员工后，如果该员工有数据，请手动交接数据给其他员工</div>
                                <div className="table-wrap t-FB1">
                                    <Table
                                        rowKey='userId'
                                        loading={this.state.pagesLoading}
                                        columns={columns}
                                        dataSource={t.props.user_list}
                                        pagination={false}
                                        scroll={{ y: $('.table-wrap').height() - $('.table-wrap thead').height() }}
                                    />
                                </div>
                            </div>
                            <div className="dep-bottom-wrap ">
                                <Pagination current={userPages.pageNo} total={total} onChange={(pageNumber)=>{this.onPaginationChnage(pageNumber)}}/>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.state.editRoleModalvisible && (
                        <Rolemodal
                        roleList={roleList}
                        editRolePerson={this.state.editRolePerson}
                        onOk={(selectRole)=>this.updatePersonRole(selectRole)}
                        onCancel={()=>this.setState({editRoleModalvisible: false})}
                        ></Rolemodal>
                    )
                }
            </div>
		);
    }

    //部门同步
    user_info_dept_sync (){
        this.props.dispatch({ type: Act.DEPT_SYNC });
    }

	/**
     * 选择部门
     * @memberof Personmanage
     */
    onDeptSelect = (selectedKeys, info) => {
        let selectDeptId = typeof selectedKeys == 'string' ? selectedKeys : selectedKeys[0]
        this.props.dispatch({
            type: Act.GET_USER_LIST,
            userPages: {
                pageNo: 1,
                deptId: selectDeptId
            }
		});
    }
    /**
     * 操作点击
     * @param {String} person id
     * @param {string} type changeWork/editRole
     * @memberof Personmanage
     */
    clickPerson = (personId, type) => {
        // console.log(personId, type)
        let { user_list } = this.props;
        
        if(type == 'changeWork'){
            //工作交接
            dingApi.dd_biz_contact_choose({
                success: (users)=>{
                    // TODO
                    console.log(users)
                }
            });
        } else {
            let editRolePerson = user_list.filter((person) => {
                return person.userId == personId
            })[0]
            //编辑角色
            this.setState({
                editRoleModalvisible: true,
                editRolePerson: editRolePerson
            })
		}
    }

    /**
     * 分页器页码改变
     * @param {any} pageNumber 
     * @memberof Personmanage
     */
    onPaginationChnage (pageNumber){
        this.props.dispatch({
            type: Act.GET_USER_LIST,
            userPages: {
                pageNo: pageNumber
            }
        })
    }
    //更新人员角色
    updatePersonRole(roleList){
        // console.log('updatePersonRole', roleList);
        this.setState({editRoleModalvisible: false})
        // console.log(_roleList);
        this.props.dispatch({
            type: Act.UPDATE_USER_ROLE,
            params: {
                roleList: roleList,
                userId: this.state.editRolePerson.userId
            }
        })
        this.user_info_user_list();
    }
}

// 递归遍历部门列表
let getDeptTree = (depts) => {
	var arr = [];
	depts.map((_dept1)=>{
		depts.map((_dept2)=>{
			if(_dept1.deptParentId == _dept2.deptId)
				_dept1.hasParent = 1;
		})
		if(!_dept1.hasParent){
			arr.push({
				title: _dept1.deptName,
				key: _dept1.deptId,
				children: formatDept(depts, _dept1.deptId)
			})
		}
	})
	return arr
}
let formatDept = (depts, deptParentId) => {
	let arr = [];
	depts.map((item)=>{
		if(item.deptParentId == deptParentId){
			arr.push({
				title: item.deptName,
				key: item.deptId,
				children: formatDept(depts, item.deptId)
			})
		}
	})
	return arr
}
//

// Uncomment properties you need
// PersonmanageComponent.propTypes = {};
// PersonmanageComponent.defaultProps = {};

const mapStateToProps = state => {
    let {dept_list, deptId, userPages} = state.personmanage;
    let dept_tree = getDeptTree(dept_list);

    let breadDept = [], selectDept = null;
    if(userPages.deptId){
        breadDept = dept_list.filter(item=>{
            return item.deptId == userPages.deptId
        })
        selectDept = breadDept[0]
        const breadloop = (dept_list, deptParentId) => dept_list.map((item)=>{
            if(item.deptId == deptParentId){
                breadDept.unshift(item);
                breadloop(dept_list, item.deptParentId)
            }
        })
        breadloop(dept_list, breadDept[0].deptParentId);
    }
    
	return {
		dept_list: state.personmanage.dept_list,
		dept_tree: dept_tree,
		user_list: state.personmanage.user_list,
        total: state.personmanage.total,
        userPages: state.personmanage.userPages,
        roleList: state.personmanage.roleList,
        breadDept: breadDept,
        selectDept: selectDept
	}
}
export default connect(mapStateToProps)(Personmanage);
