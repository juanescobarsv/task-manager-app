import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/appErrorBoundary";
import { HomePage, NotFoundPage, ErrorPage } from "./components/appPages";

const App = () => {
	return (
		<Router>
			<ErrorBoundary>
				<Routes>
					<Route path='/' element={<HomePage />} />
					{/* <Route path='/dashboard' element={<DashboardView />} />
					<Route path='/tasks' element={<TasksView />} /> */}
					<Route path='*' element={<NotFoundPage />} />
					<Route path='/error' element={<ErrorPage />} />
				</Routes>
			</ErrorBoundary>
		</Router>
	);
};

export default App;
