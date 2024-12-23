import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'
import { userService } from './user.service.js'

const TODO_KEY = 'todoDB'
_createTodos()

export const todoService = {
    query,
    get,
    remove,
    save,
    getEmptyTodo,
    getDefaultFilter,
    getFilterFromSearchParams,
    getImportanceStats,
    updateProgressToUser,
    updateBalanceToUser,
}
// For Debug (easy access from console):
window.cs = todoService

function query(filterBy = {}) {
    return storageService.query(TODO_KEY)
        .then(todos => {

            if(filterBy.userId) {
                todos = todos.filter(todo => todo.userId === filterBy.userId)
            }

            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                todos = todos.filter(todo => regExp.test(todo.txt))
            }

            if (filterBy.importance) {
                todos = todos.filter(todo => todo.importance >= filterBy.importance)
            }

            switch (filterBy.status) {
                case 'done':
                    todos = todos.filter(todo => todo.isDone)
                    break
                case 'active':
                    todos = todos.filter(todo => !todo.isDone)
                    break
            }

            if(filterBy.pagination) {
                const total = todos.length;
                const skip = (filterBy.pagination.page - 1) * filterBy.pagination.pageSize;
                todos = todos.slice(skip, skip + filterBy.pagination.pageSize)

                return { 
                    todos,
                    total,
                    pages: Math.ceil(total / filterBy.pagination.pageSize)
                };
            }
            else
                return todos;
        });
}

function get(todoId) {
    return storageService.get(TODO_KEY, todoId)
        .then(todo => {
            todo = _setNextPrevTodoId(todo)
            return todo
        })
}

async function updateProgressToUser(user) {
    try{
        const todos = await query({ userId: user.id });
        const totalTodos = todos.length;
        const completedTodos = todos.filter((todo) => todo.isDone).length;
        return userService.updateProgress(user, (completedTodos / totalTodos) * 100);
    }
    catch(error){
        console.error('err:', error);
        throw error;
    }
}

async function updateBalanceToUser(user) {
    try{
        return userService.updateBalance(user);
    }
    catch(error){
        console.error('err:', error);
        throw error;
    }
}

function remove(todoId) {
    return storageService.remove(TODO_KEY, todoId)
}

function save(todo) {
    if (todo._id) {
        todo.updatedAt = Date.now()
        return storageService.put(TODO_KEY, todo)
    } else {
        todo.createdAt = todo.updatedAt = Date.now()

        return storageService.post(TODO_KEY, todo)
    }
}

function getEmptyTodo(txt = '', importance = 5) {
    return { txt, importance, isDone: utilService.getRandomBoolean() }
}

function getDefaultFilter(userId) {
    return { txt: '', importance: 0, status: 'all', userId, pagination: { page: 1, pageSize: 5 } }
}

function getFilterFromSearchParams(searchParams) {
    const defaultFilter = getDefaultFilter()
    const filterBy = {}
    for (const field in defaultFilter) {
        filterBy[field] = searchParams.get(field) || defaultFilter[field]; 
    }
    return filterBy
}


function getImportanceStats(userId) {
    return query({ userId })
        .then(todos => {
            const todoCountByImportanceMap = _getTodoCountByImportanceMap(todos)
            const data = Object.keys(todoCountByImportanceMap).map(speedName => ({ title: speedName, value: todoCountByImportanceMap[speedName] }))
            return data
        })

}

async function _createTodos() {
    const users = await userService.query();
    let todos = utilService.loadFromStorage(TODO_KEY)
    if (!todos || !todos.length) {
        todos = []
        const txts = ['Learn React', 'Master CSS', 'Practice Redux']

        for (const user of users) {
            for (let i = 0; i < 20; i++) {
                const txt = txts[utilService.getRandomIntInclusive(0, txts.length - 1)]
                todos.push(_createTodo(txt + (i + 1), utilService.getRandomIntInclusive(1, 10), user._id))
            }

            const countDoneTodos = todos.filter((todo) => todo.isDone).length;
            const progress = (countDoneTodos / todos.length) * 100;
                await userService.updateProgress(user, progress)
                await userService.updateBalance(user)
        };

        utilService.saveToStorage(TODO_KEY, todos)
    }
}

function _createTodo(txt, importance, userId) {
    const todo = getEmptyTodo(txt, importance)
    todo._id = utilService.makeId()
    todo.createdAt = todo.updatedAt = Date.now() - utilService.getRandomIntInclusive(0, 1000 * 60 * 60 * 24)
    todo.userId = userId
    return todo
}

function _setNextPrevTodoId(todo) {
    return storageService.query(TODO_KEY).then((todos) => {
        const todoIdx = todos.findIndex((currTodo) => currTodo._id === todo._id)
        const nextTodo = todos[todoIdx + 1] ? todos[todoIdx + 1] : todos[0]
        const prevTodo = todos[todoIdx - 1] ? todos[todoIdx - 1] : todos[todos.length - 1]
        todo.nextTodoId = nextTodo._id
        todo.prevTodoId = prevTodo._id
        return todo
    })
}

function _getTodoCountByImportanceMap(todos) {
    const todoCountByImportanceMap = todos.reduce((map, todo) => {
        if (todo.importance < 3) map.low++
        else if (todo.importance < 7) map.normal++
        else map.urgent++
        return map
    }, { low: 0, normal: 0, urgent: 0 })
    return todoCountByImportanceMap
}


// Data Model:
// const todo = {
//     _id: "gZ6Nvy",
//     txt: "Master Redux",
//     importance: 9,
//     isDone: false,
//     createdAt: 1711472269690,
//     updatedAt: 1711472269690
// }

