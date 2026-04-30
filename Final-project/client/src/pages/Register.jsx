import React,{useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const navigate = useNavigate();
  const [form,setForm] = useState({name:"",email:"",password:"",role:"student"});

  const hc = (e)=> setForm({...form,[e.target.name]:e.target.value});
  const hs = async(e)=>{
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5500/api/auth/register",form);
      alert(res.data.message);
      navigate("/verify-otp",{state:{email:form.email}});
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
        type="text"
        name='name'
        placeholder='enter name'
        onChange={hc}
        value={form.name}
        className="w-full border p-3 rounded-lg"
        required
      />
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
      <select name='role' 
      className="w-full border p-3 rounded-lg" 
      onChange={hc}
      required
      >
        <option value="student">Student</option>
        <option value="instructor">Instructor</option>
        <option value="admin">Admin</option>
      </select>

      <button 
      className="w-full bg-white text-black py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Register
      </button>
    </form>
  
  
  </>
}

export default Register