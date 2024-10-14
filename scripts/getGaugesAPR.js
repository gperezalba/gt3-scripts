const { getGaugeRewards } = require("../subgraph/services")
const { getEpochByTimestamp, convertToUsdByAddress, convertLPToUsd, convertTo18Decimals } = require("./utils/utils")
const { parseUnits } = require("viem")
const constants = require("./constants")

async function main() {
    const currentEpoch = getEpochByTimestamp(parseInt(Date.now() / 1000))
    const gaugesRewards = await getGaugeRewards({
        fromEpoch: 0,
        toEpoch: currentEpoch,
        where: {}
    })
    console.log(gaugesRewards)
    gaugesRewards.forEach(gauge => {
        const rewardsInUsd = convertToUsdByAddress(constants.tokens.GT3.address, BigInt(gauge.amount))
        console.log(rewardsInUsd)
        let gaugeLPInUsd = convertLPToUsd(
            BigInt(gauge.gaugeDeposited),
            BigInt(gauge.pairTotalSupply),
            gauge.gauge.pair.token0.id,
            convertTo18Decimals(BigInt(gauge.pairReserve0), parseInt(gauge.gauge.pair.token0.decimals))
        )
        console.log(gaugeLPInUsd)
        gaugeLPInUsd = gaugeLPInUsd == 0n ? 1n : gaugeLPInUsd
        const gaugeAPR = (rewardsInUsd * BigInt(constants.SECONDS_IN_A_YEAR) / gaugeLPInUsd) / BigInt(constants.EPOCH_DURATION) / BigInt(100n)
        console.log(gaugeAPR)
    })
}

main()