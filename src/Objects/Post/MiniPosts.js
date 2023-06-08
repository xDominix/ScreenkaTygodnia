import React, { useEffect } from 'react';
import { MiniPost } from './Post';
import "./Post.css"
import { useState } from 'react';
import Loading from '../../Pages/Loading';
import NothingToShow from '../../Pages/NothingToShow';

export const MiniPosts = ({posts, title, //essentials
                                checkboxesDisabled=false,maxChecks=null, customCheckboxes=false, onPostCheckboxChange=()=>{},onPostCheckboxChangeDelay=()=>{},
                                hourDate, //first row
                                preview=false,onPostPreview,edit=false,onPostEdit,delete_=false,onPostDelete, // options
                                hideFooter=false, hideTickets = false,
                                no_crossed_eye=false,no_crossed_eye_funny_info=false,
                                }) => 
{
    const getCheckesCount = ()=>{
        if(!posts || customCheckboxes) return 0;
        return posts.filter(post=>post.permissions.screenka=== true).length; 
    }

    const [checks,setCheckes] = useState(0);

    useEffect(()=>{
        setCheckes(getCheckesCount());
    },[posts?.length])

    const handleOnCheckboxChange = (e)=>{
        if(e.target.checked)setCheckes(checks + 1)
        else setCheckes(checks - 1)

        onPostCheckboxChange(e);
    }

    if(posts===null) return <div></div>
    if(posts.length===0) return <NothingToShow/>

    return (
        <div className='miniposts'>
             
                {<div className={'miniposts-legend'}>
                    {title && <h4 style={{position:"absolute",marginTop:"0px",top:0,left:"50%",transform:"translate(-50%,0)"}}>{title}</h4>}

                    {!customCheckboxes &&  !hideTickets &&  <div className={"bar "+(checkboxesDisabled?"opacity":"")}>
                        <span style={{fontSize:"30px"}} role="img" aria-label="ticket">🎟️</span>
                        <h5>{!maxChecks?`${checks} used`:`${checks}/${maxChecks} used`}</h5>
                    </div>}

                    {customCheckboxes &&  !hideTickets && <div className={"bar "+(checkboxesDisabled?"opacity":"")}>
                        <h4>Choose {maxChecks?maxChecks:0} posts:</h4>
                        <h5>{checks} checked</h5>
                  </div>}
                </div>}
            
                {posts===null && <Loading/>}
                {posts?.length===0 && <NothingToShow/>}

                {posts?.length>0 &&  
                <div className='miniposts-list noscroll'>
                    {posts?.map((post,i) =>( <MiniPost key={post.id} post={post} hourDate={hourDate} no_crossed_eye={no_crossed_eye} uncheckedCheckboxDisabled={checks>=maxChecks-1} checkboxDisabled={checkboxesDisabled} defaultChecked={customCheckboxes?false:null}  onCheckboxChange={handleOnCheckboxChange} onCheckboxChangeDelay={onPostCheckboxChangeDelay} edit={edit} delete_={delete_} preview={preview} onEdit={()=>onPostEdit(post.id)} onDelete={()=>onPostDelete(post.id)} onPreview={()=>onPostPreview(post.id)}/> ))} 
                    {(!customCheckboxes && !hideFooter && !hideTickets) && <footer className={'center' + (checkboxesDisabled ? " opacity":"")} >Uploads with tickets will apply for<br/>Screenka Tygodnia ™</footer>}
                    {!hideFooter && no_crossed_eye && no_crossed_eye_funny_info && <footer className={'center'} >Kto zobaczył, ten zobaczył.<br/>Teraz pójdzie w zapomnienie. <span role="img" aria-label="ghost">👻</span></footer>}
                </div>}

                </div>)
}
 
export default MiniPosts;