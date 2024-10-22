const { createPublicClient, http } = require("viem")
const { getBribers } = require("../subgraph/services")
const BRIBE_ABI = require("./abis/BRIBE_ABI.json")
const { sepolia } = require("viem/chains")
const MY_RPC = "https://eth-sepolia.g.alchemy.com/v2/4TdNSFxZ4bOa-Lg8LkwLrqUrd4ye7aIJ"

const client = createPublicClient({
    chain: sepolia,
    transport: http(MY_RPC),
})

const TOKEN_ID = 1

const emptyObj = () => {
    return {
        BRIBE: "",
        PAIR: "",
        TOKEN_ID: TOKEN_ID,
        VOTES: BigInt(0),
        REWARDS_CLAIMABLE: [],
        REWARDS_CLAIMED: []
    }
}

async function main() {
    const bribers = await getBribers({
        tokenId: TOKEN_ID,
        where: {}
    })
    bribers.forEach(async briber => {
        console.log(briber)
        const bribeContract = {
            address: briber.bribe.id,
            abi: BRIBE_ABI
        }
        const contracts = []
        briber.bribe.rewards.forEach(async reward => {
            contracts.push({
                ...bribeContract,
                functionName: "earned",
                args: [reward.rewardToken.id, TOKEN_ID]
            })
        })
        const results = await client.multicall({
            contracts: contracts
        })
        const obj = emptyObj()
        obj.BRIBE = briber.bribe.id
        obj.PAIR = briber.bribe.pair.id
        obj.VOTES = briber.balance
        for (let i = 0; i < results.length; i++) {
            obj.REWARDS_CLAIMABLE.push({
                TOKEN: briber.bribe.rewards[i].rewardToken.id,
                AMOUNT: results[i].result
            })
        }
        briber.rewards.forEach(async reward => {
            obj.REWARDS_CLAIMED.push({
                TOKEN: reward.rewardToken.id,
                AMOUNT: BigInt(reward.amount)
            })
        })
        console.log(obj)
    })
}

main()