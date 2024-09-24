import React from 'react';



function Logout() {

    const handleLogout = () => {
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('expirationTime');
        sessionStorage.clear();
        
        window.location.reload();
    }

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
}

export default Logout;