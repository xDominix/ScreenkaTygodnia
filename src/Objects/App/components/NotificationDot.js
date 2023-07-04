import React from 'react';
import "./NotificationDot.css";

const NotificationDot = ({value,orange,onClick=null}) => {

    const isCharacter=(value)=>{
        return typeof value === "string" && value.length===1;
    }

    return (  
        <span onClick={onClick?onClick:()=>{}} className={"noti-dot noselect"+(orange?" bcolor-orange":" bcolor-red"+(onClick?" clickable":""))}>
            {isCharacter(value) &&<div  style={value==="*"?{fontSize:"27px",paddingTop:"7px"}:{fontSize:"27px",paddingTop:"1px"}} >{value}</div>}
            {!isCharacter(value) &&<div style={{marginTop:"-1px"}}>{value}</div>}
        </span>);
}
 
export default NotificationDot;