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

const GET_BRIBE_REWARDS = gql`
query GET_BRIBE_REWARDS (
  $first: Int!,
  $skip: Int!,
  $where: BribeReward_filter,
  $orderBy: BribeReward_orderBy,
  $orderDirection: OrderDirection,
) {
  bribeRewards(
    first: $first,
    skip: $skip,
    where: $where,
    orderBy: id,
    orderDirection: asc,
  ) {
    bribe {
      id
      totalSupply
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
    bribeEpoch {
      totalSupply
    }
    rewardToken {
      id
      symbol
      decimals
    }
    epoch {
      veTotalSupply
      veDeposited
    }
    epochNumber
    amount
    amountFees
  }
}
`;


const GET_BRIBERS = gql`
query GET_BRIBERS (
  $first: Int!,
  $skip: Int!,
  $where: Briber_filter,
  $orderBy: Briber_orderBy,
  $orderDirection: OrderDirection,
) {
  bribers(
    first: $first,
    skip: $skip,
    where: $where,
    orderBy: id,
    orderDirection: asc,
  ) {
    id
    balance
    rewards {
      amount
      rewardToken {
        id
        symbol
        decimals
      }
    }
    bribe {
      id
      rewards {
        rewardToken {
          id
          symbol
          decimals
        }
      }
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

const GET_VOTES_EPOCHES = gql`
query GET_VOTES_EPOCHES (
  $first: Int!,
  $skip: Int!,
  $where: VoteEpoch_filter,
  $orderBy: VoteEpoch_orderBy,
  $orderDirection: OrderDirection,
) {
  voteEpoches(
    first: $first,
    skip: $skip,
    where: $where,
    orderBy: id,
    orderDirection: asc,
  ) {
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
    voter
    weight
    epochNumber
  }
}
`;

module.exports = {
  GET_GAUGE_REWARDS,
  GET_GAUGERS,
  GET_BRIBE_REWARDS,
  GET_BRIBERS,
  GET_VOTES_EPOCHES
};