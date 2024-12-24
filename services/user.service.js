import { storageService } from "./async-storage.service.js"
import { utilService } from "./util.service.js"


export const userService = {
    getLoggedinUser,
    login,
    logout,
    signup,
    getById,
    query,
    getEmptyCredentials,
    updateProgress,
    updateBalance,
    updateUser,
    getDefaultPref,
}
const STORAGE_KEY_LOGGEDIN = 'user'
const STORAGE_KEY = 'userDB'

_createUsers()

function query() {
    return storageService.query(STORAGE_KEY)
}

function getById(userId) {
    return storageService.get(STORAGE_KEY, userId)
}

function login({ username, password }) {
    return storageService.query(STORAGE_KEY)
        .then(users => {
            const user = users.find(user => user.username === username & user.password === password)
            if (user) return _setLoggedinUser(user)
            else return Promise.reject('Invalid login')
        })
}

function signup({ username, password, fullname }) {
    const user = { username, password, fullname }
    user.createdAt = user.updatedAt = Date.now()
    user.progress = '0%';
    user.balance = '0';
    user.pref = getDefaultPref();
    return storageService.post(STORAGE_KEY, user)
        .then(_setLoggedinUser)
}

function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN)
    return Promise.resolve()
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN))
}

function _setLoggedinUser(user) {
    const userToSave = { _id: user._id, fullname: user.fullname, bgColor: user.pref.bgColor, color: user.pref.color }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(userToSave))
    return userToSave
}

function getEmptyCredentials() {
    return {
        fullname: '',
        username: 'user1',
        password: '1234',
    }
}

function updateProgress(user, progress) {
    user.progress = progress
    user.updatedAt = Date.now()
    user.activities.push({text: "Update user progress", at: Date.now()})
    return storageService.put(STORAGE_KEY, user)
}

function updateBalance(user) {
    user.balance = user.balance + 10;
    user.updatedAt = Date.now()
    user.activities.push({text: "Update user balance", at: Date.now()})
    return storageService.put(STORAGE_KEY, user)
}

function updateUser(user, details) {
    user.pref = { bgColor: details.bgColor, color: details.color }
    user.fullname = details.fullname
    user.updatedAt = Date.now()
    user.activities.push({text: "Update user details", at: Date.now()})
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify({ _id: user._id, ...details }))
    return storageService.put(STORAGE_KEY, user)
}

function _createUsers(){
    let users = utilService.loadFromStorage(STORAGE_KEY);
    if (!users || !users.length) {
        users = [];

        for(let i = 1; i <= 60; i++) {
            users.push({
                username: `user${i}`,
                password: '1234', 
                fullname: `user${i} fullname`,
                progress: '0%',
                balance: '0',
                activities: [{text: "Create a demo user", at: Date.now()}],
                pref: getDefaultPref(),
                updatedAt: Date.now(),
                updatedAt:  Date.now(),
                _id: utilService.makeId(),
            });
        }

        utilService.saveToStorage(STORAGE_KEY, users);
    }
}

function getDefaultPref() {
    return {
        fullname: '',
        bgColor: '#FAEBD7',
        color: '#1F1F1F',
    };
}