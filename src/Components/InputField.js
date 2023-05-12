import React, { useState } from 'react';
import { ButtonPaste } from './Buttons';
import "./InputField.css"

const InputField = (
    {autofocus,reff,placeholder, h5,readOnly=false,
    onEnter,onChange,
    isRed,isLoading,value,
    longer,file,paste}) => {

    const [typed,setTyped] = useState(false);

    const handleKeyDown = (event)=>{
        if(!typed) setTyped(true);
        
        if (event.key === 'Enter') {
            reff.current.blur();
            setTyped(false)
            if(!readOnly) onEnter();
        }
    }

    const onPasteClick=()=>{
        navigator.clipboard.readText().then((clipText) => {reff.current.value = clipText;});
    }

    if(paste && navigator.clipboard)
    return ( 
        <div className='input-paste' >
            <InputField autofocus={autofocus} onChange={onChange} value={value} reff={reff} readOnly={readOnly} onEnter={onEnter} isRed={isRed} isLoading={isLoading} placeholder={placeholder} longer={longer}/>
            <ButtonPaste onClick={onPasteClick}/>
        </div>
    );

    if(file)
    {
        return (<input className={((isRed && !isLoading)?"bcolor-red":"")} type="file" accept="image/*"  tilte="file..." onChange={onChange}/>)
    }

    if(value!=null)
    {
        if(longer) return (<textarea cols="8" rows="5" placeholder={placeholder} value={value}></textarea>)
        return ( 
            <input className={((isRed && !typed && !isLoading)?"bcolor-red":"")+(longer?" longer":"")} 
            placeholder={placeholder}
            readOnly={isLoading || readOnly} 
            style={{...(h5?{fontSize:"17px"}:{}) , ...(isLoading?{opacity:"0.5"}:{})}} 
            autoFocus={autofocus} value={value}
            onKeyDown={handleKeyDown} onChange={onChange}
            />
        );
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
        onKeyDown={handleKeyDown} onChange={onChange}
        />
    );

}
 
export default InputField;