import React, { useContext, useRef } from 'react';
import "./Post.css"
import App from '../App/App';
import { useState } from 'react';
import { useEffect } from 'react';
import { AppClass } from '../App/AppClass';
import { dateToWeekDay } from '../Day/Day';
import { dateToHourStringPretty, delay, getPath } from '../../aFunctions';
import Checkbox from '../../Components/Checkbox';
import User from '../User/User';
import { AuthContext } from '../../Contexts/AuthContext';
import InputField from '../../Components/InputField';
import A from '../../Components/A';
import NothingToShow from '../../Pages/NothingToShow';
import { Format } from '../App/AppClass';

const Post = ({
    post=null,
    id,user_fullname,   
    onLoad=()=>{},
    hideNickname=false,
    hideComment=false,tryComment=false,}) =>  {

    tryComment = !hideComment && tryComment;

    const {getMe,hideIfAppsState,trySetMyUserPostComment,PostService,UserService} = useContext(AuthContext);

    const [postState,setPostState] = useState(post);
    const [user,setUser]= useState(null);
    const [commentUser,setCommentUser] = useState();
    const [isSuperHide,setIsSuperHide] = useState(false);
    const [isHide,setIsHide] = useState(true);
    const [content,setContent] = useState(null);

    useEffect(()=>{
        if(!hideNickname) UserService.getUser(user_fullname).then(setUser);

        if(post) return;

        const getPostPromise = tryComment ? PostService.getUserPostAndTrySetView(user_fullname,id,getMe().fullname) : PostService.getUserPost(user_fullname,id);
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
                    let src = await PostService.getPathPostContentUrl(user_fullname,content);
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

    useEffect(()=>{
        if(postState?.comment_user_fullname !=null && !hideComment) 
        {
            if(postState.comment_user_fullname===getMe().fullname) setCommentUser(getMe());
            else UserService.getUser(postState.comment_user_fullname).then(setCommentUser);
        }
    },[postState?.comment_user_fullname]) //eslint-disable-line react-hooks/exhaustive-deps

    useEffect(()=>{
        if(commentUser!=null) setIsCommentHidden(false);
    },[commentUser])
    
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
    
    //comment
    const commentRef = useRef();
    const [isRed,setIsRed] = useState(false);
    const [isLoading,setIsLoading] = useState(false);
    const [isCommentHidden,setIsCommentHidden] = useState(true);
    const handleOnComment = ()=>{
        setIsLoading(true);
        Promise.all([trySetMyUserPostComment(user_fullname,id,commentRef.current.value),delay(1000)])
        .then(([res,_])=>{
            if(res) setIsCommentHidden(true);
            setIsRed(!res);
            setIsLoading(false);
        })
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
           
        {commentUser && <div className="nickname2"  style={isCommentHidden?{height:"0px",padding:"0",opacity:0}:{opacity:"0.7"}}>
            <User height={20} user={commentUser}/>
            <h5 className='color-gray'>{commentUser.username}</h5>
            <InputField h5 readOnly={!tryComment} reff={commentRef} value={tryComment?null:(postState.comment?postState.comment:"no comment")} placeholder="comment..." onEnter={handleOnComment} isRed={isRed} isLoading={isLoading}/>
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
            <div className='infos abs'>
                {!post.comment_user_fullname &&<img alt='noview' style={{height:"16px",filter:"invert(0.6)"}} src={getPath("noview32.png")}/>}
                <div>{hourDate===true? dateToHourStringPretty(post.upload_date): (dateToWeekDay(post.upload_date)?.slice(0,3).toUpperCase())}</div>
            </div>
        </div>
    </div>
}