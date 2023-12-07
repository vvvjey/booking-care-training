import doctorService from "../services/doctorService";

let getTopDoctorHome = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) limit = 10;
  try {
    let response = await doctorService.getTopDoctorHome(+limit);
    res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server",
    });
  }
};

let getAllDoctors = async (req, res) => {
  try {
    let response = await doctorService.getAllDoctorService();
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let postInforDoctor = async (req, res) => {
  try {
    let response = await doctorService.saveDetailInforDoctor(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let getDetailDoctorById = async (req, res) => {
  try {
    let infor = await doctorService.getDetailDoctorById(req.query.id);
    return res.status(200).json({
      infor,
    });
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
      e: e,
    });
  }
};
let bulkCreateSchedule = async (req,res)=>{
  try {
    let data = await doctorService.bulkCreateSchedule(req.body)
    console.log('data',data)
    return res.status(200).json({
      errCode:200,
      data : data
    })
  } catch (e) {
    console.log('e',e)
    return res.status(400).json({
      errCode:401,
      errMessage : e
    })
  }
}
let getDoctorScheduleByDate = async (req,res)=>{
  try{
    let data = await doctorService.getDoctorScheduleByDate(req.query.doctorId,req.query.date)
    return res.status(200).json({
      errCode:0,
      data:data
    })
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      errCode:1,
      errMessage:e
    })
  }
}
let getExtraDoctorInforById = async(req,res) =>{
  try{
    let data = await doctorService.getExtraDoctorInforById(req.query.doctorId)
    return res.status(200).json({
      errCode:0,
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
let getProfileDoctorById = async (req,res)=>{
  try {
    let data = await doctorService.getProfileDoctorById(req.query.doctorId)
    return res.status(200).json({
      errCode:0,
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
module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctors: getAllDoctors,
  postInforDoctor: postInforDoctor,
  getDetailDoctorById: getDetailDoctorById,
  bulkCreateSchedule:bulkCreateSchedule,
  getDoctorScheduleByDate:getDoctorScheduleByDate,
  getExtraDoctorInforById:getExtraDoctorInforById,
  getProfileDoctorById:getProfileDoctorById
};
