import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './BookingModel.scss'
import {Modal} from 'reactstrap'
import _ from 'lodash';
import ProfileDoctor from '../../../Patient/Doctor/ProfileDoctor';
import DatePicker from '../../../../components/Input/DatePicker';
import * as actions from '../../../../store/actions'
import { lang } from 'moment';
import { LANGUAGES } from '../../../../utils';
import Select from 'react-select';
import {postPatientBookAppointment} from '../../../../services/userService'
import {toast} from 'react-toastify';
import { isEmpty } from 'lodash';
import moment from 'moment';
class BookingModel extends Component {
    constructor(props){
        super(props)
        this.state={
            fullName:'',
            phoneNumber:'',
            email:'',
            address:'',
            reason:'',
            birthday:'',
            selectedGender:'',
            doctorId:'',
            genders:'',
            timeType:''
        }
    }
    async componentDidMount(){
        await this.props.getGenders();
    }
    async componentDidUpdate(prevProps,prevState,snapshot){
        if(this.props.genders !== prevProps.genders){

            this.setState({
                genders : await this.buildDataGender(this.props.genders)
            })
        }
        if (this.props.language !== prevProps.language){
            if (!_.isEmpty(this.props.genders)){
                this.setState({
                    genders : this.buildDataGender(this.props.genders)
                })
            }
        }    
        if(this.props.dataTime !== prevProps.dataTime){
            if(this.props.dataTime && !_.isEmpty(this.props.dataTime)){
                let doctorId = this.props.dataTime.doctorId
                this.setState({
                    doctorId:doctorId,
                    timeType:this.props.dataTime.timeType
                })
            }
        }
    }
    buildDataGender = (data) => {
        let result = [] 
        let language =this.props.language
        if (data && data.data.length>0){
            data.data.map(item=>{
                let object ={}
                object.label= language === LANGUAGES.VI ? item.valueVi : item.valueEn
                object.value = item.keyMap
                result.push(object)
            })
        }
        return result
    }
    handleOnChange = (event,id)=>{
        let valueInput =  event.target.value
        let stateCopy = {...this.state}
        stateCopy[id]=valueInput
        this.setState({
            ...stateCopy
        })
        console.log('change',this.state)
    }
    handleOnChangeDatePicker = (date) => {
        this.setState({
            birthday:date[0]
        })
    }
    handleChangeSelect = async (selectedOption)=>{
        this.setState({selectedGender:selectedOption})
    }
    handleConfirmBooking = async () =>{
        let date=new Date(this.state.birthday).getTime()
        let timeString = this.buildTimeBooking(this.props.dataTime)
        let doctorName = this.buildDoctorName(this.props.dataTime)
        let res = await postPatientBookAppointment({
            fullName:this.state.fullName,
            phoneNumber:this.state.phoneNumber,
            email:this.state.email,
            address:this.state.address,
            reason:this.state.reason,
            date:this.props.dataTime.date,
            birthday:date,
            selectedGender:this.state.selectedGender.value,
            doctorId:this.state.doctorId,
            timeType:this.state.timeType,
            language:this.props.language,
            timeString:timeString,
            doctorName:doctorName
        })
        if (res.data && res.data.errCode === 0) {
            toast.success('Booking succeed!')
            this.props.closeBookingModal();
        } else {
            toast.error('Booking fail!')
        }
    }
    buildTimeBooking = (dataTime) => {
        if (dataTime && !isEmpty(dataTime)){
            let time = this.props.language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn
            let date = this.props.language === LANGUAGES.VI ? moment.unix(dataTime.date/1000).format('dddd - DD/MM/YYYY') 
            : moment.unix(dataTime.date/1000).locale('en').format('ddd - MM/DD/YYYY') 
            return (
                        `${time} - ${date}`
            )
        }
        return ''
    }
    buildDoctorName = (dataTime) => {
        let {language} = this.props
        if (dataTime && !isEmpty(dataTime)){
            let name = language === LANGUAGES.VI ?
            `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
            :
            `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`
            return name
        }
        return ''
    }
    render() {
        let {isOpenModal,closeBookingModal,dataTime} = this.props
        let doctorId = ''
        if (dataTime && !_.isEmpty(dataTime)){
            doctorId = dataTime.doctorId
        }
        return (
            <Modal 
                isOpen={isOpenModal}
                className={'booking-modal-container'}
                size='lg'
                centered
            >
                <div className='booking-modal-content'>
                    <div className='booking-modal-header'>
                        <span className='left'>
                            <FormattedMessage id="patient.booking-modal.title"/>
                        </span>
                        <span className='right'
                            onClick={closeBookingModal}
                        ><i className='fas fa-times'></i></span>
                    </div>
                    <div className='booking-modal-body'>
                        {/* {JSON.stringify(dataTime)} */}
                        <div className='doctor-infor'>
                            <ProfileDoctor 
                                doctorId = {doctorId}
                                isShowDescription = {false}
                                dataTime = {dataTime}
                                isShowLinkDetail={false}
                                isShowPrice={true}
                            />
                        </div>
                        <div className='row'>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id="patient.booking-modal.fullName"/></label>
                                <input className='form-control'
                                    value={this.state.fullName}
                                    onChange={(event)=>{this.handleOnChange(event,'fullName')}}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id="patient.booking-modal.phoneNumber"/></label>
                                <input className='form-control'
                                    value={this.state.phoneNumber}
                                    onChange={(event)=>{this.handleOnChange(event,'phoneNumber')}}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id="patient.booking-modal.email"/></label>
                                <input className='form-control'
                                    value={this.state.email}
                                    onChange={(event)=>{this.handleOnChange(event,'email')}}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id="patient.booking-modal.address"/></label>
                                <input className='form-control'
                                    value={this.state.address}
                                    onChange={(event)=>{this.handleOnChange(event,'address')}}
                                />
                            </div>
                            <div className='col-12 form-group'>
                                <label><FormattedMessage id="patient.booking-modal.reason"/></label>
                                <input className='form-control'
                                    value={this.state.reason}
                                    onChange={(event)=>{this.handleOnChange(event,'reason')}}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id="patient.booking-modal.birthday"/></label>
                                <DatePicker
                                    onChange={this.handleOnChangeDatePicker}
                                    className='form-control'
                                    value={this.state.birthday}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id="patient.booking-modal.gender"/></label>
                                <Select 
                                    value={this.state.selectedGender}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.genders}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='booking-modal-footer'>
                        <button className='btn-booking-confirm'
                            onClick={()=>this.handleConfirmBooking()}
                        ><FormattedMessage id="patient.booking-modal.btnConfirm"/></button>
                        <button className='btn-booking-cancel'
                            onClick={closeBookingModal}
                        ><FormattedMessage id="patient.booking-modal.btnCancel"/></button>
                    </div>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        language:state.app.language,
        genders:state.admin.genders,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenders :()=>dispatch(actions.getGenderStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModel);
