import React, { useContext, useRef } from 'react';
import "./_Post.css"
import App from '../App/App';
import { useState } from 'react';
import { useEffect } from 'react';
import { dateToHourString, dateToWeekDay, getPath } from '../../aFunctions';
import Checkbox from '../../Components/Checkbox';
import { AuthContext } from '../../Contexts/AuthContext';
import A from '../../Components/A';

export const MiniPost = ({
    post,crossed_eye=false, no_eye=false,
    hourDate=false,pretty_date=false,
    checkboxDisabled,uncheckedCheckboxDisabled,defaultChecked=null,onCheckboxChange=()=>{},onCheckboxChangeDelay=()=>{},
    edit=false,onEdit=()=>{},delete_=false,onDelete=()=>{},preview=false,onPreview=()=>{},
})=>
{

const {getApp} = useContext(AuthContext);
const getInitChecked = ()=>defaultChecked!==null ? defaultChecked : post.permissions.screenka
const [event,setEvent]= useState();
const isChecked = event? event.target.checked: getInitChecked()
const isCheckedDelay = useRef(getInitChecked());

const handleOnCheckboxChange=(e)=>{
    e.target.id = post.id;
    onCheckboxChange(e);
    setEvent(e);
}

const timeout = useRef(null);
useEffect(()=>{
    if(timeout.current!==null) clearTimeout(timeout.current);

    if(isCheckedDelay.current !== isChecked)
    {
        timeout.current = setTimeout(()=>{
            //useUnload(e => { e.preventDefault();   e.returnValue = ''; });

            isCheckedDelay.current = isChecked;
            onCheckboxChangeDelay(event);

        },3000);
    }
},[isChecked])

return <div className="mini-post-pre">
    <Checkbox name={post.id} disabled={checkboxDisabled || (!isChecked && uncheckedCheckboxDisabled )} checked={isChecked} onChange={handleOnCheckboxChange}/>
    <div className='mini-post'>
        <App application={getApp(post.app)} height={50}/>
        <div className='text'>
            <div><b>{post.app}</b></div>
            <div className='noscroll'>{post.context}</div>
        </div>
        <div className='infos abs'>
            {preview && <div><A onClick={()=>onPreview(post.id)}>Link</A></div>}
            {delete_ && <div><A red onClick={()=>onDelete(post.id)}>Delete</A></div>}
            {!no_eye && (post.view!=null) === !crossed_eye &&<img alt='view' style={{height:"16px",filter:"invert(0.6)"}} src={getPath(!crossed_eye?"view16.png":"no_view16.png")}/>}
            <div>{hourDate===true? dateToHourString(post.upload_date,pretty_date): (dateToWeekDay(post.upload_date)?.slice(0,3).toUpperCase())}</div>
        </div>
    </div>
</div>
}

/*
export const MiniWeekDay = ({day_name,posts_count=0,checked})=>{
return <div className="mini-post-pre">
    <Checkbox checked={checked}/>
    <div className='mini-post'>
        <App application={AppClass.Default} height={50}/>
        <div className='text'>
            <div><b>{day_name}</b></div>
            <div className='noscroll'>{posts_count} POSTS</div>
        </div>
    </div>
</div>
}*/