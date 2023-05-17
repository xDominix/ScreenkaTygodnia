import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthContext';
import { MiniPost } from '../../Objects/Post/Post';
import "./Uploads.css"
import { TimeFor } from '../../Objects/TimeFor';
import Loading from '../Loading';
import NothingToShow from '../NothingToShow';
import { ButtonPageBack } from '../../Components/Buttons';

const Uploads = () => {

    const navigate = useNavigate();

    const {getMyDayUploads,getTickets,getMaxTickets,getMyWeekUploads} = useContext(AuthContext)
    const {type} = useParams();

    const [posts,setPosts]=useState(null);

    useEffect(()=>{
        if(type==="day") {
            if(!TimeFor.DayUploads()) navigate("/");
            getMyDayUploads().then(setPosts).catch(()=>navigate("/"))
        } 
        else if(type==="week") {
            if(!TimeFor.WeekUploads()) navigate("/")
            getMyWeekUploads().then(setPosts).catch(()=>navigate("/"))
        }
        else navigate("/")
    },[])// eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
        <div className='uploads noscroll'>
        
        {type==="day" && <h2> <ButtonPageBack/>Your Day Uploads:</h2>}
        {type==="week" && <h2> <ButtonPageBack/> Your Week Uploads:</h2>}
        
        {posts === null && <Loading/>}
        {posts?.length===0 &&<NothingToShow/>}
        
        {posts?.length !==0 && <div className='content'>
            
            <div className='uploads-legend'>
                <span style={{fontSize:"30px"}} role="img" aria-label="ticket_emoji">🎟️</span>
                {type==="day" && <h5>{`${getMaxTickets()-getTickets()}/${getMaxTickets()}`} used</h5>}
            </div>
        
            <div className='uploads-list'>
                {posts?.map(post =>( <MiniPost key={post.id} post={post} hourDate={type==="day"}/> ))} 
            </div>

            <footer className='center'>Uploads with tickets will apply for<br/>Screenka Tygodnia ™</footer>

        </div>}

    </div> 
    </div>);
}
 
export default Uploads;