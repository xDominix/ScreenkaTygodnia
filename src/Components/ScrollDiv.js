import React from 'react';
import "./ScrollDiv.css"

//UWAGA!!! w srodku wsadza sie diva, h1, span cos co jest jakims elementem (a nie string)
const ScrollDiv = ({children}) => { 
    return ( 
        <div className='scrolldiv-pre'>
            <div className='noscroll scrolldiv'>
                {children}
            </div>
        </div>
        
     );
}
 
export default ScrollDiv;

// style={right?{direction:'rtl'}:{}}