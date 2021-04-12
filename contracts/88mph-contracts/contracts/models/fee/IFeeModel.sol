pragma solidity >=0.6.0 <0.8.0;

interface IFeeModel {
    function beneficiary() external view returns (address payable);

    function getFee(uint256 _txAmount)
        external
        pure
        returns (uint256 _feeAmount);
}
