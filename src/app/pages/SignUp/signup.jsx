"use client";
import React,{useState} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useSession } from "next-auth/react";
function SignUp()  {
  const {data:session} = useSession()
  const router = useRouter();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const handleSignUp = async(e) => {
    e.preventDefault();
    try {
    const response = await axios.post("http://localhost:4080/signup", {
        name,
        email,
        password,
      }) .then(result=>{console.log(result)     
    setName('');
    setEmail('');
    setPassword('');
  router.push('/login')
    })

    } catch (err) {
      console.log(err);
    }

   
  };
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-lg p-10 max-w-md w-full space-y-8">
        <h2 className="text-left text-3xl font-extrabold text-red-800">
          Register
        </h2>
        <form onSubmit={handleSignUp}>
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block text-xl font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter Your Name"
              className="mt-1 block w-full px-4 py-3 border border-gray-700 rounded-lg shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e)=>setName(e.target.value)}
              value={name}
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-xl font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter Your Email"
              className="mt-1 block w-full px-4 py-3 border border-gray-700 rounded-lg shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e)=>setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-xl font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter Your Password"
              className="mt-1 block w-full px-4 py-3 border border-gray-700 rounded-lg shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e)=>setPassword(e.target.value)}
              value={password}
            />
          </div>
          <button
            type="submit"
            className="bg-black text-white w-full py-3 rounded-lg mb-8 mt-5"
          >
            SignUp
          </button>
          <p className="mb-5">
            <span className="inline-block mr-3">Already have an account?</span>
            <Link
              href="/login"
              className="bg-black text-white w-full px-3 py-3 rounded-lg mt-4"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
