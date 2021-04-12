pragma solidity >=0.6.0 <0.8.0;;

interface IInterestOracle {
    function updateAndQuery() external returns (bool updated, uint256 value);

    function query() external view returns (uint256 value);

    function moneyMarket() external view returns (address);
}
