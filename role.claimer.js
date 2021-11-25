var roleClaimer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var targetRoom = new RoomPosition(38, 37, 'W19N16')
        var controller = creep.room.controller
        if(creep.claimController(controller) != 0){
            creep.moveTo(targetRoom)
            creep.signController(controller, "Hi =]")
        }
    }        
	
};

module.exports = roleClaimer;