pragma solidity >=0.6.0 <0.8.0;;


// Compound finance Comptroller interface
// Documentation: https://compound.finance/docs/comptroller
interface IComptroller {
    function claimComp(address holder) external;
    function getCompAddress() external view returns (address);
}