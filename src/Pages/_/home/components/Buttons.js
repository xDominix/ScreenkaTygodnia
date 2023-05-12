import React from 'react';
import { getPath } from '../../../../aFunctions';
import "./Buttons.css"

export const ButtonText = ({style, onClick,text}) => {
    return (  <button
     className={"bcolor-blue button-week-uploads shadow"}
      style={style} onClick={onClick}>
        <h2  style={{margin:"5px",fontSize:"30px",lineHeight:"28px",color:"white"}}>{text.toUpperCase()}</h2>
    </button> );
}

export const ButtonWeekUploads = ({style, onClick}) => {
    return (  <button
     className={"bcolor-dark-gray-solid button-week-uploads shadow"}
      style={style} onClick={onClick}>
        <h2 style={{margin:"5px",fontSize:"30px",lineHeight:"28px"}}>YOUR WEEK<br/>UPLOADS</h2>
    </button> );
}

export const ButtonScreenka = ({style,onClick,disabled}) => {

    return (
        <button className={'button-screenka focus shadow '} style={style} onClick={onClick} disabled={disabled}>
            <img  src={getPath("screenka-border-top.png")} alt="decorative drawing"></img>
            <h2 >SCREENKA<span></span><br></br><span></span>TYGODNIA</h2>
            <img src={getPath("screenka-border-bottom.png")} alt="decorative drawing"></img>
        </button>
);}

export const ButtonPlus = ({style, onClick,isRotate=false,disabled}) => {
    return (  <button disabled={disabled}
     className={"bcolor-dark-gray-solid "+((isRotate?"button-plus-red ":"")+'button-plus shadow ')}
      style={style} onClick={onClick}>
        <div className={isRotate?"rotate":""}>+</div>
    </button> );
}

