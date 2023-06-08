import React from 'react';
import "./Checkbox.css"

const Checkbox = ({defaultChecked,checked,disabled,onChange,name=""}) => {
    return (  
        <label className="container">
            <input 
                type="checkbox" 
                name ={name}
                defaultChecked={defaultChecked}
                checked={checked}
                disabled={disabled || onChange==null}
                onChange={onChange?onChange:()=>{}} //e: {name, checked}
            />
            <span className="checkmark"></span>
        </label>
    );
}
 
export default Checkbox;