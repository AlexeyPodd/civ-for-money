import { ethers } from 'ethers';

const provider = new ethers.BrowserProvider(window.ethereum);

export default provider;