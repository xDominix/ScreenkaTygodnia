import React from 'react';
import { getPath } from '../aFunctions';

const Loading = ({logo=false}) => {

    if(logo)
        return (<div>
            {<div className='centered'> <img className='fromdown' alt="logo" src={getPath("logo.png")} style={{width:"200px"}}/></div>}
            {/*<div className='centered'>SCREENKA <br/> TYGODNIA</div>*/}
        </div>)


    return ( <div>
        <div className="centered">Loading...</div>
        </div> );
}
 
export default Loading;