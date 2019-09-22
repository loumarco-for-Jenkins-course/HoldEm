// Utility to list cards - not used in app: more for debugging
function listInfo( ) {
	console.log("Community Cards") ;
	for ( var idx = 0; idx < commCards.length; idx++ ) 
		console.log( commCards[ idx ] ) ;
	console.log( "\nPlayer Hands\n") ;	
	for ( var pidx = 0; pidx < playerHands.length; pidx++ ) 
		for ( cidx = 0; cidx < playerHands[ pidx ].length; cidx++ ) 
			console.log( playerHands[ pidx ] [cidx ] ) ;
}

function listImageFileNames( ) {
	for ( var imIDX = 0; imIDX < images.length; imIDX++ )
		console.log( images[ imIDX ].src ) ;
}
// Preload the card images
function preload(  )
{
	var sources = genImageFileNames( ) ;

	for (i = 0; i < sources.length; ++i) {
	 images[i] = new Image();
	 images[i].src = sources[i];
	}
	// This function generates the image file names
	function genImageFileNames( ) {
		var fileNames = [] ;
		var suits = ["clubs", "diamonds", "hearts", "spades"] ;
		var ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, "jack", "queen", "king", "ace" ] ;
		for ( suitIDX = 0; suitIDX < suits.length; suitIDX++ )
			for ( rankIDX = 0; rankIDX < ranks.length; rankIDX++ ) 
				fileNames[ ranks.length * suitIDX + rankIDX ] = 
					"cardimages\\" + ranks[ rankIDX ] + "_of_" + suits[ suitIDX ] + ".png" ;	
		return fileNames ;
	} 
}
// Return a random number between 0 and 51 (select a card)
// Use that number to fetch a card from the images array
// PULL THAT CARD FROM THE IMAGES ARRAY!! (Once a card is dealt, it's not in the deck)
function selectACard( ) {
	var cardIDX = Math.floor( Math.random( ) * images.length ) ;
	var card = images[ cardIDX  ] ;
	// Pull that card....
	images.splice( cardIDX, 1 ) ;
	// return card...
	return card.src ;
}
// Generate a table data cell showing a card
function cellWithCardImage( cardImage ) {
	return "<td><img src='" + cardImage + "' height='72' width='72'></td>" ;
}
// Generate a table data cell showing player money. 
function cellWithMoney( money, playerid ) {
	return "<td id='"+ playerid + "'>Player has: $" + money + "</td>" ;
}
// Show the flop....
function showFlop(  ) {
// Create top table showing community cards
	// Show the flop (turn, river)
	var commCardTable = "<table border='2'><caption>Community Cards</caption>" ;
	commCardTable += "<tr>" ;
	for ( cIDX = 0; cIDX < 3; cIDX++ ) {
		// Add card to community card array
		commCards.push( selectACard( ) ) ;
		// Change display table string
		commCardTable += cellWithCardImage( commCards[ commCards.length - 1 ] )  ; // faster than commCards.slice(-1)[0];
	}
	// End row, table and display
	commCardTable += "</tr></table>" ;
	document.getElementById( "commcardtable" ).innerHTML = commCardTable ;	
	// Disable 'flop' button; enable 'turn' button
	document.getElementById( 'flop' ).disabled = true ;
	document.getElementById( 'turn' ).disabled = false ;
}
// Deal the hand to entered number of players
// Construct action buttons in other columns to the right of cards
// Show/initialize monies for each player
function dealToPlayers( ) {
	var pIDX, idNum ;
	// Create table holding player cards and check, raise, bet, fold buttons
	var playerHandsTable = "<table border='2'><caption>Player Info</caption>" ;
	// A row for each player - remember to include ID parm for later access
	for (pIDX = 0; pIDX < playerHands.numPlayers; pIDX++ ) {
		// Use this to append to ID's of various buttons/fields
		idNum = pIDX + 1 ;
		// See setUpPlayerInfo in poker.html - where I fucked up by using 1 and 0-basing...
		idNum = pIDX ;
		
		
		// Two cards each.....
		playerHandsTable += "<tr id='P" + (pIDX + 1) + "'><td>Player " + idNum + "</td>" ;
		// Two cards each player
		for ( cIDX = 0; cIDX < 2; cIDX++ ) {
			// Fetch card, add to player hand
			playerHands[ pIDX ].cards[ cIDX ] = selectACard( ) ;
			// Append cell to table
			playerHandsTable += cellWithCardImage( playerHands[ pIDX ].cards[ cIDX ] )  ; 
		}
		// Put in the check/raise/bet/fold buttons
		playerHandsTable += cellWithBettingButtons( idNum ) ;
		// Put in money for this player (for now, give each player $1,000)
		playerHands[ pIDX ].money = 1000 ;
		// Do something with the ID - find a better place to define it
		playerHandsTable += cellWithMoney( playerHands[ pIDX ].money, "money" + idNum  ) ;
		// Close row
		playerHandsTable += "</tr>" ;	
	}
	// Close table string, display table
	playerHandsTable += "</table>" ;	
	document.getElementById( "playerhandtable" ).innerHTML = playerHandsTable ;	
}
// Need to enable/disable player buttons based on:
// The player ID (ID=3 cannot bet until ID=2 has, etc)
// The first player has all buttons enabled
// Once a player folds all their buttons are disabled (Don't remove player; want the player there for future deals)
// Create table data cell with raise, call, check, fold buttons
// Don't know why I cannot disable/enable buttons with 'disable=true/false': seems disabled='false' does NOT enable(???)
// Must be this DOM loading thing or whatever...
function cellWithBettingButtons( idNum ) {
	// Enable this player's buttons
	var enableOrDisable = (idNum !== getCurrentPlayer())? "disabled='true'" : "" ;
	// click handlers... for now
	var callHandler  = 'call( ' + idNum + ' );' ;
	var raiseHandler = 'raise(  ' + idNum + ' );' ;
	var checkHandler = 'check(  ' + idNum + ' );' ;
	var foldHandler  = 'fold(  ' + idNum + ' );' ;
	console.log("id = " + idNum + "  disabled? " + enableOrDisable) ;
	
	var buttonCell = "<td id='betbuttons" + idNum + "'><input type='button' value='CALL' "  + enableOrDisable + " onclick='" + callHandler + "'><br> " +
					     "<input type='button' value='RAISE' " + enableOrDisable + " onclick='" + raiseHandler + "'><br>" +
					     "<input type='button' value='CHECK' " + enableOrDisable + " onclick='" + checkHandler + "'><br>" +
					     "<input type='button' value='FOLD'  " + enableOrDisable + " onclick='" + foldHandler + "'></td>" ;
	
	/*var buttonCell = "<td><input type='button' value='CALL' onclick='" + callHandler + "'><br> " +
	 "<input type='button' value='RAISE'  onclick='" + raiseHandler + "'><br>" +
	 "<input type='button' value='CHECK'   onclick='" + checkHandler + "'><br>" +
	 "<input type='button' value='FOLD'   onclick='" + foldHandler + "'></td>" ;*/
	
	//console.log( buttonCell ) ;
	return buttonCell;
}
// Return the ID of the current player (the one that must make a bet/raise/check/fold)
function getCurrentPlayer( ) {
	return playerHands.currentPlayer ; 
}
// Set the current player...
function setCurrentPlayer( idNum ) {
	playerHands.currentPlayer = idNum ;
}
// CALL the bet. 
// Add bet amount (bet) to pot; deduct from current player's holding (assume player has $ to cover bet)
// disable current player's buttons; enable next player's buttons
function call( idNum ) {
	console.log("In CALL - idNum is " + idNum ) ;
	
	playerHands[ idNum ].money -= bet ;
	pot                        += bet ;
	// Update player's displayed money amount
	document.getElementById( "money" + idNum ).innerHTML = cellWithMoney( playerHands[ idNum ].money, "money" + idNum  ) ;
	// Update pot/bet amount (bet amount stays the same...)
	showPotBetAmount( pot, bet ) ;
	// Set next player as current
	//setCurrentPlayer( ( idNum == playerHands.numPlayers)? 1: idNum + 1 ) ;
	
	setCurrentPlayer( (idNum + 1) % playerHands.numPlayers ) ;
	
	// Disable previous player's buttons...
	document.getElementById( "betbuttons" + idNum ).innerHTML               = cellWithBettingButtons( idNum ) ;
	// Enable current player's buttons
	document.getElementById( "betbuttons" + getCurrentPlayer() ).innerHTML  = cellWithBettingButtons( getCurrentPlayer() ) ;
	 
}




//These are the player hands (2 - 7) and $$$
//playerHands[ N ].money, playerHands[ N ].cards, playerHands[ N ].playerid
//For money, the ID for the table data cell is 'money+playerHands[ n ]'
//playerHands.numPlayers too
//playerHands.currentPlayer is the player whose turn it is to bet/traise/check/fold










