import React from 'react';
import "./Checkbox.css"

const Checkbox = ({checked,disabled,onChange}) => {
    return (  
        <label className="container">
            <input 
                type="checkbox" 
                checked={checked}
                disabled={disabled || onChange==null}
                onChange={onChange?onChange:()=>{}}
            />
            <span className="checkmark"></span>
        </label>
    );
}
 
export default Checkbox;