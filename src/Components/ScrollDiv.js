import React from 'react';
import "./ScrollDiv.css"

const ScrollDiv = ({children, right}) => {
    return ( 
        <div className='noscroll scrolldiv' style={right?{direction:'rtl'}:{}}>
            {children}
        </div>
     );
}
 
export default ScrollDiv;