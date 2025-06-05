import { ApolloClient, InMemoryCache, ApolloLink, HttpLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

interface ImportMetaEnv {
	readonly VITE_GRAPHQL_API_URI?: string;
	readonly VITE_AUTH_TOKEN?: string;
}

const env = import.meta.env as ImportMetaEnv;

const GRAPHQL_API_URI: string = env.VITE_GRAPHQL_API_URI ?? "http://localhost:4000/graphql";
const AUTH_TOKEN: string | undefined = env.VITE_AUTH_TOKEN;

const httpLink = new HttpLink({
	uri: GRAPHQL_API_URI,
	headers: {
		...(AUTH_TOKEN && { Authorization: `Bearer ${AUTH_TOKEN}` }),
	},
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors) {
		graphQLErrors.forEach(({ message, locations, path }) => {
			const formattedLocations = locations ? JSON.stringify(locations) : "N/A";
			const formattedPath = path ? path.join(".") : "N/A";

			console.error(
				`[GraphQL error]: Message: ${message}, Location: ${formattedLocations}, Path: ${formattedPath}`,
			);
		});
	}

	if (networkError) {
		let errorMessage = networkError.message;

		// Check if networkError has a 'result' property (common for ServerParseError/ServerError)
		// Ensure 'result' is an object before stringifying it to prevent errors on non-object types
		if (
			"result" in networkError &&
			networkError.result &&
			typeof networkError.result === "object"
		) {
			errorMessage = JSON.stringify(networkError.result);
		}

		console.error(`[Network error]: ${errorMessage}`);
	}
});

const link = ApolloLink.from([errorLink, httpLink]);

const client = new ApolloClient({
	link: link,
	cache: new InMemoryCache(),
	connectToDevTools: true,
});

export default client;
