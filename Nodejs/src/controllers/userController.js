import db from '../models/index'
import userServices from '../services/userServices'
let handleLogin = async (req,res)=>{
    let email = req.body.email
    let password = req.body.password   
    if (!email || !password) {
        return res.status(500).json({
            errCode:1,
            errMessage:'Missing input parameter'
        })
    }
    let userData = await userServices.handleUserLogin(email,password)
    res.status(200).json({
        errCode:userData.errCode,
        errMessage:userData.errMessage,
        user:userData.data
    })
    
}


let handleGetAllUsers = async(req,res) =>{
    let id = req.query.id
    if (!id) {
        return res.status(500).json({
            errCode:1,
            errMessage:'missing required parameters'
        })
    }
    let users = await userServices.getAllUsers(id)
    res.status(200).json({
        errCode:0,
        errMessage:'success',
        users:users
    })
}

let handleCreateNewUser = async(req,res) =>{
    let message = await userServices.createNewUser(req.body)
    res.status(200).json(message)
}

let handleDeleteUser = async(req,res) => {
    if(!req.body.id) {
        return res.status(200).json({
            errCode:1,
            errMessage:'missing required parameter'
        })
    }
    let message = await userServices.deleteUser(req.body.id)
    res.status(200).json(message)
}

let handleEditUser = async(req,res) => {
    let message = await userServices.editUser(req.body)
    res.status(200).json(message)
}

let getAllCode = async(req,res)=>{
    try{
        let type=req.query.type 
        let data = await userServices.getAllCodeService(type)
        return res.status(200).json(data)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode:-1,
            errMessage:'Error from server'
        })
    }
    

}

module.exports={
    handleLogin:handleLogin,
    handleGetAllUsers:handleGetAllUsers,
    handleCreateNewUser:handleCreateNewUser,
    handleDeleteUser:handleDeleteUser,
    handleEditUser:handleEditUser,
    getAllCode:getAllCode
}