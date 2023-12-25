import db from "../models"
require('dotenv').config()
import _ from 'lodash'
import emailService from '../services/emailService'
var MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE
let getTopDoctorHome = (limit) =>{
    return new Promise (async(resolve,reject)=>{
        try {
            let users = await db.User.findAll({
                limit:limit,
                order:[['createdAt','DESC']],
                where :{
                    roleId:'R2'
                },
                attributes:{
                    exclude:['password']
                },
                include:[
                    {model:db.Allcode,as:'positionData',attributes:['valueEn','valueVi']},
                    {model:db.Allcode,as:'genderData',attributes:['valueEn','valueVi']}
                ],
                raw:true,
                nest:true
            })
            resolve({
                errCode:0,
                data:users
            })
        } catch (e) {
            console.log(e)
            reject(e)
        }
        

    })
}
let getAllDoctorService = () =>{
    return new Promise (async(resolve,reject)=>{
        try{
            let doctors = await db.User.findAll({
                where:{
                    roleId:"R2"
                },
                attributes:{
                    exclude:['password']
                },
            })
            resolve({
                errCode:0,
                doctors
            })
        } catch (e) {
            console.log(e)
            reject(e)
        }
    })
}

let checkRequiredField = (inputData) =>{
    let arr = ['doctorId','contentHTML','contentMarkdown',
    'action','selectedPrice','selectedPayment','selectedProvince',
    'nameClinic','addressClinic','note','specialtyId'
    ]
    let isValid = true;
    let element=''
    for (let i=0;i<arr.length;i++){
        if (!inputData[arr[i]]){
            isValid=false
            element=arr[i]
            break
        }
    }
    return {
        isValid:isValid,
        element:element
    }
}

