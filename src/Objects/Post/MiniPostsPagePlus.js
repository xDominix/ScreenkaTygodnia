import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthContext';
import { DayEvent } from '../Event/DayEvent';
import { ButtonPrevPage, ButtonNextPage } from '../../Components/Buttons';
import {MiniPosts} from "./MiniPosts"
import { DAY_EVENT_POSTS } from '../../aFunctions';
import { useRef } from 'react';
import { useMemo } from 'react';
import { Event } from '../Event/Event';

const MiniPostsPagePlus = () => {

    const {user_fullname,host_id,week_name,event} = useParams(); // event_string
    const navigate = useNavigate();

    const event_ = useMemo(()=>Event.fromString(event),[event]);
    const {getMyPastWeekPosts,getFriendPastWeekPosts} = useContext(AuthContext)
    const [posts,setPosts] = useState(null);

    const postCheckboxMap = useRef(new Map());
    const [checks,setChecks] = useState(0);
    const handleOnPostCheckboxChange = (e)=>{
        if(postCheckboxMap.current.has(e.target.name)) postCheckboxMap.current.delete(e.target.name);
        else postCheckboxMap.current.set(e.target.name,e.target.checked);

        setChecks(postCheckboxMap.current.size);
    }


    useEffect(()=>{
        if(!event_ || !user_fullname || !host_id || !week_name) {navigate("/"); return;}

        if(!Event.canView(event_)) {navigate("/"); return;}

        switch(event_){
            case DayEvent.ThrowBack:
                getMyPastWeekPosts(week_name).then(posts=>posts==null?navigate("/"):setPosts(posts));
                break;
            case DayEvent.OhPreview:
                getFriendPastWeekPosts(user_fullname,week_name).then(posts=>posts==null?navigate("/"):setPosts(posts));
                break;
            default:  
                navigate("/"); 
                break;
        }

    },[]) //eslint-disable-line react-hooks/exhaustive-deps

    useEffect(()=>{
        if(event_ && posts && posts.length>0) Event.setView(event_);
    },[posts]) //eslint-disable-line react-hooks/exhaustive-deps

    const handleOnNextPageClick = ()=>{
        let tos = Array.from(postCheckboxMap.current.keys()).map(post_id=> `/post/${user_fullname}/${post_id}/${event_.toString()}`);
        
        return navigate(tos[0],{replace:true,state:{nextPages: tos.slice(1),showMyRefPosts:true,showFriendsRefPosts:true}})
    }

    return (
        <div>
            <h2> <ButtonPrevPage/>{event_.name?.toUpperCase()}<ButtonNextPage focus disabled={checks===0} onClick={handleOnNextPageClick} /></h2>
            
            <MiniPosts posts={posts} title = {`${week_name}`} no_eye
            maxChecks={DAY_EVENT_POSTS} 
            customCheckboxes={true}
            onPostCheckboxChange={handleOnPostCheckboxChange}
            />
       </div>);
}
 
export default MiniPostsPagePlus;