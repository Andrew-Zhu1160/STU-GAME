//image imports for ballclutch game shop
//edit here to add more balls
import { useNavigate } from 'react-router-dom';
import ballNo1 from '../../images/ballClutchGameImg/ballNo1.png';
import ballNo2 from '../../images/ballClutchGameImg/ballNo2.png';
import ballNo3 from '../../images/ballClutchGameImg/ballNo3.png';
import ballNo4 from '../../images/ballClutchGameImg/ballNo4.png';
import ballNo5 from '../../images/ballClutchGameImg/ballNo5.png';
import ballNo6 from '../../images/ballClutchGameImg/ballNo6.png';
//

import { useEffect, useState,useRef } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';



const isDev = import.meta.env.VITE_MODE==='DEV';
const testLoadingDelay = 2000;


function BallShop({styles, setDisplayLoadingScreen,setUpdateCoin,toggle,setIsShopFirstLoad}){
    const navigate = useNavigate();
     /*----------------------------------------------------------------
       ballGame  variable block start
       ------------------------------------------------------------------- */ 
        //edit here to add more balls
        const ballImgArr = [ballNo1,ballNo2,ballNo3,ballNo4,ballNo5,ballNo6];
        const [ballIndex,setBallIndex] = useState(0);
        //0 means the ball is not owned, 1 means owned but not selected to game
        //2 means owned, and selected for game
        //edit here to add more balls
        const [ballOwnedStatusArr,setBallOwnedStatusArr] = useState([0,0,0,0,0,0]);
        const[ballGameSettingArr,setBallGameSettingArr] = useState([{},{},{},{},{},{}]);
    
        const [ballCluctch_showPurchaseOrSelect,
            setBallClutch_showPurchaseOrSelect
        ] = useState(false);
    
        const[ballClutch_warningMessage,
            setBallClutch_warningMessage
        ]=useState('');
        const[displayBallClutch_warningMessage,
            setDisplayBallClutch_warningMessage
        ]=useState(false);
    
        useEffect(()=>{
            if(ballCluctch_showPurchaseOrSelect){
                setDisplayBallClutch_warningMessage(false)
    
            }
        },[ballCluctch_showPurchaseOrSelect]);
    
    
        /*----------------------------------------------------------------
       BallGame variable block end
       ------------------------------------------------------------------- */ 
    
       useEffect(()=>{

        setIsShopFirstLoad(false);
        async function loadBallGameShop(){
            if(ballOwnedStatusArr[0]===0){
            try{
                //loading screen
                setDisplayLoadingScreen(true);
                //loading screen
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/ballGame/getUserBallStatus`, { credentials: 'include' }
                );
                if(response.ok){
                    const {data} = await response.json();
                    if(isDev){console.log(data);}
                    setBallOwnedStatusArr([...data]);

                }else{
                    if(response.status===440){
                        //session not found
                        navigate("/login");
                    }
                }
            }catch(error){
                if(isDev){console.log(error)}
            }
            }
            //also fetch some setting from the assets
            if(Object.keys(ballGameSettingArr[0]).length===0){
            try{
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/ballGame/getBallGameSetting`, { credentials: 'include' }

                );
                if(response.ok){
                    const {data} = await response.json();
                    if(isDev){console.log(data)}
                    setBallGameSettingArr([...data]);
                    
                }else{
                    if(response.status===440){
                        //session not found
                        navigate("/login");
                    }
                }

            }catch(error){
                if(isDev){console.log(error)}
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


        
    }
    loadBallGameShop();
    },[]);



    return (<div style={toggle}>
    
                            <button className={styles.imageSliderUp}
                            onClick={()=>{
                                setBallIndex(b=>{
                                    if(b>=ballImgArr.length-1){
                                        return 0;
                                    }
                                    return b+1;
                                });
                            }}><ChevronLeft size={50}></ChevronLeft></button>
    
                            {/*reuse some style from already existed style */}
    
                            <div className={styles.towerDisplayPanel}>
                                <img src={ballImgArr[ballIndex]}
                                className={styles.towerShowCase}
                                style={{width:'200px',height:'200px'}}></img>
                                <h1>Ball No {ballIndex+1}</h1>
    
                                <h1>{ballOwnedStatusArr[ballIndex]===0?"not Owned":
                                    ballOwnedStatusArr[ballIndex]===1?"owned, not selected":
                                    ballOwnedStatusArr[ballIndex]===2?"owned, selected":""}
                                </h1>
    
                                {ballOwnedStatusArr[ballIndex]===0?
                                <button className={styles.buyButton}
                                onClick={()=>{
                                    setBallClutch_showPurchaseOrSelect(true);
    
                                }}>buy: {ballGameSettingArr[ballIndex].cost} $</button>:
                                ballOwnedStatusArr[ballIndex]===1?
                                <button className={styles.buyButton}
                                onClick = {()=>{
                                    setBallClutch_showPurchaseOrSelect(true);
                                }}>Select this Ball ?</button>:
                                ""}
                                
                            </div>
    
    
    
                            <button className={styles.imageSliderDown}
                             onClick={()=>{
                                setBallIndex(b=>{
                                    if(b<=0){
                                        return ballImgArr.length-1;
                                    }
                                    return b-1;
                                });
                            }}><ChevronRight size={50}></ChevronRight></button>
    
    
                            <div className={styles.panelBackdrop}
                            style = {{display:ballCluctch_showPurchaseOrSelect?'flex':'none'}}>

                                <div className={styles.panelBoard}>
    
                                <h1>{ballOwnedStatusArr[ballIndex]===0?`buy ball No ${ballIndex+1}`:
                                    ballOwnedStatusArr[ballIndex]===1?"select this ball?":""}</h1>
                                {ballOwnedStatusArr[ballIndex]===0?
                                <button className={styles.panelConfirmButton}
                                onClick={async ()=>{
                                    try{
                                        setDisplayLoadingScreen(true);
                                        const response = await fetch(`${import.meta.env.VITE_API_URL}/ballGame/changeBallStatusArr`,
                                            {method:'POST',
                                            credentials: 'include',
                                            headers: {'Content-Type': 'application/json'},
                                            body: JSON.stringify({
                                                mode:'purchaseNewBall',
                                                purchasedBallNumber:ballIndex+1,
                                                selectedBallNumber:1
                                            })
                                            }
                                        );
                                        if(response.ok){
                                            const {data} = await response.json();
                                            if(isDev){console.log(data)}
                                            setBallOwnedStatusArr(b=>[...data]);
                                            setUpdateCoin(1);
                                            setBallClutch_showPurchaseOrSelect(b=>false);
    
                                        }else{
                                            if(response.status===440){
                                                //session not found
                                                navigate("/login");
                                            }
                                            const{message} = await response.json();
                                            if(isDev){console.log(message)}
                                            setBallClutch_warningMessage(message);
                                            setDisplayBallClutch_warningMessage(false);
                                            setTimeout(()=>{setDisplayBallClutch_warningMessage(true)},10);
    
                                           
    
    
                                        }
                                        
                                    }catch(error){
                                        if(isDev){console.log(error)}
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
    
                                }}>yes -{ballGameSettingArr[ballIndex]?.cost} $</button>:
                                ballOwnedStatusArr[ballIndex]===1?
                                <button className={styles.panelConfirmButton}
                                onClick={async ()=>{
                                    try{
                                        setDisplayLoadingScreen(true);
                                        const response = await fetch(`${import.meta.env.VITE_API_URL}/ballGame/changeBallStatusArr`,
                                            {method:'POST',
                                            credentials: 'include',
                                            headers: {'Content-Type': 'application/json'},
                                            body: JSON.stringify({
                                                mode:'selectBall',
                                                purchasedBallNumber:1,
                                                selectedBallNumber:ballIndex+1
                                            })
                                            }
                                        );
                                        if(response.ok){
                                            const {data} = await response.json();
                                            if(isDev){console.log(data)}
                                            setBallOwnedStatusArr(b=>[...data]);
                                            setBallClutch_showPurchaseOrSelect(b=>false);
    
                                        }else{
                                            if(response.status===440){
                                                //session not found
                                                navigate("/login");
                                            }
                                            const{message} = await response.json();
                                            if(isDev){console.log(message)}
                                            setBallClutch_warningMessage(message);
                                            setDisplayBallClutch_warningMessage(false);
                                            setTimeout(()=>{setDisplayBallClutch_warningMessage(true)},10);
    
                                        }
    
    
    
                                    }catch(error){
                                        if(isDev){console.log(error)}
    
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
    
    
                                }}>yes 😍</button>:""}
    
                                <button className={styles.panelCancelButton}
                                onClick={()=>{
                                    setBallClutch_showPurchaseOrSelect(b=>false);
                                }}>
                                    nope ❌
                                </button>
    
    
                               
    
    
                                    </div>

                                     {!displayBallClutch_warningMessage?''
                            :<h1 className={`${styles.welcomeTag} ${styles.welcomeTagVar}`}
                            style={{display:'flex',justifyContent:'center'}}>
                                {ballClutch_warningMessage}</h1>}
                            </div>
    
                        
                        </div>)


}



export default BallShop;