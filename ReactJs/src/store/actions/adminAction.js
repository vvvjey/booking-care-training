import actionTypes from './actionTypes';
import { getAllCodeService,createNewUserService,getAllUsers,deleteUser,editUserService
    ,getTopDoctorHomeService,getAllDoctors,saveDetailDoctorService,getAllSpecialty
    ,getAllClinic
} from '../../services/userService';
import {toast} from "react-toastify"

// GET GENDER DATA 
export const getGenderStart = () => {
    return async(dispatch,getState) => {
        try{
            const res = await getAllCodeService("GENDER")
            if (res && res.errCode===0){
                dispatch(getGenderSuccess(res))
            } else {
                dispatch(getGenderFail())
            }
        } catch (e) {
            dispatch(getGenderFail())
        }
    }
};
export const getGenderSuccess = (data) => ({
    data:data,
    type: actionTypes.GET_GENDER_SUCCESS
});
export const getGenderFail = () => ({
    type: actionTypes.GET_GENDER_FAIL
});
// GET POSITION DATA
export const getPositionStart = () => {
    return async(dispatch,getState) => {
        try{
            const res = await getAllCodeService("POSITION")
            if (res && res.errCode===0){
                dispatch(getPositionSuccess(res))
            } else {
                dispatch(getPositionFail())
            }
        } catch (e) {
            dispatch(getPositionFail())
        }
    }
};
export const getPositionSuccess = (data) => ({
    data:data,
    type: actionTypes.GET_POSITION_SUCCESS
});
export const getPositionFail = () => ({
    type: actionTypes.GET_POSITION_FAIL
});

// GET ROLE DATA
export const getRoleStart = () => {
    return async(dispatch,getState) => {
        try{
            const res = await getAllCodeService("ROLE")
            if (res && res.errCode===0){
                dispatch(getRoleSuccess(res))
            } else {
                dispatch(getRoleFail())
            }
        } catch (e) {
            dispatch(getRoleFail())
        }
    }
};
export const getRoleSuccess = (data) => ({
    data:data,
    type: actionTypes.GET_ROLE_SUCCESS
});
export const getRoleFail = () => ({
    type: actionTypes.GET_ROLE_FAIL
});


// SAVE USER
export const createNewUser = (data) => {
    return async(dispatch,getState) => {
        try{
            const res = await createNewUserService(data)
            if (res && res.errCode===0){
                toast.success('Create successfully !')
                dispatch(saveUserSuccess())
                dispatch(fetchAllUserStart())
            } else {
                toast.error('Create unsuccessfully !')
                dispatch(saveUserFail())
            }
        } catch (e) {
            toast.error('Create unsuccessfully !')
            dispatch(saveUserFail())
        }
    }
};
export const saveUserSuccess = () => ({
    type: actionTypes.SAVE_USER_SUCCESS
});
export const saveUserFail = () => ({
    type: actionTypes.SAVE_USER_FAIL
});


// GET ALL USER INFO
export const fetchAllUserStart = () => {
    return async(dispatch,getState) => {
        try{
            const res = await getAllUsers('ALL')
            if (res && res.errCode===0){
                dispatch(fetchAllUserSuccess(res.users.reverse()))
            } else {
                dispatch(fetchAllUserFail())
            }
        } catch (e) {
            dispatch(fetchAllUserFail())
        }
    }
};
export const fetchAllUserSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_USER_SUCCESS,
    data:data
});
export const fetchAllUserFail = () => ({
    type: actionTypes.FETCH_ALL_USER_FAIL
});

// DELETE USER 
export const deleteAUserStart = (id) => {
    return async(dispatch,getState) => {
        try{
            const res = await deleteUser(id)
            if (res && res.errCode===0){
                toast.success('Delete success !')
                dispatch(deleteAUserSuccess())
                dispatch(fetchAllUserStart())
            } else {
                dispatch(deleteAUserFail())
            }
        } catch (e) {
            dispatch(deleteAUserFail())
        }
    }
};
export const deleteAUserSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCESS
});
export const deleteAUserFail = () => ({
    type: actionTypes.DELETE_USER_FAIL
});

