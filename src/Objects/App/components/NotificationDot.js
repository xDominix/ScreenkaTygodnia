import React from 'react';
import "./NotificationDot.css";

const NotificationDot = ({value,blue}) => {

    const isCharacter=(value)=>{
        return typeof value === "string" && value.length===1;
    }

    return (  
        <span className={"noti-dot noselect"+(blue?" bcolor-rn":" bcolor-red")}>
            {isCharacter(value) &&<div  style={value==="*"?{fontSize:"27px",paddingTop:"7px"}:{fontSize:"27px",paddingTop:"1px"}} >{value}</div>}
            {!isCharacter(value) &&<div style={{marginTop:"-1px"}}>{value}</div>}
        </span>);
}
 
export default NotificationDot;