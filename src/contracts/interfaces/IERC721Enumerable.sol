// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IERC721Enumerable /* is ERC721 */ {

    function totalSupply() external view returns (uint256);

    function tokenByIndex(uint256 _index) external view returns (uint256);

    function tokenOfOwnerByIndex(address _owner, uint256 _index) external view returns (uint256);
}