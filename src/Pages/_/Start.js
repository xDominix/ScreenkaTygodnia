import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthContext';
import { BottomTabProvider } from '../../Contexts/BottomTabContext';
import Home from './home/Home';
import "./Start.css"
import AboutWeek from './about-week/AboutWeek';

const Start = () => {
    const navigate = useNavigate();

    const {getMe,getMyHostWeekNumber,getMyHostWeekSpecialDays,weekSnapshot} = useContext(AuthContext)

    const weekNumber = useRef(getMyHostWeekNumber());

    const [specialDays,setSpecialDays]=useState(0);
    const [aboutToggled,setAboutToggled] = useState(false);
    
    useEffect(()=>{
      if(aboutToggled && specialDays===0) getMyHostWeekSpecialDays().then(setSpecialDays);
    },[aboutToggled]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(()=>{
        if(getMe()==null) {navigate("/login");return;}
    },[]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(()=>{
      console.log("Page update");
    },)

    return ( 
        <div className='start'>
          <BottomTabProvider>
          <div className="start-pages" style={aboutToggled?{transform:"translateX(-50%)"}:{}}>
            <div>
              {getMe() && <Home weekNumber={weekNumber.current} week={weekSnapshot} onAboutWeekClick={()=>setAboutToggled(true)}/>}
            </div>
            <div>
                {weekSnapshot && <AboutWeek weekNumber={weekNumber.current} week={weekSnapshot} special_days={specialDays} onClose={()=>setAboutToggled(false)}/>}
            </div>
            
        </div>
        </BottomTabProvider>
        </div>
     );
}
 
export default Start;