let saveDetailInforDoctor = (inputData) => {
    return new Promise(async(resolve,reject)=>{
        try {
            let checkObj = checkRequiredField(inputData)
            if (checkObj.isValid===false){
                resolve({
                    errCode:1,
                    errMessage:`Missing parameter : ${checkObj.element}`
                }) 
            } else {
                if (inputData.action == "CREATE"){
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown:inputData.contentMarkdown,
                        description : inputData.description,
                        doctorId:inputData.doctorId
                    })
                } else {
                    let markdown =  await db.Markdown.findOne({
                        where:{
                            doctorId:inputData.doctorId
                        },
                        raw:false
                    })
                    if (markdown) {
                        markdown.contentHTML= inputData.contentHTML
                        markdown.contentMarkdown=inputData.contentMarkdown
                        markdown.description = inputData.description
                        await markdown.save()
                    }
                }
                let doctorInfor = await db.Doctor_Infor.findOne({
                    where:{
                        doctorId:inputData.doctorId
                    },
                    raw:false
                })
                if (doctorInfor) {
                    doctorInfor.doctorId = inputData.doctorId   
                    doctorInfor.priceId = inputData.selectedPrice.value
                    doctorInfor.paymentId = inputData.selectedPayment.value
                    doctorInfor.provinceId= inputData.selectedProvince.value
                    doctorInfor.nameClinic= inputData.nameClinic
                    doctorInfor.addressClinic= inputData.addressClinic
                    doctorInfor.note= inputData.note
                    doctorInfor.specialtyId=inputData.specialtyId
                    doctorInfor.clinicId=inputData.clinicId

                    await doctorInfor.save()
                } else {
                    await db.Doctor_Infor.create({
                        doctorId : inputData.doctorId,   
                        priceId : inputData.selectedPrice.value,
                        paymentId : inputData.selectedPayment.value,
                        provinceId: inputData.selectedProvince.value,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note,
                        specialtyId:inputData.specialtyId,
                        clinicId:inputData.clinicId
                    })
                }
                resolve({
                    errCode:0,
                    errMessage:'Save infor doctor succeed!'
                })
            }
        } catch (e ){
            reject(e)
        }
    })
}
let getDetailDoctorById =  (id)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            if(!id){
                resolve({
                    errCode:1,
                    errMessage:"Miss required parameter"
                })
            } else {
                let data = await db.User.findOne({
                    where:{
                        id:id
                    },
                    attributes:{
                        exclude:['password']
                    },
                    include:[
                        {model:db.Markdown,
                            attributes:['description','contentHTML','contentMarkdown']
                        },
                        {model:db.Doctor_Infor,
                        attributes:{
                            exclude:['id','doctorId']
                        },
                        include:[
                            {model:db.Allcode,as:'priceTypeData',attributes:['valueEn','valueVi']},
                            {model:db.Allcode,as:'paymentTypeData',attributes:['valueEn','valueVi']},
                            {model:db.Allcode,as:'provinceTypeData',attributes:['valueEn','valueVi']},
                        ]
                        },
                        {model:db.Allcode,as:'positionData',attributes:['valueEn','valueVi']},
                    ],
                    raw:false,
                    nest:true
                }) 
                if(data.image){
                    data.image = new Buffer(data.image , 'base64').toString('binary')
                }
                if (!data){
                    data={}
                }
                resolve({
                    errCode:0,
                    data:data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
let bulkCreateSchedule = (data)=> {
    return new Promise(async(resolve,reject)=>{
        try {
            if (!data.arrSchedule || !data.doctorId || !data.dateTimeFormatted){
                resolve({
                    errCode:1,
                    errMessage:"Missing required param"
                })
            } else {
                if (data.arrSchedule && data.arrSchedule.length > 0){
                    data.arrSchedule.map((item)=>{
                        item.maxNumber=MAX_NUMBER_SCHEDULE
                        return item
                    })
                    //find doctor in DB
                    let existingSchedule = await db.Schedule.findAll({
                        where:{
                            doctorId : data.doctorId,
                            date : data.dateTimeFormatted
                        },
                        attributes:['timeType','doctorId','date']
                    }) 

                    // Find diffrent
                    let toCreate = _.differenceWith(data.arrSchedule,existingSchedule,(a,b)=>{
                        return a.timeType===b.timeType && +a.date===+b.date
                    })
                    if (toCreate && toCreate.length>0){
                        await db.Schedule.bulkCreate(toCreate)
                        resolve({
                            errCode:0,
                            errMessage:"Create Success!"
                        })
                    }
                }
            }
        } catch (e){
            reject(e)
        }
    })
}
let getDoctorScheduleByDate = async(doctorId,date)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            if (!doctorId || !date){
                resolve({
                    errCode:1,
                    errMessage:"Missing required parameter"
                })
            }
            let dataSchedule = await db.Schedule.findAll({
                where:{
                    doctorId:doctorId,
                    date:date
                },
                include:[
                    {model:db.Allcode,as:'timeTypeData',attributes:['valueEn','valueVi']},
                    {model:db.User,as:'doctorData',attributes:["firstName","lastName"]}
                ],
                raw:false,
                nest:true
            })
            if (!dataSchedule)  dataSchedule=[]
            resolve(dataSchedule)
        } catch (e) {
            reject(e)
        }
    })
}
let getExtraDoctorInforById = (doctorId) =>{
    return new Promise(async(resolve,reject)=>{
        try {
            if (!doctorId){
                resolve({
                    errCode:1,
                    errMessage:"Missing required parameter"
                })
            }
            let data = await db.Doctor_Infor.findOne({
                where:{
                    doctorId:doctorId,
                },
                include:[
                    {model:db.Allcode,as:'priceTypeData',attributes:['valueEn','valueVi']},
                    {model:db.Allcode,as:'paymentTypeData',attributes:['valueEn','valueVi']},
                    {model:db.Allcode,as:'provinceTypeData',attributes:['valueEn','valueVi']},
                ],
                raw:false,
                nest:true
            })
            if (!data)  data={}
            resolve(data)
        } catch (e) {
            reject(e)
        }
    })
}
let getProfileDoctorById = (doctorId) => {
    return new Promise(async(resolve,reject)=>{
        try { 
            if (!doctorId){
                resolve({
                    errCode:1,
                    errMessage:"Missing required parameter"
                })
            }
            let data = await db.User.findOne({
                    where:{
                        id:doctorId
                    },
                    attributes:{
                        exclude:['password']
                    },
                    include:[
                        {model:db.Markdown,
                            attributes:['description','contentHTML','contentMarkdown']
                        },
                        {model:db.Doctor_Infor,
                        attributes:{
                            exclude:['id','doctorId']
                        },
                        include:[
                            {model:db.Allcode,as:'priceTypeData',attributes:['valueEn','valueVi']},
                            {model:db.Allcode,as:'paymentTypeData',attributes:['valueEn','valueVi']},
                            {model:db.Allcode,as:'provinceTypeData',attributes:['valueEn','valueVi']},
                        ]
                        },
                        {model:db.Allcode,as:'positionData',attributes:['valueEn','valueVi']},
                    ],
                    raw:false,
                    nest:true
                }) 
                if(data.image){
                    data.image = new Buffer(data.image , 'base64').toString('binary')
                }
                if (!data){
                    data={}
                }
                resolve({
                    errCode:0,
                    data:data
                })
        } catch (e) {
            reject(e)
        }
    })
}
let getListPatientForDoctor =(doctorId,date)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            if(!doctorId || !date){
                resolve({
                    errCode:1,
                    errMessage:"Missing required parameters"
                })
            } else {
                let data = await db.Booking.findAll({
                    where:{
                        statusId:'S2',
                        doctorId:doctorId,
                        date:date
                    },
                    include:[
                        {
                            model:db.User,as:'patientData',
                            attributes:['email','firstName','address','gender'],
                            include:[
                                {
                                    model:db.Allcode,as:'genderData',attributes:['valueEn','valueVi']
                                }
                            ]
                        },{
                            model:db.Allcode,as:'timeTypeDataPatient',attributes:['valueEn','valueVi']
                        }
                    ],
                    raw:false,
                    nest:true
                })
                resolve({
                    errCode:0,
                    data:data
                })
            }
        } catch(e){
            reject(e)
        }
    })
}
let sendRemedy = (data)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            if (!data.email || !data.doctorId || !data.patientId || !data.timeType){
                resolve({
                    errCode:1,
                    errMessage:"Missing required parameter"
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId:data.doctorId,
                        patientId:data.patientId,
                        timeType:data.timeType,
                        statusId:'S2'
                    },
                    raw:false
                })
                if(appointment){
                    appointment.statusId='S3'
                    await appointment.save()
                }
                await emailService.sendAttachment(data)
                resolve({
                    errCode:0
                })
            }

        } catch(e){
            reject(e)
        }
    })
}
module.exports={
    getTopDoctorHome:getTopDoctorHome,
    getAllDoctorService:getAllDoctorService,
    saveDetailInforDoctor:saveDetailInforDoctor,
    getDetailDoctorById:getDetailDoctorById,
    bulkCreateSchedule:bulkCreateSchedule,
    getDoctorScheduleByDate:getDoctorScheduleByDate,
    getExtraDoctorInforById:getExtraDoctorInforById,
    getProfileDoctorById:getProfileDoctorById,
    getListPatientForDoctor:getListPatientForDoctor,
    sendRemedy:sendRemedy
}