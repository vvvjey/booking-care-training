import axios from "../axios";

let handleLoginApi = (email,password)=>{
    return axios.post('/api/login',{email,password})
}
let getAllUsers = (id) => {
    return axios.get (`/api/get-all-users/?id=${id}`)
}
let createNewUserService = (data) => {
    return axios.post('/api/create-new-user',data)
}
let deleteUser = (id) => {
    return axios.delete('/api/delete-user', {
        data: {
            id: id
        }
    })
}
let editUserService =(data)=>{
    return axios.put('/api/edit-user',data)
}
let getAllCodeService = (typeInput) =>{
    return axios.get(`/api/allcode?type=${typeInput}`)
}
let getTopDoctorHomeService = (limit) => {
    return axios.get(`/api/top-doctor-home?limit=${limit}`)
}
let getAllDoctors = () =>{
    return axios.get('/api/get-all-doctors')
}
let saveDetailDoctorService = (data)=>{
    return axios.post('/api/save-infor-doctors',data)
}
let getDetailInforDoctor = (id)=>{
    return axios.get(`/api/get-detail-doctor-by-id?id=${id}`)
}
let bulkCreateSchedule = (data)=>{
    return axios.post(`/api/bulk-create-schedule`,data)
}
let getScheduleDoctorByDate = (doctorId,date)=>{
    return axios.get(`/api/get-doctor-schedule-by-date?doctorId=${doctorId}&date=${date}`)
}
let getExtraDoctorInforById = (doctorId)=>{
    return axios.get(`/api/get-extra-doctor-infor-by-id?doctorId=${doctorId}`)
}
let getProfileDoctorInforById = (doctorId)=>{
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`)
}
let postPatientBookAppointment = (data)=>{
    return axios.post(`/api/patient-book-appointment`,data)
}
let postVerifyBookAppointment = (data)=>{
    return axios.post(`/api/verify-booking`,data)
}
let createNewSpecialty = (data)=>{
    return axios.post(`/api/create-new-specialty`,data)
}
let getAllSpecialty = ()=>{
    return axios.get(`/api/get-all-specialty`)
}
let getAllDetailSpecialtyById = (data)=>{
    return axios.get(`/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`)
}
let createNewClinic = (data)=>{
    return axios.post(`/api/create-new-clinic`,data)
}
let getAllClinic = ()=>{
    return axios.get(`/api/get-all-clinic`)
}
let getAllDetailClinicById = (id)=>{
    return axios.get(`/api/get-detail-clinic-by-id?id=${id}`)
}
let getListPatientForDoctor = (data)=>{
    return axios.get(`/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}`)
}
let sendRemedy = (data)=>{
    return axios.post(`/api/send-remedy`,data)
}
export {getAllDoctors,handleLoginApi,
    getAllUsers,createNewUserService,
    deleteUser,editUserService,getAllCodeService,
    getTopDoctorHomeService,saveDetailDoctorService,
    getDetailInforDoctor,bulkCreateSchedule,
    getScheduleDoctorByDate,getExtraDoctorInforById,
    getProfileDoctorInforById,postPatientBookAppointment,
    postVerifyBookAppointment,createNewSpecialty,
    getAllSpecialty,getAllDetailSpecialtyById,
    createNewClinic,getAllClinic,getAllDetailClinicById,
    getListPatientForDoctor,sendRemedy
}