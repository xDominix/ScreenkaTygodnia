import React, { useContext, useEffect, useState } from 'react';
import {App} from '../../../Objects/App/App';
import Checkbox from '../../../Components/Checkbox';
import { AppClass } from '../../../Objects/App/AppClass';
import "./Setup.css"
import {AuthContext} from "../../../Contexts/AuthContext"
import {HostContext} from "../../../Contexts/HostContext"
import { ButtonNext } from '../../../Components/Buttons';
import { useRef } from 'react';
import InputField from '../../../Components/InputField';
import { getPath } from '../../../aFunctions';

const Setup = ({onSetup}) => {

    const {getMe,saveMe,trySetMyUsername,setMyPersonalizedApps} = useContext(AuthContext)
    const {getHost} = useContext(HostContext)

    const meRef = useRef(getMe());
    const meSrcUrl = useRef() 
    const [personalizedApps,setPersonalizedApps] = useState(null);
    const [checkboxes, setCheckboxes] = useState(null);
    
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
        });

    },[])// eslint-disable-line react-hooks/exhaustive-deps

    //apps

    const getPersonalizedApps =async (me)=>{
        const personalized_apps_set = new Set();

        if(me.hosts == null) throw new Error("me.hosts error")
        for(let i =0;i<me.hosts.length;i++)
        {
            let host = await getHost(me.hosts[i])
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
                <img src={meSrcUrl.current} alt="profile"/>
                <div>
                    <h4>Username:</h4>
                    <InputField reff={inputRef} onEnter={handleOnEnter} onKeyDown={()=>{if(isInputFieldRed) setIsInputFieldRed(false)}}  isRed={isInputFieldRed} isLoading={isInputFieldLoading} />
                    </div>
               
            </div>
            {personalizedApps?.length>0 && <div className='setup-apps'>
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