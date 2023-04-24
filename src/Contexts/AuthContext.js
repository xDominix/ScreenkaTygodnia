import React, {  useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "./UserContext";
import { TeamContext } from "./TeamContext";
import { WeekContext } from "./WeekContext";
import { PostContext } from "./PostContext";
import { NOW, isLessThenMinutes, weekEqual } from "../aFunctions";
import Loading from "../Pages/Loading";

export const AuthContext = React.createContext();

const AuthProvider = ({children}) => {

    const userRef = useRef(null);
    const teamRef = useRef(null);
    const weekRef = useRef(null);

    /*
    const routingPermission = useRef(false);
    const tryUseRoutingPermission = ()=> {if(ADMIN) return true; if(routingPermission.current !=true) return false; routingPermission.current=false; return true;}
    const setRoutingPermission = ()=> {routingPermission.current=true;}
    
     //START AUTH  in component after setRoutingPermission
     const navigate = useNavigate();
     const {tryUseRoutingPermission} = useContext(AuthContext);
     const [auth,setAuth] = useState(false);
     useEffect(()=>{
         if(!auth) if(tryUseRoutingPermission() || ADMIN) setAuth(true);
 
         if(auth) getUserTeamWeekPosts(user_fullname,team_id,week_name).then(posts=>posts==null?navigate("/"):setPosts(posts));
 
         const requestTimeout = setTimeout(()=>{
             if(!auth) navigate("/");
         },3000)
         return ()=>clearTimeout(requestTimeout);        
     },[auth]);
     // END AUTH 
     */

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
            let week = await getTeamWeek(team.id);
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

    const {getTeam,getTeamWeekNumber} = useContext(TeamContext)

    const getMyTeamWeekNumber =  ()=>{
        let [_,team] = getMeAndMyTeam()
        return getTeamWeekNumber(team);
    }
    
    //WEEK CONTEXT

    const {getTeamWeek,getTeamWeekNames,setTeamWeekScreenkaView,getTeamWeekScreenkaViews} = useContext(WeekContext)

    const getMyTeamWeekNames = (from_date)=>{
        let [_,team] = getMeAndMyTeam()
        return getTeamWeekNames(team.id,from_date);
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
        setMyViewLocal("screenka",team_id);
        return setTeamWeekScreenkaView(team_id,week_name, me.fullname)
    }
    const amIScreenkaViewLocal = (team_id)=>{
        return amIViewLocal("screenka",team_id);
    }

    //POST CONTEXT
    const {getUserDayPosts,getUserWeekPosts,setUserPostComment}=useContext(PostContext);

    const getMyDayUploads = async ()=>{
        let me = getMe();
        if(me==null) return null;
        return getUserDayPosts(me.fullname);
    }

    const getMyWeekUploads = async ()=>{
        let me = getMe()
        return getUserWeekPosts(me.fullname);
    }

    const setMyUserPostComment = async (user_fullname,id,comment=null)=>{
        let me = getMe();
        setUserPostComment(user_fullname,id,me.fullname,comment)
    }

    //post extra
    const [hideIfAppsState,setHideIfAppsState2]=useState();
    const setHideIfAppsState=(user,team)=>{
        let diff = team.personalized_apps.filter(app => !user.personalized_apps.includes(app));
        setHideIfAppsState2(diff);
    }

    //MIX

    const getMe = ()=>{//returns user or null
        return userRef.current;
    }

    const getMeAndMyTeam=()=>{
        let me = userRef.current;
        let team = teamRef.current;
        return [me,team];
    }

    const getMeAndMyTeamAndMyWeek=()=>{
        let me = userRef.current;
        let team = userRef.current;
        let week = weekRef.current;
        return [me,team,week];
    }

    /* LOCALS */
    const amIViewLocal = (name,team_id=null)=>{
        if(!team_id) team_id = getMeAndMyTeam()[1]?.id;
        let date = localStorage.getItem(`${name}_view_${team_id}`);
        date = new Date(date);
        if(name==="oneshot") return date!=null && isLessThenMinutes(date,12*60);
        if(name==="rnshot") return date!=null && isLessThenMinutes(date,5);
        return date!=null && weekEqual(Date.parse(date),NOW);
    }
    const setMyViewLocal = (name,team_id=null)=>{
        if(!team_id) team_id = getMeAndMyTeam()[1]?.id;
        localStorage.setItem(`${name}_view_${team_id}`,NOW);
    }
    
    
    const value = {  tryLogMeInTemporarly,saveMe,getMe,//me
                                getMyTeamWeekNumber,//team
                                getMyTeamWeekNames,//week
                                getMyDayUploads,getMyWeekUploads,setMyUserPostComment,hideIfAppsState,setHideIfAppsState, //post
                                getMeAndMyTeam,getMeAndMyTeamAndMyWeek, //getters

                                trySetMyUsername,setMyPersonalizedApps, //setters
                                
                                
                                amIScreenkaViewLocal,setMyScreenkaView,amIScreenkaView, //Screenka
                                amIViewLocal,setMyViewLocal }//view local
    return ( 
    <AuthContext.Provider value={value}>
        {authLoaded ? children : <Loading logo/>}
    </AuthContext.Provider> );
}

export default AuthProvider;