import { useNavigate } from "react-router-dom";
import Button from "./Button";

export function Signout(){
    const navigate=useNavigate();
    return(
        <div className="float-right">
        <Button label="Sign out" onClick={()=>{
            localStorage.removeItem("email");
            navigate("/signin");
        }}></Button>
        </div>
    )
}