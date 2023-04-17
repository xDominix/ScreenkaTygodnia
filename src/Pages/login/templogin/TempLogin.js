import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import InputField from '../../../Components/InputField';
import { AuthContext } from '../../../Contexts/AuthContext';
import { delay } from '../../../aFunctions';
import "./TempLogin.css"
import { UserClass } from '../../../Objects/User/UserClass';

const TempLogin = ({onTempLogin}) => {

    const {getMe,tryLogMeInTemporarly} = useContext(AuthContext)

    const [meSrc,setMeSrc] = useState(UserClass.getDefaultSrc())
    const inputRef = useRef("");

    const [isInputFieldRed,setIsInputFieldRed] = useState(false);
    const [isInputFieldLoading,setIsInputFieldLoading] = useState(false);

    useEffect(()=>{
        delay(500).then(()=>{ 
            let me =getMe();
            inputRef.current.value=me.username; 
            setMeSrc(me.src)});
    },[])

    const handleOnEnter = async () => {
        setIsInputFieldLoading(true)
        
        inputRef.current.blur();

        let res = await tryLogMeInTemporarly(inputRef.current.value);
        if(!res)    setIsInputFieldRed(true);
        else        onTempLogin()
        
        setIsInputFieldLoading(false);
      };

    return ( 
    <div className='login flex-center'>
        <div className='login-user'>
            <img src={meSrc} alt="profile"/>
            <div>
                <h4>Username:</h4>
                <InputField autofocus reff={inputRef} onEnter={handleOnEnter} onKeyDown={()=>{if(isInputFieldRed) setIsInputFieldRed(false)}}  isRed={isInputFieldRed} isLoading={isInputFieldLoading} />
            </div>
        
        </div>
    </div> );
}
 
export default TempLogin;