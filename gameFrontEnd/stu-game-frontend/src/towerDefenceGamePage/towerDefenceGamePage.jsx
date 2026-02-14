import { useState,useEffect,useRef,useMemo } from "react"
import styles from "./towerDefenceGamePage.module.css"
import { Stage, Layer, Circle, Group, Image,Rect } from 'react-konva';
import Konva from "konva";
import useImage from 'use-image';

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
import lv4EnemyDeath from '../images/towerGameImg/enemyLv4Death.png';

import enemySpawningHole from '../images/towerGameImg/enemySpawningHole.png';

//coins
import speedCoins from '../images/towerGameImg/speedCoin.png'

function TowerDefenceGamePage({switchPage,styleDisplay}){
    const isDev = import.meta.env.VITE_MODE==='DEV';
    const[lv1TowerImg] = useImage(lv1Tower);
    const[lv2TowerImg] = useImage(lv2Tower);
    const[lv3TowerImg] = useImage(lv3Tower);
    const[lv4TowerImg] = useImage(lv4Tower);
    const[lv5TowerImg] = useImage(lv5Tower);
    const[lv6TowerImg] = useImage(lv6Tower);
    const[lv7TowerImg] = useImage(lv7Tower);
    const[lv8TowerImg] = useImage(lv8Tower);
    const[lv9TowerImg] = useImage(lv9Tower);
    const[lv10TowerImg] = useImage(lv10Tower);
    const[lv11TowerImg] = useImage(lv11Tower);
    const[lv12TowerImg] = useImage(lv12Tower);
    //....................
    //edit here to add more tower and bullets
    //....................
    //bullets
    const[lv1BulletImg] = useImage(lv1Bullet);
    const[lv4BulletImg] = useImage(lv4Bullet);
    const[lv6BulletImg] = useImage(lv6Bullet);
    const[lv9BulletImg] = useImage(lv9Bullet);
    const[lv10BulletImg] = useImage(lv10Bullet);
    const[lv11BulletImg] = useImage(lv11Bullet);
    const[lv12BulletImg] = useImage(lv12Bullet);

    //enemies
    const[lv1EnemyNormalImg] = useImage(lv1EnemyNormal);
    const[lv1EnemyTakeDmgImg]=useImage(lv1EnemyTakeDmg);
    const[lv2EnemyNormalImg] = useImage(lv2EnemyNormal);
    const[lv2EnemyTakeDmgImg]=useImage(lv2EnemyTakeDmg);
    const[lv3EnemyNormalImg] = useImage(lv3EnemyNormal);
    const[lv3EnemyTakeDmgImg]=useImage(lv3EnemyTakeDmg);
    const[lv4EnemyNormalImg] = useImage(lv4EnemyNormal);
    const[lv4EnemyTakeDmgImg]=useImage(lv4EnemyTakeDmg);
    const[lv4EnemyDeathImg]=useImage(lv4EnemyDeath);
    const[enemySpawningHoleImg] = useImage(enemySpawningHole);

   
    
    //edit here to add more tower

    const towerImgArr = [lv1TowerImg,lv2TowerImg,lv3TowerImg,lv4TowerImg,lv5TowerImg
        ,lv6TowerImg,lv7TowerImg,lv8TowerImg,lv9TowerImg,lv10TowerImg,lv11TowerImg,
        lv12TowerImg,
    ];
    const bulletImgArr=[lv1BulletImg,lv1BulletImg,lv1BulletImg,lv4BulletImg,lv4BulletImg,
        lv6BulletImg,lv6BulletImg,lv6BulletImg,lv9BulletImg,lv10BulletImg,lv11BulletImg,
        lv12BulletImg,
        ];


    const enemyImgArr=[[lv1EnemyNormalImg,lv1EnemyTakeDmgImg,null],
                        [lv2EnemyNormalImg,lv2EnemyTakeDmgImg,null],
                        [lv3EnemyNormalImg,lv3EnemyTakeDmgImg,null],
                        [lv4EnemyNormalImg,lv4EnemyTakeDmgImg,null]];

    
    


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
    const bulletData=useRef(null);
    const enemyHealthData = useRef(null);
    const enemyBodyData=useRef(null);
    
    

    const[tower1,setTower1]=useState(null);
    const[tower2,setTower2]=useState(null);
    const[tower3,setTower3]=useState(null);
    
   //ref for rotating controller
   const rotateController = useRef(null);


   //ref in the loop
   const tower1Ref =useRef(null);
   useEffect(()=>{
    tower1Ref.current=tower1?{...tower1}:null;
   },[tower1]);

   const tower2Ref=useRef(null);
   useEffect(()=>{
    tower2Ref.current=tower2?{...tower2}:null;

   },[tower2]);

   const tower3Ref=useRef(null);
   useEffect(()=>{
    tower3Ref.current=tower3?{...tower3}:null;

   },[tower3]);
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
        if(styleDisplay.display==='flex'){

            const centerX = 980 - (window.innerWidth / 2);
            const centerY = 980 - (window.innerHeight / 2);

            /*
            window.scrollTo({
                top: centerY,
                left: centerX,
                behavior: 'instant' // 'instant' prevents the user from seeing the "jump" from (0,0)
            });
            */
            //end of start config
            //auto focous main screen
            if(rotateController.current){
                rotateController.current.focus();
            }

            //fetching user tower layout
            async function getUserTower(){
                try{
                const response = await fetch(`${import.meta.env.VITE_API_URL}/towerGame/getTowerDeploy`,{credentials: 'include'});
                if(response.ok){
                    const data = await response.json(); 
                    //console.log(data);

                    //
                    setTower1(_=>{return(data[0]===null?null:{...data[0],isDestroyed:false})});
                    setTower2(_=>{return(data[1]===null?null:{...data[1],isDestroyed:false})});
                    setTower3(_=>{return(data[2]===null?null:{...data[2],isDestroyed:false})});

                    //render the tower
                    
                    
                    
                    
                }
                }catch(error){
                    if(isDev){console.log(error);}

                }
            }
            


            //fetching enemy setting
            async function getEnemy(){
                try{
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/towerGame/getEnemyAttribute`,{credentials: 'include'});
                    if(response.ok){
                        const data = await response.json();
                        if(isDev){console.log(data);}
                        enemyAttributeArr.current=data?[...data]:null;
                    }

                }catch(error){
                    if(isDev){console.log(error);}
                }

            }
            

            //render tower
            //get user coins and highest scores
            async function getUserCoinsAndScores(){
                try{
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/towerGame/getCoinsAndScores`,{credentials: 'include'});
                    if(response.ok){
                        const data = await response.json();
                        previousHighScore.current = data.highestScoreRecord;
                        
                    }

                }catch(error){
                    if(isDev){console.log(error);}
                }

            }
            
            
        if(isFirstLoad.current){
            isFirstLoad.current=false;

            getUserTower();
            getEnemy();
            getUserCoinsAndScores();

        }  

        
            
        const anim = new Konva.Animation((frame)=>{
            //mega game loops
            let rerenderTower = false;
            

            let Tower1Ref = tower1Ref.current;
            let Tower2Ref = tower2Ref.current;
            let Tower3Ref=tower3Ref.current;
            

            const BulletDataRef = bulletData.current;
            

            //enemy
            const EnemyAttributeArr = enemyAttributeArr.current;
            const EnemySpawnRate = Math.max(3000-gameDifficultyRef.current*100,2000);

            const EnemySpawnAmount = gameDifficultyRef.current>4?4:gameDifficultyRef.current;
            
            
            const EnemyHealthRef = enemyHealthData.current;
            const EnemyBodyRef = enemyBodyData.current;

            const EnemyLevelRange= Math.min(gameDifficultyRef.current,4);

            
           
            if (!BulletDataRef || !EnemyHealthRef || !EnemyBodyRef) {
                return; 
            }


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
                /*
                if(coinAdd.current>0){
                    
                    if(isDisplayCoinAdd.current){
                        isDisplayCoinAdd.current = false;
                    setCoinAddDisplay(c=>null);
                    setTimeout(()=>{setCoinAddDisplay(c=>coinAdd.current)},5);
                    }
                  
                    
                }*/
                

                //check if all towers are destroyed and game over
                if(!Tower1Ref&&!Tower2Ref&&!Tower3Ref&&frame.time>10000){
                    if(Date.now()-lastimeScoreFetched.current>5000){
                    
                    lastimeScoreFetched.current=Date.now();
                    setDisplayGameOverScreen(g=>true);
                    updateHighestScore();
                    }


                }







                //bullet,enemy movement, collision detection
                if(Tower1Ref||Tower2Ref||Tower3Ref){
                    
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
                    let EnemyHealthList = EnemyHealthRef.getChildren();
                    for(let i = EnemyHealthList.length-1;i>=0;--i){
                        if(frame.time-EnemyHealthList[i].getAttr('enemySpawnedTime')>2000){
                        EnemyHealthList[i].x(EnemyHealthList[i].x()+enemySpeed*Math.cos(EnemyHealthList[i].getAttr('enemyAngle')*Math.PI/180));
                        EnemyHealthList[i].y(EnemyHealthList[i].y()+enemySpeed*Math.sin(EnemyHealthList[i].getAttr('enemyAngle')*Math.PI/180));
                        EnemyHealthList[i].setAttr('distance',EnemyHealthList[i].getAttr('distance')+enemySpeed);
                        if(EnemyHealthList[i].getAttr('distance')>1600){
                            EnemyHealthList[i].destroy();
                        }
                        }
                        
                    }
                    let EnemyBodyList = EnemyBodyRef.getChildren();
                    for(let i = EnemyBodyList.length-1;i>=0;--i){
                        if(frame.time-EnemyBodyList[i].getAttr('enemySpawnedTime')>2000){
                            if(frame.time-EnemyBodyList[i].getAttr('enemyLastHitTime')>200){
                                EnemyBodyList[i].setAttr('enemyState',0);
                            }
                            EnemyBodyList[i].image(enemyImgArr[EnemyBodyList[i].getAttr('enemyLevel')-1][EnemyBodyList[i].getAttr('enemyState')]);
                            
                            EnemyBodyList[i].x(EnemyBodyList[i].x()+enemySpeed*Math.cos(EnemyBodyList[i].getAttr('enemyAngle')*Math.PI/180));
                            EnemyBodyList[i].y(EnemyBodyList[i].y()+enemySpeed*Math.sin(EnemyBodyList[i].getAttr('enemyAngle')*Math.PI/180));
                            EnemyBodyList[i].setAttr('distance',EnemyBodyList[i].getAttr('distance')+enemySpeed);
                            if(EnemyBodyList[i].getAttr('distance')>1600){
                                EnemyBodyList[i].destroy();
                            }
                        }


                        
                    }

                    


                }

                //enemy hitting tower logic
                if(Tower1Ref||Tower2Ref||Tower3Ref){
                    let EnemyHealthList = EnemyHealthRef.getChildren();
                    let EnemyBodyList = EnemyBodyRef.getChildren();
                    for (let i= EnemyBodyList.length-1;i>=0;--i){
                        const distanceTo1 = Tower1Ref?Math.sqrt((EnemyBodyList[i].x()-tower1X)**2+(EnemyBodyList[i].y()-tower1Y)**2):100000;
                        const distanceTo2 = Tower2Ref?Math.sqrt((EnemyBodyList[i].x()-tower2X)**2+(EnemyBodyList[i].y()-tower2Y)**2):100000;
                        const distanceTo3 = Tower3Ref?Math.sqrt((EnemyBodyList[i].x()-tower3X)**2+(EnemyBodyList[i].y()-tower3Y)**2):100000;
                        if(distanceTo1<100){
                            Tower1Ref.towerCurrentHp-=EnemyBodyList[i].getAttr('enemyDamage');
                            if(Tower1Ref.towerCurrentHp<=0){
                                Tower1Ref=null;
                                
                            }
                            rerenderTower=true;
                            EnemyBodyList[i].destroy();
                            EnemyHealthList[i].destroy();
                            continue;
                        }else if(distanceTo2<100){
                            Tower2Ref.towerCurrentHp-=EnemyBodyList[i].getAttr('enemyDamage');
                            if(Tower2Ref.towerCurrentHp<=0){
                                Tower2Ref=null;
                                
                            }
                            rerenderTower=true;
                            EnemyBodyList[i].destroy();
                            EnemyHealthList[i].destroy();
                            continue;
                        }else if(distanceTo3<100){
                            Tower3Ref.towerCurrentHp-=EnemyBodyList[i].getAttr('enemyDamage');
                            if(Tower3Ref.towerCurrentHp<=0){
                                Tower3Ref=null;
                                
                            }
                            rerenderTower=true;
                            EnemyBodyList[i].destroy();
                            EnemyHealthList[i].destroy();
                            continue;
                        }

                    }



                }


                //bullet collision logic
                if(Tower1Ref||Tower2Ref||Tower3Ref){
                    let EnemyHealthList = EnemyHealthRef.getChildren();
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
                        enemyGrid[gridKey].push({bodyData:EnemyBodyList[i],healthData:EnemyHealthList[i],xPos:EnemyBodyList[i].x(),yPos:EnemyBodyList[i].y(),
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
                                                currentEnemy.healthData.destroy();
                                                currentEnemy.bodyData.destroy();
                                                currentEnemy.isKilled=true;
                                                break;
                                                
                                            }
                                            currentEnemy.bodyData.setAttr('enemyState',1);
                                            currentEnemy.bodyData.setAttr('enemyLastHitTime',frame.time);


                                            currentEnemy.healthData.setAttr('enemyCurrentHp',newHp);
                                            currentEnemy.healthData.width(150*newHp/currentEnemy.healthData.getAttr('enemyHp'));

                                            


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
                                    image: bulletImgArr[Tower1Ref.towerLevel-1],
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
                                    image: bulletImgArr[Tower2Ref.towerLevel-1],
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
                                    image: bulletImgArr[Tower3Ref.towerLevel-1],
                                    x: tower3X,
                                    y:tower3Y


                                });
                                BulletDataRef.add(newBullet);
                            

                        
                        }
                        
                    }

                }
                }

                //new spawn enemy logic



                if(EnemyBodyRef&&EnemyHealthRef&&EnemyAttributeArr!==null){
                    const isSpawningTime = Math.floor(frame.time/EnemySpawnRate)>Math.floor(lastFrame/EnemySpawnRate);
                    if(isSpawningTime&&(Tower1Ref||Tower2Ref||Tower3Ref)){
                        for(let i=0;i<EnemySpawnAmount;++i){
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
                            const newEnemy = new Konva.Image({
                                enemyLevel:enemyLevelRandom,
                                x:initialX,
                                y:initialY,
                                width:150,
                                height:150,
                                offsetX:75,
                                offsetY:75,
                                distance:0,
                                image:enemySpawningHoleImg,
                                enemyAngle:Angle,
                                enemySpawnedTime: frame.time,

                                enemyHp:EnemyAttributeArr[enemyLevelRandom-1].enemyHp + enemyHealthBuffer,
                                enemyCurrentHp:EnemyAttributeArr[enemyLevelRandom-1].enemyHp + enemyHealthBuffer,
                                enemyDamage:EnemyAttributeArr[enemyLevelRandom-1].enemyDmg + enemyDamageBuffer,
                                enemyCoinDrop:EnemyAttributeArr[enemyLevelRandom-1].enemyCoinDrop,

                                enemyState:0,

                                enemyLastHitTime:0,
                                isDead:false,

                                scaleX:initialX>980?-1:1


                            });
                            const newEnemyHp = new Konva.Rect({
                                x:initialX,
                                y:initialY,
                                width:150,
                                height:30,
                                offsetX:75,
                                offsetY:145,
                                distance:0,
                                fill:'red',
                                enemyHp:EnemyAttributeArr[enemyLevelRandom-1].enemyHp + enemyHealthBuffer,
                                enemyCurrentHp:EnemyAttributeArr[enemyLevelRandom-1].enemyHp + enemyHealthBuffer,
                                enemyAngle:Angle,
                                enemySpawnedTime:frame.time


                            });
                            EnemyBodyRef.add(newEnemy);
                            EnemyHealthRef.add(newEnemyHp);


                        }
                    }


                }

                //new update method:
                BulletDataRef.batchDraw();
                EnemyHealthRef.batchDraw();
                EnemyBodyRef.batchDraw();



                
                if(rerenderTower){
                    setTower1(t=>{return Tower1Ref?{...Tower1Ref}:null})
                    setTower2(t=>{return Tower2Ref?{...Tower2Ref}:null});
                     setTower3(t=>{return Tower3Ref?{...Tower3Ref}:null});
                }
            
                

            
        });
    

        anim.start();

            
        return () => {
            anim.stop();
        };
    }


    //edit here to add more tower
    },[styleDisplay, 
        lv1BulletImg,lv4BulletImg,lv6BulletImg,lv9BulletImg,lv10BulletImg,lv11BulletImg,lv12BulletImg,
        lv1EnemyNormalImg,lv1EnemyTakeDmgImg,lv2EnemyNormalImg,lv2EnemyTakeDmgImg,
        lv3EnemyNormalImg,lv3EnemyTakeDmgImg,lv4EnemyNormalImg,lv4EnemyTakeDmgImg,

        enemySpawningHoleImg

    ]);

    //for rotating tower
    function handleTowerRotate(e){
        const rotateDegree=10;
        console.log(e.key);
        switch(e.key.toLowerCase()){
            case 'a':
                if(tower1){
                setTower1(prev=>{return {...prev,towerAngle:prev.towerAngle-rotateDegree}});
                
                }
                break;
            case 's':
                if(tower1){
                setTower1(prev=>{return {...prev,towerAngle:prev.towerAngle+rotateDegree}});
                
                }
                break;
            case 'z':
                if(tower2){
                    setTower2(prev=>{return {...prev,towerAngle:prev.towerAngle-rotateDegree}});

                }
                break;
            case 'x':
                if(tower2){
                    setTower2(prev=>{return {...prev,towerAngle:prev.towerAngle+rotateDegree}});

                }
                break;
            case'c':
                if(tower3){
                    setTower3(prev=>{return {...prev,towerAngle:prev.towerAngle-rotateDegree}});

                }
                break;
            case'v':
                if(tower3){
                    setTower3(prev=>{return {...prev,towerAngle:prev.towerAngle+rotateDegree}});

                }
                break;
                
                

            default:break;
        }

    }
    
    
    
    return (
        <div  style={{...styleDisplay,backgroundImage:`url(${backgroundArr[randomBackground]})`,
        transform: `translateX(-50%) translateY(-50%) scaleX(${ scaleFactor.current}) scaleY(${ scaleFactor.current}) `}}
        className={styles.gameWorld} 
        tabIndex="0" onKeyDown={handleTowerRotate} ref={rotateController}>

            <div className={styles.coinDisplayPanel}>
                <img src={speedCoins}></img>
                <h1>{coinDisplay}</h1>
            </div>

            {coinAddDisplay!==null?<div className={styles.coinPopout}>
                <img src = {speedCoins}></img>
                <h1>+{coinAddDisplay}</h1>
            </div>:null}

            <div className={styles.scoreDisplayPanel}><h1>Score {scoreDisplay}</h1></div>

            <div className={styles.difficultyLevelDisplay}
            style={{display:showDifficuly?'flex':'none'}}>
                <h3>difficulty level 💀: {gameDifficulty} </h3></div>

            
            <div className={styles.gameOverScreen}
            style={{display:displayGameOverScreen?'flex':'none'}}>
                <h1>Game Over 😭</h1>
                <h2>Highest Score: {scoreDisplay}</h2>
                <button onClick={()=>{
                    switchPage(1);
                }}>exit</button>
            </div>
            

            <button className={styles.pauseButton}
            onClick={()=>{
                setDisplayPauseScreen(d=>true)
            }}>X</button>

            <div className = {styles.pauseScreen}
            style={{display:displayPauseScreen&&!displayGameOverScreen?'flex':'none'}}>
                <h1>Are you Tired? </h1>
                <button className={styles.resumeGame}
                onClick={()=>{
                    setDisplayPauseScreen(d=>false)
                }}>No! Get Me Back In 💪</button>
                <button className={styles.exitGame}
                onClick={()=>{
                    switchPage(1)
                }}>
                    Yes, need some rest 😴
                </button>
            </div>

            
            <Stage width={1960} height={1960} >
                <Layer>
                    
                        <Rect height={30}
                        width={tower1===null?0:250*tower1.towerCurrentHp/tower1.towerHp}
                        fill='green' x={tower1X} y={tower1Y-150}
                        offsetX={125}
                        offsetY={15}></Rect>
                        <Image height={250}
                        width={250}
                        offsetX={125}
                        offsetY={125}
                        x={tower1X}
                        y={tower1Y}
                        image={tower1===null?null:towerImgArr[tower1.towerLevel-1]}
                        rotation={tower1===null?0:tower1.towerAngleInitial+tower1.towerAngle}></Image>



                        <Rect height={30}
                        width={tower2===null?0:250*tower2.towerCurrentHp/tower2.towerHp}
                        fill='green' x={tower2X} y={tower2Y-150}
                        offsetX={125}
                        offsetY={15}></Rect>
                        <Image height={250}
                        width={250}
                        offsetX={125}
                        offsetY={125}
                        x={tower2X}
                        y={tower2Y}
                        image={tower2===null?null:towerImgArr[tower2.towerLevel-1]}
                        rotation={tower2===null?0:tower2.towerAngleInitial+tower2.towerAngle}
                        ></Image>




                        <Rect height={30}
                        width={tower3===null?0:250*tower3.towerCurrentHp/tower3.towerHp}
                        fill='green' x={tower3X} y={tower3Y-150}
                        offsetX={125}
                        offsetY={15}></Rect>
                        <Image height={250}
                        width={250}
                        offsetX={125}
                        offsetY={125}
                        x={tower3X}
                        y={tower3Y}
                        image={tower3===null?null:towerImgArr[tower3.towerLevel-1]}
                        rotation={tower3===null?0:tower3.towerAngleInitial+tower3.towerAngle}></Image>



                    
                       
                        
                    
                    


                </Layer>
                
                <Layer ref={bulletData}></Layer>
                
                <Layer ref = {enemyHealthData}></Layer>
                
                <Layer ref = {enemyBodyData}></Layer>
                

            </Stage>

        </div>


    )

}
export default TowerDefenceGamePage