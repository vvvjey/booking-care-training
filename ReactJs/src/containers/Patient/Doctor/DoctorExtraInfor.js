import React, { Component } from 'react';
import { connect } from "react-redux";
import './DoctorExtraInfor.scss'
import { LANGUAGES } from '../../../utils';
import {getExtraDoctorInforById} from '../../../services/userService'
import { NumericFormat  } from 'react-number-format';
import { FormattedMessage } from 'react-intl';
class DoctorExtraInfor extends Component {
    constructor(props){
        super(props)
        this.state={
            isShowDetail:false,
            extraInfor:{

            }
        }
    }
    async componentDidMount(){
    }
    async componentDidUpdate(prevProps,prevState,snapshot){
        if(prevProps.doctorIdFromParent !== this.props.doctorIdFromParent){
            let data = await getExtraDoctorInforById(this.props.doctorIdFromParent)
            this.setState({
                extraInfor:data
            })
        }
    }
    showHideDetailInfor = (status) =>{
        this.setState({
            isShowDetail:status
        })
    }
    render() {
        let {isShowDetail,extraInfor} = this.state
        let {language} = this.props
        return (
            <div className='doctor-extra-infor-container'>
                <div className='content-up'>
                    <div className='text-address'><FormattedMessage id="patient.extra-infor.text-address" /></div>
                    <div className='name-clinic'>
                        {extraInfor && extraInfor.data ? extraInfor.data.nameClinic : ''}
                    </div>
                    <div className='detail-address'>
                        {extraInfor && extraInfor.data ? extraInfor.data.addressClinic : ''}
                    </div>
                </div>
                <div className='content-down'>
                    {isShowDetail ===false && 
                        <div className='short-infor'>
                            <FormattedMessage id="patient.extra-infor.price" />
                            {extraInfor && extraInfor.data && language === LANGUAGES.VI && 
                                <NumericFormat 
                                    className='currency'
                                    value={extraInfor.data.priceTypeData.valueVi}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={'VND'}
                                />
                            }
                            {extraInfor && extraInfor.data && extraInfor.data.priceTypeData.valueEn && language === LANGUAGES.EN && 
                                <NumericFormat 
                                    className='currency'
                                    value={extraInfor.data.priceTypeData.valueEn}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={'$'}
                                />
                            }
                            <span className='detail' onClick={()=>this.showHideDetailInfor(true)}><FormattedMessage id="patient.extra-infor.detail" /></span>
                        </div>
        
                    }
                    {isShowDetail ===true && 
                    <>
                        <div className='title-price'><FormattedMessage id="patient.extra-infor.price" /></div>
                        <div className='detail-infor'>
                            <div className='price'>
                                <span className='left'>
                                <FormattedMessage id="patient.extra-infor.price" />
                                </span>
                                <span className='right'>
                                    {extraInfor && extraInfor.data && language === LANGUAGES.VI && 
                                    <NumericFormat 
                                        className='currency'
                                        value={extraInfor.data.priceTypeData.valueVi}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        suffix={'VND'}
                                    />
                                    }
                                    {extraInfor && extraInfor.data && language === LANGUAGES.EN && 
                                        <NumericFormat 
                                            className='currency'
                                            value={extraInfor.data.priceTypeData.valueEn}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            suffix={'$'}
                                        />
                                    }
                                </span>
                            </div>
                            <div className='note'>
                                {extraInfor && extraInfor.data ? extraInfor.data.note : ''}

                            </div>
                        </div>
                        <div className='payment'>
                        <FormattedMessage id="patient.extra-infor.payment" />
                            {extraInfor && extraInfor.data.paymentTypeData && language===LANGUAGES.VI ? extraInfor.data.paymentTypeData.valueVi : ''}
                            {extraInfor && extraInfor.data.paymentTypeData && language===LANGUAGES.EN ? extraInfor.data.paymentTypeData.valueEn : ''}
                        </div>
                        <div className='hide-price'>
                            <span onClick={()=>this.showHideDetailInfor(false)}> <FormattedMessage id="patient.extra-infor.hide-price" /></span>
                        </div>
                    </>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfor);
