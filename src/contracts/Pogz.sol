// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./ERC721Metadata.sol";
import "./ERC721Connector.sol";

contract Pogz is ERC721Connector {
    //array to store nfts
    string[] public PogZ;

    mapping(string => bool) _pogzExists;

    function mint(string memory _pogz) public {
        require(!_pogzExists[_pogz], "Pogz: PogZ already exists");

        //uint256 _id = PogZ.push(_pogz); old verison
        PogZ.push(_pogz);
        uint256 _id = PogZ.length - 1;

        _mint(msg.sender, _id);
        _pogzExists[_pogz] = true;
    }

    constructor() ERC721Connector("Pogz", "POGZ") {}
}
