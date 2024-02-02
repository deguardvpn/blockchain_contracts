// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IDeGuardNFT is IERC721Enumerable {
    struct Plan {
        uint id;
        uint price;
        uint range;
    }

    struct Rate {
        uint value;
        uint updated;
    }

    function buyPlan(
        uint _plan,
        uint64 _dstChainId,
        address _to,
        bool _crosschain
    ) external payable;

    function rate() external view returns (Rate memory);

    function getPlanList() external view returns (Plan[] memory);
}

contract DeGuardBuyGift is Ownable, ReentrancyGuard, IERC721Receiver {
    IDeGuardNFT public nft;

    constructor(address _nft) {
        nft = IDeGuardNFT(_nft);
    }

    function setNft(address _nft) public onlyOwner {
        nft = IDeGuardNFT(_nft);
    }

    function getPlanPrice(uint planIndex) public view returns (uint) {
        uint price = nft.getPlanList()[planIndex].price;
        uint rate = nft.rate().value;

        return (price * rate) / 10 ** 18;
    }

    function buyGiftPlanTo(
        uint planIndex,
        address _to
    ) public payable nonReentrant {
        uint price = getPlanPrice(planIndex);
        require(msg.value == price, "Insufficient funds");

        nft.buyPlan{value: price}(planIndex, 56, address(this), false);

        uint256 balance = nft.balanceOf(address(this));
        require(balance > 0, "Not enough NFTs in the contract");

        uint256 tokenId = nft.tokenOfOwnerByIndex(address(this), 0);
        nft.safeTransferFrom(address(this), _to, tokenId);
    }

    function withdraw() public onlyOwner {
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(success);
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
