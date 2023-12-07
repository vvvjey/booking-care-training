import db from "../models"
let postBookAppointment = async (req,res) => {
    try {
        let data = await doctorService.postBookAppointment(req.query)
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
    postBookAppointment
}