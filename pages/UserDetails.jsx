import { updateUser } from "../store/actions/user.actions.js";
import { useEffectUpdate } from "../hooks/useEffectUpdate.jsx";
import { userService } from "../services/user.service.js";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"

const { useState, useEffect } = React
const { useSelector } = ReactRedux;

export function UserDetails() {
    const loggedInUser = useSelector(storeState => storeState.userModule.loggedInUser);
    const [details, setDetails] = useState(loggedInUser ? { ...loggedInUser } : userService.getDefaultPref());
    const [activities, setActivities] = useState([]);

    async function loadActivities() {
        try{
            const user = await userService.getById(loggedInUser._id);
            console.log('user.activities: ', user.activities);
            if(user.activities)
                setActivities(user.activities);
        }catch(error){
            showErrorMsg('Cannot load activities');
            console.log('Cannot load activities err:', error);
        }
    }

    useEffect(() => {
        if(loggedInUser)
            loadActivities();
    }, [loggedInUser])

    useEffectUpdate(() => {
        updateUser(loggedInUser._id, details);
    }, [details]);

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

            default:
                break
        }

        setDetails(prevDetails => ({ ...prevDetails, [field]: value }))
    }

    function timeAgo(timestamp) {
        const now = new Date();
        const activityDate = new Date(timestamp);
        const diffInSeconds = Math.floor((now - activityDate) / 1000);
    
        const units = [
            { label: "year", seconds: 31536000 },
            { label: "month", seconds: 2592000 },
            { label: "week", seconds: 604800 },
            { label: "day", seconds: 86400 },
            { label: "hour", seconds: 3600 },
            { label: "minute", seconds: 60 },
            { label: "second", seconds: 1 },
        ];
    
        for (const unit of units) {
            const count = Math.floor(diffInSeconds / unit.seconds);
            if (count > 0) {
                return `${count} ${unit.label}${count > 1 ? "s" : ""} ago`;
            }
        }
    
        return "just now";
    }
    

    return (
        <section className="user-index" style={{ color: details.color, backgroundColor: details.bgColor }}>
            <h1>User Details</h1>
            {!loggedInUser && <h2>Can't see user details, you are not logged in</h2>}
            {loggedInUser && (
                <form>
                    <div>
                        <label htmlFor="bgColor">bgColor: </label>
                        <input
                            id="bgColor"
                            name="bgColor"
                            type="color"
                            value={details.bgColor}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="color">color: </label>
                        <input
                            id="color"
                            name="color"
                            type="color"
                            value={details.color}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="fullname">color: </label>
                        <input
                            id="fullname"
                            name="fullname"
                            type="text"
                            value={details.fullname}
                            onChange={handleChange}
                        />
                    </div>
                </form>
            )}
            {loggedInUser && (
                <ul className="activities">
                    {activities.map((activity, idx) => (
                        <li className="activity" key={`activity-${idx}`}>
                            {timeAgo(activity.at)} | {activity.text}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default UserDetails;