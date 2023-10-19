// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "./DeGuardNFT.sol";
// import "asterizmprotocol/contracts/evm/AsterizmClient.sol";
// import "./interfaces/IMultiChainToken.sol";

// contract MultichainToken is IMultiChainToken, DeGuardNFT, AsterizmClient {

//     event EncodedPayloadRecieved(uint64 srcChainId, address srcAddress, uint nonce, uint _transactionId, bytes payload);
//     event CrossChainTransferReceived(uint id, uint64 destChain, address from, address to, uint tokenId, uint _transactionId, address target);
//     event CrossChainTransferCompleted(uint id);

//     struct CrossChainTransfer {
//         bool exists;
//         uint64 destChain;
//         address from;
//         address to;
//         uint tokenId;
//         address target;
//     }

//     mapping (uint => CrossChainTransfer) public crosschainTransfers;

//     constructor(IInitializerSender _initializerLib)
//     AsterizmClient(_initializerLib, true, false)
//     {
//         /// For testing ONLY
//         // safeMint(msg.sender, block.timestamp, block.timestamp + 30 days);
//     }

//     /// Cross-chain transfer
//     /// @param _dstChainId uint64  Destination chain ID
//     /// @param _from address  From address
//     /// @param _to address  To address
//     function crossChainTransfer(uint64 _dstChainId, address _from, address _to, uint _tokenId, uint _startTime, uint _endTime) public payable {
//         uint tokenId = _debitFrom(_from, _tokenId); // amount returned should not have dust
//         _initAsterizmTransferEvent(_dstChainId, abi.encode(_to, tokenId, _getTxId(), _startTime, _endTime));
//     }

//     /// Receive non-encoded payload
//     /// @param _dto ClAsterizmReceiveRequestDto  Method DTO
//     function _asterizmReceive(ClAsterizmReceiveRequestDto memory _dto) internal override {
//         (address dstAddress, , , , uint startTime, uint endTime) = abi.decode(_dto.payload, (address, uint, uint, uint, uint, uint));
//         safeMint(dstAddress, startTime, endTime);
//     }

//     /// Build packed payload (abi.encodePacked() result)
//     /// @param _payload bytes  Default payload (abi.encode() result)
//     /// @return bytes  Packed payload (abi.encodePacked() result)
//     function _buildPackedPayload(bytes memory _payload) internal pure override returns(bytes memory) {
//         (address dstAddress, uint tokenId, uint txId, uint startTime, uint endTime) = abi.decode(_payload, (address, uint, uint, uint, uint));
        
//         return abi.encodePacked(dstAddress, tokenId, txId, startTime, endTime);
//     }

//     /// Debit logic
//     /// @param _from address  From address
//     /// @param _tokenId uint  Amount
//     function _debitFrom(address _from, uint _tokenId) internal virtual returns(uint) {
//         address spender = _msgSender();
//          if (_from != spender) _isApprovedOrOwner(spender, _tokenId);
//         burn(_tokenId);
//         return _tokenId;
//     }
// }