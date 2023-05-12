import React, {  useContext, useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import InputField from '../../../Components/InputField';
import { AuthContext } from '../../../Contexts/AuthContext';
import "./TempLogin.css"
import { UserContext } from '../../../Contexts/UserContext';
import { getPath } from '../../../aFunctions';

const TempLogin = ({onTempLogin}) => {

    const {getMe,tryLogMeInTemporarly} = useContext(AuthContext)
    const {getUserSrcUrl} = useContext(UserContext)

    const [meSrc,setMeSrc] = useState(getPath("default_profile_picture.png"))
    const inputRef = useRef();

    const [isInputFieldRed,setIsInputFieldRed] = useState(false);
    const [isInputFieldLoading,setIsInputFieldLoading] = useState(false);

    useEffect(()=>{

        const timeout = setTimeout(()=>{
            let me =getMe();
            if(me== null) return;
            inputRef.current.value=me.username; 

            getUserSrcUrl(me.fullname).then(setMeSrc);
        },500);
    
        return ()=> clearTimeout(timeout);
           
    },[])// eslint-disable-line react-hooks/exhaustive-deps

    const handleOnEnter = async () => {
        setIsInputFieldLoading(true)
        
        let res = await tryLogMeInTemporarly(inputRef.current.value);

        setIsInputFieldRed(!res);
        if(res) onTempLogin();
        
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