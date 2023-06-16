import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import './Home.css';
import { AuthContext } from '../../../Contexts/AuthContext';
import { BottomTabContext } from '../../../Contexts/BottomTabContext';
import { useNavigate } from 'react-router-dom';
import { MAX_SCREENKA, datesWeekDelta, delay } from '../../../aFunctions';
import { ButtonScreenka,ButtonPlus,ButtonWeekUploads, ButtonText, ButtonRn } from './components/Buttons';
import { AppClass, AppType, DEFAULT_APP_NAMES } from '../../../Objects/App/AppClass';
import A from '../../../Components/A';
import { ButtonNextPage } from '../../../Components/Buttons';
import { DayEvent } from '../../../Objects/Event/DayEvent';
import AppContainer from './components/AppContainer';
import UserContainer from './components/UserContainer';
import { CustomEvent } from '../../../Objects/Event/CustomEvent';
import { Event } from '../../../Objects/Event/Event'
import { UserClass } from '../../../Objects/User/UserClass';

const height = 70;
const userHeight=32;
const borderRadius = 15;
const buttonStyle = {height:height+"px",borderRadius:borderRadius+"px"}

const HOME_APPS_SIZE = 6;

const Home = ({onAboutWeekClick}) => {

    const {user,host,week,weekNumber,getMyFriends,getFriendLatestPost,getMyAppsCounts,myDayEvents,myRnShotEvent,myScreenkaEvent,myUploadEvent,myManageUploadsEvent} = useContext(AuthContext)
    const {setBottomTab,isBottomTab,getObject,} = useContext(BottomTabContext);

    const navigate = useNavigate();

    const uploadApps = useRef(loadApps(user,host,week));
    const [homeApps,setHomeApps] = useState(uploadApps.current);//max_len = HOME_APPS_SIZE
    
    const [participantsCount,setParticipantsCount] = useState(0);
    const [friendsParticipants,setFriendsParticipants] = useState([]) //user_fullnames, + ja
    const [appsCountsMap,setAppsCountsMap] = useState(new Map()) //Map: (appname,count )

    const [isUploadMode,setIsUploadMode] = useState(false);

    //buttons    
    const currDayEvent = useMemo(()=> myDayEvents
        .filter((event)=> event.hasPage && event.isTime())?.at(0)
    ,[myDayEvents]) 

    const isCurrDayEventDisabled = useMemo(()=>!Event.canView(currDayEvent),[currDayEvent])

    const [isRnShotData,setIsRnShotData] = useState();

    const [isScreenka,setIsScreenka] = useState(false);

    useEffect(()=>{
        const loadParticipants = async (user,friends,week_participants)=>{
            if(!week_participants) return;
        
            let friends_participants_fullnames = week_participants.filter(parti=>friends.includes(parti));
            if(week_participants.includes(user.fullname)) friends_participants_fullnames.push(user.fullname);//!
            setFriendsParticipants( friends_participants_fullnames)
            setParticipantsCount(week_participants.length)
        }

        loadParticipants(user,getMyFriends(),week?.today_participants)
    },[week?.today_participants]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(()=>{
        const loadRnShot = async (me_fullname,week_latest)=>{
            if(week_latest!==null)return;
            let uploader = week_latest?.user;
            if(uploader==null) return;
            if(uploader===me_fullname) return;
            if(!Event.canView(CustomEvent.RnShot,{date:week_latest?.date})) return;
            if(!getMyFriends().includes(uploader)) return;
            getFriendLatestPost(uploader).then((post)=>{
                if(post) setIsRnShotData({user_fullname:uploader,post_id:post.id})})
            }

        if(week?.latest && myRnShotEvent) loadRnShot(user.fullname,week.latest);
    },[week?.latest,myRnShotEvent])// eslint-disable-line react-hooks/exhaustive-deps

    const rnAppName = useMemo(()=>{
        if(myRnShotEvent && CustomEvent.RnShot.isTime({date:week?.latest?.date})) return week?.latest?.app
        return null;
    },[week?.latest,myRnShotEvent]) 
    
    useEffect(()=>{
        const sortHomeApps = (appsMap=new Map())=>{
            const isFirstInGroup=(arr,app)=>{
                let first = arr.find(a=>a.getGroup()===app.getGroup());
                return first === app;
            }
    
            let apps = uploadApps.current;
    
            if(apps && appsMap ) {//&& appsMap.length>0
                //sort by notification count
                apps = [...apps].sort((a,b)=>(  (appsMap.get(b.name) ||0 - appsMap.get(a.name) ||0) *100+  (a.label-b.label)));
    
                //get firsts in group
                let copy = [...apps];
                copy = copy.filter(app=>isFirstInGroup(apps,app));
                copy = copy.slice(0,HOME_APPS_SIZE);
                
                //add extra apps
                let extra = HOME_APPS_SIZE - copy.length;
                apps.every(app => {
                    if(extra===0) return false;
                    if(!copy.includes(app)) {copy.push(app);extra--;}
                    return true;
                });
    
                //final sort
                copy.sort((a,b)=>a.label-b.label);
    
                setHomeApps(copy)
            }   
        }
        sortHomeApps(appsCountsMap)
    },[appsCountsMap])// eslint-disable-line react-hooks/exhaustive-deps
    

    //CASE 1
    useEffect(()=>{
        if(week) setAppsCountsMap(week.today_apps_counts);
    },[week?.today_apps_counts]) // eslint-disable-line react-hooks/exhaustive-deps

    //CASE 2
    const tryGetMyAppsCounts = async (force=false)=>{
        if(!week && user && ((!isBottomTab() && isUploadMode )|| force) ) {
            let map = await getMyAppsCounts();
            setAppsCountsMap(map);
            if(map.size!==0) {setParticipantsCount(1);setFriendsParticipants([user.fullname])}
    } }
    useEffect(()=>{tryGetMyAppsCounts(true)},[]) // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(()=>{tryGetMyAppsCounts(); },[isBottomTab()]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(()=>{
        const loadScreenka = async (week)=>
        {
                if( CustomEvent.Screenka.isTime({week:week})) 
                {
                    if(Event.canView(CustomEvent.Screenka,{week:week})) await delay(2000);
                    setIsScreenka(true)
                }
            }

        if(week && myScreenkaEvent) loadScreenka(week);
    },[week,myScreenkaEvent]) // eslint-disable-line react-hooks/exhaustive-deps

    const apps = useMemo(()=>{
        return isUploadMode? uploadApps.current : homeApps.slice(0,HOME_APPS_SIZE);
    },[isUploadMode,homeApps])

    const handleAppClick=(app)=>{
        if(!isUploadMode) setBottomTab({id:0,object:app,total_uploads: appsCountsMap.get(app.name)?appsCountsMap.get(app.name):0})
        else setBottomTab({id:1,object:app,app_type: getAppType(app,host)})
    }

    const handleUserClick=(user_fullname)=>{
        if(host==null)  setBottomTab({id:2,object:user_fullname,since_week:0});
        else
        {
            let since_week = datesWeekDelta(host.start_date,host.subscribers.get(user_fullname)?.join_date);
            setBottomTab({id:2,object:user_fullname,since_week:since_week, role: host.subscribers.get(user_fullname)?.role});
        }
    }

    const defaultClassName=useMemo(()=>{
        return "home-blur-dark-pre "+(isBottomTab()?"home-blur-dark":"")
    },[isBottomTab])
   
    /* BUTTONS START */

    const handleDayEventClick = (event)=> {if(event) navigate(`/dayevent/${event.toString()}`)}
    const handleRnShotClick=()=>{   navigate(`/post/${isRnShotData.user_fullname}/${isRnShotData.post_id}/${CustomEvent.RnShot.toString()}`,{state:{token:true,showMyRefPosts:true,showFriendsRefPosts:false}});  }
    
    const isButtonScreenkaDisabled = useMemo(()=>{
        if(!myScreenkaEvent) return true;
        return !Event.canView(CustomEvent.Screenka,{week:true});
    },[host?.id, myScreenkaEvent]);

    const handleButtonScreenkaClick = ()=>{
        if(host==null) return;

        let count_str = localStorage.getItem("screenka_count_"+host.id);

        let message = "Are you sure you want to see this content?";
        if(count_str && Number(count_str)===MAX_SCREENKA-1) message = "You will see this content for the last time. Continue?";

        if(window.confirm(message)) navigate("/screenka/"+host.id)
    }

    const special_  = useMemo(()=>{
        if(getObject()?.constructor.name === AppClass.name) return getObject().name
        if(getObject()?.constructor.name === UserClass.name) return getObject().fullname
        if(getObject()) return "other";
        return null;
    },[getObject()])

    return (
    <div className={"home "+( isBottomTab()?'noclick':"")}>
        <div className={defaultClassName} >
            <h1 className='home-title'>
                <span>WEEK</span> 
                #{weekNumber?weekNumber:0}
                <ButtonNextPage style={(week==null || weekNumber==null)?{"opacity":0}:{}} onClick={(week==null || weekNumber==null)?(()=>{}):onAboutWeekClick}/>
            </h1>
        </div>

        {isScreenka && //#1
        <div className={defaultClassName+" home-button-effect"} style={(!isBottomTab() && !isUploadMode)?{height:height+"px"}:{height:"0px",marginBottom:"0px",overflow:"hidden"}} >
            <ButtonScreenka disabled={isButtonScreenkaDisabled} onClick={handleButtonScreenkaClick} style={buttonStyle}/>
        </div>}
    
        {currDayEvent && //#2
        <div className={defaultClassName+" home-button-effect"}  style={(!isBottomTab() && !isUploadMode)?{height:height+"px"}:{height:"0px",marginBottom:"0px",overflow:"hidden"}}>
            {currDayEvent !== DayEvent.WeekUploads && <ButtonText disabled={isCurrDayEventDisabled} onClick={()=>handleDayEventClick(currDayEvent)} style={buttonStyle} text={currDayEvent.name.toUpperCase()}/>}
            {currDayEvent === DayEvent.WeekUploads &&<ButtonWeekUploads disabled={isCurrDayEventDisabled} onClick={()=>handleDayEventClick(currDayEvent)}  style={buttonStyle}/>}
        </div>}        

        {isRnShotData && (!isScreenka || isButtonScreenkaDisabled) && (!currDayEvent || isCurrDayEventDisabled) && //#3
        <div className={defaultClassName+" home-button-effect"}  style={(!isBottomTab() && !isUploadMode)?{height:height+"px"}:{height:"0px",marginBottom:"0px",overflow:"hidden"}}>
            <ButtonRn onClick={handleRnShotClick} style={buttonStyle} text="RIGHT NOW!"/>
        </div>}

        <div className={defaultClassName} >
            <ButtonPlus disabled={!myUploadEvent || !CustomEvent.Upload.isTime()} style={buttonStyle} onClick={()=>setIsUploadMode(!isUploadMode)} isRotate={isUploadMode}/>
        </div>
        
        <AppContainer 
            apps={apps} notificationCountsMap={appsCountsMap} disabled={!user.preferences.me} 
            appHeight={height} onAppClick={handleAppClick} appClassName='home-blur-dark-pre' 
            specialAppName={special_} specialClassName='home-scale-app' notSpecialClassName='home-blur-dark'
            orangeAppName={rnAppName} isUploadMode={isUploadMode} 
        />
    
        {user.preferences.me && !isUploadMode && <UserContainer
            user_fullnames={friendsParticipants} more={participantsCount-friendsParticipants.length}
            userHeight={userHeight} onUserClick={handleUserClick} userClassName='home-blur-dark-pre'
            specialUserFullname={special_} notSpecialClassName='home-blur-dark'
        />}
       
        {!isUploadMode && isBottomTab()  &&<div style={{height:"290px"}}></div>}     
        {!isUploadMode && !isBottomTab() && <footer className={'center '+(!user.preferences.me ?" text-shine":"")}><A nocolor onClick={()=>setBottomTab({id:4})}>SCREENKA Ⓡ</A></footer>}
        {isUploadMode && myManageUploadsEvent && <footer className='center'><A underline onClick={()=>navigate("/uploads/manage")} >manage uploads</A></footer>}
        
    </div>

)}

export default Home;

const loadApps=(me,host,week)=>{
    if(!me || !host || !week) return DEFAULT_APP_NAMES.map(name=>AppClass.get(name));

    var apps = [...host.popular_apps,...me.personalized_apps];
    
    if(week?.extra_apps!=null) apps = apps.concat(week?.extra_apps);
    if(week?.blocked_apps!=null) apps = apps.filter( (app) => !week?.blocked_apps.includes(app) );
    apps = apps.map(app=>AppClass.get(app));
    apps.sort((a,b)=>a.label-b.label);
    return apps;
}

const getAppType = (app,host)=>{
    if(!host) return AppType.Popular;
    if(host.personalized_apps.includes(app.name)) return AppType.Personalized;
    if(host.popular_apps.includes(app.name)) return AppType.Popular;
    if(host.group_apps.includes(app.name)) return AppType.Group;
    return AppType.SuperPersonalized;
}