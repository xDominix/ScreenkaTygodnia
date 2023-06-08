import React, { useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import PageNotFound from './Pages/PageNotFound';
import Prestart from './Pages/login/Prestart';
import Start from './Pages/_/Start';
import "./App.css"
import Screenka from './Pages/Screenka';
import PostPage from './Objects/Post/PostPage';
import Uploads from './Pages/Uploads';
import { AuthContextWithDemo } from './Contexts/AuthContextWithDemo';
import MiniPostsPage from './Objects/Post/MiniPostsPage';
import  DayEventPage from './Objects/Event/DayEventPage';
import MiniPostsPagePlus from './Objects/Post/MiniPostsPagePlus';

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
                                {/*<Route path={getPath("/app/:name")} element={<AppPage/>}/>*/}
                                <Route path={getPath("/event/:event")} element={<DayEventPage/>}/>
                                <Route path={getPath("/uploads/:type")} element={<Uploads/>}/>
                                <Route path={getPath("/screenka/:host_id")} element={<Screenka />} /> {/*tylko gdy nalezysz do hostu, jest poniedzialek po 8, istnieje plik*/}
                                
                                <Route path={getPath("/post/:user_fullname/:id")} element={<PostPage />}/> {/* dla kazdego, o ile zna id, z mysla o sharowaniu */}
                                <Route path={getPath("/post/:user_fullname/:id/:event")} element={<PostPage />}/>

                                <Route path={getPath("/posts/:user_fullname/:host_id/:event")} element={<MiniPostsPage/>}/> {/* tylko dla hosta */}
                                <Route path={getPath("/posts/:user_fullname/:host_id/:week_name/:event")} element={<MiniPostsPagePlus/>}/>

                                <Route path="*" element={<PageNotFound />} />
                            </Routes>
                        </AuthContextWithDemo>
                    </HashRouter>
                </div>
            </div>
            )
        }
 
export default App;