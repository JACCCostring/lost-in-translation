import {React, useContext, useEffect, useState} from "react";

// importing icon images
import iconRobot from '../utils/logo-fonts-icons/Logo-Hello.png'
import iconGoBack from '../utils/logo-fonts-icons/back-btn.png'

// importing API Context
import { authenticationContext } from "../context/LogginContext";

// importing Link for routing
import { Link } from "react-router-dom";

// user end point
const usersEndPoint = 'https://noroff-final-ass-v1.herokuapp.com/translations/';

// API Key for PATCH
const API_Key = 'e2476fbf-06d8-47f8-a96a-cbd930b13382';




export default function ProfilePage(){

    // destructing states to use them inside this context
    const {user} = useContext(authenticationContext)
    const {setLogin} = useContext(authenticationContext)
    const {userId, setUserId} = useContext(authenticationContext)

    // hook for setting the last 10 translations
    const [translations, setTranslations] = useState(null)

    //useEffect need to be executed just once
    //to set user ID according to the login user name
    useEffect(()=>{
        fetch(usersEndPoint)
        .then(data => data.json())
        .then(readyData => {
            // retrieve user id
            readyData.map(retrieveUser => {
                if(retrieveUser.username === user)
                // if found it then set ID
                    setUserId(retrieveUser.id)
            })
        })
        .catch(err => console.log(`something when wrong ${err}`))
     }, [userId])

    //here all resources need to be cleaer before login out
    function logOutUser(){
        localStorage.removeItem('username')
        setLogin(false)
    }
    
    //here need to be called at least once at the beginning 
    //so it can populate the div tag with translations
    useEffect(()=>{
        const translationEndPoint = 
        `https://noroff-final-ass-v1.herokuapp.com/translations/${userId}`
        //fetching
         fetch(translationEndPoint)
        .then(data => data.json())
        .then(jsData => {
        if(jsData) setTranslations(jsData.translations)
        })
        .catch(err => console.log(err))
    }, [userId])

    // when clear translations btn clicked
    function clearTranslation(){
        console.log('clearing')
        const translationEndPoint = 
        `https://noroff-final-ass-v1.herokuapp.com/translations/${userId}`

        fetch(translationEndPoint, {
            method: 'PATCH',
            headers: {
                'X-API-Key': API_Key,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // clearing translation
                translations: [] 
            })
        })
        .then(data => data.json())
        .then(jsData => setTranslations(jsData.translations))
    }


    return (
        <div className='main-box-profile'>
            {/* robot icon */}
            <img src={iconRobot} className="icon-robot-profile" alt=""></img>
             {/* title header */}
             <p className='title-box-profile'>Lost in Translation</p>
             {/* user icon  */}
             <Link to='/'>
             <img src={iconGoBack} className="icon-back-profile" alt=""></img>
             </Link> 
            {/* user name 
                splitting user name and take just the first name
                to avoid so long names in the UI
            */}
            <p className="user-name-profile">{user.split(' ')[0]}</p>
            <p className="logout-btn-profile" onClick={logOutUser}>Log Out</p>
            <p className="icon-profile-title-profile">Back</p>
            {/* line */}
            <hr></hr>   
             {/* robot icon */}
             <img src={iconRobot} className='icon-robot-profile-sub' alt=""></img>
            {/* subtitles */}
            <p className="subtitle-box-profile">Profile</p>

            {/* output box profile  */}
            <div className="output-box-profile">
                <div className="output-box-pro-title">Last 10 Translations :</div>

                <div className="output-pro-content">
                
                    { translations && translations.map((t, i) =>{
                        // if i < or = to 9 then break iteration
                        //with this then code can just read 10 translation    
                        if(i <= 9)
                            return <p key={i}>{t}</p>
                    })
                    } 
                </div>
            </div>
            <button className="btn-clear-profile" onClick={clearTranslation}>Clear Translations</button>
        </div>
    )
}