import * as React from 'react';
import {RouterProvider, createBrowserRouter} from 'react-router-dom';
import './App.css';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import AuthenticationScreen from './screens/auth/AuthenticationScreen';
import LoginScreen from './screens/auth/LoginScreen';

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomeScreen/>,
    },
    {
        path: '/profile',
        element: <ProfileScreen/>,
    },
    {
        path: '/authentication',
        element: <AuthenticationScreen/>,
    },
    {
        path: '/login',
        element: <LoginScreen/>,
    },
]);

function App(): React.JSX.Element {
    return (
        <div>
            <React.StrictMode>
                <RouterProvider router={router}/>
            </React.StrictMode>
        </div>
    );
}

export default App;
