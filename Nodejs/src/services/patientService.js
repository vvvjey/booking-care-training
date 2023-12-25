import db from "../models"
import emailService from './emailService'
const { v4: uuidv4 } = require('uuid');

let buildUrlEmail = (doctorId,token) => {
    let result = `${process.env.REACT_URL}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result
}
let postBookAppointment = (data) =>{
    return new Promise(async(resolve,reject)=>{
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.date
                || !data.fullName || !data.selectedGender || !data.address
                ){
                resolve({
                    errCode :1,
                    errMessage:'Missing parameter'
                })
            } else {
                let token = uuidv4()
                await emailService.sendSimpleEmail({
                    receiverEmail:data.email,
                    patientName:data.fullName,
                    time:data.timeString,
                    doctorName:data.doctorName,
                    language:data.language,
                    redirectLink:buildUrlEmail(data.doctorId,token)
                })
                let user = await db.User.findOrCreate({
                    where : {email:data.email},
                    defaults: {
                        email:data.email,
                        roleId:'R3',
                        gender:data.selectedGender,
                        address:data.address,
                        firstName:data.fullName
                    }
                })                   
                if  (user && user[0]){
                    await db.Booking.findOrCreate({
                        where:{patientId:user[0].id},
                        defaults :{
                            statusId:'S1',
                            doctorId:data.doctorId,
                            patientId:user[0].id,
                            date:data.date,
                            timeType:data.timeType,
                            token:token
                        }
                    })
                }
                resolve({
                    errCode:0,
                    errMessage:'Save infor doctor succeed'
                })
            }    
            
        }
        catch (e) {
            reject(e)
        }
    })
} 
let postVerifyBookAppointment = (data) =>{
    return new Promise(async(resolve,reject)=>{
        try {
            if (!data.token || !data.doctorId){
                resolve({
                    errCode :1,
                    errMessage:'Missing parameter'
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where:{
                        token:data.token,
                        doctorId:data.doctorId,
                        statusId:'S1'
                    },
                    raw:false
                })
                if (appointment) {
                    appointment.statusId='S2'
                    await appointment.save()
                    resolve({
                        errCode:0,
                        errMessage:'Update succeed'
                    })
                } else {
                    resolve({
                        errCode :2,
                        errMessage:'You appointment have been activated or not existed'
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    postBookAppointment,
    postVerifyBookAppointment
}