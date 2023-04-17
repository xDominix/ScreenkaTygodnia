import React from 'react';
import { useParams } from 'react-router-dom';
import Post from './Post';

const PostPage = () => {

    const {user_fullname,id} = useParams();

    return ( <div>
        <Post id={id} user_fullname={user_fullname} unhide/>
    </div> );
}
 
export default PostPage;