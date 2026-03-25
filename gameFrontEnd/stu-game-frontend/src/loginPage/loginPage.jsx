import { useState,useEffect,useRef } from "react";
import styles from './loginPage.module.css';
import fortImage from '../images/Fort-Login-Page.png';
import loadingGear from '../images/loadingGear.png';



//updates panel
import update1 from '../images/towerGameImg/towerLv11.png';
import update2 from '../images/towerGameImg/towerLv12.png';

//for playground
import Matter from 'matter-js';
import { Stage, Layer, Circle, Group, Image as KonvaImage,Rect } from 'react-konva';
import Konva from "konva";
import lv1Tower from '../images/towerGameImg/towerLv1.png';
import lv3Tower from '../images/towerGameImg/towerLv3.png';
import lv6Tower from '../images/towerGameImg/towerLv6.png';
import lv10Tower from '../images/towerGameImg/towerLv10.png';
import ball5 from '../images/ballClutchGameImg/ballNo5.png';
import ball4 from '../images/ballClutchGameImg/ballNo4.png';
import pizza1 from '../images/pizzaSlicerGameImage/pizza1.png';
import pizza3 from '../images/pizzaSlicerGameImage/pizza3.png';
import spinningBlade from '../images/spinningBlade.png';




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



const testLoadingDelay = 2000;
const isDev = import.meta.env.VITE_MODE==='DEV';

