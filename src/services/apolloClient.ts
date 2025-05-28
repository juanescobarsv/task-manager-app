import { ApolloClient, InMemoryCache, ApolloLink, HttpLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const httpLink = new HttpLink({
	uri: "https://syn-api-prod.herokuapp.com/graphql",
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors)
		graphQLErrors.forEach(({ message, locations, path }) =>
			console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
		);

	if (networkError) console.error(`[Network error]: ${networkError}`);
});

const link = ApolloLink.from([errorLink, httpLink]);

const client = new ApolloClient({
	link: link,
	cache: new InMemoryCache(),
	connectToDevTools: true,
});

export default client;
