import React, {  useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "./UserContext";
import { HostContext } from "./HostContext";
import { WeekContext } from "./WeekContext";
import { PostContext } from "./PostContext";
import { MAX_SCREENKA, NOW, isLessThenMinutes, weekEqual } from "../aFunctions";
import Loading from "../Pages/Loading";

export const AuthContext = React.createContext();

const AuthProvider = ({children}) => {

    const userRef = useRef(null);
    const hostRef = useRef(null);
    const friendsFullnamesRef = useRef(null);
    const weekRef = useRef(null);
    const [weekSnapshot,setWeekSnapshot] = useState(null);

    const [authLoaded,setAuthLoaded] = useState(false);

    const {getUser,getUserByUsername,
        trySetUsername,setPersonalizedApps} = useContext(UserContext)

    const {getHost,getHostWeekNumber} = useContext(HostContext)

    const {getHostWeek,getHostWeekNames,setHostWeekScreenkaView,getHostWeekSpecialDays,onWeekSnapshot} = useContext(WeekContext)

    const {getUserDayPosts,getUserWeekPosts,setUserPostComment}=useContext(PostContext);

    const loadUser= async ()=>{
        let fullname = localStorage.getItem("fullname");
        if(fullname === null) return null;
        let user = await getUser(fullname)
        if(user==null) return null;//new Error('Fullname in localStorage is invalid. Cannot find fullname in database.');
        userRef.current = user;
        return userRef.current;
    }

    const loadHost = async(me)=>{
        if(me ===null || me.hosts==null || me.hosts.length===0) return null
        let defaultHost = await getHost(me.hosts[0]  )
        if(defaultHost==null) throw new Error('User default host is invalid. Cannot find host in database.');
        hostRef.current = defaultHost;
        return hostRef.current;
    }

    const loadWeek = async(host)=>{
        if(host==null) return null;
        let week = await getHostWeek(host.id);
        weekRef.current= week;
        return weekRef.current;
    }

    useEffect(()=>{
        loadUser().then((me)=>{
            loadHost(me).then((host)=>{
                if(me && host) friendsFullnamesRef.current = host.getFriendsFullnames(me.fullname);

                loadWeek(host).then((week)=> 
                    {
                        setAuthLoaded(true);

                        if(!week) return;
                        const unsubscribe = onWeekSnapshot(host.id,week.name,(doc) => { console.log("Week updated");setWeekSnapshot(doc) });
                        return () => unsubscribe()
                    })
            }) 
        })
    },[]) // eslint-disable-line react-hooks/exhaustive-deps

    //USER CONTEXT
    const tryLogMeInTemporarly = async (username)=>{
        
        let user = await getUserByUsername(username)

        if(user==null) return false;

        userRef.current = user;
        loadHost(user).then((host)=>{
            if(user && host) friendsFullnamesRef.current = host.getFriendsFullnames(user.fullname);
            loadWeek(host)
        })
        return true;
    }

    const saveMe =()=>{
        if(userRef.current===null) throw new Error('Cannot save. UserRef is null');
        localStorage.setItem("fullname",userRef.current.fullname);
    }
    
   

    const trySetMyUsername= async (username)=>{
        let [me,host]=getMeAndMyHost();
        let res =  await trySetUsername(me.fullname,username,host.members_fullnames);
        return res;
    }

    const setMyPersonalizedApps = async (apps)=>{
        let me = getMe();
        return setPersonalizedApps(me.fullname,apps)
    }


    //Host CONTEXT
    const getMyHostWeekNumber =  ()=>{
        let [,host] = getMeAndMyHost()
        return getHostWeekNumber(host);
    }
    
    //WEEK CONTEXT
    const getMyHostWeekNames = async (from_date)=>{
        let [,host] = getMeAndMyHost()
        return getHostWeekNames(host.id,from_date);
    }

    const getMyHostWeekSpecialDays=async()=>{
        let [,host,week]=getMeAndMyHostAndMyWeek();
        return getHostWeekSpecialDays(host.id,week.name);
    }

    /*
    const amIScreenkaView = async (host_id,week_name)=>{
        let me = getMe();
        if(me==null) return false;
        let screenkaViews = await getHostWeekScreenkaViews(host_id,week_name);
        if(screenkaViews==null) return false;
        return screenkaViews.some(view=>view.user_fullname===me.fullname);
    }
    */

    const setMyScreenkaView = async(host_id,week_name)=>{//host_id, week_name - ala klucze do wysetowania
        let me = getMe();
        if(me==null) return;
        let count_str = localStorage.getItem("screenka_count_"+host_id);
        localStorage.setItem("screenka_count_"+host_id,count_str?(Number(count_str)+1):1)
        setMyViewLocal("screenka",host_id);
        if(!count_str) return setHostWeekScreenkaView(host_id,week_name, me.fullname)
    }
    const amIScreenkaViewLocal = (host_id)=>{
        let count_str = localStorage.getItem("screenka_count_"+host_id)
        if(amIViewLocal("screenka",host_id)) return Number(count_str) >= MAX_SCREENKA;
        localStorage.removeItem("screenka_count_"+host_id);
        return false;
    }

    //POST CONTEXT
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
    const setHideIfAppsState=(user,host)=>{
        let diff = host.personalized_apps.filter(app => !user.personalized_apps.includes(app));
        setHideIfAppsState2(diff);
    }

    //MIX

    const getMe = ()=>{//returns user or null
        return userRef.current;
    }

    const getMeAndMyHost=()=>{
        let me = userRef.current;
        let host = hostRef.current;
        return [me,host];
    }

    const getMeAndMyHostAndMyWeek=()=>{
        let me = userRef.current;
        let host = hostRef.current;
        let week = weekRef.current;
        return [me,host,week];
    }

    const getMyFriendsFullnames = ()=>{
        return friendsFullnamesRef.current;
    }

    /* LOCALS */
    const amIViewLocal = (name,host_id=null)=>{
        if(!host_id) host_id = getMeAndMyHost()[1]?.id;
        let date = localStorage.getItem(`${name}_view_${host_id}`);
        date = new Date(date);
        if(name==="oneshot") return date!=null && isLessThenMinutes(date,12*60);
        if(name==="rnshot") return date!=null && isLessThenMinutes(date,5);
        return date!=null && weekEqual(Date.parse(date),NOW());
    }
    const setMyViewLocal = (name,host_id=null)=>{
        if(!host_id) host_id = getMeAndMyHost()[1]?.id;
        localStorage.setItem(`${name}_view_${host_id}`,NOW());
    }
    
    const value = {  tryLogMeInTemporarly,saveMe,getMe,//me
                                getMyHostWeekNumber,//host
                                getMyHostWeekNames,weekSnapshot,getMyHostWeekSpecialDays,//week
                                getMyDayUploads,getMyWeekUploads,setMyUserPostComment,hideIfAppsState,setHideIfAppsState, //post
                                getMeAndMyHost,getMeAndMyHostAndMyWeek, //getters

                                trySetMyUsername,setMyPersonalizedApps, //setters
                                
                                
                                amIScreenkaViewLocal,setMyScreenkaView, //Screenka
                                amIViewLocal,setMyViewLocal ,//view local
                                getMyFriendsFullnames}
    return ( 
    <AuthContext.Provider value={value}>
        {authLoaded ? children : <Loading logo/>}
    </AuthContext.Provider> );
}

export default AuthProvider;

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
 
         if(auth) getUserHostWeekPosts(user_fullname,host_id,week_name).then(posts=>posts==null?navigate("/"):setPosts(posts));
 
         const requestTimeout = setTimeout(()=>{
             if(!auth) navigate("/");
         },3000)
         return ()=>clearTimeout(requestTimeout);        
     },[auth]);
     // END AUTH 
     */