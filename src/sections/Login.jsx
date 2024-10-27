import axios from "axios";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authenticate } from "../service/authenticate.js";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const validateFields = useCallback(() => {
    if (!username || !password) {
      setError("Username and password are required");
      setTimeout(() => setError(null), 3000); // Clear error after 3 seconds
      return false;
    }
    return true;
  }, [password, username]);

  const signIn = useCallback(async () => {
    if (!validateFields()) return;

    authenticate(username, password).then(
      (data) => {
        console.log("Hi")
              navigate("/");
      },
      (err) => {
        console.log(err);
      }
    );

    // try {

    //   console.log('User signed in:', user);
    // } catch (error) {
    //   console.error('Error signing in', error);
    // }
  }, [password, username, validateFields]);

  //   const getToken = async () => {
  //     const session = await Auth.currentSession();
  //     const token = session.getIdToken().getJwtToken();
  //     return token;
  //   };

  const handleLogin = useCallback(() => {
    // if (!validateFields()) return;
    // Get JWT token for requests
    // axios
    //   .post("http://localhost:3000/login/", { username, password })
    //   .then((res) => {
    //     if (res.data.login) {
    //       navigate("/");
    //       localStorage.setItem("role", res.data.role);
    //       localStorage.setItem("username", username);
    //       localStorage.setItem("isLogin", res.data.login);
    //     }
    //   })
    //   .catch((err) => {
    //     if (err.response && err.response.status === 401) {
    //       setError(err.response.data.error || "Login failed");
    //       setTimeout(() => setError(null), 3000); // Clear error after 3 seconds
    //     } else {
    //       console.log(err);
    //     }
    //   });
  }, [navigate, password, username, validateFields]);

  return (
    <div className="flex flex-col justify-center items-center h-[90vh]">
      <div className="flex flex-col gap-4 justify-center items-center shadow-md border border-red-900 p-6 rounded-sm">
        <div className="flex items-center gap-4">
          <label>Username: </label>
          <input
            type="text"
            value={username}
            className="p-2 text-red-900"
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter Username"
          />
        </div>
        <div className="flex items-center gap-4">
          <label>Password: </label>
          <input
            type="password"
            value={password}
            className="p-2 text-red-900"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
          />
        </div>
        {error && <div className="text-red-700 text-sm mt-2">{error}</div>}
        <button
          type="button"
          className="bg-red-700 px-4 py-2 text-white hover:bg-red-900"
          onClick={signIn}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
