// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FileStorage {
    struct File {
        string hash;
        address owner;
    }

    mapping(string => File) files;

    function uploadFile(string memory _hash) public {
        files[_hash] = File(_hash, msg.sender);
    }

    function getFile(string memory _hash) public view returns (string memory) {
        require(files[_hash].owner == msg.sender, "Not authorized");
        return files[_hash].hash;
    }
}
