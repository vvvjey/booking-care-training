import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './RemedyModal.scss'
import {Modal,ModalHeader,ModalBody,ModalFooter,Button} from 'reactstrap'
import {toast} from 'react-toastify';
import moment from 'moment';
import {CommonUtils} from '../../../utils'
class RemedyModal extends Component {
    constructor(props){
        super(props)
        this.state={
            email:'',
            imgBase64:''
        }
    }
    async componentDidMount(){

    }
    async componentDidUpdate(prevProps,prevState,snapshot){
        if(this.props.dataModal.email!==prevProps.dataModal.email){
            this.setState({
                email:this.props.dataModal.email
            })
        }
    }
    handleSendRemedy = ()=>{
        this.props.sendRemedy(this.state)
    }
    handleOnChangeEmail = (event)=>{
        this.setState({
            email:event.target.value
        })
    }
    handleOnChangeImage = async(event) =>{
        let data=event.target.files
        let file=data[0]
        if(file) {
            let base64 = await CommonUtils.getBase64(file)
            this.setState({
                imgBase64:base64
            })
        }
    }
    render() {
        let {isOpenModal,closeRemedyModal,dataModal} = this.props

        return (
            <Modal 
                isOpen={isOpenModal}
                className={'booking-modal-container'}
                size='lg'
                centered
            >
                <div class="modal-header">
                    <h5 class="modal-title">Gửi hóa đơn khám bệnh thành công</h5>
                    <button type="button" class="close" aria-label="Close">
                        <span aria-hidden="true" onClick={closeRemedyModal}>x</span>
                    </button>
                </div>
                <ModalBody>
                    <div className='row'>
                        <div className='col-6 form-group'>
                                <label>Email bệnh nhân</label>
                                <input className='form-control' type='email' value={this.state.email} onChange={(event)=>this.handleOnChangeEmail(event)}></input>
                        </div>
                        <div className='col-6 form-group'>
                                <label>Chọn file đơn thuốc</label>
                                <input className='form-control-file' type='file' onChange={(event)=>this.handleOnChangeImage(event)}/>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                <Button color="primary" onClick={()=>this.handleSendRemedy()}>
                    Send
                </Button>{' '}
                <Button color="secondary" onClick={closeRemedyModal}>
                    Cancel
                </Button>
                </ModalFooter>
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
