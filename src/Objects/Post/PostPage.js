import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Post from './Post';
import { Day } from '../Day/Day';
import { AuthContext } from '../../Contexts/AuthContext';
import NothingToShow from '../../Pages/NothingToShow';
import TimeFor from '../TimeFor';
import { useState } from 'react';
import { useContext } from 'react';

const PostPage = ({oneshot,rnshot}) => {

    const {user_fullname,id} = useParams();
    const navigate = useNavigate();

    const day = oneshot?Day.OneShot:null;

    useEffect(()=>{
        let [,,week] = getMeAndMyTeamAndMyWeek()
        if(day && (!TimeFor.Day(day,week) || amIViewLocal(day.toString()))) navigate("/");
        if(rnshot && amIViewLocal("rnshot")) navigate("/")
    },[])

    const getTitle = ()=> day?day.name.toUpperCase():(rnshot?"RN-SHOT":"Post")
    const getDescription =()=>day?day.description:(rnshot?"- z ostatniej chwili!":null)

    const [alreadyViewed,setAlreadyViewed] = useState(false);
    const {getMe,setMyViewLocal,amIViewLocal,getMeAndMyTeamAndMyWeek} = useContext(AuthContext);
    const handleOnView = (success)=>{
        if(day || rnshot)
        {
            if(success) setMyViewLocal(day?day.toString():"rnshot");
            else setAlreadyViewed(true);
        }
    }

    return ( <div>

        <h1 style={{marginLeft: "15px",marginTop:"25px"}}>{getTitle()}</h1>
        {getDescription() &&<h4 style={{textAlign:"right",marginRight:"15px",marginBottom:"20px"}}>{getDescription()}</h4>}

        {!alreadyViewed && <Post id={id} user_fullname={user_fullname} comment_user={getMe()} onView={handleOnView}/>}
        {alreadyViewed && <NothingToShow/>}
    </div> );
}
 
export default PostPage;