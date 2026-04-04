import { useEffect, useState,useRef } from "react";

//router
import { useNavigate } from 'react-router-dom';



import styles from './mainPage.module.css';
import shopIcon from '../images/gameShopIcon.png';
import towerIcon from '../images/towerGameImg/towerLv1.png';
import loadingGear from '../images/loadingGear.png';

import {ShoppingBag, Search, Info, User, Settings, Home, LogOut, Share2} from 'lucide-react';


//metadata import
import { gameCardArr, generalInfo } from "./gameData.js";

//import shops 
import TowerShop from './gameShops/towerShop.jsx';
import BallShop from "./gameShops/ballShop.jsx";
import PizzaShop from "./gameShops/pizzaShop.jsx";


//image import for towerDefence game shop

import towerGameIcon from '../images/towerGameImg/towerLv1.png';
import ballGameIcon from '../images/ballClutchGameImg/ballNo1.png';
import pizza1 from '../images/pizzaSlicerGameImage/pizza1.png';





//gamecoins
import speedCoins from '../images/towerGameImg/speedCoin.png';


//for debug method
const isDev = import.meta.env.VITE_MODE==='DEV';
const testLoadingDelay = 2000;



function MainPage() {
    const navigate = useNavigate();




    const [welcomeMessage, setWelcomeMessage]=useState("");
    const [welcomeMessageLoaded, setWelcomeMessageLoaded]=useState(false);

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
    

    
    

    
   


     //Experiment with the new gamecard display mechanics

     //important array
     //metadata of all game's name, description, and loading information
     const [displayedGameCardArr,setDisplayedGameCardArr] = useState([...gameCardArr]);
     const [cardArrStartingIndex,setCardArrStartingIndex] = useState(0);


    //display subpages instead of making more state variable
    /*
    index 0: main game card page
    index 1: shop
    index 2: info page
    index 3: contact use page / about author

  
    
    */
    const [displaySubPage,setDisplaySubPage] = useState([true,false,false,false]);




    
    /*---------------------------------------------------------------------
    Page loading initilization block start
    --------------------------------------------------------------------------- */
    
    useEffect(()=>{
        setWelcomeMessageLoaded(false);
        async function fetchWelcomeMessage(){
            console.log("Fetching welcome message");
            
            try{
                //loading gear tester
                setDisplayLoadingScreen(true);
                //loading gear tester end


                const response = await fetch(`${import.meta.env.VITE_API_URL}/currentPlayer`, { credentials: 'include' });
                if(response.ok){
                const data = await response.json();
                setWelcomeMessage(data.message);
                }else{
                    if(response.status===440){
                        //session not found
                        navigate("/login");
                    }
                }
                

            }catch(error){
                setWelcomeMessage("Sorry I forgot you, but welcome🤣");
                
            }finally{
                //loading gear tester
                if(isDev){
                    await new Promise((resolve,reject)=>{
                        setTimeout(()=>{resolve();},testLoadingDelay);
                    });
                }
                //end of loading gear tester
                setDisplayLoadingScreen(false);
            }


            setWelcomeMessageLoaded(true);
            
            
            
        }


        
       
        fetchWelcomeMessage();



    }, []);



    
    
    

    
   





    const[readyToEnter,setReadyToEnter]=useState(false);
    const[gameName,setGameName] = useState("");

   


    //shop variables
    
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
                }else{
                    if(response.status===440){
                        //session not found
                        navigate("/login");
                    }
                }


            }catch(error){
                console.log('unknown failure')
            }



        }
        getUserCoins();
    },[updateCoin]);




    /*---------------------------------------------------------------------
    Page loading initilization block end
    --------------------------------------------------------------------------- */


    /*-----------------------------------------------------------------------
    specific game shop section start
    ---------------------------------------------------------------------- */

    const[openSpecificGameShop,setOpenSpecificGameShop]
    =useState([false,false,false]);
    //lazy loading shops

    const [isShopFirstLoad,setIsShopFirstLoad] = useState([true,true,true])
    
    
    
    

   //the serch bar

   const [searchQuery, setSearchQuery] = useState("");

   //the content display at info page
   const [gameDescription,setGameDescription] = useState(gameCardArr[Math.floor(Math.random()*gameCardArr.length)].howToPlay);

   const [contectUsText,_] = useState(generalInfo.description)








    //the logout button
    const[displayLogoutScreen,setDisplayLogoutScreen]
    =useState(false);




    return(
        <div  className={styles.container}>
            <h1 className={styles.welcomeTag}
            style={{display:welcomeMessageLoaded?'block':'none'}}>{welcomeMessage}</h1>

            <div style = {{display:displayLoadingScreen?"flex":"none"}}
            className={styles.loadingScreen}>
                <img src = {loadingGear}></img>
                <h1>loading {loadingDots}</h1>
            </div>


            <div className={styles.topNavBar}>
                {!displaySubPage[0]&&<button className={styles.navButton}
                onClick={()=>{setDisplaySubPage([true,false,false,false]);}}>
                <Home size={30}></Home>
                </button>}
                <button 
                className={styles.navButton}
                onClick={()=>{
                    setDisplaySubPage([false,true,false,false]);
                    setUpdateCoin(u=>u+1);
            }}><ShoppingBag size={30}></ShoppingBag></button>

                <button className={styles.navButton}><Info size={30} onClick={()=>{setDisplaySubPage([false,false,true,false])}}></Info></button>

                <button className={styles.navButton}><Share2 size={30} onClick={()=>{setDisplaySubPage([false,false,false,true])}}></Share2></button>

                {displaySubPage[0]&&<div className={styles.searchContainer}>
                    <input 
                        type="text" 
                        className={styles.searchInput} 
                        placeholder="Search games..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className={styles.searchInsideButton} onClick={() => {
                        //reset to first page regardless
                        setCardArrStartingIndex(0);
                        setDisplayedGameCardArr([...gameCardArr.filter(element=>element.gameNameIdentifier
                                                                        .replaceAll(" ","") 
                                                                        .toLowerCase()
                                                                        .includes(searchQuery.replaceAll(" ","").toLowerCase()))])
                        }}>
                        <Search size={18} />
                    </button>
                </div>}

                <button className={styles.navButtonRed}
            onClick={()=>{
                setDisplayLogoutScreen(d=>true)
            }}><LogOut size={30}></LogOut></button>
            </div>





            {/*game card display */}
            {displaySubPage[0]&&displayedGameCardArr.map((g,gI)=>{
                if(gI>=cardArrStartingIndex&&gI<=cardArrStartingIndex+2){
                    return (<div className={styles.card} key={`${g.gameNameIdentifier}card`}>
                        <div className={styles.content}>
                            <img src={g.icon}></img>
                            <h1 className={styles.header}>{g.gameNameIdentifier}</h1>
                            <p className={styles.para}>{g.description}</p>
                            <button className={styles.btn}
                            onClick={()=>{
                                setGameName(g.gameNameIdentifier);
                                setReadyToEnter(true);
                            }}>try {g.gameNameIdentifier}</button>
                            <button className={styles.btn}
                           onClick={()=>{setGameDescription(g.howToPlay);
                            setDisplaySubPage([false,false,true,false])

                           }}>How to Play 🤔 </button>

                        </div>
                    </div>)
                }
                return "";
            })}
            

            {/* the tutorial panel */}
            {displaySubPage[2]&&<div className={styles.tutorialPanel}>
                <div className={styles.tutorialInner}>
                {gameDescription.map((g,index)=>{
                    switch(g.type){
                        case "h1":
                            return (<h1 key={`gametut${index}`}>{g.content}</h1>);
                            
                        case "h2":
                            return (<h2 key={`gametut${index}`}>{g.content}</h2>);
                        case "p":
                            return (<p key ={`gametut${index}`}>{g.content}</p>);
                        default:
                            return null;
                    }
                })}
                
                </div>
            </div>}


            {/*The contact us panel */}

            {displaySubPage[3]&&<div className={styles.tutorialPanel}>
                <div className={styles.tutorialInner}>
                    {contectUsText.map((c,index)=>{
                    switch(c.type){
                        case "h1":
                            return (<h1 key={`contectUs${index}`}>{c.content}</h1>);
                            
                        case "h2":
                            return (<h2 key={`contectUs${index}`}>{c.content}</h2>);
                        case "p":
                            return (<p key ={`contectUs${index}`}>{c.content}</p>);
                        default:
                            return null;
                    }
                })}


                </div> 
            </div>}

            {/*---------------------------------------
            the shop ui start
            ------------------------------------------ */}

            <div className = {styles.shopMainPage}
            style={{display:displaySubPage[1]?'flex':'none',
                
            }}>
                



                <div className={styles.bottomNavBar}>
                    

                    <img src={towerGameIcon}
                   
                    onClick={()=>{
                        setOpenSpecificGameShop(o=>{
                            let temp=o.map(_=>false);
                            temp[0]=true;
                            return temp;
                        })
                        
                    }}></img>


                    

                    <img src={ballGameIcon}
                   
                    onClick={()=>{
                        setOpenSpecificGameShop(o=>{
                            let temp=o.map(_=>false);
                            temp[1]=true;
                            return temp;
                        })
                        
                    }}></img>

                    <img src={pizza1}
                    
                    onClick={()=>{
                        setOpenSpecificGameShop(o=>{
                            let temp=o.map(_=>false);
                            temp[2]=true;
                            return temp;
                        })
                    }}></img>


                    {/*edit here to add more game */}


                </div>


                {/*-----------------------------
                Speed Coins Display
                ---------------------------------- */}
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
                
                 {/*-----------------------------
                Speed Coins Display end
                ---------------------------------- */}


                    {/*-----------------------------
                    start of tower defence shop ui
                    ----------------------------------*/}
                    {(openSpecificGameShop[0]||!isShopFirstLoad[0])&&<TowerShop
                    toggle={{display:openSpecificGameShop[0]?"block":"none"}}
                    styles={styles}
                    setDisplayLoadingScreen={(TF)=>{setDisplayLoadingScreen(TF)}}
                    setUpdateCoin={(increment)=>{setUpdateCoin(u=>u+increment)}}
                    coinAmount={coinAmount}
                    setIsShopFirstLoad={(TF)=>{setIsShopFirstLoad(s=>{const temp=[...s];temp[0]=TF;return temp})}}></TowerShop>}


                    {/*------------------------------------------
                    end of tower defence shop 
                    --------------------------------------------*/}





                    {/*-----------------------------------
                     start of Ball Clutch shop 
                     ---------------------------------------*/}

                    {(openSpecificGameShop[1]||!isShopFirstLoad[1])&&<BallShop
                    toggle={{display:openSpecificGameShop[1]?"block":"none"}}
                    styles={styles}
                    setDisplayLoadingScreen={(TF)=>{setDisplayLoadingScreen(TF)}}
                    setUpdateCoin={(increment)=>{setUpdateCoin(u=>u+increment)}}
                    setIsShopFirstLoad={(TF)=>{setIsShopFirstLoad(s=>{const temp=[...s];temp[1]=TF;return temp})}}></BallShop>}

                    {/*---------------------------
                    end of ball game shop
                    ----------------------------- */}


                    {/* ----------------------------
                    start of pizza slicing shop
                    ------------------------------------- */}
                    
                    {(openSpecificGameShop[2]||!isShopFirstLoad[2])&&<PizzaShop
                    toggle={{display:openSpecificGameShop[2]?"block":"none"}}
                    styles={styles}
                    setDisplayLoadingScreen={(TF)=>{setDisplayLoadingScreen(TF)}}
                    setUpdateCoin={(increment)=>{setUpdateCoin(u=>u+increment)}}
                    setIsShopFirstLoad={(TF)=>{setIsShopFirstLoad(s=>{const temp=[...s];temp[2]=TF;return temp})}}></PizzaShop>}

                    {/* ----------------------------
                    end of pizza slicing shop
                    ------------------------------------- */}
   


            </div>

            {/*---------------------------------------
            the shop ui end
            ------------------------------------------ */}


            
            
            

           



            {/*----------------------------------------------
            enter game panel start
            ------------------------------------------------- */}
            <div className={styles.panelBackdrop}
            style={{display:readyToEnter?'flex':'none'}}>
                <div className={styles.panelBoard}>
                <h1 className={styles.enterConfirm}
                style={{display:readyToEnter?'flex':'none'}}>play {gameName}</h1>
                <button className={styles.panelConfirmButton}
                onClick={async ()=>{
                    switch (gameName){
                        case 'Tower Defense':
                            navigate('/towerDefence');
                            break;
                        //add more game entry here
                        case 'Ball Clutch':
                            navigate('/ballClutch');
                            break;
                        case 'Pizza Slicer':
                            navigate('/pizzaSlicer');
                            break;
                        default:
                            break;
                    }

                }}>let's go 😍</button>



                <button className={styles.panelCancelButton}
                onClick={()=>{
                    setReadyToEnter(false);
                }}>nope 😴</button>


                </div>

            </div>
            
            {/*----------------------------------------------
            enter game panel end
            ------------------------------------------------- */}

       

                

         {/*----------------------------------------------
            logout panel start
            ------------------------------------------------- */}



            <div className={`${styles.panelBackdrop} ${styles.panelBackdropRed}`}
            style={{display:displayLogoutScreen?'flex':'none'}}>

                <div className={`${styles.panelBoard} ${styles.panelBoardRed}`}>
                <h1>Log Out? You are always welcomed back💗</h1>
                <button className={`${styles.panelConfirmButton} ${styles.panelConfirmButtonGreen}`}
                onClick={()=>{
                    setDisplayLogoutScreen(d=>false)
                }}>No ❌</button>
                <button className={styles.panelCancelButton}
                onClick={async ()=>{
                    //the logout logic
                    try{
                        setDisplayLoadingScreen(true);
                        const response = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
                         method: 'POST',
                        credentials: 'include' // Important to send cookie
                        });
                        if (response.ok) {
                
                            navigate('/login');
                        } else {
                            if(response.status===440){
                                //session not found
                                navigate("/login");
                            }
                            console.error('Logout failed');
                        }


                    }catch(error){
                        console.log(error);
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

                }}>Yes ✅</button>

                </div>
            </div>

            

            {/*----------------------------------------------
            logout panel end
            ------------------------------------------------- */}




        </div>
    );

}

export default MainPage;