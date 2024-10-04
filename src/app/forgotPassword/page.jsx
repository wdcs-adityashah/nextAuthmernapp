'use client'
import React, { useState } from "react";
import axios from 'axios';
import { useRouter } from "next/navigation";
const ForgotPassword = () => {
    const router = useRouter();
  const [email, setEmail] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post('http://localhost:4080/forgot-password',{
    email,
    }).then(response=>{
      if(response.data.status){
        alert("check your email for reset password link");
        router.push('/login')
      }
    }).catch(err=>{
        console.log(err);
    })
  };

  return (
    <div className="sign-up-container">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
    <label htmlFor="email">Email:</label>
        <input
          type="email"
          autoComplete="off"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <button type="submit">Send</button>
    </form>
    </div>
  );
};

export default ForgotPassword;