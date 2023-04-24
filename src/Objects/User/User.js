import React from 'react';
import { getUserFullSrc } from '../../aFunctions';

const User = ({user, onClick, height=32}) => {
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
        src={user?user.src:getUserFullSrc()} />
    </button> );
}
 
export default User;