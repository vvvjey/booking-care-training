import express from "express"
import homeController from "../controllers/homeController"
import userControlller from '../controllers/userController'
import doctorController from '../controllers/doctorController'
import patientController from '../controllers/patientController'
let router=express.Router()

let initWebRoutes = (app) => {
    router.get('/',homeController.getHomePage)
    router.post('/post-CRUD',homeController.postCRUD)
    router.post('/api/login',userControlller.handleLogin)
    router.get('/api/get-all-users',userControlller.handleGetAllUsers)
    router.post('/api/create-new-user',userControlller.handleCreateNewUser)
    router.delete('/api/delete-user',userControlller.handleDeleteUser)
    router.put('/api/edit-user',userControlller.handleEditUser)
    router.get('/api/allcode',userControlller.getAllCode)

    // DOCTOR
    router.get('/api/top-doctor-home',doctorController.getTopDoctorHome)
    router.get('/api/get-all-doctors',doctorController.getAllDoctors)
    router.post('/api/save-infor-doctors',doctorController.postInforDoctor)
    router.get('/api/get-detail-doctor-by-id',doctorController.getDetailDoctorById)
    router.post('/api/bulk-create-schedule',doctorController.bulkCreateSchedule)
    router.get('/api/get-doctor-schedule-by-date',doctorController.getDoctorScheduleByDate)
    router.get('/api/get-extra-doctor-infor-by-id',doctorController.getExtraDoctorInforById)
    router.get('/api/get-profile-doctor-by-id',doctorController.getProfileDoctorById)

    router.post('/api/patient-book-appointment',patientController.postBookAppointment)

    
    
    return app.use("/",router)
}

module.exports= initWebRoutes