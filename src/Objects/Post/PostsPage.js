import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Post from './Post';
import { PostContext } from '../../Contexts/PostContext';
import NothingToShow from '../../Pages/NothingToShow';
import Loading from '../../Pages/Loading';
import TimeFor from '../TimeFor';
import { Day } from '../Day/Day';
import { AuthContext } from '../../Contexts/AuthContext';

const PostsPage = ({ohpreview,throwback}) => {

    const {user_fullname,team_id,week_name} = useParams();
    const navigate = useNavigate();

    const {getUserTeamWeekPosts}=useContext(PostContext);
    const {amIViewLocal,setMyViewLocal,getMeAndMyTeamAndMyWeek} = useContext(AuthContext)

    const [posts,setPosts] = useState(null);

    const day = ohpreview?Day.OhPreview : (throwback?Day.ThrowBack:null);

    useEffect(()=>{
        let [,,week] = getMeAndMyTeamAndMyWeek();
        if( user_fullname==null || team_id==null || week_name==null)  navigate("/")
        if(day && (!TimeFor.Day(day,week) || amIViewLocal(day.toString()))) navigate("/");
        getUserTeamWeekPosts(user_fullname,team_id,week_name).then(posts=>posts==null?navigate("/"):setPosts(posts));
    },[])

    useEffect(()=>{
        if(day && posts.length>0) setMyViewLocal(day.toString());
    },[posts])

    const getTitle = ()=>day==null?"Week Posts":day.name.toUpperCase()
    const getDescription =()=>day==null?null:day.description

    return(<div className='posts'>
 
    <h1 style={{marginLeft: "15px",marginTop:"25px"}}>{getTitle()}</h1>
    {getDescription() &&<h4 style={{textAlign:"right",marginRight:"15px",marginBottom:"20px"}}>{getDescription()}</h4>}

    {posts === null && <Loading/>}
    {posts?.length===0 &&<NothingToShow/>}
    
    <div style={{overflow:"auto"}} className='noscroll'>
    {posts?.length !==0 && <div className='posts-list'>
            {posts?.map((post,i) =>(  <Post key={i} post={post} hideNickname={i!==0} /> ))} 
        </div>}
    </div>

    </div> )
}
 
export default PostsPage;