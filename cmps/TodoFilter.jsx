import { utilService } from "../services/util.service.js"
import { useEffectUpdate } from "../hooks/useEffectUpdate.jsx"
import { SET_FILTER_BY } from "../store/reducers/todo.reducer.js";

const { useState, useRef } = React
const { useDispatch } = ReactRedux;

export function TodoFilter({ filterBy }) {
    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy });
    const onFilterDebounce = useRef(utilService.debounce(onSetFilter)).current
    const dispatch = useDispatch();

    useEffectUpdate(() => {
        setFilterByToEdit(filterBy)
    }, [filterBy]);

    function onSetFilter(i_filterBy) {
        dispatch({ type: SET_FILTER_BY, filterBy: i_filterBy });
    }
    
    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break

            default: break
        }

        setFilterByToEdit({ ...filterByToEdit, [field]: value })
        onFilterDebounce({ ...filterByToEdit, [field]: value })
    }

    const { txt, importance, status } = filterByToEdit;

    return (
        <section className="todo-filter">
            <h2>Filter Todos</h2>

            <form onSubmit={e => e.preventDefault()}>
                <input value={txt} onChange={handleChange}
                    type="search" placeholder="By Txt" id="txt" name="txt"
                />

                <div>
                    <label htmlFor="importance">Importance: </label>
                    <input value={importance} onChange={handleChange}
                        type="number" id="importance" name="importance"
                        min={1} max={10}
                    />
                </div>

                <div>
                    <label htmlFor="status">Status: </label>
                    <select
                        id="status"
                        name="status"
                        value={status}
                        onChange={handleChange}
                    >
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="done">Done</option>
                    </select>
                </div>
            </form>
        </section>
    )
}