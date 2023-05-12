import React, { useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom/dist';
import ScreenkaT0 from '../../aScreenkas/ScreenkaT0';
import { AuthContext } from '../../Contexts/AuthContext';
import { HostContext } from '../../Contexts/HostContext';
import { TimeFor } from '../../Objects/TimeFor';
import NothingToShow from '../NothingToShow';
import ScreenkaTDEMO from '../../aScreenkas/ScreenkaTDEMO';

const Screenka = () => {
    const {host_id} = useParams();
   
    const navigate = useNavigate();

    const {getMe,setMyScreenkaView,amIScreenkaViewLocal,setHideIfAppsState} = useContext(AuthContext)
    const {getHost} = useContext(HostContext);

      const onLoad= async (week_name)=>{
        if(!TimeFor.Screenka(true)) {navigate("/");return;}
        
        let me = getMe();
        if(me===null) navigate("/login");
        if(!me.hosts?.includes(host_id))  {navigate("/");return;}
        
        getHost(host_id).then(host=>{  setHideIfAppsState(me,host); });

        if(amIScreenkaViewLocal(host_id)) {navigate("/");return;}

        return setTimeout(()=>{
        setMyScreenkaView(host_id,week_name);
        console.log("Screenka View has been set")
        },10000);
      }

  switch (Number(host_id)){
        case -1: return <div><ScreenkaTDEMO/></div>
        case 0: return <div><ScreenkaT0 onLoad={onLoad}/></div>
        default: return <NothingToShow/>
    }
  
}
 
export default Screenka;