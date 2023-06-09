import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthContext';
import {MiniPosts} from './MiniPosts';
import { DayEvent } from '../Event/DayEvent';
import { ButtonPrevPage } from '../../Components/Buttons';
import { Event } from '../Event/Event';

const MiniPostsPage = () => { //current week posts page

    const {user_fullname,host_id,event} = useParams(); // event_string
    const event_ = Event.fromString(event);
    const navigate = useNavigate();

    const {getFriendCurrentDayPosts,getFriendCurrentWeekPosts,AM_I_HOST} = useContext(AuthContext)
    const [posts,setPosts] = useState(null);

    useEffect(()=>{
        if( !AM_I_HOST && !user_fullname )  {navigate("/"); return;}
        
        switch(event_){
            case DayEvent.DayUploads:
                getFriendCurrentDayPosts(user_fullname,host_id).then(posts=>posts==null?navigate("/"):setPosts(posts));
                break;
            case DayEvent.WeekUploads:
                getFriendCurrentWeekPosts(user_fullname,host_id).then(posts=>posts==null?navigate("/"):setPosts(posts));
                break;
            default:
                navigate("/")
                break;
        }
        
    },[]) //eslint-disable-line react-hooks/exhaustive-deps

    const handleOnPostPreview = (post_id)=>{
        navigate(`/post/${user_fullname}/${post_id}`,{state:{showMyRefPosts:true,showFriendsRefPosts:true}})
    }

    return (
        <div>
            {event_===DayEvent.DayUploads && <h2> <ButtonPrevPage/>User Day Uploads:</h2>}
            {event_===DayEvent.WeekUploads && <h2> <ButtonPrevPage/>User Week Uploads:</h2>}
            
            <MiniPosts posts={posts} title={user_fullname}
                checkboxesDisabled={true}
                preview={true} onPostPreview={handleOnPostPreview}
                hideFooter={true}
            />
       </div>);
}
 
export default MiniPostsPage;