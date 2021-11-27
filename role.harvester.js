var roleHarvester = {

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
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[creep.memory.sourceNum]) == ERR_NOT_IN_RANGE) {
                creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD)
                creep.moveTo(sources[creep.memory.sourceNum], {visualizePathStyle: {stroke: '#ffaa00'}});
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
            }
        }
	}
};

module.exports = roleHarvester;