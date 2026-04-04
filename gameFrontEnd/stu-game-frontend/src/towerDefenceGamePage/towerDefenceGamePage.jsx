import { useState,useEffect,useRef,useMemo } from "react"
import { useNavigate } from 'react-router-dom';

import styles from "./towerDefenceGamePage.module.css"
import { Stage, Layer, Circle, Group, Image as KonvaImage,Rect } from 'react-konva';
import Konva from "konva";
import useImage from 'use-image';

import loadingGear from '../images/loadingGear.png';

//texture input
import background1 from '../images/towerGameImg/towerGameBackground.png';
import background2 from '../images/towerGameImg/towerGameBackground2.png';
import background3 from '../images/towerGameImg/towerGameBackground3.png';
import background4 from '../images/towerGameImg/towerGameBackground4.png';
const backgroundArr=[background1,background2,background3,background4];
//towers:
import lv1Tower from '../images/towerGameImg/towerLv1.png';
import lv2Tower from '../images/towerGameImg/towerLv2.png';
import lv3Tower from '../images/towerGameImg/towerLv3.png';
import lv4Tower from '../images/towerGameImg/towerLv4.png';
import lv5Tower from '../images/towerGameImg/towerLv5.png';
import lv6Tower from '../images/towerGameImg/towerLv6.png';
import lv7Tower from '../images/towerGameImg/towerLv7.png';
import lv8Tower from '../images/towerGameImg/towerLv8.png';
import lv9Tower from '../images/towerGameImg/towerLv9.png';
import lv10Tower from '../images/towerGameImg/towerLv10.png';
import lv11Tower from '../images/towerGameImg/towerLv11.png';
import lv12Tower from '../images/towerGameImg/towerLv12.png';
//edit here to add more tower
//...........................


//bullets:
import lv1Bullet from '../images/towerGameImg/tower1Bullet.png';
import lv4Bullet from '../images/towerGameImg/tower4Bullet.png';
import lv6Bullet from '../images/towerGameImg/tower6Bullet.png';
import lv9Bullet from '../images/towerGameImg/tower9Bullet.png';
import lv10Bullet from '../images/towerGameImg/tower10Bullet.png';
import lv11Bullet from '../images/towerGameImg/tower11Bullet.png';
import lv12Bullet from '../images/towerGameImg/tower12Bullet.png';

const tower1X = 660,tower1Y=860,tower2X=1300,tower2Y=860,tower3X=980,tower3Y=1300;

//enemies
import lv1EnemyNormal from '../images/towerGameImg/enemyLv1.png';
import lv1EnemyTakeDmg from '../images/towerGameImg/enemyLv1TakeDmg.png';
import lv2EnemyNormal from '../images/towerGameImg/enemyLv2.png';
import lv2EnemyTakeDmg from '../images/towerGameImg/enemyLv2TakeDmg.png';
import lv3EnemyNormal from '../images/towerGameImg/enemyLv3.png';
import lv3EnemyTakeDmg from '../images/towerGameImg/enemyLv3TakeDmg.png';
import lv4EnemyNormal from '../images/towerGameImg/enemyLv4.png';
import lv4EnemyTakeDmg from '../images/towerGameImg/enemyLv4TakeDmg.png';
//import lv4EnemyDeath from '../images/towerGameImg/enemyLv4Death.png';

import enemySpawningHole from '../images/towerGameImg/enemySpawningHole.png';

//import the ash image
import lv1EnemyAsh from '../images/towerGameImg/enemyLv1Ash.png';
import lv2EnemyAsh from '../images/towerGameImg/enemyLv2Ash.png';

import lv3EnemyAsh from '../images/towerGameImg/enemyLv3Ash.png';

import lv4EnemyAsh from '../images/towerGameImg/enemyLv4Ash.png';


//coins
import speedCoins from '../images/towerGameImg/speedCoin.png'


const isDev = import.meta.env.VITE_MODE==='DEV';
const testLoadingDelay = 2000;


