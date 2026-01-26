import { useState } from "react";
import styles from './loginPage.module.css';
import fortImage from '../images/Fort-Login-Page.png';



//updates panel
import update1 from '../images/towerGameImg/towerLv11.png';
import update2 from '../images/towerGameImg/towerLv12.png';



const StyleMain={
    width:'100%',
    height:'100%',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    background:'linear-gradient(170deg, #1840f0ff 0%, #a991c1ff 100%)',
    margin: 0,
    position:'relative',
    overflow:'hidden'
}
const StylePanel={
    width:'60%',
    minHeight:'50vh',
    background:'linear-gradient(170deg, hsla(57, 88%, 65%, 0.70) 0%, hsla(229, 89%, 62%, 0.70) 100%)',
    borderRadius:'15px',
    boxShadow:'0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    backdropFilter:'blur(8.5px)',
    border:'15px solid rgba(46, 52, 64, 1)',
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    padding:'20px',
    
    flexWrap:'wrap'
    
    
}



function LoginPage({switchPage,styleDisplay}) {
    function createRings(widths,colors,animateDelay,animateDuration,animateDirection='normal'){
        return(<div className={styles.ring} style={{width:`${widths}px`,
                                            height:`${widths*1.06}px`,
                                            border: `50px solid ${colors}`,
                                            borderBottom:'none',
                                            animationDirection:animateDirection,
                                            animationDelay:`${animateDelay}`,
                                            animationDuration:`${animateDuration}`}}></div>);
    }
    const ring1=createRings(100,'hsl(204, 72%, 64%)','0.1s','5.5s');
    const ring2=createRings(230,'hsla(146, 85%, 60%, 1.00)','0.2s','6s','reverse');
    const ring3=createRings(360,'hsla(63, 89%, 49%, 1.00)','0.3s','6.5s');
    const ring4=createRings(490,'hsla(15, 89%, 49%, 1.00)','0.4s','7s','reverse');
    const ring5=createRings(620,'hsl(204, 72%, 64%)','0.1s','7.5s','normal');
    const ring6=createRings(750,'hsla(146, 85%, 60%, 1.00)','0.2s','8s','reverse');
    const ring7=createRings(880,'hsla(63, 89%, 49%, 1.00)','0.3s','8.5s','normal');
    const ring8=createRings(1010,'hsla(15, 89%, 49%, 1.00)','0.4s','9s','reverse');
    const ring9=createRings(1140,'hsl(204, 72%, 64%)','0.1s','9.5s','normal');
    const ring10=createRings(1270,'hsla(146, 85%, 60%, 1.00)','0.2s','10s','reverse');
    const ring11=createRings(1400,'hsla(63, 89%, 49%, 1.00)','0.3s','10.5s','normal');
    const ring12=createRings(1530,'hsla(15, 89%, 49%, 1.00)','0.4s','11s','reverse');



    const fortIcon1 = <img src={fortImage} className={styles.fortR}></img>
    const fortIcon2 = <img src={fortImage} className={styles.fortL}></img>
    const fortIcon3 = <img src={fortImage} className={styles.fortBL}></img>
    const fortIcon4 = <img src={fortImage} className={styles.fortBR}></img>







    //login, singup logic
    const[gameNameInput,setGameNameInput]=useState('');
    const[passwordInput,setPasswordInput]=useState('');

    //warning message state
    const[warningMessage,setWarningMessage]=useState('');
    const[warningDisplay,setWarningDisplay]=useState(false);

    
    async function handleSignUp(){
        //sign up logic
        try{
            setWarningDisplay(false);
            //hid ui
            const response = await fetch(`${import.meta.env.VITE_API_URL}/signUp`,{
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',},
                body: JSON.stringify({
                    newPlayerName: gameNameInput,
                    newPlayerPassword: passwordInput




                })
            });
            //added safty
            
            const data = await response.json();
            console.log(data.message);
            
            if(!response.ok){
                //show error message
                //safty
                
                setWarningMessage(data.message);
                setWarningDisplay(true);
                

            }else{
                //proceed to automatically login
                try{
                    const loginResponse =await fetch(`${import.meta.env.VITE_API_URL}/login`,{
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',},
                        body: JSON.stringify({
                            existPlayerName: gameNameInput,
                            existPlayerPassword: passwordInput


                        })
                    });
                    
                    const loginData = await loginResponse.json();
                    
                    if(!loginResponse.ok){
                        
                        setWarningMessage(loginData.message);
                        setWarningDisplay(true);
                        
                    }else{
                        //successful first login
                        //clean up current page and go to main game page
                        console.log(loginData.message);
                        setGameNameInput('');
                        setPasswordInput('');
                        switchPage(1);

                    }



                }catch(error){
                    setWarningMessage(error.message);
                    setWarningDisplay(true);
                }



            }
            


        }catch(error){
            setWarningMessage(error.message);
            setWarningDisplay(true);
        }


    }




  async function handleLogin(){
    setWarningDisplay(false);
        const loginResponse = await fetch(`${import.meta.env.VITE_API_URL}/login`,{
            method: 'POST',
            credentials: 'include',
            headers: { 
                'Content-Type': 'application/json'},
            body: JSON.stringify({
                existPlayerName: gameNameInput,
                existPlayerPassword: passwordInput


            })
        });
        const loginData = await loginResponse.json();
        if(!loginResponse.ok){
            
            setWarningMessage(loginData.message);
            setWarningDisplay(true);
           
        }else{
            //successful login
            console.log(loginData.message);
            setGameNameInput('');
            setPasswordInput('');
            switchPage(1);

        }



    }






    return(<div style={{...StyleMain,...styleDisplay}}>
         {ring1}{ring2}{ring3}{ring4}{ring5}{ring6}{ring7}{ring8}{ring9}{ring10}{ring11}{ring12}
         {fortIcon1}{fortIcon2}{fortIcon3}{fortIcon4}
         <h1 className={styles.gameTitle}>STU GAME</h1>
        
        
        
        <h1 className={styles.warning}
        style={{display: warningDisplay ? 'block' : 'none'}}>{warningMessage}</h1>
        
        
        
        
        <div style={{...StylePanel}}>
            <h2 className={styles.instructionText}>Enter Game Name</h2>
            
            
            <input type="text" className={styles.inputText} value={gameNameInput} 
            onChange={(e)=>{setGameNameInput(e.target.value);}}
            ></input>



            <h2 className={styles.instructionText}>Enter Password</h2>
            
            
            
            <input className={styles.inputText} type='text'
            value={passwordInput} 
            onChange={(e)=>{setPasswordInput(e.target.value);}}
            ></input>



            
            
            
            
            
            
            <button className={styles.inputButton}
            onClick={handleSignUp}>Sign Up 😊</button>


           
            <button className={styles.inputButton} onClick={handleLogin}>
                Log In 😍
                </button>



        </div>


        {/*change the content inside here when major
        update is released*/ }
        <div className={styles.updateShowCase}>
            
            <img src = {update2}></img>
            <img src={update1}></img>
            <h1>New Tower!!</h1>

        </div>

    </div>);


}
export default LoginPage;