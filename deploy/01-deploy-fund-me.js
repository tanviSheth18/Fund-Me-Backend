// // //function deployFunc() {
// //     console.log("HI!")
// // } //default function for hardhat to look for}

// module.exports.default = deployFunc

// module.exports = async (hre) => {
//     const {getNamedAccounts, deployments} = hre
//     //same as hre.getNamedAccounts
//     //and as hre.deployments

// }
const { ethers } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config") //extrapalate networkConfig from the helper shit
const { network } = require("hardhat")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments //pull from deployments
    const { deployer } = await getNamedAccounts() //pull account from getNamesAccounts() functions
    const chainId = network.config.chainId // get chainId

    //if chainId is X, use address Y
    //if chainid is Z use address A

    //const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"] // no matter what network we deploy to, the chainId will use the right priceFeed address
    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAgregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAgregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    //well what happens when we want to change chains?
    //when going for localhost or hardhat network we want to use a mock
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, //put price feed address
        log: true,
        waitConfirmations: network.config.blockConfimations || 1,
    })
    log("__________________________")

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
        //name of network isnt development chain
    ) {
        await verify(fundMe.address, args)
    }
    log("________________")
}
module.exports.tags = ["all", "fundme"]
//robust script to a local development chain, testnet chain, mainnet chain,deply anywhere
