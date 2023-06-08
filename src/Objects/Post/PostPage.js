import React, { useMemo, useState } from 'react';
import {  useLocation, useNavigate, useParams } from 'react-router-dom';
import Post from './Post';
import { AuthContext } from '../../Contexts/AuthContext';
import { useContext } from 'react';
import NothingToShow from '../../Pages/NothingToShow';
import { DayEvent } from '../Event/DayEvent';
import { ButtonNextPage, ButtonPrevPage } from '../../Components/Buttons';
import { Event } from '../Event/Event';
import { CustomEvent } from '../Event/CustomEvent';

const PostPage = () => {

    const location = useLocation();
    const nextPages = location.state?.nextPages;
    const navigate = useNavigate();
    const {user_fullname,id,event} = useParams();
    const event_ = useMemo(()=>Event.fromString(event),[event]);
    const isOneShot = useMemo(()=>event_ === DayEvent.OneShot,[event_]);
    const isRnShot = useMemo(()=>event_ === CustomEvent.RnShot,[event_]);

    const isNothingToShow = ()=>{
        if(!user_fullname || !id) return true;
        if(isOneShot && !Event.canViewPage(event_)) return true;
        return false; }
    const [nothingToShow,setNothingToShow] = useState(isNothingToShow());

    const handleOnLoad = (post=null)=>{
        if(post==null) return;
        else if(isRnShot && !Event.canViewPage(event_,{date:post.upload_date})) setNothingToShow(true);
        else if(isOneShot && post.view!==null) setNothingToShow(true);
        else if(isOneShot || isRnShot) Event.setView(event_);
    }

    const title = useMemo(()=>event_ ? event_.name.toUpperCase():"User Post",[event_])

    const handleOnBackClick = ()=>{
        if (!nextPages || nextPages.length===0 || window.confirm("Are you sure you want to leave?"))  navigate('/');
    }

    const handleOnNextClick = ()=>{
        navigate(nextPages[0],{state:{nextPages:nextPages.slice(1)}});
    }

    if(nothingToShow) return <NothingToShow/>
    return ( <div>

        <h2>
            <ButtonPrevPage onClick={handleOnBackClick}/>
            {title}
            {nextPages?.length>0 && <ButtonNextPage focus onClick={handleOnNextClick}/>}
        </h2>

        <Post id={id} user_fullname={user_fullname} setView={isOneShot || isRnShot} onLoad={handleOnLoad}/>
    </div> );
}
 
export default PostPage;