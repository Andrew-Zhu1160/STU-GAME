import { useEffect, useState,useRef } from "react";
import styles from './mainPage.module.css';
import shopIcon from '../images/gameShopIcon.png';
import towerIcon from '../images/towerGameImg/towerLv1.png';


//image import for towerDefence game shop
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


//----------------------------
//edit here to add more tower
//----------------------------


//image imports for ballclutch game shop
import ballNo1 from '../images/ballClutchGameImg/ballNo1.png';
import ballNo2 from '../images/ballClutchGameImg/ballNo2.png';
import ballNo3 from '../images/ballClutchGameImg/ballNo3.png';
import ballNo4 from '../images/ballClutchGameImg/ballNo4.png';
//



//gamecoins
import speedCoins from '../images/towerGameImg/speedCoin.png';


//for debug method
const isDev = import.meta.env.VITE_MODE==='DEV';




function MainPage({switchPage,styleDisplay}) {
    const [welcomeMessage, setWelcomeMessage]=useState("");
    const [welcomeMessageLoaded, setWelcomeMessageLoaded]=useState(false);
    
    //for tower shop image slider
    const[towerIndex,setTowerIndex]=useState(0);
    const towerImgArr = useRef([<img src={lv1Tower} className={styles.towerShowCase}/>,
                                <img src={lv2Tower} className={styles.towerShowCase}/>,
                                <img src={lv3Tower} className={styles.towerShowCase}/>,
                                <img src={lv4Tower} className={styles.towerShowCase}/>,
                                <img src={lv5Tower} className={styles.towerShowCase}/>,
                                <img src={lv6Tower} className={styles.towerShowCase}/>,
                                <img src={lv7Tower} className={styles.towerShowCase}/>,
                                <img src={lv8Tower} className={styles.towerShowCase}/>,
                                <img src={lv9Tower} className={styles.towerShowCase}/>,
                                <img src={lv10Tower} className={styles.towerShowCase}/>,
                                <img src = {lv11Tower} className={styles.towerShowCase}></img>,
                                <img src = {lv12Tower} className={styles.towerShowCase}></img>
    
    ]);
    //................
    //edit here to add more tower
    //.......................



    const towerDmgArr = useRef([]);
    const towerCostArr = useRef([]);
    const [toweOwnedArr,setTowerOwnedArr]=useState([]);

    const towerDeployArr=useRef([
        lv1Tower,lv2Tower,lv3Tower,lv4Tower,
        lv5Tower,lv6Tower,lv7Tower,lv8Tower,
        lv9Tower,lv10Tower,lv11Tower,lv12Tower
    ]);

    //..........................
    //edit here to add more tower
    //..........................
    
    
    
   
    //start of ballClutch variable
    //edit here to add more balls
    const ballImgArr = [ballNo1,ballNo2,ballNo3,ballNo4];
    const [ballIndex,setBallIndex] = useState(0);
    //0 means the ball is not owned, 1 means owned but not selected to game
    //2 means owned, and selected for game

    //edit here to add more balls
    const [ballOwnedStatusArr,setBallOwnedStatusArr] = useState([0,0,0,0]);
    const[ballGameSettingArr,setBallGameSettingArr] = useState([{},{},{},{}]);

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
    },[ballCluctch_showPurchaseOrSelect])
    
     //edit here to add more game


    
    
    
    useEffect(()=>{
        setWelcomeMessageLoaded(false);
        async function fetchWelcomeMessage(){
            console.log("Fetching welcome message");
            if(styleDisplay.display==='flex'){
            try{
                const response = await fetch(`${import.meta.env.VITE_API_URL}/currentPlayer`, { credentials: 'include' });
                if(response.ok){
                const data = await response.json();
                setWelcomeMessage(data.message);
                }
                

            }catch(error){
                setWelcomeMessage("Sorry I forgot you, but welcome🤣");
                
            }
            setWelcomeMessageLoaded(true);
            
            }
                
  

        }
        async function loadTowerGameShop(){
            if(styleDisplay.display==='flex'){
                try{
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/towerShop`, { credentials: 'include' });
                    if(response.ok){
                    const data = await response.json();
                    towerDmgArr.current=[data.tower1.damage,
                                        data.tower2.damage,
                                        data.tower3.damage,
                                        data.tower4.damage,
                                        data.tower5.damage,
                                        data.tower6.damage,
                                        data.tower7.damage,
                                        data.tower8.damage,
                                        data.tower9.damage,
                                        data.tower10.damage,
                                        data.tower11.damage,
                                        data.tower12.damage,

                                            
                    ];
                    //....................
                    //edit here to add more tower
                    //......................
                    towerCostArr.current=[
                                        data.tower1.cost,
                                        data.tower2.cost,
                                        data.tower3.cost,
                                        data.tower4.cost,
                                        data.tower5.cost,
                                        data.tower6.cost,
                                        data.tower7.cost,
                                        data.tower8.cost,
                                        data.tower9.cost,
                                        data.tower10.cost,
                                        data.tower11.cost,
                                        data.tower12.cost,

                    ];
                    //....................
                    //edit here to add more tower
                    //......................
                    setTowerOwnedArr(t=>[data.tower1.owned,
                                        data.tower2.owned,
                                        data.tower3.owned,
                                        data.tower4.owned,
                                        data.tower5.owned,
                                        data.tower6.owned,
                                        data.tower7.owned,
                                        data.tower8.owned,
                                        data.tower9.owned,
                                        data.tower10.owned,
                                        data.tower11.owned,
                                        data.tower12.owned,

                    ]);
                    //....................
                    //edit here to add more tower
                    //......................

                    }else{
                        console.log('fail to fetch');

                    }

                }catch(error){
                    console.log(error)

                }



            }

            
        }
        //..........................
        //edit here to add more game
        //...........................

        async function loadBallGameShop(){
            if(styleDisplay.display==='flex'){
                try{
                    const response = await fetch(
                        `${import.meta.env.VITE_API_URL}/ballGame/getUserBallStatus`, { credentials: 'include' }
                    );
                    if(response.ok){
                        const {data} = await response.json();
                        if(isDev){console.log(data);}
                        setBallOwnedStatusArr([...data]);

                    }
                }catch(error){
                    if(isDev){console.log(error)}
                }
                //also fetch some setting from the assets
                try{
                    const response = await fetch(
                        `${import.meta.env.VITE_API_URL}/ballGame/getBallGameSetting`, { credentials: 'include' }

                    );
                    if(response.ok){
                        const {data} = await response.json();
                        if(isDev){console.log(data)}
                        setBallGameSettingArr([...data]);
                        
                    }

                }catch(error){
                    if(isDev){console.log(error)}
                }


            }
        }

        fetchWelcomeMessage();

        loadTowerGameShop();

        loadBallGameShop();

    }, [styleDisplay]);





    
    
    
    function createGameCard(imageIcon,gameTitle,backgroundC,startGameFunction){
        return(
            <div className={styles.gameCard} style={{backgroundColor:backgroundC}}
            onClick={()=>{
                startGameFunction(gameTitle);
            }}>
                <img src={imageIcon}
                alt={`${gameTitle} Icon`}
                className={styles.gameCardIcon}></img>
                <h2 className={styles.gameCardTitle}>{gameTitle}</h2>
            </div>

        );


    }
    
    
    //...................
    //edit here to add more game
    //....................
    const towerGameCard = createGameCard(towerIcon,"Tower Defense","hsla(240, 94%, 55%, 0.68)",openEnterPanel);

    const ballClutchGameCard = createGameCard(ballNo1,"Ball Clutch","hsla(15, 100%, 50%, 0.87)",openEnterPanel);



    

    const[readyToEnter,setReadyToEnter]=useState(false);
    const[gameName,setGameName] = useState("");

    function openEnterPanel(GN){
        setReadyToEnter(true);
        setGameName(GN);

    }


    //shop variables
    const[openShop,setOpenShop] = useState(false);
    //load the content to displayed
    
    const[coinAmount,setCoinAmount]=useState(0);
    const[updateCoin,setUpdateCoin]=useState(0);



    useEffect(()=>{
        async function getUserCoins(){
            try{
                const response=await fetch(
                    `${import.meta.env.VITE_API_URL}/getUserCoins`,
                     { credentials: 'include' }

                );
                if(response.ok){
                    const coins = await response.json();
                    setCoinAmount(coins.userCoins);
                }


            }catch(error){
                console.log('unknown failure')

            }



        }
        getUserCoins();
    },[updateCoin])


    //........................................
    //specific game shop
    //very important section..................

    const[openSpecificGameShop,setOpenSpecificGameShop]
    =useState([false,false]);

    
    
    //tower defence
    const[openPurchasePanel,setOpenPurchasePanel]=
    useState(false);
    const[notEnoughMoneyWarning,setNotEnoughMoneyWarning]=
    useState(false);

    const[displayTowerSelection,setDisplayTowerSelection]
    =useState(false);
    //for tower deploy
    const userTowerCollection=useRef([]);

    const userTowerDeploy=useRef([]);
    const[val1,setVal1]=useState(0);
    const[val2,setVal2]=useState(0);
    const[val3,setVal3]=useState(0);
    const[val4,setVal4]=useState(0);
    const[val5,setVal5]=useState(0);
    const[val6,setVal6]=useState(0);
    const[val7,setVal7]=useState(0);
    const[val8,setVal8]=useState(0);
    const[val9,setVal9]=useState(0);
    const[val10,setVal10]=useState(0);
    const[val11,setVal11]=useState(0);
    const[val12,setVal12]=useState(0);
    //....................
    //edit here to add more tower
    //.......................

    const[showTooMuchDeploy,setShowTooMuchDeploy]
    =useState(false);
    
    //end of tower defencse variable







    







    



    //the logout button
    const[displayLogoutScreen,setDisplayLogoutScreen]
    =useState(false);




    return(
        <div style={{...styleDisplay}} className={styles.background}>
            <h1 className={styles.welcomeTag}
            style={{display:welcomeMessageLoaded?'block':'none'}}>{welcomeMessage}</h1>


            <img src={shopIcon}
            alt="Shop Icon"
            className={styles.shop}
            onClick={()=>{
                setOpenShop(true);
                setUpdateCoin(u=>u+1);
            }}></img>

            {/*the shop ui */}

            <div className = {styles.shopMainPage}
            style={{display:openShop?'flex':'none',
                
            }}>
                <button className={styles.existShopButton}
                onClick={()=>{
                    setOpenShop(false);
                    
                }}>close</button>

                <div className={styles.sideNavBar}>
                    

                    <img src={lv1Tower}
                    style={{width:'17vw'}}
                    onClick={()=>{
                        setOpenSpecificGameShop(o=>{
                            let temp=o.map(_=>false);
                            temp[0]=true;
                            return temp;
                        })
                        
                    }}></img>


                    {/*edit here to add more game */}


                    <img src={ballNo1}
                    style={{width:'17vw'}}
                    onClick={()=>{
                        setOpenSpecificGameShop(o=>{
                            let temp=o.map(_=>false);
                            temp[1]=true;
                            return temp;
                        })
                        
                    }}></img>




                </div>


                {/*Speed Coins Display */}
                <div className={styles.coinDisplay}>
                    <img src = {speedCoins} style={{
                        height:'10vh',
                        
                    }}></img>
                    <h1 style={{
                        fontFamily:'BGS',
                        fontSize:'2.2em',
                        fontWeight:'bold'
                    }}>{coinAmount}</h1>

                </div>



                {/*towerDefence shop 
                .........................
                .........................*/}
                <div style={{
                    display:openSpecificGameShop[0]?'block':'none'
                }}>
                    <button className={styles.imageSliderUp}
                    onClick={()=>{
                        setTowerIndex(t=>{
                            if(t>=towerImgArr.current.length-1){
                                return 0;
                            }
                            else{
                                return t+1;
                            }
                        });
                    }}>
                        ^</button>

                    
                    <div className={styles.towerDisplayPanel}>
                        {towerImgArr.current[towerIndex]}
                        <h1>Tower Lv {towerIndex+1}</h1>
                        <h1>Damage:{towerDmgArr.current[towerIndex]}</h1>
                        <h1>Owned:{toweOwnedArr[towerIndex]}</h1>
                       <button className={styles.buyButton}
                       onClick={()=>{
                        setOpenPurchasePanel(true);
                        setNotEnoughMoneyWarning(n=>false);
                       }}>Buy? {towerCostArr.current[towerIndex]} $</button>




                    </div>

                    <button className={styles.imageSliderDown}
                    onClick={()=>{
                        setTowerIndex(t=>{
                            if(t===0){
                                return towerImgArr.current.length-1;
                            }else{
                                return t-1;
                            }
                        });
                    }}>
                        ^
                    </button>




                    <div className={styles.towerDeployPanel}
                    onClick={async ()=>{
                        setDisplayTowerSelection(t=>true);
                        
                            try{
                                //...................
                                //edit here to add more tower
                                //.................
                                const response = await fetch(`${import.meta.env.VITE_API_URL}/getUserTowerCollection`,{credentials: 'include'});
                                if(response.ok){
                                    const {towerCollection,towerLayout} = await response.json();
                                    userTowerCollection.current = [...towerCollection];
                                    userTowerDeploy.current = [...towerLayout];
                                    console.log(userTowerCollection.current[0]);
                                    console.log(userTowerDeploy.current);
                                    


                                }else{
                                    console.log("something wrong");
                                }


                            }catch(error){
                                console.log(error);
                            }

                        
                    }}>
                        
                        Deploy Tower 
                    </div>

                </div>
                
                {/*tower deploy selection */}
                <div className= {styles.towerDeploySelection}
                        style={{display:displayTowerSelection?'flex':'none'}}>
                            <h1>Choose a max of 3 towers to deploy in Battle</h1>
                            <div>
                                <div>
                                    <img src ={towerDeployArr.current[0]}></img>
                                    <input type="number" max={userTowerCollection.current[0]} min={0} value={val1}
                                    onChange={(e)=>{
                                        if(parseInt(e.target.value,10)>userTowerCollection.current[0]){
                                            setVal1(userTowerCollection.current[0]);
                                            
                                        }else if(parseInt(e.target.value,10)<0){
                                            setVal1(0);
                                            
                                        }else{
                                            setVal1(parseInt(e.target.value,10));
                                        }
                                    }}></input>
                                    
                                </div>
                                <div>
                                    <img src ={towerDeployArr.current[1]}></img>
                                    <input type="number" max={userTowerCollection.current[1]} min={0} value={val2}
                                    onChange={(e)=>{
                                        if(parseInt(e.target.value,10)>userTowerCollection.current[1]){
                                            setVal2(userTowerCollection.current[1]);
                                            
                                        }else if(parseInt(e.target.value,10)<0){
                                            setVal2(0);
                                            
                                        }else{
                                            setVal2(parseInt(e.target.value,10));
                                        }
                                    }}></input>
                                    
                                </div>
                                <div>
                                    <img src ={towerDeployArr.current[2]}></img>
                                    <input type="number" max={userTowerCollection.current[2]} min={0} value={val3}
                                    onChange={(e)=>{
                                        if(parseInt(e.target.value,10)>userTowerCollection.current[2]){
                                            setVal3(userTowerCollection.current[2]);
                                            
                                        }else if(parseInt(e.target.value,10)<0){
                                            setVal3(0);
                                            
                                        }else{
                                            setVal3(parseInt(e.target.value,10));
                                        }
                                    }}></input>
                                    
                                </div>
                                <div>
                                    <img src ={towerDeployArr.current[3]}></img>
                                    <input type="number" max={userTowerCollection.current[3]} min={0} value={val4}
                                    onChange={(e)=>{
                                        if(parseInt(e.target.value,10)>userTowerCollection.current[3]){
                                            setVal4(userTowerCollection.current[3]);
                                            
                                        }else if(parseInt(e.target.value,10)<0){
                                            setVal4(0);
                                            
                                        }else{
                                            setVal4(parseInt(e.target.value,10));
                                        }
                                    }}></input>
                                    
                                </div>
                                <div>
                                    <img src ={towerDeployArr.current[4]}></img>
                                    <input type="number" max={userTowerCollection.current[4]} min={0} value={val5}
                                    onChange={(e)=>{
                                        if(parseInt(e.target.value,10)>userTowerCollection.current[4]){
                                            setVal5(userTowerCollection.current[4]);
                                            
                                        }else if(parseInt(e.target.value,10)<0){
                                            setVal5(0);
                                            
                                        }else{
                                            setVal5(parseInt(e.target.value,10));
                                        }
                                    }}></input>
                                    
                                </div>
                                <div>
                                    <img src ={towerDeployArr.current[5]}></img>
                                    <input type="number" max={userTowerCollection.current[5]} min={0} value={val6}
                                    onChange={(e)=>{
                                        if(parseInt(e.target.value,10)>userTowerCollection.current[5]){
                                            setVal6(userTowerCollection.current[5]);
                                            
                                        }else if(parseInt(e.target.value,10)<0){
                                            setVal6(0);
                                            
                                        }else{
                                            setVal6(parseInt(e.target.value,10));
                                        }
                                    }}></input>
                                    
                                </div>
                                <div>
                                    <img src ={towerDeployArr.current[6]}></img>
                                    <input type="number" max={userTowerCollection.current[6]} min={0} value={val7}
                                    onChange={(e)=>{
                                        if(parseInt(e.target.value,10)>userTowerCollection.current[6]){
                                            setVal7(userTowerCollection.current[6]);
                                            
                                        }else if(parseInt(e.target.value,10)<0){
                                            setVal7(0);
                                            
                                        }else{
                                            setVal7(parseInt(e.target.value,10));
                                        }
                                    }}></input>
                                    
                                </div>
                                <div>
                                    <img src ={towerDeployArr.current[7]}></img>
                                    <input type="number" max={userTowerCollection.current[7]} min={0} value={val8}
                                    onChange={(e)=>{
                                        if(parseInt(e.target.value,10)>userTowerCollection.current[7]){
                                            setVal8(userTowerCollection.current[7]);
                                            
                                        }else if(parseInt(e.target.value,10)<0){
                                            setVal8(0);
                                            
                                        }else{
                                            setVal8(parseInt(e.target.value,10));
                                        }
                                    }}></input>
                                    
                                </div>
                                <div>
                                    <img src ={towerDeployArr.current[8]}></img>
                                    <input type="number" max={userTowerCollection.current[8]} min={0} value={val9}
                                    onChange={(e)=>{
                                        if(parseInt(e.target.value,10)>userTowerCollection.current[8]){
                                            setVal9(userTowerCollection.current[8]);
                                            
                                        }else if(parseInt(e.target.value,10)<0){
                                            setVal9(0);
                                            
                                        }else{
                                            setVal9(parseInt(e.target.value,10));
                                        }
                                    }}></input>
                                    
                                </div>
                                <div>
                                    <img src ={towerDeployArr.current[9]}></img>
                                    <input type="number" max={userTowerCollection.current[9]} min={0} value={val10}
                                    onChange={(e)=>{
                                        if(parseInt(e.target.value,10)>userTowerCollection.current[9]){
                                            setVal10(userTowerCollection.current[9]);
                                            
                                        }else if(parseInt(e.target.value,10)<0){
                                            setVal10(0);
                                            
                                        }else{
                                            setVal10(parseInt(e.target.value,10));
                                        }
                                    }}></input>
                                    
                                </div>

                                <div>
                                    <img src ={towerDeployArr.current[10]}></img>
                                    <input type="number" max={userTowerCollection.current[10]} min={0} value={val11}
                                    onChange={(e)=>{
                                        if(parseInt(e.target.value,10)>userTowerCollection.current[10]){
                                            setVal11(userTowerCollection.current[10]);
                                            
                                        }else if(parseInt(e.target.value,10)<0){
                                            setVal11(0);
                                            
                                        }else{
                                            setVal11(parseInt(e.target.value,10));
                                        }
                                    }}></input>
                                    
                                </div>

                                <div>
                                    <img src ={towerDeployArr.current[11]}></img>
                                    <input type="number" max={userTowerCollection.current[11]} min={0} value={val12}
                                    onChange={(e)=>{
                                        if(parseInt(e.target.value,10)>userTowerCollection.current[11]){
                                            setVal12(userTowerCollection.current[11]);
                                            
                                        }else if(parseInt(e.target.value,10)<0){
                                            setVal12(0);
                                            
                                        }else{
                                            setVal12(parseInt(e.target.value,10));
                                        }
                                    }}></input>
                                    
                                </div>
                                

                                
                            </div>
                            <button onClick={async ()=>{
                                //.....................
                                //edit here to add more tower
                                //.....................
                                setShowTooMuchDeploy(false);
                                if((val1+val2+val3+val4+val5+val6+val7+val8+val9+val10+val11+val12)>userTowerDeploy.current.length){
                                    console.log((val1+val2+val3+val4+val5+val6+val7+val8+val9+val10+val11+val12));
                                setTimeout(()=>{setShowTooMuchDeploy(true)},10)
                                }else{
                                    const tempArr=[val1,val2,val3,val4,val5,val6,val7,val8,val9,val10,val11,val12];
                                    let tempDeployArr=[];
                                    for(let i =0;i<tempArr.length;++i){
                                        for(let j=0;j<tempArr[i];++j){
                                            tempDeployArr.push(i+1);

                                        }
                                        
                                    }
                                    if(tempDeployArr.length<userTowerDeploy.current.length){

                                        //fill zeros
                                        const tempLength = tempDeployArr.length;
                                        for(let i=0;i<userTowerDeploy.current.length-tempLength;++i){
                                            tempDeployArr.push(0);
                                        }
                                        
                                    }
                                    console.log(tempDeployArr)
                                    try{
                                    const response = await fetch(`${import.meta.env.VITE_API_URL}/editTowerDeploy`,{
                                        method:'POST',
                                        credentials: 'include',
                                        headers: {'Content-Type': 'application/json'},
                                        body: JSON.stringify({
                                            updatedDeploy:[...tempDeployArr]
                                        })
                                    });
                                    if(response.ok){
                                        setDisplayTowerSelection(false);
                                        console.log('success');
                                        
                                    }
                                    }catch(error){
                                        console.log(error);
                                    }


                                    
                                }

                            }}>save</button>

                            <h1 className={styles.welcomeTag}
                            style={{backgroundColor:'red',
                                display:showTooMuchDeploy?'block':'none'
                            }}>Maximum 3 allowed 🤬</h1>


                </div>




                <div style={{display:openPurchasePanel?'flex':'none'}}
                    className={styles.confirmPurchasePanel}>
                        <h1>buy lv {towerIndex+1} tower ? </h1>
                        <button className={styles.enterGameButton}
                        onClick={async ()=>{
                            setNotEnoughMoneyWarning(n=>false);
                            if(coinAmount<towerCostArr.current[towerIndex]){
                                //not enough money
                                
                                setTimeout(() => {
                                setNotEnoughMoneyWarning(true);}, 10);
                            }else{
                                try{
                                    //....................
                                    //edit here to add more tower
                                    //.....................
                                    const response = await fetch(`${import.meta.env.VITE_API_URL}/addTower`,{
                                        method:'POST',
                                        credentials: 'include',
                                        headers: {'Content-Type': 'application/json'},
                                        body: JSON.stringify({
                                            purchasedTowerLevel:towerIndex+1
                                        })

                                    })
                                    if(response.ok){
                                        //operation success
                                        //render changes
                                        setUpdateCoin(u=>u+1);
                                        setTowerOwnedArr(t=>{
                                            let temp = [...t];
                                            temp[towerIndex]++;
                                            return temp;
                                        });
                                        setOpenPurchasePanel(false);

                                    }else{
                                        console.log("unknown error")
                                    }


                                }catch(error){
                                    console.log(error);
                                }
                            }
                        }}>yes ✅ -{towerCostArr.current[towerIndex]}$</button>
                        <button className={styles.notEnterGameButton}
                        onClick={()=>{
                            setOpenPurchasePanel(false);
                        }}>no ❌</button>

                        <h1 className={styles.welcomeTag}
                        style={{backgroundColor:'hsla(0, 100%, 50%, 0.70)',
                            display:notEnoughMoneyWarning?'block':'none'
                        }}>not Enough Speed Coins 😭</h1>
                </div>




















                    {/*end of tower defence shop */}




                    {/* start of Ball Clutch shop */}

                    <div style={{display:openSpecificGameShop[1]?'block':'none'}}>

                        <button className={styles.imageSliderUp}
                        onClick={()=>{
                            setBallIndex(b=>{
                                if(b>=ballImgArr.length-1){
                                    return 0;
                                }
                                return b+1;
                            });
                        }}>^</button>

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
                        }}>^</button>


                        <div className={styles.generalPopup}
                        style = {{display:ballCluctch_showPurchaseOrSelect?'flex':'none'}}>

                            <h1>{ballOwnedStatusArr[ballIndex]===0?`buy ball No ${ballIndex+1}`:
                                ballOwnedStatusArr[ballIndex]===1?"select this ball?":""}</h1>
                            {ballOwnedStatusArr[ballIndex]===0?
                            <button className={styles.generalYesPopupButton}
                            onClick={async ()=>{
                                try{
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
                                        setUpdateCoin(u=>u+1);
                                        setBallClutch_showPurchaseOrSelect(b=>false);

                                    }else{
                                        const{message} = await response.json();
                                        if(isDev){console.log(message)}
                                        setBallClutch_warningMessage(message);
                                        setDisplayBallClutch_warningMessage(false);
                                        setTimeout(()=>{setDisplayBallClutch_warningMessage(true)},10);

                                       


                                    }
                                    
                                }catch(error){
                                    if(isDev){console.log(error)}
                                }

                            }}>yes -{ballGameSettingArr[ballIndex]?.cost} $</button>:
                            ballOwnedStatusArr[ballIndex]===1?
                            <button className={styles.generalYesPopupButton}
                            onClick={async ()=>{
                                try{
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
                                        const{message} = await response.json();
                                        if(isDev){console.log(message)}
                                        setBallClutch_warningMessage(message);
                                        setDisplayBallClutch_warningMessage(false);
                                        setTimeout(()=>{setDisplayBallClutch_warningMessage(true)},10);

                                    }



                                }catch(error){

                                }


                            }}>yes 😍</button>:""}

                            <button className={styles.generalNoPopupButton}
                            onClick={()=>{
                                setBallClutch_showPurchaseOrSelect(b=>false);
                            }}>
                                nope ❌
                            </button>


                            {!displayBallClutch_warningMessage?''
                        :<h1 className={styles.welcomeTag}
                        style={{backgroundColor:'red',display:'flex'}}>
                            {ballClutch_warningMessage}</h1>}



                        </div>

                        









                    </div>




            </div>


            
            
            
            {/*more game card here*/ }
            {towerGameCard}

            {ballClutchGameCard}




            <div className={styles.enterGameConfirmPanel}
            style={{display:readyToEnter?'flex':'none'}}>
                <h1 className={styles.enterConfirm}
                style={{display:readyToEnter?'flex':'none'}}>play {gameName}</h1>
                <button className={styles.enterGameButton}
                onClick={async ()=>{
                    switch (gameName){
                        case 'Tower Defense':
                            switchPage(2);
                            break;
                        //add more game entry here
                        case 'Ball Clutch':
                            switchPage(3);
                            break;
                        default:
                            break;
                    }

                }}>let's go 😍</button>



                <button className={styles.notEnterGameButton}
                onClick={()=>{
                    setReadyToEnter(false);
                }}>nope 😴</button>







            </div>
            


                {/*start of ball clutch*/}

                

                


































            <div className={styles.logoutScreen}
            style={{display:displayLogoutScreen?'flex':'none'}}>
                <h1>Log Out? You are always welcomed back💗</h1>
                <button className={styles.cancelLogout}
                onClick={()=>{
                    setDisplayLogoutScreen(d=>false)
                }}>No ❌</button>
                <button className={styles.confirmLogout}
                onClick={async ()=>{
                    //the logout logic
                    try{
                        const response = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
                         method: 'POST',
                        credentials: 'include' // Important to send cookie
                        });
                        if (response.ok) {
                
                        switchPage(0);
                        } else {
                            console.error('Logout failed');
                        }


                    }catch(error){
                        console.log(error);
                    }

                }}>Yes ✅</button>
            </div>

            <button className={styles.logoutButton}
            onClick={()=>{
                setDisplayLogoutScreen(d=>true)
            }}>X</button>


        </div>
    );

}

export default MainPage;