pragma solidity ^0.4.2;

contract Atleth {
   address public owner;
   uint256 public minimumBet;
   uint256 public totalBetOne;
    uint256 public totalBetTwo;
   uint256 public numberOfBets;
   uint256 public maxAmountOfBets = 1000;

   address[] public players;

   struct Player {
      uint256 amountBet;
      uint16 teamSelected;
   }

   // The address of the player and => the user info
   mapping(address => Player) public playerInfo;

   function() public payable {}

   function Atleth() public {
      owner = msg.sender;
      minimumBet = 100000000000000;
   }

   function kill() public {
      if(msg.sender == owner) selfdestruct(owner);
   }

   function checkPlayerExists(address player) public constant returns(bool){
      for(uint256 i = 0; i < players.length; i++){
         if(players[i] == player) return true;
      }
      return false;
   }


   // To bet for a number between 1 and 10 both inclusive
   function bet(uint8 _teamSelected) public payable {
      require(!checkPlayerExists(msg.sender));
      require(msg.value >= minimumBet);
      playerInfo[msg.sender].amountBet = msg.value;
      playerInfo[msg.sender].teamSelected = _teamSelected;
      numberOfBets++;
      players.push(msg.sender);
      if ( _teamSelected == 1){
          totalBetOne += msg.value;
      }
      else{
          totalBetTwo += msg.value;
      }
   }
   // Generates a number between 1 and 10 that will be the winner

   // Sends the corresponding ether to each winner depending on the total bets
   function distributePrizes(uint16 teamWinner) public {
      address[1000] memory winners; // We have to create a temporary in memory array with fixed size
      uint256 count = 0; // This is the count for the array of winners
      uint256 LoserBet = 0;
      uint256 WinnerBet = 0;
      for(uint256 i = 0; i < players.length; i++){
         address playerAddress = players[i];

         if(playerInfo[playerAddress].teamSelected == teamWinner){
            winners[count] = playerAddress;
            count++;
         }
      }

      if ( teamWinner == 1){
         LoserBet = totalBetTwo;
         WinnerBet = totalBetOne;
      }
      else{
          LoserBet = totalBetOne;
          WinnerBet = totalBetTwo;
      }

      for(uint256 j = 0; j < count; j++){
         if(winners[j] != address(0)) // Check that the address in this fixed array is not empty
            address add = winners[j];
            uint256 bet = playerInfo[add].amountBet;

            winners[j].transfer(    (bet*(10000+(LoserBet*10000/WinnerBet)))/10000 );
      }
      delete playerInfo[playerAddress]; // Delete all the players
      players.length = 0; // Delete all the players array
      totalBetOne = 0;
      totalBetTwo = 0;
   }

   function Odd(uint16 teamWinner) public view returns(uint256){
      uint256 WinnerBet = 0;
      uint256 LoserBet = 0;
      for(uint256 i = 0; i < players.length; i++){
         address playerAddress = players[i];
         if(playerInfo[playerAddress].teamSelected == teamWinner){
            WinnerBet += playerInfo[playerAddress].amountBet;
         }
      }
    if ( teamWinner == 1){
         LoserBet = totalBetTwo;
         WinnerBet = totalBetOne;
      }
      else{
          LoserBet = totalBetOne;
          WinnerBet = totalBetTwo;
      }
      uint256 cote = 1+(LoserBet*10000/WinnerBet);
      return cote;
   }

   function AmountOne() public view returns(uint256){
       return totalBetOne;
   }

   function AmountTwo() public view returns(uint256){
       return totalBetTwo;
   }



}
