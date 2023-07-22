import React from 'react';
import "./ScrollDiv.css"

const ScrollDiv = ({children}) => { //w srodku wsadza sie diva, h1, cos co jest jakims elementem (a nie string)
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