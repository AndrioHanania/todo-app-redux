
export function Loader({ isLoading, text = 'Loading...' }) {
    if (!isLoading) return null;

    return (
        <div className="loader-container">
            <div className="spinner"></div>
            <p className="loader-text">{text}</p>
        </div>
    );    
};