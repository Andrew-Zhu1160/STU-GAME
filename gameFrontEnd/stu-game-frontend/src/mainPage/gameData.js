import towerGameIcon from '../images/towerGameImg/towerLv1.png';
import ballGameIcon from '../images/ballClutchGameImg/ballNo1.png';
import pizza1 from '../images/pizzaSlicerGameImage/pizza1.png';

export const gameCardArr = [
    {
        gameNameIdentifier: "Tower Defense",
        description: "endless enemy, how long can your tower survive? ☠️",
        icon: towerGameIcon,
        howToPlay:[{type:"h1",content:"Tower Defense Play Guide "},{type:"h2",content:"Overview"}
            ,{type:"p",content:"To play tower Defense, you need to choose a maximum of 3 towers from the gameshop menu "+
                "To do that, click on the shop bag icon in the top navigation bar and this will open up a bottm navigation bar"+
                "click on the cannon icon and this will direct you to the shop, once there you can buy tower with coins and click deploy tower to deploy them "+
                "To deploy, simply either enter the numeric value or click on the up down arrow beside each tower"+
                "note you can only deplploy towers you own \n\n"+
                "The game is pretty easy to understand, there will be enemy spawning from all drections approaching your tower ☠️, and your mission is to stay alive by aimming" +
                "your tower at them, how to control tower is covered in the next section. \n\n"
            },
            {type:"h2",content:"Control"},
            {type:"p", content:"to control the tower on the top-left, press A , S to move counter clockwise and clockwise \n"+
                "to control the tower on the top-right, press Z, S to move counter clockwise and clockwise \n"+
                "To control the tower at the bottom, oress C , V to move coutner clockwise and clockwise \n" +
                "good luck 👍"
            }
        ]
    },
    {
        gameNameIdentifier: "Ball Clutch",
        description: "keep the ball on the platform ❗", 
        icon: ballGameIcon,
        howToPlay:[{type:"h1",content:"Ball Clutch Play Guide "},{type:"h2",content:"Overview"}
            ,{type:"p",content:"To play ball clutch, you need to buy and choose a ball you want to use in the game, the default is ball 1 "+
                "To do that, click on the shop bag icon in the top navigation bar and this will open up a bottm navigation bar"+
                "click on the ball/marble and this will direct you to the shop, once there you can buy balls with coins and click select to bring them into the game "+
                "note you can only choose one ball lol \n\n"+
                "The game is pretty easy to understand, you need to keep the ball on the moving platform and make sure you don't fall off or else it is game over 🪦 \n\n"
            },
            {type:"h2",content:"Control"},
            {type:"p", content:"to control the ball, press A , D to roll it left and right \n"+
                "press W to jump from on platform to another"+
                "good luck 👍"
            }]
    },
    {
        gameNameIdentifier: "Pizza Slicer", 
        description: "just cut it 🍕",
        icon: pizza1,
        howToPlay:[{type:"h1",content:"Pizza Slicer Play Guide "},{type:"h2",content:"Overview"}
            ,{type:"p",content:"To play Pizza Slicer, you need to buy and choose a shuriken you want to use in the game to cut pizzas 🍕, the default is sk 1 "+
                "To do that, click on the shop bag icon in the top navigation bar and this will open up a bottm navigation bar"+
                "click on the peperoni pizza icon and this will direct you to the shop, once there you can buy shuriken with coins and click select to bring them into the game "+
                " \n\n"+
                "The goal of the game is to slice as many pizza as possible while makeing sure they don't fall to the bottom. \n\n" +
                "You will have 10 lives to begin, everytime you missed a pizza, you lost one life, and game is over when you lost all 10 lives"
            },
            {type:"h2",content:"Control"},
            {type:"p", content:"This game offer 2 ways of control mouse or hand tracking" +
                "At the start of each game you will be prompt with a choice to either open you camera to play with you hands or play with you mouse \n" +
                "❗Note that the video hand tracking mode does require some load on your device and make sure your device can handle this! \n" +
                "Now just swipe around the screen to cut some pizzas 💪" 

            }]
    }
];

export const  generalInfo = {
    description:[{type:"h1",content:"Welcome to STU GAME "},
        {type:"h2",content:"This is a mini game collection webite build currently by Andrew"},
        {type:"h1",content:"Contact Us 🗣️"},
        {type:"h2",content:"Wanna give suggestions on new games, UI impromvements, any new game item idea? Contact us at"},
        {type:"h1",content:"Instagram: "}
        
    ]

};