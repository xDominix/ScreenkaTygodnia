import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NothingToShow from '../../Pages/NothingToShow';
import TimeFor from '../TimeFor';
import { AuthContext } from '../../Contexts/AuthContext';
import { Day } from './Day';
import Loading from '../../Pages/Loading';
import { PostContext } from '../../Contexts/PostContext';
import { randomElement } from '../../aFunctions';
import { WeekContext } from '../../Contexts/WeekContext';
import { HostContext } from '../../Contexts/HostContext';

const DayPage = () => {

    const {name} = useParams();
    const navigate = useNavigate();
    const getDay = ()=>{switch(name){
        case "ohpreview": return Day.OhPreview
        case "throwback": return Day.ThrowBack
        case "oneshot": return Day.OneShot;
        default: return Day.Default
    }}

    const {amIViewLocal,getMeAndMyHost,getMyHostWeekNames,getMyHostWeekNumber} = useContext(AuthContext);
    const {getUserDayPosts,getUserWeekPosts} = useContext(PostContext);
    const {getHostMembers} = useContext(HostContext)
    const {getHostWeekNames} = useContext(WeekContext);

    const [isNothingToShow,setIsNothingToShow]=useState(false);

    useEffect(()=>{
        const weekNumber = getMyHostWeekNumber();
        if(TimeFor.Day(getDay(),weekNumber) && !amIViewLocal(getDay().toString())) navigate("/");

        const timeout = setTimeout(()=>{
            let nav = getNavigator(getDay());
            if(nav==null) setIsNothingToShow(true);
            else  navigate(nav);
        },1000)

        return ()=>clearTimeout(timeout)
    },[]) //eslint-disable-line react-hooks/exhaustive-deps

    //navigate
    const getNavigator=async (day)=>{
    
        if(day===Day.OneShot)
        {
            let [me,host] = getMeAndMyHost();
            let members_fullnames = host.members_fullnames//.filter(fullname=>fullname!==me.fullname)
            if(members_fullnames?.length===0) return null;
            let randomFullname = randomElement(members_fullnames);
            let memberPosts = await getUserDayPosts(randomFullname);
            memberPosts?.filter(post=>post.comment_user_fullname == null);
            memberPosts?.filter(post=>me.personalized_apps?.includes(post.app) || host.popular_apps.includes(post.app))
            if(memberPosts.length===0)
            {
                memberPosts = await getUserWeekPosts(randomFullname);
                memberPosts?.filter(post=>post.comment_user_fullname == null);
                memberPosts?.filter(post=>me.personalized_apps?.includes(post.app) || host.popular_apps.includes(post.app))
            } 
            if(memberPosts?.length===0) return null;
            let randomPost = randomElement(memberPosts);

            return `/post/${randomPost.user_fullname}/${randomPost.id}/oneshot`
        }
        else if (day===Day.ThrowBack)
        {
            let [me,host] = getMeAndMyHost();
            let my_start_date = getHostMembers(host.id)?.find(member=>member.fullname===me.fullname)?.start_date;
            let week_names = await getMyHostWeekNames(my_start_date);
            if(week_names?.length===0) return null;
            let randomWeekName = randomElement(week_names);
            return  `/posts/${me.fullname}/${host.id}/${randomWeekName}/throwback`
        }
        else if (day===Day.OhPreview)
        {
            let [me,host] = getMeAndMyHost();
            let members = getHostMembers(host.id).filter(member=>member.fullname!==me.fullname)
            if(members?.length===0) return null;
            let randomMember = randomElement(members);
            let week_names = await getHostWeekNames(host.id,randomMember.start_date);
            if(week_names?.length===0) return null;
            let randomWeekName = randomElement(week_names);
            return  `/posts/${randomMember.fullname}/${host.id}/${randomWeekName}/ohpreview`
        }
        else return null
    
    }

    if(isNothingToShow) return <NothingToShow/>
    return <Loading/>
}
 
export default DayPage;
