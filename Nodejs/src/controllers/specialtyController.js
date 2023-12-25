import specialtyService from '../services/specialtyService'
let createSpecialty = async(req,res) =>{
    try {
        let data = await specialtyService.createSpecialty(req.body)
        return res.status(200).json({
          data
        })
      } catch (e) {
        return res.status(400).json({
          errCode:1,
          errMessage:e
        })
      }
}
let getAllSpecialty = async(req,res)=>{
  try {
    let data = await specialtyService.getAllSpecialty(req.body)
    return res.status(200).json({
      data
    })
  } catch (e) {
    return res.status(400).json({
      errCode:1,
      errMessage:e
    })
  }
}
let getDetailSpecialtyById = async (req,res)=>{
  try {
    let data = await specialtyService.getDetailSpecialtyById(req.query.id,req.query.location)
    return res.status(200).json({
      data
    })
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode:1,
      errMessage:e
    })
  }
}
module.exports ={
    createSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById
}