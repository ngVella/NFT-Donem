// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import './ERC721.sol';

contract ERC721Enumerable is ERC721{

    uint256[] private _allTokens;

    //mapping from tokenID to position in _allTokens array
    mapping(uint256 => uint256) private _allTokensIndex;

    //mapping of owner to list of all owner token ids
    mapping(address => uint256[]) private _ownedTokens;

    //mapping from tokenID index of the owner tokens list
    mapping(uint256 => uint256) private _ownedTokensIndex; 

    function _mint(address to, uint256 tokenID) internal override(ERC721) {
        super._mint(to,tokenID);
        _addTokensToAllTokenEnumeration(tokenID);
        _addTokensToOwnerEnumeration(to, tokenID);
    }

    //add tokens to the _allTokens array and set the positions of the token index
    function _addTokensToAllTokenEnumeration(uint256 tokenID) private{
        _allTokensIndex[tokenID] = _allTokens.length; //tokenID position
        _allTokens.push(tokenID);
    }

    
    function _addTokensToOwnerEnumeration(address to, uint256 tokenID) private{
        _ownedTokens[to].push(tokenID);
        _ownedTokensIndex[tokenID] = _ownedTokens[to].length;
    }

    function tokenByIndex(uint256 index) public view returns(uint256) {
        require(index < _allTokens.length, "ERC721Enum: global index out of bounds");
        return _allTokens[index];
    }

    function tokenOfOwnerByIndex(address owner, uint256 index) public view returns(uint256){
        require(index < balanceOf(owner), "ERC721Enum: owner index out of bounds");
        return _ownedTokens[owner][index]; 
    }

    //return the total supply of the _allTokens array
    function totalSupply() public view returns(uint256){
        return _allTokens.length;
    }
}