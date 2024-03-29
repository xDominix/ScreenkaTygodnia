import React, { useContext, useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthContext';
import { ButtonPrevPage } from '../Components/Buttons';
import {MiniPosts} from '../Objects/Post/MiniPosts';
import { delay } from '../aFunctions';
import { Event } from '../Objects/Event/_Event';
import { useLocation } from 'react-router-dom';

const HANDLING_EVENTS = {DayUploads:"dayuploads",WeekUploads:"weekuploads",ManageUploads:"manageuploads",}

const Uploads = () => {

    const navigate = useNavigate();

    const {user,getMyDayUploads,getMaxTickets,getMyWeekUploads,changeMyPostPermissions,screenkaDisabled,getMyInteractiveEvent} = useContext(AuthContext)
    const {type} = useParams();

    //token
    const location = useLocation();
    const token = location.state?.token;

    const [posts,setPosts]=useState(null);

    useEffect(()=>{
        const getUploads = (event)=>{
            switch(event.toString()){
                case HANDLING_EVENTS.ManageUploads: return getMyDayUploads().then(posts=>{ posts.sort((a, b) => a.upload_date - b.upload_date); return posts; }); //desc order, from newest
                case HANDLING_EVENTS.DayUploads: return getMyDayUploads();
                case HANDLING_EVENTS.WeekUploads: return getMyWeekUploads();
                default: return Promise.reject();
            }
        }

        let event = getMyInteractiveEvent(type==="week"? HANDLING_EVENTS.DayUploads : (type==="day"?HANDLING_EVENTS.DayUploads:HANDLING_EVENTS.ManageUploads));
        if(!Event.canInteract(event) || (!token && type!== "manage")) {navigate("/");return;}

        getUploads(event).then(posts=>{setPosts(posts); if(posts?.length>0) Event.setInteraction(event);}).catch(()=>navigate("/"))

    },[])// eslint-disable-line react-hooks/exhaustive-deps

    const handleOnPostCheckboxDelay = (e)=>{
        changeMyPostPermissions(e.target.id,{screenka:e.target.checked});
    }

    const handleOnPostDelete = (post_id)=>{
        if(posts.find(post=>post.id===post_id)  && window.confirm("Are you sure you want to delete the upload?"))
        {
            Promise.all([changeMyPostPermissions(post_id,{me:false,friends:false,screenka:false}),delay(100)])
                .then(()=>setPosts(posts.filter(post=>post.id!==post_id)))
        }
    }

    const handleOnPostPreview = (post_id)=>{
        navigate(`/post/${user.fullname}/${post_id}`,{state:{showMyRefPosts:type!=="manage",showFriendsRefPosts:type==="week"}})
    }

    return (
        <div>
            {type==="manage" && <h2> <ButtonPrevPage/>Manage Uploads:</h2>}
            {type==="day" && <h2> <ButtonPrevPage/>Your Day Uploads:</h2>}
            {type==="week" && <h2> <ButtonPrevPage/> Your Week Uploads:</h2>}

            <MiniPosts posts={posts} 
                checkboxesDisabled={!user.preferences.screenka || screenkaDisabled || type!=="manage"} maxChecks={type==="manage"?getMaxTickets():null} onPostCheckboxChangeDelay={handleOnPostCheckboxDelay}
                hourDate={type==="day" || type==="manage"} pretty_date={type==="manage"}
                preview={type==="day" || type==="week"} onPostPreview={handleOnPostPreview}
                delete_={type==="manage"}  onPostDelete={handleOnPostDelete}
                hideTickets={!user.preferences.screenka}
                crossed_eye={type==="manage"}
                no_crossed_eye_funny_info={type==="week"}
                no_eye={type==="day"}
                
            />

       </div>);
}
 
export default Uploads;