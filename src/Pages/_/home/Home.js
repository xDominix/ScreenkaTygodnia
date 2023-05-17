import React, { useContext, useEffect, useRef, useState } from 'react';
import App from '../../../Objects/App/App';
import './Home.css';
import { AuthContext } from '../../../Contexts/AuthContext';
import { BottomTabContext } from '../../../Contexts/BottomTabContext';
import { TimeFor } from '../../../Objects/TimeFor';
import { useNavigate } from 'react-router-dom';
import { MAX_SCREENKA, datesWeekDelta, delay } from '../../../aFunctions';
import { ButtonScreenka,ButtonPlus,ButtonWeekUploads, ButtonText, ButtonRn } from './components/Buttons';
import { AppClass } from '../../../Objects/App/AppClass';
import User from '../../../Objects/User/User';
import { Day } from '../../../Objects/Day/Day';
import A from '../../../Components/A';
import useConst from '../../../Hooks/useConst';
import { ButtonPageNext } from '../../../Components/Buttons';

const height = 70;
const userHeight=32;
const borderRadius = 15;
const buttonStyle = {height:height+"px",borderRadius:borderRadius+"px"}

const HOME_APPS_SIZE = 6;

const Home = ({onAboutWeekClick,weekNumber,week}) => {
    const {getMe,getMeAndMyHost,amIScreenkaViewLocal,amIViewLocal,getMyFriendsFullnames,PostService,getMyAppsCounts} = useContext(AuthContext)
    const {setBottomTab,isBottomTab,equalObject} = useContext(BottomTabContext);

    const navigate = useNavigate();
    
    const me = useConst(getMe());
    const host = useConst(getMeAndMyHost()[1]);
    const uploadApps = useRef(loadApps(me,host,week));
    const [homeApps,setHomeApps] = useState(uploadApps.current);//max_len = HOME_APPS_SIZE
    
    const [participantsCount,setParticipantsCount] = useState(0);
    const [friendParticipants,setFriendParticipants] = useState([]) //user_fullnames
    const [appsCountsMap,setAppsCountsMap] = useState(new Map()) //Map: (appname,count )

    const [isUploadMode,setIsUploadMode] = useState(false);

    //buttons    
    const isDay = [Day.OneShot,Day.OhPreview,Day.ThrowBack].find(day=>TimeFor.Day(day,weekNumber) && !amIViewLocal(day.toString()))
    const [isRnShotData,setIsRnShotData] = useState();
    const [isScreenka,setIsScreenka] = useState(false);

   
    useEffect(()=>{
        const loadParticipants = async (me,week_participants)=>{
            if(!week_participants) return;
        
            let friends_fullnames = getMyFriendsFullnames();
            let friends_participants_fullnames = week_participants.filter(parti=>friends_fullnames.includes(parti) || parti===me.fullname );
            setFriendParticipants( [...friends_participants_fullnames] )
            setParticipantsCount(week_participants.length)
        }

        loadParticipants(me,week?.participants)
    },[week?.participants]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(()=>{
        const loadRnShot = async (me,week_latest_map)=>{
            if(week_latest_map.size===0)return;
            if(amIViewLocal("rnshot"))return;
            let uploader = week_latest_map.get("user");
            if(uploader===me.fullname) return;
            if(!TimeFor.RnShot(week_latest_map.get("date"))) return;
            if(!getMyFriendsFullnames().includes(uploader)) return;
            PostService.getUserLatestPost(uploader).then((post)=>{
                setIsRnShotData({user_fullname:uploader,post_id:post.id})})
            }

        if(week?.latest_map) loadRnShot(me,week.latest_map);
    },[week?.latest_map])// eslint-disable-line react-hooks/exhaustive-deps

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
    

    useEffect(()=>{
            if(week) setAppsCountsMap(week.apps_counts_map);
    },[week?.apps_counts_map]) // eslint-disable-line react-hooks/exhaustive-deps

    const tryGetMyAppsCounts = async (force=false)=>{
        if(!week && me && ((!isBottomTab() && isUploadMode )|| force) ) {
            let map = await getMyAppsCounts();
            setAppsCountsMap(map);
            if(map.size!==0) {setParticipantsCount(1);setFriendParticipants([me.fullname])}
    } }
    useEffect(()=>{tryGetMyAppsCounts(true)},[]) // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(()=>{tryGetMyAppsCounts(); },[isBottomTab()]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(()=>{
        const loadScreenka = async (host,week)=>
        {
            if(TimeFor.Screenka(week))
            {
                //isButtonScreenkaDisabled
                if(host==null) return true;
    
                let res = amIScreenkaViewLocal(host.id);
                if(!res) await delay(2000);
                setIsScreenka(true)
            }
        }

        if(host && week) loadScreenka(host,week);
    },[week]) // eslint-disable-line react-hooks/exhaustive-deps

    const getApps = ()=>{
        return isUploadMode? uploadApps.current : homeApps.slice(0,HOME_APPS_SIZE);
    }

    const handleAppClick=(app)=>{
        if(!isUploadMode) setBottomTab({id:0,object:app,total_uploads: appsCountsMap.get(app.name)?appsCountsMap.get(app.name):0})
        else setBottomTab({id:1,object:app})
    }
    const handleUserClick=(user_fullname)=>{
        let since_week = datesWeekDelta(host.start_date,host.members_map.get(user_fullname)?.join_date);
        setBottomTab({id:2,object:user_fullname,since_week:since_week, role: host.members_map.get(user_fullname)?.role});
    }

    const getNotificationValue=(app)=>{
        if(isUploadMode) return "+";
        return appsCountsMap.get(app.name);
    }

    const defaultClassName=()=>{
        return "home-blur-dark-pre "+(isBottomTab()?"home-blur-dark":"")
    }
    const appClassName = (app)=>{
        let res =  "home-blur-dark-pre ";
        if(isBottomTab())
        {
            if(equalObject(app)) res+="home-scale-app";
            else  res+= "home-blur-dark"
        } 
        return res;
    }
    const userClassName=(user_fullname)=>{
    let res =  "home-blur-dark-pre ";
    if(isBottomTab())  if (!equalObject(user_fullname)) res+= "home-blur-dark"
    return res;  }


    /* BUTTONS START */

    const onDayClick = (day)=> {navigate(`day/${day.name}`)}

    const onRnShotClick=()=>{   navigate(`post/${isRnShotData.user_fullname}/${isRnShotData.post_id}/rnshot`);  }
    
    const isButtonScreenkaDisabled = useConst(()=>{
        if(host===null) return true;
        let res = amIScreenkaViewLocal(host.id);
        return res;  
    });

    const onButtonScreenkaClick = ()=>{
        if(host==null) return;

        let count_str = localStorage.getItem("screenka_count_"+host.id);

        let message = "Are you sure you want to see this content?";
        if(count_str && Number(count_str)===MAX_SCREENKA-1) message = "You will see this content for the last time. Continue?";

        if(window.confirm(message)) 
            navigate("/screenka/"+host.id);
    }

    return (
    <div className={"home "+( isBottomTab()?'noclick':"")}>
        <div className={defaultClassName()} >
            <h1 className='home-title'>
                <span>WEEK</span> 
                #{weekNumber?weekNumber:0}
                <ButtonPageNext   onClick={()=>{if(week!=null && weekNumber!==null) onAboutWeekClick()}}  disabled={(week==null || weekNumber===null)}/>
            </h1>
        </div>

        {isDay &&
        <div className={defaultClassName()+" home-button-effect"}  style={(!isBottomTab() && !isUploadMode)?{height:height+"px"}:{height:"0px",marginBottom:"0px",overflow:"hidden"}}>
            <ButtonText onClick={()=>onDayClick(isDay)} day={isDay} style={buttonStyle} text={isDay.name.toUpperCase()}/>
        </div>}

        {isRnShotData &&
        <div className={defaultClassName()+" home-button-effect"}  style={(!isBottomTab() && !isUploadMode)?{height:height+"px"}:{height:"0px",marginBottom:"0px",overflow:"hidden"}}>
            <ButtonRn onClick={onRnShotClick} style={buttonStyle} text="RIGHT NOW!"/>
        </div>}

        {TimeFor.WeekUploads() &&
        <div className={defaultClassName()+" home-button-effect"}  style={(!isBottomTab() && !isUploadMode)?{height:height+"px"}:{height:"0px",marginBottom:"0px",overflow:"hidden"}}>
            <ButtonWeekUploads onClick={()=>{navigate("/uploads/week")}} style={buttonStyle}/>
        </div>}
    
        {isScreenka &&
        <div className={defaultClassName()+" home-button-effect"} style={(!isBottomTab() && !isUploadMode)?{height:height+"px"}:{height:"0px",marginBottom:"0px",overflow:"hidden"}} >
            <ButtonScreenka disabled={isButtonScreenkaDisabled} onClick={onButtonScreenkaClick} style={buttonStyle}/>
        </div>}
            
        <div className={defaultClassName()} >
            <ButtonPlus disabled={!TimeFor.Upload()} style={buttonStyle} onClick={()=>setIsUploadMode(!isUploadMode)} isRotate={isUploadMode}/>
        </div>
       
        <div className='home-app-conteiner'  style={{"gridTemplateColumns":"repeat(auto-fill, "+height+"px)"}}>
            {getApps().map(app => 
            <div key={app.name} className={appClassName(app)} >
                <App
                onClick={()=>handleAppClick(app)}
                notificationValue = {getNotificationValue(app)}
                notificationBlue={week?.latest_map.get("app") === app.name && TimeFor.RnShot(week.latest_map.get("date"))}
                application={app} 
                height={height} />
            </div>
        )}
        </div>

        {!isUploadMode && <div className='home-user-conteiner'>
            {friendParticipants.map((fullname) => (
            <div key={fullname} className={userClassName(fullname)} >
                 <User user_fullname={fullname} height={userHeight} onClick={()=>handleUserClick(fullname)}/>
            </div>
            ))}
            {participantsCount-friendParticipants.length>0 && 
            <div className={defaultClassName()} >
                <User count={participantsCount-friendParticipants.length} height={userHeight}/>
            </div>}
        </div>}
       
        {!isUploadMode && isBottomTab()  &&<div style={{height:"290px"}}></div>}     
        {!isUploadMode && !isBottomTab() && <footer className='center'><A color={false} onClick={()=>setBottomTab({id:4})}>SCREENKA Ⓡ</A></footer>}
        {isUploadMode && <footer className='center'><A underline href="/uploads/day">manage uploads</A></footer>}
        
    </div>

)}

export default Home;

const loadApps=(me,host,week)=>{
    
    var apps = [...host.popular_apps,...me.personalized_apps];
    
    if(week?.extra_apps!=null) apps = apps.concat(week?.extra_apps);
    if(week?.blocked_apps!=null) apps = apps.filter( (app) => !week?.blocked_apps.includes(app) );
    apps = apps.map(app=>AppClass.get(app));
    apps.sort((a,b)=>a.label-b.label);
    return apps;
}