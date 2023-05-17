import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NothingToShow from '../../Pages/NothingToShow';
import TimeFor from '../TimeFor';
import { AuthContext } from '../../Contexts/AuthContext';
import { Day } from './Day';
import Loading from '../../Pages/Loading';
import { randomElement } from '../../aFunctions';

const DayPage = () => {

    const {name} = useParams();
    const navigate = useNavigate();
    const getDay = ()=>{switch(name){
        case "ohpreview": return Day.OhPreview
        case "throwback": return Day.ThrowBack
        case "oneshot": return Day.OneShot;
        default: return Day.Default
    }}

    const {amIViewLocal,getMeAndMyHost,getMyHostWeekNames,getMyHostWeekNumber,getMyFriendsFullnames,PostService,WeekService} = useContext(AuthContext);

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
            let [me,host]= getMeAndMyHost();
            let friends = getMyFriendsFullnames();
            if(friends)return null;
            let randomFullname = randomElement(friends);
            let post =  PostService.getUserOneShotPost(randomFullname,[...me.personalized_apps,...host.popular_apps]);
            if(!post) return null; 
            return `/post/${post.user_fullname}/${post.id}/oneshot`
        }
        else if (day===Day.ThrowBack)
        {
            let [me,host] = getMeAndMyHost();
            let join_date = host.members_map.get(me.fullname).join_date;
            let week_names = await getMyHostWeekNames(join_date);
            if(week_names?.length===0) return null;
            let randomWeekName = randomElement(week_names);
            return  `/posts/${me.fullname}/${host.id}/${randomWeekName}/throwback`
        }
        else if (day===Day.OhPreview)
        {
            let [,host] = getMeAndMyHost();
            if(!host.members_map || host.members_map.length===0) return null;
            let randomFullname = randomElement(host.members_map.keys());
            let randomJoindate = host.members_map.get(randomFullname).join_date;
            let week_names = await WeekService.getHostWeekNames(host.id,randomJoindate);
            if(week_names?.length===0) return null;
            let randomWeekName = randomElement(week_names);
            return  `/posts/${randomFullname}/${host.id}/${randomWeekName}/ohpreview`
        }
        else return null
    
    }

    if(isNothingToShow) return <NothingToShow/>
    return <Loading/>
}
 
export default DayPage;