// EDIT USER
export const editUserStart = (data) => {
    return async(dispatch,getState) => {
        try{
            const res = await editUserService(data)
            console.log(res)
            if (res && res.errCode===0){
                toast.success('Edit success !')
                dispatch(editUserSuccess())
                dispatch(fetchAllUserStart())
            } else {
                dispatch(editUserFail())
            }
        } catch (e) {
            dispatch(editUserFail())
        }
    }
};
export const editUserSuccess = () => ({
    type: actionTypes.EDIT_USER_SUCCESS
});
export const editUserFail = () => ({
    type: actionTypes.EDIT_USER_FAIL
});


// FETCH TOP DOCTORS
export const fetchTopDoctor = () => {
    return async (dispatch,getState) => {
        try {
            let res = await getTopDoctorHomeService('')
            if ( res && res.errCode === 0) {
                dispatch({
                    type:actionTypes.FETCH_TOP_DOCTORS_SUCCESS,
                    dataDoctors:res.data
                })
            }
        } catch (e) {
            console.log('error',e)
            dispatch({
                type:actionTypes.FETCH_TOP_DOCTORS_FAIL,
            })
        }
    }
}
// FETCH ALL DOCTORS
export const fetchAllDoctor = () => {
    return async (dispatch,getState) => {
        try {
            let res = await getAllDoctors()
            if ( res && res.errCode === 0) {
                dispatch({
                    type:actionTypes.FETCH_ALL_DOCTORS_SUCCESS,
                    dataDoctors:res
                })
            }
        } catch (e) {
            console.log('error',e)
            dispatch({
                type:actionTypes.FETCH_ALL_DOCTORS_FAIL,
            })
        }
    }
}
// CREATE DETAIL DOCTORS
export const saveDetailDoctor = (data) => {
    return async (dispatch,getState) => {
        try {
            let res = await saveDetailDoctorService(data)
            if ( res && res.errCode === 0) {
                toast.success('Create doctor infor success !')
                dispatch({
                    type:actionTypes.SAVE_DETAIL_DOCTOR_SUCCESS,
                })
            } else {
                toast.error('Create doctor infor fail !')
                dispatch({
                    type:actionTypes.SAVE_DETAIL_DOCTOR_FAIL,
                })
            }
        } catch (e) {
            console.log('error',e)
            toast.error('Create doctor infor fail !')
            dispatch({
                type:actionTypes.SAVE_DETAIL_DOCTOR_FAIL,
            })
        }
    }
}
// Fetch all allcode schedule time
export const fetchAllScheduleTime = () => {
    return async (dispatch,getState) => {
        try {
            const res = await getAllCodeService("TIME")
            if ( res && res.errCode === 0) {
                dispatch({
                    type:actionTypes.FETCH_ALL_SCHEDULE_TIME_SUCCESS,
                    dataScheduleTimes:res
                })
            }
        } catch (e) {
            dispatch({
                type:actionTypes.FETCH_ALL_SCHEDULE_TIME_FAIL,
            })
        }
    }
}

// Fectch all allcode price payment province
export const fetchRequiredDoctorInforStart = () =>{
    return async (dispatch,getState) => {
        try{
            const resPrice = await getAllCodeService("PRICE")
            const resPayment = await getAllCodeService("PAYMENT")
            const resProvince = await getAllCodeService("PROVINCE")
            const resSpecialty = await getAllSpecialty();
            let resClinic = await getAllClinic();

            if (resPrice && resPrice.errCode===0 &&
                resPayment && resPayment.errCode===0 &&
                resProvince && resProvince.errCode===0 &&
                resSpecialty.data && resSpecialty.data.errCode===0 &&
                resClinic.data && resClinic.data.errCode===0

                ) {
                    let data = {
                        resPrice:resPrice.data,
                        resPayment:resPayment.data,
                        resProvince:resProvince.data,
                        resSpecialty:resSpecialty.data.data,
                        resClinic:resClinic.data.data
                    }
                    dispatch({
                        type:actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_SUCCESS,
                        data:data
                    })
                }
        } catch (e){
            dispatch({
                type:actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAIL,
            })
        }
    }
}
export const fetchRequiredDoctorInforSuccess = (data) =>({
    type:actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_SUCCESS,
    data:data
})
export const fetchRequiredDoctorInforFail = () =>({
    type:actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAIL,
})