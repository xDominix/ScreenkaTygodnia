import React from 'react';

const Loading = ({logo=false}) => {

    if(logo)
        return (<div>
            {/*<img className='centered default-animation' alt="mini logo" src={getPath("screenka_logo.png")} style={{width:"200px",filter:"brightness(150%)"}}></img>*/}
            <div className='centered'>SCREENKA <br/> TYGODNIA</div>
        </div>)


    return ( <div>
        <div className="centered">Loading...</div>
        </div> );
}
 
export default Loading;