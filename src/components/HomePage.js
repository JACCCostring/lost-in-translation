import React, { useContext, useEffect, useState } from "react";
//importing API context
import { authenticationContext } from "../context/LogginContext";
// importing icon images
import iconRobot from '../utils/logo-fonts-icons/Logo-Hello.png'
import iconKeyboard from '../utils/logo-fonts-icons/keyboard-icon.png'

const usersEndPoint = 'https://noroff-final-ass-v1.herokuapp.com/translations/';
const API_Key = 'e2476fbf-06d8-47f8-a96a-cbd930b13382';

export default function HomePage()
{
    // state to set user and login when if founded
    const [userName, setUserName] = useState(null)
    const [userNotExist, setUserNotExist] = useState(false)

    // descturcting states to use them inside this context
    const {setLogin} = useContext(authenticationContext)
    const {setUser} = useContext(authenticationContext)

    trySession()
    // if local store still contains logged value
    // then log in automatically
    function trySession(){
    // if localStorage has an item with a key value of username
    //then set user name and login
    if(localStorage.getItem('username') !== null){
        setUser(localStorage.getItem('username'))
        setLogin(true)
        return
    }
    }

    // function called when click event happens
    function authenticateUser()
    {
       fetch(usersEndPoint)
       .then(data => data.json())
       .then(jsData => {
           jsData.map((field)=>{
            //if user name exist in API data then
            //do not save it into the API
            if(userName === field.username){
                // name exist in API data
                alert(`user ${userName} is already registered`);
                //set user name, the first of the array of strings
                setUser(userName)
                //login
                setLogin(true)
                //set user to session
                //in local storage
                managedSessions(userName)
            }
            // set if user doesn't exist
            setUserNotExist(true)
           })
           
        })
}
   //It will execute just one time and
   //will save just if userNotExist is se to true
   //and userName is not null 
   useEffect(()=>{
    if(userNotExist && userName !== null){
        //then register user
        registerUser(userName)
        //alert
        alert(`user ${userName} is now registered`)
        //set user name, the first of the array of strings
        setUser(userName)
        //login
        setLogin(true)
        //set user to session in local storage
        managedSessions(userName) 
    }  
   }, [userNotExist])

    //  jsx code for dynamic html 
    return (
        // main box
        <div className='main-box'>
            {/* header */}
            <p className='title-box'>Lost in Translation</p>
            {/* line */}
            <hr></hr>
            {/* icon */}
            <img src={iconRobot} width={90} className='icon-robot' alt=""></img>
            {/* subtitles */}
            <p className="subtitle-box">Lost in Translation</p>
            <p className="content-subtitle-box">Get Started</p>

            {/* box for input text */}
            <div className="box-input">
            <input type='text' placeholder="What's your name ?" 
                onChange={(key)=>{
                    setUserName(key.target.value)
                }}> 
                </input>
                <button onClick={authenticateUser}>→</button>
                <img src={iconKeyboard} className="icon-keyboard" alt=""></img>
            </div>
            {/* end of main box */}
        </div>
    )
}

// function fect endpoint to store data into the API 
function registerUser(newUser){
    // options as an obj for better readeable code
    let options = {
        method: 'POST',
        headers: {
            'X-API-Key': API_Key,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: newUser,
            translations: []
        })
    };
    // fetching data
    fetch(usersEndPoint, options)
    .then(response => {
        if(! response.ok){
            alert(`new user ${newUser} couldn't be created`);
        }
        return response.json();
    })
    .then(userAdded => console.log(userAdded))
}

// managed local storage for sessions
function managedSessions(credential){
    //populate local storage with a key value pair 
    //to be able to retrieve when need it
    localStorage.setItem('username', credential)
}