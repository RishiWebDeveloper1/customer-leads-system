const Dashboard = () => {
    return (
        <>
            <div className="admin-page-box">

            </div>

            <button onClick={() => { localStorage.removeItem("token"); window.location.href = "/"; }}>
                Logout
            </button>
        </>
    );
};

export default Dashboard;
