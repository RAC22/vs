
var utilities = {

    workerPart : function(role, room){
        
        var energyAvail = Game.rooms[room].energyAvailable
        var energyCapacity = Game.rooms[room].energyCapacityAvailable
        
        function defaultParts() {
            var numOfWorkerParts = Math.floor(energyAvail / 200)
            var arrayToReturn = []
            for (let i = 0; i < (numOfWorkerParts); i++){
                if (i === 5) { break; }
                arrayToReturn.push(WORK,CARRY,MOVE)
            }
            return arrayToReturn;
        }
        
        switch (role){
            case 'harvester' :
                return defaultParts();
            case 'builder' : 
                return defaultParts();
            case 'repair' :
                return defaultParts();  
            case 'upgrader' : 
                return defaultParts();
            case 'dumpHarvester' :
                var array = [WORK,WORK,WORK,WORK,WORK,MOVE]
                return array

            case 'runner' :
                var array = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
                return array

            case 'fatUpgrader' :
                var upgraderParts = Math.floor((energyCapacity - 200) / 100)
                var arrayToReturn = [MOVE,MOVE,CARRY,CARRY]
                for (let i = 0; i < (upgraderParts); i++){
                        if (i === 10) { break; }
                        arrayToReturn.push(WORK)
                    }
                return arrayToReturn;
                
            case 'scavenger' : 
                var array = [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
                return array

            case 'claimer' :
                var array = [CLAIM,MOVE,MOVE,MOVE]
                return array 

            case 'defender' :
                var array = [TOUGH,ATTACK,MOVE,MOVE]
                return array

            case 'storageDisperser' :
                var disperserParts = Math.floor(energyCapacity / 100)
                var arrayToReturn = []
                for (let i = 0; i < (disperserParts); i++){
                        if (i === 15) { break; }
                        arrayToReturn.push(CARRY,MOVE)
                    }
                return arrayToReturn;
                
            default :
                console.log('HEY ROLE IS WRONG FOO ' + role)
        }        
    },

    spawnNumToggler : function (spawn, role) {
        if(spawn.memory.sourceNum == 1){
            spawn.memory.sourceNum = 0
        }else if (spawn.memory.sourceNum == 0){
            spawn.memory.sourceNum = 1
        }else{spawn.memory.sourceNum = 0}

        if(role == 'dumpHarvester'){
            if(spawn.memory.canNum == 1){
                spawn.memory.canNum = 0
            }else if (spawn.memory.canNum == 0){
                spawn.memory.canNum = 1
            }else{spawn.memory.canNum = 0}
        }
    },
    // takes a creep object, and an instance of a RoomPosition object
    sendToOtherRoom : function (creep, roomTo) {
        creep.moveTo(roomTo)
    }
}
module.exports = utilities;