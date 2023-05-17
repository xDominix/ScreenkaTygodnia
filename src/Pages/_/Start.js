import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthContext';
import { BottomTabProvider } from '../../Contexts/BottomTabContext';
import Home from './home/Home';
import "./Start.css"
import AboutWeek from './about-week/AboutWeek';

const Start = () => {
    const navigate = useNavigate();

    const {getMe,getMyHostWeekNumber,weekState} = useContext(AuthContext)

    const weekNumber = useRef(getMyHostWeekNumber());

    const [aboutToggled,setAboutToggled] = useState(false);
    
    useEffect(()=>{
        if(getMe()==null) {navigate("/login");return;}
    },[]) // eslint-disable-line react-hooks/exhaustive-deps

    return ( 
        <div className='start'>
          <BottomTabProvider>
          <div className="start-pages" style={aboutToggled?{transform:"translateX(-50%)"}:{}}>
            <div>
              {getMe() && <Home weekNumber={weekNumber.current} week={weekState} onAboutWeekClick={()=>setAboutToggled(true)}/>}
            </div>
            <div>
                {weekState && <AboutWeek weekNumber={weekNumber.current} week={weekState} onClose={()=>setAboutToggled(false)}/>}
            </div>
            
        </div>
        </BottomTabProvider>
        </div>
     );
}
 
export default Start;