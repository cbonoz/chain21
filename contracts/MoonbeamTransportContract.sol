pragma solidity ^0.6.7;
pragma experimental ABIEncoderV2;

import "https://github.com/smartcontractkit/chainlink/evm-contracts/src/v0.6/ChainlinkClient.sol";
import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/solc-0.6/contracts/access/Ownable.sol";

/**
 * @title TransportContract requests data from
 * the Chainlink network
 * @dev This contract is designed to work on multiple networks, including
 * local test networks
 * test location: ["45.7905","11.9202"]
 * test start: "2021-02-07 20:00:00"
 * test end: "2021-04-07 20:00:00"
 * 
 * Link Address: 0xa36085F69e2889c224210F603D836748e7dC0088
 */

contract GeoDBChainlink is ChainlinkClient, Ownable {
    uint256 oraclePayment;
    uint256 public price = 0;
    address oracle = 0xA356990bCDed8Cc6865Be606D64E7381bfe00B72;
    string jobId = "0xfE6676f8A96005445848632a5A2D67721d584dAd";
    string radius = "150";
    bool public priceRetuned = false;
    bool public passPurchased = false;
    uint256 public currentPrice;

    uint256 pricePerStation = 34; //Price per station in 10^3 ETH
    uint256 crowdMultiplier = 1;  //Mutiplier for crowd price offset

    /**
     * Network: Moonbase Alpha
     * Oracle: 

     *      Name:           Price Feeds
     *      Address:        0xA356990bCDed8Cc6865Be606D64E7381bfe00B72
     * Job: 
     *      Name:           ETH to USD
     *      ID:             0xfE6676f8A96005445848632a5A2D67721d584dAd
     *      Fee:            0 LINK
     */

    constructor(uint256 _oraclePayment, address _link) public {
      oraclePayment = _oraclePayment;
    }

    function requestUsers(string memory _lat, string memory _lng, string memory _start, string memory _end)
      private
    {
      price += pricePerStation;
    }

    function requestPrice(string[] memory _locations, string memory _start, string memory _end)
      public
    {
      price = 0;
      for (uint i = 0; i < _locations.length; i += 2) {
        requestUsers(_locations[i], _locations[i + 1], _start, _end);
      }
      priceRetuned = true;
    }

    function purchasePass()
      public
      payable
    {
      if (1000 * msg.value >= price * 1 ether && priceRetuned) {
        address payable owner = payable(owner());
        owner.transfer(msg.value);
        passPurchased = true;
        priceRetuned = false;
      } else {
        passPurchased = false;
      }
    }
    
    function issuePass()
      public
      returns(bool)
    {
      bool shoudIssuePass = passPurchased;
      passPurchased = false;
      return shoudIssuePass;
    }
    
    // Creates Chainlink Request
    function requestPrice() 
      public
    {
      // newRequest takes a JobID, a callback address, and callback function as input
      Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(jobId), address(this), this.fulfill.selector);
      // Sends the request with the amount of payment specified to the oracle
      sendChainlinkRequestTo(oracle, req, 0);
    }

    // Callback function called by the Oracle when it has resolved the request
    function fulfill(bytes32 _requestId, uint256 _price)
      public
      recordChainlinkFulfillment(_requestId)
    {
      currentPrice = _price;
    }
    
    // Allows the owner to cancel an unfulfilled request
    function cancelRequest(
      bytes32 _requestId,
      uint256 _payment,
      bytes4 _callbackFunctionId,
      uint256 _expiration
    )
      public
    {
      cancelChainlinkRequest(_requestId, _payment, _callbackFunctionId, _expiration);
    }

    // Allows the owner to withdraw the LINK tokens in the contract to the address calling this function
    function withdrawLink()
      public
    {
      LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
      require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
    }
    
    // Decodes an input string in a bytes32 word
    function stringToBytes32(string memory _source)
      private
      pure
      returns (bytes32 result) 
    {
      bytes memory emptyStringTest = bytes(_source);
      if (emptyStringTest.length == 0) {
        return 0x0;
      }

      assembly { // solhint-disable-line no-inline-assembly
        result := mload(add(_source, 32))
      }

      return result;
    }
}