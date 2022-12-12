import React from "react";
import NavBar from "./NavBar";
import { AUTH_TOKEN } from './util/constants';
import { useNavigate } from 'react-router-dom';

export default function DashBoard() {
    const authToken = localStorage.getItem(AUTH_TOKEN);
    const navigate = useNavigate();
    React.useEffect(() => {
        if (!authToken) {
          navigate('/SignIn')}
          else
          navigate("/new")
    }, [authToken])
    return (
        <>
            <NavBar />
        </>
    )

}