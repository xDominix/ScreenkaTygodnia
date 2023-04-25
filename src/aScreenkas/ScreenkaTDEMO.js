import React from 'react';
import Post from '../Objects/Post/Post';
import "./Screenka.css"
import { DEMONAME } from '../Contexts/Repository';

const WEEK_NAME = "First Week";

const ScreenkaTDEMO = ({}) => {

    return ( 
    <div className='Screenka noscroll'>
        <h1>Witamy bardzo serdeczenie na Screence Tygodnia!</h1>
        <h4 style={{textAlign:"end"}}>APRIL 2023 EDITION</h4>
        <Post id="dsnanaaiaocsn" user_fullname={DEMONAME}/>
        <h2>To co dzis przygotowalismy jest genialne!</h2>
        <Post id="dsnasddsxccsn" user_fullname={DEMONAME}/> 
        <Post id="123123" user_fullname="Tola Bajka"/>
        <footer style={{marginTop:"50px"}}>Screenka Tygodnia ®</footer>
    </div> );
}
 
export default ScreenkaTDEMO;