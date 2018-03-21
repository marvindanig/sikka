const SHA256 = require('crypto-js/sha256')

class Transaction {
	constructor (fromAddress, toAddress, amount) {
		this.fromAddress = fromAddress
		this.toAddress = toAddress
		this.amount = amount
	}
}

class Block {
		constructor (timeStamp, transactions, prevHash = '') {
			this.timeStamp = timeStamp
			this.transactions = transactions
			this.prevHash = prevHash
			this.hash = this.calculateHash()
			this.nonce = 0;
		}
		calculateHash () { return SHA256(this.prevHash + this.timeStamp + JSON.stringify(this.transactions) + this.nonce).toString() }
		mineBlock (difficulty) {
			while ( this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
				this.nonce++;
				this.hash = this.calculateHash()
			}

		}
}

class BlockChain {
	constructor () {
		this.chain = [this.createGenesisBlock()]
		this.isValid = false
		this.difficulty = 2 // Takes about a minute to execute on 2GB RAM
		this.pendingTransactions = []
		this.miningReward = 100
	}
	createGenesisBlock (){
		return new Block(Date.now(), "Genesis block", "0")
	}
	getLatestBlock(){
		return this.chain[this.chain.length - 1]
	}
	getBalanceOfAddress(address){
		let balance = 0;
		for (const block of this.chain) {
			for (const trans of block.transactions) {
				if (trans.fromAddress === address) balance -= trans.amount
				if (trans.toAddress === address) balance += trans.amount
			}
		}
		return balance
	}
	minePendingTransactions(miningRewardAddress){
		let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash)
		block.mineBlock(this.difficulty)
		console.log('Block mined successfully.', block)
		this.chain.push(block)
		this.pendingTransactions = [ new Transaction(null, miningRewardAddress, this.miningReward)]
		this.isValid = this.isChainValid()
	}

	createTransaction(transaction){
		this.pendingTransactions.push(transaction)
	}

	isChainValid(){
		for(let i = 1; i < this.chain.length; i++) {
			const currentBlock = this.chain[i]
			const prevBlock = this.chain[i - 1]
			if (currentBlock.hash !== currentBlock.calculateHash()) return false
			if (currentBlock.prevHash !== prevBlock.hash) return false
		}
	return true
	}
}

let sikka = new BlockChain()


sikka.createTransaction(new Transaction('address1', 'address2', 100))
sikka.createTransaction(new Transaction('address2', 'address1', 50))

console.log('\n Starting the miner')

sikka.minePendingTransactions('minersAddress1')

console.log('\n Balance of minersAddress1 is =', sikka.getBalanceOfAddress('minersAddress1'))

// // console.log('Mining first block…')
// sikka.addBlock(new Block( Date.now(), { amount: 10 } ))

// // console.log('Mining second block…')
// // sikka.addBlock(new Block( Date.now(), { amount: 15 } ))



sikka.createTransaction(new Transaction('address3', 'address2', 50))
sikka.createTransaction(new Transaction('address1', 'address3', 20))

console.log('\n Starting the miner')

sikka.minePendingTransactions('minersAddress1')

console.log('\n Balance of minersAddress1 is =', sikka.getBalanceOfAddress('minersAddress1'))

console.log(JSON.stringify(sikka, null, 4))