//image imports fo pizza slicing game shop
import skLv1 from '../../images/pizzaSlicerGameImage/playerSk1.png';
import skLv2 from '../../images/pizzaSlicerGameImage/playerSk2.png';
import skLv3 from '../../images/pizzaSlicerGameImage/playerSk3.png';
import skLv4 from '../../images/pizzaSlicerGameImage/playerSk4.png';
import { useEffect, useState,useRef } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const isDev = import.meta.env.VITE_MODE==='DEV';
const testLoadingDelay = 2000;

function PizzaShop({styles,setDisplayLoadingScreen,setUpdateCoin,toggle,setIsShopFirstLoad}){
     /*----------------------------------------------------------------
   PizzaGame shop variable block start
   ------------------------------------------------------------------- */ 
    

    const skImgArr = [skLv1,skLv2,skLv3,skLv4];
    const [skIndex,setSkIndex] = useState(0);

    const [skOwnedStatusArr,setSkOwnedStatusArr] = useState([0,0,0,0]);
    const [skGameSettingArr,setSkGameSettingArr] = useState([{},{},{},{}]);

    const [pizzaSlicer_showPurchaseOrSelect,setPizzaSlicer_showPurchaseOrSelect] = useState(false);
    const [pizzaSlicer_warningMessage,setPizzaSlicer_warningMessage] = useState('');
    const [displayPizzaSlicer_warningMessage,setDisplayPizzaSlicer_warningMessage] = useState(false);
    useEffect(()=>{
        if(pizzaSlicer_showPurchaseOrSelect){
            setDisplayPizzaSlicer_warningMessage(false)
        }
    },[pizzaSlicer_showPurchaseOrSelect]);



    /*----------------------------------------------------------------
   pizzaGame shop variable block end
   ------------------------------------------------------------------- */ 


   useEffect(()=>{
    setIsShopFirstLoad(false);
    async function loadPizzaGameShop(){
            if(skOwnedStatusArr[0]===0){
                //fetch
                try{
                    //loading screen
                    setDisplayLoadingScreen(true);
                    //loading screen
    
                const response = await fetch(`${import.meta.env.VITE_API_URL}/pizzaGame/getUserSkStatus`,
                    { credentials: 'include' }
                );
                if(response.ok){
                    const {data} = await response.json();
                    setSkOwnedStatusArr([...data]);
                    if(isDev){console.log(data);}
                }
                }catch(error){
                    if(isDev){console.log(error);}
                }
            }
            if(Object.keys(skGameSettingArr[0]).length===0){
                //fetch
                try{
                    //loading screen
                    setDisplayLoadingScreen(true);
                    //loading screen
    
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/pizzaGame/getPizzaGameSetting`,{credentials:'include'});
                    if(response.ok){
                        const {data} = await response.json();
                        setSkGameSettingArr([...data]);
                        if(isDev){console.log(data)}
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
        loadPizzaGameShop();
   },[])

    return(<div style={toggle}>

                        <button className={styles.imageSliderUp}
                        onClick={()=>{
                            setSkIndex(s=>{
                                if(s>=skImgArr.length-1){
                                    return 0;
                                }
                                return s+1;
                            });
                        }}><ChevronLeft size ={50}></ChevronLeft></button>



                        <div className={styles.towerDisplayPanel}>
                            <img src={skImgArr[skIndex]}
                            className={styles.towerShowCase}
                            style={{width:'160px',height:'160px'}}>
                            </img>
                            <h1>shuriken level {skIndex+1}</h1>

                            <h1>damage: {skGameSettingArr[skIndex].damage}</h1>

                            <h1>{skOwnedStatusArr[skIndex]===0?"not Owned":
                                skOwnedStatusArr[skIndex]===1?"owned, not selected":
                                skOwnedStatusArr[skIndex]===2?"owned, selected":""}
                            </h1>

                            {skOwnedStatusArr[skIndex]===0?
                            <button className={styles.buyButton}
                            onClick={()=>{
                                setPizzaSlicer_showPurchaseOrSelect(true);
                            }}>buy: {skGameSettingArr[skIndex].cost} $</button>:
                            skOwnedStatusArr[skIndex]===1?
                            <button className={styles.buyButton}
                            onClick = {()=>{
                                setPizzaSlicer_showPurchaseOrSelect(true);
                            }}>Select this shuriken ?</button>:
                            ""}
                        </div>

                        <div className={styles.panelBackdrop}
                        style = {{display:pizzaSlicer_showPurchaseOrSelect?'flex':'none'}} >
                            <div className={styles.panelBoard}>
                            <h1>{skOwnedStatusArr[skIndex]===0?`buy shuriken level ${skIndex+1}`:
                                skOwnedStatusArr[skIndex]===1?"select this shuriken?":""}</h1>
                            
                            {skOwnedStatusArr[skIndex]===0?<button
                            className={styles.panelConfirmButton}
                            onClick = {async()=>{
                                try{
                                    setDisplayLoadingScreen(true);
                                    const response = await fetch(`${import.meta.env.VITE_API_URL}/pizzaGame/changeSkStatusArr`,
                                        {method:'POST',
                                        credentials: 'include',
                                        headers: {'Content-Type': 'application/json'},
                                        body: JSON.stringify({
                                            mode:'purchaseNewSk',
                                            purchasedSkNumber:skIndex+1,
                                            selectedSkNumber:1
                                        })
                                        }
                                    );
                                    if(response.ok){
                                        const {data} = await response.json();
                                        setSkOwnedStatusArr([...data]);
                                        if(isDev){console.log(data);}
                                        setUpdateCoin(u=>u+1);
                                        setPizzaSlicer_showPurchaseOrSelect(false);

                                    }else{
                                        const {message} = await response.json();
                                        setPizzaSlicer_warningMessage(message);
                                        setDisplayPizzaSlicer_warningMessage(false);
                                        setTimeout(()=>{
                                            setDisplayPizzaSlicer_warningMessage(true);
                                        },50);


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

                            }}> yes -{skGameSettingArr[skIndex].cost}$
                            </button>:
                            skOwnedStatusArr[skIndex]===1?<button
                            className={styles.panelConfirmButton}
                            onClick = {async()=>{
                                try{
                                    setDisplayLoadingScreen(true);
                                    const response = await fetch(`${import.meta.env.VITE_API_URL}/pizzaGame/changeSkStatusArr`,
                                        {method:'POST',
                                        credentials: 'include',
                                        headers: {'Content-Type': 'application/json'},
                                        body: JSON.stringify({
                                            mode:'selectSk',
                                            purchasedSkNumber:1,
                                            selectedSkNumber:skIndex+1
                                        })
                                        }
                                    );
                                    if(response.ok){
                                        const {data}  =await response.json();
                                        setSkOwnedStatusArr([...data]);
                                        if(isDev){console.log(data);}
                                        setPizzaSlicer_showPurchaseOrSelect(false);

                                    }else{
                                        const {message} = await response.json();
                                        setPizzaSlicer_warningMessage(message);
                                        setDisplayPizzaSlicer_warningMessage(false);
                                        setTimeout(()=>{
                                            setDisplayPizzaSlicer_warningMessage(true);
                                        },50);

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

                            }}> yes 😍
                            </button>:""}

                            <button className={styles.panelCancelButton}
                            onClick={()=>{
                                setPizzaSlicer_showPurchaseOrSelect(p=>false);
                            }}>
                                nope ❌
                            </button>

                            

                            </div>

                            {!displayPizzaSlicer_warningMessage?''
                        :<h1 className={`${styles.welcomeTag} ${styles.welcomeTagVar}`}
                        style={{display:'flex',justifyContent:'center'}}>
                            {pizzaSlicer_warningMessage}</h1>}


                        </div>

                        
                        









                        <button className = {styles.imageSliderDown}
                        onClick={()=>{
                            setSkIndex(s=>{
                                if(s<=0){
                                    return skImgArr.length-1;
                                }
                                return s-1;
                            });
                        }}> <ChevronRight size={50}></ChevronRight></button>


                        
                        
                    
                    
                    
                    
                    </div>)


}
export default PizzaShop;