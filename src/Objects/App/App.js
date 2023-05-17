import NotificationDot from "./components/NotificationDot";
import React from 'react';
import { getAppFullSrc } from "../../aFunctions";
import { AppClass } from "./AppClass";

export const App = ({application=AppClass.Default,notificationValue=null,notificationBlue=false,onClick,height=80}) => {

    if(application==null || typeof application !== "object" || application.constructor.name !== AppClass.name)  application = AppClass.Default;

    if(onClick === undefined)
        return ( <div className="shadow fromdown" style={{"position":"relative",height:height+"px",borderRadius:(Math.ceil(13*height/60))+"px"}}>
        <img src={getAppFullSrc(application.name,height)} alt={application.name} style={{height:height+"px", borderRadius:(Math.ceil(13*height/60))+"px"}}/>
        {notificationValue!=null && <NotificationDot blue={notificationBlue} value={notificationValue}/>}
        </div> )

    return ( <div className={"shadow fromdown"} style={{"position":"relative",height:height+"px", borderRadius:(Math.ceil(13*height/60))+"px"}} >
        <button onClick={onClick}>
            <img src={getAppFullSrc(application.name,height)} alt={application.name} style={{height:height+"px", borderRadius:(Math.ceil(13*height/60))+"px"}}/>
        </button>
        {notificationValue!=null && <NotificationDot blue={notificationBlue}  value={notificationValue}/>}
    </div> );
}

export default App;