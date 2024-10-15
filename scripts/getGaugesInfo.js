const { getGaugeRewards } = require("../subgraph/services")
const { getEpochByTimestamp, convertToUsdByAddress, convertLPToUsd, convertTo18Decimals } = require("./utils/utils")
const { parseUnits, maxUint256, parseEther } = require("viem")
const constants = require("./utils/constants")

const emptyObj = () => {
    return {
        EPOCH: 0,
        GAUGE: "",
        PAIR: {
            ADDRESS: "",
            SYMBOL: "",
            TOKEN0: {
                ADDRESS: "",
                SYMBOL: "",
                RESERVE: BigInt(0)
            },
            TOKEN1: {
                ADDRESS: "",
                SYMBOL: "",
                RESERVE: BigInt(0)
            },
        },
        GAUGE_TVL: BigInt(0),
        GAUGE_APR: BigInt(0),
        GAUGE_ROI: BigInt(0),
        EPOCH_TOTAL_EMISSION_GT3: BigInt(0),
        GAUGE_REWARDS_GT3: BigInt(0),
        GAUGE_REWARDS_USD: BigInt(0),
    }
}

async function main() {
    const GAUGES_INFO_ARRAY = []
    const currentEpoch = getEpochByTimestamp(parseInt(Date.now() / 1000))
    const gaugesRewards = await getGaugeRewards({
        fromEpoch: 960515,
        toEpoch: currentEpoch,
        where: {}
    })
    gaugesRewards.forEach(gauge => {
        const obj = emptyObj()
        obj.EPOCH = gauge.epochNumber
        obj.EPOCH_TOTAL_EMISSION_GT3 = gauge.epoch != null ? BigInt(gauge.epoch.emission) : BigInt(0)
        obj.GAUGE = gauge.gauge.id
        obj.PAIR.ADDRESS = gauge.gauge.pair.id
        obj.PAIR.SYMBOL = gauge.gauge.pair.symbol
        obj.PAIR.TOKEN0.ADDRESS = gauge.gauge.pair.token0.id
        obj.PAIR.TOKEN0.SYMBOL = gauge.gauge.pair.token0.symbol
        obj.PAIR.TOKEN1.ADDRESS = gauge.gauge.pair.token1.id
        obj.PAIR.TOKEN1.SYMBOL = gauge.gauge.pair.token1.symbol
        obj.PAIR.TOKEN0.RESERVE = gauge.pairReserve0
        obj.PAIR.TOKEN1.RESERVE = gauge.pairReserve1

        obj.GAUGE_REWARDS_USD = convertToUsdByAddress(constants.tokens.GT3.address, BigInt(gauge.amount))
        obj.GAUGE_REWARDS_GT3 = BigInt(gauge.amount)
        obj.GAUGE_TVL = convertLPToUsd(
            BigInt(gauge.gaugeDeposited),
            BigInt(gauge.pairTotalSupply),
            gauge.gauge.pair.token0.id,
            convertTo18Decimals(BigInt(gauge.pairReserve0), parseInt(gauge.gauge.pair.token0.decimals))
        )
        obj.GAUGE_ROI = obj.GAUGE_TVL == 0n ? maxUint256 : obj.GAUGE_REWARDS_USD * parseEther("100") / obj.GAUGE_TVL
        obj.GAUGE_APR = obj.GAUGE_ROI * BigInt(constants.SECONDS_IN_A_YEAR) / BigInt(constants.EPOCH_DURATION)
        GAUGES_INFO_ARRAY.push(obj)
    })
    console.log(GAUGES_INFO_ARRAY)
}

main()