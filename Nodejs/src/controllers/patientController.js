import db from "../models"
import patientService from '../services/patientService'
let postBookAppointment = async (req,res) => {
    try {
        let data = await patientService.postBookAppointment(req.body)
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
let postVerifyBookAppointment = async (req,res)=>{
  try {
    let data = await patientService.postVerifyBookAppointment(req.body)
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
module.exports={
    postBookAppointment,
    postVerifyBookAppointment
}