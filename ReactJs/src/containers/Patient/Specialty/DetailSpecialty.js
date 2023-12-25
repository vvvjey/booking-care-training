import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './DetailSpecialty.scss'
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfor from '../Doctor/DoctorExtraInfor';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import {getAllDetailSpecialtyById,getAllCodeService} from '../../../services/userService'
import _ from 'lodash'
import { LANGUAGES } from '../../../utils';
class DetailSpecialty extends Component {
    constructor(props){
        super(props)
        this.state={
            arrDoctorId:[],
            dataDetailSpecialty:{},
            listProvince:[]
        }
    }
    async componentDidMount(){
        if(this.props.match && this.props.match.params && this.props.match.params.id){
            let id = this.props.match.params.id
            let res = await getAllDetailSpecialtyById({
                id:id,
                location:'ALL'
            })
            if(res && res.data.errCode===0){
                let data=res.data.data
                let arrDoctorId = []
                if (data && !_.isEmpty(data)){
                    let arr = data.doctorSpecialty
                    if (arr && arr.length>0){
                        arr.map(item=>{
                            arrDoctorId.push(item.doctorId)
                        })
                    }
                }
                this.setState({
                    dataDetailSpecialty:res.data.data,
                    arrDoctorId:arrDoctorId
                })
            }
            let resProvince = await getAllCodeService("PROVINCE")
            let dataProvince = resProvince.data
            if(dataProvince && resProvince.data.length>0){
                dataProvince.unshift({
                    createdAt:null,
                    keyMap:'ALL',
                    type:'PROVINCE',
                    valueVi:'Toàn quốc',
                    valueEn:'ALL'
                })
            }
            if (resProvince && resProvince.errCode===0 ) {
                this.setState({
                    listProvince:dataProvince
                })
            }
        }
    }
    async componentDidUpdate(prevProps,prevState,snapshot){

    }
    getDataDetailSpecialty = () => {

    }
    handleOnchangeLocation = async(event)=>{
        if(this.props.match && this.props.match.params && this.props.match.params.id){
            let id = this.props.match.params.id
            let location = event.target.value
            let res = await getAllDetailSpecialtyById({
                id:id,
                location:location
            })
            if(res && res.data.errCode===0){
                let data=res.data.data
                let arrDoctorId = []
                if (data && !_.isEmpty(data)){
                    let arr = data.doctorSpecialty
                    if (arr && arr.length>0){
                        arr.map(item=>{
                            arrDoctorId.push(item.doctorId)
                        })
                    }
                }
                this.setState({
                    dataDetailSpecialty:res.data.data,
                    arrDoctorId:arrDoctorId
                })
            }
        }
    }
    render() {
        let {arrDoctorId,dataDetailSpecialty,listProvince} = this.state
        return (
            <div className='detail-specialty-container'>
                <HomeHeader />
                <div className='detail-specialty-body'>
                    <div className='description-specialty'>
                        {dataDetailSpecialty && !_.isEmpty(dataDetailSpecialty) &&
                            <div dangerouslySetInnerHTML={{__html: dataDetailSpecialty.descriptionHTML}}>

                            </div>
                        }
                    </div>
                    <div className='search-specialty-doctor'>
                        <select onChange={(event)=>this.handleOnchangeLocation(event)}>
                            {listProvince && listProvince.length>0 && 
                                listProvince.map((item,index)=>{
                                    return (
                                        <option 
                                            key={index} 
                                            value={item.keyMap} 
                                            
                                        >
                                            {this.props.language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    
                    {arrDoctorId && arrDoctorId.length>0 &&
                        arrDoctorId.map((item,index)=>{
                            return (
                                <div className='each-doctor' key={index}>
                                    <div className='dt-content-left'>
                                        <div className='profile-doctor'>
                                            <ProfileDoctor
                                                doctorId={item}
                                                isShowDescription={true}
                                                isShowLinkDetail={true}
                                                isShowPrice={false}
                                            />
                                        </div>
                                    </div>
                                    <div className='dt-content-right'>
                                        <div className='doctor-schedule'>
                                            <DoctorSchedule 
                                                doctorIdFromParent={item}
                                                
                                            />
                                        </div>
                                        <div className='doctor-extra-infor'>
                                            <DoctorExtraInfor 
                                                doctorIdFromParent={item}
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                            )
                        })
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
