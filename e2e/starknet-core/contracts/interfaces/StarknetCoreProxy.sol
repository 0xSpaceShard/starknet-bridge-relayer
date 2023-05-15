// SPDX-License-Identifier: Apache-2.0.
pragma solidity ^0.6.12;

interface IStarknetCoreProxy {
    function implementation() external view returns (address);

    function upgradeTo(address newImplementation, bytes calldata data, bool finalize) external;

    function addImplementation(address newImplementation, bytes calldata data, bool finalize) external;
}
