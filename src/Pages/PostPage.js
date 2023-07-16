import React, { useContext, useEffect, useMemo } from 'react';
import {  useLocation, useNavigate, useParams } from 'react-router-dom';
import Post from '../Objects/Post/Post';
import { ButtonNextPage, ButtonPrevPage } from '../Components/Buttons';
import { Event } from '../Objects/Event/_Event';
import { AuthContext } from '../Contexts/AuthContext';

const PostPage = () => { //state: nextPage, showMyRefPosts, showFriendsRefPosts

    const location = useLocation();
    const nextPages = location.state?.nextPages;
    //const showMyRefPosts = location.state? location.state.showMyRefPosts===true : false;
    //const showFriendsRefPosts =location.state? location.state.showFriendsRefPosts===true : false;

    //token
    //bez event to nie trzeba token, nie masz i tak zadnych akcji (do sharowania potrzebne)
    //z tokenem mozesz trySetView, komentowanie i inne akcje
    const token = location.state?.token; 

    const navigate = useNavigate();
    const {user_fullname,id,event} = useParams();
    const {getMyInteractiveEvent} = useContext(AuthContext);
    const event_ = useMemo(()=>getMyInteractiveEvent(event),[event])

    useEffect(()=>{
        if(!token && event_) {navigate('/'); return;}
        if(!user_fullname || !id) {navigate('/'); return;}
    },[token, event_, user_fullname, id])

    const title = useMemo(()=>event_ ? event_.name.toUpperCase():"User Post:",[event_])

    const handleOnNextClick = ()=>{
        navigate(nextPages[0],{replace:true,state:{token:true,nextPages:nextPages.slice(1)}}); //showMyRefPosts:showMyRefPosts, showFriendsRefPosts:showFriendsRefPosts
    }

    const handleSetView = ()=>{
        if(event_?.isShotType()) Event.setInteraction(event_);
    }

    return ( <div>

        <h2>
            <ButtonPrevPage alert={nextPages?.length>0} onClick={()=>navigate(-1,{state:{token:true}})}/>{/* cofanie do wydarzen TEMP */}
            {title}
            {nextPages?.length>0 && <ButtonNextPage focus onClick={handleOnNextClick}/>}
        </h2>

        <Post id={id} user_fullname={user_fullname} trySetView={event_!==null} onLoad={handleSetView} />
    </div> );
}
 
export default PostPage;