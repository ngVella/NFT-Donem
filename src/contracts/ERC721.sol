// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/*
import './ERC721Metadata.sol';
import './ERC721Connector.sol';
*/

/*

    building out the minting function:
        nft to point an adress
        keep track of the token ids
        keep track of token owner addresses to token ids
        keed track of how many tokens an owner address has
        create an event that emits a tranfer log - contact address 

*/

contract ERC721 {
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenID
    );

    //mapping form token id to the owner
    mapping(uint256 => address) private _tokenOwner;

    //mapping from owner to nomber of owned tokens
    mapping(address => uint256) private _OwnedTokensCount;

    function _exists(uint256 tokenID) internal view returns (bool) {
        //setting the address of nft owner to check the mapping of thr address
        //from tokenOwner at the tokenID
        address owner = _tokenOwner[tokenID];

        //return trutiness the address is not zero
        return owner != address(0);
    }

    function _mint(address to, uint256 tokenID) internal {
        require(to != address(0), "ERC721: minting to the zero address");
        require(!_exists(tokenID), "ERC721: token aldready minted");

        //adding a new address with a token id for minting
        _tokenOwner[tokenID] = to;

        //keeping track of each address that is minting and adding one to the count
        _OwnedTokensCount[to] += 1;

        //for logs
        emit Transfer(address(0), to, tokenID);
    }
}
