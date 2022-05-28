const {expect} = require('chai')
const {BigNumber} = require('ethers')
const {ethers} = require('hardhat')

const snapshotURL =
	'https://ipfs.io/ipfs/bafybeidsanm573nvzzliztvwtzw7l6eo235kkksyad7ebyegayprgwjpzm'

describe.only('Raffle', async function () {
	let raffle

	let deployer, addr1, addr2, addrs

	beforeEach(async function () {
		;[deployer, addr1, addr2, ...addrs] = await ethers.getSigners()

		const Raffle = await ethers.getContractFactory(
			'UltraVioletExperienceRaffle'
		)
		raffle = await Raffle.deploy(snapshotURL)

		await raffle.deployed()
	})

	describe('Deployment', async function () {
		describe('Set snapshot URL', async function () {
			it('Should set snapshot URL', async function () {
				expect(await raffle.snapshotURL()).to.equal(snapshotURL)
			})
		})
	})

	describe('Raffle', async function () {
		it('Should return 0 before raffle', async function () {
			expect(await raffle.winnerId()).to.equal(0)
		})

		async function checkId() {
			const tx = await raffle.winnerRaffle()
			await tx.wait()

			const _id = await raffle.winnerId()
			const id = _id.toNumber()

			console.log('id:', id)

			expect(id).to.be.greaterThanOrEqual(5)
			expect(id).to.be.lessThanOrEqual(70)
		}

		it('Should set random id from 5 to 70', async function () {
			// for (let i = 0; i <= 500; i++) {
			await checkId()
			// }
		})

		it('Should revert when trying to raffle twice', async function () {
			const tx = await raffle.winnerRaffle()
			await tx.wait()

			await expect(raffle.winnerRaffle()).to.be.revertedWith(
				'Already raffled'
			)
		})
	})
})
