import React, { useCallback, useContext, useEffect, useState } from 'react';
import { getPath } from '../../aFunctions';
import { UserContext } from '../../Contexts/UserContext';

const User = ({user,onClick, height=32}) => {
    const {getUserSrcUrl} = useContext(UserContext)
    const [srcUrl,setSrcUrl] = useState(getPath('default_profile_picture.png'));

    const load = useCallback(()=>{
        getUserSrcUrl(user).then(setSrcUrl);
    },[getUserSrcUrl,srcUrl,user])

    useEffect(()=>{
        load();
    },[load])

    return ( 
    <button className='fromdown' onClick={onClick?onClick:()=>{}}>
        <img alt={"user photo"}
        className={"shadow"}
        style={(height>64?
            {
            height:height+"px",width:height+"px",
            borderRadius:Math.floor(height/2)+"px",
            }:
            { 
            height:height+"px",width:height+"px",
            borderRadius:Math.floor(height/2)+"px"
            })}
        src={srcUrl} />
    </button> );
}
 
export default User;