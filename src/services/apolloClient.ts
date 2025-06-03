import { ApolloClient, InMemoryCache, ApolloLink, HttpLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const GRAPHQL_API_URI = import.meta.env.VITE_GRAPHQL_API_URI || "http://localhost:4000/graphql"; // Fallback for development
const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;

const httpLink = new HttpLink({
	uri: GRAPHQL_API_URI,
	headers: {
		...(AUTH_TOKEN && { Authorization: `Bearer ${AUTH_TOKEN}` }),
	},
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
