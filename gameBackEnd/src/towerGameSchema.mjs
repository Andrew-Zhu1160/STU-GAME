import mongoose from 'mongoose';

const towerGameSchema= new mongoose.Schema({
    Name:{type:String,default:'unknown',unique:true},

    towerLv1:{
        damage:{type:Number,default:45},
        fireDelay:{type:Number,default:1000},
        appearance:{type:String,default:'towerLv1.png'},
        numOfBulletsPerRound:{type:Number,default:1},
        bulletAppearance:{type:String,default:'tower1Bullet.png'},
        cost:{type:Number,default:5000},

        hp:{type:Number,default:1000}
    },
    towerLv2:{
        damage:{type:Number,default:50},
        fireDelay:{type:Number,default:500},
        appearance:{type:String,default:'towerLv2.png'},
        numOfBulletsPerRound:{type:Number,default:1},
        bulletAppearance:{type:String,default:'tower1Bullet.png'},
        cost:{type:Number,default:10000},

        hp:{type:Number,default:3000}
    },
    towerLv3:{
        damage:{type:Number,default:120},
        fireDelay:{type:Number,default:500},
        appearance:{type:String,default:'towerLv3.png'},
        numOfBulletsPerRound:{type:Number,default:1},
        bulletAppearance:{type:String,default:'tower1Bullet.png'},
        cost:{type:Number,default:14000},

        hp:{type:Number,default:7000}
    },
    towerLv4:{
        damage:{type:Number,default:300},
        fireDelay:{type:Number,default:1100},
        appearance:{type:String,default:'towerLv4.png'},
        numOfBulletsPerRound:{type:Number,default:2},
        bulletAppearance:{type:String,default:'tower4Bullet.png'},
        cost:{type:Number,default:20000},

        hp:{type:Number,default:10500}
    },
    towerLv5:{
        damage:{type:Number,default:250},
        fireDelay:{type:Number,default:1100},
        appearance:{type:String,default:'towerLv5.png'},
        numOfBulletsPerRound:{type:Number,default:4},
        bulletAppearance:{type:String,default:'tower4Bullet.png'},
        cost:{type:Number,default:25000},

        hp:{type:Number,default:16000}
    },
    towerLv6:{
        damage:{type:Number,default:500},
        fireDelay:{type:Number,default:900},
        appearance:{type:String,default:'towerLv6.png'},
        numOfBulletsPerRound:{type:Number,default:4},
        bulletAppearance:{type:String,default:'tower6Bullet.png'},
        cost:{type:Number,default:32000},

        hp:{type:Number,default:24000}
    },
    towerLv7:{
        damage:{type:Number,default:700},
        fireDelay:{type:Number,default:810},
        appearance:{type:String,default:'towerLv7.png'},
        numOfBulletsPerRound:{type:Number,default:4},
        bulletAppearance:{type:String,default:'tower6Bullet.png'},
        cost:{type:Number,default:39000},

        hp:{type:Number,default:30000}
    },
    towerLv8:{
        damage:{type:Number,default:850},
        fireDelay:{type:Number,default:620},
        appearance:{type:String,default:'towerLv8.png'},
        numOfBulletsPerRound:{type:Number,default:6},
        bulletAppearance:{type:String,default:'tower6Bullet.png'},
        cost:{type:Number,default:49000},

        hp:{type:Number,default:40000}
    },
    towerLv9:{
        damage:{type:Number,default:1300},
        fireDelay:{type:Number,default:340},
        appearance:{type:String,default:'towerLv9.png'},
        numOfBulletsPerRound:{type:Number,default:8},
        bulletAppearance:{type:String,default:'tower9Bullet.png'},
        cost:{type:Number,default:70000},

        hp:{type:Number,default:71000}
    },
    towerLv10:{
        damage:{type:Number,default:2100},
        fireDelay:{type:Number,default:170},
        appearance:{type:String,default:'towerLv10.png'},
        numOfBulletsPerRound:{type:Number,default:8},
        bulletAppearance:{type:String,default:'tower10Bullet.png'},
        cost:{type:Number,default:1100000},

        hp:{type:Number,default:150000}
    },
    //edit here to add more tower
    //.........................
    enemyLv1:{
        hp:{type:Number,default:100},
        appearance:{type:String,default:'enemyLv1.png'},
        takeDmgAppearance:{type:String,default:'enemyLv1TakeDmg.png'},
        baseSpeed:{type:Number,default:1},
        coinDrop:{type:Number,default:200},
        attackDmg:{type:Number,default:100}

    },
    enemyLv2:{
        hp:{type:Number,default:150},
        appearance:{type:String,default:'enemyLv2.png'},
        takeDmgAppearance:{type:String,default:'enemyLv2TakeDmg.png'},
        baseSpeed:{type:Number,default:1.05},
        coinDrop:{type:Number,default:400},
        attackDmg:{type:Number,default:300}
    },
    enemyLv3:{
        hp:{type:Number,default:450},
        appearance:{type:String,default:'enemyLv3.png'},
        takeDmgAppearance:{type:String,default:'enemyLv3TakeDmg.png'},
        baseSpeed:{type:Number,default:1.07},
        coinDrop:{type:Number,default:850},
        attackDmg:{type:Number,default:600}

    },
    enemyLv4:{
        hp:{type:Number,default:1200},
        appearance:{type:String,default:'enemyLv4.png'},
        takeDmgAppearance:{type:String,default:'enemyLv4TakeDmg.png'},
        baseSpeed:{type:Number,default:1.1},
        coinDrop:{type:Number,default:1200},
        explodeAppearance:{type:String,default:'enemyLv4Death.png'},
         attackDmg:{type:Number,default:1200}

    },


    enemySpawningHole:{type:String,default:'enemySpawningHole.png'},

    gameBackground:{
        background1:{type:String,default:'towerGameBackground.png'},
        background2:{type:String,default:'towerGameBackground2.png'},
        background3:{type:String,default:'towerGameBackground3.png'},
        background4:{type:String,default:'towerGameBackground4.png'},
    }






});
const TowerGameConfig = mongoose.model('TowerGameConfig',towerGameSchema);
export default TowerGameConfig