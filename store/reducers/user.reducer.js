import { userService } from "../../services/user.service.js";

export const SET_USER = 'SET_USER';
export const SET_IS_LOADING = 'SET_IS_LOADING';
export const UPDATE_PROGRESS = 'UPDATE_PROGRESS';
export const UPDATE_BALANCE = 'UPDATE_BALANCE';
export const UPDATE_USER = 'UPDATE_USER';

const initialState = {
    loggedInUser: userService.getLoggedinUser(),
    progress: 0,
    balance: 0,
    isLoading: false,
};

export function userReducer(state = initialState, cmd = {}) {
    switch (cmd.type) {
        case SET_USER:
            return { 
                ...state,
                loggedInUser: cmd.loggedInUser,
            };
        case UPDATE_PROGRESS:
            return { 
                ...state,
                progress: cmd.progress,
            };
        case UPDATE_BALANCE:
            return { 
                ...state,
                balance: cmd.balance,
            };
        case UPDATE_USER:
            return { 
                ...state,
                loggedInUser: { 
                    _id: state.loggedInUser._id,
                    ...cmd.details,
                },
            };
        case SET_IS_LOADING:
            return { 
                ...state,
                isLoading: cmd.isLoading,
            };
        default:
            return state;
    }
};