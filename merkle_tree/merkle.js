const CryptoJS = require("crypto-js");

function sha256 (seed) {
    return CryptoJS.SHA256(seed).toString();
}

const transactions = [{to: 'me', from: 'you', value: 10}, {to: 'you', from: 'me', value: 5}, {to: 'alice', from: 'bob', value: 5}, {to: 'bob', from: 'me', value: 15}, {to: 'jon', from: 'me', value: 15}, {to: 'bob', from: 'sally', value: 1}, {to: 'jan', from: 'sally', value: 105}, {to: 'len', from: 'johanna', value: 1}]
const leaves = transactions.map(x => sha256(JSON.stringify(x)))

function createMerkleTree(nodes){
    // if the nodes.length is greater than 1, we have not yet found the root, so loop through the the leaves and compute the hashes
    if (nodes.length > 1) {
      let newNodes = []
      let leafNodes = []
  
      // if leaf nodes, format them
      // This only works on your first pass - Array of leaf node hash => Array of objects, each with property {hash: >HASHSTRING<}
      if(typeof nodes[0] =='string'){
          nodes.forEach((value, index, array) => {
                leafNodes.push({hash: value})
          })
          nodes = leafNodes
      }
      
      // if odd number of nodes, duplicate the last one
      // reference: https://ethereum.stackexchange.com/questions/29286/can-a-mined-block-have-an-odd-number-of-transactions-if-so-how-does-the-merkle
      if(nodes.length % 2 == 1){
        nodes.push(nodes[nodes.length - 1])
      }
      
      // iterate over the nodes, hashing pairs into a single node 1 level up
        nodes.forEach((value, index, array) => {
          if(index % 2 == 0){
            newNodes.push({hash: sha256(array[index].hash + array[index + 1].hash), children: [array[index], array[index+1]]}) 
          } 
        })

        // Create newNodes array from current node array, only create every even node
        // newNodes objects = {hash: "", children: ""}
        // newNode = hash(current hash + next hash)
        // children = [this leaf, next leaf]
        
    //Go deeper one level

      return createMerkleTree(newNodes)

    } else {
      // if the nodes.length === 1, it's the root, so let's return it
      return nodes[0]
      
    }
  }


const simpleMerkleTree = createMerkleTree(leaves)

// leaves = Array of 8 hashes of the leaf nodes