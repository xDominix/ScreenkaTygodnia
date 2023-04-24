import React, { useState } from 'react';
import { ButtonPaste } from './Buttons';
import "./InputField.css"

const InputField = (
    {autofocus,reff,placeholder, h5,readOnly,
    onEnter,
    isRed,isLoading,
    longer,file,paste}) => {

    const [typed,setTyped] = useState(false);

    const handleKeyDown = (event)=>{
        if(!typed) setTyped(true);
        
        if (event.key === 'Enter') {
            reff.current.blur();
            setTyped(false)
            onEnter();
        }
    }

    const onPasteClick=()=>{
        navigator.clipboard.readText().then((clipText) => {reff.current.value = clipText;console.log(clipText)});
    }

    if(paste && navigator.clipboard)
    return ( 
        <div className='input-paste' >
            <InputField autofocus={autofocus} reff={reff} readOnly={readOnly} onEnter={onEnter} isRed={isRed} isLoading={isLoading} placeholder={placeholder} longer={longer}/>
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
        <input className={((isRed && !typed && !isLoading)?"bcolor-red":"")+(longer?" longer":"")} 
        placeholder={placeholder}
        readOnly={isLoading || readOnly} 
        style={{...(h5?{fontSize:"17px"}:{}) , ...(isLoading?{opacity:"0.5"}:{})}} 
        autoFocus={autofocus} ref={reff} 
        onKeyDown={handleKeyDown}
        />
    );

}
 
export default InputField;