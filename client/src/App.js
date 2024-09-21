// import React from 'react';
// import Upload from './components/Upload';
// import FileList from './components/FileList';
// import './App.css';

// const App = () => {
//   return (
//     <div>
//       <h1>Decentralized File Storage</h1>
//       <Upload />
//       <FileList />
//     </div>
//   );
// };

// export default App;
import React, { useEffect, useState } from 'react';
import Upload from './components/Upload';
import FileList from './components/FileList';
import Web3 from 'web3';
import './App.css';

const App = () => {
  const [blockNumber, setBlockNumber] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/a51e9fd3af844df48425f0743cf608af'));
    //const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8546"));

    web3.eth.getBlockNumber()
      .then((result) => {
        setBlockNumber(result);
      })
      .catch((error) => {
        setError(error);
        console.error('Error fetching block number:', error);
      });
  }, []);

  return (
    <div>
      <h1>Decentralized File Storage</h1>
      <Upload />
      <FileList />
      <div>
        <h2>Latest Ethereum Block</h2>
        {blockNumber !== null ? <p>{blockNumber}</p> : <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
      </div>
    </div>
  );
};

export default App;
