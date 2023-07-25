import React from 'react';
import "./A.css"

const A = ({
        className="", nocolor=false,bold,underline,red=false,
        onClick,disabled=false,active=true,
        children
    }) => {
    const handleOnClick = ()=>{
        if(disabled) return;
        if(onClick) onClick();
    }
    
    return ( <span className={"A noselect "+className+((nocolor||!onClick)?"":(red?" color-red ":" color "))+(underline?' underline':" ")+((disabled||!active)?" opacity":"")} 
    style={bold?{fontWeight:"bold"}:{}}
    onClick={handleOnClick}>{children}</span> );
}
 
export default A;