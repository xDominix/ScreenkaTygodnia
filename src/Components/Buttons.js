import { useNavigate } from "react-router-dom";
import "./Buttons.css"
import React from 'react';

export const ButtonClose = ({onClick}) =>{

    return (
    <button className="button-close bcolor-dark-gray" onClick={onClick}>
        <div className="noselect">+</div>
    </button>)
}

export const ButtonNext = ({onClick,disabled}) =>{

    return (
    <button disabled={disabled} className="button-next focus" onClick={onClick}>
        NEXT
    </button>)
}

export const ButtonUpload = ({onClick,disabled,tickets}) =>{
    return (
    <button disabled={disabled} className={"button-upload"+(!disabled?" focus":" bcolor-gray")} onClick={onClick}>
        {!disabled && (tickets>0 ?  "UPLOAD" : "UPLOAD*")}
        {disabled &&  <h5><span role="img" aria-label="ticket" >🎟️</span>x{tickets}</h5>/*style={{fontSize:"17px"}} */} 
    </button>)
}

export const ButtonPaste = ({onClick,disabled}) =>{
    return (
    <button disabled={disabled} className="paste" onClick={onClick}>
        PASTE
    </button>)
}

/*USEFULL WITH H1 */
export const ButtonPageNext=({onClick,disabled})=>{
    const navigate = useNavigate();
    const defaultClick = ()=>navigate(1);
    return (<span className='button-page'
        onClick={onClick?onClick:defaultClick}
        style={disabled?{opacity:"0",cursor:"default"}:{}}
    >{">"}</span>)
}
export const ButtonPageBack=({onClick,disabled})=>{
    const navigate = useNavigate();
    const defaultClick = ()=>navigate(-1);
    return (<span className='button-page'
    onClick={onClick?onClick:defaultClick}
        style={disabled?{opacity:"0",cursor:"default"}:{}}
    >{"<"}</span>)
}