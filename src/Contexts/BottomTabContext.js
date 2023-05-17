import React, { useState } from "react";
import { AboutApp, AboutAppMini, AboutDay, AboutScreenka, AboutUserMini } from "./components/Abouts";

export const BottomTabContext = React.createContext();

export const BottomTabProvider = ({children}) => {

    /* 
    Template             {id, object, ...}
    AboutAppMini    {0 ,app, total_uploads}
    AboutApp            {1,app}
    AboutUserMini   {2, user_fullname, since_week, role}
    AboutDay            {3, day}
    AboutScreenka   {4}
    */
    
    const [object,setObject] = useState(null);

    const setBottomTab = (object) =>{ setObject(object) }
    const closeBottomTab = ()=>{ if(object!==null) setObject(null);}
    const isBottomTab = ()=>{ return object!==null }
    const getObject = ()=>{return object?.object}
    const equalObject = (object2) => {return object?.object===object2}
    //const isObjectApp = ()=>{return object?.object.constructor.name ===AppClass.name}
    //const isObjectUser = ()=>{return object?.object.constructor.name ===UserClass.name}

    const value = {
        setBottomTab,
        closeBottomTab,
        isBottomTab,
        getObject,
        equalObject,
    }

    return ( 
    <BottomTabContext.Provider value={value}>
         
        <div onClick={()=>closeBottomTab()}>
            {children}
        </div>

        {object && object.id === 0 && <AboutAppMini app={object.object} totalUploads={object.total_uploads} onClose={()=>setObject(null)}/>}
        {object && object.id === 1 && <AboutApp app={object.object} onClose={()=>setObject(null)}/>}
        {object && object.id === 2 && <AboutUserMini user_fullname={object.object} since_week={object.since_week} role={object.role}  onClose={()=>setObject(null)}/>}
        {object && object.id === 3 && <AboutDay day={object.object}  onClose={()=>setObject(null)}/>}
        {object && object.id === 4 && <AboutScreenka onClose={()=>setObject(null)}/>}
        {/*... other ButtonTabs  */}
    </BottomTabContext.Provider> );
}