function LoginPage({switchPage,styleDisplay}) {
    /*-----------------------------------------------------------
    loading spinner
    ------------------------------------------------------------- */
    const [displayLoadingScreen,setDisplayLoadingScreen] = useState(false);
    const[loadingDots,setLoadingDots] = useState("");
    useEffect(()=>{
        let dotProcessId;
        if(displayLoadingScreen){
            dotProcessId = setInterval(()=>{
                setLoadingDots(l=>{
                    l=l+"."
                if(l.length >=8){l=""}
                return l;});      
            },500)
        }
        return ()=>{
            if(dotProcessId){clearInterval(dotProcessId);}
        }

    },[displayLoadingScreen]);

    /*-------------------------------------
    end of loading spinner
    --------------------------------------- */
    
    



    const fortIcon1 = <img src={fortImage} className={styles.fortR}></img>
    const fortIcon2 = <img src={fortImage} className={styles.fortL}></img>
   
    







    //login, singup logic
    const[gameNameInput,setGameNameInput]=useState('');
    const[passwordInput,setPasswordInput]=useState('');

    //warning message state
    const[warningMessage,setWarningMessage]=useState('');
    const[warningDisplay,setWarningDisplay]=useState(false);

    
    async function handleSignUp(){
        //sign up logic
        try{
            setDisplayLoadingScreen(true);

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
        }finally{
            //get rid of loading
            if(isDev){
                await new Promise((resolve,reject)=>{
                    setTimeout(()=>{resolve();},testLoadingDelay);
                });
            }
            setDisplayLoadingScreen(false);
            //get rid of loading

        }


    }




  async function handleLogin(){
    try{
    setDisplayLoadingScreen(true);
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
    }catch(error){
        if(isDev){console.log(error);}
    }finally{
        //get rid of loading
        if(isDev){
            await new Promise((resolve,reject)=>{
                setTimeout(()=>{resolve();},testLoadingDelay);
            });
        }
        setDisplayLoadingScreen(false);
        //get rid of loading
    }



    }

    //game mini playground
    const engineRef= useRef(Matter.Engine.create());
    const playBallRef=useRef(null);
    const imageArr=useRef(null);
    const wallRef=useRef(null);
    const playBallBodyRef=useRef(null);

    const stageRef=useRef(null);
    const spinningBladeRef=useRef(null);
    const spinningBladeBodyRef=useRef(null);

    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const dimentionsRef=useRef({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(()=>{
        dimentionsRef.current={...dimensions};

    },[dimensions]);

    const remainingBall = useRef(20);
    const pIdCounter = useRef(1);
    //image pre decoder
    const preloadAndDecode = async (src) => {
        const img = new Image();
        img.src = src;
        img.decoding = 'async';
        await img.decode();
        return img; // This is now a "hot" bitmap ready for Konva
    };
    
    useEffect(()=>{
        if(styleDisplay?.display==='flex'){
           
            const handleResize = () => {
                    setDimensions({
                        width: window.innerWidth,
                        height: window.innerHeight,
                    });
                };
             window.addEventListener('resize', handleResize);
            
             async function loadImage(){
                try{
                    setDisplayLoadingScreen(true)
                    const allImage=await Promise.all([
                        preloadAndDecode(lv1Tower),
                        preloadAndDecode(lv3Tower),
                        preloadAndDecode(lv6Tower),
                        preloadAndDecode(lv10Tower),
                        preloadAndDecode(ball4),
                        preloadAndDecode(ball5),
                        preloadAndDecode(pizza1),
                        preloadAndDecode(pizza3),
                        preloadAndDecode(spinningBlade)
                    ]);
                    imageArr.current=[...allImage];

            }catch(error){
                if(isDev)console.log(error);

            }finally{
                //get rid of loading
                if(isDev){
                    await new Promise((resolve,reject)=>{
                        setTimeout(()=>{resolve();},testLoadingDelay);
                    });
                }
                setDisplayLoadingScreen(false);
                //get rid of loading
            }


             }
             loadImage();
             playBallBodyRef.current=[];
             wallRef.current=[];
             wallRef.current.push(Matter.Bodies.rectangle(dimentionsRef.current.width/2,dimentionsRef.current.height+25,10000,50,{isStatic:true}));
             wallRef.current.push(Matter.Bodies.rectangle(-25,dimentionsRef.current.height/2,50,10000,{isStatic:true}));
             wallRef.current.push(Matter.Bodies.rectangle(dimentionsRef.current.width+25,dimentionsRef.current.height/2,50,10000,{isStatic:true}));
             Matter.Composite.add(engineRef.current.world,[...wallRef.current]);

             spinningBladeBodyRef.current=Matter.Bodies.polygon(dimentionsRef.current.width/10,dimentionsRef.current.height/10,3,dimentionsRef.current.width/8,{
                isStatic:true,
                restitution: 10,
                friction: 0.01
             });
             Matter.Composite.add(engineRef.current.world,spinningBladeBodyRef.current);
             
             

             const anim =  new Konva.Animation((frame)=>{
                if(!imageArr.current||!playBallRef.current||!wallRef.current||!stageRef.current||!spinningBladeRef.current){return;}

                //create the spinning balde visual if it is not there
                if(!spinningBladeRef.current?.image()){
                    spinningBladeRef.current.x(dimentionsRef.current.width/10);
                    spinningBladeRef.current.y(dimentionsRef.current.height/10);
                    spinningBladeRef.current.width(dimentionsRef.current.width/5);
                    spinningBladeRef.current.height(dimentionsRef.current.width/5);
                    spinningBladeRef.current.image(imageArr.current[imageArr.current.length-1]);
                    spinningBladeRef.current.offsetX(dimentionsRef.current.width/10);
                    spinningBladeRef.current.offsetY(dimentionsRef.current.width/10)


                    spinningBladeRef.current.on('dragmove', () => {
                        const pos = {x:spinningBladeRef.current.x(),y:spinningBladeRef.current.y()};
                        Matter.Body.setPosition(spinningBladeBodyRef.current, { x: pos.x, y: pos.y });
                    });

                }

               


                Matter.Engine.update(engineRef.current,frame.timeDiff);
                const lastFrame = frame.time-frame.timeDiff;
                const spawnBallFrequency = 500;
                const isSpawnTime  = Math.floor(frame.time/spawnBallFrequency)>Math.floor(lastFrame/spawnBallFrequency);
                if(isSpawnTime&&remainingBall.current>0){
                    pIdCounter.current++;
                    remainingBall.current--;
                    const newBallBody = Matter.Bodies.circle(dimentionsRef.current.width/2,-200,dimentionsRef.current.width/20,{
                        pId:pIdCounter.current
                    });
                    Matter.Composite.add(engineRef.current.world, newBallBody);
                    playBallBodyRef.current.push(newBallBody);
                    const newBallNode= new Konva.Image({
                        width:dimentionsRef.current.width/10 +5,
                        height:dimentionsRef.current.width/10+5,
                        offsetX:(dimentionsRef.current.width/10 +5)/2,
                        offsetY:(dimentionsRef.current.width/10 +5)/2,
                        image:imageArr.current[Math.floor(Math.random()*imageArr.current.length-1)],
                        pId:pIdCounter.current
                    });
                    playBallRef.current.add(newBallNode);


                }
                for (let i = 0;i<playBallBodyRef.current.length;++i){
                    
                    const ballNode = playBallRef.current.findOne(node=>node.getAttr("pId")===playBallBodyRef.current[i].pId);
                    if(playBallBodyRef.current[i].position.x>dimentionsRef.current.width+50||playBallBodyRef.current[i].position.x<-50||
                        playBallBodyRef.current[i].position.y>dimentionsRef.current.height+50|| playBallBodyRef.current[i].position.y<-300
                    ){
                        Matter.Body.setPosition(playBallBodyRef.current[i],{x:dimentionsRef.current.width/2,y:0});
                    }

                    if(ballNode){ballNode.x(playBallBodyRef.current[i].position.x);
                        ballNode.y(playBallBodyRef.current[i].position.y);
                        ballNode.rotation(playBallBodyRef.current[i].angle*180/Math.PI)
                    }
                }

                //update walls
                Matter.Body.setPosition(wallRef.current[0], { x: dimentionsRef.current.width/2, y: dimentionsRef.current.height+25 });
                Matter.Body.setPosition(wallRef.current[1], { x: -25, y: dimentionsRef.current.height/2 });
                Matter.Body.setPosition(wallRef.current[2], { x: dimentionsRef.current.width+25, y:dimentionsRef.current.height/2 });

               //update spinner
               spinningBladeRef.current.rotate(9);
               Matter.Body.setAngle(spinningBladeBodyRef.current,spinningBladeRef.current.rotation()*Math.PI/180);



             });

             anim.start();



            return () =>{ window.removeEventListener('resize', handleResize);anim.stop();}
        }

    },[styleDisplay?.display])






    return(<div style={{...StyleMain,...styleDisplay}}>
        <Stage width={dimensions.width} height={dimensions.height} ref={stageRef}>
            <Layer ref={playBallRef}></Layer>
            <Layer>
                <KonvaImage ref={spinningBladeRef} draggable={true}></KonvaImage>
            </Layer>
        </Stage>

        <div style = {{display:displayLoadingScreen?"flex":"none"}}
            className={styles.loadingScreen}>
                <img src = {loadingGear}></img>
                <h1>loading {loadingDots}</h1>

        </div>

         
         
         <h1 className={styles.gameTitle}>STU GAME</h1>
        
        
        
        <h1 className={styles.warning}
        style={{display: warningDisplay ? 'block' : 'none'}}>{warningMessage}</h1>
        
        
        
        
        <div className={styles.card}>
            <div className={styles.content}>
            <h2 className={styles.heading}>Enter Game Name</h2>
            
            
            <input type="text" className={styles.para} value={gameNameInput} 
            onChange={(e)=>{setGameNameInput(e.target.value);}}
            ></input>



            <h2 className={styles.heading}>Enter Password</h2>
            
            
            
            <input className={styles.para} type='text'
            value={passwordInput} 
            onChange={(e)=>{setPasswordInput(e.target.value);}}
            ></input>



            
            
            
            
            
            
            <button className={styles.btn}
            onClick={handleSignUp}>Sign Up 😊</button>


           
            <button className={styles.btn} onClick={handleLogin}>
                Log In 😍
                </button>

            </div>
            
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