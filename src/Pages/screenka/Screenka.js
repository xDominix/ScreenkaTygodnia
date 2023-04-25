import React, { useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom/dist';
import ScreenkaT0 from '../../aScreenkas/ScreenkaT0';
import { AuthContext } from '../../Contexts/AuthContext';
import { TeamContext } from '../../Contexts/TeamContext';
import { TimeFor } from '../../Objects/TimeFor';
import NothingToShow from '../NothingToShow';
import ScreenkaTDEMO from '../../aScreenkas/ScreenkaTDEMO';

const Screenka = () => {
    const {team_id} = useParams();
   
    const navigate = useNavigate();

    const {getMe,setMyScreenkaView,amIScreenkaView,setHideIfAppsState} = useContext(AuthContext)
    const {getTeam} = useContext(TeamContext);

      const onLoad= async (week_name)=>{
        if(!TimeFor.Screenka(true)) {navigate("/");return;}
        
        let me = getMe();
        if(me===null) navigate("/login");
        if(!me.teams?.includes(team_id))  {navigate("/");return;}
        
        getTeam(team_id).then(team=>{  setHideIfAppsState(me,team); });

        amIScreenkaView(team_id,week_name).then(ami=>{
          if(ami) {navigate("/");return;}
        })

        return setTimeout(()=>{
        setMyScreenkaView(team_id,week_name);
        console.log("Screenka View has been set")
        },10000);
      }

  switch (Number(team_id)){
        case -1: return <div><ScreenkaTDEMO/></div>
        case 0: return <div><ScreenkaT0 onLoad={onLoad}/></div>
        default: return <NothingToShow/>
    }
  
}
 
export default Screenka;