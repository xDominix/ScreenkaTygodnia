import React, { useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import PageNotFound from './Pages/PageNotFound';
import Prestart from './Pages/login/Prestart';
import Start from './Pages/_/Start';
import "./App.css"
import Screenka from './Pages/screenka/Screenka';
import PostPage from './Objects/Post/PostPage';
import Uploads from './Pages/uploads/Uploads';
import DayPage from './Objects/Day/DayPage';
import { ADMIN } from './aFunctions';
import { AuthContextWithDemo } from './Contexts/AuthContextWithDemo';
import MiniPostsPage from './Objects/Post/MiniPostsPage';

const App = () => {

    const [isDemo,setIsDemo] = useState(false);
    const getPath = (string)=>!isDemo?string:`/demo${string}`;

    return (
            <div className='app-flex-center-v'>
                <div className='app-max-mobile'>
                    <HashRouter basename='/'>
                        <AuthContextWithDemo onDemo={()=>setIsDemo(true)}>
                            <Routes>
                                <Route exact path={getPath("/")} element={<Start />}/>

                                <Route path={getPath("/login")} element={<Prestart />} />
                                
                                <Route path={getPath("/day/:name")} element={<DayPage/>}/>
                                <Route path={getPath("/uploads/:type")} element={< Uploads/>}/> {/*MyPosts = Uploads */}
                                <Route path={getPath("/screenka/:host_id")} element={<Screenka />} /> {/*tylko gdy nalezysz do hostu, jest poniedzialek po 8, istnieje plik*/}
                                

                                {ADMIN && <Route path={getPath("/post/:user_fullname/:id")} element={<PostPage />}/>} {/*demo - /post/Tola Bajka/123123 */} 
                                <Route path={getPath("/post/:user_fullname/:id/preview")} element={<PostPage preview />}/> {/* podglad posta (bez komentrza) tylko dla ciebie */}
                                <Route path={getPath("/post/:user_fullname/:id/oneshot")} element={<PostPage oneshot />}/>
                                <Route path={getPath("/post/:user_fullname/:id/rnshot")} element={<PostPage rnshot />}/> 

                                {ADMIN && <Route path={getPath("/posts/:user_fullname/:host_id")} element={<MiniPostsPage/>}/>}
                                {ADMIN && <Route path={getPath("/posts/:user_fullname/:host_id/:week_name")} element={<MiniPostsPage/>}/>}
                                <Route path={getPath("/posts/:user_fullname/:host_id/:week_name/throwback")} element={<MiniPostsPage throwback />}/> 
                                <Route path={getPath("/posts/:user_fullname/:host_id/:week_name/ohpreview")} element={<MiniPostsPage ohpreview />}/> 

                                
                                {/*SOON*/}{/*ADMIN && <Route path={getPath("/uploads/:type/:user_fullname")} element={< Uploads/>}/>*/} 
                                {/*NO*/}{/*ADMIN && <Route path={getPath("/posts/:host_id/:week_name")} element={<PostsPage/>}/> //za duzo do liczenia*/}

                                <Route path="*" element={<PageNotFound />} />
                            </Routes>
                        </AuthContextWithDemo>
                    </HashRouter>
                </div>
            </div>
            )
        }
 
export default App;