// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import './ERC165.sol';
import './interfaces/IERC721.sol';


contract ERC721 is ERC165, IERC721{

    //mapping form token id to the owner
    mapping(uint256 => address) private _tokenOwner;

    //mapping from owner to nomber of owned tokens
    mapping(address => uint256) private _OwnedTokensCount;

    //mapping form tokenId to approved addresses
    mapping(uint256 => address) private _tokenApprovals;

    constructor(){
        _registerInterface(bytes4(keccak256('balanceOf(bytes4)')^keccak256('ownerOf(bytes4)')^keccak256('transferFrom(bytes4)')));
    }

    function balanceOf(address _owner) override public view returns (uint256) {
        require(_owner != address(0), "ERC721:Owner query fot non-existens token");
        return _OwnedTokensCount[_owner];
    }

    function ownerOf(uint256 _tokenID) override public view returns(address){
        address owner = _tokenOwner[_tokenID];
        require(owner != address(0), "ERC721:Owner query fot non-existens token");
        return owner;
    }

    function _exists(uint256 tokenID) internal view returns (bool) {
        //setting the address of nft owner to check the mapping of thr address
        //from tokenOwner at the tokenID
        address owner = _tokenOwner[tokenID];

        //return trutiness the address is not zero
        return owner != address(0);
    }

    function _mint(address to, uint256 tokenID) internal virtual{
        require(to != address(0), "ERC721: minting to the zero address");
        require(!_exists(tokenID), "ERC721: token aldready minted");

        //adding a new address with a token id for minting
        _tokenOwner[tokenID] = to;

        //keeping track of each address that is minting and adding one to the count
        _OwnedTokensCount[to] += 1;

        //for logs
        emit Transfer(address(0), to, tokenID);
    }

    function _transferFrom(address _from, address _to, uint256 _tokenID) internal{
        require(_to != address(0), 'ERC721: Transfer to the zero address');
        require(ownerOf(_tokenID) == _from, 'TERC721: Trying to trasnfer a token address does not own');

        //add the token id to the addres receiving the token
        _tokenOwner[_tokenID] = _to;
        
        //update the balance oh the addtess _from token and _to
        _OwnedTokensCount[_from] -= 1;
        _OwnedTokensCount[_to] += 1;

        emit Transfer(_from, _to, _tokenID);
    }
    function transferFrom(address _from, address _to, uint256 _tokenID) override public{
        _transferFrom(_from, _to, _tokenID);
    }
}
