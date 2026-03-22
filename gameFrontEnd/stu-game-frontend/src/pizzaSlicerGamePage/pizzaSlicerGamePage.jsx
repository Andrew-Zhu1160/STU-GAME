import { useState,useEffect,useRef,useMemo,useCallback } from "react"
import { Stage, Layer, Circle, Group, Image,Rect,Line } from 'react-konva';
import Konva from "konva";
import styles from './pizzaSlicerGamePage.module.css'
import useImage from 'use-image';
import loadingGear from '../images/loadingGear.png';
import playerHp from '../images/playerHp.png';
import speedCoins from '../images/towerGameImg/speedCoin.png'

import Matter from 'matter-js';

// MediaPipe Hand Landmarker: load WASM and hand model for browser hand detection
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

//images import
import skLv1 from '../images/pizzaSlicerGameImage/playerSk1.png';
import skLv2 from '../images/pizzaSlicerGameImage/playerSk2.png';
import skLv3 from '../images/pizzaSlicerGameImage/playerSk3.png';
import skLv4 from '../images/pizzaSlicerGameImage/playerSk4.png';
import pizza1 from '../images/pizzaSlicerGameImage/pizza1.png';
import pizza2 from '../images/pizzaSlicerGameImage/pizza2.png';
import pizza3 from '../images/pizzaSlicerGameImage/pizza3.png';
import pizza4 from '../images/pizzaSlicerGameImage/pizza4.png';
import pizza5 from '../images/pizzaSlicerGameImage/pizza5.png';
import pizza6 from '../images/pizzaSlicerGameImage/pizza6.png';
import pizza7 from '../images/pizzaSlicerGameImage/pizza7.png';


import background1 from '../images/pizzaSlicerGameImage/background1.png';
import background2 from '../images/pizzaSlicerGameImage/background2.png';

const backgroundArray = [background1,background2];




const testLoadingDelay = 10;
const isDev = import.meta.env.VITE_MODE==='DEV';


//matter.js collision filter, super important
const SK_CATEGORY = 0x0001;
const PIZZA_CATEGORY = 0x0002;
const FRAG_CATEGORY = 0x0004;
//mask and category of fragment is theselves, all FRAG_CATEGORY




