import { useState,useEffect,useRef,useMemo } from "react"
import { Stage, Layer, Circle, Group, Image,Rect } from 'react-konva';
import Konva from "konva";
import styles from './ballClutchGamePage.module.css'
import useImage from 'use-image';

import Matter from 'matter-js';

import background1 from '../images/ballClutchGameImg/ballGameBackground1.jpg';
import background2 from '../images/ballClutchGameImg/ballGameBackground2.jpg';
import background3 from '../images/ballClutchGameImg/ballGameBackground3.jpg';
import background4 from '../images/ballClutchGameImg/ballGameBackground4.jpg';
const backgroundArray = [background1,background2,background3,background4];

import ball1 from '../images/ballClutchGameImg/ballNo1.png';
import ball2 from '../images/ballClutchGameImg/ballNo2.png';
import ball3 from '../images/ballClutchGameImg/ballNo3.png';
import ball4 from '../images/ballClutchGameImg/ballNo4.png';
const isDev = import.meta.env.VITE_MODE === 'DEV';


import borderSideTexture from '../images/ballClutchGameImg/borderSide.png';
import borderBottomTexture from '../images/ballClutchGameImg/borderBottom.png';

//moving platform texture
import stoneTexture from '../images/ballClutchGameImg/stoneTexture.png';
import stickyTexture from '../images/ballClutchGameImg/stickyTexture.png';
import iceTexture from '../images/ballClutchGameImg/iceTexture.png';

import speedCoins from '../images/towerGameImg/speedCoin.png';

//collision filter masks
//you can adjust these to fine tune collision detection
const BALL_CATEGORY = 0x0001;
const WALL_CATEGORY = 0x0002;
const PLATFORM_CATEGORY = 0x0004;


