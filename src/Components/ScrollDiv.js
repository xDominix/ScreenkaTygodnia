import React from 'react';

const ScrollDiv = ({children, right}) => {
    return ( 
        <div className='noscroll' style={{...{maxWidth:'100%',display:"flex",whiteSpace:'nowrap',overflow:"auto"},...(right?{direction:'rtl'}:{})}}>
            {children}
        </div>
     );
}
 
export default ScrollDiv;