import * as Act from 'actions';

const initState = {
  // user_list: [{'userId':1,'userName':'wangyang','userPicUrl':'userPicUrl1','role':'role1','roles':[{'roleId':1,'roleName':'roleName1'},{'roleId':2,'roleName':'roleNam2'}]},{'userId':2,'userName':'wangyang2','userPicUrl':'userPicUrl2','role':'role2','roles':[{'roleId':1,'roleName':'roleName'}]},{'userId':3,'userName':'wangyang3','userPicUrl':'userPicUrl3','role':'role3','roles':[{'roleId':1,'roleName':'roleName'}]},{'userId':4,'userName':'wangyang','userPicUrl':'userPicUrl1','role':'role1','roles':[{'roleId':1,'roleName':'roleName'}]},{'userId':5,'userName':'wangyang2','userPicUrl':'userPicUrl2','role':'role2','roles':[{'roleId':1,'roleName':'roleName'}]},{'userId':6,'userName':'wangyang3','userPicUrl':'userPicUrl3','role':'role3','roles':[{'roleId':1,'roleName':'roleName'}]},{'userId':7,'userName':'wangyang','userPicUrl':'userPicUrl1','role':'role1','roles':[{'roleId':1,'roleName':'roleName'}]},{'userId':8,'userName':'wangyang2','userPicUrl':'userPicUrl2','role':'role2','roles':[{'roleId':1,'roleName':'roleName'}]},{'userId':9,'userName':'wangyang3','userPicUrl':'userPicUrl3','role':'role3','roles':[{'roleId':1,'roleName':'roleName'}]},{'userId':10,'userName':'wangyang','userPicUrl':'userPicUrl1','role':'role1','roles':[{'roleId':1,'roleName':'roleName'}]},{'userId':12,'userName':'wangyang2','userPicUrl':'userPicUrl2','role':'role2','roles':[{'roleId':1,'roleName':'roleName'}]},{'userId':13,'userName':'wangyang3','userPicUrl':'userPicUrl3','role':'role3','roles':[{'roleId':1,'roleName':'roleName'}]},{'userId':14,'userName':'wangyang','userPicUrl':'userPicUrl1','role':'role1','roles':[{'roleId':1,'roleName':'roleName'}]},{'userId':16,'userName':'wangyang2','userPicUrl':'userPicUrl2','role':'role2','roles':[{'roleId':1,'roleName':'roleName'}]},{'userId':15,'userName':'wangyang3','userPicUrl':'userPicUrl3','role':'role3','roles':[{'roleId':1,'roleName':'roleName'}]}],
  // user_list: []
}

export default function header(state = initState, action) {
  switch(action.type) {
    // case Act.SET_USER_LIST:
    //   return Object.assign({}, state, {
    //     user_list: action.user_list
    //   });
    default:
      return state;
  }
}
