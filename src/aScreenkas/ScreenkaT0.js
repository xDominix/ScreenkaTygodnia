import React, { useEffect } from 'react';
import Post from '../Objects/Post/Post';
import "./Screenka.css"

const WEEK_NAME = "First Week";

const ScreenkaT0 = ({onLoad}) => {
   
    useEffect(()=>{
        const timeout = setTimeout(()=> onLoad(WEEK_NAME),1000);
        return ()=>clearTimeout(timeout);
    },[])// eslint-disable-line react-hooks/exhaustive-deps

    return ( 
        <div className='Screenka noscroll'>
            <h1>Witamy bardzo serdeczenie na Screence Tygodnia!</h1>
            <h4 style={{textAlign:"end"}}>APRIL 2023 EDITION</h4>
            <Post id="dsnanaaiaocsn" user_fullname="Default User"/>
            <h2>To co dzis przygotowalismy jest genialne!</h2>
            <Post id="dsnasddsxccsn" user_fullname="Default User"/> 
            <Post id="123123" user_fullname="Tola Bajka"/>
            <footer style={{marginTop:"50px"}}>Screenka Tygodnia ®</footer>
        </div> );
}
 
export default ScreenkaT0;