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

export const ButtonUpload = ({onClick,disabled,tickets,noTicketAnimation=false,hashtaged}) =>{
    let init_text = hashtaged ? "UPLO#D":"UPLOAD";
    return (
    <button disabled={disabled} className={"button-upload"+(!disabled?" focus":(noTicketAnimation ? " focus opacity ":" bcolor-gray"))} onClick={onClick}>
        {noTicketAnimation &&  (init_text)}
        {!noTicketAnimation && !disabled && (init_text + (tickets>0 ?  "" :"*"))}
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
export const ButtonNextPage=({onClick,focus,disabled,children})=>{ //strzalka znika gdy jest children i jest disabled, w pozostalych przypadkach sie opacituje
    const navigate = useNavigate();
    const handleClick = ()=> {
        if(onClick) onClick();
        else navigate(1);
    }
    return (<span className={'button-page'+((!disabled &&focus) ? " color-green-highlight":"")+ (disabled&&!children?" opacity":"")}
        onClick={disabled ? undefined : handleClick}
        style={{float:"right",...(disabled?{cursor:"default"}:{})}}
    >{children}<span style={(children!=null && disabled)?{opacity:0}:undefined} className="arrow">{">"}</span></span>)
}
export const ButtonPrevPage=({disabled,onClick=null,alert=false,children})=>{ //strzalka znika gdy jest children i jest disabled, w pozostalych przypadkach sie opacituje
    const navigate = useNavigate();
    const handleClick = ()=> {
        if(!alert || window.confirm("Are you sure you want to leave?")){
            if(onClick) onClick();
            else navigate(-1)
        }  
    }
    return (<span className={'button-page'+ (disabled?" opacity":"")}
    onClick={disabled ? undefined : handleClick}
    style={disabled?{cursor:"default"}:undefined}
    ><span style={(children!=null && disabled)?{opacity:0}:undefined} className="arrow">{"<"}</span>{children}</span>)
}