import React, { useState } from 'react';
import {  useParams } from 'react-router-dom';
import Post from './Post';
import { Day } from '../Day/Day';
import { AuthContext } from '../../Contexts/AuthContext';
import TimeFor from '../TimeFor';
import { useContext } from 'react';
import NothingToShow from '../../Pages/NothingToShow';

const PostPage = ({oneshot,rnshot,preview}) => {

    const {user_fullname,id} = useParams();
    const {getMe,setMyViewLocal,amIViewLocal,getMyHostWeekNumber} = useContext(AuthContext);
    const day = oneshot?Day.OneShot:null;

    const isNothingToShow = ()=>{
        if(day && (!TimeFor.Day(day,getMyHostWeekNumber()) || amIViewLocal(day.toString()))) return true;
        if(rnshot && amIViewLocal("rnshot")) return true;
        if(preview && user_fullname !== getMe().fullname) return true;
        return false; }
    const [nothingToShow,setNothingToShow] = useState(isNothingToShow());

    const handleOnLoad = (post=null)=>{
        if(post==null) return;
        else if(rnshot && !TimeFor.RnShot(post.upload_date)) setNothingToShow(true);
        else if(day && post.comment_user_fullname!==null) setNothingToShow(true);
        else if(day || rnshot) setMyViewLocal(day?day.toString():"rnshot");
    }

    const getTitle = ()=> day?day.name.toUpperCase():(rnshot?"RN-SHOT":"Post")
    const getDescription =()=>day?day.description:(rnshot?"- z ostatniej chwili!":null)

    if(nothingToShow) return <NothingToShow/>
    return ( <div>

        <h1 style={{marginLeft: "15px",marginTop:"25px"}}>{getTitle()}</h1>
        {getDescription() &&<h4 style={{textAlign:"right",marginRight:"15px",marginBottom:"20px"}}>{getDescription()}</h4>}

        <Post id={id} user_fullname={user_fullname} tryComment={day || rnshot} hideComment={preview} onLoad={handleOnLoad}/>
    </div> );
}
 
export default PostPage;