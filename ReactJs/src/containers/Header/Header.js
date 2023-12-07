import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import { adminMenu,doctorMenu } from './menuApp';
import './Header.scss';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash'
import { LANGUAGES, USER_ROLE } from '../../utils';


class Header extends Component {
    constructor(props){
        super(props);
        this.state={
            menuApp:[]
        }
    }
    componentDidMount(){
        let {userInfo} = this.props
        if (userInfo && !_.isEmpty(userInfo)){
            console.log(userInfo)
            if (userInfo.roleId === USER_ROLE.ADMIN){
                this.setState({
                    menuApp:adminMenu
                })
            } else if (userInfo.roleId === USER_ROLE.DOCTOR){
                this.setState({
                    menuApp:doctorMenu
                })
            }
        }
    }


    handleChangeLanguage = (language)=>{
        this.props.changeLanguageAppRedux(language)

    }
    render() {
        const { processLogout,language,userInfo } = this.props;
        return (
            <div className="header-container">
                {/* thanh navigator */}
                <div className="header-tabs-container">
                    <Navigator menus={this.state.menuApp} />
                </div>
                <div className='languages'>
                    <div className='welcome'><FormattedMessage id="home-header.welcome" />, {userInfo && userInfo.firstName ? userInfo.firstName : ''}</div>
                    <span 
                        className={language === LANGUAGES.VI ? 'language-vi active' :'language-vi' } 
                        onClick={()=>this.handleChangeLanguage(LANGUAGES.VI)}
                    >VI</span>
                    <span 
                        className={language === LANGUAGES.EN ? 'language-en active' :'language-en' } 
                        onClick={()=>this.handleChangeLanguage(LANGUAGES.EN)}
                    >EN</span>
                    {/* nút logout */}
                    <div className="btn btn-logout" onClick={processLogout}>
                        <i className="fas fa-sign-out-alt"></i>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language:state.app.language,
        userInfo:state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageAppRedux   : (language) => dispatch(actions.changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
