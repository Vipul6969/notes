import Login from "@/sections/login/view";
import {auth} from "@/service/firebase"

export default function LoginView(){
    console.log(auth.config);
    return(
        <>
        <Login />
        </>
    )
}