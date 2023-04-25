import React, { useContext, useEffect, useState } from 'react';
import {App} from '../../../Objects/App/App';
import Checkbox from '../../../Components/Checkbox';
import { AppClass } from '../../../Objects/App/AppClass';
import "./Setup.css"
import {AuthContext} from "../../../Contexts/AuthContext"
import {TeamContext} from "../../../Contexts/TeamContext"
import { ButtonNext } from '../../../Components/Buttons';
import { useRef } from 'react';
import InputField from '../../../Components/InputField';

const Setup = ({onSetup}) => {

    const {getMe,saveMe,trySetMyUsername,setMyPersonalizedApps} = useContext(AuthContext)
    const {getTeam} = useContext(TeamContext)

    const meRef = useRef(getMe());
    const [personalizedApps,setPersonalizedApps] = useState(null);
    const [checkboxes, setCheckboxes] = useState(null);
    
    useEffect(()=>{
        let me = getMe();
        if(me === null) throw new Error("getMe() error")

        inputRef.current.value= me.username;

        getPersonalizedApps(me).then(apps=>{
            setPersonalizedApps(apps)
            let checkboxes = getCheckboxes(me,apps)
            setCheckboxes(checkboxes)
        });
    },[])

    //apps

    const getPersonalizedApps =async (me)=>{
        const personalized_apps_set = new Set();

        if(me.teams == null) throw new Error("me.teams error")
        await me.teams.forEach(async team_id => {
            let team = await getTeam(team_id)
            if(team==null || team.personalized_apps==null) throw new Error("team error")
            team.personalized_apps.forEach(app => {
                personalized_apps_set.add(app)
            });
        });

        return Array.from(personalized_apps_set);
    }
    const getCheckboxes=(me,all_personalized_apps)=>{
        let res = new Array(all_personalized_apps.length).fill(false)

        all_personalized_apps.forEach((app,index) => {
            if(me.personalized_apps.includes(app))
                res[index] = true;
        });
        return res;
    }

    const handleOnChange = (index) => {
        setCheckboxes(checkboxes.map((item, i) => i === index ? !item : item));
    };

    //username

    const inputRef = useRef();
    const [isInputFieldRed,setIsInputFieldRed] = useState(false);
    const [isInputFieldLoading,setIsInputFieldLoading] = useState(false);
    const handleOnEnter = ()=>{
        setIsInputFieldLoading(true);
        inputRef.current.blur();
        trySetMyUsername(inputRef.current.value).then(bool=>{
            if(!bool)
                setIsInputFieldRed(true)
            setIsInputFieldLoading(false);
        })
    }

    //next

    const onNextClick=()=>{
        let my_personalized_apps = [];
        personalizedApps.forEach((app,index) => {
            if(checkboxes[index]) my_personalized_apps.push(app);
        });
        setMyPersonalizedApps(my_personalized_apps).then(()=>{
            saveMe(); 
            onSetup();
        })
    }

    return ( 
        <div className='setup'>
            <h2 className='color-gray-solid'>Welcome, {meRef.current.getName()}!<span role="img" aria-label="emoji"> ✋🏼</span></h2>
       
            <div className='setup-user'>
                <img src={meRef.current.src} alt="profile"/>
                <div>
                    <h4>Username:</h4>
                    <InputField reff={inputRef} onEnter={handleOnEnter} onKeyDown={()=>{if(isInputFieldRed) setIsInputFieldRed(false)}}  isRed={isInputFieldRed} isLoading={isInputFieldLoading} />
                    </div>
               
            </div>
            {personalizedApps && <div className='setup-apps'>
                <h4>Choose apps you interested in:</h4>
                <div className='setup-apps-list'>
                    {personalizedApps.map((appname,index)=>{
                        let app = AppClass.get(appname);
                        return <div key={index}>
                           <Checkbox 
                             checked={checkboxes!==null? checkboxes[index]:false}
                             onChange={() => handleOnChange(index)}
                           />
                            <App key={appname} application={app}/>
                            <div className='setup-app-description'>
                                <div><b>{app.name}</b></div>
                                <p>{app.description} </p>
                            </div>
                        </div>}
                    )}
                </div>
            </div>}
            <div className='flex-center-v'>
                <ButtonNext onClick={onNextClick}></ButtonNext>
            </div>
        </div>
 );
}
 
export default Setup;