function pizzaSlicerGamePage({switchPage,styleDisplay}){
    const randomBackgroundIndex = useRef(Math.floor(Math.random()*backgroundArray.length));

    const [skLv1Img] = useImage(skLv1);
    const [skLv2Img] = useImage(skLv2);
    const [skLv3Img] = useImage(skLv3);
    const [skLv4Img] = useImage(skLv4);
    const skImgArr=[skLv1Img,skLv2Img,skLv3Img,skLv4Img];

    const [pizza1Img] = useImage(pizza1);
    const [pizza2Img] = useImage(pizza2);
    const [pizza3Img] = useImage(pizza3);
    const [pizza4Img] = useImage(pizza4);
    const [pizza5Img] = useImage(pizza5);
    const [pizza6Img] = useImage(pizza6);
    const [pizza7Img] = useImage(pizza7);
    const pizzaImgArr = [pizza1Img,pizza2Img,pizza3Img,pizza4Img,pizza5Img,pizza6Img,pizza7Img];


    const scaleFactor = useRef(window.innerHeight/2000);

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

    /*--------------------------------------------
    game variable and function
    ------------------------------------------ */
    

    
    async function saveCoins(addAmount){
        try{
            if(isDev){console.log('try to save'+addAmount)}
            const response = await fetch(`${import.meta.env.VITE_API_URL}/addSpeedCoins`,
                {credentials:'include',
                    method:'POST',
                    headers:{'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        addCoinAmount:addAmount
                    })  
                });
            if(response.ok){
                if(isDev){console.log('save coins successfull')}
            }else{
                if(isDev){console.log('save unsuccessfull')}
            }

        }catch(error){
            if(isDev){console.log(error)}
        }
    }

    async function saveAndGetScore(saveAmount){
        try{
            const response = await fetch(`${import.meta.env.VITE_API_URL}/pizzaGame/updateScore`,{
                credentials:'include',
                method:'POST',
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify({
                    newScore:saveAmount
                })
                
            });
            if(response.ok){
                if(isDev){console.log('score saved, fetched successfully')}
                const {newHighScore}=await response.json();
                setScoreTotal(newHighScore);

            }

        }catch(error){
            if(isDev){console.log(error)}
        }
    }


    const [isGameOver,setIsGameOver] = useState(false);
    const isGameOverRef = useRef(false);
    
    const[isGamePaused,setIsGamePaused] = useState(false);
    const isGamePausedRef = useRef(false);
    useEffect(()=>{
        isGamePausedRef.current=isGamePaused;
    },[isGamePaused]);
     useEffect(()=>{
        isGameOverRef.current = isGameOver;
        if(isGameOver){
            setIsGamePaused(false);
            //save and fetch scores
            const newScore = scoreTotal;
            saveAndGetScore(newScore);

        }
    },[isGameOver]);



    const [currentHp,setCurrentHp] = useState(10);
    
    useEffect(()=>{
        
        //logic for when game over
        if(currentHp<=0){
            //game is over
            setIsGameOver(true);
        }

    },[currentHp]);

     const [coinAdd,setCoinAdd] = useState(0);
        const [scoreTotal,setScoreTotal] = useState(0);
        const [coinAddTotal,setCoinAddTotal]=useState(0);
    
        const[coinAddDisplay,setCoinAddDisplay]=useState(0);
    
        useEffect(()=>{
            const tempAdd = coinAdd;
             setCoinAddDisplay(0);
            setTimeout(()=>{setCoinAddDisplay(tempAdd)},10);
            if(coinAdd>=1000){
        
                setCoinAdd(s=>0);
                //trigger a fetch to add coins  
                saveCoins(tempAdd);
    
            }
    
        },[coinAddTotal]);
    

    //implement later
    const [controlMode,setControlMode] = useState("mouse");
    const controlModeRef = useRef("mouse")
    useEffect(()=>{
        controlModeRef.current = controlMode;
    },[controlMode]);
    const [displayCameraRequest,setDisplayCameraRequest] = useState(true);
    const isFristLoad = useRef(true);

    
    const skNumber = useRef(null);
    const skConfigArr = useRef(null);
    const pizzaConfigArr = useRef(null);

    const gameDifficulty = useRef(1);
    


    /*-------------------------
    matter.js variable
    --------------------------- */

    const engineRef = useRef(Matter.Engine.create());
    const skBodyRef = useRef(null);
    const pizzaBodyRef = useRef(null);
    const pizzaFragmentBodyRef = useRef(null);

    const pizzaMassDensity = useRef(1);
    const pizzaSpawnRange = useRef({minX:100,maxX:2400});
    const pizzaTargetRange = useRef({minX:400,maxX:2100});

    const pizzaBodyShapeArr = useRef(["circle","circle","circle","circle","circle","circle","triangle"]);
    const skTrailColorArr=useRef(["gray","white","orange","orange"]);


    /*--------------------------------------------------
    konva variable
    ------------------------------------------------ */
    const skRef = useRef(null);
    const pizzaRef = useRef(null);
    const pizzaHealthRef = useRef(null);
    const pizzaFragmentRef = useRef(null);

    const stageRef = useRef(null);

    //the skTrail
    const skTrailRef = useRef(null);
    const skTrailPoints = useRef([]); // rolling history of positions
    const TRAIL_LENGTH = 12; // number of points to keep

    // very important: unique pID;
    const pIdCounter = useRef(1);





    /*-----------------------------------------------------------
    MediaPipe Hand Landmarker 
    ------------------------------------------------------------- */
    const videoRef = useRef(null);
    const handLandmarkerRef = useRef(null);
  
    const konvaAnimRef = useRef(null);
    const lastVideoTimeRef = useRef(-1);
    const streamRef = useRef(null);
    // Latest hand result for gameplay (read this inside your future game loop without re-rendering React)
    const handResultRef = useRef(null);
    // Small UI-only state (throttled) so we don't re-render at 60fps
    const [handResultUi, setHandResultUi] = useState(null);
    const lastUiUpdateTimeRef = useRef(0);
    const [webcamReady, setWebcamReady] = useState(false);
    const [handModelError, setHandModelError] = useState(null);
    const [cameraRequesting, setCameraRequesting] = useState(false);

    const [isCameraError,setIsCameraError] = useState(false);
    const isCameraErrorRef = useRef(false);
    useEffect(()=>{
        isCameraErrorRef.current = isCameraError;

    },[isCameraError]);

    

    const requestCamera = useCallback(async () => {
        // Only request camera while this game page is visible
        if(styleDisplay?.display !== 'flex') return;
        if(webcamReady || cameraRequesting) return;
        if (!videoRef.current) return;
        setCameraRequesting(true);
        setHandModelError(null);
        //loading gear
        setDisplayLoadingScreen(true);
        try {
            //the working path: https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm
            const wasmPath = "/wasm";
            const vision = await FilesetResolver.forVisionTasks(wasmPath);
            const modelPath = "/hand_landmarker.task";
            const handLandmarker = await HandLandmarker.createFromOptions(vision, {
                baseOptions: { modelAssetPath: modelPath },
                numHands: 1,
                runningMode: "VIDEO",
            });
            handLandmarkerRef.current = handLandmarker;
            const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
            streamRef.current = stream;
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
            setWebcamReady(true);
            setHandModelError(null);
            setControlMode("ai");
            setDisplayCameraRequest(false);
        } catch (err) {
            setHandModelError(err?.message || "Hand model or webcam failed");
            setWebcamReady(false);
            setControlMode("mouse");
            
        } finally {
            setCameraRequesting(false);
            if(isDev){
                await new Promise((resolve,reject)=>{
                    setTimeout(()=>{resolve();},testLoadingDelay);
                });
            }
            setDisplayLoadingScreen(false);
        }
    }, [styleDisplay?.display, webcamReady, cameraRequesting]);

    // Detection loop driven by Konva.Animation (same timing as Stage redraws)
    useEffect(() => {
        if (!webcamReady  || !videoRef.current || !handLandmarkerRef.current) return;

        
        const anim = new Konva.Animation((frame) => {
            try{
            const video = videoRef.current;
            const handLandmarker = handLandmarkerRef.current;
            if (!video || !handLandmarker || video.readyState < 2) return;
            const timeMs = video.currentTime * 1000;
            if (timeMs !== lastVideoTimeRef.current) {
                lastVideoTimeRef.current = timeMs;
                const result = handLandmarker.detectForVideo(video, timeMs);
                const nextResult = result.landmarks?.length ? result : null;
                // Store latest coordinates in a ref so the game loop can read it anytime
                handResultRef.current = nextResult;

                // Throttle UI updates to avoid re-rendering every frame
                const now = performance.now();
                if (now - lastUiUpdateTimeRef.current > 200) {
                    lastUiUpdateTimeRef.current = now;
                    setHandResultUi(nextResult);
                }
            }
            }catch(error){
                if(isDev){console.log(error)}
                setIsCameraError(true);
                setControlMode("mouse");
               
            }
        } );
        konvaAnimRef.current = anim;
        anim.start();

        return () => {
            anim.stop();
            konvaAnimRef.current = null;
        };
    }, [webcamReady]);

    useEffect(() => {
       
        return () => {
            if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
            if (konvaAnimRef.current) {
                konvaAnimRef.current.stop();
                konvaAnimRef.current = null;
            }
            if (handLandmarkerRef.current) {
                handLandmarkerRef.current.close();
                handLandmarkerRef.current = null;
            }
            handResultRef.current = null;
            setHandResultUi(null);
            setWebcamReady(false);
        };
    }, [styleDisplay?.display]);

    //actual game loop here
    useEffect(()=>{
        if(styleDisplay?.display==='flex'){
            // Init only when user clicks "Enable camera" in the prompt
            if(!displayCameraRequest){
                //now we can start fetching
                async function LoadGameSetting(){
                try{
                    setDisplayLoadingScreen(true);
                    let response = await fetch(`${import.meta.env.VITE_API_URL}/pizzaGame/getPizzaGameSetting`,{credentials:'include'});
                    if(response.ok){
                        const {data} = await response.json();
                        if(isDev){console.log(data);}
                        skConfigArr.current = [...data];
                    }
                    response = await fetch(`${import.meta.env.VITE_API_URL}/pizzaGame/getUserSkStatus`,{credentials:'include'});
                    if (response.ok){
                        const {data} = await response.json();
                        if(isDev){console.log(data);}
                        skNumber.current = data.indexOf(2) !==-1? data.indexOf(2)+1:1;
                        if(isDev){console.log(skNumber.current);}
                    }
                    response = await fetch(`${import.meta.env.VITE_API_URL}/pizzaGame/getPizzaGameSetting2`,{credentials:'include'});
                    if(response.ok){
                        const {data} = await response.json();
                        if(isDev){console.log(data);}
                        pizzaConfigArr.current = [...data];
                    }


                    const topBorder = Matter.Bodies.rectangle(1250,20,2500,50,{isStatic:true,friction:50});
                    Matter.Composite.add(engineRef.current.world,topBorder);

                    if(skNumber.current&&skConfigArr.current&&pizzaConfigArr.current){
                        skBodyRef.current = Matter.Bodies.circle(1250,1000,250,{
                            isSensor:true,
                            isStatic:true,
                            label:'sk',
                            collisionFilter:{
                                category: SK_CATEGORY,
                                mask: PIZZA_CATEGORY
                            },
                            damage:skConfigArr.current[skNumber.current-1].damage,
                            skPreviousPosition:{x:1250,y:1000},
                            skCurrentVelocity:{x:0,y:0},
                            skPreviousVelocity:{x:0,y:0}

                        });
                        Matter.Composite.add(engineRef.current.world,skBodyRef.current);

                        //body init
                        pizzaBodyRef.current = [];
                        pizzaFragmentBodyRef.current=[];

                       
                        

                    }
                    

                }catch(error){
                        if (isDev){console.log(error);}
                    }finally{
                        if(isDev){
                            await new Promise((resolve,reject)=>{
                                setTimeout(()=>{resolve();},testLoadingDelay);
                            });
                        }
                        setDisplayLoadingScreen(false);
                    }

                }
                if(isFristLoad.current){
                    isFristLoad.current=false;
                    LoadGameSetting()
                }

                

                const anim = new Konva.Animation((frame) => {
                    //general init
                    const GameDifficulty = gameDifficulty.current;
                    const lastFrame = frame.time-frame.timeDiff;
                    

                    //canva init
                    const TrailRef = skTrailRef.current;
                    const SkRef = skRef.current;
                    const PizzaRef = pizzaRef.current;
                    const PizzaFragmentRef = pizzaFragmentRef.current;
                    const PizzaHealthRef = pizzaHealthRef.current;
                    const StageRef = stageRef.current;
                    if(!SkRef||!PizzaRef||!PizzaFragmentRef||!StageRef||!PizzaHealthRef||!TrailRef)return;


                    //materjs init
                    const SkBodyRef = skBodyRef.current;
                    const PizzaBodyRef = pizzaBodyRef.current;
                    const PizzaFragmentBodyRef = pizzaFragmentBodyRef.current;


                    const SkConfigArr = skConfigArr.current;
                    const SkNumber = skNumber.current;
                    const PizzaConfigArr = pizzaConfigArr.current;

                    const PizzaSpawnRange = pizzaSpawnRange.current;
                    const PizzaTargetRange = pizzaTargetRange.current;
                    const PizzaMassDensity = pizzaMassDensity.current;

                    //spawn time consideration
                    const updateCollisionFrequency = 1;
                    const isUpdateCollisionTime = Math.floor(frame.time/updateCollisionFrequency)>Math.floor(lastFrame/updateCollisionFrequency);
                    const pizzaSpawnFrequency = Math.max(2000,3000-GameDifficulty*100);
                    const difficultyIncreaseFrequency = 30000;
                    const pizzaSpawnAmount = Math.min(2,Math.floor(GameDifficulty/5)+1);
                    const isSpawnPizzaTime = Math.floor(frame.time/pizzaSpawnFrequency)>Math.floor(lastFrame/pizzaSpawnFrequency);
                    const isIncreaseDifficultyTime= Math.floor(frame.time/difficultyIncreaseFrequency)>Math.floor(lastFrame/difficultyIncreaseFrequency);
                    




                    if(!SkConfigArr||!SkNumber||!PizzaConfigArr){
                        if(frame.time>10000){
                            //auto game over
                        }
                    }
                    if(SkConfigArr&&SkNumber&&PizzaConfigArr&&!isGameOverRef.current&&!isGamePausedRef.current){
                        if(TrailRef.stroke()!==skTrailColorArr.current[SkNumber-1]){
                            TrailRef.stroke(skTrailColorArr.current[SkNumber-1]);
                        }
                        //console.log(streamRef.current)

                        if(isIncreaseDifficultyTime){gameDifficulty.current++;}

                            Matter.Engine.update(engineRef.current,frame.timeDiff);
                            if(controlModeRef.current==="ai"&&streamRef.current&&handLandmarkerRef.current&&!isCameraErrorRef.current){
                                if(handResultRef.current){
                                    Matter.Body.setPosition(SkBodyRef,{x:(1-handResultRef.current.landmarks[0][8].x)*2500, 
                                        y:(handResultRef.current.landmarks[0][8].y)*2000});

                                }
                            }else{
                                const mouseX = (StageRef.getPointerPosition()?.x)
                                const mouseY = (StageRef.getPointerPosition()?.y)

                                if(!isNaN(mouseX+mouseY)){Matter.Body.setPosition(SkBodyRef,{x:mouseX,y:mouseY});};

                            }
                            //update skVelocity
                            SkBodyRef.skCurrentVelocity={x:SkBodyRef.position.x-SkBodyRef.skPreviousPosition.x,
                                                y:SkBodyRef.position.y-SkBodyRef.skPreviousPosition.y
                            }
                            

                            //spawning pizza logic
                            if(isSpawnPizzaTime){
                                for(let i= 0; i<pizzaSpawnAmount;++i){
                                    //very important:
                                    pIdCounter.current++;

                                    const pizzaInitialX = Math.random()*(PizzaSpawnRange.maxX-PizzaSpawnRange.minX)+PizzaSpawnRange.minX;
                                    const pizzaInitialY = 2500;
                                    let pizzaFinalX = Math.random()*1000-500 + pizzaInitialX;
                                    if(pizzaFinalX>PizzaTargetRange.maxX){pizzaFinalX=PizzaTargetRange.maxX;}
                                    else if(pizzaFinalX<PizzaTargetRange.minX){pizzaFinalX=PizzaTargetRange.minX;}

                                    const pizzaFinalY = 200;
                                    const randomPizzaNum = Math.floor(Math.random()*pizzaBodyShapeArr.current.length);
                                    const pizzaWidth =PizzaConfigArr[randomPizzaNum].width,pizzaHeight=PizzaConfigArr[randomPizzaNum].height; 
                                    //radomize pizza health
                                    const pizzaHealth = Math.min(Math.floor(GameDifficulty/5)+1,4)+Math.random()*-2;
                                    let newPizza;
                                    let newPizzaShape;
                                    let newPizzaHealthBar;
                                    
                                        
                                            newPizza = Matter.Bodies.circle(pizzaInitialX,pizzaInitialY,pizzaWidth/2,{
                                                pId:pIdCounter.current,
                                                totalHealth:pizzaHealth,
                                                currentHealth:pizzaHealth,
                                                //this is the true health bar being displayed
                                                currentHealthSliding:pizzaHealth,
                                                //this is the true health bar displayed
                                                collisionFilter:{
                                                    category: PIZZA_CATEGORY,
                                                    mask: SK_CATEGORY 
                                                },
                                                label:"circle",
                                                sliceEntry:{},
                                                sliceExit:{}
                                                
                                            });

                                           
                                            
                                       
                                    
                                     newPizzaShape = new Konva.Image({
                                            x:pizzaInitialX,
                                             y:pizzaInitialY,
                                            width:pizzaWidth,
                                            height:pizzaHeight,
                                            offsetX:pizzaWidth/2,
                                            offsetY:pizzaHeight/2,
                                            image:pizzaImgArr[randomPizzaNum],
                                               
                                                
                                            pId:pIdCounter.current

                                    });

                                    newPizzaHealthBar= new Konva.Rect({
                                        x:pizzaInitialX,
                                        y:pizzaInitialY-250,
                                        width:pizzaWidth,
                                        height:80,
                                        fullWidth:pizzaWidth,
                                        offsetX:pizzaWidth/2,
                                        offsetY:40,
                                        fill:"red",
                                        pId:pIdCounter.current
                                    })

                                    Matter.Composite.add(engineRef.current.world,newPizza);
                                    PizzaBodyRef.push(newPizza);
                                    PizzaRef.add(newPizzaShape);
                                    PizzaHealthRef.add(newPizzaHealthBar);

                                    const velocityUnitVector = {
                                        x:(pizzaFinalX-pizzaInitialX)/Math.sqrt((pizzaFinalX-pizzaInitialX)**2+(pizzaFinalY-pizzaInitialY)**2),
                                        y:(pizzaFinalY-pizzaInitialY)/Math.sqrt((pizzaFinalX-pizzaInitialX)**2+(pizzaFinalY-pizzaInitialY)**2)
                                    };
                                    const velocityMagnitude = 50;
                                    Matter.Body.setVelocity(newPizza,{x:velocityMagnitude*velocityUnitVector.x,y:velocityMagnitude*velocityUnitVector.y});
                                    const angularVelocity = Math.random()*Math.PI/6-Math.PI/12;
                                    Matter.Body.setAngularVelocity(newPizza,angularVelocity);

                                }
                            }
                            //detect collision and slice pizza
                            if(isUpdateCollisionTime){
                                if(isDev){/*console.log(SkBodyRef.skCurrentVelocity);*/}
                                const collisionList = Matter.Query.collides(SkBodyRef,PizzaBodyRef);
                                
                                for(let i=collisionList.length-1;i>=0;--i){
                                    if(isDev){console.log(collisionList[i]);}
                                    const pizzaBody = collisionList[i].bodyA.label==="sk"?collisionList[i].bodyB:collisionList[i].bodyA;

                                    
                                    

                                    
                                    if(!pizzaBody.sliceEntry.x){
                                        pizzaBody.sliceExit={};
                                        
                                        pizzaBody.sliceEntry = {x:SkBodyRef.position.x,
                                                                y:SkBodyRef.position.y
                                        };
                                    
                                    }else{
                                        if(!pizzaBody.sliceExit.x){
                                            
                                            const distance = Math.sqrt((SkBodyRef.position.x-pizzaBody.sliceEntry.x)**2+
                                                                        (SkBodyRef.position.y-pizzaBody.sliceEntry.y)**2);
                                            if(distance>=pizzaBody.circleRadius*1.6){
                                                //count as a valid cut through
                                                pizzaBody.sliceExit={x:SkBodyRef.position.x,
                                                                    y:SkBodyRef.position.y
                                                }
                                                
                                            }
                                            
                                            
                                        }
                                    }
                                }
                            }



                            let SkVelocityAngleChange = Math.abs(Math.acos((SkBodyRef.skCurrentVelocity.x*SkBodyRef.skPreviousVelocity.x+SkBodyRef.skCurrentVelocity.y*SkBodyRef.skPreviousVelocity.y)/
                                                                    (Math.sqrt(SkBodyRef.skCurrentVelocity.x**2+SkBodyRef.skCurrentVelocity.y**2)*Math.sqrt(SkBodyRef.skPreviousVelocity.x**2+SkBodyRef.skPreviousVelocity.y**2)))*180/Math.PI);
                                    
                            if(isNaN(SkVelocityAngleChange)){SkVelocityAngleChange=0}


                            //sync visuals
                           for(let i = PizzaBodyRef.length-1;i>=0;--i){ 
                                const pizzaShape = PizzaRef.findOne(node=>node.getAttr("pId")==PizzaBodyRef[i].pId);
                                if(pizzaShape){
                                    pizzaShape.x(PizzaBodyRef[i].position.x);
                                    pizzaShape.y(PizzaBodyRef[i].position.y);
                                    pizzaShape.rotation(PizzaBodyRef[i].label==="triangle"?(PizzaBodyRef[i].angle+Math.PI)*180/Math.PI:PizzaBodyRef[i].angle*180/Math.PI);

                                    
                                }
                                const pizzaHealthBar = PizzaHealthRef.findOne(node=>node.getAttr("pId")==PizzaBodyRef[i].pId);
                                if(pizzaHealthBar){
                                    pizzaHealthBar.x(PizzaBodyRef[i].position.x);
                                    pizzaHealthBar.y(PizzaBodyRef[i].position.y-250);
                                }

                                //animate health bar drop
                                if(PizzaBodyRef[i].currentHealthSliding>PizzaBodyRef[i].currentHealth){
                                    PizzaBodyRef[i].currentHealthSliding-=0.1;
                                    if(pizzaHealthBar){
                                        pizzaHealthBar.fill("white");
                                        pizzaHealthBar.width(pizzaHealthBar.getAttr("fullWidth")*PizzaBodyRef[i].currentHealthSliding/PizzaBodyRef[i].totalHealth);
                                    }
                                }else{
                                    if(pizzaHealthBar){
                                        pizzaHealthBar.fill("red");
                                    }
                                }

                                //destroy nodes 
                                if(PizzaBodyRef[i].position.y>2800){
                                    //clean up node process
                                    Matter.Composite.remove(engineRef.current.world,PizzaBodyRef[i]);
                                    PizzaBodyRef.splice(i,1);
                                    if(pizzaShape){pizzaShape.destroy();}
                                    if(pizzaHealthBar){pizzaHealthBar.destroy();}
                                    //deduct lives for left a pizza uncut

                                    setCurrentHp(h=>h-1<0?0:h-1);

        
                                }else{
                                    if(SkVelocityAngleChange>30){
                                        PizzaBodyRef[i].sliceEntry={};
                                        PizzaBodyRef[i].sliceExit={};
                                    }
                                    if(PizzaBodyRef[i].sliceEntry.x&&PizzaBodyRef[i].sliceExit.x){
                                        if(isDev){console.log("slice detected")}
                                        //It is a valid slice, deduct hp and decide wether to spawn fragement
                                        PizzaBodyRef[i].currentHealth-=SkBodyRef.damage;

                                        
                                        if(PizzaBodyRef[i].currentHealth<=0){
                                            //adding coins/scores
                                            setScoreTotal(s=>s+50+Math.min(GameDifficulty*2,100));
                                            setCoinAdd(s=>s+150+Math.min(GameDifficulty*3,200));
                                            setCoinAddTotal(s=>s+150+Math.min(GameDifficulty*3,200));

                                            //spawn fragments, delete
                                            if(pizzaShape){
                                            const dx=PizzaBodyRef[i].sliceExit.x-PizzaBodyRef[i].sliceEntry.x;
                                            const dy = PizzaBodyRef[i].sliceExit.y-PizzaBodyRef[i].sliceEntry.y;
                                            const angle = Math.atan2(dy,dx);
                                            const nx= -dy/Math.sqrt(dx**2+dy**2);
                                            const ny = dx/Math.sqrt(dx**2+dy**2);

                                            const cx = PizzaBodyRef[i].position.x;
                                            const cy = PizzaBodyRef[i].position.y;
                                            const radius = PizzaBodyRef[i].circleRadius;
                                            const w = pizzaShape.width();
                                            const h = pizzaShape.height();

                                            for (let side of [-1,1]){
                                                pIdCounter.current++;
                                                //prevent the clsure problem
                                                const capturedSide = side;
                                             
                                                //anything declard const is safe 
                                                const newPizzaFrag = Matter.Bodies.circle(cx+nx*10*side,
                                                                                        cy+ny*10*side,
                                                                                        radius*0.5,{
                                                                                        label: 'fragment',
                                                                                        frictionAir: 0.02,
                                                                                        pId:pIdCounter.current,
                                                                                        collisionFilter: { category: FRAG_CATEGORY, mask: FRAG_CATEGORY }
                                                                                        }

                                                );
                                                Matter.Body.setVelocity(newPizzaFrag,{
                                                        x:PizzaBodyRef[i].velocity.x+nx*5*side,
                                                        y:PizzaBodyRef[i].velocity.y+ny*5*side
                                                });
                                                Matter.Body.setAngularVelocity(newPizzaFrag,PizzaBodyRef[i].angularVelocity+0.05*side);
                                                Matter.Composite.add(engineRef.current.world,newPizzaFrag);
                                                PizzaFragmentBodyRef.push(newPizzaFrag);
                                                //add to canva
                                                const newPizzaFragShape = new Konva.Group({
                                                    x: cx + nx * 10 * side,
                                                    y: cy + ny * 10 * side,
                                                    
                                                    
                                                    pId: pIdCounter.current  ,
                                                    clipFunc: (ctx)=>{
                                                        
                                                        const big = Math.max(w, h) * 2;
                                                        ctx.translate(w / 2, h / 2);
                                                        ctx.rotate(angle);
                                                        if (capturedSide === 1) {
                                                            ctx.rect(-big, 0, big * 2, big);    // below the cut line
                                                        } else {
                                                            ctx.rect(-big, -big, big * 2, big); // above the cut line
                                                        }
                                                        

                                                    }


                                                });
                                                const newPizzaFragImage = new Konva.Image({
                                                    x: 0,
                                                    y: 0,
                                                    width: w,
                                                    height: h,
                                                    offsetX: w / 2,
                                                    offsetY: h / 2,
                                                    image: pizzaShape.image(),
                                                    

                                                });
                                                newPizzaFragShape.add(newPizzaFragImage);


                                                PizzaFragmentRef.add(newPizzaFragShape);
                                            }

                                            }




                                            //clean up node process
                                            Matter.Composite.remove(engineRef.current.world,PizzaBodyRef[i]);
                                            PizzaBodyRef.splice(i,1);
                                            if(pizzaShape){pizzaShape.destroy();}
                                            if(pizzaHealthBar){pizzaHealthBar.destroy();}
                                            //deduct lives for left a pizza uncut

                                        }else{
                                            //reset slice information
                                            PizzaBodyRef[i].sliceEntry={};
                                            PizzaBodyRef[i].sliceExit={};
                                        }


                                        

                                    }
                                }
                            
                           }

                           //update fragment movement as well

                           for (let i = PizzaFragmentBodyRef.length - 1; i >= 0; --i) {
                                const fragShape = PizzaFragmentRef.findOne(node => node.getAttr("pId") == PizzaFragmentBodyRef[i].pId);
                                if (fragShape) {
                                    fragShape.x(PizzaFragmentBodyRef[i].position.x);
                                    fragShape.y(PizzaFragmentBodyRef[i].position.y);
                                    fragShape.rotation(PizzaFragmentBodyRef[i].angle * 180 / Math.PI);
                                }
                                if (PizzaFragmentBodyRef[i].position.y > 2800) {
                                    Matter.Composite.remove(engineRef.current.world, PizzaFragmentBodyRef[i]);
                                    PizzaFragmentBodyRef.splice(i, 1);
                                    if (fragShape) { fragShape.destroy(); }

                                }
                            }

                            


                            //sync to canva
                            SkRef.x(SkBodyRef.position.x);
                            SkRef.y(SkBodyRef.position.y);



                            //update skVeclocity and position info
                            SkBodyRef.skPreviousPosition={x:SkBodyRef.position.x,y:SkBodyRef.position.y};
                            SkBodyRef.skPreviousVelocity={...SkBodyRef.skCurrentVelocity};


                            //update skTrail
                            // update trail
                            const trail = skTrailPoints.current;
                            trail.push(SkBodyRef.position.x, SkBodyRef.position.y);
                            if (trail.length > TRAIL_LENGTH * 2) {
                                trail.splice(0, 2); // remove oldest point (x,y pair)
                            }

                            
                            if (TrailRef) {
                                TrailRef.points([...trail]);

                                // fade opacity based on speed
                                const speed = Math.sqrt(
                                    SkBodyRef.skCurrentVelocity.x ** 2 +
                                    SkBodyRef.skCurrentVelocity.y ** 2
                                );
                                TrailRef.opacity(Math.min(speed / 30, 0.85));
                            }




                        


                    }


                });
                anim.start();

                return ()=>{anim.stop}
            }
        }

    },[styleDisplay?.display,displayCameraRequest,
        skLv1Img,skLv2Img,skLv3Img,skLv4Img,
        pizza1Img,pizza2Img,pizza3Img,pizza4Img,pizza5Img,pizza6Img,pizza7Img
    ]);




    return(<div style = {{...styleDisplay,
        
        transform: `translateX(-50%) translateY(-50%) scaleX(${ scaleFactor.current}) scaleY(${ scaleFactor.current}) `,
        backgroundImage:`url(${backgroundArray[randomBackgroundIndex.current]})`
    }}
    className = {styles.gameWorld}
    tabIndex="0"
    >
        {/*loading gear  */}
        <div style = {{display:displayLoadingScreen?"flex":"none"}}
            className={styles.loadingScreen}>
                <img src = {loadingGear}></img>
                <h1>loading {loadingDots}</h1>

        </div>

        {/* Camera prompt when page is visible and camera not yet enabled */}
        {styleDisplay?.display === 'flex' && !webcamReady && displayCameraRequest && (
            <div className={styles.cameraPrompt} >
                <p>This game uses your camera for hand tracking.</p>
                <button
                    type="button"
                    className={styles.enableCameraButton}
                    onClick={requestCamera}
                    disabled={cameraRequesting}
                >
                    {cameraRequesting ? 'Opening camera… 📷' : 'Enable camera 📷'}
                </button>
                <button
                type = "button"
                className = {styles.enableCameraButton}
                style = {{backgroundColor:'red'}}
                onClick = {()=>{
                    setDisplayCameraRequest(false);
                    setControlMode("mouse");
                }}
                disabled={cameraRequesting}>
                    No, use mouse control 🖱️
                </button>
            </div>
        )}

        {/* Stage + Layer for Konva.Animation game loop (hand detection runs on each frame) */}
        <Stage ref={stageRef} width={2500} height={2000} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "auto" }}>
           
           <Layer ref={pizzaFragmentRef}></Layer>
           <Layer ref = {pizzaRef}></Layer>
           <Layer ref = {pizzaHealthRef}></Layer>
           

            <Layer>
                <Line ref={skTrailRef}
                    points={[]}
                    
                    strokeWidth={30}
                    lineCap="round"
                    lineJoin="round"
                    opacity={0.5}
                    tension={0.3}
                />
           <Image ref = {skRef}
           width = {190}
           height = {190}
           offsetX = {95}
           offsetY={95}
           image = {skImgArr[skNumber.current-1]}></Image>
           </Layer>





        </Stage>

        {/* Webcam feed for MediaPipe Hand Landmarker; mirrored for natural feel */}
        <div className={styles.webcamContainer} >
            <video
                ref={videoRef}
                className={styles.webcamVideo}
                playsInline
                muted
                style={{ transform: "scaleX(-1)" }}
            />
            {handModelError && <p className={styles.handError}>{handModelError}</p>}
            {webcamReady && (
                <div className={styles.handDemoOverlay}>
                    {handResultUi
                        ? `Hands: ${handResultUi.landmarks.length} | Landmarks per hand: ${handResultUi.landmarks[0]?.length ?? 0}`
                        : "Show hand(s) to camera"}
                </div>
            )}
        </div>



            {/*status bar */}
            <div className={styles.statusDisplay}>
                <div className = {styles.hpDisplayPanel}>
                    <img src={playerHp}></img>
                    {currentHp<=3?<h1 className={styles.hpCritical}>{currentHp}</h1>:<h1 className={styles.hpHealthy}>{currentHp}</h1>}
                </div>
                <div className = {styles.coinDisplayPanel}>
                        <img src={speedCoins}></img>
                        <h1>{coinAddTotal}</h1>
                </div>
                <div className={styles.scoreDisplayPanel}>
                        <h1>Score: {scoreTotal}</h1>
                </div>
                


            </div>

           {coinAddDisplay&&
                <div className={styles.coinPopout}>
                    <img src={speedCoins}></img>
                    <h1>+{coinAddDisplay}</h1> 
                </div>}

            <div className={styles.gameOverScreen}
                        style={{display:isGameOver?'flex':'none'}}>
                            <h1>Game Over 😭</h1>
                            <h1>highest Score {scoreTotal}</h1>
                            <button className={styles.exitGameButton}
                            onClick={()=>{
                                switchPage(1);
                            }}>exit</button>
                           
                        </div>
            
                <div className={styles.gamePausedScreen}
                 style={{display:isGamePaused&&!isGameOver?'flex':'none'}}>
                        <h1>Game Paused 🤔</h1>
                        <button className={styles.resumeGameButton}
                        onClick={()=>{
                            setIsGamePaused(false);
                              
                        }}>resume 💪</button>
                        <button className={styles.exitGameButton}
                         onClick={()=>{
                            switchPage(1);
                         }}>exit Game ❌</button>
                </div>

                <button className={styles.pauseGameButton}
                            onClick={()=>{
                                setIsGamePaused(true);
                            }}>X</button>












    </div>);
}
export default pizzaSlicerGamePage;