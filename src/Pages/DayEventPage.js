import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NothingToShow from './NothingToShow';
import { AuthContext } from '../Contexts/AuthContext';
import {  randomElement } from '../aFunctions';

const HANDLING_EVENTS = {DayUploads:"DayUploads",WeekUploads:"WeekUploads",OneShot:"OneShot",MorningShot:"MorningShot",OhPreview:"OhPreview",ThrowBack:"ThrowBack"}

const DayEventPage = () => { // dla day_eventow ktore maja page (isInteractive())

    const {event} = useParams();
    const navigate = useNavigate();

    const {user,getMyFriendsWithHostId,getMeAndMyHostId,getFriendCurrentDayRandomPost,getMyHostLastWeekName,getMyYesterdayRandomPost,getMyInteractiveEvent} = useContext(AuthContext);

    const [isNothingToShow,setIsNothingToShow]=useState(false);

    useEffect(()=>{
        let day_event = getMyInteractiveEvent(event);
        if(!day_event || !day_event.isInteractive()) {navigate("/"); return;}

        const timeout = setTimeout(async ()=>{
            let nav = await getNavigator(day_event);
            if(nav==null) setIsNothingToShow(true);
            else {
                nav.options = {replace:true, ...nav.options}
                navigate(nav.to,nav.options);
            }
        },1000)

        return ()=>clearTimeout(timeout)
    },[]) //eslint-disable-line react-hooks/exhaustive-deps

    //navigate
    const getNavigator=async (event)=>{
        const getOneShotNavigator=async ()=>{
            let [friends,]= getMyFriendsWithHostId();
            let friends_random = friends.sort(() => 0.5 - Math.random());
            var tos =[];
            for (const friend of friends_random) {
                let post = await getFriendCurrentDayRandomPost(friend);
                if (post)   tos.push(`/post/${friend}/${post.id}/${HANDLING_EVENTS.OneShot}`);
                if (tos.length >= 3) break;
            }
            if(tos.length===0) return null;
            return {to:tos[0],options:{state:{token:true,nextPages: tos.slice(1),showMyRefPosts:true}}}
        }
        const getMorningShotNavigator=async ()=>{
            let post = await getMyYesterdayRandomPost(); if(!post) return null;
            return {to:`/post/${user.fullname}/${post.id}/${HANDLING_EVENTS.MorningShot}`,options:{state:{token:true,showMyRefPosts:true,showFriendsRefPosts:true}}};//show na poprawe i zaskocznie, w koncu DayUploads ukrywaja friends interactions
        }
        const getOhPreviewNavigator=async()=>{
            let [friends,host_id]= getMyFriendsWithHostId();
            let random_friend = randomElement(friends);
            let week_name = await getMyHostLastWeekName();
            return {to:`/posts/${random_friend}/${host_id}/${week_name}/${HANDLING_EVENTS.OhPreview}`,options:{state:{token:true}}}
        }
        const getThrowBackNavigator=async ()=>{
            let [me,host_id]  =getMeAndMyHostId()
            let week_name = await getMyHostLastWeekName();
            return {to:`/posts/${me.fullname}/${host_id}/${week_name}/${HANDLING_EVENTS.ThrowBack}`,options:{state:{token:true}}}
        }

        switch(event)
        { 
            case HANDLING_EVENTS.DayUploads: return {to:"/uploads/day",options:{state:{token:true}}}
            case HANDLING_EVENTS.WeekUploads: return {to:"/uploads/week",options:{state:{token:true}}}
            case HANDLING_EVENTS.OneShot: return getOneShotNavigator();
            case HANDLING_EVENTS.MorningShot: return getMorningShotNavigator();
            case HANDLING_EVENTS.OhPreview: return getOhPreviewNavigator();
            case HANDLING_EVENTS.ThrowBack: return getThrowBackNavigator();
            default: return null;
        }
    }

    if(isNothingToShow) return <NothingToShow goback/>
    return <div></div>
}
 
export default DayEventPage;