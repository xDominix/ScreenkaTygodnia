import React, { useContext, useEffect, useRef, useState } from 'react';
import App from '../../../Objects/App/App';
import './Home.css';
import { AuthContext } from '../../../Contexts/AuthContext';
import { PostContext } from '../../../Contexts/PostContext';
import { BottomTabContext } from '../../../Contexts/BottomTabContext';
import { TimeFor } from '../../../Objects/TimeFor';
import { useNavigate } from 'react-router-dom';
import { MAX_TICKETS, delay } from '../../../aFunctions';
import { ButtonScreenka,ButtonPlus,ButtonWeekUploads, ButtonText } from './components/Buttons';
import { AppClass } from '../../../Objects/App/AppClass';
import User from '../../../Objects/User/User';
import { Day } from '../../../Objects/Day/Day';
import A from '../../../Components/A';

const height = 75;
const userHeight=32;
const borderRadius = 15;
const buttonStyle = {height:height+"px",borderRadius:borderRadius+"px"}

const HOME_APPS_SIZE = 6;

const Home = ({onAboutWeekClick,weekNumber,week}) => {
    const {getMe,getMeAndMyHost,amIScreenkaViewLocal,getMyDayUploads,amIViewLocal,getMyFriendsFullnames} = useContext(AuthContext)
    const {setBottomTab,isBottomTab,equalObject} = useContext(BottomTabContext);
    const {getUserWeekPosts} = useContext(PostContext);

    const navigate = useNavigate();
    
    const me = useRef(getMe());
    const host = useRef(getMeAndMyHost()[1]);
    const uploadApps = useRef(loadApps(me.current,host.current,week));
    const [homeApps,setHomeApps] = useState(uploadApps.current);//max_len = HOME_APPS_SIZE
    
    const [participantsCount,setParticipantsCount] = useState(0);
    const [friendParticipants,setFriendParticipants] = useState([]) //user_fullnames
    //const [appsMap,setAppsMap] = useState(new Map()) //Map: (appname,count ) //aka uploaders

    const [isUploadMode,setIsUploadMode] = useState(false);

    const tickets=useRef(-1);

    //buttons    
    const isDay = [Day.OneShot,Day.OhPreview,Day.ThrowBack].find(day=>TimeFor.Day(day,weekNumber) && !amIViewLocal(day.toString()))
    const [isRnShotData,setIsRnShotData] = useState(amIViewLocal("rnshot")?false:null);
    const [isScreenka,setIsScreenka] = useState(false);
    //end buttons

    const loadParticipants = async (me,week_participants)=>{
        if(!week_participants) return;
    
        let friends_fullnames = getMyFriendsFullnames();
        let friends_participants_fullnames = week_participants.filter(parti=>friends_fullnames.includes(parti) || parti===me.fullname );
        setFriendParticipants( [...friends_participants_fullnames] )
        setParticipantsCount(week_participants.length)
    }
    useEffect(()=>{
        loadParticipants(me.current,week?.participants)
    },[week?.participants]) // eslint-disable-line react-hooks/exhaustive-deps

    const loadRnShot = async (me,week_latest_uploader)=>{
        if(week_latest_uploader && week_latest_uploader !== me.fullname && isRnShotData===null) getUserWeekPosts(week_latest_uploader).then((posts)=>{
            if(posts==null || posts.length===0) return;
            posts?.forEach(post=> {if(TimeFor.RnShot(post) && post.comment_user_fullname===null) setIsRnShotData({user_fullname:week_latest_uploader,post_id:post.id})})
        })
    }
    useEffect(()=>{
        loadRnShot(me.current,week?.latest_uploader);
    },[week?.latest_uploader])// eslint-disable-line react-hooks/exhaustive-deps

    const loadTickets = async ()=>
    {
        getMyDayUploads()
        .then(posts=> posts.filter(post=>post.screenkaOn).length)
        .then(ticketsUsed=>MAX_TICKETS-ticketsUsed)
        .then(ticketsLeft=> tickets.current = ticketsLeft);
    }
    useEffect(()=>{
        if(tickets.current === -1) loadTickets();
        if(!week?.latest_uploader) return;
        if(week.latest_uploader===me.current.fullname) tickets.current -=1;
    },[week?.latest_uploader])// eslint-disable-line react-hooks/exhaustive-deps

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

    useEffect(()=>{
        sortHomeApps(week?.apps_counts_map)
    },[week?.apps_counts_map])// eslint-disable-line react-hooks/exhaustive-deps
    
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
    useEffect(()=>{
        if(host.current && week) loadScreenka(host.current,week);
    },[week]) // eslint-disable-line react-hooks/exhaustive-deps

    const getApps = ()=>{
        return isUploadMode? uploadApps.current : homeApps.slice(0,HOME_APPS_SIZE);
    }

    const handleAppClick=(app)=>{
        if(!isUploadMode) setBottomTab({id:0,object:app,total_uploads: week?.apps_counts_map.get(app.name)?week.apps_counts_map.get(app.name):0})
        else setBottomTab({id:1,object:app,tickets:tickets.current})
    }
    const handleUserClick=(user_fullname)=>{
        setBottomTab({id:2,object:user_fullname,host:host.current});
    }

    const getNotificationValue=(app)=>{
        if(isUploadMode) return "+";
        if(!week?.apps_counts_map) return;
        return week.apps_counts_map.get(app.name);
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
    if(isBottomTab())
    {
        if (!equalObject(user_fullname)) res+= "home-blur-dark"
    } 
    return res;  }


    /* BUTTONS START */

    const onDayClick = (day)=> {navigate(`day/${day.name}`)}

    const onRnShotClick=()=>{   navigate(`post/${isRnShotData.user_fullname}/${isRnShotData.post_id}/rnshot`);  }
    
    const isButtonScreenkaDisabled = ()=>{
        if(host.current===null) return true;
        let res = amIScreenkaViewLocal(host.current.id);
        return res;  }
    const onButtonScreenkaClick = ()=>{
        if(host.current==null) return;
        //let agree = window.confirm("This content could be viewed once. Continue?")
        //if(agree) 
        navigate("/screenka/"+host.current.id);  }

    return (
    <div className={"home "+( isBottomTab()?'noclick':"")}>
        <div className={defaultClassName()} >
            <h1 className='home-title'>
                <span>WEEK</span> 
                #{weekNumber?weekNumber:0}
                <span className='week-span'
                    onClick={()=>{if(week!=null && weekNumber!==null) onAboutWeekClick()}}
                    style={(week==null || weekNumber===null)?{opacity:"0",cursor:"default"}:{}}
                >{">"}</span>
            </h1>
        </div>

        {isDay &&
        <div className={defaultClassName()+" home-button-effect"}  style={(!isBottomTab() && !isUploadMode)?{height:height+"px"}:{height:"0px",marginBottom:"0px",overflow:"hidden"}}>
            <ButtonText onClick={()=>onDayClick(isDay)} day={isDay} style={buttonStyle} text={isDay.name.toUpperCase()}/>
        </div>}

        {isRnShotData &&
        <div className={defaultClassName()+" home-button-effect"}  style={(!isBottomTab() && !isUploadMode)?{height:height+"px"}:{height:"0px",marginBottom:"0px",overflow:"hidden"}}>
            <ButtonText onClick={onRnShotClick} style={buttonStyle} text="RIGHT NOW!"/>
        </div>}

        {TimeFor.WeekUploads() &&
        <div className={defaultClassName()+" home-button-effect"}  style={(!isBottomTab() && !isUploadMode)?{height:height+"px"}:{height:"0px",marginBottom:"0px",overflow:"hidden"}}>
            <ButtonWeekUploads onClick={()=>{navigate("/uploads/week")}} style={buttonStyle}/>
        </div>}
    
        {isScreenka &&
        <div className={defaultClassName()+" home-button-effect"} style={(!isBottomTab() && !isUploadMode)?{height:height+"px"}:{height:"0px",marginBottom:"0px",overflow:"hidden"}} >
            <ButtonScreenka disabled={isButtonScreenkaDisabled()} onClick={onButtonScreenkaClick} style={buttonStyle}/>
        </div>}
            
        <div className={defaultClassName()} >
            <ButtonPlus disabled={!TimeFor.Upload(week)} style={buttonStyle} onClick={()=>setIsUploadMode(!isUploadMode)} isRotate={isUploadMode}/>
        </div>
       
        <div className='home-app-conteiner'  style={{"gridTemplateColumns":"repeat(auto-fill, "+height+"px)"}}>
            {getApps().map(app => 
            <div key={app.name} className={appClassName(app)} >
                <App
                onClick={()=>handleAppClick(app)}
                notificationValue = {getNotificationValue(app)}
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
            {participantsCount-friendParticipants.length>0 && <User count={participantsCount-friendParticipants.length} height={userHeight}/>}
        </div>}
       
        {!isUploadMode &&<div className='home-info-filler'></div>}     

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