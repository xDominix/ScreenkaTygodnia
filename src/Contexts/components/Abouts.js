import React, { useContext, useEffect, useRef, useState } from 'react';
import { Format } from '../../Objects/App/AppClass';
import BottomTab from './BottomTab';
import { ButtonUpload } from '../../Components/Buttons';
import InputField from '../../Components/InputField';
import useUnload from '../../Components/useUnload';
import { PostContext } from '../PostContext';
import { PostClass } from '../../Objects/Post/PostClass';
import { AuthContext } from '../AuthContext';
import { NOW, datesWeekDelta, getPath, shortenFullname } from '../../aFunctions';
import { UserContext } from '../UserContext';
import { HostContext } from '../HostContext';

export const AboutAppMini = ({app,onClose,totalUploads}) => {
   
    return (  
        <BottomTab onClose={onClose} title={app.name} subtitle={app.miniDescription } footer={`Total uploads: ${totalUploads}`} style={{height:"300px"}}>
            <h4>{" - " +app.description}</h4>
        </BottomTab>
    );
}

export const AboutApp = ({app,tickets=0,onClose}) => {
    
    const [contentStateForString,setContentStateForString] = useState();
    const contentRef = useRef();
    const contextRef = useRef();
    const [uploading,setUploading] = useState(false);
    const [ticketsState,setTicketsState]= useState(tickets);

    const {getMeAndMyHostAndMyWeek}=useContext(AuthContext)
    const {postPost } = useContext(PostContext)

    useUnload(e => { e.preventDefault();   e.returnValue = ''; });
      
    const handleUpload=()=>{
        if(!contentRef.current.value){return;}

        console.log("Uploading...")

        let [me,host,week] = getMeAndMyHostAndMyWeek();
        
        let file = app.format===Format.Path?contentRef.current:null;
        if(file!=null && file.size>4e6) {   window.alert("Please upload a file smaller than 4 MB"); return;}

        let post = new PostClass(null,host.id,week?week.name:null,NOW(),app.name,contentRef.current.value,contextRef.current.value,tickets>0)
        
        setUploading(true);
        postPost(me.fullname,host.id,week.name,post,file).then(()=>{
            if(ticketsState>0) setTicketsState(ticketsState-1);
            setTimeout(()=>{
                onClose();
                setUploading(false);
            },1000);
        })
    }

    const handleStringChange = (event) => {
        setContentStateForString(event.target.value)
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        contentRef.current = file;
        contentRef.current.value = file.name
      };

    return (  
        <BottomTab  onClose={!uploading?onClose:()=>{}} 
            title={app.name} 
            subtitle={app.miniDescription} 
            footerCenter={tickets>0?"You can manage uploads till end of the day.":"You can manage tickets later." }
            style={{height:"calc(100% + (-100px))"}}>
            <h4>{" - " + app.description}</h4>

            {(app.format===Format.String) && <h2 style={{textAlign:"center"}}>{contentStateForString}</h2>}  
            {(app.format===Format.String) && <InputField isLoading={uploading} onChange={handleStringChange} reff={contentRef} placeholder="content..."></InputField>} 
            {(app.format===Format.LongString) &&  <InputField isLoading={uploading} reff={contentRef} placeholder="content..." longer></InputField>}
            {(app.format===Format.Url) && <InputField isLoading={uploading} reff={contentRef} placeholder="content..." paste></InputField>} 
            {(app.format===Format.Path) && <InputField isLoading={uploading} onChange={handleFileChange} file/>}
            
            <InputField isLoading={uploading} reff={contextRef} placeholder="context...  " longer></InputField>

            <div style={{display:'flex', flexDirection:"column"}}>
            <ButtonUpload disabled={uploading} onClick={handleUpload}>{tickets<=0 && "UPLOAD*"}</ButtonUpload>
                    <h5 style={{position:"absolute",right:"10px" ,fontSize:"17px"}}><span role="img" aria-label="ticket_emoji" >🎫</span>x{ticketsState}</h5>
                {tickets<=0 && <footer>* - upload without ticket.</footer>}
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
 
export const AboutUserMini = ({user_fullname,host,onClose}) => {
    const {getUser,getUserSrcUrl} = useContext(UserContext);
    const {getHostMember} = useContext(HostContext)
    const [srcUrl,setSrcUrl] = useState(getPath('default_profile_picture.png'));
    
    const [sinceWeek,setSinceWeek] = useState(null);
    const [user,setUser] = useState(null);

    useEffect(()=>{
        getUserSrcUrl(user_fullname).then(setSrcUrl);
        getHostMember(host.id,user_fullname).then(member=>{setSinceWeek(datesWeekDelta(host.start_date,member.joined_date))})
        getUser(user_fullname).then(setUser);
    },[]) // eslint-disable-line react-hooks/exhaustive-deps

    return (  
        <BottomTab 
            title={shortenFullname(user_fullname)} 
            subtitle={`Also known as ${user?user.username:"____ ___"}`}
            footer={`Since: ${sinceWeek!=null?("#"+sinceWeek+" week"):"__ ____"}`}
            image={srcUrl} 
            onClose={onClose} 
            style={{height:"300px"}} >
        </BottomTab>
    );
}