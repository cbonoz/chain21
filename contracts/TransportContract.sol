pragma solidity ^0.6.7;
pragma experimental ABIEncoderV2;



import "https://raw.githubusercontent.com/smartcontractkit/chainlink/master/evm-contracts/src/v0.6/ChainlinkClient.sol";
import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/solc-0.6/contracts/access/Ownable.sol";

/**
* @title TransportContract is an example contract which requests data from
* the Chainlink network
* @dev This contract is designed to work on multiple networks, including
* local test networks
* Network: Kovan
* Oracle: 
*      Name:           LinkPool
*      Listing URL:    https://market.link/nodes/323602b9-3831-4f8d-a66b-3fb7531649eb?network=42&start=1614864673&end=1615469473
*      Address:        0x56dd6586DB0D08c6Ce7B2f2805af28616E082455
* Job: 
*      Name:           GeoDB
*      Listing URL:    https://market.link/jobs/...
*      ID:             ef0e16c96ce04795b261725db827ba32
*      Fee:            0.1 LINK
*/

contract GeoDBChainlink is ChainlinkClient, Ownable {
    uint256 oraclePayment;
    uint public price = 0;
    address oracle = 0x56dd6586DB0D08c6Ce7B2f2805af28616E082455;
    bytes32 jobId = 0x00000000000000000000000000000000ef0e16c96ce04795b261725db827ba32;
    string radius = "150";


    constructor(uint256 _oraclePayment) public {
      setPublicChainlinkToken();
      oraclePayment = _oraclePayment;
    }

    function requestUsers(string memory _lat,string memory _lng)
      public
      onlyOwner
    {
      Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
      req.add("lat", _lat);
      req.add("lng", _lng);
      req.add("radius", radius);
      req.add("start", "2021-02-07 20:00:00");
      req.add("end", "2021-04-07 20:00:00");
      sendChainlinkRequestTo(oracle, req, oraclePayment);
    }

    function requestPrice(string[] memory _locations)
      public
      onlyOwner
    {
      price = 0;
      for (uint i = 0; i < _locations.length; i += 2) {
        requestUsers(_locations[i], _locations[i + 1]);
      }
    }

    function fulfill(bytes32 _requestId, uint256 _users)
      public
      recordChainlinkFulfillment(_requestId)
    {
      price += (100 + _users);
    }
}