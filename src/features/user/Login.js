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

       // Check if username or password fields are empty
       if (loginObj.username.trim() === "" || loginObj.password.trim() === "") {
        return setErrorMessage("Username and password are required!");
    }

    // Check if password length is sufficient
    if (loginObj.password.trim().length < 6) {
        return setErrorMessage("Password must be at least 6 characters long");
    }

        // Check if password length is sufficient
        if (loginObj.password.trim().length < 8) {
            return setErrorMessage("Password must be at least 6 characters long");
        }

        setLoading(true);
        try {
            console.log("jbudhugfed")
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
            console.log(data);
            if (data.statusCode ===200) {
                localStorage.setItem("token", data.token);
                const user = JSON.parse(localStorage.getItem("user"));
                localStorage.setItem("username", loginObj.username);
     
                console.log("Retrieved User Data:", user);

                setLoading(false);
                window.location.href = '/app/welcome';
            } else {
                setLoading(false);
                setErrorMessage(data.error || "An error occurred during login.");
            }
        } catch (error) {
            setLoading(false);
            setErrorMessage("An error occurred");
        }
    };

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("");
        setLoginObj({ ...loginObj, [updateType]: value });
    console.log("registerObj ", loginObj )

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
                                    updateFormValue={updateFormValue}
                                />
                                <InputText
                                    defaultValue={loginObj.password}
                                    type="password"
                                    updateType="password"
                                    containerStyle="mt-4"
                                    labelTitle="Password"
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
