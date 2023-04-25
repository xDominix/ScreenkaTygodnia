import React from 'react';
import { useNavigate } from 'react-router-dom';

const A = ({className,underline,href,onClick,children}) => {
    const navigate = useNavigate();
    return ( <div className={"A "+className+(underline?' underline':" ")} onClick={href?(()=>navigate(href)):(onClick?onClick:()=>{})}>{children}</div> );
}
 
export default A;