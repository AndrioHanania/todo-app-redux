import { todoService } from '../../services/todo.service.js';
import { userService } from '../../services/user.service.js';
import { SET_TODOS, SET_IS_LOADING, ADD_TODO, REMOVE_TODO, UPDATE_TODO } from '../reducers/todo.reducer.js';
import { UPDATE_PROGRESS, UPDATE_BALANCE } from '../reducers/user.reducer.js';
import { store } from '../store.js';

export async function loadTodos() {
    store.dispatch({ type: SET_IS_LOADING, isLoading: true });

    const filterBy = store.getState().todoModule.filterBy;
    const loggedInUser = store.getState().userModule.loggedInUser;
    filterBy.userId = loggedInUser ? loggedInUser._id : null;
    const todosData = await todoService.query(filterBy);

    try{
        if(loggedInUser)
            store.dispatch({ type: SET_TODOS, todosData });
    }
    catch(error){
        console.log('todo action -> Cannot load todos', error);
        throw error;
    }
    finally{
        store.dispatch({ type: SET_IS_LOADING, isLoading: false });
    }
}

export async function removeTodo(todoId) {
    store.dispatch({ type: SET_IS_LOADING, isLoading: true });

    const todo = await todoService.getById(todoId);
    await todoService.remove(todoId);
    const user = await userService.getById(todo.userId);
    const savedUser = await todoService.updateProgressToUser(user);

    try{
        store.dispatch({ type: REMOVE_TODO, todoId })
        store.dispatch({ type: UPDATE_PROGRESS, progress: savedUser.progress });
    }
    catch(error){
        console.log('todo action -> Cannot remove todo', error);
        throw error;
    }
    finally{
        store.dispatch({ type: SET_IS_LOADING, isLoading: false });
    }
}

export async function saveTodo(todo) {
    store.dispatch({ type: SET_IS_LOADING, isLoading: true });

    const type = todo._id ? UPDATE_TODO : ADD_TODO;
    const savedTodo = await todoService.save(todo);
    const user = await userService.getById(savedTodo.userId);
    let savedUser = await todoService.updateProgressToUser(user);
    if(todo.isDone)
        savedUser = await todoService.updateBalanceToUser(user);

    try{
        store.dispatch({ type, todo: savedTodo });
        store.dispatch({ type: UPDATE_PROGRESS, progress: savedUser.progress });
        store.dispatch({ type: UPDATE_BALANCE, balance: savedUser.balance });
        return savedTodo;
    }
    catch(error){
        console.log('todo action -> Cannot save todo', error);
        throw error;
    }
    finally{
        store.dispatch({ type: SET_IS_LOADING, isLoading: false });
    }
}