function BallClutchGamePage({switchPage,styleDisplay}){
    //state variables for game page related button and game over page display
    const randomBackgroundIndex = useRef(Math.floor(Math.random()*backgroundArray.length));
    const [isGameOver,setIsGameOver] = useState(false);
    const isGameOverRef = useRef(false);

    const[isGamePaused,setIsGamePaused] = useState(false);
    const isGamePausedRef = useRef(false);
    useEffect(()=>{
        isGamePausedRef.current=isGamePaused;
    },[isGamePaused]);


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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/ballGame/updateScore`,{
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


    useEffect(()=>{
        isGameOverRef.current = isGameOver;
        if(isGameOver){
            setIsGamePaused(false);
            //save and fetch scores
            const newScore = scoreTotal;
            saveAndGetScore(newScore);

        }
    },[isGameOver]);

    const [coinAdd,setCoinAdd] = useState(0);
    const [scoreTotal,setScoreTotal] = useState(0);
    const [coinAddTotal,setCoinAddTotal]=useState(0);

    const[coinAddDisplay,setCoinAddDisplay]=useState(0);

    useEffect(()=>{
        const tempAdd = coinAdd;
         setCoinAddDisplay(0);
        setTimeout(()=>{setCoinAddDisplay(tempAdd)},10);
        if(coinAdd>=300){
    
            setCoinAdd(s=>0);
            //trigger a fetch to add coins  
            saveCoins(tempAdd);

        }

    },[coinAddTotal]);

    const[countdown,setCountdown]=useState(5);


        
    //for a,d,w control
    const keysPressed = useRef({
    a: false,
    d: false,
    w: false
    });


    //end of a,d,w control related code

    const jumpController = useRef(null);
    const isFirstLoad = useRef(true);

    //image imports
    const [ball1Img] = useImage(ball1);
    const [ball2Img] = useImage(ball2);
    const [ball3Img] = useImage(ball3);
    const [ball4Img] = useImage(ball4);
    const ballImgArray = [ball1Img,ball2Img,ball3Img,ball4Img];

    const [borderSideImg]= useImage(borderSideTexture);
    const [borderBottomImg] = useImage(borderBottomTexture);

    const [stoneTextureImg] = useImage(stoneTexture);
    const [stickyTextureImg] = useImage(stickyTexture);
    const [iceTextureImg] = useImage(iceTexture);
    const platformTextureArray = [stoneTextureImg,stickyTextureImg,iceTextureImg];


    //game related images and mechanics
    const ballNumber = useRef(null);
    const ballConfigArr = useRef(null);
    const platformConfigArr = useRef(null);


    //the main game element
    const ballRef = useRef(null);
    const movingPlatformRef = useRef(null);

    const gameDifficulty = useRef(1);
    const platformHeight = useRef(1800);
    const currentSpawnPiviot = useRef(1);
    

    //matter.js related variables
    const engineRef = useRef(Matter.Engine.create());
    const ballBodyRef = useRef(null);
    const platfromSideRef = useRef(null);
    const platformBottomRef = useRef(null);
    const movingPlatformBodyRef = useRef(null);
    //the ghost collision detector
    const ballSensorRef = useRef(null);

    //unique id generator !!super important
    const pIdCounter = useRef(0);


    function handleBallControl(e){
        const key = e.key.toLowerCase();
            if (['a', 'd', 'w'].includes(key)) {
            keysPressed.current[key] = true;
        }

       
        //mark here
    }
    function handleKeyUp(e){
        const key = e.key.toLowerCase();
        if (['a', 'd', 'w'].includes(key)) {
            keysPressed.current[key] = false;
        }
    }

    useEffect(()=>{
        if(styleDisplay.display === 'flex'){


            if(jumpController.current){
                jumpController.current.focus();
            }

            async function LoadGameSetting(){
                try{
                    let response = await fetch(`${import.meta.env.VITE_API_URL}/ballGame/getSelectedBall`,{credentials:'include'});
                    if(response.ok){
                        const result1 = await response.json();
                        const data1 = result1.data;
                        if(isDev){console.log("selected ball data",data1)}
                        for(let i=0;i<data1?.length;i++){
                            if(data1[i]===2){
                                ballNumber.current = i+1;
                                break;
                            }
                        }

                        //only load game setting if the user is there
                        response = await fetch(`${import.meta.env.VITE_API_URL}/ballGame/getBallGameSetting`,{credentials:'include'});
                        if(response.ok){
                            const result2 = await response.json();
                            const data2 = result2.data;
                            if(isDev){console.log("game setting data",data2)}
                            ballConfigArr.current = [...data2];
                            //if sucessfully fetch, this give premission to
                            //initilize the matter.js body and other related game mechanics
                            const ballFriction = ballConfigArr.current[ballNumber.current-1]?.friction;
                            const ballRadius = ballConfigArr.current[ballNumber.current-1]?.width/2;
                            const ballDensity = ballConfigArr.current[ballNumber.current-1]?.density;
                            ballBodyRef.current = Matter.Bodies.circle(750,100,ballRadius,{
                                restitution:0.02,
                                friction:ballFriction,
                                density:ballDensity,
                                label:'ball',
                                collisionFilter: {
                                    category: BALL_CATEGORY,
                                    mask: WALL_CATEGORY | PLATFORM_CATEGORY //collide with wall and platform
                                },

                                frictionStatic: 0
                            });
                            //added code for ball sensor
                            ballSensorRef.current = Matter.Bodies.circle(750,100,ballRadius+10,{
                                isSensor:true,
                                label:'ballSensor',
                                isStatic:false,
                                collisionFilter: {
                                    category: BALL_CATEGORY,
                                    mask: PLATFORM_CATEGORY //collide only with platform
                                }
                            });
                            //end of added code for ball sensor


                            platfromSideRef.current=[
                                Matter.Bodies.rectangle(35,1000,70,2000,{isStatic:true,friction:0,frictionStatic: 0,restitution: 0,slop: 0,
                                    label:'leftSideWall',
                                    collisionFilter: {
                                        category: WALL_CATEGORY,
                                        mask: BALL_CATEGORY //collide only with ball
                                    }
                                }),
                                Matter.Bodies.rectangle(1465,1000,70,2000,{isStatic:true,friction:0,frictionStatic: 0,restitution: 0,slop: 0,
                                    label:'rightSideWall',
                                    collisionFilter: {
                                        category: WALL_CATEGORY,
                                        mask: BALL_CATEGORY //collide only with ball
                                    }
                                }),
                                Matter.Bodies.rectangle(750,35,1500,70,{isStatic:true,friction:0,frictionStatic: 0,restitution: 0,slop: 0,
                                    label:'topWall',
                                    collisionFilter: {
                                        category: WALL_CATEGORY,
                                        mask: BALL_CATEGORY //collide only with ball
                                    }
                                })
                            ];
                            platformBottomRef.current = Matter.Bodies.rectangle(750,1925,1500,150,{isStatic:true,friction:999,label:'bottomWall',
                                collisionFilter: {
                                    category: WALL_CATEGORY,
                                    mask: BALL_CATEGORY //collide only with ball
                                }
                            });

                            
                            Matter.Composite.add(engineRef.current.world,[ballSensorRef.current,ballBodyRef.current,...platfromSideRef.current,platformBottomRef.current]);

                                response = await fetch(`${import.meta.env.VITE_API_URL}/ballGame/getPlatformSetting`,{credentials:'include'});
                                if(response.ok){
                                    const result3 = await response.json();
                                    const data3 = result3.data;
                                    if(isDev){console.log("platform setting data",data3)}
                                    platformConfigArr.current = [...data3];

                                    movingPlatformBodyRef.current=[];
                                }

                            }

                    }
                    


                }catch(error){
                    if(isDev){console.log("error loading game setting",error)}
                }
            }

            


            if(isFirstLoad.current){
                LoadGameSetting();
                
                isFirstLoad.current=false;
            }


            const anim = new Konva.Animation((frame)=>{
                //debug
                

                //mega game loop
                const lastFrame = frame.time-frame.timeDiff;

                const keyPressRate = 50;
                const updateKeyPress = Math.floor(frame.time/keyPressRate)>Math.floor(lastFrame/keyPressRate);

                const updateGameStatusRate = 200;
                const isUpdateGameStatusTime = Math.floor(frame.time/updateGameStatusRate)>Math.floor(lastFrame/updateGameStatusRate);

                //these are for knova visual update, do not confuse with matter.js body reference, which is used for physics engine calculation
                const BallRef = ballRef.current;
                const MovingPlatformRef = movingPlatformRef.current;
                
                if(!BallRef||!MovingPlatformRef){return;}

                const BallNumber = ballNumber.current;
                const BallConfigArr = ballConfigArr.current;
                const PlatformConfigArr = platformConfigArr.current;

                //physics engine related
                const BallBodyRef = ballBodyRef.current;
                const MovingPlatformBodyRef= movingPlatformBodyRef.current;
                const BallSensorRef = ballSensorRef.current;
                
                

                
                let GameDifficulty = gameDifficulty.current;
                const difficultyIncreaseRate = 15000;


                //decides wether to spawn a new platform
                


                const platformChoiceRange =Math.min(PlatformConfigArr?PlatformConfigArr.length:1,Math.floor(GameDifficulty/3)+1);
                const randomPlatformIndex = Math.floor(Math.random()*platformChoiceRange);

                //decides wether to increase difficulty
                const isDifficultyIncreaseTime = Math.floor(frame.time/difficultyIncreaseRate)>Math.floor(lastFrame/difficultyIncreaseRate);
                
                const currentPlatformVelocity = Math.min(2+Math.floor(GameDifficulty/5),6);

                const movingPlatfromSpawnRate = Math.max(4500-Math.floor(GameDifficulty/5)*200,3500);
                const isSpawnPlatformTime = Math.floor(frame.time/movingPlatfromSpawnRate)>Math.floor(lastFrame/movingPlatfromSpawnRate);
                

                
               
                
                if(BallNumber&&BallConfigArr&&PlatformConfigArr&&!isGameOverRef.current&&!isGamePausedRef.current){
                    Matter.Engine.update(engineRef.current,1000/60);





                    //starting countdown
                    const isCountdown = (Math.floor(frame.time/1000)>Math.floor(lastFrame/1000)&&frame.time<=10000);
                    if(isCountdown){
                        setCountdown(c=>{
                            if(c>0){c--;}
                            return c;
                        });
                    }


                    //increase difficulty
                    if(isDifficultyIncreaseTime){
                        GameDifficulty++;
                        gameDifficulty.current = GameDifficulty;
                        if(isDev){console.log("difficulty increased",GameDifficulty)}


                    }

                    if(isSpawnPlatformTime){
                        
                        pIdCounter.current++;

                        const movingPlatformWidthAvg = Math.max(700-10*GameDifficulty,320);
                        const widthVariance = Math.max(100-5*GameDifficulty,20);
                        const platfromId = frame.time;
                        
                        
                        let directionDecider = Math.floor(Math.random()*2)+1;
                        let platformHeightDivergence;
                        let platformVelocity=currentPlatformVelocity;
                        let platformAngleDeg = Math.floor(Math.random()*25);
                        
                        
                        
                        if(directionDecider===1){
                            platformHeightDivergence = 500;
                        }else{
                            platformHeightDivergence = -500;
                        }
                        directionDecider = Math.floor(Math.random()*2)+1;
                        if(directionDecider===1){
                            platformAngleDeg = -platformAngleDeg;
                        }else{
                            platformAngleDeg = platformAngleDeg;
                        }
                        let platformY = platformHeight.current+platformHeightDivergence;
                        if(platformY>1800){platformY=1800;}
                        if(platformY<800){platformY=800;}
                        platformHeight.current = platformY;

                        let platformWidth = movingPlatformWidthAvg;
                        directionDecider = Math.floor(Math.random()*2)+1;
                        if(directionDecider===1){
                            platformWidth+= Math.floor(Math.random()*widthVariance);

                        }else{
                            platformWidth-= Math.floor(Math.random()*widthVariance);

                        }

                        let platformX=0;

                        //for platforms, the direction is a little bit tricky, see the follow
                        directionDecider = Math.floor(Math.random()*5)+1;
                        let CurrentSpawnPivot = currentSpawnPiviot.current;
                        if(CurrentSpawnPivot===1){CurrentSpawnPivot=4;}else{CurrentSpawnPivot=1;}
                        currentSpawnPiviot.current = CurrentSpawnPivot;
                        if(directionDecider<=CurrentSpawnPivot){
                            //spawn from left
                            platformVelocity=5;
                            platformX=-platformWidth/2;
                        }else{
                            //spawn from right
                            platformVelocity=-5;
                            platformX=1500+platformWidth/2;
                        }















                        const newPlatformInstance = Matter.Bodies.rectangle(platformX,platformY,platformWidth,60,{
                            isStatic:true,
                            friction:PlatformConfigArr[randomPlatformIndex].friction,
                            frictionStatic:PlatformConfigArr[randomPlatformIndex].friction,
                            angle:platformAngleDeg*Math.PI/180,
                            label:'movingPlatform',
                            velocityCustom:{x:platformVelocity,y:0},
                            hasBeenReached:false,
                            pId:pIdCounter.current,
                            collisionFilter: {
                                category: PLATFORM_CATEGORY,
                                mask: BALL_CATEGORY //collide only with ball
                            }
                        });
                        MovingPlatformBodyRef.push(newPlatformInstance);
                        //debug purpose
                        if(isDev){console.log("spawn new platform",MovingPlatformBodyRef)}

                        Matter.Composite.add(engineRef.current.world,newPlatformInstance);
                        

                        
                        const newPlatform = new Konva.Rect({
                            x:platformX,
                            y:platformY,
                            width:platformWidth,
                            height:60,
                            
                            fillPatternImage:platformTextureArray[randomPlatformIndex],
                            fillPatternScale:{x:0.5,y:0.5},
                            offsetX:platformWidth/2,
                            offsetY:30,
                            rotation:platformAngleDeg,
                            pId:pIdCounter.current,
                            
                            stroke: 'yellow',      
                            strokeWidth: 8

                        });
                        MovingPlatformRef.add(newPlatform);
                        

                        

                    }

                    //new way to handle key event, 0 delay
                    if(updateKeyPress){
                        if(keysPressed.current['w']||keysPressed.current['a']||keysPressed.current['d']){
                        const body = ballBodyRef.current;
                        const sensorBody = ballSensorRef.current;
                        const ballRadius = ballConfigArr.current[ballNumber.current-1]?.width/2;
                        

                        //big change here, check collision with sensor body instead of the main 
                        // ball body, this is to prevent the issue where the player can only jump when 
                        // the ball is perfectly aligned with the platform, which is very hard to achieve 
                        // and makes the game less fun, with the sensor body, as long as the ball is close 
                        // enough to the platform, it can jump, which makes the game more enjoyable and less frustrating
                        const collisionList = Matter.Query.collides(sensorBody,[...platfromSideRef.current,platformBottomRef.current,...movingPlatformBodyRef.current]);
                        //if(isDev){console.log("collision list",collisionList)}
                        const isCollided = collisionList.length>0;
                        
                        
                        switch (true){
                            case keysPressed.current['w']:
                                if(isCollided){
                                    let forceVector = {x:0,y:0};
                                    //let forcePosition = {x:body.position.x,y:body.position.y}
                                    for(let i=0;i<collisionList.length;i++){
                                        if(collisionList[i].bodyA.label ==='ballSensor'&&collisionList[i].bodyB.label ==='movingPlatform'){
                                            forceVector = {...collisionList[i].normal};
                                            forceVector.x*=-15;
                                            forceVector.y*=-15;
                                            Matter.Body.setVelocity(body,{x:body.velocity.x,y:-25});
                                            Matter.Body.setPosition(body,{x:body.position.x,y:body.position.y-5});
                                            break;

                                        }else if(collisionList[i].bodyB.label ==='ballSensor'&&collisionList[i].bodyA.label ==='movingPlatform'){
                                            forceVector = {...collisionList[i].normal};
                                            forceVector.x*=15;
                                            forceVector.y*=15;
                                            Matter.Body.setVelocity(body,{x:body.velocity.x,y:-25});
                                            Matter.Body.setPosition(body,{x:body.position.x,y:body.position.y-5});
                                            break;
                                        }
                                    }

                                    
                                }


                                break;
                            case keysPressed.current['a']:
                                if(isCollided){
                                    let forceVector = {x:-0.3,y:0};
                                    let forcePosition = {x:body.position.x,y:body.position.y-ballRadius}
                                    for(let i=0;i<collisionList.length;i++){
                                        if(collisionList[i].bodyA.label ==='leftSideWall'||
                                        collisionList[i].bodyB.label ==='leftSideWall'
                                        ){
                                            forceVector.x=2;
                                            forceVector.y=0;

                                        }
                                    }
                                    Matter.Body.applyForce(body,forcePosition,forceVector);
                                }else{
                                    Matter.Body.applyForce(body,{x:body.position.x,y:body.position.y-ballRadius},{x:-0.3,y:0});
                                }
                                break;
                            case keysPressed.current['d']:
                                if(isCollided){
                                    let forceVector = {x:0.3,y:0};
                                    let forcePosition = {x:body.position.x,y:body.position.y-ballRadius}
                                    for(let i=0;i<collisionList.length;i++){
                                        if(collisionList[i].bodyA.label ==='rightSideWall'||
                                        collisionList[i].bodyB.label ==='rightSideWall'
                                        ){
                                            forceVector.x=-2;
                                            forceVector.y=0;

                                        }
                                    }
                                    Matter.Body.applyForce(body,forcePosition,forceVector);
                                }else{
                                    Matter.Body.applyForce(body,{x:body.position.x,y:body.position.y-ballRadius},{x:0.3,y:0});
                                }
                                break;
                            
                            default: break;
                        }

                    }
                    }





                    //update moving platform position visually and physically
                    for(let i=0;i<MovingPlatformBodyRef.length;i++){
                        const platformBody = MovingPlatformBodyRef[i];
                        Matter.Body.setPosition(platformBody,{x:platformBody.position.x+platformBody.velocityCustom.x
                            ,y:platformBody.position.y});
                        //debug
                        //console.log([platformBody.position.x,platformBody.position.y,platformBody.pId]);


                        const platformShape = MovingPlatformRef.findOne(node=>node.getAttr('pId') === platformBody.pId);
                        if(platformShape){
                            
                            platformShape.x(platformBody.position.x);
                            platformShape.y(platformBody.position.y);
                        }
                    }

                    //deal with add coins when user jump to a new platform or game over when fall to the bottom
                    if(isUpdateGameStatusTime){
                        const collisionList = Matter.Query.collides(BallSensorRef,[platformBottomRef.current,...movingPlatformBodyRef.current]);
                        const isCollided = collisionList.length>0;
                        if(isCollided){
                            for(let i=0;i<collisionList.length;i++){
                                if(collisionList[i].bodyA.label==='ballSensor'){
                                    if(collisionList[i].bodyB.label==='bottomWall'){
                                        //game is over
                                        if(isDev){console.log("game over")}
                                        //froze the game
                                        setIsGameOver(true);

                                        break;
                                    }else if(collisionList[i].bodyB.label==='movingPlatform'){
                                        //add coins and scores
                                        if(!collisionList[i].bodyB.hasBeenReached){
                                            collisionList[i].bodyB.hasBeenReached=true;
                                            if(isDev){console.log('has reached here')}
                                            setScoreTotal(s=>s+50+Math.min(GameDifficulty*2,100));
                                            setCoinAdd(s=>s+150+Math.min(GameDifficulty*5,1000));
                                            setCoinAddTotal(s=>s+150+Math.min(GameDifficulty*5,1000));

                                        }
                                        break;
                                    }

                                }else if(collisionList[i].bodyB.label==='ballSensor'){
                                    if(collisionList[i].bodyA.label==='bottomWall'){
                                        //game is over
                                        if(isDev){console.log("game over")}
                                        //froze the game
                                        setIsGameOver(true);



                                        break;
                                    }else if(collisionList[i].bodyA.label==='movingPlatform'){
                                        //add coins and scores
                                        if(!collisionList[i].bodyA.hasBeenReached){
                                            collisionList[i].bodyA.hasBeenReached=true;
                                            if(isDev){console.log('has reached here')}
                                            setScoreTotal(s=>s+50+Math.min(GameDifficulty*2,100));
                                            setCoinAdd(s=>s+150+Math.min(GameDifficulty*5,1000));
                                            setCoinAddTotal(s=>s+150+Math.min(GameDifficulty*5,1000));

                                        }


                                        break;
                                    }
                                }

                            }
                        }
                    }
                    


                    //remove off screen platform
                    
                    
                    for(let i=MovingPlatformBodyRef.length-1;i>=0;i--){
                        const platform = MovingPlatformBodyRef[i];
                        if(platform.position.x<-1500||platform.position.x>3000){
                            
                            Matter.Composite.remove(engineRef.current.world,platform);
                            MovingPlatformBodyRef.splice(i,1);

                            const shapeToRemove = MovingPlatformRef.findOne(node=>node.getAttr('pId') === platform.pId);
                            if(shapeToRemove) {shapeToRemove.destroy();}

                        }
                    }


                    //froze for the first 3 seconds to let the player get ready
                    if(frame.time<=5000){
                        Matter.Body.setPosition(BallBodyRef,{x:750,y:200});
                        Matter.Body.setVelocity(BallBodyRef,{x:0,y:0});
                        Matter.Body.setAngularVelocity(BallBodyRef,0);
                        Matter.Body.setAngle(BallBodyRef,0);
                    }
                    

                    

                    //update konva position to match body position
                    
                    BallRef.x(BallBodyRef.position.x);
                    BallRef.y(BallBodyRef.position.y);
                    BallRef.rotation(BallBodyRef.angle*180/Math.PI);

                    //synchronize the ball sensor with the ball body
                    Matter.Body.setPosition(BallSensorRef,{x:BallBodyRef.position.x,y:BallBodyRef.position.y});
                    Matter.Body.setAngle(BallSensorRef,0);



                    
                    MovingPlatformRef.batchDraw();

                   
                    
                }
            }
        );
            anim.start();

            return ()=>{
                anim.stop();
            }

        }
    },[styleDisplay,
        ball1Img,
        ball2Img,
        ball3Img,
        ball4Img,

        borderSideImg,
        borderBottomImg,

        stoneTextureImg,
        stickyTextureImg,
        iceTextureImg
    ])


    return(
        <div style={{...styleDisplay,
        backgroundImage:`url(${backgroundArray[randomBackgroundIndex.current]})`}}
        className={styles.gameWorld}
        tabIndex="0" onKeyDown={handleBallControl} onKeyUp={handleKeyUp} ref={jumpController}>
            
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
                    jumpController.current.focus();
                }}>resume 💪</button>
                <button className={styles.exitGameButton}
                onClick={()=>{
                    switchPage(1);
                }}>exit Game ❌</button>
            </div>

            <div className = {styles.coinDisplayPanel}>
                <img src={speedCoins}></img>
                <h1>{coinAddTotal}</h1>
            </div>

            <div className={styles.scoreDisplayPanel}>
                <h1>{scoreTotal}</h1>
            </div>

            <button className={styles.pauseGameButton}
            onClick={()=>{
                setIsGamePaused(true);
            }}>X</button>

            {coinAddDisplay&&
            <div className={styles.coinPopout}>
               <img src={speedCoins}></img>
               <h1>+{coinAddDisplay}</h1> 
            </div>}

            {countdown&&
            <div className={styles.countdownPanel}
            key={countdown}>
                <h1>{countdown}</h1>
            </div>}
            
            <Stage width={1500} height={2000}>


                <Layer ref={movingPlatformRef}></Layer>

                <Layer>
                    <Rect x={0} y={2050}
                    width={1500}
                    height={150}
                    offsetY={150}
                    scaleY={3}
                    fillPatternImage={borderBottomImg}
                    fillPatternScale={{ x: 1.2, y: 0.5 }}
                    fillPatternOffsetY={70}
                    
                    ></Rect>

                    <Rect x={0} y={0}
                    width={70}
                    height={2000}
                    fillPatternImage={borderSideImg}
                    fillPatternScale={{ x: 0.5, y: 0.5 }}></Rect>
                    <Rect x={0} y={0}
                    width={1500}
                    height={70}
                    fillPatternImage={borderSideImg}
                    fillPatternScale={{ x: 0.5, y: 0.5 }}></Rect>
                    <Rect x={1500} y={0}
                    width={70}
                    height={2000}
                    offsetX={70}
                    fillPatternImage={borderSideImg}
                    fillPatternScale={{ x: 0.5, y: 0.5 }}></Rect>
                    
                </Layer>

                <Layer>
                    <Image ref={ballRef}
                    width={220}
                    height={220}
                    offsetX={110}
                    offsetY={110}
                    image={ballImgArray[ballNumber.current-1]}></Image>
                </Layer>

                


                

            </Stage>
        </div>
    )


}

export default BallClutchGamePage;