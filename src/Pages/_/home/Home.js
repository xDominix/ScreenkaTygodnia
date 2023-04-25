import React, { useCallback, useContext, useEffect, useState } from 'react';
import App from '../../../Objects/App/App';
import './Home.css';
import { AuthContext } from '../../../Contexts/AuthContext';
import { PostContext } from '../../../Contexts/PostContext';
import { UserContext } from '../../../Contexts/UserContext';
import { BottomTabContext } from '../../../Contexts/BottomTabContext';
import { TimeFor } from '../../../Objects/TimeFor';
import { useNavigate } from 'react-router-dom';
import { HIDE_APP_UPLOADER, MAX_TICKETS, datesWeekDelta, delay } from '../../../aFunctions';
import { ButtonScreenka,ButtonPlus,ButtonWeekUploads, ButtonText } from './components/Buttons';
import { AppClass } from '../../../Objects/App/AppClass';
import User from '../../../Objects/User/User';
import { Day } from '../../../Objects/Day/Day';
import A from '../../../Components/A';

const height = 80;
const userHeight=32;
const borderRadius = 15;
const buttonStyle = {height:height+"px",borderRadius:borderRadius+"px"}

const HOME_APPS_SIZE = 6;

const Home = ({onAboutWeekClick,weekNumber,week}) => {
    const {getMeAndMyTeam,amIScreenkaViewLocal,getMyDayUploads,amIViewLocal,/*getMyWeek -> week*/} = useContext(AuthContext)
    const {setBottomTab,isBottomTab,equalObject,getObject,isObjectApp} = useContext(BottomTabContext);
    const {getUserWeekPosts} = useContext(PostContext);
    const {getUser} = useContext(UserContext);

    const navigate = useNavigate();
    
    const [homeApps,setHomeApps] = useState([]);//max_len = HOME_APPS_SIZE
    const [uploadApps,setUploadApps] = useState([]);

    const [participantsMap,setParticipantsMap] = useState(new Map()) //Map: (user, since_week)
    const [appsMap,setAppsMap] = useState(new Map()) //Map: (appname,{count, fullnames}) //aka uploaders

    const [isUploadMode,setIsUploadMode] = useState(false);

    const [tickets,setTickets]=useState(0);

    //buttons    
    const isDay = [Day.OneShot,Day.OhPreview,Day.ThrowBack].find(day=>TimeFor.Day(day,week) && !amIViewLocal(day.toString()))
    const [isRnShotData,setIsRnShotData] = useState(amIViewLocal("rnshot")?false:null); 
    const [isScreenka,setIsScreenka] = useState(false);
    //end buttons

    const loadAll = useCallback(()=>{
        const loadApps=async (me,team)=>{
            var apps = [...team.popular_apps,...me.personalized_apps];
            
            if(week?.extra_apps!=null) apps = apps.concat(week?.extra_apps);
            if(week?.blocked_apps!=null) apps = apps.filter( (app) => !week?.blocked_apps.includes(app) );
            apps = apps.map(app=>AppClass.get(app));
            apps.sort((a,b)=>a.label-b.label);
            setUploadApps(apps);
            setHomeApps(apps)
            return apps;
        }

        const loadAppsMap= async (me,team)=>{
            var apps_count={};
            var active_members = [];
            return Promise.all( team.members.map(async (member) => { 
                    return getUserWeekPosts(member.fullname).then((posts)=>{
                        if(posts==null || posts.length===0) return;

                        let new_apps_count = {};

                        //active members
                        active_members.push(member);

                        //rnshot
                        if(member.fullname!==me.fullname && isRnShotData===null)
                        {
                            posts?.forEach(post=> {if(TimeFor.RnShot(post) && post.comment_user_fullname===null) setIsRnShotData({user_fullname:member.fullname,post_id:post.id})})
                        }

                        //all
                        posts?.forEach(post=>{ new_apps_count[post.app] = (new_apps_count[post.app] || 0) + 1; });
                        for (let [key, value] of Object.entries(new_apps_count)) {
                            if (apps_count[key]) {apps_count[key].count += value; apps_count[key].fullnames.push(member.fullname)}
                            else apps_count[key] = {count:value,fullnames:[member.fullname]};
                        };
            })})).then(()=>{
                let appsMap= new Map(Object.entries(apps_count));
                setAppsMap(appsMap)
                return [appsMap,active_members];
            })
        }
        const loadParticipantsMap = async (team,active_members)=>{
            var participantsMap = new Map();
            Promise.all(active_members.map(async (member) => { 
                return getUser(member.fullname).then((user)=>{
                    let since_week = datesWeekDelta(team.start_date,member.join_date);
                    participantsMap.set(user,since_week);
                })
            })).then(()=>{
                setParticipantsMap(participantsMap);
            })
        }

        const loadTickets = async ()=>
        {
            getMyDayUploads()
            .then(posts=> posts.filter(post=>post.screenkaOn).length)
            .then(ticketsUsed=>MAX_TICKETS-ticketsUsed)
            .then(ticketsLeft=> setTickets(ticketsLeft));
        }

        const loadScreenka = async ()=>
        {
            if(TimeFor.Screenka(week))
            {
                //isButtonScreenkaDisabled
                let team = getMeAndMyTeam()[1];
                if(team===null) return true;
                let res = amIScreenkaViewLocal(team.id);

                if(res) setIsScreenka(true)
                else{
                    await delay(2000);
                    console.log("2")
                    setIsScreenka(true);
                }
            }
        }
        const sortHomeApps = (apps,appsMap)=>{
            const isFirstInGroup=(arr,app)=>{
                let first = arr.find(a=>a.getGroup()===app.getGroup());
                return first === app;
            }

            if(apps && appsMap ) {//&& appsMap.length>0
                //sort by notification count
                apps = [...apps].sort((a,b)=>(  (appsMap.get(b.name)?.count||0 - appsMap.get(a.name)?.count||0) *100+  (a.label-b.label)));

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

        let [me,team] = getMeAndMyTeam()
        
        loadApps(me,team).then((apps)=>{
            loadScreenka();
            loadTickets();
            loadAppsMap(me,team).then(([appsMap,active_members])=>{
                sortHomeApps(apps,appsMap);
                loadParticipantsMap(team,active_members)})});

    },[getMeAndMyTeam,getMyDayUploads,getUser,getUserWeekPosts,isRnShotData,amIScreenkaViewLocal,week])
    
    useEffect(()=>{
        loadAll();
    },[loadAll]);

    useEffect(()=>{
        console.log(isScreenka);
    },[isScreenka])

    const getApps = ()=>{
        return isUploadMode? uploadApps : homeApps.slice(0,HOME_APPS_SIZE);
    }

    const handleAppClick=(app)=>{
        if(!isUploadMode) setBottomTab({id:0,object:app,total_uploads: appsMap.get(app.name)?appsMap.get(app.name).count:0})
        else setBottomTab({id:1,object:app,no_tickets:tickets<=0})
    }
    const handleUserClick=(user,since_week)=>{
        setBottomTab({id:2,object:user,since_week})
    }

    const getNotificationValue=(app)=>{
        if(isUploadMode) return "+";
        return appsMap.get(app.name)?.count;
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
    const userClassName=(user)=>{
    let res =  "home-blur-dark-pre ";
    if(isBottomTab())
    {
        if(! (isObjectApp() &&  appsMap.get(getObject().name)?.fullnames.includes(user.fullname)) ||  HIDE_APP_UPLOADER) res+= "home-blur-dark"
    } 
    return res;  }


    /* BUTTONS START */

    const onDayClick = (day)=> {navigate(`day/${day.name}`)}

    const onRnShotClick=()=>{   navigate(`post/${isRnShotData.user_fullname}/${isRnShotData.post_id}/rnshot`);  }
    
    const isButtonScreenkaDisabled = ()=>{
        let team = getMeAndMyTeam()[1];
        if(team===null) return true;
        let res = amIScreenkaViewLocal(team.id);
        return res;  }
    const onButtonScreenkaClick = ()=>{
        let team = getMeAndMyTeam()[1];
        if(team==null) return;
        let agree = window.confirm("This content could be viewed once. Continue?")
        if(agree) navigate("/screenka/"+team.id);  }

  /* BUTTONS END */

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
            <ButtonPlus tickets={tickets} disabled={!TimeFor.Upload(week)} style={buttonStyle} onClick={()=>setIsUploadMode(!isUploadMode)} isRotate={isUploadMode}/>
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
            {Array.from(participantsMap).map(([user,since_week]) => (
            <div key={user.fullname} className={userClassName(user)} >
                 <User user={user} height={userHeight} onClick={()=>handleUserClick(user, since_week)}/>
            </div>
        ))}
        </div>}
       
        {!isUploadMode &&<div className='home-info-filler'></div>}     

        {isUploadMode && <footer className='center'><A underline href="/uploads/day">manage uploads</A></footer>}

        
    </div>

)}

export default Home;