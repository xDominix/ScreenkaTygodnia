import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthProvider from './Contexts/AuthContext';
import { PostProvider } from './Contexts/PostContext';
import TeamProvider from './Contexts/TeamContext';
import { UserProvider } from './Contexts/UserContext';
import { WeekProvider } from './Contexts/WeekContext';
import PageNotFound from './Pages/PageNotFound';
import Prestart from './Pages/login/Prestart';
import Start from './Pages/main/Start';
import "./App.css"
import Screenka from './Pages/screenka/Screenka';
import PostPage from './Objects/Post/PostPage';
import Uploads from './Pages/uploads/Uploads';

const App = () => {
    return (
            <PostProvider><TeamProvider><UserProvider><WeekProvider>

            <div className='app-flex-center-v'>
                <div className='app-max-mobile'>
                <AuthProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route exact path="/" element={<Start />}/>
                            <Route path="/login" element={<Prestart />} />
                            <Route path="/uploads/:type" element={< Uploads/>}/>
                            <Route path="/post/:user_fullname/:id" element={<PostPage />}/> {/* Jedyny slaby punkt - o ile znasz id - ale przynajmniej fajne do sharowania */}
                            <Route path="/screenka/:team_id" element={<Screenka />} /> {/*tylko gdy nalezysz do teamu, jest poniedzialek po 8, istnieje plik*/}
                            <Route path="*" element={<PageNotFound />} />
                        </Routes>
                    </BrowserRouter>
                    </AuthProvider>
                </div>
            </div>

            </WeekProvider></UserProvider></TeamProvider></PostProvider>
    )}
 
export default App;