import React, { useContext, useEffect, useRef, useState } from 'react';
import { Format } from '../../Objects/App/AppClass';
import BottomTab from './BottomTab';
import { ButtonUpload } from '../../Components/Buttons';
import InputField from '../../Components/InputField';
import useUnload from '../../Hooks/useUnload';
import { PostClass } from '../../Objects/Post/PostClass';
import { AuthContext } from '../AuthContext';
import { delay, getPath, shortenFullname } from '../../aFunctions';

import A from '../../Components/A';
import { useNavigate } from 'react-router-dom';

export const AboutScreenka = ({onClose}) => {

    const {friendsDisabled,screenkaDisabled,changeMyPreferences,user,getMyGroups} = useContext(AuthContext);
    const userRef = useRef(user);
    
    const [you, setYou] = useState(); 
    const [friends,setFriends] = useState(); 
    const [screenka,setScreenka] = useState(); 

    const [isEditMode,setIsEditMode] = useState(false)
    const [loading,setLoading] = useState(false);

    const myGroups = useRef(getMyGroups());

    const title="Screenka";
    const subtitle="app";
    
    //const footer="Tap the tagline to define the app by your own. " //and set up your preferences
   
    useEffect(()=>{
        if(!isEditMode) 
        {
            setYou(userRef.current.preferences.me)
            setFriends(userRef.current.preferences.friends)
            setScreenka(userRef.current.preferences.screenka)
        }
    },[isEditMode])

    const isChanged = ()=> !(userRef.current.preferences.me === you && userRef.current.preferences.friends === friends && userRef.current.preferences.screenka === screenka);

    const changePreferences = ()=>{
        setLoading(true);
        Promise.all([changeMyPreferences({me:you,friends:(friends&&you),screenka:(screenka&&you)}),delay(1000)]).then(()=>onClose())
    }

    const getTextAboutMyGroups = ()=>{
        if(!myGroups.current) return "";
        return <span>Your groups: <span style={{fontStyle: "italic"}}>{myGroups.current.join(", ")}</span></span>;
    }

    return (  
        <BottomTab maxHeight onClose={!loading?onClose:()=>{}} 
        title={title} subtitle={subtitle} >
                <h4 style={{fontWeight:"bold",marginTop:"30px",textAlign:'center'}}>
                    <span >
                        {/*{!isEditMode && "\""}*/}
                        <A 
                            active={you}    
                            nocolor={!isEditMode}
                            onClick={(!loading && isEditMode)?()=>setYou(!you):()=>{}}>
                            You.
                        </A> 
                        <A 
                            active={(friends && you)}
                            nocolor={!isEditMode || friendsDisabled} 
                            onClick={(!loading && isEditMode)?()=>{if(!friends)setYou(true);setFriends(!friends)}:()=>{}} 
                            disabled={friendsDisabled} > Friends.
                        </A> 
                        <A 
                            active={(screenka && you)} 
                            nocolor={!isEditMode || screenkaDisabled} 
                            onClick={(!loading && isEditMode)?()=>{if(!screenka)setYou(true);setScreenka(!screenka)}:()=>{}} 
                            disabled={screenkaDisabled} > and Screenka Tygodnia.
                        </A>
                        {/*{!isEditMode && "\""}*/}
                     </span>
                </h4>
                {isChanged() &&<div style={{textAlign:"center"}}><h5><A disabled={loading} onClick={changePreferences} bold>Change </A> </h5></div>}
                <div className='margin' style={{marginTop:"auto",}} >
                    <p style={!you  ? {opacity:0}:undefined}><b>You. </b> Capture the happiness. Upload posts and preview them at the end of the day.</p>
                    {!friendsDisabled &&<p style={!(friends&&you)  ? {opacity:0}:undefined}><b>Friends. </b> Have fun with your friends. Participate in the events during the week. {getTextAboutMyGroups()}</p>}
                    {!screenkaDisabled && <p style={!(screenka&&you)  ? {opacity:0}:undefined} ><b>Screenka Tygodnia. </b>Join the story. Submit posts to the weekly gazette.</p>}
                </div>

                <footer className='center' style={{marginTop:0}}>
                    You can change the tagline by your own.<br/>
                    <A onClick={()=>setIsEditMode(!isEditMode)} disabled={loading}>{!isEditMode?"Edit":"Cancel"}</A>
                </footer>
            
        </BottomTab>
        );
}

export const AboutAppMini = ({app,onClose,totalUploads}) => {
   
    return (  
        <BottomTab onClose={onClose} title={app.name} subtitle={app.miniDescription } footer={`Total uploads: ${totalUploads}`} >
            <h4>{" - " +app.description}</h4>
        </BottomTab>
    );
}

