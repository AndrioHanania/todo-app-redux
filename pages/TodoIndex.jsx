import { TodoFilter } from "../cmps/TodoFilter.jsx"
import { TodoList } from "../cmps/TodoList.jsx"
import { DataTable } from "../cmps/data-table/DataTable.jsx"
import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { loadTodos, removeTodo, saveTodo } from "../store/actions/todo.actions.js";
import { SET_FILTER_BY } from "../store/reducers/todo.reducer.js";
import { useEffectUpdate } from "../hooks/useEffectUpdate.jsx"
import { utilService } from "../services/util.service.js"
import { Loader } from "../cmps/Loader.jsx"

const { useEffect } = React
const { Link, useSearchParams } = ReactRouterDOM
const { useSelector, useDispatch } = ReactRedux;

export function TodoIndex() {
    const { todos, isLoading } = useSelector(storeState => storeState.todoModule);
    const [searchParams, setSearchParams] = useSearchParams();
    const filterBy = useSelector(storeState => storeState.todoModule.filterBy);
    const loggedInUser = useSelector(storeState => storeState.userModule.loggedInUser);
    const dispatch = useDispatch();

    useEffect(() => {
        const defaultFilter = todoService.getFilterFromSearchParams(searchParams)
        dispatch({ type: SET_FILTER_BY, filterBy: defaultFilter });
    }, []);

    useEffectUpdate(() => {
        setSearchParams(utilService.getTruthyValues(filterBy));
    }, [filterBy, loggedInUser]);

    useEffect(() => {
        try{
            loadTodos();
        }
        catch(error){
            console.eror('err:', err);
            showErrorMsg('Cannot load todos');
        }
    }, [searchParams]);

    async function onRemoveTodo(todoId) {
        if (!confirm(`Are you sure you want to delete the todo with is of "${todoId}"?`)) 
            return;
        
        try{
            await removeTodo(todoId);
            showSuccessMsg(`Todo removed`);
        }
        catch(error){
            console.log('err:', err);
            showErrorMsg('Cannot remove todo ' + todoId);
        }     
    }

    async function onToggleTodo(todo) {
        const todoToSave = { ...todo, isDone: !todo.isDone };

        try{
            const savedTodo = await saveTodo(todoToSave);
            showSuccessMsg(`Todo is ${(savedTodo.isDone)? 'done' : 'back on your list'}`);
        }
        catch(error){
            console.log('err:', error);
            showErrorMsg('Cannot toggle todo ' + todoId);
        }
    }

    if (!todos || !filterBy) return <div>Loading...</div>
    return (
        <section className="todo-index">
            <TodoFilter filterBy={filterBy}/>
            <div>
                <Link to="/todo/edit" className="btn" >Add Todo</Link>
            </div>
    
            {loggedInUser && (
                <section>
                    <h2>Todos List</h2>
                {!isLoading && <TodoList todos={todos} onRemoveTodo={onRemoveTodo} onToggleTodo={onToggleTodo} />}
                <Loader isLoading={isLoading} text="Loading todos..."/>
                </section>
            )}

            {loggedInUser && (
                <section>
                    <hr />
                    <h2>Todos Table</h2>
                    <div style={{ width: '60%', margin: 'auto' }}>
                        {!isLoading && <DataTable todos={todos} onRemoveTodo={onRemoveTodo} />}
                        <Loader isLoading={isLoading} text="Loading todos..."/>
                    </div>
                </section>
            )}
            
            {!loggedInUser && (
                <section>
                    <h3>
                        Can't see todos if not logged in
                    </h3>
                </section>
            )}
        </section>
    )
}