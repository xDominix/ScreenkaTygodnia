import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthContext';
import { BottomTabProvider } from '../../Contexts/BottomTabContext';
import Home from './home/Home';
import "./Start.css"
import AboutWeek from './about-week/AboutWeek';
import { datesWeekDelta, NOW } from '../../aFunctions';

const Start = () => {
    const navigate = useNavigate();

    const {getMeAndMyTeamAndMyWeek} = useContext(AuthContext)

    const [aboutToggled,setAboutToggled] = useState(false);
    const [weekNumber,setWeekNumber] = useState(null);
    const [week,setWeek] = useState(null)
    
    useEffect(()=>{

      let [me,team,week] = getMeAndMyTeamAndMyWeek()

        if(me===null) navigate("/login");
        else{
          
          setWeekNumber(datesWeekDelta(team.start_date,NOW));

          if(week!==null) setWeek(week);
        }
    },[])

    return ( 
        <div className='start'>
          <BottomTabProvider>
          <div className="start-pages" style={aboutToggled?{transform:"translateX(-50%)"}:{}}>
            <div>
              <Home weekNumber={weekNumber} week={week} onAboutWeekClick={()=>setAboutToggled(true)}/>
            </div>
            <div>
                {week && <AboutWeek weekNumber={weekNumber} week={week} onClose={()=>setAboutToggled(false)}/>}
            </div>
            
        </div>
        </BottomTabProvider>
        </div>
     );
}
 
export default Start;