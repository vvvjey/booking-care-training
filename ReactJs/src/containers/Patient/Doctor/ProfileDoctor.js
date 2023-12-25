import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import {getProfileDoctorInforById} from '../../../services/userService'
import { LANGUAGES } from '../../../utils';
import './ProfileDoctor.scss'
import { NumericFormat  } from 'react-number-format';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { Link } from 'react-router-dom';
class ProfileDoctor extends Component {
    constructor(props){
        super(props)
        this.state={
            dataProfile :{}
        }
    }
    async componentDidMount(){
        let data = await this.getInforDoctor(this.props.doctorId);
        this.setState({
            dataProfile:data
        })
    }
    async componentDidUpdate(prevProps,prevState,snapshot){
        if(prevProps.doctorId !== this.props.doctorId){
            let data = await this.getInforDoctor(this.props.doctorId);
            this.setState({
                dataProfile:data
            })
        }
        if(prevProps.language !== this.props.language){

        }
    }
    getInforDoctor = async (id) => {
        let result = {}
        if (id){
            let res = await getProfileDoctorInforById(id)
            if (res && res.errCode === 0 ){
                result = res.data.data
            }
        }
        return result
    }
    renderBookingTime = (dataTime) => {
        if (dataTime && !isEmpty(dataTime)){
            let time = this.props.language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn
            let date = this.props.language === LANGUAGES.VI ? moment.unix(dataTime.date/1000).format('dddd - DD/MM/YYYY') 
            : moment.unix(dataTime.date/1000).locale('en').format('ddd - MM/DD/YYYY') 
            return (
                <>
                    <div>
                        {time} - {date}
                    </div>
                    <div>
                    <FormattedMessage id="patient.booking-modal.priceBooking"/>
                    </div>
                </>
            )
        }
        return <></>
    }
    render() {
        let {dataProfile} = this.state
        let {language,isShowPrice,isShowLinkDetail,doctorId} =this.props
        let nameVi='',nameEn=''
        if(dataProfile && dataProfile.positionData){
            nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.firstName} ${dataProfile.lastName}`
            nameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}`
        }
        return (
            <div className='profile-doctor-container'>
                <div className='intro-doctor'>
                    <div 
                        className='content-left'
                        style={{backgroundImage:`url(${dataProfile && dataProfile.image ? dataProfile.image : ''})`}}>
                    </div>
                    <div className='content-right'>
                        <div className='up'>
                            {language === LANGUAGES.VI ? nameVi : nameEn}
                        </div>
                        <div className='down'>
                            {this.props.isShowDescription ? 
                                <>
                                    {dataProfile && dataProfile.Markdown && dataProfile.Markdown.description &&
                                        <span> 
                                            {dataProfile.Markdown.description}
                                        </span>
                                    } 
                                </>
                                : 
                                <>
                                    {this.renderBookingTime(this.props.dataTime)}
                                </>
                            }
                        </div>
                    </div>
                </div>
                {isShowLinkDetail === true && 
                    <div className='view-detail-doctor'>
                        <Link to={`/detail-doctor/${doctorId}`}>Xem thêm </Link>
                    </div>}
                {isShowPrice ===true &&

                <div className='price'>
                    <FormattedMessage id="patient.booking-modal.price"/>
                    {dataProfile && dataProfile.Doctor_Infor && language === LANGUAGES.VI &&
                        <NumericFormat 
                        className='currency'
                        value={dataProfile.Doctor_Infor.priceTypeData.valueVi}
                        displayType={'text'}
                        thousandSeparator={true}
                        suffix={'VND'}
                        /> 
                    }
                    {dataProfile && dataProfile.Doctor_Infor && language === LANGUAGES.EN &&
                        <NumericFormat 
                        className='currency'
                        value={dataProfile.Doctor_Infor.priceTypeData.valueEn}
                        displayType={'text'}
                        thousandSeparator={true}
                        suffix={'$'}
                        /> 
                    }
                </div>
                } 
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
