## TransportChain

Dynamic pricing for government transport services.

A chainlink model that allows purchase of public transport passes based on volume present at different transport hubs and the number of passes previously purchased.

Going after:

1. Government tech prize
2. Social impact prize.
3. GeoDB

## Inspiration

Covid caused a huge drop in public service usage that could be mitigated/reduced by offering the public the ability to pre-purchase futures for public transport on chainlink.

Right now I could go buy a bus pass and it always costs $2.50.
You don't want to have big chunks of the day or the year where running transport is open. Might as well discount them so you can still fill them up.

They run this at ski resorts because if there's a big event that causes a drop in people they still want to invite attendees. Transport business can get a more stable source of revenue if individuals purchase longer term passes. Customers also win because they know the price isn't going to go way up if the demand goes way up in the future.

## What it does

- Uses chainlink oracles to model/track attendence at different airport and transportation hubs.
- Determines a real-time price for a given transport contract.
- Generates a QR code representing your pass purchase.

## How we built it
- Chainlink
- GeoDB

## Challenges we ran into

Integrating the different blockchain technologies.

## Accomplishments that we're proud of

## What we learned

## What's next for Transport Chain
* Support longer term passes
* More historic data to improve the pricing model
* Admin graphs/reporting of purchases made by users


### links
* https://docs.plasmnet.io/build/smart-contracts/ethereum-contract-on-dusty-network
* https://docs.avax.network/build/tutorials/smart-contracts/deploy-a-smart-contract-on-avalanche-using-remix-and-metamask
* https://docs.matic.network/docs/develop/getting-started/

