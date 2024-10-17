const { createPublicClient, http } = require("viem")
const { getGaugers } = require("../subgraph/services")
const PAIR_ABI = require("./abis/PAIR_ABI.json")
const GAUGE_ABI = require("./abis/GAUGE_ABI.json")
const { convertToUsdByAddress, convertTo18Decimals } = require("./utils/utils")
const { holesky } = require("viem/chains")
const MY_RPC = "https://eth-holesky.g.alchemy.com/v2/4TdNSFxZ4bOa-Lg8LkwLrqUrd4ye7aIJ"

const client = createPublicClient({
    chain: holesky,
    transport: http(MY_RPC),
})

const USER = "0xCD7669AAFffB7F683995E6eD9b53d1E5FE72c142"

const emptyObj = () => {
    return {
        GAUGE: "",
        PAIR: "",
        DEPOSITED_LP: BigInt(0),
        DEPOSITED_TOKEN0: BigInt(0),
        DEPOSITED_TOKEN1: BigInt(0),
        DEPOSITED_TOKEN0_USD: BigInt(0),
        DEPOSITED_TOKEN1_USD: BigInt(0),
        REWARDS_CLAIMABLE: BigInt(0),
        REWARDS_CLAIMED: BigInt(0),
        LAST_CLAIM_TIMESTAMP: 0,
    }
}

async function main() {
    const gaugers = await getGaugers({
        user: USER.toLowerCase(),
        where: {}
    })
    gaugers.forEach(async gauger => {
        const gaugeContract = {
            address: gauger.gauge.id,
            abi: GAUGE_ABI
        }
        const pairContract = {
            address: gauger.gauge.pair.id,
            abi: PAIR_ABI
        }

        const results = await client.multicall({
            contracts: [
                {
                    ...gaugeContract,
                    functionName: 'balanceOf',
                    args: [USER]
                },
                {
                    ...gaugeContract,
                    functionName: 'earned',
                    args: [USER]
                },
                {
                    ...pairContract,
                    functionName: 'totalSupply'
                },
                {
                    ...pairContract,
                    functionName: 'getReserves'
                }
            ]
        })
        const gaugeDeposited = results[0].result
        const pairTotalSupply = results[2].result
        const token0Reserve = results[3].result[0]
        const token1Reserve = results[3].result[1]
        const token0DepositedEquivalence = gaugeDeposited * token0Reserve / pairTotalSupply
        const token1DepositedEquivalence = gaugeDeposited * token1Reserve / pairTotalSupply
        const token0DepositedEquivalenceUsd = convertToUsdByAddress(
            gauger.gauge.pair.token0.id,
            convertTo18Decimals(token0DepositedEquivalence, gauger.gauge.pair.token0.decimals)
        )
        const token1DepositedEquivalenceUsd = convertToUsdByAddress(
            gauger.gauge.pair.token1.id,
            convertTo18Decimals(token1DepositedEquivalence, gauger.gauge.pair.token1.decimals)
        )
        const obj = emptyObj()
        obj.GAUGE = gauger.gauge.id
        obj.PAIR = gauger.gauge.pair.id
        obj.DEPOSITED_LP = gaugeDeposited
        obj.DEPOSITED_TOKEN0 = token0DepositedEquivalence
        obj.DEPOSITED_TOKEN1 = token1DepositedEquivalence
        obj.DEPOSITED_TOKEN0_USD = token0DepositedEquivalenceUsd
        obj.DEPOSITED_TOKEN1_USD = token1DepositedEquivalenceUsd
        obj.REWARDS_CLAIMABLE = results[1].result
        obj.REWARDS_CLAIMED = gauger.claimedRewards
        obj.LAST_CLAIM_TIMESTAMP = gauger.lastClaimTimestamp
        console.log(obj)
    })
}

main()