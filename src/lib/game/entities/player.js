ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityPlayer = ig.Entity.extend({
	
	// The players (collision) size is a bit smaller than the animation
	// frames, so we have to move the collision box a bit (offset)
	size: {x: 4, y:14},
	offset: {x: 9, y: 6},
	
	maxVel: {x: 100, y: 200},
	friction: {x: 600, y: 0},
	
	type: ig.Entity.TYPE.A, // Player friendly group
	checkAgainst: ig.Entity.TYPE.B,
	collides: ig.Entity.COLLIDES.PASSIVE,
	
	animSheet: new ig.AnimationSheet( 'media/bonhomme1.png', 20, 20 ),	
	
	
	// These are our own properties. They are not defined in the base
	// ig.Entity class. We just use them internally for the Player
	flip: false,
	accelGround: 400,
	accelAir: 200,
	jump: 200,
	health: 500,
	flip: false,
	canClimb: false,
    isClimbing: false,
    momentumDirection: {'x':0,'y':0},
    ladderReleaseTimer: new ig.Timer(0.0),
    
    ladderSpeed: 75,
    
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		        
		// Add the animations
		this.addAnim( 'idle', 1, [0] );
		this.addAnim( 'run', 0.07, [0,1,2,3,4,5] );
		this.addAnim( 'jump', 1, [9] );
		this.addAnim( 'fall', 0.4, [6,7] );
        this.addAnim( 'climbUp', 0.07, [0,1,2,3,4,5] );
        this.addAnim( 'climbDown', 0.07, [0,1,2,3,4,5] );
        
        this.zIndex = -99;
		//don't resort if in weltmeister
		if (!ig.global.wm)ig.game.sortEntitiesDeferred(); 
	},
	update: function() {
		
		// move left or right
		var accel = this.standing ? this.accelGround : this.accelAir;
		if( ig.input.state('left') ) {
			this.accel.x = -accel;
			this.flip = true;
            if (!this.canClimb)this.isClimbing=false; // don't allow moving horizontally off the while in climbing mode
		}
		else if( ig.input.state('right') ) {
			this.accel.x = accel;
			this.flip = false;
            if (!this.canClimb)this.isClimbing=false; // don't allow moving horizontally off the while in climbing mode
		}
		else {
			this.accel.x = 0;
		}         
        
                
           
        
        if( this.canClimb && (ig.input.pressed('up') ||  ig.input.pressed('down' )) ) {           
            
            this.isClimbing=true;
            this.ladderReleaseTimer.set(0.0); // allow to cling to ladder instead of jumping past, if up or down pressed
            
            this.vel.x = 0; // don't fall off sides of ladder unintentionally
            
            //momentumDirection allows for up, down and idle movement (-1, 0 & 1) so you can stop on ladders
            if (ig.input.pressed('up')) {
                this.momentumDirection.y >-1 ? this.momentumDirection.y -- : this.momentumDirection.y = -1;
                
            }else if( ig.input.pressed('down' )){
                this.momentumDirection.y <1 ? this.momentumDirection.y ++ : this.momentumDirection.y = 1;
            }
        }                
                                
		// jump
		if( (this.standing || this.isClimbing || this.canClimb) && (ig.input.pressed('jump') ) ) {
			this.vel.y = -this.jump;
            
            //allow to jump off ladders
            this.ladderReleaseTimer.set(0.5); // approximate seconds your player takes to jump and fall back down
            this.isClimbing=false;
        }
        
        //when climbing past top of ladder, the entity falls back softly and can walk left or right
        if (!this.standing && !this.canClimb && this.vel.y < 0)this.isClimbing=false;
        
        
        // prevent fall down ladder if ground touched but ladderReleaseTimer still running from recent jump
        if (this.standing)this.ladderReleaseTimer.set(0.0);
                		
		// shoot
		if( ig.input.pressed('shoot') ) {
			ig.game.spawnEntity( EntitySpray, this.pos.x, this.pos.y+2, {flip:this.flip} );
		}
		
		// set the current animation, based on the player's speed
		if( this.vel.y < 0 ) {
			this.currentAnim = this.anims.jump;
            //console.log(this.vel.y)
		}
		else if( this.vel.y > 0 ) {
			this.currentAnim = this.anims.fall;
                
		}
		else if( this.vel.x != 0 ) {
			this.currentAnim = this.anims.run;
		
		}else {
			this.currentAnim = this.anims.idle;
		}
        
        if ( this.vel.y < 0 && this.isClimbing && this.momentumDirection.y == -1){
            this.currentAnim = this.anims.climbUp; // create your own climbing animations
            
        }else if ( this.vel.y > 0 && this.isClimbing && this.momentumDirection.y == 1){
            this.currentAnim = this.anims.climbDown; // create your own climbing animations
            
        }
        
		this.currentAnim.flip.x = this.flip;
                
		// move!
        this.parent();
        
	}
    
});


