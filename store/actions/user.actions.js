import { userService } from "../../services/user.service.js";
import { SET_USER, SET_IS_LOADING, UPDATE_USER } from "../reducers/user.reducer.js";
import { store } from "../store.js";

export async function login(credentials) {
    store.dispatch({ type: SET_IS_LOADING, isLoading: true });
    
    const loggedInUser = await userService.login(credentials);

    try{
        store.dispatch({ type: SET_USER, loggedInUser });
    }
    catch(error){
        console.log('user actions -> Cannot login', error);
        throw error;
    }
    finally{
        store.dispatch({ type: SET_IS_LOADING, isLoading: false });
    }
}

export async function signup(credentials) {    
    store.dispatch({ type: SET_IS_LOADING, isLoading: true });

    try{
        const loggedInUser = await userService.signup(credentials);
        store.dispatch({ type: SET_USER, loggedInUser });
    }catch(error){
        console.log('user actions -> Cannot signup', error);
        throw error;
    }
    finally{
        store.dispatch({ type: SET_IS_LOADING, isLoading: false });
    }
}

export async function logout() {
    store.dispatch({ type: SET_IS_LOADING, isLoading: true });

    try{
        await userService.logout();
        store.dispatch({ type: SET_USER, loggedInUser: null });

    }
    catch(error){
        console.log('user actions -> Cannot logout', error);
        throw error;
    }
    finally{
        store.dispatch({ type: SET_IS_LOADING, isLoading: false });
    }
}

export async function updateUser(userId, details) {
    store.dispatch({ type: SET_IS_LOADING, isLoading: true });

    try{
        const user = await userService.getById(userId);
        await userService.updateUser(user, details);
        store.dispatch({ type: UPDATE_USER, details });
    }catch(error){
        console.log('user actions -> Cannot update', error);
        throw error;
    }
    finally{
        store.dispatch({ type: SET_IS_LOADING, isLoading: false });
    }
}