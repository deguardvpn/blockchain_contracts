// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// import "@openzeppelin/contracts/security/Pausable.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
// import "./DeGuardNFT.sol";

// /// NFT Factory contract
// contract DeGuardFactory is Pausable, ReentrancyGuard, Ownable {

//     /// Emits when currency rate updated
//     event RateUpdated(uint value);

//     /// Emits in 2 cases:
//     /// 1 - Added new plan
//     /// 2 - Updated existed plan
//     event PlanUpdated(uint indexed index, uint price, uint range);
//     event PlanRemoved(uint indexed index, uint price, uint range);
//     event PlanSold(address user, uint plan);

//     /// - `price` - price denominated in USD
//     /// - `range` - represents date tange in days
//     struct Plan {
//         uint price;
//         uint range;
//         // string uri;
//     }

//     /// - `value` - currency rate
//     /// - `updated` - timestamp
//     struct Rate {
//         uint value;
//         uint updated;
//     }

//     uint private _days = 1 days;

//     /// @dev Currency rate for networt native token
//     /// TOKEN/USD where TOKEN is base currency, USD is qoute currency
//     Rate public rate;

//     Plan[] public plans;

//     /// NFT token
//     DeGuardNFT public token;

//     /// Deploys NFT token when factory deployed
//     constructor() {
//         token = new DeGuardNFT();
//         /// Initial currency rate sets to zero and buyPlan method
//         /// is disabled after dontract deploying
//         rate = Rate(0, block.timestamp);
//     }

//     /// For some cases when owner wants to stop plan selling
//     function pause() public onlyOwner {
//         _pause();
//     }

//     function unpause() public onlyOwner {
//         _unpause();
//     }

//     /// @dev Updates currency rate
//     /// @param _value TOKEN/USD where TOKEN is base currency, USD is qoute currency
//     function updateRate(uint _value) public onlyOwner {
//         require(_value > 0, "Currency rate must be higher than zero");
//         rate.value = _value;
//         rate.updated = block.timestamp;
//         emit RateUpdated(rate.value);
//     }

//     /// Buy plan for service users
//     /// @param _plan uint - plan id (index in array), starts from zero
//     function buyPlan(uint _plan) public payable nonReentrant whenNotPaused {
//         address user = msg.sender;
//         uint value = msg.value;
//         require(rate.value > 0, "Currency rate must be higher than zero");
//         require(_plan < plans.length, "Index is out of bounds");
//         uint price = (rate.value * plans[_plan].price) / 10 ** 18;
//         require(value == price, "Not enough money sent");
//         uint _currentTime = block.timestamp;
//         uint _endTime = _currentTime + plans[_plan].range;
//         token.safeMint(user, _currentTime, _endTime);
//         emit PlanSold(user, _plan);
//     }

//     /// Add new plan to the factory's plans aray
//     /// @param _priceInUSD uint256  - represents token price in USD with 18 decimals
//     /// @param _daysRange uint256  - time range in days
//     function addPlan(
//         uint _priceInUSD,
//         uint _daysRange
//         // string memory uri
//     ) public onlyOwner {
//         plans.push(Plan(_priceInUSD, _daysRange * _days));

//         emit PlanUpdated(plans.length - 1, _priceInUSD, _daysRange);
//     }

//     /// Remove plan from plans array
//     /// @param index uint - plan id (index in array), starts from zero
//     function removePlan(uint index) public onlyOwner {
//         require(index < plans.length, "Index is out of bounds");

//         Plan memory _plan = plans[index];

//         for(uint i = index; i < plans.length - 1; i++){
//             plans[i] = plans[i+1];      
//         }
//         plans.pop();

//         emit PlanRemoved(plans.length + 1, _plan.price, _plan.range);
//     }

//     /// Get plan list with data readable range format
//     /// @return array of Plan struc where range converted to days
//     function getPlanList() public view returns (Plan[] memory) {
//         Plan[] memory _plans = new Plan[](plans.length);
//         for(uint i = 0; i < plans.length; i++){
//             _plans[i] = Plan(plans[i].price, plans[i].range / _days);
//         }
//         return _plans;
//     }

//     /// Withdraw money from contract to the owner's wallet
//     function withdraw() public onlyOwner {
//         (bool success, ) = payable(msg.sender).call{
//             value: address(this).balance
//         }("");
//         require(success);
//     }

// }