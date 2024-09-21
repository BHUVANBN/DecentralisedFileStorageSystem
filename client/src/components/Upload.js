import React, { useState, useEffect } from 'react';
import { create } from 'ipfs-http-client';
import { create as ipfsHttpClient } from 'ipfs-http-client';

import Web3 from 'web3';
import FileStorage from '../../src/components/FileStorage.json';
import { Buffer } from 'buffer';
window.Buffer = Buffer;


const projectId = 'a51e9fd3af844df48425f0743cf608af';
const projectSecret = 'jDJN42R45189n+Sds6Y4odew87QKdFAWkBHzkxnMAseo0T7G41h9vw';
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = ipfsHttpClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});
const ipfs = create('https://ipfs.infura.io:5001/api/v0');

const Upload = () => {
  const [file, setFile] = useState(null);
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
    const accounts = await web3.eth.requestAccounts();
    setAccount(accounts[0]);
    const networkId = await web3.eth.net.getId();
    const networkData = FileStorage.networks[networkId];
    if (networkData) {
      const abi = FileStorage.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      setContract(contract);
    }
  };

  const uploadFile = async (file) => {
    try {
        // Read the file as an ArrayBuffer
        const reader = new FileReader();
        reader.onloadend = async () => {
            const buffer = Buffer.from(reader.result);
            
            // Upload the file to IPFS
            const result = await ipfs.add(buffer);
            const hash = result.path;
            console.log('File uploaded to IPFS:', hash);
            
            // Interact with the smart contract
            await contract.methods.uploadFile(hash).send({ from: account });
            console.log('File hash sent to smart contract');
        };
        reader.readAsArrayBuffer(file);
    } catch (error) {
        console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadFile}>Upload</button>
    </div>
  );
};

export default Upload;
