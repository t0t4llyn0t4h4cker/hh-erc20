// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract OurToken is ERC20 {
    //  initial supply is 50 <- thats like with 50 wei
    // initial supply 50e18
    // 50 * 10**18
    // hint decimals() which can be overwritten
    constructor(uint256 intitialSupply) ERC20("NEWNEW", "NEW") {
        _mint(msg.sender, initialSupply);
    }
}
