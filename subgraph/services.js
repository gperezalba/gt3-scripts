const gqlGateway = require('../subgraph/gql.gateway');
const { GET_GAUGE_REWARDS, GET_GAUGERS, GET_BRIBE_REWARDS, GET_BRIBERS, GET_VOTES_EPOCHES } = require('./queries');

const GT3_HOLESKY_GRAPH_URL = 'https://subgraph.satsuma-prod.com/15c928d3b406/tutellus/gt3-sepolia-int/version/0.0.22/api';

const fetcher = async ({ query, variables }) => {
  return gqlGateway.send({ uri: GT3_HOLESKY_GRAPH_URL, query, variables });
};

const getGaugeRewards = async ({
  fromEpoch,
  toEpoch,
  where,
}) => {
  try {
    let skip = 0;
    let gaugeRewards = [];
    let hasMore = true;
    while (hasMore) {
      const variables = {
        first: 1000,
        skip,
        where: {
          ...where,
          epochNumber_gte: fromEpoch,
          epochNumber_lte: toEpoch,
        },
        orderBy: 'epochNumber',
        orderDirection: 'desc',
      };
      const { gaugeRewards: rewardsChunk = [] } = await fetcher({
        query: GET_GAUGE_REWARDS,
        variables,
      });
      gaugeRewards = [...gaugeRewards, ...rewardsChunk];
      hasMore = rewardsChunk.length === 1000;
      skip += 1000;
    }
    return gaugeRewards;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getGaugers = async ({
  user,
  where
}) => {
  try {
    let skip = 0;
    let gaugers = [];
    let hasMore = true;
    while (hasMore) {
      const variables = {
        first: 1000,
        skip,
        where: {
          ...where,
          address: user,
          balance_gt: 0
        },
        orderBy: 'balance',
        orderDirection: 'desc',
      };
      const { gaugers: gaugersChunk = [] } = await fetcher({
        query: GET_GAUGERS,
        variables,
      });
      gaugers = [...gaugers, ...gaugersChunk];
      hasMore = gaugersChunk.length === 1000;
      skip += 1000;
    }
    return gaugers;
  } catch (error) {
    console.error(error);
    return [];
  }
}

const getBribeRewards = async ({
  fromEpoch,
  toEpoch,
  where,
}) => {
  try {
    let skip = 0;
    let bribeRewards = [];
    let hasMore = true;
    while (hasMore) {
      const variables = {
        first: 1000,
        skip,
        where: {
          ...where,
          epochNumber_gte: fromEpoch,
          epochNumber_lte: toEpoch,
        },
        orderBy: 'epochNumber',
        orderDirection: 'desc',
      };
      const { bribeRewards: rewardsChunk = [] } = await fetcher({
        query: GET_BRIBE_REWARDS,
        variables,
      });
      bribeRewards = [...bribeRewards, ...rewardsChunk];
      hasMore = rewardsChunk.length === 1000;
      skip += 1000;
    }
    return bribeRewards;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getBribers = async ({
  tokenId,
  where
}) => {
  try {
    let skip = 0;
    let bribers = [];
    let hasMore = true;
    while (hasMore) {
      const variables = {
        first: 1000,
        skip,
        where: {
          ...where,
          tokenId: tokenId
        },
        orderBy: 'balance',
        orderDirection: 'desc',
      };
      const { bribers: bribersChunk = [] } = await fetcher({
        query: GET_BRIBERS,
        variables,
      });
      bribers = [...bribers, ...bribersChunk];
      hasMore = bribersChunk.length === 1000;
      skip += 1000;
    }
    return bribers;
  } catch (error) {
    console.error(error);
    return [];
  }
}

const getVotesByTokenIdAndEpoch = async ({
  tokenId,
  epoch,
  where
}) => {
  try {
    let skip = 0;
    let voteEpoches = [];
    let hasMore = true;
    while (hasMore) {
      const variables = {
        first: 1000,
        skip,
        where: {
          ...where,
          tokenId: tokenId,
          epochNumber_lte: epoch
        },
        orderBy: 'weight',
        orderDirection: 'desc',
      };
      const { voteEpoches: voteEpochesChunk = [] } = await fetcher({
        query: GET_VOTES_EPOCHES,
        variables,
      });
      voteEpoches = [...voteEpoches, ...voteEpochesChunk];
      hasMore = voteEpochesChunk.length === 1000;
      skip += 1000;
    }
    return voteEpoches;
  } catch (error) {
    console.error(error);
    return [];
  }
}

module.exports = {
  getGaugeRewards,
  getGaugers,
  getBribeRewards,
  getBribers,
  getVotesByTokenIdAndEpoch
};