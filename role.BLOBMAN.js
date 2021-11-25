var roleBLOBMAN = {

    /** @param {Creep} creep **/
    run: function(creep) {

        target = new RoomPosition(4, 27, 'W17N16')
        
        if(creep.pos.x != target.x || creep.pos.y != target.y || creep.pos.roomName != target.roomName){
            console.log('BLOBMAN MOVE?')
            creep.moveTo(target)
        }else{
            console.log('BLOBMAN HEAL?')
            console.log(creep.heal(creep) + " heal return code")
        }
        
            
        
        console.log('BLOBMAN POSITION = '+ creep.pos + ' and HEALTH = ' + creep.getActiveBodyparts(TOUGH))
	}
};

module.exports = roleBLOBMAN;