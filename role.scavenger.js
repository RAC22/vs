var roleScavenger = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.energized && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.energized = false;
            creep.say('🔄 harvest');
	    }
        if(!creep.memory.energized && creep.store.getFreeCapacity() == 0) {
	        creep.memory.energized = true;
	        creep.say('⚡ energized');
	    }

	    if(!creep.memory.energized) {
            //room and position next to source to scavenge
            roomToScavenge = new RoomPosition(45,12, 'W19N15')
            if(creep.pos.x != roomToScavenge.x || creep.pos.y != roomToScavenge.y || creep.pos.roomName != roomToScavenge.roomName){
                
                creep.moveTo(roomToScavenge)
            }else{
                var sources = creep.room.find(FIND_SOURCES)
                if(creep.harvest(sources[0]) != 0){
                    creep.harvest(sources[1])
                }
            }
            
        }
        else {
            
            // if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            // }

            var homeRoom = new RoomPosition(25,25, 'W19N16')
            
            if(creep.pos.roomName != homeRoom.roomName){
                creep.moveTo(homeRoom)
            }else{
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
	}
};

module.exports = roleScavenger;