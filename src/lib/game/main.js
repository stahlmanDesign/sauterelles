ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	
	'game.entities.player',
	'game.entities.spike',
    'game.entities.blocker',
    'game.entities.pin-trigger',
    'game.entities.mover',
    'game.entities.ladder',
    'game.levels.intro',
	'game.levels.test'
    //'impact.debug.debug'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	gravity: 300, // All entities are affected by this
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
    fontWin: new ig.Font( 'media/04b03.font.png' ),
    fontLose: new ig.Font( 'media/04b03.font.png' ),
    fontRestart: new ig.Font( 'media/04b03.font.png' ),
	numSauterelles: 0,
    numSauterellesmini: 0,
    numKilled: 0,
	loserMessage: "",
    winnerMessage: "",
    restartMessage: "",
    loadingScreen: true,
    clickToPlay: 0,
    
	init: function() {
		// Bind keys
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
        
        ig.input.bind( ig.KEY.UP_ARROW, 'up' );
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
		ig.input.bind( ig.KEY.X, 'jump' );
		ig.input.bind( ig.KEY.C, 'shoot' );
        ig.input.bind( ig.KEY.SPACE, 'spacebar' );
        ig.input.bind( ig.KEY.ENTER, 'enter' );
        ig.input.bind( ig.KEY.MOUSE1, 'click1' );
		
		// Load the LevelTest as required above ('game.level.test')
		this.loadLevel( LevelIntro );
        this.loadingScreen = true;
        
	},
	
	update: function() {
    var player = this.getEntitiesByType( EntityPlayer )[0];
    
   if (this.loadingScreen && ig.input.pressed('click1')) this.clickToPlay ++;
   
    if( this.loadingScreen == true && (this.clickToPlay > 0 || ig.input.pressed('shoot') || ig.input.pressed('jump') || ig.input.pressed('up')
                                    || ig.input.pressed('down') || ig.input.pressed('left') || ig.input.pressed('right'))) {
        
        ig.game.loadLevelDeferred( LevelTest );
        this.loadingScreen = false;
    }
    
    var playerOK = false;
    if (player)playerOK=true;
       
    // you are on main level and you win
    if (this.loadingScreen == false  && (this.numSauterelles+this.numSauterellesmini) <= 0){
        
        this.loserMessage = "";
        this.winnerMessage = "Retour a la normale... pour aujourd'hui";
        this.restartMessage = "Cliquez espace pour recommencer";
        
        
    }else if (this.loadingScreen == false && playerOK == false){
        this.loserMessage = "L'invasion de sauterelles est hors de controle!";
        this.winnerMessage = "";
        this.restartMessage = "Cliquez sur espace pour recommencer";
        
    }else{
    
        this.loserMessage = "";
        this.winnerMessage = "";
        this.restartMessage = "";
    }
    
    //spacebar after lose
    if( this.loadingScreen == false && ig.input.pressed('spacebar') && playerOK==false)   {
        
        ig.game.loadLevelDeferred( LevelIntro );
        this.loadingScreen = true;
        this.numSauterelles = 0;
        this.numSauterellesmini = 0;
        this.numKilled = 0;
        
    } 
    
    //spacebar after win
    if( this.loadingScreen == false && ig.input.pressed('spacebar') && (this.numSauterelles+this.numSauterellesmini) <= 0 && playerOK==true)   {
        
        ig.game.loadLevelDeferred( LevelIntro );
        this.loadingScreen = true;
        this.numSauterelles = 0;
        this.numSauterellesmini = 0;
        this.numKilled = 0;
        
    }   

        
        
    //ig.show('entities',ig.game.entities.length);
		
		// Update all entities and BackgroundMaps
		this.parent();
		
		// screen follows the player
		var player = this.getEntitiesByType( EntityPlayer )[0];
		if( player ) {
			this.screen.x = player.pos.x - ig.system.width/2;
			this.screen.y = player.pos.y - ig.system.height/2;
		}
        
    
    },
	
	draw: function() {
		// Draw all entities and BackgroundMaps
		this.parent();
		
		var player = this.getEntitiesByType( EntityPlayer )[0];
        
        if (this.loadingScreen == false){
            this.font.draw( 'Sauterelles mortes:'+this.numKilled+'  vivantes:'+(this.numSauterelles+this.numSauterellesmini), 2, 2 );
            if (player)this.fontWin.draw( 'Sante:'+player.health, 2, 10 );
            else this.fontLose.draw( this.loserMessage, 20, 50 );
        
            this.fontWin.draw( this.winnerMessage, 50, 50 );
            this.fontRestart.draw( this.restartMessage, 50, 58 );
        }
    }
});


// Start the Game with 60fps, a resolution of 240x160, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 240, 160, 2 );

});
