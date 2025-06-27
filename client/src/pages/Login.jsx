import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            console.log('1')
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/login`,
                { email, password }
            );
            console.log('2')
            
            localStorage.setItem("token", res.data.token);
            
            const role = res.data.role;
            console.log(role)
            if (role === "SuperAdmin") {navigate("/admin"); console.log('3');}
            else if (role === "SubAdmin") {navigate("/subadmin"); console.log('4');}
            else if (role === "Agent") {navigate("/agent"); console.log('5');}
            else navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };


    return (
        <>
            <div className="login-container">
                <form onSubmit={handleLogin} className="login-form">
                    <h2>Login</h2>
                    {error && <p className="error-msg">{error}</p>}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
            </div>
        </>
    )
}

export default Login
