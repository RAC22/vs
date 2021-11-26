var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
		if (creep.memory.Target && creep.store[RESOURCE_ENERGY] != 0){
			creep.say('🚧 Repair');
				if(creep.repair(Game.getObjectById(creep.memory.Target)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(creep.memory.Target), {visualizePathStyle: {stroke: '#ffffff'}});
                }
		}else if (creep.memory.Target && creep.store[RESOURCE_ENERGY] == 0){
			creep.memory.Target = false
		}
		else{
			if((creep.memory.building || creep.memory.repairWall) && creep.store[RESOURCE_ENERGY] == 0) {
				creep.memory.building = false;
				creep.memory.repairWall = false;
				creep.say('🔄 harvest');
			}
			if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
				creep.memory.building = true;
				creep.say('🚧 build');
			}
			
			if(creep.memory.building || creep.memory.repairWall) {
				var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
				if (targets.length > 0){
					creep.memory.repairWall = false}
				if (targets.length == 0){
					creep.memory.building = false;
					creep.memory.repairWall = true;

					targets = creep.room.find(FIND_STRUCTURES, {
						filter: (s) => s.structureType == STRUCTURE_WALL
					 	
						&&	s.hits > 0
					});
					targets.sort(function (a, b) {
						return a.hits - b.hits;
					});
					
				}
				if(targets.length > 0 && !creep.memory.repairWall) {
					if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
						creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
					}
					}else if (creep.memory.repairWall){
						
						if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
							creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
						}
						var id = Game.getObjectById(targets[0].id);				
						creep.memory.Target = id.id;
					}
				}
				else {
					var cans = creep.room.find(FIND_STRUCTURES, {
						filter : (struct) => {
							return (struct.structureType == STRUCTURE_CONTAINER
								&& struct.store[RESOURCE_ENERGY] > 500
								)
						}
					});
					
					var closest = creep.pos.findClosestByPath(cans)
					
					if(closest){
						if(creep.withdraw(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
							creep.moveTo(closest, {visualizePathStyle: {stroke: '#ffffff'}});
						}
					}else{
						var sources = creep.room.find(FIND_SOURCES);
						if(creep.harvest(sources[creep.memory.sourceNum]) == ERR_NOT_IN_RANGE) {
							creep.moveTo(sources[creep.memory.sourceNum], {visualizePathStyle: {stroke: '#ffaa00'}});
						// }else{
						// 	if(creep.harvest(sources[creep.memory.sourceNum + 1]) == ERR_NOT_IN_RANGE) {
						// 		creep.moveTo(sources[creep.memory.sourceNum + 1], {visualizePathStyle: {stroke: '#ffaa00'}});
						// 	}else{
						// 		if(creep.harvest(sources[creep.memory.sourceNum - 1]) == ERR_NOT_IN_RANGE) {
						// 			creep.moveTo(sources[creep.memory.sourceNum - 1], {visualizePathStyle: {stroke: '#ffaa00'}});
						// 		}
						// 	}
						}
					}			
				}
			}
	}
};

module.exports = roleBuilder;