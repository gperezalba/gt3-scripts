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
    amount
    pairReserve0
    pairReserve1
    pairTotalSupply
    gaugeDeposited
    gauge {
      pair {
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

module.exports = {
  GET_GAUGE_REWARDS,
};