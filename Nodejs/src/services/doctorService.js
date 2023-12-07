import db from "../models"
require('dotenv').config()
import _ from 'lodash'
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
let saveDetailInforDoctor = (inputData) => {
    return new Promise(async(resolve,reject)=>{
        try {
            if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown || !inputData.action
                || !inputData.selectedPrice || !inputData.selectedPayment
                || !inputData.selectedProvince || !inputData.nameClinic
                || !inputData.addressClinic || !inputData.note
                ){
                resolve({
                    errCode:1,
                    errMessage:'Missing parameter'
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
                    await doctorInfor.save()
                } else {
                    await db.Doctor_Infor.create({
                        doctorId : inputData.doctorId,   
                        priceId : inputData.selectedPrice.value,
                        paymentId : inputData.selectedPayment.value,
                        provinceId: inputData.selectedProvince.value,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputDarefreshmentta.addressClinic,
                        note: inputData.note
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
module.exports={
    getTopDoctorHome:getTopDoctorHome,
    getAllDoctorService:getAllDoctorService,
    saveDetailInforDoctor:saveDetailInforDoctor,
    getDetailDoctorById:getDetailDoctorById,
    bulkCreateSchedule:bulkCreateSchedule,
    getDoctorScheduleByDate:getDoctorScheduleByDate,
    getExtraDoctorInforById:getExtraDoctorInforById,
    getProfileDoctorById:getProfileDoctorById
}