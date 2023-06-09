import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NothingToShow from '../../Pages/NothingToShow';
import { AuthContext } from '../../Contexts/AuthContext';
import {  randomElement } from '../../aFunctions';
import { DayEvent } from './DayEvent';
import { Event } from './Event';

const DayEventPage = () => { // dla day_eventow ktore maja page (hasPage)

    const {event} = useParams();
    const navigate = useNavigate();

    const {user,getMyFriendsWithHostId,getMeAndMyHostId,getFriendCurrentDayRandomPost,getMyHostLastWeekName,getMyYesterdayRandomPost} = useContext(AuthContext);

    const [isNothingToShow,setIsNothingToShow]=useState(false);

    useEffect(()=>{
        let day_event = Event.fromString(event);
        if(!Event.canView(day_event)) {navigate("/"); return;}

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
                if (post)   tos.push(`/post/${friend}/${post.id}/${DayEvent.OneShot.toString()}`);
                if (tos.length >= 3) break;
            }
            if(tos.length===0) return null;
            return {to:tos[0],options:{state:{token:true,nextPages: tos.slice(1),showMyRefPosts:true}}}
        }
        const getMorningShotNavigator=async ()=>{
            let post = await getMyYesterdayRandomPost(); if(!post) return null;
            return {to:`/post/${user.fullname}/${post.id}/${DayEvent.MorningShot.toString()}`,options:{state:{token:true,showMyRefPosts:true,showFriendsRefPosts:true}}};//show na poprawe i zaskocznie, w koncu DayUploads ukrywaja friends interactions
        }
        const getOhPreviewNavigator=async()=>{
            let [friends,host_id]= getMyFriendsWithHostId();
            let random_friend = randomElement(friends);
            let week_name = await getMyHostLastWeekName();
            return {to:`/posts/${random_friend}/${host_id}/${week_name}/${DayEvent.OhPreview.toString()}`,options:{state:{token:true}}}
        }
        const getThrowBackNavigator=async ()=>{
            let [me,host_id]  =getMeAndMyHostId()
            let week_name = await getMyHostLastWeekName();
            return {to:`/posts/${me.fullname}/${host_id}/${week_name}/${DayEvent.ThrowBack.toString()}`,options:{state:{token:true}}}
        }

        switch(event)
        { 
            case DayEvent.DayUploads: return {to:"/uploads/day",options:{state:{token:true}}}
            case DayEvent.WeekUploads: return {to:"/uploads/week",options:{state:{token:true}}}
            case DayEvent.OneShot: return getOneShotNavigator();
            case DayEvent.MorningShot: return getMorningShotNavigator();
            case DayEvent.OhPreview: return getOhPreviewNavigator();
            case DayEvent.ThrowBack: return getThrowBackNavigator();
            default: return null;
        }
    }

    if(isNothingToShow) return <NothingToShow goback/>
    return <div></div>
}
 
export default DayEventPage;