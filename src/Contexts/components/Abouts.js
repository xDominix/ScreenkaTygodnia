import React, { useContext, useEffect, useRef, useState } from 'react';
import { Format } from '../../Objects/App/AppClass';
import BottomTab from './BottomTab';
import { ButtonUpload } from '../../Components/Buttons';
import InputField from '../../Components/InputField';
import useUnload from '../../Hooks/useUnload';
import { PostClass } from '../../Objects/Post/PostClass';
import { AuthContext } from '../AuthContext';
import { delay, getPath, shortenFullname } from '../../aFunctions';
import useConst from '../../Hooks/useConst';
import pack from "../../../package.json"

export const AboutScreenka = ({onClose}) => {
   const title="Screenka";
   const subtitle="app"
   const footer="v"+pack.version;
    return (  
        <BottomTab onClose={onClose} title={title} subtitle={subtitle} footer={footer} >
            <h4 style={{fontWeight:"bold"}}>You. Friends. And Screenka Tygodnia.</h4>
        </BottomTab>
    );
}

export const AboutAppMini = ({app,onClose,totalUploads}) => {
   
    return (  
        <BottomTab onClose={onClose} title={app.name} subtitle={app.miniDescription } footer={`Total uploads: ${totalUploads}`} style={{height:"350px"}}>
            <h4>{" - " +app.description}</h4>
        </BottomTab>
    );
}

export const AboutApp = ({app,onClose}) => {

    const {getTickets,postMyPost}=useContext(AuthContext)
    
    const [contentStateForString,setContentStateForString] = useState();
    const contentRef = useRef();
    const contextRef = useRef();
    const [uploading,setUploading] = useState(false);
    const [ticketsState,setTicketsState] = useState(getTickets());
    const tickets = useConst(getTickets());
    const [isContentRed,setIsContentRed] = useState(false);

    useUnload(e => { e.preventDefault();   e.returnValue = ''; });
      
    const handleUpload=()=>{

        if(isContentRed) setIsContentRed(false);
        setUploading(true);

        let file = app.format===Format.Path?contentRef.current:null;
        let post = new PostClass(null,null,null,null,app.name,contentRef.current?.value,contextRef.current.value,tickets>0)
        
        Promise.all([postMyPost(post,file),delay(1500)])
            .then(()=>setTicketsState(Math.max(0,ticketsState-1)))
            .then(()=>delay(1000))
            .then(onClose)
            .catch(err=>{
                if(err.message) window.alert(err.message);
                setIsContentRed(true);})
            .then(()=>setUploading(false))
    }

    const timeout = useRef(null);

    const handleStringChange = (event) => {
        if(timeout.current) clearTimeout(timeout.current);
        timeout.current = setTimeout(()=>{
            setContentStateForString(event.target.value)
        },1000);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        contentRef.current = file;
        if(contentRef.current) contentRef.current.value = file?.name
      };

    return (  
        <BottomTab  onClose={!uploading?onClose:()=>{}} 
            title={app.name} 
            subtitle={app.miniDescription} 
            footerCenter={tickets>0?"You can manage uploads till end of the day.":"You can manage tickets later." }
            style={{height:"calc(100% + (-100px))",minHeight:"400px"}}>
            <h4>{" - " + app.description}</h4>

            {(app.format===Format.String) && <h2 style={{textAlign:"center"}}>{contentStateForString}</h2>}  
            {(app.format===Format.String) && <InputField isRed={isContentRed} isLoading={uploading} onChange={handleStringChange} reff={contentRef} placeholder="content..."></InputField>} 
            {(app.format===Format.LongString) &&  <InputField isRed={isContentRed} isLoading={uploading} reff={contentRef} placeholder="content..." longer></InputField>}
            {(app.format===Format.Url) && <InputField isRed={isContentRed} isLoading={uploading} reff={contentRef} placeholder="content..." paste></InputField>} 
            {(app.format===Format.Path) && <InputField isRed={isContentRed} isLoading={uploading} onChange={handleFileChange} file/>}
            
            <InputField isLoading={uploading} reff={contextRef} placeholder="context...  " longer></InputField>

            <div style={{display:'flex', flexDirection:"column"}} >
                    <ButtonUpload disabled={uploading} onClick={handleUpload} tickets={ticketsState} />
                    {tickets<=0 && <footer className='light' style={{fontWeight:"bold"}}>* - upload without ticket.</footer>}
            </div>
            
        </BottomTab>
    );
}
 
export const AboutDay = ({day,onClose}) => {
    return (  
        <BottomTab onClose={onClose} title={day.name.toUpperCase()} subtitle={day.sub}  style={{height:"350px"}} footer={day.note}>
            <h4 style={{fontSize:"19px"}} >{day.description}</h4>
        </BottomTab>
    );
}
 
export const AboutUserMini = ({user_fullname,since_week,onClose}) => {//role=null,
    const {UserService} = useContext(AuthContext);
    const [srcUrl,setSrcUrl] = useState(getPath('default_profile_picture.png'));
    const [user,setUser] = useState(null);

    useEffect(()=>{
        UserService.getUserSrcUrl(user_fullname).then(setSrcUrl);
        UserService.getUser(user_fullname).then(setUser);
    },[]) // eslint-disable-line react-hooks/exhaustive-deps

    return (  
        <BottomTab 
            title={shortenFullname(user_fullname)} 
            subtitle={`Also known as ${user?user.username:"____ ___"}`}
            footer={`Since: #${since_week} week`}
            image={srcUrl} 
            onClose={onClose} 
            style={{height:"350px"}} >
        </BottomTab>
    );
}