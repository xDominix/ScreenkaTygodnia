import React from 'react';
import App from '../../../../Objects/App/App';
import "./Container.css"

const AppContainer = ({
    apps,notificationCountsMap= new Map(), disabled,
    appHeight=70, onAppClick=null,  appClassName="",
    specialAppName=null,specialClassName="", notSpecialClassName="",
    orangeAppName=null, isUploadMode=false, 
    }) => {

    const getAppClassName = (app_name)=>{
        if(specialAppName===null) return "";
        if(specialAppName === app_name) return specialClassName;
        return notSpecialClassName;
    }

    if(!apps ||  !notificationCountsMap) return;
    return ( 
    <div className={'app-conteiner' + (disabled ? (" opacity noclick"):"")}  style={{"gridTemplateColumns":"repeat(auto-fill, "+appHeight+"px)"}}>
        {apps.map((app,index) => 
        <div key={index} className={appClassName+" "+getAppClassName(app.name)} >
            <App
            onClick={onAppClick?()=>onAppClick(app):undefined}
            isUploadMode={isUploadMode}
            notificationText = {notificationCountsMap.get(app.name)}
            notificationOrange={orangeAppName === app.name}
            application={app} 
            height={appHeight} />
        </div>
    )}
    </div> );
}
 
export default AppContainer;