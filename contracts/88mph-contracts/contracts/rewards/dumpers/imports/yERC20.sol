// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.8.0;;

// NOTE: Basically an alias for Vaults
interface yERC20 {
    function balanceOf(address owner) external view returns (uint256);

    function deposit(uint256 _amount) external;

    function withdraw(uint256 _amount) external;

    function getPricePerFullShare() external view returns (uint256);
}
