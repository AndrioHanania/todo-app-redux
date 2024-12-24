const { useEffect, useState } = React
const { Link, NavLink } = ReactRouterDOM
const { useSelector, useDispatch } = ReactRedux

import { UserMsg } from "./UserMsg.jsx"
import { LoginSignup } from './LoginSignup.jsx'
import { showErrorMsg } from '../services/event-bus.service.js'
import { logout } from '../store/actions/user.actions.js'
import { UPDATE_BALANCE, UPDATE_PROGRESS } from "../store/reducers/user.reducer.js";
import { userService } from "../services/user.service.js"

export function AppHeader() {
    const loggedInUser = useSelector(storeState => storeState.userModule.loggedInUser)
    const progress = useSelector(storeState => storeState.userModule.progress)
    const balance = useSelector(storeState => storeState.userModule.balance)
    const dispatch = useDispatch();

    async function updateInfo() {
        if (loggedInUser) {
            const user = await userService.getById(loggedInUser._id);
            dispatch({ type: UPDATE_PROGRESS, progress: parseFloat(user.progress) });
            dispatch({ type: UPDATE_BALANCE, balance: parseInt(user.balance) });
        }
        else {
            dispatch({ type: UPDATE_PROGRESS, progress: 0 });
            dispatch({ type: UPDATE_BALANCE, balance: 0 });
        }
    }

    useEffect(() => {
        updateInfo();
    }, [loggedInUser])

    function onLogout() {
        try{
            logout();
        }
        catch(error){
            showErrorMsg('OOPs try again')
        }
    }

    return (
        <header className="app-header full main-layout">
            <section className="header-container">
                <h1>React Todo App</h1>

                <nav className="app-nav">
                    <NavLink to="/" >Home</NavLink>
                    <NavLink to="/about" >About</NavLink>
                    <NavLink to="/todo" >Todos</NavLink>
                    <NavLink to="/dashboard" >Dashboard</NavLink>
                    <NavLink to="/user" >User Details</NavLink>
                </nav>
            </section>

            {loggedInUser ? (
                < section >
                    <Link to={`/user/${loggedInUser._id}`}>Hello {loggedInUser.fullname}</Link>
                    <button onClick={onLogout}>Logout</button>
                    <div className="progress-bar">
                        <label htmlFor="progress">Progress Bar:</label>
                        <input
                            type="range"
                            id="progress"
                            min="0"
                            max="100"
                            step="0.01"
                            value={progress}
                            disabled={true}
                        />
                    </div>
                    <span>Balance: {balance}</span>
                </ section >
            ) : (
                <section>
                    <LoginSignup />
                </section>
            )}

        <UserMsg />
        </header>
    )
}