function TowerDefenceGamePage(){

    const navigate = useNavigate();


    /*image preload, centralized loading */
     //image pre decoder
    const preloadAndDecode = async (src) => {
        const img = new Image();
        img.src = src;
        img.decoding = 'async';
        await img.decode();
        return img; // This is now a "hot" bitmap ready for Konva
    };


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



    
    

  
  
    
    const[enemySpawningHoleImg] = useImage(enemySpawningHole);

   
    
    //edit here to add more tower

    const towerImgArr= useRef(null);
    const bulletImgArr=useRef(null);


    const enemyImgArr=useRef(null);

    const enemyAshArr =useRef(null);
    
    


    const [randomBackground,_]=useState(()=>Math.floor(Math.random()*backgroundArr.length));
  
    
    //the most important state array collections
    const [gameDifficulty ,setGameDifficulty] = useState(1);
    const gameDifficultyRef = useRef(1);
    useEffect(()=>{
        gameDifficultyRef.current = gameDifficulty?gameDifficulty:1;
    },[gameDifficulty]);

    const [showDifficuly,setShowDifficulty]=useState(false);
    //enemy buff
    
    //waiting for fetch to fill in
    const enemyAttributeArr=useRef(null);
    
   

    //enemy and bullet
    const pIdCounter = useRef(1);
    const bulletData=useRef(null);


    
    const enemyData=useRef(null);
    const enemyNodeMap = useRef(new Map());

    const enemyAshRef = useRef(null);
    
    

    

    //the actual tower body
    const tower1Body = useRef(null);
    const tower2Body = useRef(null);
    const tower3Body = useRef(null);

    //the real health and the sliding health bar


    const tower1DisplayHealth = useRef(null);
    const tower1RealHealth = useRef(null);
    const tower1Background=useRef(null);

    const tower2DisplayHealth = useRef(null);
    const tower2RealHealth = useRef(null);
     const tower2Background=useRef(null);



    const tower3DisplayHealth = useRef(null);
    const tower3RealHealth = useRef(null);
     const tower3Background=useRef(null);

    



   //ref for rotating controller
   const rotateController = useRef(null);


   //ref in the loop
   const tower1Ref =useRef(null);
   
   const tower2Ref=useRef(null);
   

   const tower3Ref=useRef(null);
   
   //enemy ref in the loop

   //state for displaying scores and coins;
   const [coinDisplay,setCoinDisplay] = useState(0);
   const coinAdd = useRef(0);
   const[coinAddDisplay,setCoinAddDisplay]=useState(null);
  
   
   
   const[scoreDisplay,setScoreDisplay]=useState(0);
   const scoreAdd = useRef(0);
   const previousHighScore=useRef(0);


   //world scaling
   const scaleFactor = useRef(window.innerHeight/1960);
  


   async function updateCoins(addAmount){
        try{
         const response = await fetch(`${import.meta.env.VITE_API_URL}/towerGame/addCoins`,{
            credentials:'include',
            method:'POST',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({
                coinAddAmount:addAmount
            })
        })
        if(response.ok){
            if(isDev){console.log('updated coins from tower defence');}
        }else{
            if(response.status===440){
                //session not found
                navigate("/login");
            }
        }
        
        }catch(error){
            if(isDev){console.log(error);}
        }
   }

    //death screen and pause screen
   const[displayGameOverScreen,setDisplayGameOverScreen]
   =useState(false);


   async function updateHighestScore(){
        try{
            const response = await fetch(`${import.meta.env.VITE_API_URL}/towerGame/updateScoreRecord`,{
                credentials:'include',
            method:'POST',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({
                newScore:scoreAdd.current
            })

            });
            if(response.ok){
                const data = await response.json();
                setScoreDisplay(s=>data.currentHighestScore);
            }else{
                if(response.status===440){
                    //session not found
                    navigate("/login");
                }
            }
            
        }catch(error){
            console.log(error);
        }


   }

   const[displayPauseScreen,setDisplayPauseScreen]
   =useState(false);




//timelimit for fetching scores;
const lastimeScoreFetched= useRef(0);

//only first load
const isFirstLoad=useRef(true);

//kill enemy lag patch
const isDisplayCoinAdd = useRef(false);
   

    
    useEffect(()=>{
        
            

           

           
            //auto focous main screen
            if(rotateController.current){
                rotateController.current.focus();
            }




            async function loadImage(){
                try{
                    setDisplayLoadingScreen(true);

                    const decodedTowerImage = await Promise.all([
                        preloadAndDecode(lv1Tower),
                        preloadAndDecode(lv2Tower),
                        preloadAndDecode(lv3Tower),
                        preloadAndDecode(lv4Tower),
                        preloadAndDecode(lv5Tower),
                        preloadAndDecode(lv6Tower),
                        preloadAndDecode(lv7Tower),
                        preloadAndDecode(lv8Tower),
                        preloadAndDecode(lv9Tower),
                        preloadAndDecode(lv10Tower),
                        preloadAndDecode(lv11Tower),
                        preloadAndDecode(lv12Tower)
                    ]);

                    towerImgArr.current = [...decodedTowerImage];

                    const [bullet1,bullet4,bullet6,bullet9,bullet10,bullet11,bullet12] = await Promise.all([
                        preloadAndDecode(lv1Bullet),
                        preloadAndDecode(lv4Bullet),
                        preloadAndDecode(lv6Bullet),
                        preloadAndDecode(lv9Bullet),
                        preloadAndDecode(lv10Bullet),
                        preloadAndDecode(lv11Bullet),
                        preloadAndDecode(lv12Bullet)

                    ])



                    bulletImgArr.current = [bullet1,bullet1,bullet1,bullet4,bullet4,bullet6,bullet6,bullet6,bullet9,bullet10,bullet11,bullet12];

                    const enemy1Img = await Promise.all([
                        preloadAndDecode(lv1EnemyNormal),
                        preloadAndDecode(lv1EnemyTakeDmg)
                    ])
                    const enemy2Img = await Promise.all([
                        preloadAndDecode(lv2EnemyNormal),
                        preloadAndDecode(lv2EnemyTakeDmg)
                    ])
                    const enemy3Img = await Promise.all([
                        preloadAndDecode(lv3EnemyNormal),
                        preloadAndDecode(lv3EnemyTakeDmg)
                    ])
                    const enemy4Img = await Promise.all([
                        preloadAndDecode(lv4EnemyNormal),
                        preloadAndDecode(lv4EnemyTakeDmg)
                    ])


                    enemyImgArr.current=[
                        [...enemy1Img,null],
                        [...enemy2Img,null],
                        [...enemy3Img,null],
                        [...enemy4Img,null]
                    ]

                    const enemyAsh = await Promise.all([
                        preloadAndDecode(lv1EnemyAsh),
                        preloadAndDecode(lv2EnemyAsh),
                        preloadAndDecode(lv3EnemyAsh),
                        preloadAndDecode(lv4EnemyAsh)

                    ]);

                    enemyAshArr.current = [...enemyAsh];


                }catch(error){
                    if(isDev){
                        console.log(error);
                    }
                }finally{
                    //loading gear tester
                    if(isDev){
                        await new Promise((resolve,reject)=>{
                            setTimeout(()=>{resolve();},testLoadingDelay);
                        });
                    }
                    setDisplayLoadingScreen(false);
                    //end of loading gear tester

                        
                }


            }





            //fetching user tower layout
            async function getUserTower(){
                try{
                setDisplayLoadingScreen(true);

                const response = await fetch(`${import.meta.env.VITE_API_URL}/towerGame/getTowerDeploy`,{credentials: 'include'});
                if(response.ok){
                    const data = await response.json(); 
                    //console.log(data);
                    if(isDev){console.log(data)}
                    //
                    tower1Ref.current=(data[0]?{...data[0]}:null)
                   tower2Ref.current=(data[1]?{...data[1]}:null)
                   tower3Ref.current = (data[2]?{...data[2]}:null)

                    //render the tower
                     
                }else{
                    if(response.status===440){
                        //session not found
                        navigate("/login");
                    }
                }
                }catch(error){
                    if(isDev){console.log(error);}

                }finally{
                    //loading gear tester
                    if(isDev){
                        await new Promise((resolve,reject)=>{
                            setTimeout(()=>{resolve();},testLoadingDelay);
                        });
                    }
                    setDisplayLoadingScreen(false);
                    //end of loading gear tester
                }
            }
            


            //fetching enemy setting
            async function getEnemy(){
                try{
                    setDisplayLoadingScreen(true);
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/towerGame/getEnemyAttribute`,{credentials: 'include'});
                    if(response.ok){
                        const data = await response.json();
                        if(isDev){console.log(data);}
                        enemyAttributeArr.current=data?[...data]:null;
                    }else{
                        if(response.status===440){
                            //session not found
                            navigate("/login");
                        }
                    }

                }catch(error){
                    if(isDev){console.log(error);}
                }finally{
                    //loading gear tester
                    if(isDev){
                        await new Promise((resolve,reject)=>{
                            setTimeout(()=>{resolve();},testLoadingDelay);
                        });
                    }
                    setDisplayLoadingScreen(false);
                    //end of loading gear tester
                }

            }
            

            //render tower
            //get user coins and highest scores
            async function getUserCoinsAndScores(){
                try{
                    setDisplayLoadingScreen(true);
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/towerGame/getCoinsAndScores`,{credentials: 'include'});
                    if(response.ok){
                        const data = await response.json();
                        previousHighScore.current = data.highestScoreRecord;
                        
                    }else{
                        if(response.status===440){
                            //session not found
                            navigate("/login");
                        }
                    }

                }catch(error){
                    if(isDev){console.log(error);}
                }finally{
                    //loading gear tester
                    if(isDev){
                        await new Promise((resolve,reject)=>{
                            setTimeout(()=>{resolve();},testLoadingDelay);
                        });
                    }
                    setDisplayLoadingScreen(false);
                    //end of loading gear tester
                }

            }
            
            
        if(isFirstLoad.current){
            isFirstLoad.current=false;

            getUserTower();
            getEnemy();
            getUserCoinsAndScores();
            loadImage();

        }  

        
            
        const anim = new Konva.Animation((frame)=>{
            //mega game loops
            let rerenderTower = false;
            

            let Tower1Ref = tower1Ref.current;
            let Tower2Ref = tower2Ref.current;
            let Tower3Ref=tower3Ref.current;
            

            const BulletDataRef = bulletData.current;

            const EnemyAshRef = enemyAshRef.current;
            

            //enemy
            const EnemyAttributeArr = enemyAttributeArr.current;
            const EnemySpawnRate = Math.max(3000-gameDifficultyRef.current*100,2000);

            const EnemySpawnAmount = gameDifficultyRef.current>4?4:gameDifficultyRef.current;
            
            
            
            const EnemyBodyRef = enemyData.current;
            const EnemyNodeMap = enemyNodeMap.current;
            

            const EnemyLevelRange= Math.min(gameDifficultyRef.current,4);

            
            const TowerImgArr = towerImgArr.current;
           
            if (!BulletDataRef || !EnemyBodyRef||!TowerImgArr||!EnemyAshRef||!bulletImgArr.current||!enemyImgArr.current||!enemyAshArr.current) {return; }
            if(!tower1Body.current||!tower2Body.current||!tower3Body.current){return;}
            if(!tower1DisplayHealth.current||!tower1RealHealth.current||!tower2DisplayHealth.current||!tower2DisplayHealth.current||!tower3DisplayHealth.current||!tower1RealHealth.current)return;
            if(!tower1Background.current||!tower2Background.current||!tower3Background.current){return;}



            //mount images

            if(!tower1Body.current.image()){tower1Body.current.image(Tower1Ref===null?null:TowerImgArr[Tower1Ref.towerLevel-1])}
             if(!tower2Body.current.image()){tower2Body.current.image(Tower2Ref===null?null:TowerImgArr[Tower2Ref.towerLevel-1])}
              if(!tower3Body.current.image()){tower3Body.current.image(Tower3Ref===null?null:TowerImgArr[Tower3Ref.towerLevel-1])}

            //test
            
             
            //frame calculation
            const lastFrame = frame.time-frame.timeDiff;
            

           
            


            //increase difficulty
            const difficultyIncreaseFrequency = 60000;
            const isIncreaseDifficulty = Math.floor(frame.time/difficultyIncreaseFrequency)>Math.floor(lastFrame/difficultyIncreaseFrequency);
            if(isIncreaseDifficulty){
                setShowDifficulty(s=>false);
                
                setGameDifficulty(g=>g+1);
                setTimeout(()=>{setShowDifficulty(s=>true)},500);
                gameDifficultyRef.current+=1;
                if(isDev){console.log(gameDifficultyRef.current);}

            }
            const enemyHealthBuffer = Math.min(gameDifficultyRef.current**2.5,12000);
            const enemyDamageBuffer = Math.min(gameDifficultyRef.current*4,1000);

            

                //batch save coins to db
                
                if(coinAdd.current>=600){
                    let temp = coinAdd.current;

                    setCoinAddDisplay(c=>null);
                    setTimeout(()=>{setCoinAddDisplay(c=>temp);
                        
                    },5);
                    coinAdd.current=0;
                    
                    updateCoins(temp);
                    

                    isDisplayCoinAdd.current=true;

                    
                   
                    

                }
               
                

                //check if all towers are destroyed and game over
                if(!Tower1Ref&&!Tower2Ref&&!Tower3Ref&&frame.time>10000){
                    if(Date.now()-lastimeScoreFetched.current>5000){
                    
                    lastimeScoreFetched.current=Date.now();
                    setDisplayGameOverScreen(g=>true);
                    updateHighestScore();
                    }


                }

                //sync tower health bar, and do sliding animaton

                if(Tower1Ref){
                    tower1RealHealth.current.width(250*Tower1Ref.towerCurrentHp/Tower1Ref.towerHp);
                    //chaneg hp bar color base on health remianing
                    if(tower1RealHealth.current.width()>180){
                        tower1RealHealth.current.fill("green")
                    }else if(tower1RealHealth.current.width()>50){
                        tower1RealHealth.current.fill("orange")
                    }else{
                        tower1RealHealth.current.fill("red")
                    }
                    tower1Body.current.rotation(Tower1Ref.towerAngleInitial+Tower1Ref.towerAngle);
                    tower1Background.current.width(266);
                    tower1Background.current.strokeWidth(8);
                    //sliding hp bar animation
                    if(Tower1Ref.towerDisplayHp>Tower1Ref.towerCurrentHp){
                        const newHp = Math.max(0,Tower1Ref.towerDisplayHp-5.2);
                        Tower1Ref.towerDisplayHp=newHp;
                        tower1DisplayHealth.current.width(250*Tower1Ref.towerDisplayHp/Tower1Ref.towerHp);
                    }

                    
                }else{
                    //clear visual when tower is dead
                    tower1RealHealth.current.width(0);
                    tower1Body.current.image(null);
                    tower1Background.current.width(0);
                    tower1Background.current.strokeWidth(0);
                    tower1DisplayHealth.current.width(0);
                }

                if(Tower2Ref){
                    tower2RealHealth.current.width(250*Tower2Ref.towerCurrentHp/Tower2Ref.towerHp);
                    //chaneg hp bar color base on health remianing
                    if(tower2RealHealth.current.width()>180){
                        tower2RealHealth.current.fill("green")
                    }else if(tower2RealHealth.current.width()>50){
                        tower2RealHealth.current.fill("orange")
                    }else{
                        tower2RealHealth.current.fill("red")
                    }
                    tower2Body.current.rotation(Tower2Ref.towerAngleInitial+Tower2Ref.towerAngle);
                    tower2Background.current.width(266);
                    tower2Background.current.strokeWidth(8);
                     if(Tower2Ref.towerDisplayHp>Tower2Ref.towerCurrentHp){
                        const newHp = Math.max(0,Tower2Ref.towerDisplayHp-5.2);
                        Tower2Ref.towerDisplayHp=newHp;
                        tower2DisplayHealth.current.width(250*Tower2Ref.towerDisplayHp/Tower2Ref.towerHp);
                    }
                }else{
                    //clear visual when tower is dead
                    tower2RealHealth.current.width(0);
                    tower2Body.current.image(null);
                    tower2Background.current.width(0);
                    tower2Background.current.strokeWidth(0);
                    tower2DisplayHealth.current.width(0);

                }


                if(Tower3Ref){
                    tower3RealHealth.current.width(250*Tower3Ref.towerCurrentHp/Tower3Ref.towerHp);
                    //chaneg hp bar color base on health remianing
                    if(tower3RealHealth.current.width()>180){
                        tower3RealHealth.current.fill("green")
                    }else if(tower3RealHealth.current.width()>50){
                        tower3RealHealth.current.fill("orange")
                    }else{
                        tower3RealHealth.current.fill("red")
                    }

                     tower3Body.current.rotation(Tower3Ref.towerAngleInitial+Tower3Ref.towerAngle);
                     tower3Background.current.width(266);
                    tower3Background.current.strokeWidth(8);
                     if(Tower3Ref.towerDisplayHp>Tower3Ref.towerCurrentHp){
                        const newHp = Math.max(0,Tower3Ref.towerDisplayHp-5.2);
                        Tower3Ref.towerDisplayHp=newHp;
                        tower3DisplayHealth.current.width(250*Tower3Ref.towerDisplayHp/Tower3Ref.towerHp);
                    }
                }else{
                    //clear visual when tower is dead
                    tower3RealHealth.current.width(0);
                    tower3Body.current.image(null);
                    tower3Background.current.width(0);
                    tower3Background.current.strokeWidth(0);
                    tower3DisplayHealth.current.width(0);

                }





                //bullet,enemy movement, collision detection
                if(Tower1Ref||Tower2Ref||Tower3Ref){
                    //animate or delete the ash
                    let enemyAshList = EnemyAshRef.getChildren();
                    for(let i=enemyAshList.length-1;i>=0;--i){
                        const dt = (frame.time-enemyAshList[i].getAttr("spawnTime"))/1000;
                        if(dt<=1){
                            //run the function or fast in, slow out
                            const currentOffset = (130*((dt-1)**2)-80);
                            enemyAshList[i].offsetY(currentOffset);
                        }else{
                            enemyAshList[i].offsetY(-80);
                            if(dt>3){
                                const newOpacity = Math.max(enemyAshList[i].opacity()-0.05,0);
                                if(newOpacity===0){enemyAshList[i].destroy();continue;}
                                enemyAshList[i].opacity(newOpacity);
                            }
                        }

                    }
                    
                    let BulletList = BulletDataRef.getChildren();
                    
                    const bulletSpeed = 20, enemySpeed = 2; 
                    for (let i =BulletList.length-1;i>=0;--i){
                        BulletList[i].x(BulletList[i].x()+bulletSpeed*Math.cos(BulletList[i].getAttr('bulletAngle')*Math.PI/180));
                        BulletList[i].y(BulletList[i].y()+bulletSpeed*Math.sin(BulletList[i].getAttr('bulletAngle')*Math.PI/180));
                        BulletList[i].setAttr('distance',BulletList[i].getAttr('distance')+bulletSpeed);
                        if(BulletList[i].getAttr('distance')>1600){
                            BulletList[i].destroy();
                        }

                    }

                    //optimized enemy structure and spawn logic
                    let EnemyBodyList = EnemyBodyRef.getChildren();
                    for(let i = EnemyBodyList.length-1;i>=0;--i){
                        const currentEnemyNode = EnemyNodeMap.get(EnemyBodyList[i].getAttr("pId"));
                        if(!currentEnemyNode)continue;
                        //update health bar animation
                        currentEnemyNode.enemyRealHp.width(150*currentEnemyNode.master.getAttr("enemyCurrentHp")/currentEnemyNode.master.getAttr("enemyHp"));
                        //sliding health bar
                        if(currentEnemyNode.master.getAttr("enemyDisplayHp")>currentEnemyNode.master.getAttr("enemyCurrentHp")){
                            const newHp = Math.max(currentEnemyNode.master.getAttr("enemyDisplayHp")-9,0);
                            currentEnemyNode.master.setAttr("enemyDisplayHp",newHp);
                            currentEnemyNode.enemyDisplayHp.width(150*newHp/currentEnemyNode.master.getAttr("enemyHp"));
                        }



                        if(frame.time-currentEnemyNode.master.getAttr('enemySpawnedTime')>2000){
                            if(frame.time-currentEnemyNode.master.getAttr('enemyLastHitTime')>200){
                                currentEnemyNode.master.setAttr('enemyState',0);
                            }
                            currentEnemyNode.enemyBody.image(enemyImgArr.current[currentEnemyNode.master.getAttr('enemyLevel')-1][currentEnemyNode.master.getAttr('enemyState')]);
                            
                            currentEnemyNode.master.x(currentEnemyNode.master.x()+enemySpeed*Math.cos(currentEnemyNode.master.getAttr('enemyAngle')*Math.PI/180));
                            currentEnemyNode.master.y(currentEnemyNode.master.y()+enemySpeed*Math.sin(currentEnemyNode.master.getAttr('enemyAngle')*Math.PI/180));
                            currentEnemyNode.master.setAttr('distance',currentEnemyNode.master.getAttr('distance')+enemySpeed);

                           
                        }else{
                            //do the animation, expand in
                            const newWidth = currentEnemyNode.enemyBody.width()+5;
                                if(currentEnemyNode.enemyBody.width()<160){
                                    currentEnemyNode.enemyBody.width(newWidth);
                                    currentEnemyNode.enemyBody.height(newWidth);
                                    currentEnemyNode.enemyBody.offsetX(newWidth/2);
                                    currentEnemyNode.enemyBody.offsetY(newWidth/2);

                                }
                        }


                         if(currentEnemyNode.master.getAttr('distance')>1600){
                                //delete node
                                EnemyNodeMap.delete(EnemyBodyList[i].getAttr("pId"));
                                EnemyBodyList[i].destroy();
                                //
                        }
                        


                        
                    }
                    
                    

                    


                }

                //enemy hitting tower logic
                if(Tower1Ref||Tower2Ref||Tower3Ref){
                    
                    let EnemyBodyList = EnemyBodyRef.getChildren();
                    for (let i= EnemyBodyList.length-1;i>=0;--i){
                        //node quick reference
                        

                        const distanceTo1 = Tower1Ref?Math.sqrt((EnemyBodyList[i].x()-tower1X)**2+(EnemyBodyList[i].y()-tower1Y)**2):100000;
                        const distanceTo2 = Tower2Ref?Math.sqrt((EnemyBodyList[i].x()-tower2X)**2+(EnemyBodyList[i].y()-tower2Y)**2):100000;
                        const distanceTo3 = Tower3Ref?Math.sqrt((EnemyBodyList[i].x()-tower3X)**2+(EnemyBodyList[i].y()-tower3Y)**2):100000;
                        if(distanceTo1<100){
                            Tower1Ref.towerCurrentHp-=EnemyBodyList[i].getAttr('enemyDamage');
                            if(Tower1Ref.towerCurrentHp<=0){
                                Tower1Ref=null;
                                //local copy assgned to null does not change the actual object
                                tower1Ref.current=null;
                                
                            }
                            rerenderTower=true;

                            //remove node
                            EnemyNodeMap.delete(EnemyBodyList[i].getAttr("pId"));
                            EnemyBodyList[i].destroy();
                            
                            continue;
                        }else if(distanceTo2<100){
                            Tower2Ref.towerCurrentHp-=EnemyBodyList[i].getAttr('enemyDamage');
                            if(Tower2Ref.towerCurrentHp<=0){
                                Tower2Ref=null;
                                tower2Ref.current=null;

                                
                            }
                            rerenderTower=true;


                            //remove node
                            EnemyNodeMap.delete(EnemyBodyList[i].getAttr("pId"));
                            EnemyBodyList[i].destroy();
                           
                            continue;
                        }else if(distanceTo3<100){
                            Tower3Ref.towerCurrentHp-=EnemyBodyList[i].getAttr('enemyDamage');
                            if(Tower3Ref.towerCurrentHp<=0){
                                Tower3Ref=null;
                                tower3Ref.current=null;
                                
                            }
                            rerenderTower=true;


                            //remove node

                            EnemyNodeMap.delete(EnemyBodyList[i].getAttr("pId"));
                            EnemyBodyList[i].destroy();
                            
                            continue;
                        }

                    }



                }


                //bullet collision logic
                if(Tower1Ref||Tower2Ref||Tower3Ref){
                    
                    let EnemyBodyList = EnemyBodyRef.getChildren();
                    let BulletList = BulletDataRef.getChildren();

                    const Grid_Size = 120;
                    const enemyGrid = {};

                    for(let i = EnemyBodyList.length-1;i>=0;--i){
                        

                        const gridX = Math.floor(EnemyBodyList[i].x()/Grid_Size);
                        const gridY = Math.floor(EnemyBodyList[i].y()/Grid_Size);
                        const gridKey = `${gridX},${gridY}`;
                        if(!enemyGrid[gridKey]){
                            enemyGrid[gridKey]=[];
                        }
                        enemyGrid[gridKey].push({bodyData:EnemyBodyList[i],healthData:EnemyBodyList[i],xPos:EnemyBodyList[i].x(),yPos:EnemyBodyList[i].y(),
                            isKilled:false
                        });

                    }
                    for (let i = BulletList.length-1;i>=0;--i){
                        const gridX = Math.floor(BulletList[i].x()/Grid_Size);
                        const gridY = Math.floor(BulletList[i].y()/Grid_Size);
                        let bulletHit=false;
                       
                        for(let xOff=-1;xOff<=1&& !bulletHit;xOff++){
                            for(let yOff=-1;yOff<=1&& !bulletHit;yOff++){
                                 const gridKey = `${gridX+xOff},${gridY+yOff}`;
                                 if(enemyGrid[gridKey]&&enemyGrid[gridKey].length>=0){
                                    for(let j=enemyGrid[gridKey].length-1;j>=0;--j){
                                        const currentEnemy = enemyGrid[gridKey][j];
                                        
                                        if(currentEnemy.isKilled){continue;}



                                        const distance = Math.sqrt((currentEnemy.xPos-BulletList[i].x())**2+
                                                                    (currentEnemy.yPos-BulletList[i].y())**2);
                                        if(frame.time-currentEnemy.bodyData.getAttr('enemySpawnedTime')>2000){
                                        if(distance<=100){
                                            
                                            
                                            const newHp = currentEnemy.healthData.getAttr('enemyCurrentHp')-
                                            BulletList[i].getAttr('bulletDmg');

                                            BulletList[i].destroy();
                                            bulletHit=true;

                                            if(newHp<=0){
                                                //enemy is dead
                                                //add coins:
                                                coinAdd.current+=currentEnemy.bodyData.getAttr('enemyCoinDrop');
                                                scoreAdd.current += Math.min(gameDifficultyRef.current*10,500);
                                                setScoreDisplay(s=>s+Math.min(gameDifficultyRef.current*10,500));
                                                setCoinDisplay(c=>c+currentEnemy.bodyData.getAttr('enemyCoinDrop'));



                                                //spawn ashs
                                               
                                                const newAsh = new Konva.Image({
                                                    x:currentEnemy.bodyData.x(),
                                                    y:currentEnemy.bodyData.y(),
                                                    width:160,
                                                    height:160,
                                                    offsetX:80,
                                                    offsetY:50,
                                                    opacity:1,
                                                    image:enemyAshArr.current[currentEnemy.bodyData.getAttr("enemyLevel")-1],
                                                    scaleX:currentEnemy.bodyData.x()>980?-1:1,
                                                    spawnTime:frame.time

                                                });
                                                EnemyAshRef.add(newAsh);






                                                
                                                //delete the nodes from the map
                                                EnemyNodeMap.delete(currentEnemy.bodyData.getAttr("pId"));
                                                //

                                                currentEnemy.bodyData.destroy();
                                                currentEnemy.isKilled=true;
                                                break;
                                                
                                            }
                                            currentEnemy.bodyData.setAttr('enemyState',1);
                                            currentEnemy.bodyData.setAttr('enemyLastHitTime',frame.time);


                                            currentEnemy.healthData.setAttr('enemyCurrentHp',newHp);


                                            //currentEnemy.healthData.width(150*newHp/currentEnemy.healthData.getAttr('enemyHp'));

                                            


                                            break;
                                        }
                                        }

                                    }
                                    
                                 }
                            }
                            
                        }
                    }


                }


               


                 //about Tower1Ref
                
            
                if(Tower1Ref!==null){
                    
                        
                        const isFireTime = Math.floor(frame.time/Tower1Ref.towerFireDelay)>Math.floor(lastFrame/Tower1Ref.towerFireDelay);
                        
                        if(isFireTime){
                            
                        for(let i=0;i<Tower1Ref.towerBulletPerRound;++i){
                            
                            if(BulletDataRef){
                                const newBullet = new Konva.Image({
                                    width:80,
                                    height:80,
                                    offsetX:40,
                                    offsetY:40,
                                    bulletDmg:Tower1Ref.towerDamage,
                                    bulletAngle:Tower1Ref.towerAngle+i*360/Tower1Ref.towerBulletPerRound,
                                    distance:0,
                                    image: bulletImgArr.current[Tower1Ref.towerLevel-1],
                                    x: tower1X,
                                    y:tower1Y


                                });
                                BulletDataRef.add(newBullet);

                            }
                            

                        
                        }
                        
                    }

                }
                
                
                //about tower2Ref
                if(Tower2Ref!==null){
                        
                        const isFireTime = Math.floor(frame.time/Tower2Ref.towerFireDelay)>Math.floor(lastFrame/Tower2Ref.towerFireDelay);
                        
                        if(isFireTime){
                           
                        for(let i=0;i<Tower2Ref.towerBulletPerRound;++i){
                            
                             if(BulletDataRef){
                                const newBullet = new Konva.Image({
                                    width:80,
                                    height:80,
                                    offsetX:40,
                                    offsetY:40,
                                    bulletDmg:Tower2Ref.towerDamage,
                                    bulletAngle:Tower2Ref.towerAngle+i*360/Tower2Ref.towerBulletPerRound,
                                    distance:0,
                                    image: bulletImgArr.current[Tower2Ref.towerLevel-1],
                                    x: tower2X,
                                    y:tower2Y


                                });
                                BulletDataRef.add(newBullet);
                            

                        
                        }
                        
                    }

                }
                }
                //for tower 3
                if(Tower3Ref!==null){
                        
                        const isFireTime = Math.floor(frame.time/Tower3Ref.towerFireDelay)>Math.floor(lastFrame/Tower3Ref.towerFireDelay);
                        
                        if(isFireTime){
                           
                        for(let i=0;i<Tower3Ref.towerBulletPerRound;++i){
                            
                             if(BulletDataRef){
                                const newBullet = new Konva.Image({
                                    width:80,
                                    height:80,
                                    offsetX:40,
                                    offsetY:40,
                                    bulletDmg:Tower3Ref.towerDamage,
                                    bulletAngle:Tower3Ref.towerAngle+i*360/Tower3Ref.towerBulletPerRound,
                                    distance:0,
                                    image: bulletImgArr.current[Tower3Ref.towerLevel-1],
                                    x: tower3X,
                                    y:tower3Y


                                });
                                BulletDataRef.add(newBullet);
                            

                        
                        }
                        
                    }

                }
                }

                //new spawn enemy logic



                if(EnemyBodyRef&&EnemyAttributeArr){
                    const isSpawningTime = Math.floor(frame.time/EnemySpawnRate)>Math.floor(lastFrame/EnemySpawnRate);
                    if(isSpawningTime&&(Tower1Ref||Tower2Ref||Tower3Ref)){
                        for(let i=0;i<EnemySpawnAmount;++i){
                            //important id for quick access in maps

                            pIdCounter.current++;
                            const enemyLevelRandom = Math.floor(Math.random()*EnemyLevelRange)+1;
                            const randomAngle=Math.random()*360;
                            const randomDistance = Math.random()*300 + 900;
                            const initialX = 980+randomDistance*Math.cos(randomAngle*2*Math.PI/360);
                            const initialY = 980+randomDistance*Math.sin(randomAngle*2*Math.PI/360);
                            const distancetoT1 = Tower1Ref?Math.sqrt((initialX-tower1X)**2+(initialY-tower1Y)**2):100000;
                            const distancetoT2 = Tower2Ref?Math.sqrt((initialX-tower2X)**2+(initialY-tower2Y)**2):100000;
                            const distancetoT3 = Tower3Ref?Math.sqrt((initialX-tower3X)**2+(initialY-tower3Y)**2):100000;
                            const minDistance = Math.min(distancetoT1,distancetoT2,distancetoT3);
                            let Angle=0;
                            if(minDistance===100000){
                                Angle=90;
                            }else{
                                switch(minDistance){
                                    case distancetoT1:
                                        Angle=Math.atan2(tower1Y - initialY, tower1X - initialX)*360/(Math.PI*2);
                                        break;
                                    case distancetoT2:
                                        Angle=Math.atan2(tower2Y - initialY, tower2X - initialX)*360/(Math.PI*2);
                                        break;
                                    case distancetoT3:
                                        Angle=Math.atan2(tower3Y - initialY, tower3X - initialX)*360/(Math.PI*2);
                                        break;
                                    default:
                                        Angle=0;break;


                                }
                            }

                            const newEnemyGroup = new Konva.Group({
                                x:initialX,
                                y:initialY,
                                pId:pIdCounter.current,


                                enemyAngle:Angle,
                                enemySpawnedTime: frame.time,

                                enemyHp:EnemyAttributeArr[enemyLevelRandom-1].enemyHp + enemyHealthBuffer,
                                enemyCurrentHp:EnemyAttributeArr[enemyLevelRandom-1].enemyHp + enemyHealthBuffer,
                                enemyDamage:EnemyAttributeArr[enemyLevelRandom-1].enemyDmg + enemyDamageBuffer,
                                enemyCoinDrop:EnemyAttributeArr[enemyLevelRandom-1].enemyCoinDrop,

                                enemyState:0,

                                enemyLastHitTime:0,
                                

                                enemyLevel:enemyLevelRandom,
                                distance:0,


                                enemyDisplayHp:EnemyAttributeArr[enemyLevelRandom-1].enemyHp + enemyHealthBuffer
                            })

                            const newEnemy = new Konva.Image({
                                
                                x:0,
                                y:0,
                                width:0,
                                height:0,
                                offsetX:0,
                                offsetY:0,
                                
                                image:enemySpawningHoleImg,
                                
                                isDead:false,

                                scaleX:initialX>980?-1:1


                            });
                            const newEnemyHp = new Konva.Rect({
                                x:0,
                                y:-120,
                                width:150,
                                height:30,
                                offsetX:75,
                                offsetY:15,
                                fill:'red',
                                cornerRadius:16
                                


                            });

                            const newEnemyDisplayHp= new Konva.Rect({
                                x:0,
                                y:-120,
                                width:150,
                                height:30,
                                offsetX:75,
                                offsetY:15,
                                fill:'white',
                                cornerRadius:16

                            });

                            const hpBackground = new Konva.Rect({
                                x:0,
                                y:-120,
                                width:166,
                                height:46,
                                offsetX:83,
                                offsetY:23,
                                fill:'#4A4A4A',
                                stroke:"#242324",
                                cornerRadius:32,
                                strokeWidth:8,  

                            })


                            newEnemyGroup.add(hpBackground)
                            newEnemyGroup.add(newEnemy);
                            newEnemyGroup.add(newEnemyDisplayHp);
                            newEnemyGroup.add(newEnemyHp);
                            
                            

                            EnemyNodeMap.set(pIdCounter.current,{master:newEnemyGroup,
                                                        enemyBody:newEnemy,
                                                        enemyRealHp:newEnemyHp,
                                                        enemyDisplayHp:newEnemyDisplayHp,

                            })

                            EnemyBodyRef.add(newEnemyGroup);
                            


                        }
                    }


                }

                //new update method:
                BulletDataRef.batchDraw();
               
                EnemyBodyRef.batchDraw();



                
               
                

            
        });
    

        anim.start();

            
        return () => {
            anim.stop();
        };
    


    //edit here to add more tower
    },[
        
       

        enemySpawningHoleImg

    ]);

    //for rotating tower
    function handleTowerRotate(e){
        const rotateDegree=10;
        console.log(e.key);
        switch(e.key.toLowerCase()){
            case 'a':
                if(tower1Ref.current){
               tower1Ref.current.towerAngle-=rotateDegree;
                
                }
                break;
            case 's':
                if(tower1Ref.current){
                tower1Ref.current.towerAngle+=rotateDegree;
                
                }
                break;
            case 'z':
                if(tower2Ref.current){
                    tower2Ref.current.towerAngle-=rotateDegree;

                }
                break;
            case 'x':
               if(tower2Ref.current){
                    tower2Ref.current.towerAngle+=rotateDegree;

                }
                break;
            case'c':
                if(tower3Ref.current){
                    tower3Ref.current.towerAngle-=rotateDegree;

                }
                break;
            case'v':
                if(tower3Ref.current){
                    tower3Ref.current.towerAngle+=rotateDegree;

                }
                break;
                
                

            default:break;
        }

    }
    
    
    
    return (
        <div  style={{backgroundImage:`url(${backgroundArr[randomBackground]})`,
        transform: `translateX(-50%) translateY(-50%) scaleX(${ scaleFactor.current}) scaleY(${ scaleFactor.current}) `}}
        className={styles.gameWorld} 
        tabIndex="0" onKeyDown={handleTowerRotate} ref={rotateController}>


            <div style = {{display:displayLoadingScreen?"flex":"none"}}
            className={styles.loadingScreen}>
                <img src = {loadingGear}></img>
                <h1>loading {loadingDots}</h1>

            </div>

            <div className={styles.statusDisplay}>
            <div className={styles.coinDisplayPanel}>
                <img src={speedCoins}></img>
                <h1 className={styles.statNumber} key={coinDisplay}>{coinDisplay}</h1>
            </div>
            <div className={styles.scoreDisplayPanel}><h1 className={styles.statNumber} key={scoreDisplay}>Score {scoreDisplay}</h1></div>
            </div>



            {coinAddDisplay!==null?<div className={styles.coinPopout}>
                <img src = {speedCoins}></img>
                <h1>+{coinAddDisplay}</h1>
            </div>:null}

            
            <div className={styles.difficultyLevelDisplay}
            style={{display:showDifficuly?'flex':'none'}}>
                <h3>difficulty level 💀: {gameDifficulty} </h3></div>

            
            <div className={styles.panelBackdrop}
            style={{display:displayGameOverScreen?'flex':'none'}}>
                <div className={styles.panelBoard}>
                <h1>Game Over 😭</h1>
                <h1>Highest Score: {scoreDisplay}</h1>
                <button onClick={()=>{
                    navigate('/main');
                }}
                className={styles.panelConfirmButton}>exit</button>
                <button onClick={()=>{
                    window.location.reload()
                }}
                className={styles.panelConfirmButton}>🔁 Try Again</button>
                </div>
                
            </div>
            

            <button className={styles.pauseGameButton}
            onClick={()=>{
                setDisplayPauseScreen(d=>true)
            }}>X</button>

            <div className = {`${styles.panelBackdrop} ${styles.panelBackdropRed}`}
            style={{display:displayPauseScreen&&!displayGameOverScreen?'flex':'none'}}>
                <div className={`${styles.panelBoard} ${styles.panelBoardRed}`}>
                <h1>Are you Tired? </h1>
                <button className={`${styles.panelConfirmButton} ${styles.panelConfirmButtonGreen}`}
                onClick={()=>{
                    setDisplayPauseScreen(d=>false)
                }}>No! Get Me Back In 💪</button>
                <button className={styles.panelCancelButton}
                onClick={()=>{
                    navigate('/main');
                }}>
                    Yes, need some rest 😴
                </button>

                </div>
            </div>

            
            <Stage width={1960} height={1960} >
                <Layer>
                         {/*tower 1 cluster */}
                        <Rect height={46}
                        offsetX={133}
                        offsetY={23}
                        fill="#4A4A4A"
                        stroke="#242324"
                        cornerRadius={32}
                        
                        x={tower1X} y={tower1Y-150}
                        
                        ref={tower1Background}></Rect>

                        <Rect height={30}
                        fill='white' x={tower1X} y={tower1Y-150}
                        offsetX={125}
                        offsetY={15}
                        cornerRadius={16}
                        strokeWidth={8}
                        ref={tower1DisplayHealth}></Rect>

                    
                        <Rect height={30}
                        
                         x={tower1X} y={tower1Y-150}
                        offsetX={125}
                        offsetY={15}
                        cornerRadius={16}
                        strokeWidth={8}
                        ref={tower1RealHealth}></Rect>


                       

                        <KonvaImage height={250}
                        width={250}
                        offsetX={125}
                        offsetY={125}
                        x={tower1X}
                        y={tower1Y}
                        
                        ref={tower1Body}></KonvaImage>



                        {/*tower 2 cluster */}

                         <Rect height={46}
                        offsetX={133}
                        offsetY={23}
                        fill="#4A4A4A"
                        stroke="#242324"
                        cornerRadius={32}
                        
                        x={tower2X} y={tower2Y-150}
                        
                        ref={tower2Background}></Rect>




                        <Rect height={30}
                        fill='white' x={tower2X} y={tower2Y-150}
                        offsetX={125}
                        offsetY={15}
                        cornerRadius={16}
                        strokeWidth={8}
                        ref={tower2DisplayHealth}></Rect>


                        <Rect height={30}
                        
                        x={tower2X} y={tower2Y-150}
                        offsetX={125}
                        offsetY={15}
                        ref={tower2RealHealth}
                         cornerRadius={16}
                        strokeWidth={8}></Rect>


                        





                        <KonvaImage height={250}
                        width={250}
                        offsetX={125}
                        offsetY={125}
                        x={tower2X}
                        y={tower2Y}
                       
                        
                        ref={tower2Body}></KonvaImage>




                        {/*tower 3 cluster */}

                        <Rect height={46}
                        offsetX={133}
                        offsetY={23}
                        fill="#4A4A4A"
                        stroke="#242324"
                        cornerRadius={32}
                        
                        x={tower3X} y={tower3Y-150}
                        ref={tower3Background}></Rect>

                        <Rect height={30}
                        fill='white' x={tower3X} y={tower3Y-150}
                        offsetX={125}
                        offsetY={15}
                        cornerRadius={16}
                        strokeWidth={8}
                        ref={tower3DisplayHealth}></Rect>



                        <Rect height={30}
                        
                         x={tower3X} y={tower3Y-150}
                        offsetX={125}
                        offsetY={15}
                        ref={tower3RealHealth}
                         cornerRadius={16}
                        strokeWidth={8}></Rect>

                        


                        <KonvaImage height={250}
                        width={250}
                        offsetX={125}
                        offsetY={125}
                        x={tower3X}
                        y={tower3Y}
                        
                        
                        ref={tower3Body}></KonvaImage>



                    
                       
                        
                    
                    


                </Layer>
                
                <Layer ref={bulletData}></Layer>
                

                <Layer ref = {enemyData}></Layer>

                <Layer ref={enemyAshRef}></Layer>
                

            </Stage>

        </div>


    )

}
export default TowerDefenceGamePage