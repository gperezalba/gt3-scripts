const gqlGateway = require('../subgraph/gql.gateway');
const { GET_GAUGE_REWARDS } = require('./queries');

const GT3_HOLESKY_GRAPH_URL = 'https://subgraph.satsuma-prod.com/15c928d3b406/tutellus/gt3-holesky/version/0.0.3/api';

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

module.exports = {
  getGaugeRewards
};