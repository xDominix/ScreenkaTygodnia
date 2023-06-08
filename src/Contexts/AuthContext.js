import React, {  useEffect, useMemo, useRef, useState } from "react";
import { NOW, objectToPermissions, weekEqual } from "../aFunctions";
import Loading from "../Pages/Loading";
import { useHostService } from "../Services/HostService";
import { useUserService } from "../Services/UserService";
import { useWeekService } from "../Services/WeekService";
import { usePostService } from "../Services/PostService";
import { Event } from "../Objects/Event/Event";
import { CustomEvent } from "../Objects/Event/CustomEvent";

export const AuthContext = React.createContext();

const NONE = false;

const AuthProvider = ({children, demo}) => {

    //services
    const {getUser,getUserByUsername,getUserSrcUrl,trySetUsername,trySetPersonalizedApps,changeUserPreferences} = useUserService(demo);
    const {getHost,getHostWeekNumber} = useHostService(demo);
    const {getHostWeek,trySetHostWeekScreenkaView,onWeekSnapshot,getHostLastWeekName} = useWeekService(demo);
    const {getUserCurrentDayPosts,getUserCurrentWeekPosts,getUserPostTicketsUsed,changePostPermissions,postPost,getUserLatestPost,
    getUserCurrentDayRandomPost,getUserPastWeekPosts,getUserPost,getUserPostAndTrySetView,getPathPostContentUrl}=usePostService(demo);

    //states
    const [user,setUser] = useState(NONE);
    const [host,setHost] = useState(NONE);
    const [week,setWeek] = useState(NONE);

    const user_fullname = user ? user.fullname : user;
    const host_id = host ? host.id : host;
    const host_subscribers = host ? host.subscribers : host;
    const week_name = week ? week.name : week;

    //loading
    const isUserLoading = user===NONE;
    const isHostLoading = host === NONE;
    const isWeekLoading = week===NONE;
    const isLoading =  useMemo(()=>{ return isUserLoading || isHostLoading || isWeekLoading},[isUserLoading,isHostLoading,isWeekLoading] )//useState(true);

    //refs
    const userTemp = useRef(null); const getTempMe = ()=>userTemp.current; // used for temp login
    const userUsernameRef = useRef(null); const getMyUsername = ()=>userUsernameRef.current;
    const hostIdRef = useRef(null);
    const hostPopularAppsRef = useRef(null);
    const hostFriendsRef = useRef([]);
    const setFriends = (user,host) =>{
        if(!user || !host) return;
        hostIdRef.current=host.id;
        hostPopularAppsRef.current = host.popular_apps;
        hostFriendsRef.current = host.getFriends(user.fullname)
    }

    //refs plus
    const ticketsRef = useRef(0);  const getTickets = ()=> ticketsRef.current;
    const maxTicketsRef = useRef(0); const getMaxTickets = ()=>maxTicketsRef.current;
    const dayUploads = useRef(null);
    const weekUploads=useRef(null);

    useEffect(()=>{
        const _getUser= async ()=>{ 
            const isStartOfWeek = ()=>{
                let last = localStorage.getItem("last_permissions_change"); //setter in change user permissions
                if(NOW().getDay()===0 && (!last || !weekEqual(Date.parse(last),NOW())))  return true;//is sunday
               return false;
            }
            let fullname = localStorage.getItem("fullname");
            let user = await getUser(fullname);
            if(user) userUsernameRef.current = user.username;
            if(user && isStartOfWeek()) user.preferences.me=false;
            if(!user || !user.preferences.me) return null;
            return user;
        }

        if(user === NONE)  _getUser().then(setUser)
    },[]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(()=>{
        const _getHost = async(user)=>{ 
            if(!user) return null;
            let defaultHost = await getHost(user?.hosts?.at(0) );
            /*2*/if(!defaultHost || !defaultHost.subscribers.has(user.fullname)) return null;
            /*1*/if(user.preferences.friends){
                /*2*/let leave_date = defaultHost.subscribers.get(user.fullname).leave_date;
                /* */if(leave_date==null || leave_date>NOW()) setFriends(user,defaultHost);
            }
            return defaultHost;
        }
        if(user !== NONE && host===NONE) _getHost(user).then(setHost)
    },[user_fullname]) // eslint-disable-line react-hooks/exhaustive-deps

    
    useEffect(()=>{
        const _getWeek = async(user,host)=>{
            const loadTickets = async (user,host,week)=>{
            let ticketsUsed = await getUserPostTicketsUsed(user.fullname,host.id);
            maxTicketsRef.current = week?.max_tickets?week.max_tickets: (host?.max_tickets?host.max_tickets:0);
            ticketsRef.current = Math.max(maxTicketsRef.current-ticketsUsed,0);
            return week;
            }
            if(!user || !host) return null;
            /*1*/if(!user.preferences.me) return null;
            /*2*/ let join_date = host.subscribers.get(user.fullname).join_date;
            /* */if(join_date==null || join_date>NOW()) return null;
            let week = getHostWeek(host.id);
            if(user.preferences.screenka) await loadTickets(user,host,week);
            return week;
        }
        if(user!==NONE && host!== NONE && week === NONE) _getWeek(user,host).then(setWeek);
    },[host_id]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(()=>{
        if(!host || !week ) return;
        const unsubscribe = onWeekSnapshot(host.id,week.name,setWeek);
        return () => unsubscribe()
    },[host_id, week_name]) // eslint-disable-line react-hooks/exhaustive-deps

    //nie ukrywa jesli masz trial version lub jestes subskrybujacy miedzy data - logiczne
    const friendsDisabled = useMemo(()=>{
        if(!host || !user || !host?.subscribers || !user?.fullname || !host?.subscribers?.has(user.fullname)) return true;// || !user.preferences.friends
        let sub = host.subscribers.get(user.fullname);
        return !(sub.leave_date == null || sub.leave_date>NOW());
    },[user_fullname,host_subscribers])

    //nie ukrywa jesli jestes subskrybujacy miedzy data - logiczne
    const screenkaDisabled = useMemo(()=>{
        if(!host || !user || !host.subscribers || !user.fullname || !host.subscribers.has(user.fullname)) return true; // || !user.preferences.screenka
        let sub = host.subscribers.get(user.fullname);
        return !(sub.join_date!=null && sub.join_date<NOW() && !(sub.leave_date!=null && sub.leave_date < NOW()));
    },[user_fullname, host_subscribers])


    //USER CONTEXT

    const tryLogMeInTemporarly = async (username)=>{ //gdy ustawisz sobie username o takiej samej nazwie co inny uzytkownik to pisz do admina
        return getUserByUsername(username)
            .then(user=>{
                if(user==null) return false;
                userTemp.current = user;
                return true; })
    }
    const trySetMyUsername= async (username)=> trySetUsername(userTemp.current.fullname,username);  //if(res) user..username => username;
    const trySetMyPersonalizedApps = async (apps)=> trySetPersonalizedApps(userTemp.current.fullname,apps)
    const saveMe =()=>{
        if(!userTemp.current) throw new Error('Cannot save. User is null');
        localStorage.setItem("fullname",userTemp.current.fullname);
        setWeek(NONE); 
        setHost(NONE); 
        setUser(userTemp.current); 
    }
   
    const changeMyPreferences=async(preferences)=> {
        localStorage.setItem("last_preferences_change",NOW());
        if(friendsDisabled) preferences.friends = true; //!
        if(screenkaDisabled) preferences.screenka = true; //!
        return changeUserPreferences(user.fullname,preferences).then(()=>{
            let temp = {...user}; 
            temp.preferences = preferences;
            if(!temp.preferences.me) setUser(null);
            else setUser(temp);
        })
    }

    //friend (uses hostid rather than host)
    const getFriendFunction =async (func,user_fullname,...args) =>{
        const checkFriend=(user_fullname)=> hostFriendsRef.current.includes(user_fullname)
        if(!checkFriend(user_fullname) && user_fullname !== user.fullname) return null;
        return func(user_fullname,...args)
    }

    const getFriend = async (user_fullname)=> getFriendFunction(getUser,user_fullname);
    const getFriendSrcUrl = async (user_fullname)=> getFriendFunction(getUserSrcUrl,user_fullname)
    const getFriendLatestPost = async (user_fullname)=>getFriendFunction(getUserLatestPost,user_fullname,hostIdRef.current);
    const getFriendCurrentDayRandomPost=async (user_fullname)=>getFriendFunction(getUserCurrentDayRandomPost,user_fullname,hostIdRef.current,true,[...user.personalized_apps,...hostPopularAppsRef.current]);
    const getFriendPastWeekPosts = async (user_fullname,week_name)=> getFriendFunction(getUserPastWeekPosts,user_fullname,week_name,hostIdRef.current,true,[...user.personalized_apps,...hostPopularAppsRef.current],true)
    const getFriendCurrentDayPosts = async (user_fullname,host_id=null)=>{
    let host = (host_id===null && AM_I_HOST())? null : hostIdRef.current;
    return getFriendFunction(getUserCurrentDayPosts,user_fullname,host);
    }


    //users
    const getMyPastWeekPosts = async (week_name)=>{
        let [me,host_id] = getMeAndMyHostId()
        return getUserPastWeekPosts(me.fullname,week_name,host_id,true)
    }

    //Host CONTEXT

    const weekNumber = useMemo(() => getHostWeekNumber(host), [host?.start_date]);
    
    //WEEK CONTEXT
    /*
    const getMyHostWeekNames = async (from_date)=>{
        let [,host] = getMeAndMyHost()
        return getHostWeekNames(host.id,from_date);
    }*/

    const trySetMyScreenkaView = async(host_id,week_name)=>{//host_id, week_name - ala klucze do wysetowania
        if(!host_id || !week_name) return false;
        return trySetHostWeekScreenkaView(host_id,week_name, user.fullname);
    }

    const getMyHostLastWeekName = async ()=>{
        return getHostLastWeekName(hostIdRef.current);
    }

    //POST CONTEXT

    const getMyDayUploads = async ()=>{
        const loadMyDayUploads=async (me_fullname,host_id)=>{
            const getTicketsUsed=(posts)=>posts.filter(post=>post.permissions.screenka).length;
            return getUserCurrentDayPosts(me_fullname,host_id).then(posts=>{
                    dayUploads.current=posts;
                    ticketsRef.current =Math.max(getMaxTickets()-getTicketsUsed(posts),0);
            }); 
        }

        if(dayUploads.current==null) await loadMyDayUploads(user.fullname,host?.id);
        return dayUploads.current.filter(post => post.permissions.me === true);
    }
    const getMyWeekUploads = async ()=>{
        const loadMyWeekUploads=async (me_fullname,host_id)=>{
            return getUserCurrentWeekPosts(me_fullname,host_id).then(posts=>{
                    weekUploads.current=posts;
            }); 
        }

        if(weekUploads.current==null) await loadMyWeekUploads(user.fullname,host.id);
        return weekUploads.current.filter(post => post.permissions.me === true);
    }
     const getMyAppsCounts= async()=>{
        if(getMe()==null) return null;
        let posts = await getMyDayUploads();
        let counts = {};
        posts?.forEach(function (post) { counts[post.app] = (counts[post.app] || 0) + 1; });
        return new Map(Object.entries(counts));
    }

    const changeMyPostPermissions=async(post_id,permissions)=>{
        return changePostPermissions(user.fullname,post_id,permissions).then(()=>{
            if(dayUploads.current!=null) dayUploads.current=dayUploads.current.map(post=>{if(post.id===post_id) post.permissions = objectToPermissions(permissions,post.permissions); return post;})
            if(weekUploads.current!=null) weekUploads.current=weekUploads.current.map(post=>{if(post.id===post_id) post.permissions = objectToPermissions(permissions,post.permissions); return post;})   
        })
    }

    const postMyPost = async (post, file, onlyMe= false)=>{
        post.host_id = host? host.id : null;
        post.week_name = week? week.name : null;
        post.upload_date = NOW();
        post.permissions = {me:user.preferences.me,friends:(!onlyMe && !friendsDisabled && user.preferences.friends),screenka:(!onlyMe && !screenkaDisabled && user.preferences.screenka && ticketsRef.current>0)}

        return postPost(user.fullname,post,file)
            .then((post_id)=>{
                ticketsRef.current = Math.max(ticketsRef.current-1,0);
                post.id = post_id;
                if(dayUploads.current!=null) dayUploads.current.push(post)
                if(weekUploads.current!=null) weekUploads.current.push(post)
            })
    }

    const [hideIfAppsState,setHideIfAppsState2]=useState();
    const setHideIfAppsState=(user,host)=>{
        let diff = host.personalized_apps.filter(app => !user.personalized_apps.includes(app));
        setHideIfAppsState2(diff);
    }

    const getUserPostAndTrySetMyView =async (user_fullname,id)=>{ //znasz id to masz, fajne do sharowania
        return getUserPostAndTrySetView(user_fullname,id,(!friendsDisabled && user?.preferences.friends) ? user.fullname : null);
    }

    // to delete ...
    const getMe = ()=> user
    const getMeAndMyHostId = ()=> [user, hostIdRef.current];
    const getMyFriends = ()=>{return hostFriendsRef.current}
    const getMyFriendsWithHostId=()=> {return [hostFriendsRef.current,hostIdRef.current]}
    const getMeAndMyHost=()=>  [user,host];
    const getMeAndMyHostAndMyWeek= () => [user,host,week];

    /*HOST */
    const AM_I_HOST = ()=>{
        if(!user) return false;
        return host?.fullname === user.fullname;
    }
    const GET_HOST_ID = ()=>{
        if(AM_I_HOST()) return host.id;
        return null;
    }

    /*DAY EVENTS*/
    const myDayEvents=useMemo(()=>{
        return Event.getDayEvents(weekNumber,user?.preferences);
    },[weekNumber, user?.preferences])

    const myCustomEvents=useMemo(()=>{
        return Event.getCustomEvents(weekNumber,user?.preferences);
    },[weekNumber, user?.preferences])

    const isRnShotEvent = useMemo(()=>myCustomEvents.includes(CustomEvent.RnShot),[myCustomEvents])
    const isScreenkaEvent = useMemo(()=>myCustomEvents.includes(CustomEvent.Screenka),[myCustomEvents])
    const isUploadEvent = useMemo(()=>myCustomEvents.includes(CustomEvent.Upload),[myCustomEvents])

    const value = {  
                                AM_I_HOST,GET_HOST_ID,
                                tryLogMeInTemporarly,saveMe,getMyUsername,getTempMe,getMe,changeMyPreferences,getMyPastWeekPosts,//me
                                getFriend,getFriendSrcUrl,getFriendLatestPost,getFriendCurrentDayRandomPost,getFriendCurrentDayPosts,getFriendPastWeekPosts,//friend
                                getUser,getHost,getUserPost,getUserSrcUrl,getPathPostContentUrl,//screenka (public)
                                weekNumber,getMyFriends,getMyFriendsWithHostId,//host
                                getMyHostLastWeekName,//week
                                getMyDayUploads,getMyWeekUploads,hideIfAppsState,setHideIfAppsState,postMyPost,getTickets,getMaxTickets, getMyAppsCounts,getUserPostAndTrySetMyView,//post
                                changeMyPostPermissions,//post2
                                getMeAndMyHost,getMeAndMyHostAndMyWeek,getMeAndMyHostId, //getters

                                trySetMyUsername,trySetMyPersonalizedApps, //setters
                                
                                
                                trySetMyScreenkaView, //Screenka
                                myDayEvents,isRnShotEvent,isScreenkaEvent,isUploadEvent,//events
                                friendsDisabled,screenkaDisabled,//disabled options

                                user,
                                host: (user?.preferences?.me) ? host : null,
                                week:  (user?.preferences?.me) ? week: null,//(user?.preferences?.friends || user?.preferences?.screenka) ? week : null,
                            }
    return ( 
    <AuthContext.Provider value={value}>
        {isLoading ? <Loading logo/> : children}
    </AuthContext.Provider> );
}

export default AuthProvider;

/*
    const routingPermission = useRef(false);
    const tryUseRoutingPermission = ()=> {if(ADMcIcN) return true; if(routingPermission.current !=true) return false; routingPermission.current=false; return true;}
    const setRoutingPermission = ()=> {routingPermission.current=true;}
    
     //START AUTH  in component after setRoutingPermission
     const navigate = useNavigate();
     const {tryUseRoutingPermission} = useContext(AuthContext);
     const [auth,setAuth] = useState(false);
     useEffect(()=>{
         if(!auth) if(tryUseRoutingPermission() || AcDMcIN) setAuth(true);
 
         if(auth) getUserHostWePrzestarzaleekPosts(user_fullname,host_id,week_name).then(posts=>posts==null?navigate("/"):setPosts(posts));
 
         const requestTimeout = setTimeout(()=>{
             if(!auth) navigate("/");
         },3000)
         return ()=>clearTimeout(requestTimeout);        
     },[auth]);
     // END AUTH 
*/