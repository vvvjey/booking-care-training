import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ManageClinic.scss'
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { CommonUtils } from '../../../utils';
import {createNewSpecialty} from '../../../services/userService'
import { toast } from 'react-toastify';
import {createNewClinic} from '../../../services/userService'
const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageClinic extends Component {
    constructor(props){
        super(props)
        this.state={
            name:'',
            address:'',
            imgBase64:'',
            descriptionHTML:'',
            descriptionMarkdown:''
        }
    }
    async componentDidMount(){

    }
    async componentDidUpdate(prevProps,prevState,snapshot){

    }
    handleOnChangeInput = (event,name) => {
        let copyState = {...this.state}
        copyState[name] = event.target.value
        this.setState({
            ...copyState
        })
    }
    handleEditorChange = ({html,text})=>{
        this.setState({
            descriptionHTML:html,
            descriptionMarkdown:text
        })
    }
    handleOnChangeImage = async(event) =>{
        let data=event.target.files
        let file=data[0]
        if(file) {
            let base64 = await CommonUtils.getBase64(file)
            this.setState({
                imgBase64:base64,
            })
        }
    }
    handleSaveNewClinic = async() =>{
        console.log(this.state)
        let res = await createNewClinic(this.state)
        console.log('res',res)
        if (res && res.data.errCode === 0) {
            toast.success('Add new specialty succeed!')
        } else {
            toast.error('Sth wrongs')
        }
    }
    render() {
        return (
            <div className='manage-specialty-container'>
                <div className='ms-title'>Quản lý phòng khám</div>
                <div className='btn-add-new-specialty row'>
                    <div className='col-6 form-group'>
                        <label>Tên phòng khám</label>
                        <input className='form-control' type='text'
                            onChange={(event)=>this.handleOnChangeInput(event,'name')}
                        />
                    </div>
                    <div className='col-6 form-group'>
                        <label>Ảnh phòng khám</label>
                        <input className='form-control-file' type='file'
                            onChange={(event)=>this.handleOnChangeImage(event)}
                        />
                    </div>
                    <div className='col-6 form-group'>
                        <label>Địa chỉ phòng khám</label>
                        <input className='form-control' type='text'
                            onChange={(event)=>this.handleOnChangeInput(event,'address')}
                        />
                    </div>
                    <div className='col-12'>
                        <MdEditor 
                            style={{ height: '300px' }} 
                            renderHTML={text => mdParser.render(text)} 
                            onChange={this.handleEditorChange} 
                            value={this.state.descriptionMarkdown}
                        />
                    </div>
                    <div className='col-12'>
                        <button className='btn-save-specialty'
                            onClick={()=>this.handleSaveNewClinic()}
                        >Save</button>
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
