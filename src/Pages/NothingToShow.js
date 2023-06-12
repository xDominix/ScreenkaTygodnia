import React from 'react';
import A from '../Components/A';
import { useNavigate } from 'react-router-dom';

const NothingToShow = ({goback=false}) => {
    const navigate = useNavigate();
    return ( <div>
        <div className='centered opacity' style={{textAlign:'center'}}>
            <div>Nothing to show.</div>
            {goback && <A onClick={()=>navigate(-1)}>go back</A>}
        </div>
        </div> );
}
 
export default NothingToShow;