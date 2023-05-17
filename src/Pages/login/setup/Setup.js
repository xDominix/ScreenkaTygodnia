import React, { useContext, useEffect, useState } from 'react';
import {App} from '../../../Objects/App/App';
import Checkbox from '../../../Components/Checkbox';
import { AppClass } from '../../../Objects/App/AppClass';
import "./Setup.css"
import {AuthContext} from "../../../Contexts/AuthContext"
import { ButtonNext } from '../../../Components/Buttons';
import { useRef } from 'react';
import InputField from '../../../Components/InputField';
import { getPath } from '../../../aFunctions';

const Setup = ({onSetup}) => {

    const {getMe,saveMe,trySetMyUsername,trySetMyPersonalizedApps,HostService} = useContext(AuthContext);

    const meRef = useRef(getMe());
    const meSrcUrl = useRef() 
    const [personalizedApps,setPersonalizedApps] = useState(null);
    const [checkboxes, setCheckboxes] = useState(null);
    const [isLoading,setIsLoading] = useState(true);
    
    useEffect(()=>{
        let me = getMe();
        if(me === null) throw new Error("getMe() error")

        inputRef.current.value= me.username;

        let sess = sessionStorage.getItem(meRef.current.fullname+"_src");
        meSrcUrl.current = sess?sess:getPath('default_profile_picture.png');

        getPersonalizedApps(me).then(apps=>{
            setPersonalizedApps(apps)
            let checkboxes = getCheckboxes(me,apps)
            setCheckboxes(checkboxes)
            setIsLoading(false);
        });

    },[])// eslint-disable-line react-hooks/exhaustive-deps

    //apps

    const getPersonalizedApps =async (me)=>{
        const personalized_apps_set = new Set();

        if(me.hosts == null) throw new Error("me.hosts error")
        for(let i =0;i<me.hosts.length;i++)
        {
            let host = await HostService.getHost(me.hosts[i])
            if(host==null || host.personalized_apps==null) throw new Error("host error")
            host.personalized_apps.forEach(app => {
                personalized_apps_set.add(app)
            });
        }
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
    const handleOnEnter = ()=>{
        setIsLoading(true);
        inputRef.current.blur();
        trySetMyUsername(inputRef.current.value).then(bool=>{
            if(!bool)
                setIsInputFieldRed(true)
            setIsLoading(false);
        })
    }

    //next

    const onNextClick=()=>{
        setIsLoading(true);
        let my_personalized_apps = [];
        personalizedApps.forEach((app,index) => {
            if(checkboxes[index]) my_personalized_apps.push(app);
        });
        trySetMyPersonalizedApps(my_personalized_apps).then(res=>{
            if(res) {saveMe();onSetup();}
            setIsLoading(false);
        })
    }

    return ( 
        <div className='setup'>
            <h2 className='color-gray-solid'>Welcome, {meRef.current.getName()}!<span role="img" aria-label="emoji"> ✋🏼</span></h2>
       
            <div className='setup-user'>
                <img src={meSrcUrl.current} alt="profile"/>
                <div>
                    <h4>Username:</h4>
                    <InputField reff={inputRef} onEnter={handleOnEnter} onKeyDown={()=>{if(isInputFieldRed) setIsInputFieldRed(false)}}  isRed={isInputFieldRed} isLoading={isLoading} />
                    </div>
               
            </div>
            {personalizedApps?.length>0 && <div className='setup-apps'>
                <h4>Choose apps you interested in:</h4>
                <div className='setup-apps-list'>
                    {personalizedApps.map((appname,index)=>{
                        let app = AppClass.get(appname);
                        return <div key={index}>
                           <Checkbox 
                             disabled={isLoading}
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
                <ButtonNext disabled={isLoading} onClick={onNextClick}></ButtonNext>
            </div>
        </div>
 );
}
 
export default Setup;