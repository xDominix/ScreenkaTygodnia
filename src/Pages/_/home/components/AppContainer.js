import React from 'react';
import App from '../../../../Objects/App/App';
import "./Container.css"

const AppContainer = ({
    apps,notificationCountsMap, disabled,
    appHeight=70, onAppClick=()=>{},  appClassName="",
    specialAppName=null,specialClassName="", notSpecialClassName="",
    orangeAppName=null, isUploadMode=false, 
    }) => {

    const getAppClassName = (app_name)=>{
        if(specialAppName===null) return "";
        if(specialAppName === app_name) return specialClassName;
        return notSpecialClassName;
    }

    const getNotificationValue= (app_name)=>{
        if(isUploadMode) return "+";
        return notificationCountsMap.get(app_name);
    }

    return ( 
    <div className={'app-conteiner' + (disabled ? (" opacity noclick"):"")}  style={{"gridTemplateColumns":"repeat(auto-fill, "+appHeight+"px)"}}>
        {apps.map(app => 
        <div key={app.name} className={appClassName+" "+getAppClassName(app.name)} >
            <App
            onClick={()=>onAppClick(app)}
            notificationValue = {getNotificationValue(app.name)}
            notificationOrange={orangeAppName === app.name}
            application={app} 
            height={appHeight} />
        </div>
    )}
    </div> );
}
 
export default AppContainer;