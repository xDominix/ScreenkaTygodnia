import React, { useCallback, useContext, useRef } from 'react';
import "./Post.css"
import App from '../App/App';
import { useState } from 'react';
import { useEffect } from 'react';
import { AppClass } from '../App/AppClass';
import { PostContext } from '../../Contexts/PostContext';
import { dateToWeekDay } from '../Day/Day';
import { dateToHourString, delay } from '../../aFunctions';
import Checkbox from '../../Components/Checkbox';
import User from '../User/User';
import { AuthContext } from '../../Contexts/AuthContext';
import { UserContext } from '../../Contexts/UserContext';
import InputField from '../../Components/InputField';
import A from '../../Components/A';

const Post = ({post=null,id,user_fullname,hideNickname=false,hideIfApps=null,comment_user=null,onView}) => {

    const {hideIfAppsState} = useContext(AuthContext);

    const {getUserPost,setUserPostComment} = useContext(PostContext)
    const {getUser} = useContext(UserContext);

    const [postState,setPostState] = useState(post);
    const [user,setUser]= useState(null);
    const [commentUser,setCommentUser] = useState(comment_user)

    const [isSuperHide,setIsSuperHide] = useState(false);
    const [isHide,setIsHide] = useState(true);

    const loadAll = useCallback(()=>{
        const getPost =  async () =>{
            if(post!=null) return post;

            let post2 = await getUserPost(user_fullname,id);
            if(post2==null) return null;
            return post2;
        }

        getPost().then(post=>{
            if(post==null) return;

            setPostState(post);

            if(comment_user) setUserPostComment(user_fullname,id,comment_user.fullname).then(res=>{onView(res);});

            const timeout = setTimeout(()=>{
                if( hideIfApps?.includes(post.app)) setIsSuperHide(true);
            },500)
            return ()=>clearTimeout(timeout)
        });

        getUser(user_fullname).then((user)=>{ if(user != null) setUser(user)});

    },[comment_user,getUser,getUserPost,hideIfApps,id,onView,post,setUserPostComment,user_fullname])


    useEffect(()=>{
        loadAll()  
    },[loadAll])

    useEffect(()=>{
        if(postState==null) return;

        const timeout = setTimeout(()=>{
            if(hideIfApps==null && hideIfAppsState?.includes(postState.app)) setIsSuperHide(true);
        },500)
        return ()=> clearTimeout(timeout)
    },[hideIfAppsState,postState])

    useEffect(()=>{
        if(postState?.comment_user_fullname !=null) 
        {
            getUser(postState.comment_user_fullname).then(user=>{
                setCommentUser(user)
                commentRef.current.value = postState.comment?postState.comment:"";
            })
        }
    },[postState])

    useEffect(()=>{
        if(commentUser!=null)
        {
            const timeout = setTimeout(()=>{
                setIsHidden(false);
            },3500)
            return ()=>clearTimeout(timeout)
        }
    },[commentUser])
    
    const getNotificationText = ()=>{
        if(postState?.top_number) return "#"+postState.top_number
        if(postState?.is_highlighted) return "*"
        return null
    }

    const getDate = ()=>{
        if(!postState) return "------- --:--";
        let date = postState.upload_date;
        return `${dateToWeekDay(date).toUpperCase()} ${dateToHourString(date)}`
    }
    
    //comment
    const commentRef = useRef();
    const [isRed,setIsRed] = useState(false);
    const [isLoading,setIsLoading] = useState(false);
    const [isHidden,setIsHidden] = useState(true);
    const handleOnComment = ()=>{
        setIsLoading(true);
        Promise.all([setUserPostComment(user_fullname,id,comment_user.fullname,commentRef.current.value),delay(1000)])
        .then(([res,_])=>{
            if(res) setIsHidden(true);
            setIsRed(!res);
            setIsLoading(false);
        })
    }

    return ( 
    <div className='pre-pre-post'>
        {!hideNickname &&<div className="nickname">
            <User user={user}/>
            <h4 className='color-gray'>{user?user.username:"______"}</h4>
        </div>}
    <div className='pre-post bcolor-gray'>

            <div className='bcolor-dark-gray post'>
                <h3 className='date'>{getDate()}</h3>
                <div className='head'>
                    <App application={AppClass.get(postState?.app)} notificationText={getNotificationText()}/>
                    {isSuperHide && <A onClick={()=>{if(isSuperHide)setIsSuperHide(false)}}>show</A>}
                </div>
                <div className='pre-body' style={isSuperHide?{height:"0px"}:{}}>
                <div className='body' style={isHide?{opacity:"0"}:{}}>
                    <h3 className='content'>CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT </h3>
                    <div className='context'>{postState?.context}</div>
                </div>
                    {isHide && <A className='centered'  onClick={()=>{if(isHide)setIsHide(false)}}>show</A>}
                </div>
                
            </div>

        {commentUser && <div className="nickname2"  style={isHidden?{height:"0px",padding:"0",opacity:0}:((commentUser.fullname === postState?.comment_user_fullname)?{opacity:"0.7"}:{})}>
            <User height={20} user={commentUser}/>
            <h5 className='color-gray'>{commentUser.username}</h5>
            <InputField h5 readOnly={commentUser.fullname === postState?.comment_user_fullname}  reff={commentRef} value={commentRef.current?.value} placeholder="comment..." onEnter={handleOnComment} isRed={isRed} isLoading={isLoading}/>
        </div>}
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