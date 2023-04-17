import React from 'react';

const User = ({user, onClick, height=32}) => {
    return ( 
    <button className='fromdown' onClick={onClick}>
        <img alt={"user photo"}
        className={"shadow"}
        style={height>64?
            {
            height:height+"px",width:height+"px",
            borderRadius:Math.floor(height/2)+"px",
            }:
            { 
            height:height+"px",width:height+"px",
            borderRadius:Math.floor(height/2)+"px"
            }}
        src={user.src} />
    </button> );
}
 
export default User;