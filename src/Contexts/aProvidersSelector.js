import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import AuthProvider from "./AuthContext";
import { PostDemoProvider, PostProvider } from "./PostContext";
import { TeamProvider, TeamDemoProvider } from "./TeamContext";
import { UserDemoProvider, UserProvider } from "./UserContext";
import { WeekDemoProvider, WeekProvider } from "./WeekContext";

export const ProvidersSelector = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const isDemo = useRef(location.pathname.startsWith("/demo"));

    useEffect(()=>{ if(isDemo.current) localStorage.setItem("fullname","Giorgio Armani1") },[isDemo])
  
    useEffect(() => {
        if (isDemo.current && !location.pathname.startsWith("/demo"))
            navigate(`/demo${location.pathname}`); 
    }, [navigate,location.pathname]);

    return !isDemo.current 
    ? 
        <PostProvider><TeamProvider><UserProvider><WeekProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </WeekProvider></UserProvider></TeamProvider></PostProvider>
    :
        <PostDemoProvider><TeamDemoProvider><UserDemoProvider><WeekDemoProvider>
            <AuthProvider>
                {children}
                <h2 className='noselect' style={{position:"fixed",left:"10px",top:"13px",margin:0,opacity:"0.3"}}>DEMO</h2>
            </AuthProvider>
        </WeekDemoProvider></UserDemoProvider></TeamDemoProvider></PostDemoProvider>           
  };