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

    //MApping form tokenId to approved addresses
    mapping(uint256 => address) private _tokenApprovals;

    function balanceOf(address _owner) public view returns (uint256) {
        require(_owner != address(0), "ERC721:Owner query fot non-existens token");
        return _OwnedTokensCount[_owner];
    }

    function ownerOf(uint256 _tokenID) public view returns(address){
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

    /// @notice Transfer ownership of an NFT -- THE CALLER IS RESPONSIBLE
    ///  TO CONFIRM THAT `_to` IS CAPABLE OF RECEIVING NFTS OR ELSE
    ///  THEY MAY BE PERMANENTLY LOST
    /// @dev Throws unless `msg.sender` is the current owner, an authorized
    ///  operator, or the approved address for this NFT. Throws if `_from` is
    ///  not the current owner. Throws if `_to` is the zero address. Throws if
    ///  `_tokenId` is not a valid NFT.
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenID The NFT to transfer
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
    function transferFrom(address _from, address _to, uint256 _tokenID) public{
        _transferFrom(_from, _to, _tokenID);
    }
}
