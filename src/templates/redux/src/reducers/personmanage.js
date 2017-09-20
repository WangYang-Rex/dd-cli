import * as Act from 'actions';

const initState = {
    dept_list: [{'deptId':'48843982','deptName':'子部门6','deptParentId':'49032049'},{'deptId':'48895995','deptName':'子部门8','deptParentId':'48993184'},{'deptId':'48955245','deptName':'子部门2','deptParentId':'48859997'},{'deptId':'48993184','deptName':'子部门7','deptParentId':'48843982'},{'deptId':'48993185','deptName':'子部门10','deptParentId':'49030061'},{'deptId':'49013088','deptName':'子部门11','deptParentId':'48993185'},{'deptId':'49020063','deptName':'子部门3','deptParentId':'48955245'},{'deptId':'49030061','deptName':'子部门9','deptParentId':'48895995'},{'deptId':'49032049','deptName':'子部门5','deptParentId':'49046002'},{'deptId':'49033035','deptName':'子部门12','deptParentId':'49013088'},{'deptId':'49046002','deptName':'子部门4','deptParentId':'49020063'}],
    user_list: [{'userId':1,'userName':'wangyang','userPicUrl':'userPicUrl1','role':'role1','roles':[{'roleId':1,'roleName':'roleName1'},{'roleId':2,'roleName':'roleNam2'}]},{'userId':2,'userName':'wangyang2','userPicUrl':'userPicUrl2','role':'role2','roles':[{'roleId':1,'roleName':'roleName'}]},{'userId':3,'userName':'wangyang3','userPicUrl':'userPicUrl3','role':'role3','roles':[{'roleId':1,'roleName':'roleName'}]},{'userId':4,'userName':'wangyang','userPicUrl':'userPicUrl1','role':'role1','roles':[{'roleId':1,'roleName':'roleName'}]},{'userId':5,'userName':'wangyang2','userPicUrl':'userPicUrl2','role':'role2','roles':[{'roleId':1,'roleName':'roleName'}]},{'userId':6,'userName':'wangyang3','userPicUrl':'userPicUrl3','role':'role3','roles':[{'roleId':1,'roleName':'roleName'}]},{'userId':7,'userName':'wangyang','userPicUrl':'userPicUrl1','role':'role1','roles':[{'roleId':1,'roleName':'roleName'}]},{'userId':8,'userName':'wangyang2','userPicUrl':'userPicUrl2','role':'role2','roles':[{'roleId':1,'roleName':'roleName'}]},{'userId':9,'userName':'wangyang3','userPicUrl':'userPicUrl3','role':'role3','roles':[{'roleId':1,'roleName':'roleName'}]},{'userId':10,'userName':'wangyang','userPicUrl':'userPicUrl1','role':'role1','roles':[{'roleId':1,'roleName':'roleName'}]},{'userId':12,'userName':'wangyang2','userPicUrl':'userPicUrl2','role':'role2','roles':[{'roleId':1,'roleName':'roleName'}]},{'userId':13,'userName':'wangyang3','userPicUrl':'userPicUrl3','role':'role3','roles':[{'roleId':1,'roleName':'roleName'}]},{'userId':14,'userName':'wangyang','userPicUrl':'userPicUrl1','role':'role1','roles':[{'roleId':1,'roleName':'roleName'}]},{'userId':16,'userName':'wangyang2','userPicUrl':'userPicUrl2','role':'role2','roles':[{'roleId':1,'roleName':'roleName'}]},{'userId':15,'userName':'wangyang3','userPicUrl':'userPicUrl3','role':'role3','roles':[{'roleId':1,'roleName':'roleName'}]}],
    total: 99,
    userPages: {
        pageNo: 1,
        pageSize: 20,
        deptId: ''
    },
    roleList : [{'roleId':1,'roleName':'角色1'},{'roleId':2,'roleName':'角色2'},{'roleId':3,'roleName':'角色3'},{'roleId':4,'roleName':'角色5'},{'roleId':5,'roleName':'角色5'},{'roleId':6,'roleName':'角色6'}]
}
// const initState = {
//     dept_list: [],
//     user_list: [],
//     total: 0,
//     userPages: {
//         pageNo: 1,
//         pageSize: 20,
//         deptId: ''
//     }
// }

export default function personmanage(state = initState, action) {
    switch(action.type) {
        case Act.SET_USER_PAGES:
            return Object.assign({}, state, {
                userPages: Object.assign({}, state.userPages, action.userPages)
            });
        case Act.SET_DEPT_LIST:
            return Object.assign({}, state, {
                dept_list: action.dept_list || state.dept_list
            });
        case Act.SET_USER_LIST:
            return Object.assign({}, state, {
                user_list: action.user_list ? action.user_list : state.user_list,
                total: action.total ? action.total : state.total
            });
        default:
            return state;
    }
}
