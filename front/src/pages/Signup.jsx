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
import BottomText from "../components/BottomText";
import Button from "../components/Button";
import Heading from "../components/Heading";
import Inputbox from "../components/Inputbox";
import SubHeading from "../components/SubHeading";

export default function Signup() {
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [country, setcountry] = useState("");
  const [refferal, setrefferal] = useState("");
  const [password, setpassword] = useState("");

  const handleClear = () => {
    setusername("");
    setemail("");
    setpassword("");
    setrefferal("");
    setcountry("");
  };

  return (
    <div className="bg-zinc-100 h-screen flex justify-center items-center">
      <div className="w-4/5 my-8 bg-white flex">
        <div className="w-80">
          <img
            src="https://img.freepik.com/free-vector/stream-binary-code-design-vector_53876-175009.jpg"
            alt="photo"
          />
        </div>
        <div className="flex flex-col p-5 space-y-4 justify-center">
          <SubHeading label="Register"></SubHeading>
          <p className="text-sky-900">
            Manage all your inventory efficiently
          </p>
          <p className="text-sm">
            Let's get all set up so you can verify your personal account and
            begin setting up your work profile
          </p>
          
          {/* Input fields container */}
          <div className="flex flex-col space-y-4">
            <div className="flex space-x-4">
              <Inputbox width="48" label="First name" placeholder="Enter your first name" value={email} onChange={(e) => setemail(e.target.value)} />
              <Inputbox width="48" label="Last name" placeholder="Enter your last name" value={password} onChange={(e) => setpassword(e.target.value)} />
            </div>
            <div className="flex space-x-4">
              <Inputbox width="48" label="Email" placeholder="Enter your email" value={username} onChange={(e) => setusername(e.target.value)} />
              <Inputbox width="48" label="Phone no." placeholder="Enter your phone no." value={country} onChange={(e) => setcountry(e.target.value)} />
            </div>
            <div className="flex w-96">
              <Inputbox width="auto" label="Password" placeholder="Enter a password" value={refferal} onChange={(e) => setrefferal(e.target.value)} />
            </div>
          </div>

          {/* Clear button */}
          <div className="mt-4">
            <Button label="Clear" onClick={handleClear} />
          </div>
        </div>
      </div>
    </div>
  );
}
