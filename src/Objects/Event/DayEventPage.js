import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NothingToShow from '../../Pages/NothingToShow';
import { AuthContext } from '../../Contexts/AuthContext';
import Loading from '../../Pages/Loading';
import {  randomElement } from '../../aFunctions';
import { DayEvent } from './DayEvent';
import { Event } from './Event';

const DayEventPage = () => {

    const {event} = useParams();
    const navigate = useNavigate();

    const {getMyFriendsWithHostId,getMeAndMyHostId,getFriendCurrentDayRandomPost,getMyHostLastWeekName} = useContext(AuthContext);

    const [isNothingToShow,setIsNothingToShow]=useState(false);

    useEffect(()=>{
        let day_event = DayEvent.fromString(event);
        if(!Event.canViewPage(day_event)) navigate("/");

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
        const getOneShotNavigator=()=>{
            let [friends,]= getMyFriendsWithHostId();
            let friends_random = friends.sort(() => 0.5 - Math.random());
            let tos =[];
            friends_random.every(async (friend)=>{
                let post = await getFriendCurrentDayRandomPost(friend)
                if(post) tos.push(`/post/${friend}/${post.id}/${DayEvent.OneShot.toString()}`)
                if(tos.length<3) return true;
            })

            if(tos.length===0) return null;
            return {to:tos[0],options:{state:{nextPages: tos.slice(1)}}}
        }
        const getOhPreviewNavigator=async()=>{
            let [friends,host_id]= getMyFriendsWithHostId();
            let random_friend = randomElement(friends);
            let week_name = await getMyHostLastWeekName();
            return {to:`/posts/${random_friend}/${host_id}/${week_name}/${DayEvent.OhPreview.toString()}`}
        }
        const getThrowBackNavigator=async ()=>{
            let [me,host_id]  =getMeAndMyHostId()
            let week_name = await getMyHostLastWeekName();
            return {to:`/posts/${me.fullname}/${host_id}/${week_name}/${DayEvent.ThrowBack.toString()}`}
        }

        switch(event)
        {
            case DayEvent.DayUploads: return {to:"/uploads/day"}
            case DayEvent.WeekUploads: return {to:"/uploads/week"}
            case DayEvent.OneShot: return getOneShotNavigator();
            case DayEvent.OhPreview: return getOhPreviewNavigator();
            case DayEvent.ThrowBack: return getThrowBackNavigator();
            default: return null;
        }
    }

    if(isNothingToShow) return <NothingToShow/>
    return <Loading/>
}
 
export default DayEventPage;