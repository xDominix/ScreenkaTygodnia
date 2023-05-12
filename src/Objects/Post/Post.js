import React, { useContext, useRef } from 'react';
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
import NothingToShow from '../../Pages/NothingToShow';
import { Format } from '../App/AppClass';

const Post = ({post=null,id,user_fullname,hideNickname=false,hideIfApps=null,commentOn=false,onView}) => {

    const {getMe,hideIfAppsState} = useContext(AuthContext);

    const {getUserPost,setUserPostComment,getPathPostContentUrl} = useContext(PostContext)
    const {getUser} = useContext(UserContext);

    const [postState,setPostState] = useState(post);
    const [user,setUser]= useState(null);
    const [commentUser,setCommentUser] = useState(commentOn?getMe():null)

    const [isSuperHide,setIsSuperHide] = useState(false);
    const [isHide,setIsHide] = useState(true);

    const [content,setContent] = useState(null);

    useEffect(()=>{
        //content
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

        const getPost =  async () =>{
            if(post!=null) return post;

            let post2 = await getUserPost(user_fullname,id);
            if(post2==null) return null;
            return post2;
        }

        getPost().then(post=>{
            if(post==null) return;

            setPostState(post);

            if(commentOn) setUserPostComment(user_fullname,id,getMe().fullname).then(res=>{onView(res);});

            const timeout = setTimeout(()=>{
                if( hideIfApps?.includes(post.app)) setIsSuperHide(true);
            },500)

            getContent(post).then(setContent);

            return ()=>clearTimeout(timeout)
        });

        getUser(user_fullname).then((user)=>{ if(user != null) setUser(user)});
    },[])// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(()=>{
        if(postState==null) return;

        const timeout = setTimeout(()=>{
            if(hideIfApps==null && hideIfAppsState?.includes(postState.app)) setIsSuperHide(true);
        },500)
        return ()=> clearTimeout(timeout)
    },[postState]) //eslint-disable-line react-hooks/exhaustive-deps

    useEffect(()=>{
        if( postState && postState.comment_user_fullname !=null) 
        {
            getUser(postState.comment_user_fullname).then(user=>{
                setCommentUser(user);
            })
        }
    },[postState]) //eslint-disable-line react-hooks/exhaustive-deps

    useEffect(()=>{
        if(commentUser!=null)
        {
            setIsCommentShown(false);
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
    const [isCommentShown,setIsCommentShown] = useState(true);
    const handleOnComment = ()=>{
        setIsLoading(true);
        Promise.all([setUserPostComment(user_fullname,id,getMe().fullname,commentRef.current.value),delay(1000)])
        .then(([res,_])=>{
            if(res) setIsCommentShown(true);
            setIsRed(!res);
            setIsLoading(false);
        })
    }

    return ( 
    <div className='pre-pre-post'>
        {!hideNickname &&<div className="nickname">
            <User user_fullname={user_fullname}/>
            <h4 className='color-gray'>{user?user.username:"______"}</h4>
        </div>}
    <div className='pre-post'>

            <div className='bcolor-dark-gray post'>
                <h3 className='date'>{getDate()}</h3>
                <div className='head'>
                    <App application={AppClass.get(postState?.app)} notificationText={getNotificationText()}/>
                    {isSuperHide && <A onClick={()=>{if(isSuperHide)setIsSuperHide(false)}}>show</A>}
                </div>
                <div className='pre-body' style={isSuperHide?{height:"0px"}:{}}>
                <div className='body' style={isHide?{opacity:"0"}:{}}>
                    <div className='content'>{content?content:<NothingToShow/>}</div>
                    <h4 className='context'>{postState?.context}</h4>
                </div>
                    {isHide && <A className='centered'  onClick={()=>{if(isHide)setIsHide(false)}}>show</A>}
                </div>
                
            </div>

        {commentUser && <div className="nickname2"  style={isCommentShown?{height:"0px",padding:"0",opacity:0}:((commentUser.fullname === postState?.comment_user_fullname)?{opacity:"0.7"}:{})}>
            <User height={20} user={commentUser}/>
            <h5 className='color-gray'>{commentUser.username}</h5>
            <InputField h5 readOnly={commentUser.fullname === postState?.comment_user_fullname}  reff={commentRef} value={postState.comment_user_fullname? (postState.comment?postState.comment:"no comment"):null} placeholder="comment..." onEnter={handleOnComment} isRed={isRed} isLoading={isLoading}/>
        </div>}
    </div>
    </div> );
}
 
export default Post;

export const MiniPost = ({post,hourDate=false})=>{
    return <div className="mini-post-pre">
        <Checkbox checked={post.screenkaOn}/>
        <div className='mini-post'>
            <App application={AppClass.get(post.app)} notificationText={post.screenkaOn?"":null} height={50}/>
            <div className='text'>
                <div><b>{post.app}</b></div>
                <div className='noscroll'>{post.context}</div>
            </div>
            <div>{hourDate===true? dateToHourString(post.upload_date): (dateToWeekDay(post.upload_date)?.slice(0,3).toUpperCase())}</div>
        </div>
    </div>
}