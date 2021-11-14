// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ItemManager.sol";

contract Item {
    uint public priceInWei;
    uint public paidWei;
    uint public index;

    ItemManager parentContract;

    constructor(ItemManager _parentContract, uint _priceInWei, uint _index) {
        priceInWei = _priceInWei;
        index = _index;
        parentContract = _parentContract;
    }

    receive() external payable {
        require(msg.value == priceInWei, "Partial payments are not accepted at this time");
        require(paidWei == 0, "Item has already been pair for");
        paidWei += msg.value;
        (bool success, ) = address(parentContract).call{value: msg.value} ( abi.encodeWithSignature("triggerPayment(uint256)", index));
        require(success, "Item was not delivered");
    }

    fallback() external {

    }
    
}