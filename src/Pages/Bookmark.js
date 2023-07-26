import React, { useContext, useEffect } from 'react';
import { getPath } from '../aFunctions';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthContext';
import A from '../Components/A';

const Bookmark = () => {
    const navigate = useNavigate();
    const {user}=useContext(AuthContext);

    useEffect(()=>{
        if(user) navigate('/');
    },[])

    return ( 
    <div className='flex-center' style={{alignItems:"center",textAlign:'center'}}>
        <img alt="add to home screen" src={getPath("add_to_home_screen.png")} style={{objectFit:'cover',height:'100px',width:'100px',opacity:'0.6',marginBottom:'30px'}}/>
        <div>
            <h4>1. Add to Home Screen</h4>
            <h4>2. <A onClick={()=>navigate("/login")}>Login</A></h4>
        </div>
    </div>
    );
}
 
export default Bookmark;