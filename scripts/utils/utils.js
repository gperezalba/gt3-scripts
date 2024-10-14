const constants = require("../constants")
const { formatUnits } = require('viem')

function getEpochByTimestamp(timestamp) {
    return parseInt(timestamp / constants.EPOCH_DURATION)
}

function convertTo18Decimals(tokenAmount, tokenDecimals) {
    return tokenAmount * 10n ** BigInt(18 - tokenDecimals)
}

//tokenAmount always in wei and BigInt
function convertToUsdByAddress(tokenAddress, tokenAmount) {
    //adhoc
    switch (tokenAddress) {
        case constants.tokens.GT3.address:
            return tokenAmount / 4n
        case constants.tokens.WBTC.address:
            return tokenAmount / 60000n
        case constants.tokens.FUSDT.address:
            return tokenAmount / 1n

        default:
            return 0n
    }
}

function convertLPToUsd(lpAmount, lpTotalSupply, token0, reserve0) {
    return lpAmount * convertToUsdByAddress(token0, reserve0 * 2n) / lpTotalSupply
}

module.exports = {
    getEpochByTimestamp,
    convertToUsdByAddress,
    convertLPToUsd,
    convertTo18Decimals
}