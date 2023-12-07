import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { emitter } from '../../utils/emitter';


class ModalUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
          modal: true,
          email:'',
          password:'',
          firstName:'',
          lastName:'',
          address:''
        }

        this.listenToEmitter()
    }


    listenToEmitter(){
        emitter.on('EVENT_CLEAR_MODAL_DATA',()=>{
            this.setState({
                email:'',
                password:'',
                firstName:'',
                lastName:'',
                address:''
            })
        })
    }
    componentDidMount() {
    
    }

    toggle() {
        this.props.toggleFromParent()
    }

    handleOnchangeInput (event,id) {
        // this.state[id] = event.target.value
        // this.setState({
        //     ...this.state
        // },()=>{
        //     console.log(this.state[id])
        // })
        let copyState = {...this.state}
        copyState[id] = event.target.value
        this.setState({
            ...copyState
        })
    }


    checkValidateInput () {
        let isValid=true;
        let arrInput = ['email','password','firstName','lastName','address']
        for ( let i = 0 ; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]){
                isValid=false;
                break;
            }
        }
        return isValid
    }

    handleAddNewUser () {
        let isValid = this.checkValidateInput()
        if (isValid) {
            this.props.createNewuser(this.state)
        } else {
            alert('missing parameter')
        }

    }


    render() {
        return (
            <div>
                <Button color="danger" onClick={()=>{this.toggle()}}>{this.props.buttonLabel}</Button>
                <Modal 
                    isOpen={this.props.isOpen} 
                    toggle={()=>{this.toggle()}} 
                    className={'modal-user-container'}
                    size="lg"
                >
                <ModalHeader toggle={()=>{this.toggle()}}>Create new user</ModalHeader>
                <ModalBody>
                    <div className='modal-user-body'>
                        <div className='input-container'>
                            <label>Email </label>
                            <input
                                type="text" 
                                value={this.state.email}
                                onChange={(event)=>{this.handleOnchangeInput(event,'email')}}
                            />
                         </div>
                         <div className='input-container'>
                             <label>Password </label>
                             <input 
                                type="password" 
                                value={this.state.password}
                                onChange={(event)=>{this.handleOnchangeInput(event,'password')}}
                            />
                         </div>
                         <div className='input-container'>
                            <label>First name </label>
                            <input type="text" 
                                value={this.state.firstName}
                                onChange={(event)=>{this.handleOnchangeInput(event,'firstName')}}
                            />
                         </div>
                         <div className='input-container'>
                             <label>Last name </label>
                             <input type="text" 
                                value={this.state.lastName}
                                onChange={(event)=>{this.handleOnchangeInput(event,'lastName')}}
                             />
                         </div>
                         <div className='input-container max-width-input'>
                             <label>Address </label>
                             <input type="text" 
                                value={this.state.address}
                                onChange={(event)=>{this.handleOnchangeInput(event,'address')}}
                             />
                         </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" className='px-3' onClick={()=>{this.handleAddNewUser()}}>Create user</Button>{' '}
                    <Button color="secondary" className='px-3' onClick={()=>{this.toggle()}}>Close</Button>
                </ModalFooter>
                </Modal>
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);
