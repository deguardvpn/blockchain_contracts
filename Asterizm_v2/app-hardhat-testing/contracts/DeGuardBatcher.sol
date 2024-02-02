// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IDeGuardNFT is IERC721Enumerable {
    function buyPlan(
        uint _plan,
        uint64 _dstChainId,
        address _to,
        bool _crosschain
    ) external payable;
}

contract DeGuardBatcher is Ownable, ReentrancyGuard, IERC721Receiver {
    IDeGuardNFT public nft;

    constructor(address _nft) {
        nft = IDeGuardNFT(_nft);
    }

    function totalNFTs() public view returns (uint) {
        return nft.balanceOf(address(this));
    }

    function setNft(address _nft) public onlyOwner {
        nft = IDeGuardNFT(_nft);
    }

    function mintTokens(
        uint _amount,
        uint planIndex
    ) public onlyOwner nonReentrant {
        for (uint i = 0; i < _amount; i++) {
            nft.buyPlan{value: 0}(planIndex, 56, address(this), false);
        }
    }

    function transferTokens(
        uint _amount,
        address _to
    ) public onlyOwner nonReentrant {
        uint256 balance = nft.balanceOf(address(this));
        require(_amount <= balance, "Not enough NFTs in the contract");

        for (uint i = 0; i < _amount; i++) {
            uint256 tokenId = nft.tokenOfOwnerByIndex(address(this), 0);
            nft.safeTransferFrom(address(this), _to, tokenId);
        }
    }

    function mintAndTransferTokens(
        uint _amount,
        uint planIndex,
        address _to
    ) public onlyOwner nonReentrant {
        for (uint i = 0; i < _amount; i++) {
            nft.buyPlan{value: 0}(planIndex, 56, address(this), false);
        }

        uint256 balance = nft.balanceOf(address(this));
        require(_amount <= balance, "Not enough NFTs in the contract");

        for (uint i = 0; i < _amount; i++) {
            uint256 tokenId = nft.tokenOfOwnerByIndex(address(this), 0);
            nft.safeTransferFrom(address(this), _to, tokenId);
        }
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
