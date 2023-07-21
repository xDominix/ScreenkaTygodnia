import React, { useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom/dist';
import ScreenkaT0 from '../aScreenkas/ScreenkaT0';
import { AuthContext } from '../Contexts/AuthContext';
import NothingToShow from './NothingToShow';
import ScreenkaTDEMO from '../aScreenkas/ScreenkaTDEMO';
import { Event } from '../Objects/Event/_Event';

const HANDLING_EVENT = "screenkatygodnia"; 

const Screenka = () => {
    const {host_id} = useParams();
   
    const navigate = useNavigate();

    const {getMe,trySetMyScreenkaView,setHideIfAppsState,getHost,getMyInteractiveEvent} = useContext(AuthContext);

    const onLoad= async (week_name)=>{
      let event = getMyInteractiveEvent(HANDLING_EVENT);
      if(!Event.canInteract(event,{week:week_name}))  {navigate("/");return;}
      
      let me = getMe();
      if(me===null) navigate("/");
      if(!me.hosts?.includes(host_id))  {navigate("/");return;}
      
      getHost(host_id).then(host=>{  setHideIfAppsState(me,host); });

      return setTimeout(()=>{
        let is_new = Event.setInteraction(event)
        if(is_new) trySetMyScreenkaView(host_id,week_name).then(res=>console.log(res?"Screenka View has been set":"Screenka View hasnt been set"))
      },3000);
    }

    const getContent = ()=>{switch (host_id){
      case "-1": return <ScreenkaTDEMO/>
      case "0": return  <ScreenkaT0 onLoad={onLoad}/>
      default: return <NothingToShow/>
    }}

    return (<div className='noselect'>
      {getContent()}
    </div>)
    
  
}
 
export default Screenka;