'use client'
import React, { useState } from "react";
import axios from 'axios';
import { useRouter } from "next/navigation";
import { useParams} from 'next/navigation'
const ResetPassword = () => {
    const router = useRouter();
  const [password, setPassword] = useState("");
  const {token} = useParams()
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Reset token:", token);  // Log the token

    try {
        const response = await axios.post(`http://localhost:4080/reset-password/${token}`, {
            password
        });
        console.log("Response from server:", response.data);
        if (response.data.status) {
            router.push('/login');
        }
    } catch (err) {
        console.error("Error:", err.response?.data || err.message);
    }
};


  return (
    <div className="sign-up-container">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
    <label htmlFor="password">New Password:</label>
        <input
          type="password"
          placeholder="*****"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Reset</button>
    </form>
    </div>
  );
};

export default ResetPassword;