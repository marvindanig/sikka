const SHA256 = require('crypto-js/sha256')

class Block {
		constructor (index, timeStamp, data, prevHash = '') {
			this.index = index
			this.timeStamp = timeStamp
			this.data = data
			this.prevHash = prevHash
			this.hash = this.calculateHash()
			this.nonce = 0;
		}
		calculateHash () { return SHA256(this.index + this.prevHash + this.timeStamp + JSON.stringify(this.data) + this.nonce).toString() }
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
		this.difficulty = 6 // Takes about a minute to execute on 2GB RAM
	}
	createGenesisBlock (){
		return new Block(0, Date.now(), "Genesis block", "0")
	}
	getLatestBlock(){
		return this.chain[this.chain.length - 1]
	}
	addBlock(newBlock) {
		newBlock.prevHash = this.getLatestBlock().hash
		newBlock.mineBlock(this.difficulty)
		this.chain.push(newBlock)
		this.isValid = this.isChainValid()
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
console.log('Mining first block…')
sikka.addBlock(new Block(1, Date.now(), { amount: 10 } ))

console.log('Mining second block…')
sikka.addBlock(new Block(1, Date.now(), { amount: 15 } ))

console.log(JSON.stringify(sikka, null, 4))


