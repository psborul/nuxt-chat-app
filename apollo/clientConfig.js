import { InMemoryCache } from "apollo-cache-inmemory";
export default function(context) {
  return {
    httpLinkOptions: {
      uri: "https://my-hasura-graphql-test.herokuapp.com/v1/graphql",
      credentials: "same-origin"
    },
    cache: new InMemoryCache(),
    wsEndpoint: "ws://my-hasura-graphql-test.herokuapp.com/v1/graphql"
  };
}
