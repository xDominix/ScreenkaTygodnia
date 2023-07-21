import React, {  useContext, useEffect, useState } from 'react';
import { getPath } from '../../aFunctions';
import { AuthContext } from '../../Contexts/AuthContext';

const User = ({user_fullname,count=null,onClick, height=32,disabled}) => {
    const {UserService} = useContext(AuthContext)
    const [srcUrl,setSrcUrl] = useState(getPath('default_profile_picture.png'));

    useEffect(()=>{
        if(count==null) UserService.getUserSrcUrl(user_fullname).then(setSrcUrl);
    },[user_fullname])// eslint-disable-line react-hooks/exhaustive-deps

    if(count!=null)
    return ( 
        <div className={'fromdown '+(disabled ? "opacity":"")} onClick={(onClick&&!disabled)?onClick:()=>{}}>
        <span className='bcolor-dark-gray shadow'  style={{
            display:"block",
            height:height+"px",width:height+"px",
            borderRadius:Math.floor(height/2)+"px",
            }}>
            <div
            style={{
                fontSize:"18px",paddingTop:"6px",textAlign:"center",fontWeight:"bold"
                }}
            >+{count}</div>
        </span>
        </div> );

    return ( 
    <button className={'fromdown '+(disabled ? "opacity":"")} onClick={(onClick&&!disabled)?onClick:()=>{}}>
        <img alt={"user"}
        className={"shadow"}
        style={{
            height:height+"px",width:height+"px",
            borderRadius:Math.floor(height/2)+"px"}}
        src={srcUrl} />
    </button> );
}
 
export default User;