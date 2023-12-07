import React, { Component } from 'react';
import { connect } from "react-redux";
import './DoctorSchedule.scss'
import Select from 'react-select'
import moment from 'moment';
import {getScheduleDoctorByDate} from '../../../services/userService'
// need import localization for moment viet language 
import localization from 'moment/locale/vi'
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../../utils';
import BookingModel from '../../System/Doctor/Model/BookingModel';
class DoctorSchedule extends Component {
    constructor(props){
        super(props)
        this.state={
            allDays:[],
            allAvailable:[],
            isOpenModalBooking:false,
            dataScheduleTimeModal:{

            }
        }
    }
    async componentDidMount(){
        let allDays = this.getArrDays()
        this.setState({
            allDays:allDays
        })
    }
    async componentDidUpdate(prevProps,prevState,snapshot){
        if (prevProps.language !== this.props.language){
            let allDays = this.getArrDays()
            this.setState({
                allDays:allDays
            })
        }
        if(prevProps.doctorIdFromParent !== this.props.doctorIdFromParent){
            let allDays = this.getArrDays()
            let res = await getScheduleDoctorByDate(this.props.doctorIdFromParent,allDays[0].value)
            if (res && res.data){
                this.setState({
                    allAvailable:res.data
                })
            }
        }
    }
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    getArrDays = () => {
        let allDays=[]
        for(let i=0;i<7;i++){
         let object = {}
         if (this.props.language === 'vi'){
            if(i===0){
                let ddMM = moment(new Date()).format('DD/MM')
                let today = `Hôm nay - ${ddMM}`
                object.label = today
            } else {
                let labelVi = moment(new Date()).add(i,'days').format('dddd- DD/MM')
                object.label = this.capitalizeFirstLetter(labelVi)
            }
         } else {
            if(i===0){
                let ddMM = moment(new Date()).locale('en').format('DD/MM')
                let today = `Today - ${ddMM}`
                object.label = today
            } else {
                object.label = moment(new Date()).add(i,'days').locale('en').format('dddd- DD/MM')
            }
 
         }
         object.value = moment(new Date()).add(i, 'days').startOf('day').valueOf();
 
         allDays.push(object)
        }
        return allDays
    }
    handleOnSelect = async(event)=>{
        if (this.props.doctorIdFromParent && this.props.doctorIdFromParent !==-1){
            let doctorId=this.props.doctorIdFromParent
            let date = event.target.value
            let res = await getScheduleDoctorByDate(doctorId,date)
            console.log('res',res)
            if (res && res.data){
                this.setState({
                    allAvailable:res.data
                })
            }
        }
    }
    handleClickScheduleTime = (time) =>{
        this.setState({
            isOpenModalBooking:true,
            dataScheduleTimeModal:time
        })
    }
    closeBookingModal = () =>{
        this.setState({
            isOpenModalBooking:false
        })
    }
    render() {
        let {allDays,allAvailable,isOpenModalBooking,dataScheduleTimeModal} = this.state 
        let {language} = this.props
        return (
            <>

                <div className='doctor-schedule-container'>
                    <div className='all-schedule'>
                        
                        <select onChange={(event)=>this.handleOnSelect(event)}>
                        {allDays.map((item,index)=>{
                            return (
                                <option
                                    key={index}
                                    value={item.value}
                                >{item.label}</option>
                                )
                        })}
                        </select>
                    </div>
                    <div className='all-available-time'>
                        <div className='text-calendar'>
                        <i className='fas fa-calendar-alt'> <span><FormattedMessage id="patient.detail-doctor.schedule"/></span></i>
                        </div>
                        <div className='time-content'>
                            {allAvailable && allAvailable.length>0 ?
                            <>
                                <div className='time-content-btns'>
                                    {allAvailable.map((item,index)=>{
                                        let timeDisplay = language === 'vi' ? item.timeTypeData.valueVi : item.timeTypeData.valueEn
                                        return (
                                            <button 
                                                key={index}
                                                className={language===LANGUAGES.VI ? 'btn-vie' : "btn-en"}
                                                onClick={()=>this.handleClickScheduleTime(item)}
                                            >{timeDisplay}
                                            </button>
                                            )
                                        })
                                    }
                                </div>
                                <div className='book-free'>
                                    <span><FormattedMessage id="patient.detail-doctor.choose"/> <i className='far fa-hand-point-up'></i> <FormattedMessage id="patient.detail-doctor.book-free"/></span>
                                </div>    
                            </>
                                :
                                <div className='no-schedule'><FormattedMessage id="patient.detail-doctor.no-schedule"/></div>
                            }
                        </div>
                    </div>
                </div>
                <BookingModel 
                    isOpenModal={isOpenModalBooking}
                    closeBookingModal = {this.closeBookingModal}
                    dataTime={dataScheduleTimeModal}
                />
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language:state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
