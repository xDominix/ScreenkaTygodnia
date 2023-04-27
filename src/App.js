import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PageNotFound from './Pages/PageNotFound';
import Prestart from './Pages/login/Prestart';
import Start from './Pages/_/Start';
import "./App.css"
import Screenka from './Pages/screenka/Screenka';
import PostPage from './Objects/Post/PostPage';
import Uploads from './Pages/uploads/Uploads';
import PostsPage from './Objects/Post/PostsPage';
import DayPage from './Objects/Day/DayPage';
import { ADMIN } from './aFunctions';
import { ProvidersSelector } from './Contexts/aProvidersSelector';

const App = () => {

    const getPath = (string)=>string
    const getPathDemo = (string)=>`/demo${string}`

    return (
            <div className='app-flex-center-v'>
                <div className='app-max-mobile'>
                    <BrowserRouter basename='/ScreenkaTygodnia'>
                        <ProvidersSelector>
                            <Routes>
                                <Route exact path={getPath("/")} element={<Start />}/>

                                <Route path={getPath("/login")} element={<Prestart />} />
                                
                                <Route path={getPath("/day/:name")} element={<DayPage/>}/>
                                <Route path={getPath("/uploads/:type")} element={< Uploads/>}/>
                                <Route path={getPath("/screenka/:team_id")} element={<Screenka />} /> {/*tylko gdy nalezysz do teamu, jest poniedzialek po 8, istnieje plik*/}
                                

                                {ADMIN && <Route path={getPath("/post/:user_fullname/:id")} element={<PostPage />}/>}
                                <Route path={getPath("/post/:user_fullname/:id/oneshot")} element={<PostPage oneshot />}/>
                                <Route path={getPath("/post/:user_fullname/:id/rnshot")} element={<PostPage rnshot />}/> 

                                {ADMIN && <Route path={getPath("/posts/:user_fullname/:team_id")} element={<PostsPage/>}/>}
                                {ADMIN && <Route path={getPath("/posts/:user_fullname/:team_id/:week_name")} element={<PostsPage/>}/>}
                                <Route path={getPath("/posts/:user_fullname/:team_id/:week_name/throwback")} element={<PostPage throwback />}/> 
                                <Route path={getPath("/posts/:user_fullname/:team_id/:week_name/ohpreview")} element={<PostPage ohpreview />}/> 

                                
                                {/*SOON*/}{/*ADMIN && <Route path={getPath("/uploads/:type/:user_fullname")} element={< Uploads/>}/>*/} 
                                {/*NO*/}{/*ADMIN && <Route path={getPath("/posts/:team_id/:week_name")} element={<PostsPage/>}/> //za duzo do liczenia*/}
                                
<Route exact path={getPathDemo("/")} element={<Start />}/>
<Route path={getPathDemo("/login")} element={<Prestart />} />
<Route path={getPathDemo("/day/:name")} element={<DayPage/>}/>
<Route path={getPathDemo("/uploads/:type")} element={< Uploads/>}/>
<Route path={getPathDemo("/screenka/:team_id")} element={<Screenka />} />
{ADMIN && <Route path={getPathDemo("/post/:user_fullname/:id")} element={<PostPage />}/>}
<Route path={getPathDemo("/post/:user_fullname/:id/oneshot")} element={<PostPage oneshot />}/>
<Route path={getPathDemo("/post/:user_fullname/:id/rnshot")} element={<PostPage rnshot />}/> 
{ADMIN && <Route path={getPathDemo("/posts/:user_fullname/:team_id")} element={<PostsPage/>}/>}
{ADMIN && <Route path={getPathDemo("/posts/:user_fullname/:team_id/:week_name")} element={<PostsPage/>}/>}
<Route path={getPathDemo("/posts/:user_fullname/:team_id/:week_name/throwback")} element={<PostPage throwback />}/> 
<Route path={getPathDemo("/posts/:user_fullname/:team_id/:week_name/ohpreview")} element={<PostPage ohpreview />}/>


                                <Route path="*" element={<PageNotFound />} />

                            </Routes>
                        </ProvidersSelector>
                    </BrowserRouter>
                </div>
            </div>
            )
        }
 
export default App;