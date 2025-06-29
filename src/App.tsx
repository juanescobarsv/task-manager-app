import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/AppErrorBoundary";
import { HomePage, NotFoundPage, ErrorPage } from "./components/AppPages";
import { ToastContainer } from "react-toastify";

const App = () => {
	return (
		<Router>
			<ErrorBoundary>
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/dashboard' element={<HomePage />} />
					{/* <Route path='/tasks' element={<TasksView />} /> */}
					<Route path='*' element={<NotFoundPage />} />
					<Route path='/error' element={<ErrorPage />} />
				</Routes>
				<ToastContainer
					position='top-right'
					autoClose={3000}
					hideProgressBar={false}
					newestOnTop
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme='dark'
				/>
			</ErrorBoundary>
		</Router>
	);
};

export default App;
