import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthContext';
import { ButtonPrevPage } from '../Components/Buttons';
import { DayEvent } from '../Objects/Event/DayEvent';
import {MiniPosts} from '../Objects/Post/MiniPosts';
import { delay } from '../aFunctions';
import { Event } from '../Objects/Event/Event';
import { CustomEvent } from '../Objects/Event/CustomEvent';

const Uploads = () => {

    const navigate = useNavigate();

    const {user,getMyDayUploads,getMaxTickets,getMyWeekUploads,changeMyPostPermissions,screenkaDisabled} = useContext(AuthContext)
    const {type} = useParams();

    const [posts,setPosts]=useState(null);

    useEffect(()=>{
        if(type==="manage") {
            if(!Event.canView(CustomEvent.ManageUploads)) navigate("/");
            getMyDayUploads().then(setPosts).catch(()=>navigate("/"))
        } else
        if(type==="day") {
            if(!Event.canView(DayEvent.DayUploads)) navigate("/");
            getMyDayUploads().then((posts)=>{
                setPosts(posts);
                if(posts?.length>0) Event.setView(DayEvent.DayUploads);
            })
        } 
        else if(type==="week") {
            if(!Event.canView(DayEvent.WeekUploads)) navigate("/");
            getMyWeekUploads().then((posts)=>{
                setPosts(posts);
                if(posts?.length>0) Event.setView(DayEvent.WeekUploads);
            })
            .catch(()=>navigate("/"))
        }
        else navigate("/")
    },[])// eslint-disable-line react-hooks/exhaustive-deps

    const handleOnPostCheckboxDelay = (e)=>{
        changeMyPostPermissions(e.target.id,{screenka:e.target.checked});
    }

    const handleOnPostDelete = (post_id)=>{
        if(posts.find(post=>post.id===post_id))
        {
            Promise.all([changeMyPostPermissions(post_id,{me:false}),delay(100)])
                .then(()=>setPosts(posts.filter(post=>post.id!==post_id)))
        }
    }

    const handleOnPostPreview = (post_id)=>{
        navigate(`/post/${user.fullname}/${post_id}`)
    }

    return (
        <div>
            {type==="manage" && <h2> <ButtonPrevPage/>Manage Uploads:</h2>}
            {type==="day" && <h2> <ButtonPrevPage/>Your Day Uploads:</h2>}
            {type==="week" && <h2> <ButtonPrevPage/> Your Week Uploads:</h2>}

            <MiniPosts posts={posts} 
                checkboxesDisabled={!user.preferences.screenka || screenkaDisabled} maxChecks={type==="manage"?getMaxTickets():null} onPostCheckboxChangeDelay={handleOnPostCheckboxDelay}
                hourDate={type==="day" || type==="manage"}
                preview={type==="day" || type==="week"} onPostPreview={handleOnPostPreview}
                delete_={type==="manage"}  onPostDelete={handleOnPostDelete}
                hideTickets={!user.preferences.screenka}
                crossed_eye={type==="manage"}
                no_crossed_eye_funny_info={type==="week"}
            />

       </div>);
}
 
export default Uploads;