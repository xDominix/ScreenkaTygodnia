import React, {  useEffect, useRef, useState } from "react";
import { MAX_SCREENKA, NOW, isLessThenMinutes, weekEqual } from "../aFunctions";
import Loading from "../Pages/Loading";
import { useHostService } from "../Services/HostService";
import { useUserService } from "../Services/UserService";
import { useWeekService } from "../Services/WeekService";
import { usePostService } from "../Services/PostService";

export const AuthContext = React.createContext();

const AuthProvider = ({children, demo}) => {

    const userRef = useRef(null);
    const hostRef = useRef(null);
    const friendsRef = useRef([]); //array
    const [weekState,setWeekState] = useState(null);

    const dayUploads = useRef(null);
    const weekUploads=useRef(null);
    const ticketsRef = useRef(0);
    
    const [authLoaded,setAuthLoaded] = useState(false);

    const {getUser,getUserByUsername,trySetUsername,trySetPersonalizedApps} = useUserService(demo);
    const {getHost,getHostWeekNumber} = useHostService(demo);
    const {getHostWeek,getHostWeekNames,trySetHostWeekScreenkaView,onWeekSnapshot} = useWeekService(demo);
    const {getUserDayPosts,getUserWeekPosts,getUserPostTicketsUsed,trySetUserPostComment,postPost}=usePostService(demo);

    const loadAll = async()=>{
        const loadUser= async ()=>{
            const loadTickets = async (me)=>{
                if(!me)return;
                let ticketsUsed = await getUserPostTicketsUsed(me.fullname);
                ticketsRef.current = Math.max(getMaxTickets()-ticketsUsed,0);
            }

            let fullname = localStorage.getItem("fullname");
            if(fullname === null) return null;
            let user = await getUser(fullname)
            if(user==null) return null;//new Error('Fullname in localStorage is invalid. Cannot find fullname in database.');
            loadTickets(user);
            userRef.current = user;
            return userRef.current;
        }
    
        const loadHost = async(me)=>{
            if(me ===null || me.hosts==null || me.hosts.length===0) return null
            let defaultHost = await getHost(me.hosts[0]  )
            if(defaultHost==null) throw new Error('User default host is invalid. Cannot find host in database.');
            if(defaultHost.members_map.has(me.fullname)) hostRef.current = defaultHost;
            friendsRef.current = defaultHost.getFriendsFullnames(me.fullname);
            return hostRef.current;
        }
    
        const loadWeek = async(host)=>{
            if(host==null) return null;
            let week = await getHostWeek(host.id);
            setWeekState(week);
            return week;
        }

        const loadUserPromise = userRef.current !== null ? Promise.resolve(userRef.current) : loadUser();
        return loadUserPromise.then(loadHost).then(loadWeek).then(()=> setAuthLoaded(true));
    }

    useEffect(()=>{
        loadAll();
    },[]) // eslint-disable-line react-hooks/exhaustive-deps

    const isWeekState = weekState!==null;
    useEffect(()=>{
        if(!isWeekState) return;
        const unsubscribe = onWeekSnapshot(hostRef.current.id,weekState.name,(doc) => { console.log("Week updated");setWeekState(doc) });
        return () => unsubscribe()
    },[isWeekState]) // eslint-disable-line react-hooks/exhaustive-deps

    //USER CONTEXT
    const tryLogMeInTemporarly = async (username)=>{ //gdy ustawisz sobie username o takiej samej nazwie co inny uzytkownik to pisz do admina
        return getUserByUsername(username)
            .then(user=>{if(user==null) return false;
            userRef.current = user;   loadAll(); return true; });
    }
    const saveMe =()=>{
        if(userRef.current===null) throw new Error('Cannot save. UserRef is null');
        localStorage.setItem("fullname",userRef.current.fullname);
    }
    
    const trySetMyUsername= async (username)=>{
        let me=getMe();
        let res =  await trySetUsername(me.fullname,username);
        return res;
    }

    const trySetMyPersonalizedApps = async (apps)=>{
        let me = getMe();
        return trySetPersonalizedApps(me.fullname,apps)
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

    const trySetMyScreenkaView = async(host_id,week_name)=>{//host_id, week_name - ala klucze do wysetowania
        let me = getMe();
        if(me==null) return false;
        let count_str = localStorage.getItem("screenka_count_"+host_id);
        localStorage.setItem("screenka_count_"+host_id,count_str?(Number(count_str)+1):1)
        setMyViewLocal("screenka",host_id);
        if(!count_str) return trySetHostWeekScreenkaView(host_id,week_name, me.fullname);
        return true;
    }
    const amIScreenkaViewLocal = (host_id)=>{
        let count_str = localStorage.getItem("screenka_count_"+host_id)
        if(amIViewLocal("screenka",host_id)) return Number(count_str) >= MAX_SCREENKA;
        localStorage.removeItem("screenka_count_"+host_id);
        return false;
    }

    //POST CONTEXT
    const getMyDayUploads = async ()=>{
        const loadMyDayUploads=async (me_fullname)=>{
            const getTicketsUsed=(posts)=>posts.filter(post=>post.screenkaOn).length;
            return getUserDayPosts(me_fullname).then(posts=>{
                    dayUploads.current=posts;
                    ticketsRef.current = Math.max(getMaxTickets()-getTicketsUsed(posts),0);
            }); 
        }

        if(getMe()==null) throw new Error("no login");
        if(dayUploads.current==null) await loadMyDayUploads(getMe().fullname);
        return dayUploads.current; 
    }
    const getMyAppsCounts= async()=>{
        if(getMe()==null) return null;
        let posts = await getMyWeekUploads();
        let counts = {};
        posts?.forEach(function (post) { counts[post.app] = (counts[post.app] || 0) + 1; });
        return new Map(Object.entries(counts));
    }

    const getMyWeekUploads = async ()=>{
        const loadMyWeekUploads=async (me_fullname)=>{
            return getUserWeekPosts(me_fullname).then(posts=>{
                    weekUploads.current=posts;
            }); 
        }

        if(getMe()==null) throw new Error("no login");
        if(weekUploads.current==null) await loadMyWeekUploads(getMe().fullname);
        return weekUploads.current; 
    }

    const trySetMyUserPostComment = async (user_fullname,id,comment)=>{
        let me = getMe();
        return trySetUserPostComment(user_fullname,id,me.fullname,comment)
    }

    const getTickets = ()=>ticketsRef.current;
    const getMaxTickets = ()=>{
        const [,host,week] = getMeAndMyHostAndMyWeek();
        return week?.max_tickets?week.max_tickets: (host?.max_tickets?host.max_tickets:0);
    }

    const postMyPost = async (post, file)=>{
        let [me,host,week] = getMeAndMyHostAndMyWeek();
        if(ticketsRef.current<=0) post.screenkaOn=false;
        post.host_id = host? host.id : null;
        post.week_name = week? week.name : null;
        post.upload_date = NOW();

        return postPost(me.fullname,post,file)
            .then(()=>ticketsRef.current = Math.max(ticketsRef.current-1,0))
            .then(()=>{if(dayUploads.current!=null) dayUploads.current.push(post)})
            .then(()=>{if(weekUploads.current!=null) weekUploads.current.push(post)})
    }

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
        let week = weekState;
        return [me,host,week];
    }

    const getMyFriendsFullnames = ()=>{//return array
        return friendsRef.current;
    }

    /* LOCALS */
    const amIViewLocal = (name,host_id=null)=>{
        if(!host_id) host_id = getMeAndMyHost()[1]?.id;
        let date = localStorage.getItem(`${name}_view_${host_id}`);
        date = new Date(date);
        if(name==="oneshot") return date!=null && isLessThenMinutes(date,12*60);
        if(name==="rnshot") return date!=null && isLessThenMinutes(date,15);
        return date!=null && weekEqual(Date.parse(date),NOW());
    }
    const setMyViewLocal = (name,host_id=null)=>{
        if(!host_id) host_id = getMeAndMyHost()[1]?.id;
        localStorage.setItem(`${name}_view_${host_id}`,NOW());
    }

    const value = {  tryLogMeInTemporarly,saveMe,getMe,//me
                                getMyHostWeekNumber,//host
                                getMyHostWeekNames,weekState,//week
                                getMyDayUploads,getMyWeekUploads,trySetMyUserPostComment,hideIfAppsState,setHideIfAppsState,postMyPost,getTickets,getMaxTickets, getMyAppsCounts,//post
                                getMeAndMyHost,getMeAndMyHostAndMyWeek, //getters

                                trySetMyUsername,trySetMyPersonalizedApps, //setters
                                
                                
                                amIScreenkaViewLocal,trySetMyScreenkaView, //Screenka
                                amIViewLocal,setMyViewLocal ,//view local
                                getMyFriendsFullnames,

                                UserService:useUserService(demo),
                                HostService:useHostService(demo),
                                WeekService:useWeekService(demo),
                                PostService:usePostService(demo),
                            }
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
 
         if(auth) getUserHostWePrzestarzaleekPosts(user_fullname,host_id,week_name).then(posts=>posts==null?navigate("/"):setPosts(posts));
 
         const requestTimeout = setTimeout(()=>{
             if(!auth) navigate("/");
         },3000)
         return ()=>clearTimeout(requestTimeout);        
     },[auth]);
     // END AUTH 
     */