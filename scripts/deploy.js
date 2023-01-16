const { ethers, run, network } = require("hardhat")

async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    console.log("deploying contract")
    const SimpleStorage = await SimpleStorageFactory.deploy()
    await SimpleStorage.deployed()
    console.log(`deployed contract to ${SimpleStorage.address}`)
    // console.log(network.config)
    if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
        await SimpleStorage.deployTransaction.wait(6)
        await verify(SimpleStorage.address, [])
    }

    const currentValue = await SimpleStorage.retrieve()
    console.log(`Current Value is: ${currentValue}`)

    //update
    const transactionResponse = await SimpleStorage.store(111)
    await transactionResponse.wait(1)

    const updatedValue = await SimpleStorage.retrieve()
    console.log(`updated Value is: ${updatedValue}`)
}

async function verify(contractAddress, args) {
    console.log(`verifying Contract . . .`)
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified")
        } else console.log(e)
    }
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.log(err)
        process.exit(1)
    })
