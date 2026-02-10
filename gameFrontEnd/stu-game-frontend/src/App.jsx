import { useState,useEffect } from 'react'
//you can import .env variables like this:
//import.meta.env.VITE_PORT
import LoginPage from './loginPage/loginPage.jsx'

import MainPage from './mainPage/mainPage.jsx'

import TowerDefenceGamePage from './towerDefenceGamePage/towerDefenceGamePage.jsx';

import BallClutchGamePage from './ballClutchGamePage/ballClutchGamePage.jsx';



function App() {
const[displayPage,setDisplayPage] = useState([
  true,false,false,false
]);


//test code,delete this later, test cokkie handling
/*
useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/profile`, { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
      if(data.loggedIn) {
        console.log("Welcome back, " + data.playerName);
        // Here you could automatically switchPage(1)
      }
    });
}, []);
*/
//end of test code

//it is super important to have credentials: 'include' in fetch requests to send cookies, in order fo backend to use req.session properly




useEffect( () => {
  //On initial load, check if user is already logged in
  //direct to the main page if so
  async function checkLoginStatus(){
  try{
    const response = await fetch(`${import.meta.env.VITE_API_URL}/currentPlayer`, { credentials: 'include' });
    const data = await response.json();
    if(response.ok){
      setDisplayPage(d=>{
          let temp=d.map(_=>false);
          temp[1]=true;
          return temp;
        });
        
      
    }else{
      setDisplayPage(d=>{
          let temp=d.map(_=>false);
          temp[0]=true;
          return temp;
        });

    }
    console.log(data.message);
  }catch(error){
    console.log("unknown error", error);
  }

}
checkLoginStatus();

}, []);

















  return(
    <div style={{ width: '100vw', height: '100vh' ,position:'absolute'}}>

      

      {displayPage[0]&&(<LoginPage styleDisplay={{display: 'flex'}} 
      switchPage={(pageIndex) => {
          setDisplayPage(d => d.map((_, i) => i === pageIndex));
        }}/>
        )}
        
    

      {displayPage[1]&&(<MainPage styleDisplay={{display: 'flex'}} 
      switchPage={(pageIndex) => {
          setDisplayPage(d => d.map((_, i) => i === pageIndex));
        }}/>
        )}

      
      {displayPage[2] && (
      <TowerDefenceGamePage 
        styleDisplay={{display: 'flex'}} // This triggers the useEffect inside the game page
        switchPage={(pageIndex) => {
          setDisplayPage(d => d.map((_, i) => i === pageIndex));
        }} 
        />
      )}

      {displayPage[3] && (
      <BallClutchGamePage
        styleDisplay={{display: 'flex'}} // This triggers the useEffect inside the game page
        switchPage={(pageIndex) => {
          setDisplayPage(d => d.map((_, i) => i === pageIndex));
        }} 
        />
      )}







    </div>

  )
  
  
}

export default App