export const AboutApp = ({app,appType,onClose}) => {

    const {getTickets,postMyPost,user,screenkaDisabled}=useContext(AuthContext)
    
    const me = user;
    const [contentStateForString,setContentStateForString] = useState();
    const contentRef = useRef();
    const contextRef = useRef();
    const [uploading,setUploading] = useState(false);
    const [ticketsState,setTicketsState] = useState(getTickets());
    const tickets = useRef(getTickets());
    const [isContentRed,setIsContentRed] = useState(false);

    useUnload(e => { e.preventDefault();   e.returnValue = ''; });
      
    const handleUpload=()=>{

        if(isContentRed) setIsContentRed(false);
        setUploading(true);

        let file = app.format===Format.Path?contentRef.current:null;
        
        let post = new PostClass(null,null,null,null,app.name,contentRef.current?.value,app.format,contextRef.current.value,null)
        
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
            footerCenter={(tickets.current>0 || !me.preferences.screenka || screenkaDisabled) ?"You can manage uploads till end of the day.":"You can manage tickets later." }
            maxHeight>
            
            <h4>{" - " +app.description}</h4>
            {/*{user.preferences.friends && appType===AppType.Personalized && <h4>{" - personalized app - only interested friends can see your upload."}</h4>}
            {user.preferences.friends && appType===AppType.Popular && <h4>{" - popular app - all of your friends can see your upload."}</h4>}
            {user.preferences.friends && appType===AppType.Group && <h4>{" - group app - only group members can see your upload."}</h4>}
            {user.preferences.friends && appType===AppType.SuperPersonalized && <h4>{" - super-personalized app - only special members can see your upload."}</h4>}*/}

            <div style={{marginTop: "auto"}} className='margin'>
                {(app.format===Format.String) && <h2 style={{textAlign:"center"}}>{contentStateForString}</h2>}  
                {(app.format===Format.String) && <InputField isRed={isContentRed} isLoading={uploading} onChange={handleStringChange} reff={contentRef} placeholder="content..."></InputField>} 
                {(app.format===Format.LongString) &&  <InputField isRed={isContentRed} isLoading={uploading} reff={contentRef} placeholder="content..." longer></InputField>}
                {(app.format===Format.Url) && <InputField isRed={isContentRed} isLoading={uploading} reff={contentRef} placeholder="content..." paste></InputField>} 
                {(app.format===Format.Path) && <InputField isRed={isContentRed} isLoading={uploading} onChange={handleFileChange} file/>}
                
                <InputField isLoading={uploading} reff={contextRef} placeholder="context...  " longer></InputField>

                <div style={{display:'flex', flexDirection:"column"}} >
                        <ButtonUpload disabled={uploading} onClick={handleUpload} tickets={ticketsState} noTicketAnimation={ !me.preferences.screenka || screenkaDisabled} />{/*tickets.current<=0 || */}
                        {(!screenkaDisabled && me.preferences.screenka && tickets.current<=0) && <footer className='light' style={{fontWeight:"bold",marginBottom:"0px"}}>* - upload without ticket.</footer>}
                </div>
            </div>
           
        </BottomTab>
    );
}
 
export const AboutEvent = ({event,onClose}) => {
    return (  
        <BottomTab onClose={onClose} title={event.name} subtitle={event.getSubtitle()}   footer={event.getNote()}>
            <h4 style={{fontSize:"19px"}} >{event.description}</h4>
        </BottomTab>
    );
}
 
export const AboutUserMini = ({user_fullname,since_week,onClose}) => {//role=null,
    const {getFriendSrcUrl,getFriend,AM_I_HOST,GET_HOST_ID} = useContext(AuthContext);
    const navigate = useNavigate();
    const [srcUrl,setSrcUrl] = useState(getPath('default_profile_picture.png'));
    const [user,setUser] = useState(null);

    useEffect(()=>{
        getFriendSrcUrl(user_fullname).then(res=>res?setSrcUrl(res):null);
        getFriend(user_fullname).then(setUser);
    },[]) // eslint-disable-line react-hooks/exhaustive-deps

    const onDayUploadsClick = ()=>{
        navigate(`/posts/${user_fullname}/${GET_HOST_ID()}/dayuploads`)
    }
    const onWeekUploadsClick = ()=>{
        navigate(`/posts/${user_fullname}/${GET_HOST_ID()}/weekuploads`)
    }

    return (  
        <BottomTab 
            title={shortenFullname(user_fullname)} 
            subtitle={`Also known as ${user?user.username:"____ ___"}`}
            footer={`Since: #${since_week} week`}
            image={srcUrl} 
            onClose={onClose} 
             >
            {AM_I_HOST() && <div>
                <A bold onClick={onDayUploadsClick}>DAY</A>, 
                <A bold onClick={onWeekUploadsClick}> WEEK</A>
            </div>}
        </BottomTab>
    );
}