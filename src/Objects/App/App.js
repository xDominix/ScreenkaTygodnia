import NotificationDot from "./components/NotificationDot";
import React from 'react';
import { getAppFullSrc } from "../../aFunctions";
import { AppClass } from "./AppClass";

export const App = ({application=AppClass.Default,isUploadMode=false,notificationText=null,disabled=false,notificationOrange=false,onClick=undefined,height=70}) => {

    if(application==null || typeof application !== "object" || application.constructor !== AppClass)  application = AppClass.Default;

    return ( <div className={"shadow fromdown"+ (disabled?" opacity":"")} style={{"position":"relative",height:height+"px", borderRadius:(Math.ceil(13*height/60))+"px"}} >
        <button onClick={(disabled || isUploadMode)?undefined:onClick} style={(isUploadMode|| !onClick)?{cursor:" initial"}:undefined}>
            <img src={getAppFullSrc(application.name,height)} alt={application.name} style={{height:height+"px", borderRadius:(Math.ceil(13*height/60))+"px"}}/>
        </button>
        {(notificationText!=null || isUploadMode) && <NotificationDot onClick={disabled?undefined:onClick} orange={notificationOrange}  value={isUploadMode?"+":notificationText}/>}
    </div> );
}

export default App;