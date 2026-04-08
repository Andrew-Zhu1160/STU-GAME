import { Router} from "express";
import { rateLimit } from 'express-rate-limit';
import { param, query,body,validationResult } from 'express-validator';
import { validateInput,checkSession } from '../generalMiddleware/validation.mjs';
import 'dotenv/config'





//ai text embedding import and pinecone cloud vector db import
import {Pinecone} from "@pinecone-database/pinecone";
import { GoogleGenAI } from "@google/genai";


//naming convetion
//for new games:
//use id:the first letter of the game follow by a 1, name is the game name
//for a game tutorial
//use id "game name + tut1"
//name: "game tutorial"
const confidenceThreshold=0.65;
const maxContextWindow=10;
const gameArray =[{
    id:"td1",
    name:"Tower Defense",
    description:"Endless enemy waves comming from all directios, deploy and buy stronger towers to survive as long as possible ",
    howToPlay:"To play tower Defense, you need to choose a maximum of 3 towers from the gameshop menu "+
                "To do that, click on the shop bag icon in the top navigation bar and this will open up a bottm navigation bar"+
                "click on the cannon icon and this will direct you to the shop, once there you can buy tower with coins and click deploy tower to deploy them "+
                "To deploy, simply either enter the numeric value or click on the up down arrow beside each tower"+
                "note you can only deplploy towers you own \n\n"+
                "The game is pretty easy to understand, there will be enemy spawning from all drections approaching your tower ☠️, and your mission is to stay alive by aimming" +
                "your tower at them, how to control tower is covered in the next section. \n\n"+"to control the tower on the top-left, press A , S to move counter clockwise and clockwise \n"+
                "to control the tower on the top-right, press Z, S to move counter clockwise and clockwise \n"+
                "To control the tower at the bottom, oress C , V to move coutner clockwise and clockwise \n" +
                "good luck 👍"

},
{
    id:"bc1",
    name:"Ball Clutch",
    description:"All you do is keep the ball on the moving platform",
    howToPlay:"To play ball clutch, you need to buy and choose a ball you want to use in the game, the default is ball 1 "+
                "To do that, click on the shop bag icon in the top navigation bar and this will open up a bottm navigation bar"+
                "click on the ball/marble and this will direct you to the shop, once there you can buy balls with coins and click select to bring them into the game "+
                "note you can only choose one ball lol \n\n"+
                "The game is pretty easy to understand, you need to keep the ball on the moving platform and make sure you don't fall off or else it is game over 🪦 \n\n"+
            "to control the ball, press A , D to roll it left and right \n"+
                "press W to jump from on platform to another"+
                "good luck 👍"},
{
    id:"ps1",
    name:"Pizza Slicer",
    description:"Use mouse or your hand gesture to control the shuriken to slice though pizza, don't let the pizza drop on the ground, and try to slice as many pizza as you can to get high score",
    howToPlay:"To play Pizza Slicer, you need to buy and choose a shuriken you want to use in the game to cut pizzas 🍕, the default is sk 1 "+
                "To do that, click on the shop bag icon in the top navigation bar and this will open up a bottm navigation bar"+
                "click on the peperoni pizza icon and this will direct you to the shop, once there you can buy shuriken with coins and click select to bring them into the game "+
                " \n\n"+
                "The goal of the game is to slice as many pizza as possible while makeing sure they don't fall to the bottom. \n\n" +
                "You will have 10 lives to begin, everytime you missed a pizza, you lost one life, and game is over when you lost all 10 lives"+
                "This game offer 2 ways of control mouse or hand tracking" +
                "At the start of each game you will be prompt with a choice to either open you camera to play with you hands or play with you mouse \n" +
                "❗Note that the video hand tracking mode does require some load on your device and make sure your device can handle this! \n" +
                "Now just swipe around the screen to cut some pizzas 💪" 
}
];

export const router = Router();




//setup pinecone,google embedding client and other global variable for AI question answer function
const pinecone = new Pinecone({apiKey:process.env.PINECONE_API_KEY});
const googleAIClient = new GoogleGenAI({ 
    apiKey: process.env.GOOGLE_AI_API_KEY 
});

const index = pinecone.index({ host: process.env.PINECONE_HOST });










export const ingestGame = async ()=>{
    try{
        console.log("ingest game data to vector db");
        for(let game of gameArray){
            const result = await googleAIClient.models.embedContent({
                model:"gemini-embedding-001",
                contents:[ `${game.name}: ${game.description}`,`how to play ${game.name}? : ${game.howToPlay} `],
                config: {
                    taskType: 'RETRIEVAL_DOCUMENT'
                }

            });
            const vectorValues = result.embeddings[0].values;
            
            
            console.log(vectorValues);
            console.log("Vector values type:", typeof vectorValues);
            console.log("Vector values is array:", Array.isArray(vectorValues));
            console.log("Vector values length:", vectorValues?.length);
            

            await index.upsert({records:[{
                id: game.id,             // Unique identifier (e.g., 'tower-defense-01')
                values: vectorValues,    // The actual embedding
                metadata: {              // Human-readable data for later retrieval
                    name: game.name,
                    description: game.description,
                    howToPlay:game.howToPlay
                }
            }]});

            console.log(`✅ Successfully ingested: ${game.name}`);
            
           






        }
    }catch(error){
        console.error("error ingesting game data to vector db",error);
    }


}

