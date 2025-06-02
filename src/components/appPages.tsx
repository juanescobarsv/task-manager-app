import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./UI-elements/TopBar";
import { Button, SwitchButton, AddButton } from "./UI-elements/Buttons";
import Tags from "./UI-elements/Tags";
import Avatar from "./UI-elements/Avatar";

// BASIC RENDERS FOR THE APP

export const HomePage = () => (
	<div className='p-8 text-center'>
		<TopBar />
		<Sidebar />
		<Button
			onClick={() => alert("Clicked!")}
			backgroundColor='var(--color-primary-4)'
			textColor='var(--color-neutral-1)'
		>
			My Button
		</Button>
		<Button
			onClick={() => alert("Clicked!")}
			backgroundColor='var(--color-neutral-5)'
			textColor='var(--color-neutral-2)'
		>
			Light Button
		</Button>
		<SwitchButton
			onSelect={(selected) => console.log("Selected:", selected)}
			initialSelected='function'
		/>
		<AddButton onClick={() => alert("Add something!")} />
		<Tags
			text='LABEL'
			backgroundColor='var(--color-neutral-4)'
			textColor='var(--color-neutral-1)'
			outlineColor='var(--color-neutral-1)'
		/>
		<Tags
			text='LABEL'
			iconName='calendar'
			backgroundColor='var(--color-secondary-4)'
			textColor='var(--color-neutral-1)'
		/>
		<Tags
			text='LABEL'
			outlineColor='var(--color-neutral-2)'
			textColor='var(--color-primary-1)'
			backgroundColor='var(--color-primary-4)'
		/>
		<Tags
			text='LABEL'
			iconName='setting'
			outlineColor='var(--color-tertiary-4)'
			textColor='var(--color-tertiary-4)'
			backgroundColor='transparent'
		/>
		<Avatar filename='alex-suprun.jpg' size='l' text='Jerome Bell' />
		<Avatar filename='victor-hladynets.jpg' size='m' text='Jerome Bell 2' />
		<Avatar filename='michelle-dam.jpg' size='s' />

		<div>
			<nav className='flex justify-center space-x-4'>
				<Link
					to='/dashboard'
					className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'
				>
					Dashboard
				</Link>
				<br></br>
				<Link
					to='/tasks'
					className='px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors'
				>
					Tasks
				</Link>
			</nav>
		</div>
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

export const TasksPage = () => (
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
