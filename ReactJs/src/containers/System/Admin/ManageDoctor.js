import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import {CRUD_ACTIONS, LANGUAGES} from '../../../utils/constant'
import * as actionTypes from '../../../store/actions';
import './ManageDoctor.scss'
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Select from 'react-select'
import {getDetailInforDoctor} from '../../../services/userService'

const mdParser = new MarkdownIt(/* Markdown-it options */);


class ManageDoctor extends Component {

    constructor (props) {
        super(props);
        this.state = {
            // Save to markdown table
            contentMarkdown:'',
            contentHTML:'',
            selectedOptions:'',
            description:'',
            listDoctor:[],
            hasOldData:false,


            // Save to doctor_infor table
            listPrice:[],
            listPayment:[],
            listProvince:[],
            listClinic:[],
            listSpecialty:[],
            selectedPrice:'',
            selectedPayment:'',
            selectedProvince:'',
            selectedClinic:'',
            selectedSpecialty:'',
            nameClinic:'',
            addressClinic:'',
            note:'',
            clinicId:'',
            specialtyId:''


        }
    }

    async componentDidMount() {
        this.props.getAllDoctors()
        this.props.fetchRequiredDoctorInforStart()
    }
    componentDidUpdate(prevProps,prevState,snapshot){
        if (prevProps.allDoctors !== this.props.allDoctors){
            let doctorsData = this.buildDataInputSelect(this.props.allDoctors,'USERS')
            this.setState({
                listDoctor:doctorsData
            })
        }
        if(prevProps.language !== this.props.language){
            let doctorsData = this.buildDataInputSelect(this.props.allDoctors,'USERS')
            let dataSelectPrice = this.buildDataInputSelect(this.props.allRequiredDoctorInfor.resPrice,'PRICE')
            let dataSelectPayment = this.buildDataInputSelect(this.props.allRequiredDoctorInfor.resPayment,'PAYMENT')
            let dataSelectProvince = this.buildDataInputSelect(this.props.allRequiredDoctorInfor.resProvince,'PROVINCE')
            this.setState({
                listDoctor:doctorsData,
                listPrice:dataSelectPrice,
                listPayment:dataSelectPayment,
                listProvince:dataSelectProvince
            })
        }
        if(prevProps.allRequiredDoctorInfor!==this.props.allRequiredDoctorInfor){
            let dataSelectPrice = this.buildDataInputSelect(this.props.allRequiredDoctorInfor.resPrice,'PRICE')
            let dataSelectPayment = this.buildDataInputSelect(this.props.allRequiredDoctorInfor.resPayment,'PAYMENT')
            let dataSelectProvince = this.buildDataInputSelect(this.props.allRequiredDoctorInfor.resProvince,'PROVINCE')
            let dataSelectSpecialty = this.buildDataInputSelect(this.props.allRequiredDoctorInfor.resSpecialty,'SPECIALTY')
            let dataSelectClinic = this.buildDataInputSelect(this.props.allRequiredDoctorInfor.resClinic,'CLINIC')
            this.setState({
                listPrice:dataSelectPrice,
                listPayment:dataSelectPayment,
                listProvince:dataSelectProvince,
                listSpecialty:dataSelectSpecialty,
                listClinic:dataSelectClinic
            })
        }
    }
    handleSaveContentMarkdown = ()=>{
        let {hasOldData} = this.state
        this.props.saveDetailDoctor({
            contentHTML: this.state.contentHTML,
            contentMarkdown:this.state.contentMarkdown,
            description : this.state.description,
            doctorId:this.state.selectedOptions.value,
            action:hasOldData ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,
            selectedPrice:this.state.selectedPrice,
            selectedPayment:this.state.selectedPayment,
            selectedProvince:this.state.selectedProvince,
            nameClinic:this.state.nameClinic,
            addressClinic:this.state.addressClinic,
            note:this.state.note,
            clinicId:this.state.selectedClinic && this.state.selectedClinic.value ? this.state.selectedClinic.value : '',
            specialtyId:this.state.selectedSpecialty.value
        }) 
    }
    
    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown:text,
            contentHTML:html,
        })
    }
    handleChange = async (selectedOptions) =>{
        this.setState({selectedOptions})
        let {listPrice,listPayment,listProvince,listSpecialty,listClinic} = this.state
        let res = await getDetailInforDoctor(selectedOptions.value)
        console.log('res',res)
        if(res && res.infor.errCode === 0 && res.infor.data && res.infor.data.Markdown ){
            let markdown = res.infor.data.Markdown
            let nameClinic = ''
            let addressClinic = ''
            let note = ''
            let selectedPrice=''
            let selectedPayment=''
            let selectedProvince=''
            let selectedSpecialty=''
            let selectedClinic=''

            if (res.infor.data.Doctor_Infor){
                nameClinic=res.infor.data.Doctor_Infor.nameClinic
                addressClinic=res.infor.data.Doctor_Infor.addressClinic
                note=res.infor.data.Doctor_Infor.note
                selectedPrice = listPrice.find((item)=>{
                    return item && item.value === res.infor.data.Doctor_Infor.priceId
                })
                selectedPayment = listPayment.find((item)=>{
                    return item && item.value === res.infor.data.Doctor_Infor.paymentId
                })
                selectedProvince = listProvince.find((item)=>{
                    return item && item.value === res.infor.data.Doctor_Infor.provinceId
                })
                selectedSpecialty = listSpecialty.find((item)=>{
                    return item && item.value === res.infor.data.Doctor_Infor.specialtyId
                })
                selectedClinic = listClinic.find((item)=>{
                    return item && item.value === res.infor.data.Doctor_Infor.clinicId
                })

            }


            this.setState({
                contentHTML: markdown.contentHTML,
                contentMarkdown: markdown.contentMarkdown,
                description:markdown.description,
                hasOldData:true,
                nameClinic:nameClinic,
                addressClinic:addressClinic,
                note:note,
                selectedPrice:selectedPrice,
                selectedPayment:selectedPayment,
                selectedProvince:selectedProvince,
                selectedSpecialty:selectedSpecialty,
                selectedClinic:selectedClinic
            })
        } else {
            this.setState({
                contentHTML:'',
                contentMarkdown: '',
                description:'',
                hasOldData:false,
                selectedPrice:'',
                selectedPayment:'',
                selectedProvince:'',
                selectedSpecialty:''
            })
        }


    }
    handleChangeDoctorInfor = async (selectedOptions,name)=>{
        let copyState = {...this.state}
        copyState[name.name] = selectedOptions
        this.setState({
            ...copyState
        })
    }
    handleOnChangeDescription = (event,id)=>{
        let copyState = {...this.state}
        copyState[id] = event.target.value
        this.setState({
            ...copyState
        })
    }
    buildDataInputSelect = (inputData,type) => {
        let result = []
        let {language} = this.props
        if (type === 'USERS'){
            if (inputData && inputData.length>0){
                inputData.map((item,index)=>{
                    let object={}
                    let labelVi =  `${item.lastName} ${item.firstName}` 
                    let labelEn =  `${item.firstName} ${item.lastName}` 
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn
                    object.value = item.id 
                    result.push(object) 
                })
            }
        }
        if (type === 'PRICE'){
            if (inputData && inputData.length>0){
                inputData.map((item,index)=>{
                    let object={}
                    let labelVi =  `${item.valueVi} VND` 
                    let labelEn =  `${item.valueEn} USD` 
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn
                    object.value = item.keyMap 
                    result.push(object) 
                })
            }
        }
        if (type === 'PAYMENT' || type==='PROVINCE'){
            if (inputData && inputData.length>0){
                inputData.map((item,index)=>{
                    let object={}
                    let labelVi =  `${item.valueVi}` 
                    let labelEn =  `${item.valueEn}` 
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn
                    object.value = item.keyMap 
                    result.push(object) 
                })
            }
        }
        if(type==='SPECIALTY'){
            inputData.map((item,index)=>{
                let object={}
                object.label = item.name
                object.value = item.id 
                result.push(object) 
            })
        }
        if(type==='CLINIC'){
            inputData.map((item,index)=>{
                let object={}
                object.label = item.name
                object.value = item.id 
                result.push(object) 
            })
        }
        return result
    }
    render() {
        let arrUsers = this.state.usersRedux
        let {hasOldData,listSpecialty} =this.state
        return (
            <React.Fragment>
                <div className='manage-doctor-container'>
                    <div className='manage-doctor-title'>
                        <FormattedMessage id="admin.manage-doctor.title"/>
                    </div>
                    <div className='more-infor'>
                        <div className='content-left form-group'>
                            <label><FormattedMessage id="admin.manage-doctor.select-doctor"/></label>
                            <Select 
                                value={this.state.selectedOptions}
                                onChange={this.handleChange}
                                options={this.state.listDoctor}
                                placeholder={<FormattedMessage id="admin.manage-doctor.select-doctor"/>}
                            />
                            
                        </div>
                        <div className='content-right'>
                            <label><FormattedMessage id="admin.manage-doctor.intro"/></label>
                            <textarea 
                                rows="4" 
                                className='form-control'
                                onChange={(event)=>this.handleOnChangeDescription(event,'description')}    
                                value={this.state.description}
                            >

                            </textarea>
                        </div>
                    </div>
                    <div className='more-infor-extra row'>
                        <div className='col-4 form-group'>
                            <label><FormattedMessage id="admin.manage-doctor.price"/></label>
                            <Select 
                                value={this.state.selectedPrice}
                                onChange={this.handleChangeDoctorInfor}
                                options={this.state.listPrice}
                                placeholder={<FormattedMessage id="admin.manage-doctor.price"/>}
                                name={'selectedPrice'}
                            />
                        </div>
                        <div className='col-4 form-group'>
                            <label><FormattedMessage id="admin.manage-doctor.payment"/></label>
                            <Select 
                                value={this.state.selectedPayment}
                                onChange={this.handleChangeDoctorInfor}
                                options={this.state.listPayment}
                                placeholder={<FormattedMessage id="admin.manage-doctor.payment"/>}
                                name={"selectedPayment"}
                            />
                        </div>
                        <div className='col-4 form-group'>
                            <label><FormattedMessage id="admin.manage-doctor.province"/></label>
                            <Select 
                                value={this.state.selectedProvince}
                                onChange={this.handleChangeDoctorInfor}
                                options={this.state.listProvince}
                                placeholder={<FormattedMessage id="admin.manage-doctor.province"/>}
                                name={"selectedProvince"}
                            />
                        </div>

                        <div className='col-4 form-group'>
                            <label><FormattedMessage id="admin.manage-doctor.nameClinic"/></label>
                            <input 
                                className='form-control'
                                onChange={(event)=>this.handleOnChangeDescription(event,'nameClinic')}    
                                value={this.state.nameClinic}
                            ></input>
                        </div>
                        <div className='col-4 form-group'>
                            <label><FormattedMessage id="admin.manage-doctor.addressClinic"/></label>
                            <input 
                                className='form-control'
                                onChange={(event)=>this.handleOnChangeDescription(event,'addressClinic')}    
                                value={this.state.addressClinic}
                            ></input>
                        </div>
                        <div className='col-4 form-group'>
                            <label><FormattedMessage id="admin.manage-doctor.note"/></label>
                            <input 
                                className='form-control'
                                onChange={(event)=>this.handleOnChangeDescription(event,'note')}    
                                value={this.state.note}
                            ></input>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-4 form-group'>
                            <label><FormattedMessage id="admin.manage-doctor.specialty"/></label>
                            <Select 
                                value={this.state.selectedSpecialty}
                                onChange={this.handleChangeDoctorInfor}
                                options={this.state.listSpecialty}
                                placeholder={<FormattedMessage id="admin.manage-doctor.specialty"/>}
                                name={"selectedSpecialty"}
                            />
                        </div>
                        <div className='col-4 form-group'>
                            <label><FormattedMessage id="admin.manage-doctor.select-clinic"/></label>
                            <Select 
                                value={this.state.selectedClinic}
                                onChange={this.handleChangeDoctorInfor}
                                options={this.state.listClinic}
                                placeholder={<FormattedMessage id="admin.manage-doctor.select-clinic"/>}
                                name={"selectedClinic"}
                            />
                        </div>
                    </div>
                    <div className='manage-doctor-editor'>
                        <MdEditor 
                            style={{ height: '300px' }} 
                            renderHTML={text => mdParser.render(text)} 
                            onChange={this.handleEditorChange} 
                            value={this.state.contentMarkdown}
                        />
                    </div>
                    
                    <button
                        onClick={()=>this.handleSaveContentMarkdown()} 
                        className={hasOldData === true ? 'save-content-doctor' : "create-content-doctor"}
                    >
                        {hasOldData ===true ? <span><FormattedMessage id="admin.manage-doctor.add"/></span> : <span><FormattedMessage id="admin.manage-doctor.save"/></span>}
                    </button>
                </div>
            </React.Fragment>     
        ) 
    }

}

const mapStateToProps = state => {
    return {
        allDoctors : state.admin.allDoctors,
        allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
        language:state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAllDoctors: ()=> dispatch(actionTypes.fetchAllDoctor()),
        fetchRequiredDoctorInforStart: ()=> dispatch(actionTypes.fetchRequiredDoctorInforStart()),
        saveDetailDoctor: (data)=>dispatch(actionTypes.saveDetailDoctor(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
