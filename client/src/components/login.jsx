import React from "react";
import Home from "./home";
import { useNavigate } from "react-router-dom";
import "./login.css"


function Login() {

    //citation for routing using js start: https://stackoverflow.com/questions/31079081/programmatically-navigate-using-react-router
    const navigate = useNavigate();
    function goHome() {
        navigate("/home");
    }
    //citation for routing using js end


    //function to log in to site
    function login() {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const data = { "username": username, "password": password };
        console.log(data);
        fetch("/login", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => console.log(data.success ? goHome(): alert(data.message)))
            .catch(err => console.error(err));
    }


    //function to create new user on site
    function createUser() {
        const newUsername = document.getElementById("newUsername").value;
        const newPassword = document.getElementById("newPassword").value;
        const data = { "username": newUsername, "password": newPassword };
        console.log(data);
        fetch("/createUser", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => console.log(data.success ? alert(data.message) : alert(data.message)))
            .catch(err => console.error(err));
    }



    return (
        <div className="main">
            <h1 className="title">Welcome to Mo's Events</h1>
            <div>Login:</div>
            <div className='loginForm'>
                <input id='username' type='text' placeholder='username' className="loginInput"></input>
                <input id='password' type='text' placeholder='password' className="loginInput"></input>
                <button onClick={login} className="loginButton">Login</button>
            </div>
            <div>Create User:</div>
            <div className='createUserForm'>
                <input id='newUsername' type='text' placeholder='username' className="loginInput"></input>
                <input id='newPassword' type='text' placeholder='password' className="loginInput"></input>
                <button onClick={createUser} className="loginButton">Create Account</button>
            </div>
        </div>

    )
}

export default Login;