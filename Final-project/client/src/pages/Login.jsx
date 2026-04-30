import React,{useState} from 'react'
import axios from 'axios'
import { useNavigate,useLocation } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form,setForm] = useState({email:"",password:"",role:"student"});

  const redirectbyrole = (role)=>{
    if(role ==="admin") navigate("/admin-dashboard");
    else if(role ==="instructor") navigate("/instructor-dashboard");
    else navigate("/student-dashboard");
  }

  const hc = (e)=> setForm({...form,[e.target.name]:e.target.value});
  const hs = async(e)=>{
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5500/api/auth/login",form);
      localStorage.setItem("token",res.data.token);
      localStorage.setItem("user",JSON.stringify(res.data.user));
      alert(res.data.message);
      redirectbyrole(res.data.user.role);
    } catch(err){
      console.error(err);
    }
  }
  return <>
  <form
      onSubmit={hs}
      className="bg-white p-8 rounded-2xl shadow-card space-y-4"
    >
      <input
        type="email"
        name='email'
        placeholder='enter email'
        onChange={hc}
        value={form.email}
        className="w-full border p-3 rounded-lg"
        required
      />
      <input
        type="password"
        name='password'
        placeholder='enter password'
        onChange={hc}
        value={form.password}
        className="w-full border p-3 rounded-lg"
        required
      />
     

      <button 
      className="w-full bg-white text-black py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Login
      </button>
    </form>
  
  
  </>
}

export default Login