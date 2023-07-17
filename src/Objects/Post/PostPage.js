import React, { useEffect, useMemo } from 'react';
import {  useLocation, useNavigate, useParams } from 'react-router-dom';
import Post from './Post';
import { DayEvent } from '../Event/DayEvent';
import { ButtonNextPage, ButtonPrevPage } from '../../Components/Buttons';
import { Event } from '../Event/Event';
import { CustomEvent } from '../Event/CustomEvent';

const PostPage = () => { //state: nextPage, showMyRefPosts, showFriendsRefPosts

    const location = useLocation();
    const nextPages = location.state?.nextPages;
    //const showMyRefPosts = location.state? location.state.showMyRefPosts===true : false;
    //const showFriendsRefPosts =location.state? location.state.showFriendsRefPosts===true : false;

    //token
    //bez event to nie trzeba token, nie masz i tak zadnych akcji (do sharowania potrzebne)
    //z tokenem mozesz setView, komentowanie i inne akcje
    const token = location.state?.token; 

    const navigate = useNavigate();
    const {user_fullname,id,event} = useParams();
    const event_ = useMemo(()=>Event.fromString(event),[event]);

    useEffect(()=>{
        if(!token && event_) {navigate('/'); return;}
        if(!user_fullname || !id) {navigate('/'); return;}
    },[])

    const title = useMemo(()=>event_ ? event_.name.toUpperCase():"User Post:",[event_])

    const handleOnNextClick = ()=>{
        navigate(nextPages[0],{replace:true,state:{token:true,nextPages:nextPages.slice(1)}}); //showMyRefPosts:showMyRefPosts, showFriendsRefPosts:showFriendsRefPosts
    }

    const handleSetView = ()=>{
        if(event_ && Event.isShotType(event_)) Event.setView(event_);
    }

    return ( <div>

        <h2>
            <ButtonPrevPage alert={nextPages?.length>0} onClick={()=>navigate(-1,{state:{token:true}})}/>{/* cofanie do wydarzen TEMP */}
            {title}
            {nextPages?.length>0 && <ButtonNextPage focus onClick={handleOnNextClick}/>}
        </h2>

        <Post id={id} user_fullname={user_fullname} setView={event_ === DayEvent.OneShot || event_ === CustomEvent.RnShot} onLoad={handleSetView} />
    </div> );
}
 
export default PostPage;