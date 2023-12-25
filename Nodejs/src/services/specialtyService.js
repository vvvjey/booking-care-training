import db from "../models"

let createSpecialty = (data)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            if(!data.name || !data.imgBase64 || !data.descriptionHTML || !data.descriptionMarkdown){
                resolve({
                    errCode:1,
                    errMessage:"Missing parameter"
                })
            } else {
                await db.Specialty.create({
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
let getAllSpecialty = (data)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            let data = await db.Specialty.findAll()
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
let getDetailSpecialtyById = (inputId,location) => {
    return new Promise(async(resolve,reject)=>{
        try{
            if(!inputId || !location){
                resolve({
                    errCode:1,
                    errMessage:"Missing parameter",
                })
            } else {
                let data ={}
                console.log(inputId)
                data = await db.Specialty.findOne({
                    where:{
                        id:inputId
                    },
                    attributes:['descriptionHTML','descriptionMarkdown']
                })
                console.log(data)
                if(data){
                    let doctorSpecialty = []
                    if(location === 'ALL'){
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where:{
                                specialtyId:inputId
                            },
                            attributes:['doctorId','provinceId']
                        })
                    } else{
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where:{
                                specialtyId:inputId,
                                provinceId:location
                            },
                            attributes:['doctorId','provinceId']
                        })
                    }

                    data.doctorSpecialty = doctorSpecialty

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
module.exports ={
    createSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById
}