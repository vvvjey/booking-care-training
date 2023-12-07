import actionTypes from '../actions/actionTypes';


const initialState = {
    genders:[],
    positions:[],
    roles:[],
    users:[],
    topDoctors:[],
    allDoctors:[],
    allScheduleTimes:[],
    allRequiredDoctorInfor:[]
}


const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_GENDER_START: 
        // test loading when api take time to get data
            return {
                ...state,
            }
        case actionTypes.GET_GENDER_SUCCESS: 
            state.genders = action.data
            return {
                ...state,
            }
        case actionTypes.GET_GENDER_FAIL: 
            state.genders=[]
            return {
                ...state,
            }
        // POSITION
        case actionTypes.GET_POSITION_SUCCESS: 
        state.positions = action.data
            return {
                ...state,
            }
        case actionTypes.GET_POSITION_FAIL: 
            state.positions=[]
            return {
                ...state,
            }
        // ROLE
        case actionTypes.GET_ROLE_SUCCESS: 
        state.roles = action.data
            return {
                ...state,
            }
        case actionTypes.GET_ROLE_FAIL: 
            state.roles=[]
            return {
                ...state,
            }
        // USER
        case actionTypes.SAVE_USER_SUCCESS: 
            return {
                ...state,
            }      
        case actionTypes.SAVE_USER_FAIL: 
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_USER_SUCCESS:
            state.users=action.data
            return {
                ...state,
            }  
        case actionTypes.FETCH_ALL_USER_FAIL:
            state.users=[]
            return {
                ...state,
            }     
        case actionTypes.FETCH_TOP_DOCTORS_SUCCESS:
            state.topDoctors = action.dataDoctors
            return {
                ...state,
            }     
        case actionTypes.FETCH_TOP_DOCTORS_FAIL:
            state.topDoctors = []
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_DOCTORS_SUCCESS:
            state.allDoctors = action.dataDoctors.doctors
            return {
                ...state,
            }     
        case actionTypes.FETCH_ALL_DOCTORS_FAIL:
            state.allDoctors = []
            return {
                ...state,
            }    
        case actionTypes.FETCH_ALL_SCHEDULE_TIME_SUCCESS:
            state.allScheduleTimes = action.dataScheduleTimes
            return {
                ...state,
            }     
        case actionTypes.FETCH_ALL_SCHEDULE_TIME_FAIL:
            state.allScheduleTimes = []
            return {
                ...state,
            } 
        case actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_SUCCESS:
            state.allRequiredDoctorInfor = action.data
            return {
                ...state,
            }     
        case actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAIL:
            state.allRequiredDoctorInfor = []
            return {
                ...state,
            } 
        default:
            return state;
    }
}

export default adminReducer;