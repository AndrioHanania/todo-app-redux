import { updateUser } from "../store/actions/user.actions.js";
import { useEffectUpdate } from "../hooks/useEffectUpdate.jsx";
import { userService } from "../services/user.service.js";

const { useState } = React
const { useSelector } = ReactRedux;

export function UserDetails() {
    const { loggedInUser } = useSelector(storeState => storeState.userModule);
    const [details, setDetails] = useState(loggedInUser ? { ...loggedInUser } : userService.getDefaultPref());

    console.log('UserDetails -> loggedInUser: ', loggedInUser);

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
        </section>
    );
};

export default UserDetails;