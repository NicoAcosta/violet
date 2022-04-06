const {BigNumber} = require('ethers')
const hre = require('hardhat')

const uris = require('../metadata/uris')
const contractURI = 'https://ipfs.io/ipfs/' + uris.collection.json

async function deploy() {
	const Violet = await hre.ethers.getContractFactory('Violet')
	const violet = await Violet.deploy(
		contractURI,
		process.env.MAINNET_WITHDRAWAL_1,
		process.env.MAINNET_WITHDRAWAL_2,
		{gasPrice: BigNumber.from(process.env.MAINNET_GAS_PRICE)}
	)

	const tx = violet.deployTransaction
	console.log('Deployment tx:', tx.hash)

	await violet.deployed()
	;[deployer, ...addrs] = await ethers.getSigners()

	console.log('Violet deployed to:', violet.address)
	console.log('Deployed by:', deployer.address)
}

const tryToDeploy = async () => {
	// Repeat deploy() until gasPrice < block base fee
	deploy().catch((error) => {
		console.error(error)
		tryToDeploy()
	})
}

tryToDeploy()
