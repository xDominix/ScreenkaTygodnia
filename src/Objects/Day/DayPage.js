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

const DayPage = () => {

    const {name} = useParams();
    const navigate = useNavigate();
    const getDay = ()=>{switch(name){
        case "ohpreview": return Day.OhPreview
        case "throwback": return Day.ThrowBack
        case "oneshot": return Day.OneShot;
        default: return Day.Default
    }}

    const {amIViewLocal,getMeAndMyTeam,getMyTeamWeekNames,getMeAndMyTeamAndMyWeek} = useContext(AuthContext);
    const {getUserDayPosts,getUserWeekPosts} = useContext(PostContext);
    const {getTeamWeekNames} = useContext(WeekContext);

    const [isNothingToShow,setIsNothingToShow]=useState(false);

    useEffect(()=>{
        const [,,week] = getMeAndMyTeamAndMyWeek();
        if(TimeFor.Day(getDay(),week) && !amIViewLocal(getDay().toString())) navigate("/");

        const timeout = setTimeout(()=>{
            let nav = getNavigator(getDay());
            if(nav==null) setIsNothingToShow(true);
            else  navigate(nav);
        },1000)

        return ()=>clearTimeout(timeout)
    },[])

    //navigate
    const getNavigator=async (day)=>{
    
        if(day===Day.OneShot)
        {
            let [_,team] = getMeAndMyTeam();
            let members = team.members//.filter(member=>member.fullname!==me.fullname)
            if(members?.length===0) return null;
            let randomMember = randomElement(members);
            let memberPosts = await getUserDayPosts(randomMember.fullname);
            memberPosts?.filter(post=>post.comment_user_fullname == null);
            if(memberPosts.length===0)
            {
                memberPosts = await getUserWeekPosts(randomMember.fullname);
                memberPosts?.filter(post=>post.comment_user_fullname == null);
            } 
            if(memberPosts?.length===0) return null;
            let randomPost = randomElement(memberPosts);

            return `/post/${randomPost.user_fullname}/${randomPost.id}/oneshot`
        }
        else if (day===Day.ThrowBack)
        {
            let [me,team] = getMeAndMyTeam();
            let my_start_date = team.members?.find(member=>member.fullname===me.fullname)?.start_date;
            let week_names = await getMyTeamWeekNames(my_start_date);
            if(week_names?.length===0) return null;
            let randomWeekName = randomElement(week_names);
            return  `/posts/${me.fullname}/${team.id}/${randomWeekName}/throwback`
        }
        else if (day===Day.OhPreview)
        {
            let [me,team] = getMeAndMyTeam();
            let members = team.members.filter(member=>member.fullname!==me.fullname)
            if(members?.length===0) return null;
            let randomMember = randomElement(members);
            let week_names = await getTeamWeekNames(team.id,randomMember.start_date);
            if(week_names?.length===0) return null;
            let randomWeekName = randomElement(week_names);
            return  `/posts/${randomMember.fullname}/${team.id}/${randomWeekName}/ohpreview`
        }
        else return null
    
    }

    if(isNothingToShow) return <NothingToShow/>
    return <Loading/>
}
 
export default DayPage;
