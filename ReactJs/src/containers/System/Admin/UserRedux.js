import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import {LANGUAGES , CRUD_ACTIONS,CommonUtils} from '../../../utils'
import * as actionTypes from '../../../store/actions';
import './UserRedux.scss'
import Lightbox from 'react-image-lightbox'
import TableManageUser from './TableManageUser';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
class UserRedux extends Component {

    constructor (props) {
        super(props);
        this.state = {
            genderArr:[],
            positionArr:[],
            roleArr:[],
            previewImgUrl:'',
            isOpen:false,

            // user
            email :'',
            password:'',
            firstName:'',
            lastName:'',
            phoneNumber:'',
            address:'',
            gender:'',
            position:'',
            role:'',
            avatar:'',


            action:'',
            userEditId:'',
        }
    }

    async componentDidMount() {
        this.props.getGenders()
        this.props.getPositions()
        this.props.getRoles()
    }
    componentDidUpdate(prevProps,prevState,snapshot){
        // Get Gender Data


        if(prevProps.genders !== this.props.genders) {
            let arrGender= this.props.genders.data
            this.setState({
                genderArr:arrGender,
                gender:arrGender && arrGender.length > 0 ? arrGender[0].keyMap : ''
            })
        }
        // Get Position Data
        if(prevProps.positions !== this.props.positions) {
            let arrPosition =this.props.positions.data
            this.setState({
                positionArr:arrPosition,
                position:arrPosition && arrPosition.length > 0 ? arrPosition[0].keyMap : ''
            })
        }
        // Get Role Data
        if(prevProps.roles !== this.props.roles) {
            let arrRole = this.props.roles.data
            this.setState({
                roleArr:arrRole,
                role:arrRole && arrRole.length > 0 ? arrRole[0].keyMap : ''
            })
        }
        // Reset Form After Create User
        if (prevProps.listUsers !== this.props.listUsers ){
            let arrRole = this.props.roles.data
            let arrGender= this.props.genders.data
            let arrPosition =this.props.positions.data
            this.setState({
                email :'',
                password:'',
                firstName:'',
                lastName:'',
                phoneNumber:'',
                address:'',
                gender:arrGender && arrGender.length > 0 ? arrGender[0].keyMap : '',
                position:arrPosition && arrPosition.length > 0 ? arrPosition[0].keyMap : '',
                role:arrRole && arrRole.length > 0 ? arrRole[0].keyMap : '',
                avatar:'',
                action:CRUD_ACTIONS.CREATE,
                previewImgUrl:'',
            })
        }
    }
    handleOnChangeImage = async(event) =>{
        let data=event.target.files
        let file=data[0]
        if(file) {
            let base64 = await CommonUtils.getBase64(file)
            let objectUrl = URL.createObjectURL(file)
            this.setState({
                previewImgUrl:objectUrl,
                avatar:base64
            })
        }
    }
    openPreviewImage = () =>{
        if (!this.state.previewImgUrl) return
        this.setState({
            isOpen:true
        })
    }
    handleSaveUser = async() => {
        let isValid = this.checkValidateInput()
        if (!isValid) {
            return
        } else {
            if (this.state.action === CRUD_ACTIONS.CREATE){
                const res = await this.props.createNewUser({
                    email:this.state.email,
                    password:this.state.password,
                    firstName:this.state.firstName,
                    lastName:this.state.lastName,
                    address:this.state.address,
                    phonenumber:this.state.phoneNumber,
                    gender:this.state.gender,
                    positionId:this.state.position,
                    roleId:this.state.role,
                    avatar:this.state.avatar
                })
            }
            if (this.state.action === CRUD_ACTIONS.EDIT){
                await this.props.editUserStart({
                    id:this.state.userEditId,
                    email:this.state.email,
                    password:this.state.password,
                    firstName:this.state.firstName,
                    lastName:this.state.lastName,
                    address:this.state.address,
                    phonenumber:this.state.phoneNumber,
                    gender:this.state.gender,
                    positionId:this.state.position,
                    roleId:this.state.role,   
                    avatar:this.state.avatar,
                })
            }
        }
    }
    checkValidateInput = () => {
        let isValid=true
        let arrCheck = ["email","password","firstName","lastName",
            "phoneNumber","address"]
        for (let i=0;i<arrCheck.length;i++) {
            if(!this.state[arrCheck[i]]){
                isValid=false
                alert('Missing required parameter' + arrCheck[i])
                break
            }
        }
        return isValid
    }
    onChangeInput = (event,id) => {
        let copyState = {...this.state}
        copyState[id] = event.target.value
        this.setState({
            ...copyState
        })
    }
    handleEditUserFromParent = (user) => {
        let imageBase64=''
        if (user.image) {
            imageBase64=new Buffer(user.image,'base64').toString('binary')
        }

        this.setState({
            email :user.email,
            password:'hardcode',
            firstName:user.firstName,
            lastName:user.lastName,
            phoneNumber:user.phonenumber,
            address:user.address,
            gender:user.gender,
            position:user.positionId,
            role:user.roleId,
            avatar:'',
            previewImgUrl:imageBase64,

            action:CRUD_ACTIONS.EDIT,
            userEditId:user.id,
        })

    }
    render() {
        let genders = this.state.genderArr
        let positions = this.state.positionArr
        let roles = this.state.roleArr
        let language = this.props.language

        let {email,password,firstName,lastName,
            phoneNumber,address,gender,position,role,avatar
        } = this.state;
        console.log('props',this.props)
        return (
            <div className="user-redux-container" >
                <div className='title'>
                    Learn React-Redux với "Jey IT"
                </div>
                <div className='user-redux-body'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12 my-3'><FormattedMessage id="manage-user.add" /></div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.email" /></label>
                                <input 
                                    className='form-control' type='email' 
                                    value={email}
                                    onChange={(event)=>{this.onChangeInput(event,'email')}}
                                    disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false}
                                />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.password" /></label>
                                <input className='form-control' type='password' 
                                    value={password}
                                    onChange={(event)=>{this.onChangeInput(event,'password')}}
                                    disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false}
                                />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.first-name" /></label>
                                <input className='form-control' type='text' 
                                    value={firstName}
                                    onChange={(event)=>{this.onChangeInput(event,'firstName')}}
                                />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.last-name" /></label>
                                <input className='form-control' type='text' 
                                    value={lastName}
                                    onChange={(event)=>{this.onChangeInput(event,'lastName')}}
                                />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.phone-number" /></label>
                                <input className='form-control' type='text' 
                                    value={phoneNumber}
                                    onChange={(event)=>{this.onChangeInput(event,'phoneNumber')}}
                                />
                            </div>
                            <div className='col-9'>
                                <label><FormattedMessage id="manage-user.address" /></label>
                                <input className='form-control' type='text' 
                                    value={address}
                                    onChange={(event)=>{this.onChangeInput(event,'address')}}
                                />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.gender" /></label>
                                <select className='form-control' 
                                    onChange={(event)=>{this.onChangeInput(event,'gender')}}
                                    value={gender}
                                >
                                    {genders && genders.map((gender,index)=>{
                                        return (
                                            <option key={index} value={gender.keyMap}>{language===LANGUAGES.VI ? gender.valueVi : gender.valueEn}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.position" /></label>
                                <select className='form-control' 
                                    onChange={(event)=>{this.onChangeInput(event,'position')}}
                                    value={position}
                                >
                                    {positions && positions.map((position,index)=>{
                                        return (
                                            <option key={index} value={position.keyMap}>{language===LANGUAGES.VI ? position.valueVi : position.valueEn}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.role" /></label>
                                <select className='form-control' 
                                    onChange={(event)=>{this.onChangeInput(event,'role')}}
                                    value={role}
                                >
                                    {roles && roles.map((role,index)=>{
                                        return (
                                            <option key={index} value={role.keyMap}>{language===LANGUAGES.VI ? role.valueVi : role.valueEn}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.image" /></label>
                                <div className='preview-img-container'>
                                    <input id='previewImg' type='file' hidden
                                        onChange={(event)=>{this.handleOnChangeImage(event)}}
                                    ></input>
                                    <label className='label-upload' htmlFor='previewImg'>Tải ảnh<i className='fas fa-upload'></i></label>
                                    <div className='preview-image'
                                        style={{backgroundImage:`url(${this.state.previewImgUrl})`}}
                                        onClick={()=>this.openPreviewImage()}
                                    >

                                    </div>
                                </div>

                            </div>
                            <div className='col-12 mt-3'>
                                <button className={this.state.action === CRUD_ACTIONS.EDIT ? "btn btn-warning" : "btn btn-primary"}
                                    onClick={()=>this.handleSaveUser()}
                                >
                                    {this.state.action === CRUD_ACTIONS.EDIT ? 
                                        <FormattedMessage id="manage-user.edit" />
                                    :
                                        <FormattedMessage id="manage-user.save" />
                                    }
                                
                                </button>
                            </div>
                            <div className='col-12 mb-5'>
                                <TableManageUser 
                                    handleEditUserFromParent={this.handleEditUserFromParent}
                                    action={this.state.action}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {/* LightBox  Img                     */}
                 {this.state.isOpen &&
                    <Lightbox
                        mainSrc={this.state.previewImgUrl}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                 }                       
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        language:state.app.language,
        genders:state.admin.genders,
        positions:state.admin.positions,
        roles:state.admin.roles,
        listUsers:state.admin.users,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenders : ()=> dispatch(actionTypes.getGenderStart()),
        getPositions : ()=> dispatch(actionTypes.getPositionStart()),
        getRoles : ()=> dispatch(actionTypes.getRoleStart()),
        createNewUser : (data) => dispatch(actionTypes.createNewUser(data)),
        fetchAllUserStart: ()=> dispatch(actionTypes.fetchAllUserStart()),
        editUserStart: (data)=>dispatch(actionTypes.editUserStart(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
