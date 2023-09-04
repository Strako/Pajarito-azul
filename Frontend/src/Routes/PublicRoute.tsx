import { Navigate, Outlet } from "react-router-dom"

const PublicRoute = () =>{
    if(sessionStorage.getItem("token") !== null){
        return <Navigate to="/profile"/>
    }else{
    return <Outlet />    
    } 
}

export default PublicRoute;