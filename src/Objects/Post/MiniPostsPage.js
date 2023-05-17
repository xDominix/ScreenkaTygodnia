import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MiniPost } from './Post';
import NothingToShow from '../../Pages/NothingToShow';
import Loading from '../../Pages/Loading';
import TimeFor from '../TimeFor';
import { Day } from '../Day/Day';
import { AuthContext } from '../../Contexts/AuthContext';

const MiniPostsPage = ({ohpreview,throwback}) => {

    const {user_fullname,host_id,week_name} = useParams();
    const navigate = useNavigate();

    const {amIViewLocal,setMyViewLocal,getMyHostWeekNumber,PostService} = useContext(AuthContext)

    const [posts,setPosts] = useState(null);

    const day = ohpreview?Day.OhPreview : (throwback?Day.ThrowBack:null);

    useEffect(()=>{
        let weekNumber = getMyHostWeekNumber();
        if( user_fullname==null || host_id==null )  navigate("/")
        if(day && (!TimeFor.Day(day,weekNumber) || amIViewLocal(day.toString()))) navigate("/");
        PostService.getUserHostWeekPosts(user_fullname,host_id,week_name,day!=null).then(posts=>posts==null?navigate("/"):setPosts(posts));
    },[]) //eslint-disable-line react-hooks/exhaustive-deps

    useEffect(()=>{
        if(day && posts.length>0) setMyViewLocal(day.toString());
    },[posts]) //eslint-disable-line react-hooks/exhaustive-deps

    const getTitle = ()=>day==null?"Week Posts":day.name.toUpperCase()
    const getDescription =()=>day==null?null:day.description

    return(<div className='posts'>
 
    <h1 style={{marginLeft: "15px",marginTop:"25px"}}>{getTitle()}</h1>
    {getDescription() &&<h4 style={{textAlign:"right",marginRight:"15px",marginBottom:"20px"}}>{getDescription()}</h4>}

    {posts === null && <Loading/>}
    {posts?.length===0 &&<NothingToShow/>}
    
    <div style={{overflow:"auto"}} className='noscroll'>
    {posts?.length !==0 && <div className='posts-list'>
            {posts?.map((post) =>(  <MiniPost post={post} hourDate={false}/> ))} 
        </div>}
    </div>

    </div> )
}
 
export default MiniPostsPage;