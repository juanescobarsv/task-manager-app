import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import client from "./services/apolloClient";
import App from "./App";
import "@/styles/main.scss";

const rootElement = document.getElementById("root");

if (rootElement) {
	ReactDOM.createRoot(rootElement).render(
		<StrictMode>
			<ApolloProvider client={client}>
				<App />
			</ApolloProvider>
		</StrictMode>,
	);
} else {
	console.error('Root element not found. Please ensure your index.html has a div with id="root".');
}
