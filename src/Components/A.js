import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./A.css"

const A = ({className,underline,color=true,href,onClick,children,disable}) => {
    const navigate = useNavigate();

    const handleOnClick = ()=>{
        if(disable) return;
        if(href) navigate(href);
        else if(onClick) onClick();
    }
    
    return ( <div className={"A "+className+(color?" color ":"")+(underline?' underline':" ")+(disable?" opacity":"")} onClick={handleOnClick}>{children}</div> );
}
 
export default A;