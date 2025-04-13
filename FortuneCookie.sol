// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FortuneCookie {
    string[] private fortunes;
    address public owner;
    
    event FortuneOpened(address user, string fortune, uint256 timestamp);
    
    constructor() {
        owner = msg.sender;
        
        // Initial set of fortunes - 50 diverse options
        fortunes.push("A beautiful, smart, and loving person will be coming into your life.");
        fortunes.push("Your creativity will make you successful in an unexpected venture.");
        fortunes.push("New opportunities await you on your blockchain journey.");
        fortunes.push("The smart contract you seek is already within you.");
        fortunes.push("Fortune favors the bold. Take that leap into DeFi.");
        fortunes.push("Your next NFT will bring unexpected joy.");
        fortunes.push("The token you've been ignoring will soon moon.");
        fortunes.push("A small investment today will yield great returns tomorrow.");
        fortunes.push("Your wallet will soon receive a surprising airdrop.");
        fortunes.push("The bug in your code is on line 42.");
        fortunes.push("Success is not final, failure is not fatal: it is the courage to continue that counts.");
        fortunes.push("Your greatest strength is your persistent determination.");
        fortunes.push("An exciting opportunity will present itself if you remain open to new experiences.");
        fortunes.push("Someone from your past will soon reenter your life.");
        fortunes.push("The wisdom you seek is already within you.");
        fortunes.push("A chance meeting will lead to important changes in your life.");
        fortunes.push("Your hard work is about to pay off. Remember to celebrate your success.");
        fortunes.push("A lifetime of happiness awaits you.");
        fortunes.push("The greatest risk is not taking one.");
        fortunes.push("Your ability to adapt to challenges will bring great success.");
        fortunes.push("A journey of a thousand miles begins with a single block.");
        fortunes.push("The smart move you make today will lead to success tomorrow.");
        fortunes.push("Your decentralized future is bright.");
        fortunes.push("Trust the immutable nature of your decisions.");
        fortunes.push("A private key is like a secret - guard it well.");
        fortunes.push("Consensus will be reached in your favor today.");
        fortunes.push("The hash of your efforts will result in valuable rewards.");
        fortunes.push("Your transaction will confirm in unexpected ways.");
        fortunes.push("Don't wait for gas fees to drop. Act now.");
        fortunes.push("Your personal blockchain is adding blocks of happiness.");
        fortunes.push("Today's merge will resolve your conflicting paths.");
        fortunes.push("Stake your claim in what matters most.");
        fortunes.push("Patience is a virtue, especially while waiting for confirmations.");
        fortunes.push("The oracle says your future is bright.");
        fortunes.push("A soft fork in your path will lead to better outcomes.");
        fortunes.push("Your public address will attract positive attention.");
        fortunes.push("The next block will bring you good fortune.");
        fortunes.push("Your distributed efforts will yield centralized success.");
        fortunes.push("Verify, then trust your instincts.");
        fortunes.push("Your signature is unique - use it wisely.");
        fortunes.push("A genesis of new ideas will transform your project.");
        fortunes.push("When in doubt, commit to the main chain of your life.");
        fortunes.push("The proof of your work is becoming evident to all.");
        fortunes.push("Your ledger of good deeds will be rewarded.");
        fortunes.push("Sometimes the best validator is your own intuition.");
        fortunes.push("A consensus is building around your leadership.");
        fortunes.push("Your tokenomics are perfectly balanced.");
        fortunes.push("The next hard fork in your life will be beneficial.");
        fortunes.push("Good things come to those who stake.");
        fortunes.push("Your mining efforts won't go unrewarded.");
    }
    
    function getRandomFortune() public returns (string memory) {
        // Simple randomization using block data
        uint256 randomIndex = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, block.prevrandao))) % fortunes.length;
        string memory fortune = fortunes[randomIndex];
        
        // Emit event for tracking
        emit FortuneOpened(msg.sender, fortune, block.timestamp);
        
        return fortune;
    }
    
    // Admin function to add more fortunes
    function addFortune(string memory newFortune) public {
        require(msg.sender == owner, "Only owner can add fortunes");
        fortunes.push(newFortune);
    }
    
    // Admin function to get fortune count
    function getFortuneCount() public view returns (uint256) {
        require(msg.sender == owner, "Only owner can view fortune count");
        return fortunes.length;
    }
}