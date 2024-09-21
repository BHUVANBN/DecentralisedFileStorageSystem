import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import FileStorage from '../../src/components/FileStorage.json';

const FileList = () => {
  const [files, setFiles] = useState([]);
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
      const fileCount = await contract.methods.fileCount().call();
      for (let i = 1; i <= fileCount; i++) {
        const file = await contract.methods.files(i).call();
        setFiles((files) => [...files, file]);
      }
    }
  };

  return (
    <div>
      <h2>Uploaded Files</h2>
      <ul>
        {files.map((file, index) => (
          <li key={index}>{file.hash}</li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
