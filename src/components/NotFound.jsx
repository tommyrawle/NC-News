import React from 'react';
import './NotFound.css'

const NotFound = ({path, location}) => {
    return (
        <div className="error-container">
            <div className="error">
                {(path && 
                <div>
                <h1>Oops!</h1>
                <h3>It seems you took a wrong turn.</h3>
                <h1 className="code">{location.state.errCode}</h1>
                <p className="message">{location.state.errMsg}</p>
                </div>) 
                || 
                <div>
                <h1>Oops!</h1>
                <h3>It seems you took a wrong turn.</h3>
                <h1 className="code">404</h1>
                <p className="message">Page Not Found</p>
                </div>}
                <button onClick={() => {window.history.back()}}><i className="fa fa-chevron-left" aria-hidden="true"></i>Head Back</button>
            </div>
        </div>
    );
};

export default NotFound;