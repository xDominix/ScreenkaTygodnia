import React, { useState } from "react";
import { AppClass } from "../Objects/App/AppClass";
import { UserClass } from "../Objects/User/UserClass";
import { AboutApp, AboutAppMini, AboutDay, AboutUserMini } from "./components/Abouts";

export const BottomTabContext = React.createContext();

export const BottomTabProvider = ({children}) => {

    /* 
    Template             {id, object, ...}
    AboutAppMini    {0 ,app, total_uploads}
    AboutApp            {1,app, tickets}
    AboutUserMini   {2, user_fullname, host}
    AboutDay            {3, day}
    */
    
    const [object,setObject] = useState(null);

    const setBottomTab = (object) =>{ setObject(object) }
    const closeBottomTab = ()=>{ if(object!==null) setObject(null);}
    const isBottomTab = ()=>{ return object!==null }
    const getObject = ()=>{return object.object}
    const equalObject = (object2) => {return object.object===object2}
    const isObjectApp = ()=>{return object.object.constructor.name ===AppClass.name}
    const isObjectUser = ()=>{return object.object.constructor.name ===UserClass.name}

    const value = {
        setBottomTab,
        closeBottomTab,
        isBottomTab,
        getObject,
        equalObject,
        isObjectApp,isObjectUser
    }

    return ( 
    <BottomTabContext.Provider value={value}>
         
        <div onClick={()=>closeBottomTab()}>
            {children}
        </div>

        {object && object.id === 0 && <AboutAppMini app={object.object} totalUploads={object.total_uploads}   onClose={()=>setObject(null)}/>}
        {object && object.id === 1 && <AboutApp app={object.object} tickets={object.tickets}                                    onClose={()=>setObject(null)}/>}
        {object && object.id === 2 && <AboutUserMini user_fullname={object.object} host={object.host}                               onClose={()=>setObject(null)}/>}
        {object && object.id === 3 && <AboutDay day={object.object}                                                                             onClose={()=>setObject(null)}/>}
        {/*... other ButtonTabs  */}
    </BottomTabContext.Provider> );
}