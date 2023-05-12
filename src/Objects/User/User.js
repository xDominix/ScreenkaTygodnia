import React, {  useContext, useEffect, useState } from 'react';
import { getPath } from '../../aFunctions';
import { UserContext } from '../../Contexts/UserContext';

const User = ({user_fullname,count=null,onClick, height=32}) => {
    const {getUserSrcUrl} = useContext(UserContext)
    const [srcUrl,setSrcUrl] = useState(getPath('default_profile_picture.png'));

    useEffect(()=>{
        if(count==null) getUserSrcUrl(user_fullname).then(setSrcUrl);
    },[user_fullname])// eslint-disable-line react-hooks/exhaustive-deps

    if(count!=null)
    return ( 
        <div className='fromdown' onClick={onClick?onClick:()=>{}}>
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
    <button className='fromdown' onClick={onClick?onClick:()=>{}}>
        <img alt={"user"}
        className={"shadow"}
        style={{
            height:height+"px",width:height+"px",
            borderRadius:Math.floor(height/2)+"px"}}
        src={srcUrl} />
    </button> );
}
 
export default User;