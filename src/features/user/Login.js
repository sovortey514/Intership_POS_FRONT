import { useState } from 'react';
import { Link } from 'react-router-dom';
import LandingIntro from './LandingIntro';
import ErrorText from '../../components/Typography/ErrorText';
import InputText from '../../components/Input/InputText';

function Login() {
    const INITIAL_LOGIN_OBJ = {
        username: "",  
        password: "" 
    };

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);

 

    const submitForm = async (e) => {
        e.preventDefault();
        setErrorMessage(""); // Clear any existing error message
    
        if (loginObj.username.trim() === "" || loginObj.password.trim() === "") {
            return setErrorMessage("Username and password are required!");
        }
    
        if (loginObj.password.trim().length < 8) {
            return setErrorMessage("Password must be at least 8 characters long");
        }
    
        setLoading(true);
        try {
       
            const response = await fetch('http://localhost:6060/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: loginObj.username,
                    password: loginObj.password,
                }),
            });
    
            const data = await response.json();
       
            if (data.statusCode === 200) {
                // Store token and username
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", loginObj.username);
    
                // Fetch user details after login to get userId
                const userResponse = await fetch(`http://localhost:6060/auth/user/${loginObj.username}`, {
                    headers: {
                        "Authorization": `Bearer ${data.token}`,
                        "Content-Type": "application/json"
                    }
                });
    
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    localStorage.setItem("userId", userData.id); // ✅ Store userId
                  
                } else {
                    console.error("❌ Failed to fetch user data after login");
                }
                setTimeout(() => {
                    console.log("🕐 Delayed User ID:", localStorage.getItem("userId"));
                }, 500);
    
                setLoading(false);
                window.location.href = '/app/welcome'; // Redirect to dashboard
            } else {
                setLoading(false);
                setErrorMessage(data.error || "An error occurred during login.");
            }
        } catch (error) {
            setLoading(false);
            setErrorMessage("An error occurred");
            console.error("❌ Login Error:", error);
        }
    };
    

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("");
        setLoginObj({ ...loginObj, [updateType]: value });
  

    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center">
            <div className="card mx-auto w-full max-w-5xl shadow-xl">
                <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
                    <div>
                        <LandingIntro />
                    </div>
                    <div className='py-24 px-10'>
                        <h2 className='text-2xl font-semibold mb-2 text-center'>Login</h2>
                        <form onSubmit={submitForm}>
                            <div className="mb-4">
                                <InputText
                                    type="text"
                                    defaultValue={loginObj.username}
                                    updateType="username"
                                    containerStyle="mt-4"
                                    labelTitle="Username"
                                    placeholder="Enter username"
                                    updateFormValue={updateFormValue}
                                />
                                <InputText
                                    defaultValue={loginObj.password}
                                    type="password"
                                    updateType="password"
                                    containerStyle="mt-4"
                                    labelTitle="Password"
                                    placeholder="Enter password"
                                    updateFormValue={updateFormValue}
                                />
                            </div>
                            <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
                            <button type="submit" className={"btn mt-2 w-full  bg-pink-400 text-white" + (loading ? " loading" : "")}>Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
