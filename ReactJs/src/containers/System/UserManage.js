import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss'
import {getAllUsers,createNewUserService,deleteUser,editUserService} from '../../services/userService'
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';
import { emitter } from '../../utils/emitter';

class UserManage extends Component {
    constructor (props) { 
        super(props)
        this.state = {
            arrUsers:[],
            isOpenModalUser:false,
            isOpenModalEditUser:false,
            userEdit:{

            }
        }
    }

    async componentDidMount() {
        await this.getAllUsersFromReat()
    }

    getAllUsersFromReat  = async() =>{
        let response = await getAllUsers('ALL')
        this.setState({
            arrUsers:response.users
        })
    }

    handleAddNewUser() {
        this.setState({
            isOpenModalUser:true
        })
    }

    toggleUserModal = () => {
        this.setState({
            isOpenModalUser : !this.state.isOpenModalUser
        })
    }
    toggleUserEditModal = () => {
        this.setState({
            isOpenModalEditUser : !this.state.isOpenModalEditUser
        })
    }
    createNewuser = async(data) => {
        try {
            let response = await createNewUserService(data)
            if (response.errCode == 0) {
                await this.getAllUsersFromReat()
                this.setState({
                    isOpenModalUser:false
                })

                emitter.emit('EVENT_CLEAR_MODAL_DATA')
            } else {
                alert(response.errMessage)
            }
        } catch (e) {
            console.log(e)
        }
    }

    handleDeleteUser = async (data) => {
        try {
            let response = await deleteUser(data.id)
            if ( response.errCode == 0 ) {
                await this.getAllUsersFromReat()
            }
        } catch (e) {
            console.log(e)
        }
    }

    handleEditUser = async (user) => {
        this.setState({
            isOpenModalEditUser:true,
            userEdit:user
        })
    }
    doEditUser = async (data) => {
        try {
            let response = await editUserService(data)
            if(response && response.errCode==0){
                console.log(response)
                this.setState({
                    isOpenModalEditUser:false
                })
                await this.getAllUsersFromReat()
            } else {
                alert(response.errMessage)
            }
        } catch (e) {
            console.log(e)
        }
    }
    render() {
        let arrUsers = this.state.arrUsers
        return (
            <div className='users-container'>
                <div className="title text-center">Manage users with jey</div>
                <ModalUser 
                    isOpen={this.state.isOpenModalUser}
                    toggleFromParent = {this.toggleUserModal}
                    createNewuser={this.createNewuser}
                    />
                {this.state.isOpenModalEditUser && 
                    <ModalEditUser 
                    isOpen={this.state.isOpenModalEditUser}
                    toggleFromParent = {this.toggleUserEditModal}
                    currentUser={this.state.userEdit}
                    editUser = {this.doEditUser}
                    />
                }
                <div className='mx-1'>
                    <button 
                        className='btn btn-primary px-3'
                        onClick={()=>{this.handleAddNewUser()}}
                    
                    ><i className='fas fa-plus'></i>Add new user</button>
                </div>
                <div className='users-table mt-3 mx-1'>
                    <table id="customers">
                        <tr>
                            <th>Email</th>
                            <th>First name</th>
                            <th>Last name</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                        {arrUsers && arrUsers.map((item,index)=>(
                            <tr>
                                <td>{item.email}</td>
                                <td>{item.firstName}</td>
                                <td>{item.lastName}</td>
                                <td>{item.address}</td>
                                <td>
                                    <button 
                                        className='btn-edit'
                                        onClick={()=>{this.handleEditUser(item)}}
                                    ><i class="fas fa-pencil-alt"></i></button>
                                    <button 
                                        className='btn-delete'
                                        onClick={()=>{this.handleDeleteUser(item)}}
                                    ><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        ))}
                    </table>
                </div>
            </div>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
