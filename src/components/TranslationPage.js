import React, { useContext, useEffect, useState } from "react";

// importing API Context
import { authenticationContext } from "../context/LogginContext";

// importing icon images
import iconRobot from '../utils/logo-fonts-icons/Logo-Hello.png'
import iconKeyboard from '../utils/logo-fonts-icons/keyboard-icon.png'
import iconUser from '../utils/logo-fonts-icons/user-128.png'

// importing Link for routing
import { Link } from "react-router-dom";

// user end point
const usersEndPoint = 'https://noroff-final-ass-v1.herokuapp.com/translations/';

// API Key for PATCH
const API_Key = 'e2476fbf-06d8-47f8-a96a-cbd930b13382';



export default function TranslationPage()
{
    // destructing states to use them inside this context
    const {user} = useContext(authenticationContext)
    const {setLogin} = useContext(authenticationContext)
    const {userId, setUserId} = useContext(authenticationContext)

    //use states
    const [content, setContent] = useState(null)
    const [ready, setReady] = useState(false)
    const [signs, setSigns] = useState()

    // array for path collection
    let pathContainer = []
    const translations = []

    // function trigger when click log out btn
    //and remove local storage to make change 
    //in the current session
    function logOutUser(){
        localStorage.removeItem('username')
        setLogin(false)
    }

    //translate content
    function translateContent(){
        // converting content into an array of characters
        let newArr = convertToArray(content)
        //  validating input
        validateArray(newArr)
        // looping, to parse img path
        for(let i = 0; i < newArr.length; i++){
            // modifying content, space img added to the folder
            //if space key is pressed then space img is loaded
            //from directory /individials_signs/space.png
            //and any other special key is ignored

            pathContainer.push(`/individial_signs/${newArr[i]}.png`)
        }
            //setting sign img with path to populate output    
            setSigns(pathContainer)

            //set it ready to show output
            setReady(true)
            
            //verifying if user ID is ready and
            //content is present
            if(userId !== 0 && content.length > 0){
                // pushing new content to array
                translations.push(content)

                //posting new translation to API
                postTranslation(userId, translations)
            }
    }

    //function to handle input data
    function inputData(key){
            setContent(key)
            }

    // function to convert string to an array
    function convertToArray(contentCaptured){
        return [...contentCaptured]
    }

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

     //fetching to get all user translations
     //for the current user
     useEffect(()=>{
        const translationEndPoint = 
        `https://noroff-final-ass-v1.herokuapp.com/translations/${userId}`
        //fetching
         fetch(translationEndPoint)
        .then(data => data.json())
        .then(jsData => {
        if(jsData) jsData.translations.map((t)=> { translations.push(t) }
        )})
        .catch(err => console.log(err))

        })

    return (

        <div className='main-box-trans'>
            {/* robot icon */}
            <img src={iconRobot} className="icon-robot-trans" alt=""></img>
             {/* title header */}
             <p className='title-box-trans'>Lost in Translation</p>
             {/* user icon  */}
             <Link to='/profile'>
             <img src={iconUser} className="icon-user-trans" alt=""></img>
             </Link> 
            {/* user name 
                splitting user name and take just the first name
                to avoid so long names in the UI
            */}
            <p className="user-name-trans">{user.split(' ')[0]}</p>
            <p className="logout-btn-trans" onClick={logOutUser}>Log Out</p>
            <p className="icon-profile-title-trans">Profile</p>
            {/* line */}
            <hr></hr>

            {/* input box */}

            <input type='text' placeholder="Write something ..."
            onChange={(key) => {inputData(key.target.value)}}>

            </input>
            {/* button */}
            <button onClick={translateContent}>→</button>
            {/* keyboard icon */}
            <img src={iconKeyboard} className="icon-keyboard-trans" alt=""></img>

            {/* output result box     */}
            <div className="output-result-box-trans">
            {
                // looping throug signs to populate output area 
                //only when ready is true
              ready ?  signs.map(
                    (sign, i) => 
                    {return <img key={i} 
                             src={sign} 
                             className="signs-trans" 
                             alt=""></img> })    
             :''
            }
            
             <p className="text-corner-trans">Translation</p>

            </div>

        </div>
    )
}

// for posting new translation record to the existing user
function postTranslation(id, trans){
    // endpoint for posting translation
const translationEndPoint = 
`https://noroff-final-ass-v1.herokuapp.com/translations/${id}`

// console.log(trans.length)

// fetching
fetch(translationEndPoint,{
    method: 'PATCH',
    headers: {
        'X-API-Key': API_Key,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        // new translations
        //looping through all the elements 
        //and assigning element to json array
        translations: trans.map((t) => {
            return t;
        })
    })
})
.then(data => data.json())
.then(response => console.log(response))
.catch(err => console.log(err))
    
}

//to validate array of characters
//if any special character found 
//then just add space to the array
function validateArray(newArr = []){
    for(let i=0; i<newArr.length; i++){
        if(newArr[i] === ' ' || newArr[i] === '?' || newArr[i] === '0'
        || newArr[i] === '1' || newArr[i] === '2' || newArr[i] === '3'
        || newArr[i] === '4' || newArr[i] === '5' || newArr[i] === '6'
        || newArr[i] === '7' || newArr[i] === '8' || newArr[i] === '9'
        || newArr[i] === '~' || newArr[i] === '}' || newArr[i] === '{'
        || newArr[i] === '`' || newArr[i] === '!' || newArr[i] === ':'
        || newArr[i] === ';' || newArr[i] === ' ' || newArr[i] === '/'
        || newArr[i] === '=' || newArr[i] === '-' || newArr[i] === '('
        || newArr[i] === ')' || newArr[i] === '^' || newArr[i] === '&'
        || newArr[i] === '>' || newArr[i] === '<' || newArr[i] === '@'
        || newArr[i] === '.' || newArr[i] === ';')
        
        newArr[i] = 'space'  
}

    // another solution but it will increse processing time

// for(let i=0; i<newArr.length; i++){
    // for(let letter = 33; letter < 127; letter++)
    // for(let i=0; i<newArr.length; i++)
        // if(newArr[i] !== String.fromCharCode(letter)) newArr[i] = 'space'
// }
}