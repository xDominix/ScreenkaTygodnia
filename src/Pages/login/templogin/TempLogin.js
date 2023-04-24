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
        const timeout = setTimeout(()=>{
            let me =getMe();
            inputRef.current.value=me.username; 
            setMeSrc(me.src)},500);
    
        return ()=> clearTimeout(timeout);

    },[])

    const handleOnEnter = async () => {
        setIsInputFieldLoading(true)
        
        let res = await tryLogMeInTemporarly(inputRef.current.value);
        setIsInputFieldRed(!res);
        if(res) onTempLogin()
        else{
            setTimeout(()=>{
            let me =getMe();
            inputRef.current.value=me.username;
        },500);
        }
        
        setIsInputFieldLoading(false);
      };

    return ( 
    <div className='login flex-center'>
        <div className='login-user'>
            <img src={meSrc} alt="profile"/>
            <div>
                <h4>Username:</h4>
                <InputField autofocus reff={inputRef} onEnter={handleOnEnter} isRed={isInputFieldRed} isLoading={isInputFieldLoading} />
            </div>
        
        </div>
    </div> );
}
 
export default TempLogin;