import React, {useContext, useRef, useState } from 'react';
import { Format } from '../../Objects/App/AppClass';
import BottomTab from './BottomTab';
import { ButtonUpload } from '../../Components/Buttons';
import InputField from '../../Components/InputField';
import useUnload from '../../Components/useUnload';
import { PostContext } from '../PostContext';
import { PostClass } from '../../Objects/Post/PostClass';
import { AuthContext } from '../AuthContext';
import { NOW } from '../../aFunctions';

export const AboutAppMini = ({app,onClose,totalUploads}) => {
   
    return (  
        <BottomTab onClose={onClose} title={app.name} subtitle={app.miniDescription } footer={`Total uploads: ${totalUploads}`} style={{height:"300px"}}>
            <h4>{" - " +app.description}</h4>
        </BottomTab>
    );
}

export const AboutApp = ({app,noTickets=false,onClose}) => {
    
    const contentRef = useRef();
    const contextRef = useRef();
    const [uploading,setUploading] = useState(false);

    const {getMeAndMyTeamAndMyWeek}=useContext(AuthContext)
    const {postPost,postFile } = useContext(PostContext)

    useUnload(e => { e.preventDefault();   e.returnValue = ''; });
      
    const handleUpload=()=>{
        if(!contentRef.current.value)return;

        setUploading(true);

        console.log("Uploading...")

        let [me,team,week] = getMeAndMyTeamAndMyWeek();

        /*
        if(app.format===Format.Path){
            console.log(contentRef.current.value)

           postFile(contentRef.current.value);
        }
        */
        let post = new PostClass(null,team.id,week?week.name:null,NOW,app.name,contentRef.current.value,contextRef.current.value,!noTickets)
        console.log(post)
        postPost(me.fullname,post).then(()=>{onClose();setUploading(false)})
    }

    return (  
        <BottomTab  onClose={onClose} 
            title={app.name} 
            subtitle={app.miniDescription} 
            footerCenter={!noTickets?"You can manage uploads till end of the day.":"You can manage tickets later." }
            style={{height:"calc(100% + (-100px))"}}>
            <h4>{" - " + app.description}</h4>
            
            {(app.format===Format.String) && <InputField readOnly={uploading} reff={contentRef} placeholder="content..."></InputField>} 
            {(app.format===Format.LongString) &&  <InputField readOnly={uploading} reff={contentRef} placeholder="content..." longer></InputField>}
            {(app.format===Format.Url) && <InputField readOnly={uploading} reff={contentRef} placeholder="content..." paste></InputField>} 
            {(app.format===Format.Path) && <InputField readOnly={uploading} reff={contentRef} file/>}
            
            <InputField readOnly={uploading} reff={contextRef} placeholder="context...  " longer></InputField>

            <div style={{display:'flex', flexDirection:"column"}}>
                <ButtonUpload disabled={uploading} onClick={handleUpload}>{noTickets && "UPLOAD*"}</ButtonUpload>
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
            title={user.getFullnameShort()} 
            subtitle={`Also known as ${user.username}`}
            footer={`Since: #${sinceWeek} week`}
            image={user.src} 
            onClose={onClose} 
            style={{height:"300px"}} >
        </BottomTab>
    );
}