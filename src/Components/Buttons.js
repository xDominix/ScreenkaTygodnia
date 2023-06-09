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

export const ButtonUpload = ({onClick,disabled,tickets,noTicketAnimation=false}) =>{
    return (
    <button disabled={disabled} className={"button-upload"+(!disabled?" focus":(noTicketAnimation ? " focus opacity ":" bcolor-gray"))} onClick={onClick}>
        {noTicketAnimation &&  ("UPLOAD" )}
        {!noTicketAnimation && !disabled && (tickets>0 ?  "UPLOAD" : "UPLOAD*")}
        {!noTicketAnimation && disabled &&  <h5><span role="img" aria-label="ticket" >🎟️</span>x{tickets}</h5>/*style={{fontSize:"17px"}} */} 
    </button>)
}

export const ButtonPaste = ({onClick,disabled}) =>{
    return (
    <button disabled={disabled} className="paste" onClick={onClick}>
        PASTE
    </button>)
}

/*USEFULL WITH H1 */
export const ButtonNextPage=({style,onClick,focus,disabled,children})=>{
    const navigate = useNavigate();
    const handleClick = ()=> {
        if(onClick) onClick();
        else navigate(1);
    }
    return (<span className={'button-page'+((!disabled &&focus) ? " color-green-highlight":"")}
        onClick={!disabled?(handleClick):undefined}
        style={{...style, float:"right",...(disabled?{opacity:"0.5",cursor:"default"}:{})}}
    >{children}<span className="arrow">{">"}</span></span>)
}
export const ButtonPrevPage=({style,disabled,onClick=null,alert=false,children})=>{
    const navigate = useNavigate();
    const handleClick = ()=> {
        if(!alert || window.confirm("Are you sure you want to leave?")){
            if(onClick) onClick();
            else navigate(-1)
        }  
    }
    return (<span className='button-page'
    onClick={!disabled?(handleClick):undefined}
    style={{...style,...(disabled?{opacity:"0.5",cursor:"default"}:{})}}
    ><span className="arrow">{"<"}</span>{children}</span>)
}