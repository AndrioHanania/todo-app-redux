import { userService } from '../services/user.service.js'

const { useSelector } = ReactRedux;

export const CanvasColor = ({ children }) => {
        const defaultPref = userService.getDefaultPref();
        const bgColor = useSelector(storeState => 
            storeState.userModule.loggedInUser ? storeState.userModule.loggedInUser.bgColor : defaultPref.bgColor);
        const color = useSelector(storeState => 
            storeState.userModule.loggedInUser ? storeState.userModule.loggedInUser.color : defaultPref.color);
        const colorStyle = { backgroundColor: bgColor, color: color};

    return (
        <section style={{ ...colorStyle, height: '100vh', overflow: 'auto' }}>
            { children }
        </section>
    );
};
