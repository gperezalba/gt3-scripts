const gql = require('graphql-tag');

const GET_GAUGE_REWARDS = gql`
query GET_GAUGE_REWARDS (
  $first: Int!,
  $skip: Int!,
  $where: GaugeReward_filter,
  $orderBy: GaugeReward_orderBy,
  $orderDirection: OrderDirection,
) {
  gaugeRewards(
    first: $first,
    skip: $skip,
    where: $where,
    orderBy: id,
    orderDirection: asc,
  ) {
    id
    epochNumber
    epoch {
      emission
    }
    amount
    pairReserve0
    pairReserve1
    pairTotalSupply
    gaugeDeposited
    gauge {
      id
      pair {
        id
        symbol
        token0 {
          id
          symbol
          decimals
        }
        token1 {
          id
          symbol
          decimals
        }
      }
      totalSupply
    }
  }
}
`;

const GET_GAUGERS = gql`
query GET_GAUGERS (
  $first: Int!,
  $skip: Int!,
  $where: Gauger_filter,
  $orderBy: Gauger_orderBy,
  $orderDirection: OrderDirection,
) {
  gaugers(
    first: $first,
    skip: $skip,
    where: $where,
    orderBy: id,
    orderDirection: asc,
  ) {
    claimedRewards
    lastClaimTimestamp
    gauge {
      id
      pair {
        id
        symbol
        token0 {
          id
          symbol
          decimals
        }
        token1 {
          id
          symbol
          decimals
        }
      }
    }
  }
}
`;

module.exports = {
  GET_GAUGE_REWARDS,
  GET_GAUGERS
};