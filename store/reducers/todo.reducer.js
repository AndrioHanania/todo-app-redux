import { todoService } from "../../services/todo.service.js";

export const SET_TODOS = 'SET_TODOS';
export const REMOVE_TODO = 'REMOVE_TODO';
export const ADD_TODO = 'ADD_TODO';
export const UPDATE_TODO = 'UPDATE_TODO';
export const SET_FILTER_BY = 'SET_FILTER_BY';
export const SET_IS_LOADING = 'SET_IS_LOADING';

const initialState = {
    todos: [],
    total: 0,
    pages: 0,
    filterBy: todoService.getDefaultFilter(),
    isLoading: false,
};

export function todoReducer(state = initialState, cmd = {}) {
    switch (cmd.type) {
        case SET_TODOS:
            return { 
                ...state,
                todos: cmd.todosData.todos,
                total: cmd.todosData.total,//
                pages: cmd.todosData.pages,//
            };
        case REMOVE_TODO:
            return { 
                ...state,
                todos: state.todos.filter(todo => todo._id !== cmd.todoId),
            };
        case ADD_TODO:
            return { 
                ...state,
                todos: [...state.todos, cmd.todo],
            };
        case UPDATE_TODO:
            return { 
                ...state,
                todos: state.todos.map(todo => todo._id === cmd.todo._id ? cmd.todo : todo),
            };
        case SET_FILTER_BY:
            return { 
                ...state,
                filterBy: { 
                    ...state.filterBy, 
                    ...cmd.filterBy,
                    pagination: { 
                        ...cmd.filterBy.pagination
                    },
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
}