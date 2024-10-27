import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import userpool from "../userpool.js";
import { useNavigate } from "react-router-dom";

export const authenticate = (username, password) => {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({
      Username: username,
      Pool: userpool,
    });

    const authDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });
    user.authenticateUser(authDetails, {
      onSuccess: (data) => {
        console.log("onSuccess:", data);
        resolve(data);
      },
      onFailure: (err) => {
        console.error("onFailure:", err);
        reject(err);
      },
    });
  });
};

export const signOut = () => {
    const user = userpool.getCurrentUser();
    user.signOut();
    window.location.href = "/";
};
