import React from 'react';
import { ButtonPaste } from './Buttons';
import "./InputField.css"

const InputField = (
    {autofocus,reff,placeholder,
    onEnter,onKeyDown,
    isRed,isLoading,
    longer,file,paste}) => {

    const handleKeyDown = (event)=>{
        if(typeof onKeyDown ===  'function')onKeyDown();
        if (event.key === 'Enter') onEnter()
    }

    const onPasteClick=()=>{
        navigator.clipboard.readText().then((clipText) => {reff.current.value = clipText;console.log(clipText)});
    }

    if(paste && navigator.clipboard)
    return ( 
        <div className='input-paste' >
            <InputField autofocus={autofocus} reff={reff} onEnter={onEnter} onKeyDown={onKeyDown} isRed={isRed} isLoading={isLoading} placeholder={placeholder} longer={longer}/>
            <ButtonPaste onClick={onPasteClick}/>
        </div>
    );

    if(file)
    {
        return (<input type="file" accept="image/*,video/*"  tilte="file..."/>)
    }

    if(longer)
    return (
    <textarea cols="8" rows="5" placeholder={placeholder} ref={reff}>
    </textarea>)

    return ( 
        <input className={(isRed?"bcolor-red":"")+(longer?" longer":"")} 
        placeholder={placeholder}
        readOnly={isLoading} 
        style={isLoading?{opacity:"0.5"}:{}} 
        autoFocus={autofocus} ref={reff} 
        onKeyDown={handleKeyDown}
        />
    );

}
 
export default InputField;