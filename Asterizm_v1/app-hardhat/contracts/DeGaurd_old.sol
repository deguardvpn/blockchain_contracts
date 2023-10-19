// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract DeGaurd is
    ERC721,
    ERC721URIStorage,
    ERC721Enumerable,
    Ownable,
    ReentrancyGuard
{
    uint _days = 1 days;

    struct UserPlan {
        uint tokenID;
        uint startTime;
        uint endTime;
    }

    struct Plan {
        uint price;
        uint period;
        string uri;
    }

    mapping(address => UserPlan) public addressToPlan;
    Plan[] public planList;

    event PlanUpdate(uint indexed planIndex, uint planPrice, uint planPeriod);
    event PlanPurchase(address userAddres, uint planIndex);

    // ipfs://.../
    string ipfsBaseURI;

    constructor() ERC721("DeGuard", "DEG") {}

    /**
     * @dev Function for buying plan and minting NFT.
     * @param planIndex number of index in plan list
     *
     * Requirements:
     * - `index` - cannot be out of bounds of array.
     * - `endTime` - cannot be more than current time.
     * - `amount` - must be equal to plan price.
     */
    function buyPlan(uint planIndex) public payable nonReentrant {
        address user = msg.sender;
        uint amount = msg.value;
        uint currentTime = block.timestamp;

        require(planIndex < planList.length, "Index is out of bounds");
        require(addressToPlan[user].endTime < currentTime, "Plan is active");
        require(amount == planList[planIndex].price, "Insufficient amount");

        uint _endTime = currentTime + planList[planIndex].period;
        uint _tokenID = totalSupply() + 1;
        _safeMint(user, _tokenID);
        _setTokenURI(_tokenID, planList[planIndex].uri);

        addressToPlan[user].tokenID = _tokenID;
        addressToPlan[user].startTime = currentTime;
        addressToPlan[user].endTime = _endTime;
    }

    /**
     * @dev Function for adding plan requirements.
     * @param _priceInWei amount of gwei for plan
     * @param _dayPeriod days period of plan
     */
    function addPlan(
        uint _priceInWei,
        uint _dayPeriod,
        string memory uri
    ) public onlyOwner {
        planList.push(Plan(_priceInWei, _dayPeriod * _days, uri));

        emit PlanUpdate(planList.length, _priceInWei, _dayPeriod);
    }

    /**
     * @dev Function for changing plan requirements.
     * @param index number of index in plan list
     * @param _priceInWei amount of ethers for plan
     * @param _dayPeriod time period of plan
     *
     * Requirements:
     * - `index` - cannot be out of bounds of array.
     */
    function changePlan(
        uint index,
        uint _priceInWei,
        uint _dayPeriod,
        string memory uri
    ) public onlyOwner {
        require(index < planList.length, "Index is out of bounds");

        planList[index] = Plan(_priceInWei, _dayPeriod * _days, uri);

        emit PlanUpdate(planList.length, _priceInWei, _dayPeriod);
    }

    /**
     * @dev Function to remove plan from plan list.
     * @param index number of index in plan list
     *
     * Requirements:
     * - `index` - cannot be out of bounds of array.
     */
    function removePlan(uint index) public onlyOwner {
        require(index < planList.length, "Index is out of bounds");

        planList[index] = planList[planList.length - 1];

        planList.pop();

        emit PlanUpdate(planList.length + 1, 0, 0);
    }

    /**
     * @dev Function for getting Plan List. Since Solidity 0.8.0 we cannot return Struct Arrays.
     * To avoid this issue, we can return `price` and `period` arrays.
     */
    function getPlanList()
        public
        view
        returns (uint[] memory, uint[] memory, string[] memory)
    {
        uint[] memory prices = new uint[](planList.length);
        uint[] memory periods = new uint[](planList.length);
        string[] memory uris = new string[](planList.length);

        for (uint i = 0; i < planList.length; i++) {
            prices[i] = planList[i].price;
            periods[i] = planList[i].period;
            uris[i] = planList[i].uri;
        }

        return (prices, periods, uris);
    }

    /**
     * @dev See {ERC721-_baseURI}.
     */
    function _baseURI() internal view override returns (string memory) {
        return ipfsBaseURI;
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev See {ERC721-_burn}.
     */
    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    /**
     * @dev Function for changing base URI value.
     * @param _newBaseURI new base URI value
     */
    function changeBaseURI(string memory _newBaseURI) public onlyOwner {
        ipfsBaseURI = _newBaseURI;
    }

    /**
     * @dev See {ERC721-_beforeTokenTransfer}.
     * Function for Non-transferable NFT. It is restricted to transfer VPN plan nft.
     *
     * Requirements:
     * - `from` - must be a zero address.
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        require(
            from == address(0),
            "NonTransferableERC721: Tokens are non-transferable"
        );
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Function to withdraw smart contract balance. Only owner can withdraw ethers.
     *
     * Requirements:
     * - `success` - cannot be false.
     */
    function withdraw() public onlyOwner {
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(success);
    }
}
