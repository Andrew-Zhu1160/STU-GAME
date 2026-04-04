import { useState,useEffect } from 'react'
//you can import .env variables like this:
//import.meta.env.VITE_PORT

//seyup react router, replace the old display page logic
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


//landing page:
import LandingPage from './landingPage/landingPage.jsx'

import LoginPage from './loginPage/loginPage.jsx'

import MainPage from './mainPage/mainPage.jsx'

import TowerDefenceGamePage from './towerDefenceGamePage/towerDefenceGamePage.jsx';

import BallClutchGamePage from './ballClutchGamePage/ballClutchGamePage.jsx';

import PizzaSlicerGamePage from './pizzaSlicerGamePage/pizzaSlicerGamePage.jsx';

//background styles
import styles from './App.module.css'



function App() {


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
  

  
  

  const updateSheetProcess = setInterval(processUpdateSettingSheet,updateSettingSheetRate);

  return ()=>{
      clearInterval(updateSheetProcess);
  }

}, []);




const particles = Array.from({ length: 12 });





  return(
    <Router>
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

      

      <Routes>

        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/towerDefence" element={<TowerDefenceGamePage />} />
        <Route path="/ballClutch" element={<BallClutchGamePage />} />
        <Route path="/pizzaSlicer" element={<PizzaSlicerGamePage />} />

       
      </Routes>





















      {/*
      old display page logic, RIP,lol
      {displayPage[0]&&(<LoginPage 
      switchPage={(pageIndex) => {
          setDisplayPage(d => d.map((_, i) => i === pageIndex));
        }}/>
        )}
        
    

      {displayPage[1]&&(<MainPage  
      switchPage={(pageIndex) => {
          setDisplayPage(d => d.map((_, i) => i === pageIndex));
        }}/>
        )}

      
      {displayPage[2] && (
      <TowerDefenceGamePage 
        
        switchPage={(pageIndex) => {
          setDisplayPage(d => d.map((_, i) => i === pageIndex));
        }} 
        />
      )}

      {displayPage[3] && (
      <BallClutchGamePage
        
        switchPage={(pageIndex) => {
          setDisplayPage(d => d.map((_, i) => i === pageIndex));
        }} 
        />
      )}


      {displayPage[4] && (
      <PizzaSlicerGamePage
        
        switchPage={(pageIndex) => {
          setDisplayPage(d => d.map((_, i) => i === pageIndex));
        }} 
        />
      )}

    */}







    </div>
    </Router>

  )
  
  
}

export default App
