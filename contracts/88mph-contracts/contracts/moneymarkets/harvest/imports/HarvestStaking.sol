// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.8.0;

interface HarvestStaking {
    function stake(uint256 amount) external;

    function withdraw(uint256 amount) external;

    function getReward() external;

    function rewardToken() external returns (address);

    function balanceOf(address account) external view returns (uint256);
}
