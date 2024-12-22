const { useEffect, useState } = React
const { useSelector, useDispatch } = ReactRedux;

import {Chart} from '../cmps/Chart.jsx'
import { todoService } from '../services/todo.service.js'

export function Dashboard() {

    const todos = useSelector(storeState => storeState.todoModule.todos);
    const loggedInUser = useSelector(storeState => storeState.userModule.loggedInUser);
    const [importanceStats, setImportanceStats] = useState([])

    useEffect(()=>{
        if(loggedInUser)
            todoService.getImportanceStats(loggedInUser._id)
                .then(setImportanceStats)
    }, [loggedInUser])


    return (
        <section className="dashboard">
            <h1>Dashboard</h1>

            {loggedInUser ?  (
                <div>
                    <h2>Statistics for {todos.length} Todos</h2>
                    <hr />
                    <h4>By Importance</h4>
                    <Chart data={importanceStats}/>
                </div>
            ) : (
                <h3>Can't see dashboard, you are not logged in</h3>
            )}
        </section>
    )
}