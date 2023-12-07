import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import './ManageSchedule.scss'
import { FormattedMessage } from 'react-intl';
import * as actionTypes from '../../../store/actions';
import Select from 'react-select'
import DatePicker from '../../../components/Input/DatePicker';
import moment from 'moment'
import { LANGUAGES } from '../../../utils';
import {toast} from "react-toastify"
import _ from 'lodash'
import {bulkCreateSchedule} from '../../../services/userService'
class ManageSchedule extends Component {
    constructor(props){
        super(props)
        this.state={
            listDoctors:[],
            selectedDoctor:{},
            currentDate:'',
            rangeTime:[]
        }
    }
    async componentDidMount() {
        this.props.getAllDoctors()
        this.props.fetchAllScheduleTime()
    }
    componentDidUpdate(prevProps,prevState,snapshot){
        if (prevProps.allDoctors !== this.props.allDoctors){
            let doctorsData = this.buildDataInputSelect(this.props.allDoctors)
            this.setState({
                listDoctors:doctorsData
            })
        }
        if(prevProps.allScheduleTimes!==this.props.allScheduleTimes){
            let data = this.props.allScheduleTimes.data
            if(data && data.length>0){
                data = data.map((item)=>({...item,isSelected:false}))
            }
            this.setState({
                rangeTime:data
            })
        }
    }
    buildDataInputSelect = (inputData) => {
        let result = []
        if (inputData && inputData.length>0){
            inputData.map((item,index)=>{
                let object={}
                let label = `${item.lastName} ${item.firstName}` 
                object.label = label 
                object.value = item.id 
                result.push(object) 
            })
        }
        return result
    }
    handleChange = async (selectedOptions) =>{
        this.setState({selectedDoctor:selectedOptions})

    }
    handleOnchangeDatePicker = (date) => {
        this.setState({
            currentDate:date[0]
        })
    }
    handleClickBtnTime = (time) =>{
        let data = this.state.rangeTime
        data.map((item)=>{
            if (item.id === time.id){
                item.isSelected = !item.isSelected
            }
        })
        this.setState({
            rangeTime:data
        })
    }
    handleSaveSchedule = async() =>{
        let {rangeTime ,selectedDoctor , currentDate } = this.state
        let result = []
        if (!currentDate) {
            toast.error("Pls choose date!")
            return;
        }
        currentDate = new Date(currentDate).getTime()
        if (selectedDoctor && _.isEmpty(selectedDoctor)){
            toast.error("Pls choose doctor!")
            return;
        }
        if (rangeTime && rangeTime.length>0){
            let selectedTime = rangeTime.filter((item)=>item.isSelected===true)
            if (selectedTime && selectedTime.length>0){
                selectedTime.map((schedule)=>{
                    let object = {}
                    object.doctorId =selectedDoctor.value
                    object.date=currentDate
                    object.timeType=schedule.keyMap
                    result.push(object)
                })
            } else {
                toast.error("Invalid selected time")
                return;
            }
        }
        let res = await bulkCreateSchedule({
            arrSchedule : result,
            doctorId:selectedDoctor.value,
            dateTimeFormatted :currentDate
        })
        console.log(res)
    }
    render() {
        let {language} = this.props
        let rangeTime = this.state.rangeTime
        let yesterday = new Date(new Date().setDate(new Date().getDate()-1));

        return (
            <div className='manage-schedule-container'>
                <div className='m-s-title'>
                    <FormattedMessage id="manage-schedule.title" />
                </div>
                <div className='container'>
                    <div className='row'>
                        <div className="col-6 form-group">
                            <label><FormattedMessage id="manage-schedule.choose-doctor"/></label>
                            <Select 
                                value={this.state.selectedDoctor}
                                onChange={this.handleChange}
                                options={this.state.listDoctors}
                            />
                        </div>
                        <div className="col-6 form-group">
                            <label><FormattedMessage id="manage-schedule.choose-date"/></label>
                            <DatePicker
                                onChange={this.handleOnchangeDatePicker}
                                className="form-control"
                                value={this.state.currentDate}
                                minDate={yesterday}
                            />
                            </div>
                        <div className="col-12 pick-hour-container">
                            {rangeTime  && rangeTime.length>0 &&
                                rangeTime.map((item,index)=>{
                                    return (
                                        <button className={item.isSelected ? 'btn btn-schedule active' :'btn btn-schedule' } key={index}
                                            onClick={()=>this.handleClickBtnTime(item)}
                                        >
                                            
                                            {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                        </button>
                                    )
                                })
                            }
                        </div>
                        <div className='col-12'>
                            <button 
                                className="btn btn-primary btn-save-schedule"
                                onClick={()=>this.handleSaveSchedule()}
                            >Lưu thông tin</button>
                        </div>
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
        allDoctors:state.admin.allDoctors,
        allScheduleTimes:state.admin.allScheduleTimes
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAllDoctors: ()=> dispatch(actionTypes.fetchAllDoctor()),
        fetchAllScheduleTime: ()=>dispatch(actionTypes.fetchAllScheduleTime())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
