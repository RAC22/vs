
var utilities = {

    workerPart : function(role, room){
        
        var energyAvail = Game.rooms[room].energyAvailable
        
        function defaultParts() {
            var numOfWorkerParts = Math.floor(energyAvail / 200)
            let arrayToReturn = []
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
                if(energyAvail >= 1100){
                    var array = [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,CARRY,CARRY,CARRY]
                }else{
                    var array = [WORK,WORK,WORK,WORK,WORK,WORK,MOVE,CARRY,CARRY,CARRY]
                }                
                return array
            case 'scavenger' : 
                var array = [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
                return array
            case 'claimer' :
                var array = [CLAIM,MOVE,MOVE,MOVE]
                return array 
            case 'defender' :
                var array = [ATTACK,MOVE]
                return array
            case 'storageDisperser' :
                var array = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
                return array
                
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