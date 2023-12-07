import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import './Login.scss';
import { FormattedMessage } from 'react-intl';
import {handleLoginApi} from '../../services/userService'
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username:'',
            password:'',
            isShowPassword: false,
            errMessage:''
        }
    }


    handleOneChangeUsername = (event) =>{
        this.setState({
            username: event.target.value
            
            
        })
    }
    handleOneChangePassword = (event) =>{
        this.setState({
            password: event.target.value
        })
    }
    handleShowHidePassword = () =>{
        console.log(this.state.isShowPassword)
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }
    handleLogin = async() =>{
        this.setState({
            errMessage:''
        })
        try{
            let data = await handleLoginApi(this.state.username,this.state.password)
            if (!data || data.errCode!== 0) {
                this.setState({
                    errMessage:data.errMessage
                })
            }
            if(data.errCode === 0){
                this.props.userLoginSuccess(data.user)
            }
        } catch(error) {
            if (error.response){
                if(error.response.data){
                    this.setState({
                        errMessage:error.response.data.errMessage
                    })
                }
            }
        }
    }
    handleOnKeyDown= (e)=>{
        if (e.key === 'Enter') {
            this.handleLogin()
        }
    }

    render() {
        return (
            <div className='login-background'>
                <div className='login-container'>
                    <div className='login-content row'>
                        <div className='col-12 text-login'>Login</div>
                        <div className='col-12 form-group login-input'>
                            <label>Username:</label>
                            <input type='text' 
                                className='form-control' 
                                placeholder='Enter ur username' 
                                onChange={(event)=>{this.handleOneChangeUsername(event)}}
                            />
                        </div>
                        <div className='col-12 form-group login-input'>
                            <label>Password</label>
                            <div className='custom-input-password'>
                                <input 
                                    type= {this.state.isShowPassword ? 'text' : 'password' }
                                    className='form-control' 
                                    placeholder='Enter ur password'
                                    onChange={(event)=>{this.handleOneChangePassword(event)}}
                                    onKeyDown={(event)=>this.handleOnKeyDown(event)}
                                />
                                <span onClick={()=>{this.handleShowHidePassword()}}>
                                    {this.state.isShowPassword ? <i class="far fa-eye-slash"></i> :  <i class="fas fa-eye"></i>}
                                </span>
                            </div>
                        </div>
                        <div style={{color:'red'}}>{this.state.errMessage}</div>
                        <div className='col-12'>
                            <button 
                                className='btn-login'
                                onClick={()=>{this.handleLogin()}}
                            >Login</button>
                        </div>
                        <div className='col-12'>
                            <span className='forget-password'>Forgot your password?</span>
                        </div>
                        <div className='col-12'>
                            <span>Or login with :</span>
                        </div>
                        <div className='col-12 social-login'>
                            <i class="fab fa-google-plus-g google"></i>
                            <i class="fab fa-facebook-f facebook"></i>
                        </div>
                    </div>
                </div>
            </div>
        )
    
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        // userLoginFail: () => dispatch(actions.userLoginFail()),
        userLoginSuccess : (userInfo) => dispatch(actions.userLoginSuccess(userInfo))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
