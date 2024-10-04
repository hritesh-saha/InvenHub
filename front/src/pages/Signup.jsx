// import { useState } from "react";
// import BottomText from "../components/BottomText";
// import Button from "../components/Button";
// import Heading from "../components/Heading";
// import Inputbox from "../components/Inputbox";
// import SubHeading from "../components/SubHeading";

// export default function Signup(){
//     const[username,setusername]=useState("");
//     const[email,setemail]=useState("");
//     const[country,setcountry]=useState("");
//     const[refferal,setrefferal]=useState("");
//     const[password,setpassword]=useState("");
//     const handleClear=()=>{
//       setusername('');
//       setemail('');
//       setpassword('');
//       setrefferal('');
//       setcountry('');
//     }


//     return(
    
//     <div className="bg-zinc-100 h-screen flex justify-center">
//     <div className="w-4/5 my-8 bg-white flex flex-row">
//     <div className="w-80">
//     <img src="https://img.freepik.com/free-vector/stream-binary-code-design-vector_53876-175009.jpg" alt="photo" />
//     </div>
//     <div className="flex flex-col p-5">
//       <SubHeading label="Register"></SubHeading>
//       <p className="text-sky-900">Manage all your inventory efficiently</p>
//       <p className="text-sm">Let's get all set up so you can verify your personal account and begin setting up your work profile</p>
//     <div className="flex flex-row">
//     <Inputbox width="24"label="email"></Inputbox>
//     <Inputbox width="24"label="password"></Inputbox>
//     </div>
//     <div className="flex flex-row">
//     <div>
//     <Inputbox width="20"label="email"></Inputbox>
//     </div>
//     <div>
//     <Inputbox width="20"label="password"></Inputbox>
//     </div>
//     </div>
//     </div>
   
//     </div>
//     </div>
    
//     )

// }
import { useState } from "react";
import axios from "axios";
import BottomText from "../components/BottomText";
import Button from "../components/Button";
import Heading from "../components/Heading";
import Inputbox from "../components/Inputbox";
import SubHeading from "../components/SubHeading";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [email, setemail] = useState("");
  const [phone, setphone] = useState("");  
  const [password, setpassword] = useState("");
  const [error, setError] = useState("");
  const handleSend = async () => {
    if (!firstname || !lastname || !email || !phone || !password) {
      setError("All fields are required.");
      return;
    }
    setError("");
    try {
      const signupResponse = await axios.post("https://inven-hub-backend.vercel.app/signup", {
        firstname,
        lastname,
        email,
        phone,
        password,
      });
      
      if (signupResponse.status === 200) {
        const profileResponse = await axios.post("https://inven-hub-backend.vercel.app/add-profile", {
          firstname,
          lastname,
          email,
          phone,
        });
  
        if (profileResponse.status === 201) {
          localStorage.setItem('email', email);
          navigate("/otp");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClear = () => {
    setfirstname("");
    setlastname("");
    setemail("");
    setpassword("");
    setphone("");
  };

  return (
    <div className="bg-zinc-100 h-screen flex justify-center items-center p-4">
      <div className="w-full max-w-5xl bg-white flex flex-col lg:flex-row rounded-lg shadow-lg overflow-hidden">
        <div className="w-full lg:w-1/2">
          <img
            src="https://img.freepik.com/free-vector/stream-binary-code-design-vector_53876-175009.jpg"
            alt="photo"
            className="w-full h-64 lg:h-full object-cover"
          />
        </div>
        <div className="flex flex-col p-5 space-y-4 justify-center w-full lg:w-1/2">
          <SubHeading label="Register"></SubHeading>
          <p className="text-sky-900">
            Manage all your inventory efficiently
          </p>
          <p className="text-sm">
            Let's get all set up so you can verify your personal account and
            begin setting up your work profile.
          </p>

          <div className="flex flex-col space-y-4">
            <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
              <Inputbox width="full" label="First name" placeholder="Enter your first name" value={firstname} onChange={(e) => setfirstname(e.target.value)} />
              <Inputbox width="full" label="Last name" placeholder="Enter your last name" value={lastname} onChange={(e) => setlastname(e.target.value)} />
            </div>
            <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
              <Inputbox width="full" label="Email" placeholder="Enter your email" value={email} onChange={(e) => setemail(e.target.value)} />
              <Inputbox width="full" label="Phone no." placeholder="Enter your phone no." value={phone} onChange={(e) => setphone(e.target.value)} />
            </div>
            <div className="flex w-full">
              <Inputbox width="full" label="Password" placeholder="Enter a password" value={password} onChange={(e) => setpassword(e.target.value)} />
            </div>
            {error && <p className="text-red-500">{error}</p>}
          </div>

          {/* Clear button */}
          <div className="mt-4">
            <Button label="Signup" onClick={handleSend} />
          </div>
          <div>
            <h3 className="flex font-semibold">Have an Account?&nbsp;&nbsp;<a className="text-blue-700" href="/signin">Login</a></h3>
          </div>
        </div>
      </div>
    </div>
  );
}
