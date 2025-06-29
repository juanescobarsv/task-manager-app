import { Link } from "react-router-dom";
import AppLayout from "./AppLayout";

// BASIC RENDERS FOR THE APP
export const HomePage = () => (
	<div className='app-container'>
		<AppLayout />
	</div>
);

export const NotFoundPage = () => (
	<div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
		<h1 className='text-6xl font-bold text-gray-800 mb-4'>404</h1>
		<p className='text-2xl text-gray-600 mb-8'>Page Not Found</p>
		<Link
			to='/'
			className='px-6 py-3 bg-blue-500 text-white rounded-md text-lg hover:bg-blue-600 transition-colors'
		>
			Go to Home
		</Link>
	</div>
);

export const ErrorPage = () => (
	<div className='flex flex-col items-center justify-center h-screen bg-red-100'>
		<h1 className='text-6xl font-bold text-red-800 mb-4'>Error!</h1>
		<p className='text-2xl text-red-600 mb-8'>Something went wrong.</p>
		<Link
			to='/'
			className='px-6 py-3 bg-blue-500 text-white rounded-md text-lg hover:bg-blue-600 transition-colors'
		>
			Go to Home
		</Link>
	</div>
);
