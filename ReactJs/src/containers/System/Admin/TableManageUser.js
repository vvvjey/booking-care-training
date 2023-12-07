import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import {LANGUAGES} from '../../../utils/constant'
import * as actionTypes from '../../../store/actions';
import './TableManageUser.scss'
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

// Finish!
function handleEditorChange({ html, text }) {
  console.log('handleEditorChange', html, text);
}
class UserRedux extends Component {

    constructor (props) {
        super(props);
        this.state = {
            usersRedux:[],
        }
    }

    async componentDidMount() {
        this.props.fetchAllUserStart()
    }
    componentDidUpdate(prevProps,prevState,snapshot){
        if(this.props.listUsers !== prevProps.listUsers){
            this.setState({
                usersRedux:this.props.listUsers
            })
        }
    }
    handleDeleteUser = (user)=>{
        this.props.deleteAUserStart(user.id)
    }
    handleEditUser = (user) =>{
        this.props.handleEditUserFromParent(user)
    }
    render() {
        
        let arrUsers = this.state.usersRedux
        return (
            <React.Fragment>
                <div className='users-table mt-3 mx-1'>
                    <table id="customers">
                        <tr>
                            <th>Email</th>
                            <th>First name</th>
                            <th>Last name</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                        {arrUsers && arrUsers.length>0 && arrUsers.map((item,index)=>(
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
                <MdEditor style={{ height: '500px' }} renderHTML={text => mdParser.render(text)} onChange={handleEditorChange} />
            </React.Fragment>     
        ) 
    }

}

const mapStateToProps = state => {
    return {
        listUsers:state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllUserStart: ()=> dispatch(actionTypes.fetchAllUserStart()),
        deleteAUserStart: (id)=> dispatch(actionTypes.deleteAUserStart(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
