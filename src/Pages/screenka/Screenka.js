import React, { useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom/dist';
import ScreenkaT0 from '../../aScreenkas/ScreenkaT0';
import { AuthContext } from '../../Contexts/AuthContext';
import { PostContext } from '../../Contexts/PostContext';
import { TeamContext } from '../../Contexts/TeamContext';
import { TimeFor } from '../../Objects/Day';
import NothingToShow from '../NothingToShow';

const Screenka = () => {
    const {team_id} = useParams();
   
    const navigate = useNavigate();

    const {getMe,setMyScreenkaView,amIScreenkaView} = useContext(AuthContext)
    const {setHideIfAppsState} = useContext(PostContext)
    const {getTeam} = useContext(TeamContext);

      const onLoad= async (week_name)=>{
        if(!TimeFor.Screenka(true)) navigate("/");
        
        let me = getMe();
        if(me===null) navigate("/login");
        if(!me.teams?.includes(team_id)) navigate("/"); 
        
        getTeam(team_id).then(team=>{
          setHideIfAppsState(me,team);
        });

        amIScreenkaView(team_id,week_name).then(ami=>{
          if(ami) navigate("/");
        })

        return setTimeout(()=>{
        setMyScreenkaView(team_id,week_name);
        console.log("Screenka View has been set")
        },10000);
      }

    switch (Number(team_id)){
        case 0: return <ScreenkaT0 onLoad={onLoad}></ScreenkaT0>
        default: return <NothingToShow/>
    }
}
 
export default Screenka;