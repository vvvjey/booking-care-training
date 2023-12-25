import db from "../models"

let createClinic = (data)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            if(!data.name || !data.imgBase64 || !data.descriptionHTML || !data.descriptionMarkdown){
                resolve({
                    errCode:1,
                    errMessage:"Missing parameter"
                })
            } else {
                await db.Clinic.create({
                    name:data.name,
                    image:data.imgBase64,
                    descriptionHTML:data.descriptionHTML,
                    descriptionMarkDown:data.descriptionMarkdown
                })
                resolve({
                    errCode:0,
                    errMessage:"Ok"
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
let getAllClinic = ()=>{
    return new Promise(async(resolve,reject)=>{
        try{
            let data = await db.Clinic.findAll()
            if(data && data.length > 0){
                data.map(item=>{
                    item.image = new Buffer(item.image,'base64').toString('binary')
                    return item
                })
            }
            resolve({
                errCode:0,
                errMessage:"Ok",
                data
            })
        } catch (e) {
            reject(e)
        }
    })
}
let getDetailClinicById =(inputId)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            if(!inputId){
                resolve({
                    errCode:1,
                    errMessage:"Missing parameter",
                })
            } else {
                let data ={}
                data = await db.Clinic.findOne({
                    where:{
                        id:inputId
                    },
                    attributes:['name','address','descriptionHTML','descriptionMarkdown']
                })
                console.log(data,inputId)
                if(data){
                    let doctorClinic = []
                    doctorClinic = await db.Doctor_Infor.findAll({
                        where:{
                            clinicId:inputId
                        },
                        attributes:['doctorId','provinceId']
                    })
                    data.doctorClinic = doctorClinic

                } else {
                    data ={}
                }
                resolve({
                    errCode:0,
                    errMessage:"Ok",
                    data
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}
module.exports={
    createClinic,
    getAllClinic,
    getDetailClinicById
}