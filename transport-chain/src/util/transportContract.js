import { getWeb3 } from "./getWeb3";
import TransportContract from "./contracts/TransportContract.json";

export let transportInstance = {};
export let accounts = [];
export let web3 = {};

const KOVAN_ADDRESS = "0xf672b3d4d31b287D9faF733119F5b1bDbDB9b6B8";
const PLASM_ADDRESS = "0xbEc5b1faDE897D49A10DC02fD405dCa2aC4C752f";
const MUMBAI_ADDRESS = "0xDB73769d3132DcDE68D27B91E2dd278BD6Be917a";
const MOONBEAM_ADDRESS = "0x8B14f0Bdf1feE1941e78E5619cdad6AA65095ED9";

export const getAccounts = async () => {
  return await web3.eth.getAccounts();
};

export const initContractInstance = async () => {
  console.log("initContractInstance");
  try {
    // Get network provider and web3 instance.
    web3 = await getWeb3();

    // Use web3 to get the user's accounts.
    accounts = await getAccounts();

    // Get the contract instance.
    const networkId = await web3.eth.net.getId();
    let deployedNetwork =
      (TransportContract.networks && TransportContract.networks[networkId]) ||
      {};
    let { address } = deployedNetwork;
    if (!address) {
      address = KOVAN_ADDRESS; // Fallback address of known contract
    }
    transportInstance = new web3.eth.Contract(TransportContract.abi, address);

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
  return await transportInstance.methods.price().call();
};

export const getLastUsers = async () => {
  return await transportInstance.methods.users().call();
};

export const purchaseContract = async (ethAmount) => {
  if (!ethAmount) {
    alert("Please wait for price to be determined");
    return;
  }
  if (!web3) {
    await initContractInstance();
  }
  // List of lat/lngs of form [lat1, lng1, lat2, lng2, ...]
  // Get the value from the contract to prove it worked.
  console.log("purchase", ethAmount);
  const response = await transportInstance.methods.purchasePass().send({
    from: accounts[0],
    value: web3.utils.toWei(ethAmount + "", "ether").toString(),
  });
  console.log("response", JSON.stringify(response));
  return response;
};

export const requestPrice = async (latLngs, start, end) => {
  // List of lat/lngs of form [lat1, lng1, lat2, lng2, ...]
  // Get the value from the contract to prove it worked.
  try {
    const response = await transportInstance.methods
      .requestPrice(latLngs, start, end)
      .send({ from: accounts[0] });
    return response;
  } catch (err) {
    await initContractInstance();
    throw err;
  }
};

export const getHashUrl = (hash) => `https://kovan.etherscan.io/tx/${hash}`;
