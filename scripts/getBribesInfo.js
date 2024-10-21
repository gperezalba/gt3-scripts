const { getBribeRewards } = require("../subgraph/services")
const { getEpochByTimestamp, convertToUsdByAddress, convertLPToUsd, convertTo18Decimals } = require("./utils/utils")
const { parseUnits, maxUint256, parseEther } = require("viem")
const constants = require("./utils/constants")

const emptyObj = () => {
    return {
        EPOCH: 0,
        BRIBE: "",
        PAIR: {
            ADDRESS: "",
            SYMBOL: "",
            TOKEN0: {
                ADDRESS: "",
                SYMBOL: "",
            },
            TOKEN1: {
                ADDRESS: "",
                SYMBOL: "",
            },
        },
        BRIBE_TVL: BigInt(0),
        BRIBE_APR: BigInt(0),
        BRIBE_ROI: BigInt(0),
        BRIBE_REWARDS_USD: BigInt(0),
        BRIBE_FEES_USD: BigInt(0),
        BRIBE_INCENTIVES_USD: BigInt(0),
        BRIBE_REWARDS: []
    }
}

async function main() {
    const currentEpoch = getEpochByTimestamp(parseInt(Date.now() / 1000))
    const bribesRewards = await getBribeRewards({
        fromEpoch: 0,
        toEpoch: currentEpoch,
        where: {}
    })
    const bribes = {}
    bribesRewards.forEach(bribe => {
        const id = bribe.bribe.id.concat("#").concat(bribe.epochNumber.toString())
        if (bribes[id] == null) bribes[id] = emptyObj()
        bribes[id].EPOCH = bribe.epochNumber
        bribes[id].BRIBE = bribe.bribe.id
        bribes[id].PAIR.ADDRESS = bribe.bribe.pair.id
        bribes[id].PAIR.SYMBOL = bribe.bribe.pair.symbol
        bribes[id].PAIR.TOKEN0.ADDRESS = bribe.bribe.pair.token0.id
        bribes[id].PAIR.TOKEN0.SYMBOL = bribe.bribe.pair.token0.symbol
        bribes[id].PAIR.TOKEN1.ADDRESS = bribe.bribe.pair.token1.id
        bribes[id].PAIR.TOKEN1.SYMBOL = bribe.bribe.pair.token1.symbol
        const rewardAmountUsd = convertToUsdByAddress(bribe.rewardToken.id, convertTo18Decimals(BigInt(bribe.amount), parseInt(bribe.rewardToken.decimals)))
        const rewardAmountFeesUsd = convertToUsdByAddress(bribe.rewardToken.id, convertTo18Decimals(BigInt(bribe.amountFees), parseInt(bribe.rewardToken.decimals)))
        bribes[id].BRIBE_REWARDS_USD += rewardAmountUsd
        bribes[id].BRIBE_INCENTIVES_USD += rewardAmountUsd - rewardAmountFeesUsd
        bribes[id].BRIBE_FEES_USD += rewardAmountFeesUsd
        bribes[id].BRIBE_REWARDS.push({
            REWARD_TOKEN: {
                ADDRESS: bribe.rewardToken.id,
                SYMBOL: bribe.rewardToken.symbol,
                DECIMALS: bribe.rewardToken.decimals,
                AMOUNT: BigInt(bribe.amount),
                AMOUNT_FEES: BigInt(bribe.amountFees),
                AMOUNT_USD: rewardAmountUsd,
                AMOUNT_FEES_USD: rewardAmountFeesUsd
            }
        })
        const bribeEpochEquivGt3 = bribe.epoch.veTotalSupply != "0" ? BigInt(bribe.epoch.veDeposited) * BigInt(bribe.bribe.totalSupply) / BigInt(bribe.epoch.veTotalSupply) : BigInt(0)
        const bribeEpochEquivUsd = convertToUsdByAddress(constants.tokens.GT3.address, bribeEpochEquivGt3, constants.tokens.GT3.decimals)
        bribes[id].BRIBE_TVL += bribeEpochEquivUsd
        bribes[id].BRIBE_ROI = bribes[id].BRIBE_TVL == 0n ? maxUint256 : bribes[id].BRIBE_REWARDS_USD * parseEther("100") / bribes[id].BRIBE_TVL
        bribes[id].BRIBE_APR = bribes[id].BRIBE_ROI * BigInt(constants.SECONDS_IN_A_YEAR) / BigInt(constants.EPOCH_DURATION)
        console.log(bribeEpochEquivGt3)
        console.log(bribeEpochEquivUsd)
        console.log(bribes)
    })
}

main()