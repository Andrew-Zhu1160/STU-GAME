import {motion} from "motion/react"
import { useNavigate } from 'react-router-dom';
import {useState,useEffect,useRef,useCallback} from 'react';
import gameIcon from "../images/towerGameImg/towerLv2.png";
import gameIcon2 from "../images/towerGameImg/towerLv11.png";

import {Mail,LinkIcon} from 'lucide-react';




function LandingPage(){
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);
    const contactLeafRef = useRef(null);
    const demoRef = useRef(null);

    const scrollToContactLeaf = useCallback(() => {
        contactLeafRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, []);

    const scrollToDemoLeaf = useCallback(()=>{
        demoRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'});
    })

    const [scrollProgress, setScrollProgress] = useState(0);

    const updateScrollProgress = useCallback(() => {
        const el = scrollContainerRef.current;
        if (!el) return;
        const max = el.scrollHeight - el.clientHeight;
        setScrollProgress(max > 0 ? el.scrollTop / max : 0);
    }, []);

    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!el) return;
        updateScrollProgress();
        el.addEventListener('scroll', updateScrollProgress, { passive: true });
        const ro = new ResizeObserver(updateScrollProgress);
        ro.observe(el);
        return () => {
            el.removeEventListener('scroll', updateScrollProgress);
            ro.disconnect();
        };
    }, [updateScrollProgress]);

    return(
        <div ref={scrollContainerRef} className="h-full min-h-0 overflow-y-auto overflow-x-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-blue-50 relative">
      <div className="min-h-[300vh]">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-blue-950/30 border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
            STU GAME
          </div>

          <div className="flex items-center gap-8">
          <button 
            className="
                px-8 py-2.5 
                /* Typography: Premium Font Setup */
                font-sans font-semibold tracking-tight text-white
                
                /* Background & Border Fix */
                bg-gradient-to-r from-blue-600 to-cyan-500 
                border border-white/20 
                rounded-full 
                
                /* Interactive Effects */
                transition-all duration-300 ease-out
                shadow-[0_0_20px_rgba(59,130,246,0.4)]
                
                /* Hover State */
                hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]
                hover:scale-105 hover:brightness-110
                active:scale-95
            "
            onClick={() => navigate("/login")}
            >
            Login
            </button>
            <button 
            className="
                px-8 py-2.5 
                /* Typography: Premium Font Setup */
                font-sans font-semibold tracking-tight text-white
                
                /* Background & Border Fix */
                bg-gradient-to-r from-blue-600 to-cyan-500 
                border border-white/20 
                rounded-full 
                
                /* Interactive Effects */
                transition-all duration-300 ease-out
                shadow-[0_0_20px_rgba(59,130,246,0.4)]
                
                /* Hover State */
                hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]
                hover:scale-105 hover:brightness-110
                active:scale-95
            "
            onClick={() => navigate("/login")}
            >
            Sign Up
            </button>
            <button 
            className="
                px-8 py-2.5 
                /* Typography: Premium Font Setup */
                font-sans font-semibold tracking-tight text-white
                
                /* Background & Border Fix */
                bg-gradient-to-r from-red-600 to-orange-500 
                border border-white/20 
                rounded-full 
                
                /* Interactive Effects */
                transition-all duration-300 ease-out
                shadow-[0_0_20px_rgba(200,130,246,0.4)]
                
                /* Hover State */
                hover:shadow-[0_0_30px_rgba(200,211,50,0.6)]
                hover:scale-105 hover:brightness-110
                active:scale-95
            "
            onClick={scrollToDemoLeaf}
            >
            Demo
            </button>
            <button 
            className="
                px-8 py-2.5 
                /* Typography: Premium Font Setup */
                font-sans font-semibold tracking-tight text-white
                
                /* Background & Border Fix */
                bg-gradient-to-r from-red-600 to-orange-500 
                border border-white/20 
                rounded-full 
                
                /* Interactive Effects */
                transition-all duration-300 ease-out
                shadow-[0_0_20px_rgba(200,130,246,0.4)]
                
                /* Hover State */
                hover:shadow-[0_0_30px_rgba(200,211,50,0.6)]
                hover:scale-105 hover:brightness-110
                active:scale-95
            "
            onClick={scrollToContactLeaf}
            >
            Contact Us
            </button>

            </div>
        </div>
      </nav>

      {/* Glowing Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Tree Container */}
      <div className="relative pt-32 pb-20">
        {/* Long Squiggly Tree Trunk */}
        <svg
          className="absolute left-1/2 top-32 z-0 h-[250vh] w-36 min-w-[144px] -translate-x-1/2 pointer-events-none overflow-visible"
          viewBox="0 0 128 2600"
          preserveAspectRatio="none"
          style={{ filter: 'drop-shadow(0 0 40px rgba(34, 211, 238, 0.6))' }}
        >
          <motion.path
            d="M 20 -120 
                C 400 100, 400 500, 64 700
         C -250 900, -250 1300, 64 1500
         C 400 1700, 400 2300, 64 2500
         C -250 2700, -250 3100, 64 3300"
         stroke="url(#gradient)"
         strokeWidth="18"
         strokeLinecap="round"
         fill="none"
         initial={{ pathLength: 0, opacity: 0 }}
         whileInView={{ pathLength: 1, opacity: 1 }}
         viewport={{ once: true }}
         transition={{ duration: 3, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1e40af" />
            </linearGradient>
          </defs>
        </svg>

        {/* Leaf 1 - About the Game (Left side) */}
        <motion.div
          initial={{ scale: 0, opacity: 0, x: 100 }}
          animate={{
            scale:  1 ,
            opacity:  1 ,
            x:  0 ,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-40 ml-[13%]"
          style={{ marginTop: '4vh' }}
        >
          <div className="relative w-140 h-96 bg-gradient-to-br from-cyan-400/90 via-blue-500/90 to-blue-600/90 rounded-[50%] backdrop-blur-sm border-2 border-cyan-300/50 p-8 shadow-2xl" style={{ boxShadow: '0 0 60px rgba(34, 211, 238, 0.4), inset 0 0 40px rgba(59, 130, 246, 0.2)' }}>
          <div 
            className="absolute left-full top-1/2 -translate-y-1/2 bg-cyan-400" 
            style={{ 
                width: '120px',          // 1. Length of the triangle
                height: '50px',         // 2. Thickness at the base (the "leaf" side)
                clipPath: 'polygon(0% 0%, 0% 100%, 100% 50%)', // 3. The magic triangle shape
                filter: 'blur(1px) drop-shadow(0 0 10px rgba(34, 211, 238, 0.8))'
            }} 
            />
            <div className="flex h-full flex-col items-center justify-center text-center">
              <img className="mb-4 w-30 h-30" src={gameIcon}></img>
              <h2 className="mb-4 text-2xl font-bold text-white drop-shadow-lg">About The Website</h2>
              <p className="max-w-xs text-sm leading-relaxed text-blue-50 drop-shadow-md">
              Sometimes all you need in life is a stress-relieving game to play with, and this is when our web game collection website, STU GAME can provide, providing the simplest form of satisfaction through our game collection

              </p>
              <p className="max-w-xs mt-3 text-sm leading-relaxed text-blue-50 drop-shadow-md">
                Also explore our AI powered gameplay as well 🤖
              </p>
            </div>
          </div>
        </motion.div>

        {/* Leaf 2 - How to Navigate (Right side) */}
        <motion.div
          initial={{ scale: 0, opacity: 0, x: -100 }}
          animate={{
            scale: scrollProgress > 0.15 ? 1 : 0,
            opacity: scrollProgress > 0.15 ? 1 : 0,
            x: scrollProgress > 0.15 ? 0 : -100,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-70 ml-auto mr-[13%] w-fit"
        >
          <div className="relative w-140 h-96 bg-gradient-to-br from-cyan-400/90 via-blue-500/90 to-blue-600/90 rounded-[50%] backdrop-blur-sm border-2 border-cyan-300/50 p-8 shadow-2xl" style={{ boxShadow: '0 0 60px rgba(34, 211, 238, 0.4), inset 0 0 40px rgba(59, 130, 246, 0.2)' }}>
          <div 
            className="absolute right-full top-1/2 -translate-y-1/2 bg-cyan-400" 
            style={{ 
                width: '100px',
                height: '50px',
                // Triangle points LEFT: (100% 0, 100% 100, 0% 50%)
                clipPath: 'polygon(100% 0%, 100% 100%, 0% 50%)', 
                filter: 'blur(1px) drop-shadow(0 0 10px rgba(34, 211, 238, 0.8))'
            }} 
            />
            <div className="flex h-full w-full flex-col items-center justify-center text-center">
              <div className="mb-4 text-4xl">🗺️</div>
              <h2 className="mb-4 text-2xl font-bold text-white drop-shadow-lg">Navigation Guide</h2>
              <div className="w-full space-y-3">
                <div>
                  <p className="text-sm font-semibold text-blue-50 drop-shadow-md">Login</p>
                  <p className="text-xs text-blue-100 drop-shadow-md">Currently, the game support login using our account and login with google, click the login button in the top nav bar to enter login page</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-50 drop-shadow-md">Mainpage navigation</p>
                  <p className="text-xs text-blue-100 drop-shadow-md">Once logged in, you will be directed to main page, click on the game to play and see tutorial 👾 click on the shop icon "shopping bag" to open shops for in game items 🛍️</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-50 drop-shadow-md">How to play</p>
                  <p className="max-w-xs mx-auto text-xs text-blue-100 drop-shadow-md">The "How to play a specific game" instruction can be seen by clicking the "how to play" button under each game card</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Leaf 3 - See it in Action (Left side) */}
        <motion.div
            ref={demoRef}
          initial={{ scale: 0, opacity: 0, x: 100 }}
          animate={{
            scale: scrollProgress > 0.5 ? 1 : 0,
            opacity: scrollProgress > 0.5 ? 1 : 0,
            x: scrollProgress > 0.5 ? 0 : 100,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-60 ml-[13%]"
        >
          <div className="relative w-140 h-96 bg-gradient-to-br from-cyan-400/90 via-blue-500/90 to-blue-600/90 rounded-[50%] backdrop-blur-sm border-2 border-cyan-300/50 p-8 shadow-2xl" style={{ boxShadow: '0 0 60px rgba(34, 211, 238, 0.4), inset 0 0 40px rgba(59, 130, 246, 0.2)' }}>
          <div 
            className="absolute left-full top-1/2 -translate-y-1/2 bg-cyan-400" 
            style={{ 
                width: '100px',          // 1. Length of the triangle
                height: '50px',         // 2. Thickness at the base (the "leaf" side)
                clipPath: 'polygon(0% 0%, 0% 100%, 100% 50%)', // 3. The magic triangle shape
                filter: 'blur(1px) drop-shadow(0 0 10px rgba(34, 211, 238, 0.8))'
            }} 
            />
            <div className="flex h-full min-h-0 w-full flex-col items-center justify-center gap-2 px-1 text-center">
            <img className="mb-4 w-20 h-20" src={gameIcon2}></img>
              <h2 className="shrink-0 text-xl font-bold text-white drop-shadow-lg sm:text-2xl">
                See it in Action
              </h2>
              <iframe
                className="aspect-video w-full max-h-[min(11.5rem,42vh)] max-w-[min(100%,17.5rem)] shrink-0 rounded-2xl border-2 border-cyan-200/45 bg-slate-950/70 shadow-lg"
                src="https://www.youtube.com/embed/OsoZ7lQbVKc?controls=0&modestbranding=1&rel=0&fs=0&iv_load_policy=3&playsinline=1"
                title="Game demo"
                allow="accelerometer; autoplay; encrypted-media; gyroscope"
                loading="lazy"
              />
            </div>
          </div>
        </motion.div>

        {/* Leaf 4 - Contact Us (Right side) */}
        <motion.div
          ref={contactLeafRef}
          initial={{ scale: 0, opacity: 0, x: -100 }}
          animate={{
            scale: scrollProgress > 0.7 ? 1 : 0,
            opacity: scrollProgress > 0.7 ? 1 : 0,
            x: scrollProgress > 0.7 ? 0 : -100,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-20 ml-auto mr-[13%] w-fit scroll-mt-28"
        >
          <div className="relative w-140 h-96 bg-gradient-to-br from-cyan-400/90 via-blue-500/90 to-blue-600/90 rounded-[50%] backdrop-blur-sm border-2 border-cyan-300/50 p-8 shadow-2xl" style={{ boxShadow: '0 0 60px rgba(34, 211, 238, 0.4), inset 0 0 40px rgba(59, 130, 246, 0.2)' }}>
          <div 
            className="absolute right-full top-1/2 -translate-y-1/2 bg-cyan-400" 
            style={{ 
                width: '100px',
                height: '50px',
                // Triangle points LEFT: (100% 0, 100% 100, 0% 50%)
                clipPath: 'polygon(100% 0%, 100% 100%, 0% 50%)', 
                filter: 'blur(1px) drop-shadow(0 0 10px rgba(34, 211, 238, 0.8))'
            }} 
            />
            <div className="flex h-full w-full flex-col items-center justify-center text-center">
              <div className="mb-4 text-4xl">📧</div>
              <h2 className="mb-4 text-2xl font-bold text-white drop-shadow-lg">Contact Us</h2>
              <p className="mb-4 text-sm leading-relaxed text-blue-50 drop-shadow-md">
                Have questions or feedback? We'd love to hear from you!
              </p>
              <div className="w-full space-y-3">
                <div className="flex items-center justify-center gap-2">
                   
                <img className="mb-4 w-7 h-5" src="./gmail.png"></img>
                  <a className="text-sm text-blue-50 drop-shadow-md" href="https://mail.google.com/mail/?view=cm&fs=1&to=andrew.zhu739@gmail.com" target="_blank"> andrew.zhu739@gmail.com</a>
                </div>
                <div className="flex items-center justify-center gap-2">
                <img className="mb-4 w-7 h-7" src="./linkdin.png"></img>
                  <a className="text-sm text-blue-50 drop-shadow-md" href="https://www.linkedin.com/in/andrew-zhu-352b51386/" target="_blank">www.linkedin.com/in/andrew-zhu</a>
                </div>
                <div className="flex items-center justify-center gap-2">
                <img className="mb-4 w-7 h-7" src="./instagram.png"></img>
                  <a className="text-sm text-blue-50 drop-shadow-md" href="https://www.instagram.com/zhugengxin8/" target="_blank">www.instagram.com/zhugengxin8/</a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative py-8 border-t border-blue-500/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 text-center text-blue-300/60 text-sm">
          © 2026 STU GAME. All rights reserved.
        </div>
      </footer>
      </div>
    </div>
    )



}


export default LandingPage;