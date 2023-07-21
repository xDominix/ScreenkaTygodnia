import React, { useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import PageNotFound from './Pages/PageNotFound';
import Prestart from './Pages/login/Prestart';
import Start from './Pages/_/Start';
import "./App.css"
import Screenka from './Pages/Screenka';
import PostPage from './Pages/PostPage';
import Uploads from './Pages/Uploads';
import { AuthContextWithDemo } from './Contexts/AuthContextWithDemo';
import MiniPostsPage from './Pages/MiniPostsPage';
import  DayEventPage from './Pages/DayEventPage';
import MiniPostsPagePlus from './Pages/MiniPostsPagePlus';

/*
TOKEN EXPLAIN
zebys se nie wpisywal nazwy uzytkownika i tygodnia zeby go konkretnego zobacyzc - teraz musi ci to stronka wygenerowac (/posts/ktos/cos)
czyli podczas eventu taki guard
*/
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
                                <Route path={getPath("/dayevent/:event")} element={<DayEventPage/>}/>
                                <Route path={getPath("/uploads/:type")} element={<Uploads/>}/> {/*navigate with token (wyjatek: manage)*/}
                                <Route path={getPath("/screenka/:host_id")} element={<Screenka />} /> {/*tylko gdy nalezysz do hostu, jest poniedzialek po 8, istnieje plik*/}
                                
                                <Route path={getPath("/post/:user_fullname/:id")} element={<PostPage />}/> {/* dla kazdego, o ile zna id, z mysla o sharowaniu */}
                                <Route path={getPath("/post/:user_fullname/:id/:event")} element={<PostPage />}/> {/*navigate with token*/}

                                <Route path={getPath("/posts/:user_fullname/:host_id/:event")} element={<MiniPostsPage/>}/> {/* tylko dla hosta */}
                                <Route path={getPath("/posts/:user_fullname/:host_id/:week_name/:event")} element={<MiniPostsPagePlus/>}/> {/*navigate with token*/}

                                <Route path="*" element={<PageNotFound />} />
                            </Routes>
                        </AuthContextWithDemo>
                    </HashRouter>
                </div>
            </div>
            )
        }
 
export default App;