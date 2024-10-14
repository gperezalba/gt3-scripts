// gql.gateway.js

const { GraphQLClient } = require('graphql-request');

const gqlClient = (uri) => {
  const client = new GraphQLClient(uri, {
    credentials: 'same-origin',
  });
  return client;
};

async function send({ uri, query, variables = null }) {
  try {
    const response = await gqlClient(uri).request(query, variables);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  send,
};
