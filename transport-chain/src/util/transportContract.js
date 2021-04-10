import { getWeb3 } from "./getWeb3";
import TransportContract from './contracts/TransportContract.json'

const DEFAULT_RADIUS = 3;

let transportInstance = {};
let accounts = [];

export const initContractInstance = async () => {
  console.log("initContractInstance");
  try {
    // Get network provider and web3 instance.
    const web3 = await getWeb3();

    // Use web3 to get the user's accounts.
    accounts = await web3.eth.getAccounts();

    // Get the contract instance.
    const networkId = await web3.eth.net.getId();
    let deployedNetwork = TransportContract.networks[networkId];
    transportInstance = new web3.eth.Contract(
      TransportContract.abi,
      deployedNetwork && deployedNetwork.address
    );

    console.log("init", accounts, transportInstance);

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
    return await transportInstance.price.call()
}

export const getLastUsers = async () => {
    return await transportInstance.users.call()
}

export const purchaseContract = async (amount) => { 
    if (!amount) {
        alert('Please wait for price to be determined')
        return
    }
    // List of lat/lngs of form [lat1, lng1, lat2, lng2, ...]
    // Get the value from the contract to prove it worked.
    const response = await transportInstance.methods
      // .getPrice(lat, lng, DEFAULT_RADIUS, start, end)
      .purchaseContract(amount)
      .send({ from: accounts[0] });
    return response;
  };
  


export const requestPrice = async (latLngs) => { 
  // List of lat/lngs of form [lat1, lng1, lat2, lng2, ...]
  // Get the value from the contract to prove it worked.
  const response = await transportInstance.methods
    // .getPrice(lat, lng, DEFAULT_RADIUS, start, end)
    .requestPrice(latLngs)
    .send({ from: accounts[0] });
  return response;
};
