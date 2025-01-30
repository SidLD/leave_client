
import { Navigate } from "react-router-dom"
import DashboardLayout from '@/layouts/DashboardLayout';
import Guest from '@/layouts/Guest';
import PrintLayout from '@/layouts/PrintLayout';
import { useStore } from '@/store/app.store';
export const PublicLayout = () => {
   const { getToken , getRole} = useStore()
    if(getToken()){
        switch (getRole()) {
            case "ADMIN":
                return  <Navigate to={`/admin/`} />;
            default:
                return  <Navigate to={`/contributor/"`} />;
        }
    }
    return (
        <Guest />
    )
}

export const PrivateLayout = () => {
    const { getToken , getExpiration} = useStore()
    if (!getToken() || getExpiration() * 1000 <= Date.now()) {
        return <Navigate to={"/login"} />;
    } else{
        return <DashboardLayout />
    }   
}

export const PrivatePrintLayout = () => {
    const { getToken , getExpiration, clear} = useStore()
    if (!getToken()) {
        return <Navigate to={"/login"} />;
    }
    else if (getExpiration() * 1000 <= Date.now()) {
        clear()
        alert("Session Expired")
        return <Navigate to={"/login"} />;
        
    }else{
        return <PrintLayout />
    }   
}