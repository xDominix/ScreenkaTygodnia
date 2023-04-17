import "./Buttons.css"
import React from 'react';

export const ButtonClose = ({onClick}) =>{

    return (
    <button className="button-close bcolor-dark-gray" onClick={onClick}>
        <div className="noselect">+</div>
    </button>)
}

export const ButtonNext = ({onClick}) =>{

    return (
    <button className="button-next focus" onClick={onClick}>
        NEXT
    </button>)
}

export const ButtonUpload = ({onClick,children}) =>{
    return (
    <button className="button-upload focus" onClick={onClick}>
        {children ? children : "UPLOAD"}
    </button>)
}

export const ButtonPaste = ({onClick}) =>{
    return (
    <button className="button-paste color-gray" onClick={onClick}>
        PASTE
    </button>)
}