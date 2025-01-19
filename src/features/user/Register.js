import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LandingIntro from "./LandingIntro";
import ErrorText from "../../components/Typography/ErrorText";
import InputText from "../../components/Input/InputText";

function Register() {
  const INITIAL_REGISTER_OBJ = {
    name: "",
    username: "",
    password: "",
    role: "",
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [registerObj, setRegisterObj] = useState(INITIAL_REGISTER_OBJ);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // const validRoles = ["Admin", "User", "Moderator"]; // Adjust as needed

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const { name, username, password, role } = registerObj;

    // if (!name.trim()) {
    //   return setErrorMessage("Name is required!");
    // }
    // if (!email.trim()) {
    //   return setErrorMessage("Email is required!");
    // }
    // if (!emailRegex.test(email.trim())) {
    //   return setErrorMessage("Invalid email format!");
    // }
    // if (!password.trim()) {
    //   return setErrorMessage("Password is required!");
    // }
    // if (password.trim().length < 6) {
    //   return setErrorMessage("Password must be at least 6 characters long!");
    // }
    // if (!role.trim()) {
    //   return setErrorMessage("Role is required!");
    // }
    // if (!validRoles.includes(role.trim())) {
    //   return setErrorMessage("Invalid role selected!");
    // }

    setLoading(true);
    try {
      // const result = await response.json();
      const response = await fetch('http://localhost:6060/auth/signup', {
        method: 'POST',
        headers:  { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          name: registerObj.name,
          username: registerObj.username,
          password: registerObj.password,
          role: registerObj.role
        }),
      });

      console.log({response})

      const responseData = await response.json();
      if (response.ok) {
        if (responseData.statusCode === 200) {
          navigate('/login');
        } else {
          setErrorMessage(responseData.message || "Registration failed");
        }
      } else {
        setErrorMessage(responseData.message || "Registration failed");
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log( "onchange", e);
    setRegisterObj((prev) => ({ ...prev, [name]: value }));
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setRegisterObj({ ...registerObj, [updateType]: value });
    console.log("registerObj ", registerObj )

};

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4 text-center">Create</h2>
      <form onSubmit={submitForm} className="space-y-4">
        <InputText
          updateType="name"
          defaultValue={registerObj.name}
          labelTitle="Name"
          updateFormValue={updateFormValue}
        />
        <InputText
          
          type="text"
          updateType="username"
          defaultValue={registerObj.username}
          labelTitle="username"
          updateFormValue={updateFormValue}
        />
        <InputText
          
          type="password"
          updateType="password"
          defaultValue={registerObj.password}
          labelTitle="Password"
          updateFormValue={updateFormValue}
        />
        <InputText
          updateType="role"
          defaultValue={registerObj.role}
          labelTitle="Role"
          updateFormValue={updateFormValue}
        />
        <ErrorText>{errorMessage}</ErrorText>
        <button
          type="submit"
          className={`btn w-full bg-yellow-500 hover:bg-yellow-200 text-white hover:text-black ${loading ? "loading" : ""}`}
        >
          Create
        </button>
        <div className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login">
            <span className="inline-block hover:text-primary hover:underline">
              Login
            </span>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
