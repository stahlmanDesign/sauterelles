ig.module(
	'game.entities.introscreen'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityIntroscreen = ig.Entity.extend({
	size: {x: 240, y: 160},
    offset: {x: 0, y: 0},
	maxVel: {x: 50, y: 200},
	friction: {x: 150, y: 0},
	
	type: ig.Entity.TYPE.B, // Evil enemy group
	checkAgainst: ig.Entity.TYPE.A, // Check against friendly
	collides: ig.Entity.COLLIDES.PASSIVE,
	
    
	animSheet: new ig.AnimationSheet( 'media/screen.png', 240, 160 ),
	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim( 'intro', 1, [0] );
        
        this.reproduceTimer = new ig.Timer(0);
        
        
	},
	
	
	update: function() {
		//
        
	}	
		
	
});

});