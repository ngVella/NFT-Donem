// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IERC721{

    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);

    event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);

    function balanceOf(address _owner) external view returns (uint256);

    function ownerOf(uint256 _tokenId) external view returns (address);

    function transferFrom(address _from, address _to, uint256 _tokenId) external;

}