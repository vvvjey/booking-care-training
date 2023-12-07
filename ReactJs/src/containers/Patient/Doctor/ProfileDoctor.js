import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import {getProfileDoctorInforById} from '../../../services/userService'
import { LANGUAGES } from '../../../utils';
import './ProfileDoctor.scss'
import { NumericFormat  } from 'react-number-format';
import { isEmpty } from 'lodash';
import moment from 'moment';
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
            await this.getInforDoctor(this.props.doctorId);
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
        console.log('dataTime ne ',dataTime)
        if (dataTime && !isEmpty(dataTime)){
            let date = this.props.language === LANGUAGES.VI ? moment.unix(dataTime.date/1000).format('dddd - DD/MM/YYYY') 
            : moment.unix(dataTime.date/1000).locale('en').format('ddd - MM/DD/YYYY') 
            return (
                <>
                    <div>
                        {date}
                    </div>
                    <div>
                        khung gio
                    </div>
                </>
            )
        }
        return <></>
    }
    render() {
        let {dataProfile} = this.state
        let {language} =this.props
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
                <div className='price'>
                    Giá khám:
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
