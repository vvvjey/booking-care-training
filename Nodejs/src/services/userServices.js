import db from '../models/index'
import bcrypt from 'bcrypt';

const saltRounds = 9;
const salt = bcrypt.genSaltSync(saltRounds);


let handleUserLogin = (email,password) => {
    return new Promise(async(resolve,reject)=>{
        try{
            let userData = {}
            let isExist = await checkUserEmail(email)
            if (isExist) {
                let user = await db.User.findOne({
                    attributes:['id','email','roleId','password','firstName','lastName'],
                    where:{
                        email:email
                    }
                })
                // compare password
                let check = await bcrypt.compareSync(password,user.password)
                if (check) { 
                    userData.errCode=0
                    userData.errMessage= 'success'
                    userData.data = user
                } else {
                    userData.errCode=2
                    userData.errMessage= 'wrong password'
                }
            } else {
                userData.errCode=1
                userData.errMessage = 'ur email not exist'
            }
            
            resolve(userData)
        } catch(e){
            reject(e)
        }
    })
}
let checkUserEmail = async(email) =>{
    let user = await db.User.findOne({where:{
        email:email
    }})
    if (user){
        return true;
    } else {
        return false
    }
}
let getAllUsers = (userId) => {
    return new Promise(async(resolve,reject)=>{
        try {
            let users=''
            if (userId == 'ALL') { 
                users = await db.User.findAll({
                    attributes:{
                        exclude:['password']
                    }
                })
            } else {
                users = await db.User.findOne({
                    where:{id:userId},
                    attributes:{
                        exclude:['password']
                    }
                })
            }
            resolve(users)
        } catch (e) {
            reject(e)
        }
    })
}
let createNewUser = (data) =>{
    return new Promise (async(resolve,reject)=>{
        try {
            let check = await checkUserEmail(data.email)
            if(check) {
                resolve({
                    errCode:1,
                    errMessage:'email already exist,try another email'
                })
            } else {
                let hashPassword = await bcrypt.hash(data.password, salt);
                let user = await db.User.create({
                    email:data.email,
                    password:hashPassword,
                    firstName:data.firstName,
                    lastName:data.lastName,
                    address:data.address,
                    phonenumber:data.phonenumber,
                    gender:data.gender,
                    positionId:data.positionId,
                    roleId:data.roleId,
                    image:data.avatar,
                })
                resolve({
                    errCode:0,
                    errMessage:'success'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let deleteUser = (id) => { 
    return new Promise (async(resolve,reject)=>{
        try {
            let user = await db.User.findOne({
                where:{id:id}
            })
            if (!user) {
                resolve({
                    errCode:1,
                    errMessage:'email is not exist'
                })
            }
            await db.User.destroy({
                where:{id:id}
            })
            resolve({
                errCode:0,
                errMessage:'delete successfully'
            })
        } catch (e) {
            reject(e)
        }
    }
)}

let editUser = (data) =>{
    return new Promise (async(resolve,reject)=>{
        try {

            if (!data.id || !data.roleId || !data.positionId || !data.gender) {
                resolve({
                    errCode:2,
                    errMessage:'missing required parameter'
                })
            }
            let user = await db.User.findOne({
                where:{id:data.id},
                raw:false
            })
            if (user) {
                user.email= data.email
                user.firstName=data.firstName
                user.lastName=data.lastName
                user.address=data.address
                user.roleId=data.roleId
                user.positionId=data.positionId
                user.gender=data.gender
                user.phonenumber=data.phonenumber
                if(user.avatar){
                    user.image=data.avatar
                }
                await user.save()
                resolve({
                    errCode:0,
                    errMessage:'update successfully'
                })
            } else {
                resolve({
                    errCode:1,
                    errMessage:'user not found'
                })
            }   
        } catch (e) {
            reject(e)
        }
    })
}

let getAllCodeService = (type)=>{
    return new Promise(async(resolve,reject)=>{
        try {
              if(!type) {
                resolve({
                    errCode:1,
                    errMessage:'missing required parameter'
                })
              } else {
                let res ={}
                let allcode = await db.Allcode.findAll({
                    where:{type:type}
                })
                res.errCode=0
                res.data=allcode
                resolve(res)
              }

        } catch(e) {
            reject(e)
        }
    })
}
module.exports={
    handleUserLogin:handleUserLogin,
    getAllUsers:getAllUsers,
    createNewUser:createNewUser,
    deleteUser:deleteUser,
    editUser:editUser,
    getAllCodeService:getAllCodeService
}