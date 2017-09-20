require('./Leftnav.styl');
import React from 'react'
import { Menu, Icon ,Button} from 'antd';
const SubMenu = Menu.SubMenu;

class Leftnav extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            collapsed : false,
            selectedNav: 'home'
        };
    }
    static contextTypes = {
        router: React.PropTypes.object
    }

    toggleCollapsed () {
        this.setState({
          collapsed: !this.state.collapsed
        });
    }

    handleClick(){
        this.setState({
            navShow : !this.state.navShow
        })
    }

    handleMouseOver(){
        this.setState({
            crmShow : true
        })
    }
    handleMouseOut(){
        this.setState({
            crmShow : false
        })
    }

    linkTo(item){
        this.context.router.push(item.key);
        this.setState({
            selectedNav : item.key
        })
    }

    render() {
        let t = this, hash = this.state.hash;
        let map = {
            mode : this.state.collapsed ? 'inline' : 'vertical'
        }
        if(this.state.collapsed){
            map.inlineCollapsed = this.state.collapsed
        }
        return (
            <div className= "leftnav">
                {/* <span onClick={t.toggleCollapsed.bind(this)}>展开</span> */}
                <div className="center btn-collapsed">
                    <Button type="primary" onClick={t.toggleCollapsed.bind(this)}>
                        <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
                    </Button>
                </div>
                <Menu onClick={t.linkTo.bind(this)} theme="dark" {...map}>
                    <Menu.Item key="home" ><Icon type="pie-chart" /><span>首页</span>
                    </Menu.Item>
                    <SubMenu title={<span><Icon type="appstore" /><span >报表</span></span>}>
                        <Menu.Item key="reportformA" ><span >报表A</span>
                        </Menu.Item>
                        <Menu.Item key="reportformB" ><span >报表B</span>
                        </Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub3" title={<span><Icon type="appstore" /><span >CRM</span></span>}>
                        <Menu.Item key="crm">客户</Menu.Item>
                        <Menu.Item key="crm1">联系人</Menu.Item>
                        <Menu.Item key="crm2">公海</Menu.Item>
                    </SubMenu>
                    <Menu.Item key="work" ><Icon type="pie-chart"/><span >工作</span>
                    </Menu.Item>
                    <Menu.Item key="sub5" style={ {marginTop : '80px',marginBottom : '80px'} }><Icon type="pie-chart"/><span >消息</span>

                    </Menu.Item>
                    <SubMenu title={<span><Icon type="appstore" /><span >设置</span></span>}>
                        <Menu.Item key="personmanage"><span >员工管理</span>
                        </Menu.Item>
                        <Menu.Item key="roleset"><span >角色设置</span>
                        </Menu.Item>
                        <Menu.Item key="businessmanage"><span >业务对象管理</span>
                        </Menu.Item>
                        <Menu.Item key="setting4"><span >公海管理</span>
                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item key="sub7" ><Icon type="pie-chart"/><span >帮助</span>

                    </Menu.Item>
                </Menu>
            </div>
        );
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ selectedNav:  nextProps.data.location.pathname.replace(/\//ig, '')});
    }
}

module.exports = Leftnav;
