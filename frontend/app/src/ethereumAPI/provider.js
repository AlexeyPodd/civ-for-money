import { ethers } from 'ethers';

let provider;
if (window.ethereum) provider = new ethers.BrowserProvider(window.ethereum);

export default provider;