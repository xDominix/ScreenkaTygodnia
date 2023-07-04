import NotificationDot from "./components/NotificationDot";
import React from 'react';
import { getAppFullSrc } from "../../aFunctions";
import { AppClass } from "./AppClass";

export const App = ({application=AppClass.Default,notificationText=null,disabled=false,notificationOrange=false,onClick,height=70}) => {

    if(application==null || typeof application !== "object" || application.constructor.name !== AppClass.name)  application = AppClass.Default;

    if(onClick === undefined || disabled)
        return ( <div className={"shadow fromdown "+(disabled&&"opacity")} style={{"position":"relative",height:height+"px",borderRadius:(Math.ceil(13*height/60))+"px"}}>
        <img src={getAppFullSrc(application.name,height)} alt={application.name} style={{height:height+"px", borderRadius:(Math.ceil(13*height/60))+"px"}}/>
        {notificationText!=null && <NotificationDot orange={notificationOrange} value={notificationText}/>}
        </div> )

    return ( <div className={"shadow fromdown"} style={{"position":"relative",height:height+"px", borderRadius:(Math.ceil(13*height/60))+"px"}} >
        <button onClick={onClick}>
            <img src={getAppFullSrc(application.name,height)} alt={application.name} style={{height:height+"px", borderRadius:(Math.ceil(13*height/60))+"px"}}/>
        </button>
        {notificationText!=null && <NotificationDot onClick={onClick} orange={notificationOrange}  value={notificationText}/>}
    </div> );
}

export default App;