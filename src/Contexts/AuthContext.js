import React, {  useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "./UserContext";
import { TeamContext } from "./TeamContext";
import { WeekContext } from "./WeekContext";
import { PostContext } from "./PostContext";
import { NOW, weekEqual } from "../aFunctions";
import Loading from "../Pages/Loading";

export const AuthContext = React.createContext();

const AuthProvider = ({children}) => {

    const userRef = useRef(null);
    const teamRef = useRef(null);
    const weekRef = useRef(null);

    const [authLoaded,setAuthLoaded] = useState(false);

    useEffect(()=>{
        const loadUser= async ()=>{
            let fullname = localStorage.getItem("fullname");
            if(fullname === null) return null;
            let user = await getUser(fullname)
            if(user==null) return null;//new Error('Fullname in localStorage is invalid. Cannot find fullname in database.');
            userRef.current = user;
            return userRef.current;
        }

        const loadTeam = async(me)=>{
            if(me ===null || me.teams==null || me.teams.length===0) return null
            let defaultTeam = await getTeam(me.teams[0]  )
            if(defaultTeam==null) throw new Error('User default team is invalid. Cannot find team in database.');
            teamRef.current = defaultTeam;
            return teamRef.current;
        }

        const loadWeek = async(team)=>{
            if(team==null) return null;
            let week = await getTeamWeek(team.id)
            weekRef.current = week;
            return weekRef.current;
        }
      
        loadUser().then((me)=>{
            loadTeam(me).then((team)=>{
                loadWeek(team).then(()=>
                    setAuthLoaded(true));
            })
        })

    },[])

    //USER CONTEXT

    const {getUser,getUserByUsername,
        trySetUsername,setPersonalizedApps} = useContext(UserContext)

    const tryLogMeInTemporarly = async (username)=>{
        let user = await getUserByUsername(username)

        if(user===undefined) return false;

        userRef.current = user;
        return true;
    }

    const saveMe =()=>{
        if(userRef.current===null) throw new Error('Cannot save. UserRef is null');
        localStorage.setItem("fullname",userRef.current.fullname);
    }
    
    const getMe = ()=>{//returns user or null
        return userRef.current;
    }

    const trySetMyUsername= async (username)=>{
        let [me,team]=getMeAndMyTeam();
        let res =  await trySetUsername(me.fullname,username,team.members.map(member=>member.user_fullname))
        return res;
    }

    const setMyPersonalizedApps = async (apps)=>{
        let me = getMe();
        return setPersonalizedApps(me.fullname,apps)
    }


    //TEAM CONTEXT

    const {getTeam} = useContext(TeamContext)

    const getMyTeam = ()=>{//returns team or null ; zwraca pierwszy team
        return teamRef.current;
    }

    //WEEK CONTEXT

    const {getTeamWeek,setTeamWeekScreenkaView,getTeamWeekScreenkaViews} = useContext(WeekContext)

    const getMyWeek=()=>{//returns week or null
        return weekRef.current;
    }

    const amIScreenkaViewLocal = (team_id)=>{
        let date = localStorage.getItem(`screenka_view_${team_id}`);
        return date!=null && weekEqual(Date.parse(date),NOW);
    }

    const amIScreenkaView = async (team_id,week_name)=>{
        let me = getMe();
        if(me==null) return false;
        let screenkaViews = await getTeamWeekScreenkaViews(team_id,week_name);
        if(screenkaViews==null) return false;
        return screenkaViews.some(view=>view.user_fullname==me.fullname);
    }

    const setMyScreenkaView = async(team_id,week_name)=>{//team_id, week_name - ala klucze do wysetowania
        let me = getMe();
        if(me==null) return;
        localStorage.setItem(`screenka_view_${team_id}`,NOW);
        return setTeamWeekScreenkaView(team_id,week_name, me.fullname)
    }

    //POST CONTEXT
    const {getUserDayPosts,getUserWeekPosts}=useContext(PostContext);

    const getMyDayUploads = async ()=>{
        let me = getMe();
        if(me==null) return null;
        return getUserDayPosts(me.fullname);
    }

    const getMyWeekUploads = async ()=>{
        let me = getMe();
        if(me==null) return null
        let week = getMyWeek();
        if(week == null) return null
        return getUserWeekPosts(me.fullname,week.name);
    }

    //MIX

    const getMeAndMyTeam=()=>{
        let me = getMe();
        let team = getMyTeam();
        return [me,team];
    }

    const getMeAndMyTeamAndMyWeek=()=>{
        let me = getMe();
        let team = getMyTeam();
        let week = getMyWeek();
        return [me,team,week];
    }

    const value = {  tryLogMeInTemporarly,saveMe,getMe,
                                getMyTeam,
                                getMyWeek,
                                getMyDayUploads,getMyWeekUploads,
                                getMeAndMyTeam,getMeAndMyTeamAndMyWeek,

                                trySetMyUsername,setMyPersonalizedApps,
                                setMyScreenkaView,amIScreenkaView,amIScreenkaViewLocal }
    return ( 
    <AuthContext.Provider value={value}>
        {authLoaded ? children : <Loading/>}
    </AuthContext.Provider> );
}

export default AuthProvider;