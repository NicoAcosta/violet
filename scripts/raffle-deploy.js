const {BigNumber} = require('ethers')
const hre = require('hardhat')

const snapshotURL =
	'https://ipfs.io/ipfs/bafybeidsanm573nvzzliztvwtzw7l6eo235kkksyad7ebyegayprgwjpzm'

let deployer, addrs

async function deploy() {
	const Raffle = await hre.ethers.getContractFactory(
		'UltraVioletExperienceRaffle'
	)
	const raffle = await Raffle.deploy(snapshotURL, {
		gasPrice: BigNumber.from(process.env.MAINNET_GAS_PRICE)
	})

	const tx = raffle.deployTransaction
	console.log('Deployment tx:', tx.hash)

	await raffle.deployed()
	;[deployer, ...addrs] = await ethers.getSigners()

	console.log('UltraVioletExperienceRaffle deployed to:', raffle.address)
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
