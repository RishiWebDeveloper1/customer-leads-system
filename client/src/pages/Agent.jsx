import React from 'react'
import AllLeads from './AllLeads'

const Agent = () => {
    return (
        <div>
            <div className="logout-button-box">
                <button className="logout-button" onClick={() => { localStorage.removeItem("token"); window.location.href = "/"; }}>
                    Logout
                </button>
            </div>
            <AllLeads />
        </div>
    )
}

export default Agent
