//don't need to deploy mocks to testnets

const { ethers } = require("hardhat")
const { network } = require("hardhat")
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments //pull from deployments
    const { deployer } = await getNamedAccounts() //pull account from getNamedAccounts() functions

    if (developmentChains.includes(network.name)) {
        log("Local network detected! Deploying mocks..")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        })
        log("Mocks deployed")
        log("_______________________________________")
    }
}

module.exports.tags = ["all", "mocks"]
