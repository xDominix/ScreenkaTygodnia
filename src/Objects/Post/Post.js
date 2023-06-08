import React, { useContext, useRef } from 'react';
import "./Post.css"
import App from '../App/App';
import { useState } from 'react';
import { useEffect } from 'react';
import { AppClass } from '../App/AppClass';
import { dateToHourStringPretty, dateToWeekDay, delay, getPath } from '../../aFunctions';
import Checkbox from '../../Components/Checkbox';
import User from '../User/User';
import { AuthContext } from '../../Contexts/AuthContext';
import A from '../../Components/A';
import NothingToShow from '../../Pages/NothingToShow';
import { Format } from '../App/AppClass';

const Post = ({
    post=null,
    id,user_fullname,   
    onLoad=()=>{},
    hideNickname=false,
    setView}) =>  {

    const {getUserPostAndTrySetMyView,hideIfAppsState,getUserPost,getUser,getPathPostContentUrl} = useContext(AuthContext);

    const [postState,setPostState] = useState(post);
    const [user,setUser]= useState(null);
    const [isSuperHide,setIsSuperHide] = useState(false);
    const [isHide,setIsHide] = useState(true);
    const [content,setContent] = useState(null);

    useEffect(()=>{
        if(!hideNickname) getUser(user_fullname).then(setUser);

        if(post) return;

        const getPostPromise = setView ? getUserPostAndTrySetMyView(user_fullname,id) : getUserPost(user_fullname,id);
        getPostPromise.then(post=>{
            onLoad(post);
            setPostState(post);
        })
    },[])// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(()=>{
        const getContent = async (post)=>{
            if(!post) return null;

            let app = AppClass.get(post.app), content = post.content;
            switch(app?.format){
                case Format.LongString: return <h4>{content}</h4>
                case Format.String: return <h3 className='centered' >{content}</h3>
                case Format.Url: return <a className='centered'  href={content} target="_blank" rel="noreferrer">OPEN LINK</a>
                case Format.Path: 
                    let src = await getPathPostContentUrl(user_fullname,content);
                    return <img alt="post content" className='centered' src={src}></img>;
                default: return content;
            }
        }

        if(!isHide && !isSuperHide && !content) getContent(postState).then(setContent);

    },[isHide,isSuperHide]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(()=>{
        if(postState==null) return;
        if(isSuperHide) return;

        const timeout = setTimeout(()=>{
            if(hideIfAppsState?.includes(postState.app)) {setIsSuperHide(true);}
        },500)
        return ()=> clearTimeout(timeout)
    },[postState?.app]) //eslint-disable-line react-hooks/exhaustive-deps

    /*
    useEffect(()=>{
        if(isSuperHide && isHide) setIsHide(false);
    },[isSuperHide]) //eslint-disable-line react-hooks/exhaustive-deps
    */

    const getNotificationText = ()=>{
        if(postState?.top_number) return "#"+postState.top_number
        if(postState?.is_highlighted) return "*"
        return null
    }

    const getDate = ()=>{
        if(!postState) return "------- --:--";
        let date = postState.upload_date;
        return `${dateToWeekDay(date).toUpperCase()} ${dateToHourStringPretty(date)}`
    }

    return ( 
    <div className='pre-pre-post'>
        {!hideNickname &&<div className="nickname">
            <User user_fullname={user_fullname}/>
            <h4 className='color-gray'>{user?user.username:"_______"}</h4>
        </div>}
    <div className='pre-post'>

            <div className='bcolor-dark-gray post'>
                <h3 className='date'>{getDate()}</h3>
                <div className='head'>
                    <App application={AppClass.get(postState?.app)} notificationText={getNotificationText()}/>
                    {isSuperHide && <A bold onClick={()=>{if(isSuperHide)setIsSuperHide(false)}}>tap</A>}
                </div>
                <div className='pre-body' style={isSuperHide?{height:"0px"}:{}}>
                    <div className='body' style={isHide?{opacity:"0"}:{}}>
                        <div className='content'>{content?content:<NothingToShow/>}</div>
                        <h4 className='context'>{postState?.context}</h4>
                    </div>
                    {isHide && <A bold className='centered'  onClick={()=>{if(isHide)setIsHide(false)}}>tap</A>}
                </div>
            </div>

    </div>
    </div> );
}
 
export default Post;

export const MiniPost = ({
        post,hourDate=false,no_crossed_eye=false,
        checkboxDisabled,uncheckedCheckboxDisabled,defaultChecked=null,onCheckboxChange=()=>{},onCheckboxChangeDelay=()=>{},
        edit=false,onEdit=()=>{},delete_=false,onDelete=()=>{},preview=false,onPreview=()=>{}})=>
    {

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
            <App application={AppClass.get(post.app)} height={50}/>
            <div className='text'>
                <div><b>{post.app}</b></div>
                <div className='noscroll'>{post.context}</div>
            </div>
            <div className='infos abs'>
                {preview && <div><A onClick={()=>onPreview(post.id)}>Link</A></div>}
                {delete_ && <div><A red onClick={()=>onDelete(post.id)}>Delete</A></div>}
                {!post.view &&<img alt='view' style={{height:"16px",filter:"invert(0.6)"}} src={getPath(no_crossed_eye?"view16.png":"no_view16.png")}/>}
                <div>{hourDate===true? dateToHourStringPretty(post.upload_date): (dateToWeekDay(post.upload_date)?.slice(0,3).toUpperCase())}</div>
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