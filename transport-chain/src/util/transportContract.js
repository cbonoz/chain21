import { getWeb3 } from "./getWeb3";
import TransportContract from './contracts/TransportContract.json'

export let transportInstance = {};
export let accounts = [];

export const getAccounts = async (web3) => {
    return await web3.eth.getAccounts();
}

export const initContractInstance = async () => {
  console.log("initContractInstance");
  try {
    // Get network provider and web3 instance.
    const web3 = await getWeb3();

    // Use web3 to get the user's accounts.
    accounts = await getAccounts(web3)

    // Get the contract instance.
    const networkId = await web3.eth.net.getId();
    let deployedNetwork = TransportContract.networks && TransportContract.networks[networkId] || {}
    let { address } = deployedNetwork
    if (!address) {
        address = "0x905Ba1454730f8e08dB9199737c500dA2026e720" // Fallback address of known contract
    }
    transportInstance = new web3.eth.Contract(
      TransportContract.abi,
      address
    );

    console.log("init", accounts, transportInstance, address);

    // Set web3, accounts, and contract to the state, and then proceed with an
    // example of interacting with the contract's methods.
  } catch (error) {
    // Catch any errors for any of the above operations.
    alert(
      `Failed to load web3, accounts, or contract. Check console for details.`
    );
    console.error("error", error);
  }
};

export const getLastPrice = async () => {
    return await transportInstance.methods.price().call()
}

export const getLastUsers = async () => {
    return await transportInstance.methods.users().call()
}

export const purchaseContract = async (amount) => { 
    if (!amount) {
        alert('Please wait for price to be determined')
        return
    }
    // List of lat/lngs of form [lat1, lng1, lat2, lng2, ...]
    // Get the value from the contract to prove it worked.
    const response = await transportInstance.methods.purchaseContract(amount).send({ from: accounts[0] });
    return response;
  };
  


export const requestPrice = async (latLngs) => { 
  // List of lat/lngs of form [lat1, lng1, lat2, lng2, ...]
  // Get the value from the contract to prove it worked.
  const response = await transportInstance.methods.requestPrice(latLngs).send({ from: accounts[0] });
  return response;
};
