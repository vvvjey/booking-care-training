import React, { Component } from 'react';
import { connect } from 'react-redux';
import './MedicalFacility.scss'
import Slider from 'react-slick'
import {getAllClinic} from '../../../services/userService'
import { withRouter } from 'react-router';

class MedicalFacility extends Component {
    constructor(props){
        super(props)
        this.state={
            clinicData:[]
        }
    }
    async componentDidMount(){
        let data = await getAllClinic()
        if (data && data.data.errCode===0){
            this.setState({
                clinicData:data.data.data
            })
        }
    }
    handleViewDetailClinic = (clinic)=>{
        if(this.props.history){
            this.props.history.push(`/detail-clinic/${clinic.id}`)
        }
    }
    render() {
        let {clinicData} = this.state
        console.log(clinicData)
        return (
            <div className='section-share section-medical-facility'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'>Cơ sở y tế nổi bật</span>
                        <button className='btn-section'>Xem thêm</button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.setting}>
                            {clinicData && clinicData.length>0 &&
                                clinicData.map((item,index)=>{
                                    return (
                                        <div className='section-customize clinic-child' key={index}
                                            onClick={()=>this.handleViewDetailClinic(item)}
                                        >
                                            <div className='bg-image section-medical-facility' 
                                                style={{backgroundImage:`url(${item.image})`}}
                                            ></div>
                                            <div
                                                className='clinic-name'
                                            >{item.name}</div>
                                        </div>
                                    )
                                })
                            }
                            
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility));
