import { Link } from "react-router-dom";
import SidebarItem from "./UI-elements/SidebarItem";

// BASIC RENDERS FOR THE APP

export const HomePage = () => (
	<div className='p-8 text-center'>
		<SidebarItem
			label='Projects'
			iconPath='/src/assets/icons/square.svg' // Adjust this path based on your actual file structure
			isSelected={true}
			onClick={() => console.log("Projects clicked")}
		/>
		<h1 className='text-4xl font-bold mb-4'>Welcome to Task Management App!</h1>
		<p className='text-lg mb-8'>Navigate using the links below.</p>
		<nav className='flex justify-center space-x-4'>
			<Link
				to='/dashboard'
				className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'
			>
				Dashboard
			</Link>
			<Link
				to='/tasks'
				className='px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors'
			>
				Tasks
			</Link>
		</nav>
	</div>
);

export const DashboardPage = () => (
	<div className='p-8'>
		<h1 className='text-3xl font-bold mb-4'>Dashboard View</h1>
		<p>This is where your main dashboard content will go.</p>
		<Link to='/' className='text-blue-500 hover:underline mt-4 block'>
			Go back to Home
		</Link>
	</div>
);

export const TasksPage: React.FC = () => (
	<div className='p-8'>
		<h1 className='text-3xl font-bold mb-4'>Tasks View</h1>
		<p>Manage your tasks here.</p>
		<Link to='/' className='text-blue-500 hover:underline mt-4 block'>
			Go back to Home
		</Link>
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
