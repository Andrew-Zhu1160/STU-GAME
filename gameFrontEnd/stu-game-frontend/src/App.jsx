import { useState,useEffect } from 'react'
//you can import .env variables like this:
//import.meta.env.VITE_PORT
import LoginPage from './loginPage/loginPage.jsx'

import MainPage from './mainPage/mainPage.jsx'

import TowerDefenceGamePage from './towerDefenceGamePage/towerDefenceGamePage.jsx';

import BallClutchGamePage from './ballClutchGamePage/ballClutchGamePage.jsx';

//background styles
import styles from './App.module.css'

//periodic update setting sheet to reflect updates
import { Stage, Layer, Circle, Group, Image,Rect } from 'react-konva';
import Konva from "konva";

function App() {
const[displayPage,setDisplayPage] = useState([
  true,false,false,false
]);

const isDev = import.meta.env.VITE_MODE ==='DEV';
const updateSettingSheetRate=60000;
async function processUpdateSettingSheet(){
  try{
    const response = await fetch(`${import.meta.env.VITE_API_URL}/updateSettingSheet`, { credentials: 'include' });
    if(response.ok){
      if(isDev){console.log('reflected most recent setting sheet')}
    }

  }catch(error){
    if(isDev){console.log(error)}
    
  }
}




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

  
  

  const updateSheetProcess = setInterval(processUpdateSettingSheet,updateSettingSheetRate);

  return ()=>{
      clearInterval(updateSheetProcess);
  }

}, []);




const particles = Array.from({ length: 12 });





  return(
    <div style={{ width: '100vw', height: '100vh' ,position:'absolute'}}
    className={styles.appBackground}>

      <div className={styles.particleContainer}>
      {particles.map((_, i) => (
        <div 
          key={i} 
          className={styles.particle} 
          style={{
            // Randomize start positions and animation timing
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${10 + Math.random() * 15}s`,
            width: `${100 + Math.random() * 50}px`,
            height: `${100 + Math.random() * 50}px`,
          }}
        />
      ))}
    </div>

      

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
