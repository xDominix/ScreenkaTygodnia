import React, {useContext, useEffect, useRef, useState } from 'react';
import { Format } from '../../Objects/App/AppClass';
import BottomTab from './BottomTab';
import { ButtonUpload } from '../../Components/Buttons';
import InputField from '../../Components/InputField';
import { shortFullname } from '../../aFunctions';
import useUnload from '../../Components/useUnload';

export const AboutAppMini = ({app,onClose,totalUploads}) => {
   
    return (  
        <BottomTab onClose={onClose} title={app.name} subtitle={app.miniDescription } footer={`Total uploads: ${totalUploads}`} style={{height:"300px"}}>
            <h4>{" - " +app.description}</h4>
        </BottomTab>
    );
}

export const AboutApp = ({app,noTickets,onClose}) => {
    
    const contentRef = useRef();
    const contextRef = useRef();

    useUnload(e => { e.preventDefault();   e.returnValue = ''; });
      
    const handleUpload=()=>{
        console.log("Uploading...")
        console.log(contentRef.current.value);
        setTimeout(()=>onClose(),1000)
    }

    return (  
        <BottomTab  onClose={onClose} 
            title={app.name} 
            subtitle={app.miniDescription} 
            footerCenter={!noTickets?"You can manage uploads till end of the day.":"You can manage tickets later." }
            style={{height:"calc(100% + (-100px))"}}>
            <h4>{" - " + app.description}</h4>
            
            {(app.format===Format.String) && <InputField reff={contentRef} placeholder="content..."></InputField>} 
            {(app.format===Format.LongString) &&  <InputField reff={contentRef} placeholder="content..." longer></InputField>}
            {(app.format===Format.Url) && <InputField reff={contentRef} placeholder="content..." paste></InputField>} 
            {(app.format===Format.Path) && <InputField reff={contentRef} file/>}
            
            <InputField reff={contextRef} placeholder="context...  " longer></InputField>

            <div style={{display:'flex', flexDirection:"column"}}>
                <ButtonUpload onClick={handleUpload}>{noTickets && "UPLOAD*"}</ButtonUpload>
                {noTickets && <footer>* - it won't apply for Screenka Tygodnia ™</footer>}
            </div>
            
        </BottomTab>
    );
}
 
export const AboutDay = ({day,onClose}) => {
    return (  
        <BottomTab onClose={onClose} title={day.name.toUpperCase()} subtitle={day.sub}  style={{height:"300px"}} footer={day.note}>
            <h4 style={{fontSize:"19px"}} >{day.description}</h4>
        </BottomTab>
    );
}
 
export const AboutUserMini = ({user,sinceWeek,onClose}) => {

    return (  
        <BottomTab 
            title={shortFullname(user.fullname)} 
            subtitle={`Also known as ${user.username}`}
            footer={`Since: #${sinceWeek} week`}
            image={user.src} 
            onClose={onClose} 
            style={{height:"300px"}} >
        </BottomTab>
    );
}