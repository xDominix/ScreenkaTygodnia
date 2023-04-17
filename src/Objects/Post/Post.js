import React, { useContext } from 'react';
import "./Post.css"
import App from '../App/App';
import { useState } from 'react';
import { useEffect } from 'react';
import { AppClass } from '../App/AppClass';
import { PostContext } from '../../Contexts/PostContext';
import { dateToWeekDay } from '../Day';
import { dateToHourString } from '../../aFunctions';
import Checkbox from '../../Components/Checkbox';

const Post = ({id,user_fullname,nicknameVisible=true,hideIfApps=null,unhide=false}) => {

    const {getUserPost,hideIfAppsState} = useContext(PostContext)

    const [post,setPost] = useState(null);

    const [isSuperHide,setIsSuperHide] = useState(false);
    const [isHide,setIsHide] = useState(!unhide);

    useEffect(()=>{
        const start =  async () =>{
            let post = await getUserPost(user_fullname,id);
            if(post==null) return null;
            setPost(post);
            return post;
        }
      
        start().then(post=>{
            if(post==null) return;

            const timeout = setTimeout(()=>{
                if( hideIfApps?.includes(post.app)) setIsSuperHide(true);
            },500)
            return ()=>clearTimeout(timeout)
        });
        
    },[])

    useEffect(()=>{
        if(post==null) return;

        const timeout = setTimeout(()=>{
            if(hideIfApps==null && hideIfAppsState?.includes(post.app)) setIsSuperHide(true);
        },500)
        return ()=> clearTimeout(timeout)
    },[hideIfAppsState,post])

    const getNotificationText = ()=>{
        if(post?.top_number) return "#"+post.top_number
        if(post?.is_highlighted) return "*"
        return null
    }

    const getDate = ()=>{
        if(!post) return "------- --:--";
        let date = post.upload_date;
        return `${dateToWeekDay(date).toUpperCase()} ${dateToHourString(date)}`
    }
    
    return ( 
    <div className='pre-post'>
        {nicknameVisible &&<div className='nickname'>
            <div className='bcolor-gray circle'></div>
            <h4 className='color-gray'>xDominix</h4>
        </div>}
        <div className='bcolor-gray post'>
            <h3 className='date'>{getDate()}</h3>
            <div className='head'>
                <App application={AppClass.get(post?.app)} notificationText={getNotificationText()}/>
                {isSuperHide && <a onClick={()=>{if(isSuperHide)setIsSuperHide(false)}}>show</a>}
            </div>
            <div className='pre-body' style={isSuperHide?{height:"0px"}:{}}>
            <div className='body' style={isHide?{opacity:"0"}:{}}>
                <h3 className='content'>CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT </h3>
                <div className='context'>{post?.context}</div>
                {post?.comment && <div className='comment'>
                    <div className='bcolor-gray circle'></div>
                    <h4>{post.comment_user_id}</h4>
                    <div>{post.comment}</div>
                </div>}
                {post?.co_comment && <div className='co-comment'>
                    <div className='bcolor-gray circle'></div>
                    <h4>{post.co_comment_user_id}</h4>
                    <div>{post.co_comment}</div>
                </div>}
            </div>
                {isHide && <a className='centered'  onClick={()=>{if(isHide)setIsHide(false)}}>show</a>}
            </div>
            
        </div>
    </div> );
}
 
export default Post;

export const MiniPost = ({post,hourDate})=>{
    return <div className="mini-post-pre">
        <Checkbox checked={post.screenkaOn}/>
        <div className='mini-post'>
            <App application={AppClass.get(post.app)} notificationText={post.screenkaOn?"":null} height={50}/>
            <div className='text'>
                <div><b>{post.app}</b></div>
                <div className='noscroll'>{post.context}</div>
            </div>
            <div>{hourDate==null? dateToHourString(post.upload_date): (dateToWeekDay(post.upload_date)?.slice(0,3).toUpperCase())}</div>
        </div>
    </div>
}