// The grenades a player can throw are NOT in a separate file, because
// we don't need to be able to place them in Weltmeister. They are just used
// here in the code.

// Only entities that should be usable in Weltmeister need to be in their own
// file.
EntitySpray = ig.Entity.extend({
	size: {x: 12, y: 12},
	offset: {x: 6, y: 6},
	maxVel: {x: 200, y: 200},
	sprayTimer: new ig.Timer(0.0),
	
	// The fraction of force with which this entity bounces back in collisions
	bounciness: 0.2, 
	
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.B, // Check Against B - our evil enemy group
	collides: ig.Entity.COLLIDES.PASSIVE,
		
	animSheet: new ig.AnimationSheet( 'media/sprites.png', 24, 24 ),
	
	bounceCounter: 0,
	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
		this.vel.y = -20;
		this.addAnim( 'idle', 0.05, [5,6,7,8,9] );
        this.gravityFactor=0.3;
        this.sprayTimer.set(0.2);
	},
	
    update:function(){
        if (this.sprayTimer.delta() > 0){
            this.kill(); // kill spray
            this.sprayTimer.set(0.2)
            console.log(this.sprayTimer.delta());
        }
        this.parent();
    },
	handleMovementTrace: function( res ) {
		this.parent( res );
		if( res.collision.x || res.collision.y ) {
			
			// only bounce 1 times
			this.bounceCounter++;
			if( this.bounceCounter > 1 ) {
				this.kill();
			}
		}
	},
	
	// This function is called when this entity overlaps anonther entity of the
	// checkAgainst group. I.e. for this entity, all entities in the B group.
	check: function( other ) {
		if (other instanceof EntityLadder || other instanceof EntityMover){
            // don't kill ladder
            
        }else{
            other.receiveDamage( 2, this );
            other.speed*=0.5;
            other.jump*=0.5;
            this.kill();
        }
        
        
	}	
});

// Shrapnel particles
// 	Cosmetic particle effects
// The Impact API says:
//	Objects that don't need to be placed in Weltmeister don't need their own file
EntityShard = ig.Entity.extend({
	size: {x: 6, y: 6},
	maxVel: {x: 80, y: 50},
	
	bounciness: 0.1, 
	
	type: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.PASSIVE,
		
	animSheet: new ig.AnimationSheet( 'media/shard1.png', 8, 8),
	
	bounceNum: 0,
	
	// This method is called only once on creation
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.vel.x = settings;
		this.vel.y = -150+Math.floor(Math.random()*-49);
		this.addAnim( 'fly', 0.1+Math.floor(Math.random()*3)/10, [0,1,2,3] );
		this.currentAnim.frame = Math.floor(Math.random()*4);
	},
		
	handleMovementTrace: function( res ) {
		this.parent( res );
		if( res.collision.x || res.collision.y ) {
			
			// only bounce 1 times
			this.bounceNum++;
			if( this.bounceNum > 1 ) {
				this.kill();
			}
		}
	}	
});


});