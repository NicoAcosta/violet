const {expect} = require('chai')
const {BigNumber} = require('ethers')
const {ethers} = require('hardhat')

const uris = require('../metadata/uris')
const contractURI = 'https://ipfs.io/ipfs/' + uris.collection.json

describe('Violet', async function () {
	let violet

	let deployer, withdrawal1, withdrawal2, addr1, addr2, addrs

	before(async function () {
		await setTimestamp(1641006000) // 2022-01-01 00:00:00
	})

	beforeEach(async function () {
		;[deployer, withdrawal1, withdrawal2, addr1, addr2, ...addrs] =
			await ethers.getSigners()

		const Violet = await ethers.getContractFactory('Violet')
		violet = await Violet.deploy(
			contractURI,
			withdrawal1.address,
			withdrawal2.address
		)

		await violet.deployed()
	})

	describe('Deployment', async function () {
		describe('Initial state variables', async function () {
			it('Should set _lastId to 4', async function () {
				expect(await violet.totalSupply()).to.equal(4)
			})

			it('Should mint tokens to artist and dev', async function () {
				expect(
					await violet.balanceOf(
						'0x94A8F46E3e05d8aB61Fb22eDc2893bE249C11D66'
					)
				).to.equal(3)
				expect(
					await violet.balanceOf(
						'0xab468Aec9bB4b9bc59b2B2A5ce7F0B299293991f'
					)
				).to.equal(1)
			})

			it('Should set contract URI', async function () {
				expect(await violet.contractURI()).to.equal(contractURI)
			})
		})
	})

	describe('Collection URI', async function () {
		it('Should update collection URI', async function () {
			expect(await violet.contractURI()).to.equal(contractURI)

			const newContractURI = 'newContractURI'

			const setURI = await violet.setContractURI(newContractURI)
			await setURI.wait()

			expect(await violet.contractURI()).to.equal(newContractURI)
		})
	})

	describe('Minting', async function () {
		describe('Public minting', async function () {
			describe('Start date', async function () {
				it('Should revert if minting has not started', async function () {
					await expect(
						violet.mintViolet(addr1.address, {
							value: await violet.mintingPrice()
						})
					).to.be.revertedWith(
						'VioletFirstEdition: Public minting has not started yet'
					)
				})

				it('Should enable minting if minting has started', async function () {
					await setTimestampBigNumber(
						await violet.MINTING_START_DATE()
					)

					await mintViolet(addr1)
				})
			})
		})
	})

	const mintViolet = async (to) => {
		const tx = await violet.mintViolet(to.address, {
			value: await violet.mintingPrice()
		})
		await tx.wait()
		return tx
	}

	const mintViolets = async (edition, to, amount) => {
		const tx = await violet.mintViolets(to.address, amount, {
			value: await violet.mintingPrice()
		})
		await tx.wait()
		return tx
	}

	// describe('Minting', async function () {
	// 	describe('Edition period', async function () {
	// 		beforeEach(async function () {
	// 			await createEdition(0)
	// 		})

	// 		it('Should revert if edition has not started yet', async function () {
	// 			await expect(
	// 				contract.mintViolet(0, {value: mintingPrice})
	// 			).to.be.revertedWith('Minting has not started yet')
	// 		})

	// 		it('Should enable minting during edition minting period', async function () {
	// 			await setTimestamp(editions[0].startDate)

	// 			await mintViolet(addr1, 0)
	// 		})

	// 		it('Should revert if edition has already ended', async function () {
	// 			setTimestamp(editions[0].endDate)
	// 			await expect(
	// 				contract.mintViolet(0, {value: mintingPrice})
	// 			).to.be.revertedWith('Minting has already ended')
	// 		})
	// 	})

	// 	describe('Ids', async function () {
	// 		beforeEach(async function () {
	// 			await createEdition(1)
	// 			await setTimestamp(editions[1].startDate)
	// 		})

	// 		it('Should mint new id', async function () {
	// 			await mintViolet(addr1, 0)

	// 			expect(await contract.ownerOf(1)).to.equal(addr1.address)
	// 			expect(await contract.balanceOf(addr1.address)).to.equal(1)

	// 			await mintViolets(addr1, 0, 2)

	// 			expect(await contract.ownerOf(3)).to.equal(addr1.address)
	// 			expect(await contract.balanceOf(addr1.address)).to.equal(3)
	// 		})
	// 	})
	// })
})

async function setTimestamp(n) {
	await ethers.provider.send('evm_setNextBlockTimestamp', [n])
	await ethers.provider.send('evm_mine')
}

async function setTimestampBigNumber(bn) {
	await setTimestamp(bn.toNumber())
}
