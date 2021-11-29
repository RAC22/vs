var roleStorageDisperser = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.energized && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.energized = false;
            creep.say('🔄 withdraw');
	    }
        if(!creep.memory.energized && creep.store.getFreeCapacity() == 0) {
	        creep.memory.energized = true;
	        creep.say('⚡ energized');
	    }

	    if(!creep.memory.energized) {
            var storage = creep.room.find(FIND_STRUCTURES, {filter : {structureType: STRUCTURE_STORAGE}});
    
            if(creep.withdraw(storage[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && 
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }else{
                var upgradeContainer = creep.room.find(FIND_STRUCTURES, {
                    filter: { structureType: STRUCTURE_CONTAINER }
                })[2];
                if(upgradeContainer.store.getFreeCapacity(RESOURCE_ENERGY) >= creep.store.getUsedCapacity(RESOURCE_ENERGY)){
                    if(creep.transfer(upgradeContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(upgradeContainer, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }                
            }
        }
	}
};

module.exports = roleStorageDisperser;