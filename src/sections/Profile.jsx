import axios from "axios";
import React, { useEffect, useState } from "react";
import SurgeonProfile from "./SurgeonProfile";

const Profile = () => {
  const [user, setUser] = useState(null); // Initialize as null to show a loading state

  useEffect(() => {
    const username = localStorage.getItem("username");
    axios
      .get(`http://localhost:3000/surgeons/${username}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log("Error fetching user data:", err);
      });
  }, []);

  return (
    <div>
      {user ? (
        <SurgeonProfile surgeonData={user} />
      ) : (
        <p className="text-center text-gray-500">Loading Profile...</p>
      )}
    </div>
  );
};

export default Profile;
