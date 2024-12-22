import { TodoPreview } from "./TodoPreview.jsx"
const { Link } = ReactRouterDOM

const colors = [
    '#00FF00',
    '#40FF00', 
    '#80FF00', 
    '#BFFF00', 
    '#FFFF00',
    '#FFD700', 
    '#FFA500', 
    '#FF7F50', 
    '#FF4500', 
    '#FF0000'
];

export function TodoList({ todos, onRemoveTodo, onToggleTodo }) {

    if(todos.length === 0) {
        return (
            <h2>No todos yet, add one!</h2>
        );
    }   

    return (
        <ul className="todo-list">
            {todos.map(todo =>
                <li key={todo._id} style={{ backgroundColor: colors[todo.importance - 1]}}>
                    <TodoPreview todo={todo} onToggleTodo={()=>onToggleTodo(todo)}/>
                    <section>
                        <button onClick={() => onRemoveTodo(todo._id)}>Remove</button>
                        <button><Link to={`/todo/${todo._id}`}>Details</Link></button>
                        <button><Link to={`/todo/edit/${todo._id}`}>Edit</Link></button>
                    </section>
                </li>
            )}
        </ul>
    )
}