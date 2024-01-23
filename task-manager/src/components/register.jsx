import React,{useState} from 'react'
import "./mix.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import {NavLink,useNavigate} from 'react-router-dom'

const Register = (()=>{
    const [passShow,setpassShow] = useState(false);
    const [cpassShow,setcpassShow] = useState(false);

    const [inpval,setinpval] = useState({
        name: "",
        email: "",
        password: ""
    });
    // console.log(inpval);
    const history = useNavigate();
    const setVal = (e)=>{
        // console.log(e.target.value);
        const {name,value} = e.target;
        setinpval(()=>{
            return {
                ...inpval,
                [name]:value
            }
        })
    };

    const checkvaidation = async(e)=>{
        e.preventDefault()
        const {name,email,password} = inpval;
        if(name==""){
            toast.warning("Please enter your name", {
                position: "top-center"
            });
        }
        else if(email==""){
            toast.error("Please enter your email", {
                position: "top-center"
            });
        }
        else if(!email.includes("@")){
            toast.warning("Please enter valid email", {
                position: "top-center"
            });
        }
        else if(password==""){
            toast.error("password is required!", {
                position: "top-center"
            });
        }
        else if(password.length<6){
            toast.error("password must be 6 char!", {
                position: "top-center"
            });
        }
   
        else{
            // console.log("User registration successfully done");
            try {
                console.log(inpval);
                await axios.post("https://exuberant-scrubs-fish.cyclic.app/auth/signup", inpval); // Adjust API endpoint
                toast.success("Registration Successfully done 😃!", {
                  position: "top-center"
              });
              setinpval({...inpval,name:"",email:"",password:""});
              } catch (error) {
                toast.error("Error please fill details correctly", {
                  position: "top-center"
              });
                console.error("Error in registration:", error);
              }

            
        }
    } 
 
    return(
        <>
            <section>
                <div className='form_data'>
                    <div className='form_heading'>
                       
                        <p>I'm glad you are gonna use it</p>
                    </div>
                    <form>
                        <div className='form_input'>
                            <label htmlFor="name">Name</label>
                            <input type="text" onChange={setVal} value={inpval.name} id="name" name="name" placeholder="Enter your name here" />
                        </div>
                        <div className='form_input'>
                            <label htmlFor='email'>Email</label>
                            <input type="email" onChange={setVal} value={inpval.email} name="email" id="email" placeholder="Enter your email here"/>
                        </div>
                        <div className='form_input'>
                            <label htmlFor="password">Password</label>
                            <div className='two'>
                                <input type={!passShow ? "password":"text"} onChange={setVal} value={inpval.password} name="password" id="password" placeholder='Enter your password here'/>
                                <div className='showpass' onClick={()=>setpassShow(!passShow)}>
                                    {!passShow ? "Show":"Hide"}
                                </div>
                            </div>
                        </div>
                        {/* <div className='form_input'>
                            <label htmlFor="password">Confirm Password</label>
                            <div className='two'>
                                <input type={!cpassShow ? "password":"text"} onChange={setVal} value={inpval.cpassword} name="cpassword" id="cpassword" placeholder='Confirm password'/>
                                <div className='showpass' onClick={()=>setcpassShow(!cpassShow)}>
                                    {!cpassShow ? "Show":"Hide"}
                                </div>
                            </div>
                        </div> */}
                        <button className='btn' onClick={checkvaidation}>Sign Up</button>
                        <p>Already have an account? <NavLink to="/">LogIn</NavLink></p>
                    </form>
                    <ToastContainer />
                </div>
            </section>
        </>
    )
})

export default Register;