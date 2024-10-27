import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import userpool from "../userpool.js";

const Signup = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ email: "", password: "" });


  const handleSignup = useCallback(() => {

    const attributeList = [
      new CognitoUserAttribute({
        Name: "email",
        Value: username,
      }),
      new CognitoUserAttribute({
        Name: "custom:role",
        Value: "surgeon",
      }),
    ];

    userpool.signUp(username, password, attributeList, null, (err, data) => {
      if (err) {
        console.error(err);
        alert("Couldn't sign up");
      } else {
        console.log(data);
        alert("User added successfully");
        navigate("/dashboard");
      }
    });
  }, [username, password, navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-[90vh]">
      <div className="flex flex-col gap-4 justify-center items-center shadow-md border border-blue-500 p-6 rounded-sm">
        <div className="flex flex-col gap-2">
          <label>USername:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="p-2 border border-gray-300 rounded"
          />
          {error.email && <span className="text-red-500">{error.email}</span>}
        </div>
        <div className="flex flex-col gap-2">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            className="p-2 border border-gray-300 rounded"
          />
          {error.password && (
            <span className="text-red-500">{error.password}</span>
          )}
        </div>
        <button
          type="button"
          className="bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 rounded"
          onClick={handleSignup}
        >
          Signup
        </button>
      </div>
    </div>
  );
};

export default Signup;
