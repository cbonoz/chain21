// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity >=0.6.0 <0.8.0;

interface IRewards {
    function notifyRewardAmount(uint256 reward) external;
}
