import React, { useMemo, useState } from 'react';
import {  useLocation, useNavigate, useParams } from 'react-router-dom';
import Post from './Post';
import NothingToShow from '../../Pages/NothingToShow';
import { DayEvent } from '../Event/DayEvent';
import { ButtonNextPage, ButtonPrevPage } from '../../Components/Buttons';
import { Event } from '../Event/Event';
import { CustomEvent } from '../Event/CustomEvent';

const PostPage = () => { //state: nextPage, showMyRefPosts, showFriendsRefPosts

    const location = useLocation();
    const nextPages = location.state?.nextPages;
    //const showMyRefPosts = location.state? location.state.showMyRefPosts===true : false;
    //const showFriendsRefPosts =location.state? location.state.showFriendsRefPosts===true : false;
    const navigate = useNavigate();
    const {user_fullname,id,event} = useParams();
    const event_ = useMemo(()=>Event.fromString(event),[event]);
    const isItOneShot = useMemo(()=>event_ === DayEvent.OneShot,[event_]);
    const isItRnShot = useMemo(()=>event_ === CustomEvent.RnShot,[event_]);

    const isNothingToShow = ()=>{
        if(!user_fullname || !id) return true;
        if(isItOneShot && !Event.canView(event_)) return true;
        return false; }
    const [nothingToShow,setNothingToShow] = useState(isNothingToShow());

    const handleOnLoad = (post=null)=>{
        if(post==null) return;
        else if(isItRnShot && !Event.canView(event_,{date:post.upload_date})) setNothingToShow(true);
        else if(isItOneShot && post.view!==null) setNothingToShow(true);
        else if(isItOneShot || isItRnShot) Event.setView(event_);
    }

    const title = useMemo(()=>event_ ? event_.name.toUpperCase():"User Post",[event_])

    const handleOnNextClick = ()=>{
        navigate(nextPages[0],{replace:true,state:{nextPages:nextPages.slice(1)}}); //showMyRefPosts:showMyRefPosts, showFriendsRefPosts:showFriendsRefPosts
    }

    if(nothingToShow) return <NothingToShow/>
    return ( <div>

        <h2>
            <ButtonPrevPage alert={nextPages?.length>0}/>
            {title}
            {nextPages?.length>0 && <ButtonNextPage focus onClick={handleOnNextClick}/>}
        </h2>

        <Post id={id} user_fullname={user_fullname} setView={isItOneShot || isItRnShot} onLoad={handleOnLoad}/>
    </div> );
}
 
export default PostPage;