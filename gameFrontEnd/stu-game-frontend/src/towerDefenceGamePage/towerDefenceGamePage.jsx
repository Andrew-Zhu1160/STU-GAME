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


//bullets:
import lv1Bullet from '../images/towerGameImg/tower1Bullet.png';
import lv4Bullet from '../images/towerGameImg/tower4Bullet.png';
import lv6Bullet from '../images/towerGameImg/tower6Bullet.png';
import lv9Bullet from '../images/towerGameImg/tower9Bullet.png';
import lv10Bullet from '../images/towerGameImg/tower10Bullet.png'

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
    //bullets
    const[lv1BulletImg] = useImage(lv1Bullet);
    const[lv4BulletImg] = useImage(lv4Bullet);
    const[lv6BulletImg] = useImage(lv6Bullet);
    const[lv9BulletImg] = useImage(lv9Bullet);
    const[lv10BulletImg] = useImage(lv10Bullet);
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

    //test
    /*console.log('Bullet images loading status:', {
    lv1: lv1BulletImg,
    lv4: lv4BulletImg,
    lv6: lv6BulletImg,
    lv9: lv9BulletImg,
    lv10: lv10BulletImg
});*/
    


    const towerImgArr = [lv1TowerImg,lv2TowerImg,lv3TowerImg,lv4TowerImg,lv5TowerImg
        ,lv6TowerImg,lv7TowerImg,lv8TowerImg,lv9TowerImg,lv10TowerImg
    ];
    const bulletImgArr=[lv1BulletImg,lv1BulletImg,lv1BulletImg,lv4BulletImg,lv4BulletImg,
        lv6BulletImg,lv6BulletImg,lv6BulletImg,lv9BulletImg,lv10BulletImg
        ];


    const enemyImgArr=[[lv1EnemyNormalImg,lv1EnemyTakeDmgImg,null],
                        [lv2EnemyNormalImg,lv2EnemyTakeDmgImg,null],
                        [lv3EnemyNormalImg,lv3EnemyTakeDmgImg,null],
                        [lv4EnemyNormalImg,lv4EnemyTakeDmgImg,lv4EnemyDeathImg]];

    
    


    const [randomBackground,_]=useState(()=>Math.floor(Math.random()*backgroundArr.length));
  
    
    //the most important state array collections
    const [gameDifficulty ,setGameDifficulty] = useState(1);
    const gameDifficultyRef = useRef(1);
    useEffect(()=>{
        gameDifficultyRef.current = gameDifficulty?gameDifficulty:1;
    },[gameDifficulty]);

    const [showDifficuly,setShowDifficulty]=useState(false);
    //enemy buff
    const[enemyData, setEnemyData]=useState([]);
    const enemyDataRef = useRef([]);
    useEffect(()=>{
        enemyDataRef.current = [...enemyData];

    },[enemyData]);
    //waiting for fetch to fill in
    const enemyAttributeArr=useRef(null);
    
   

    
    const[bulletData,setBulletData] = useState([]);
    const bulletDataRef = useRef([]);
    useEffect(()=>{
        bulletDataRef.current = [...bulletData];
    },[bulletData]);

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
            console.log('updated')
        }
        
        }catch(error){
            console.log(error);
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




   

    
    useEffect(()=>{
        if(styleDisplay.display==='flex'){

            const centerX = 980 - (window.innerWidth / 2);
            const centerY = 980 - (window.innerHeight / 2);

            window.scrollTo({
                top: centerY,
                left: centerX,
                behavior: 'instant' // 'instant' prevents the user from seeing the "jump" from (0,0)
            });
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
                    console.log(error);

                }
            }
            getUserTower();


            //fetching enemy setting
            async function getEnemy(){
                try{
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/towerGame/getEnemyAttribute`,{credentials: 'include'});
                    if(response.ok){
                        const data = await response.json();
                        console.log(data);
                        enemyAttributeArr.current=data?[...data]:null;
                    }

                }catch(error){
                    console.log(error);
                }

            }
            getEnemy();

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
                    console.log(error);
                }

            }
            getUserCoinsAndScores();
            
            

        
            
        const anim = new Konva.Animation((frame)=>{
            //mega game loops
            let rerenderTower = false;
            

            let Tower1Ref = tower1Ref.current;
            let Tower2Ref = tower2Ref.current;
            let Tower3Ref=tower3Ref.current;
            

            let BulletDataRef = bulletDataRef.current;
            

            //enemy
            const EnemyAttributeArr = enemyAttributeArr.current;
            const EnemySpawnRate = Math.max(3000-gameDifficultyRef.current*100,1500);

            const EnemySpawnAmount = gameDifficultyRef.current>4?4:gameDifficultyRef.current;
            
            
            let EnemyDataRef = enemyDataRef.current;

            const EnemyLevelRange= Math.min(gameDifficultyRef.current,4);

            //rerender cycle limit
            let RefreshFrequency = 16.67;
            const rawDt = frame.timeDiff;
            const dt = rawDt/16.67
            const fps=1000/rawDt;
            //RefreshFrequency=Math.min(2**(1.3*dt),100);
            if(fps<50){RefreshFrequency=16.67*2}
            if(fps<40){RefreshFrequency=16.67*3}
            if(fps<30){RefreshFrequency=16.67*4}
            if(fps<20){RefreshFrequency=16.67*5}
            if(fps<10){RefreshFrequency=16.67*51/fps}


            //test
            
             
            //frame calculation
            const lastFrame = frame.time-frame.timeDiff;
            const isReRender = Math.floor(frame.time/RefreshFrequency)>Math.floor(lastFrame/RefreshFrequency);
            //const isReRender2 = Math.floor(frame.time*48/RefreshFrequency)>Math.floor(lastFrame*48/RefreshFrequency);

            //new bullets
            let newBulletsArr=[];


            //increase difficulty
            const difficultyIncreaseFrequency = 60000;
            const isIncreaseDifficulty = Math.floor(frame.time/difficultyIncreaseFrequency)>Math.floor(lastFrame/difficultyIncreaseFrequency);
            if(isIncreaseDifficulty){
                setShowDifficulty(s=>false);
                
                setGameDifficulty(g=>g+1);
                setTimeout(()=>{setShowDifficulty(s=>true)},500);
                gameDifficultyRef.current+=1;
                console.log(gameDifficultyRef.current);

            }
            const enemyHealthBuffer = Math.min(gameDifficultyRef.current*8,12000);
            const enemyDamageBuffer = Math.min(gameDifficultyRef.current*2,1000);

            

                //batch save coins to db
                
                if(coinAdd.current>=600){
                    let temp = coinAdd.current;
                    coinAdd.current=0;
                    
                    updateCoins(temp);
                   
                    

                }
                if(coinAdd.current>0){
                    
                    setCoinAddDisplay(c=>null);
                    setTimeout(()=>{setCoinAddDisplay(c=>coinAdd.current)},5)
                  
                    
                }
                

                //check if all towers are destroyed and game over
                if(!Tower1Ref&&!Tower2Ref&&!Tower3Ref&&frame.time>10000){
                    if(Date.now()-lastimeScoreFetched.current>5000){
                    
                    lastimeScoreFetched.current=Date.now();
                    setDisplayGameOverScreen(g=>true);
                    updateHighestScore();
                    }


                }
            //about Tower1Ref
                
            
                if(Tower1Ref!==null){
                    
                        
                        const isFireTime = Math.floor(frame.time/Tower1Ref.towerFireDelay)>Math.floor(lastFrame/Tower1Ref.towerFireDelay);
                        
                        if(isFireTime){
                            
                        for(let i=0;i<Tower1Ref.towerBulletPerRound;++i){
                            newBulletsArr.push({
                                id: `tower1-bullet-${Date.now()}-${i}`,
                                bulletDmg:Tower1Ref.towerDamage,
                                bulletAngle:Tower1Ref.towerAngle+i*360/Tower1Ref.towerBulletPerRound,
                                distance:0,
                                bulletLevel:Tower1Ref.towerLevel,
                                bulletImg:Tower1Ref.towerLevel-1,
                                startingX:tower1X,
                                startingY:tower1Y,
                                isHit:false
                                

                            });
                            

                        
                        }
                        
                    }

                }
                
                
                //about tower2Ref
                if(Tower2Ref!==null){
                        
                        const isFireTime = Math.floor(frame.time/Tower2Ref.towerFireDelay)>Math.floor(lastFrame/Tower2Ref.towerFireDelay);
                        
                        if(isFireTime){
                           
                        for(let i=0;i<Tower2Ref.towerBulletPerRound;++i){
                            
                            newBulletsArr.push({
                                id: `tower2-bullet-${Date.now()}-${i}`,
                                bulletDmg:Tower2Ref.towerDamage,
                                bulletAngle:Tower2Ref.towerAngle+i*360/Tower2Ref.towerBulletPerRound,
                                distance:0,
                                bulletLevel:Tower2Ref.towerLevel,
                                bulletImg:Tower2Ref.towerLevel-1,
                                startingX:tower2X,
                                startingY:tower2Y,
                                isHit:false
                                

                            });
                            

                        
                        }
                        
                    }

                }
                //for tower 3
                if(Tower3Ref!==null){
                        
                        const isFireTime = Math.floor(frame.time/Tower3Ref.towerFireDelay)>Math.floor(lastFrame/Tower3Ref.towerFireDelay);
                        
                        if(isFireTime){
                           
                        for(let i=0;i<Tower3Ref.towerBulletPerRound;++i){
                            
                            newBulletsArr.push({
                                id: `tower3-bullet-${Date.now()}-${i}`,
                                bulletDmg:Tower3Ref.towerDamage,
                                bulletAngle:Tower3Ref.towerAngle+i*360/Tower3Ref.towerBulletPerRound,
                                distance:0,
                                bulletLevel:Tower3Ref.towerLevel,
                                bulletImg:Tower3Ref.towerLevel-1,
                                startingX:tower3X,
                                startingY:tower3Y,
                                isHit:false
                                

                            });
                            

                        
                        }
                        
                    }

                }
















                if(Tower1Ref!==null||Tower2Ref!==null||Tower3Ref!==null){
                    //hitting enemy logic


                    
                    BulletDataRef=BulletDataRef.map(bullet=>{
                        return ({...bullet,distance:bullet.distance+20*dt})
                    });
                    BulletDataRef=BulletDataRef.filter(bullet=>bullet.distance<1600);
                    BulletDataRef = [...BulletDataRef,...newBulletsArr];


                    bulletDataRef.current=BulletDataRef;
                    
                    

                }

                
                //spawn/delete/move enemy
                if(EnemyAttributeArr!==null&&(Tower1Ref||Tower2Ref||Tower3Ref)){
                    const currentFrame = frame.time;
                    
                    for(let i=0;i<EnemyDataRef.length;++i){
                        if(!EnemyDataRef[i].isDead){
                        if(frame.time-EnemyDataRef[i].enemyLastHitTime>200){
                            if(EnemyDataRef[i].enemyState!==-1){
                            EnemyDataRef[i].enemyState=0;
                            }
                        }
                        const currentXPosition=(EnemyDataRef[i].startingX+EnemyDataRef[i].distance*Math.cos(EnemyDataRef[i].enemyAngle*2*Math.PI/360));
                        const currentYPosition=(EnemyDataRef[i].startingY+EnemyDataRef[i].distance*Math.sin(EnemyDataRef[i].enemyAngle*2*Math.PI/360));
                        const distanceTo1 = Tower1Ref?Math.sqrt((currentXPosition-tower1X)**2+(currentYPosition-tower1Y)**2):100000;
                        const distanceTo2 = Tower2Ref?Math.sqrt((currentXPosition-tower2X)**2+(currentYPosition-tower2Y)**2):100000;
                        const distanceTo3 = Tower3Ref?Math.sqrt((currentXPosition-tower3X)**2+(currentYPosition-tower3Y)**2):100000;
                        if(distanceTo1<100){
                            EnemyDataRef[i]={...EnemyDataRef[i],isDead:true};
                            Tower1Ref.towerCurrentHp-=EnemyDataRef[i].enemyDamage;
                            if(Tower1Ref.towerCurrentHp<=0){
                                Tower1Ref = null;
                            }
                            tower1Ref.current=Tower1Ref;
                            rerenderTower=true;
                            continue;
                            
                            
                           
                            
                        }else if(distanceTo2<100){
                            EnemyDataRef[i]={...EnemyDataRef[i],isDead:true};
                            Tower2Ref.towerCurrentHp-=EnemyDataRef[i].enemyDamage;
                            if(Tower2Ref.towerCurrentHp<=0){
                                Tower2Ref = null;
                            }
                            tower2Ref.current=Tower2Ref;
                            rerenderTower=true;
                            continue;
                            

                        }else if(distanceTo3<100){
                            EnemyDataRef[i]={...EnemyDataRef[i],isDead:true};
                            Tower3Ref.towerCurrentHp-=EnemyDataRef[i].enemyDamage;
                            if(Tower3Ref.towerCurrentHp<=0){
                                Tower3Ref = null;
                            }
                            tower3Ref.current=Tower3Ref;
                            rerenderTower=true;
                            continue;
                        }
                        
                        if(currentFrame-EnemyDataRef[i].enemySpawnedTime>2000){
                            const temp = EnemyDataRef[i].distance;
                            EnemyDataRef[i]={...EnemyDataRef[i],enemyState:0,distance:temp+3*dt};





                            
                        }
                        }
                    }

                    //adding logic
                    const isSpawningTime = Math.floor(frame.time/EnemySpawnRate)>Math.floor(lastFrame/EnemySpawnRate);
                    if(isSpawningTime){
                        let newEnemyArr=[];
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
                            
                            newEnemyArr.push({
                                enemyId:`enemy-${Date.now()}-${i}`,
                                enemyHpId:`enemyHp-${Date.now()}-${i}`,
                                enemyLevel:enemyLevelRandom,
                                enemyHp:EnemyAttributeArr[enemyLevelRandom-1].enemyHp + enemyHealthBuffer,
                                enemyCurrentHp:EnemyAttributeArr[enemyLevelRandom-1].enemyHp + enemyHealthBuffer,
                                enemyDamage:EnemyAttributeArr[enemyLevelRandom-1].enemyDmg + enemyDamageBuffer,
                                enemyCoinDrop:EnemyAttributeArr[enemyLevelRandom-1].enemyCoinDrop,
                                startingX:initialX ,
                                startingY:initialY,
                                distance:0,
                                enemyAngle:Angle,
                                //enemyState -1 means still in hole
                                //0 means normal
                                //1 means being hitted
                                //2 means dead
                                enemyState:-1,
                                enemySpawnedTime:frame.time,
                                enemyLastHitTime:frame.time,
                                isDead:false









                            })
                        }
                        EnemyDataRef = [...EnemyDataRef,...newEnemyArr];

                    }
                    //check for collisions
                    const Grid_Size = 120;
                    const enemyGrid = {};
                    for(let i=0;i<EnemyDataRef.length;++i){
                        if(!EnemyDataRef[i].isDead&&EnemyDataRef[i].enemyState!==-1){
                            const ex = EnemyDataRef[i].startingX + EnemyDataRef[i].distance * Math.cos(EnemyDataRef[i].enemyAngle * 2 * Math.PI / 360);
                            const ey = EnemyDataRef[i].startingY + EnemyDataRef[i].distance * Math.sin(EnemyDataRef[i].enemyAngle * 2 * Math.PI / 360);
                            const gridKey = `${Math.floor(ex / Grid_Size)}-${Math.floor(ey / Grid_Size)}`;
                            if (!enemyGrid[gridKey]) {
                                enemyGrid[gridKey] = []; 
                            }
                            enemyGrid[gridKey].push({ data: EnemyDataRef[i], x: ex, y: ey });
                        }

                    }
                    for(let i=0;i<BulletDataRef.length;++i){
                        const bullet = BulletDataRef[i];
                        if (bullet.isHit) continue; 

                        const bx = bullet.startingX + bullet.distance * Math.cos(bullet.bulletAngle * 2 * Math.PI / 360);
                        const by = bullet.startingY + bullet.distance * Math.sin(bullet.bulletAngle * 2 * Math.PI / 360);

                        const bGridX = Math.floor(bx / Grid_Size);
                        const bGridY = Math.floor(by / Grid_Size);

                        
                        let collisionFound = false;
                        for (let xOff = -1; xOff <= 1; xOff++) {
                            for (let yOff = -1; yOff <= 1; yOff++) {
                                if (collisionFound) break;

                                const bGridKey = `${bGridX + xOff}-${bGridY + yOff}`;
                                const nearbyEnemies = enemyGrid[bGridKey];

                                if (nearbyEnemies) {
                                    for (let j = 0; j < nearbyEnemies.length; j++) { 
                                        const enemyObj = nearbyEnemies[j];
                                        const enemyData = enemyObj.data;

                                        const dx = bx - enemyObj.x;
                                        const dy = by - enemyObj.y;
                                        const distSq = dx * dx + dy * dy;

                                        if (distSq < 8100) { 
                                            bullet.isHit = true; 
                                            if(enemyData.enemyState!==-1){
                                            enemyData.enemyCurrentHp -= bullet.bulletDmg;
                                            enemyData.enemyState = 1; 
                                            enemyData.enemyLastHitTime = frame.time;

                                            if (enemyData.enemyCurrentHp <= 0) {
                                                enemyData.isDead = true;
                                                //add the coins and scores
                                                coinAdd.current+=enemyData.enemyCoinDrop;
                                                scoreAdd.current += Math.min(gameDifficultyRef.current*10,500);
                                                setScoreDisplay(s=>s+Math.min(gameDifficultyRef.current*10,500));
                                                setCoinDisplay(c=>c+enemyData.enemyCoinDrop);
                                                
                                            }
                                            collisionFound = true;
                                            break; 
                                            }
                                        }
                                    }
                                }
                            }
                        }

                    }







                    //finally update
                    EnemyDataRef=EnemyDataRef.filter((enemy)=>enemy.distance<1600&&!enemy.isDead);
                    enemyDataRef.current = EnemyDataRef;
                    BulletDataRef=BulletDataRef.filter((bullet)=>!bullet.isHit);
                    bulletDataRef.current = BulletDataRef;
                }


                if(isReRender){
                setBulletData(b=>[...BulletDataRef]);
                setEnemyData(e=>[...EnemyDataRef]);
                }
                

                
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



    },[styleDisplay]);

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
        <div  style={{...styleDisplay,backgroundImage:`url(${backgroundArr[randomBackground]})`}}
        className={styles.gameWorld} 
        tabIndex="0" onKeyDown={handleTowerRotate} ref={rotateController}>

            <div className={styles.coinDisplayPanel}>
                <img src={speedCoins}></img>
                <h1>{coinDisplay}</h1>
            </div>

            {coinAddDisplay?<div className={styles.coinPopout}>
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
            style={{display:displayPauseScreen?'flex':'none'}}>
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

                <Layer>
                     {bulletData.map((element,index)=>{
                            
                            return (<Image
                                    key={element.id}
                                    width={70}
                                    height={70}
                                    offsetX={35}
                                    offsetY={35}
                                    image={bulletImgArr[element.bulletImg]}
                                    x={element.startingX+element.distance*Math.cos(element.bulletAngle*2*Math.PI/360)}
                                    y={element.startingY+element.distance*Math.sin(element.bulletAngle*2*Math.PI/360)}>
                                    </Image>);

                        })}
                </Layer>
                

                <Layer>
                    {enemyData.map(element=>{
                        return(<Rect
                        key={element.enemyHpId}
                        height={30}
                        fill="red"
                        width={150*(element.enemyCurrentHp/element.enemyHp)}
                        offsetY={95}
                        offsetX={75}
                        x={element.startingX + element.distance*Math.cos(element.enemyAngle*2*Math.PI/360)}
                        y={element.startingY + element.distance*Math.sin(element.enemyAngle*2*Math.PI/360)}>
                        </Rect>

                        );
                    })}
                    {enemyData.map(element=>{
                        return (<Image
                        key={element.enemyId}
                        width={160}
                        height={160}
                        offsetX={80}
                        offsetY={80}
                        image={element.enemyState===-1?enemySpawningHoleImg:
                            enemyImgArr[element.enemyLevel-1][element.enemyState]
                        }
                        x={element.startingX + element.distance*Math.cos(element.enemyAngle*2*Math.PI/360)}
                        y={element.startingY + element.distance*Math.sin(element.enemyAngle*2*Math.PI/360)}
                        scaleX={element.startingX>=980?-1:1}>
                        </Image>);
                    })}
                    



                </Layer>
                

            </Stage>

        </div>


    )

}
export default TowerDefenceGamePage