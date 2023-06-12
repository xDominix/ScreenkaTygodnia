import React, { useEffect } from 'react';
import Post from '../Objects/Post/Post';
import "./Screenka.css"
import WeekAppContainer from '../Components/WeekAppContainer';

const WEEK_NAME = "First Week";
const HOST_ID = "0";

const ScreenkaT0 = ({onLoad}) => {
   
    useEffect(()=>{
        const timeout = setTimeout(()=> onLoad(WEEK_NAME),1000);
        return ()=>clearTimeout(timeout);
    },[])// eslint-disable-line react-hooks/exhaustive-deps

    return ( 
        <div className='Screenka noscroll'>
            <h1>Witamy bardzo serdeczenie na Screence Tygodnia!</h1>
            <h4 style={{textAlign:"end"}}>APRIL 2023 EDITION</h4>
            <h4>Wyniki prezentuja się przepieknie! </h4>
           <WeekAppContainer host_id={HOST_ID} week_name={WEEK_NAME}/>
            <footer style={{marginTop:"50px"}}>Screenka Tygodnia ®</footer>
        </div> );
}
 
export default ScreenkaT0;