import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {

   const[emailId , setEmailId] = useState("vikaskumar280204@gmail.com");
   const[password , setPassword] = useState("Vikas@123");
   const dispatch = useDispatch();
   const navigate = useNavigate();

   
   const handleLogin = async () => { 

     try{
       const response = await axios.post(
         BASE_URL +"/login",
         {
          emailId,
          password,
         },
         {withCredentials:true}
        ); 
      //  console.log("Login Response:", response.data);
       dispatch(addUser(response.data) );
       return navigate("/");
     }
     catch(err){
      console.error(err);
     }
   };

    return (
      <div className="flex justify-center my-10">
        <div className="card w-96 bg-base-300 shadow-xl">
          <div className="card-body">
            <h2 className="card-title justify-center">Login</h2>
            <div>

              <label className="form-control w-full max-w-xs my-2">
                <div className="label">
                  <span className="label-text">Email ID:</span>
                </div>
                <input
                  type="text"
                  value ={emailId}
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => setEmailId(e.target.value)}
                />
              </label>

              <label className="form-control w-full max-w-xs my-2">
                <div className="label">
                  <span className="label-text">Password:</span>
                </div>
                <input
                  type="text"
                  value = {password}
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </div>

            <div className="card-actions justify-center m-2">
              <button className="btn btn-primary" onClick={handleLogin}>Login</button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Login;
  