//again, only post request will return a object with message when errored
const getChatHistoryLimiter = rateLimit({
    windowMs: 3000, // 1 minute window
    max: 3, // limit each IP to 3 requests per windowMs
   
});
router.get("/getChatHistory",checkSession,getChatHistoryLimiter,(req,res)=>{
    try{
        if(req.session.chatHistory){
            const formattedChatHistory = req.session.chatHistory.map((element)=>{
                return{
                    role: element.role,
                    content: element.parts[0].text
                }

            })
            return res.status(200).json({data:formattedChatHistory})
        }
        return res.sendStatus(400);

    }catch(error){
        console.log(error)
        return res.sendStatus(500);
    }
})


const suggestGameLimiter = rateLimit({
    windowMs: 5000, 
    max: 1, // limit each IP to 3 requests per windowMs
    message: { message: 'Too many requests, please try again later.' }
});
router.post("/suggestGameToPlay",suggestGameLimiter,checkSession,
    body('userPrompt').isString().exists(),
    validateInput,async (req,res)=>{
    try{
        //get embedded vector
      

        const result  = await googleAIClient.models.embedContent({
                model:process.env.GEMINI_EMBEDDING_MODEL,
                contents:[req.body.userPrompt ],
                config: {
                    taskType: 'RETRIEVAL_QUERY'
                }

        });
        const vectorValues = result.embeddings[0].values;

        if(!vectorValues||vectorValues.length<=0){return res.status(404).json({message:"model error"})}

        const queryResponse = await index.query({
            vector: vectorValues,
            topK: 1,  // Get top 1 match
            includeMetadata: true  // Include the game name and description
        });

        if (!queryResponse.matches || queryResponse.matches.length === 0) {
            return res.status(404).json({ message: 'No matching games found' });
         }

        const bestMatch = queryResponse.matches[0];

       //update chat history
      
       req.session.chatHistory=req.session.chatHistory.slice(-1*maxContextWindow);
   
       
        

        //testing endpoint
        console.log(bestMatch)

    
            //ask ai in a specific way, in a manner of a game suggestion
            let finalPrompt = `
            <system_role>
                You are the Official Game Assistant for STU GAME, a mini-game collection website. 
                Your sole mission is to chat with users and help them find a game to play on this platform.
            </system_role>

            <input_data>
                <confidence_score>${bestMatch.score}</confidence_score>
                <retrieved_context>
                    <game_name>${bestMatch.metadata.name}</game_name>
                    <description>${bestMatch.metadata.description}</description>
                    <how_to_play>${bestMatch.metadata.howToPlay}</how_to_play>
                </retrieved_context>
                <user_query>${req.body.userPrompt}</user_query>
                <chat_history>${req.session.chatHistory.map(element=>{
                    return `${element.role} said: ${element.parts[0].text}`;
                }).join(" \n")}</chat_history>
            </input_data>

            <decision_logic>
                Analyze the user_query and chat history to categorize the intent:
                1. NEW_GAME_REQUEST: If the <confidence_score> is high and the user's prompt from <user_query> suggest user is looking for something to play, suggest the game in <retrieved_context>.
                2. FOLLOW_UP: If you interpret the <chat_history> and it strongly indicates that the user is asking about a game recently discussed in the chat history, ignore <retrieved_context> and answer based on history.
                3. GENERAL_CHATTING: If the user is speaking generally, engage briefly but pivot the conversation back to suggesting the game in <retrieved_context>.
            </decision_logic>

            <response_guidelines>
                - Be enthusiastic and helpful.
                - Keep responses concise (under 300 tokens).
                - If the user seems lost, explain how to play the suggested game using the <how_to_play> data.
            </response_guidelines>
            <constraints>
                -you should only ever suggest game inside <retrieved_context> if you decide the user is looking for a new game to play, otherwise you should not mention the game in <retrieved_context> at all and only answer based on chat history. You should also not make up any new game suggestion that is not in the <retrieved_context>.
                - Use the <chat_history> to maintain context but do not let it override a clear new game request, always treat <user_query> as the primary source of intent.
            </constraints>
`;
    

            const aiResponse = await googleAIClient.models.generateContent({
                //model:"gemini-2.5-flash",
                model:process.env.GEMINI_LLM_MODEL,
               
                contents: {
                    role: "user",
                    parts: [{text: finalPrompt}]
                },
                history:req.session.chatHistory,
                generationConfig: {
                    temperature: 0.6, // Lower this to stop the "brainstorming" rambles
                    maxOutputTokens: 300, // Limit the length of the response
                },
            })

            

            const finalResponse = aiResponse.candidates[0].content.parts[0].text;

            //still preserve history , start a new one
            req.session.chatHistory=[... req.session.chatHistory,{role:"user",parts:[{text:req.body.userPrompt}]},{role:"model",parts:[{text:finalResponse}]}];



            console.log(finalResponse)



            if(bestMatch.score>confidenceThreshold-10&&finalResponse.toLowerCase().includes(bestMatch.metadata.name.toLowerCase())){
                return res.status(200).json({mode:"suggestion",aiText:finalResponse,suggestedGame:bestMatch.metadata.name})
            }else{
                return res.status(200).json({mode:"conversation",aiText:finalResponse,suggestedGame:"none"})

            }


        

    }catch(error){
        console.log(error)
        return res.status(500).json({message:'unknown error'});
    }
});
















