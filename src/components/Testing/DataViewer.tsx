import { useProfileQuery, useTasksQuery, useUsersQuery } from "../../graphQL/generated/graphql";

const DataViewer = () => {
	// --- Fetch User Profile using generated hook ---
	const { loading: profileLoading, error: profileError, data: profileData } = useProfileQuery();

	// --- Fetch Tasks using generated hook ---
	const {
		loading: tasksLoading,
		error: tasksError,
		data: tasksData,
	} = useTasksQuery({
		variables: {
			input: {}, // Still provide an empty input for now to fetch all tasks
		},
	});

	// --- Fetch All Users using generated hook ---
	const { loading: usersLoading, error: usersError, data: usersData } = useUsersQuery();

	return (
		<div className='data-viewer'>
			<h2>API Data Viewer (Using Codegen Hooks)</h2>

			{/* User Profile Section */}
			<div className='data-viewer__section'>
				<h3>Current User Profile:</h3>
				{profileLoading && <p>Loading profile...</p>}
				{profileError && <p className='error-message'>Error: {profileError.message}</p>}
				{profileData?.profile ? (
					<div>
						<p>
							<strong>Name:</strong> {profileData.profile.fullName}
						</p>
						<p>
							<strong>Email:</strong> {profileData.profile.email}
						</p>
						<p>
							<strong>ID:</strong> {profileData.profile.id}
						</p>
						<p>
							<strong>Type:</strong> {profileData.profile.type}
						</p>
						{profileData.profile.avatar && (
							<p>
								<strong>Avatar:</strong>{" "}
								<img
									src={profileData.profile.avatar}
									alt='Avatar'
									style={{ width: "30px", height: "30px", borderRadius: "50%" }}
								/>
							</p>
						)}
					</div>
				) : (
					!profileLoading && <p>No profile data available.</p>
				)}
			</div>

			{/* Tasks Section */}
			<div className='data-viewer__section'>
				<h3>Tasks:</h3>
				{tasksLoading && <p>Loading tasks...</p>}
				{tasksError && <p className='error-message'>Error: {tasksError.message}</p>}
				{tasksData && tasksData.tasks.length > 0 ? (
					<ul>
						{tasksData.tasks.slice(0, 5).map((task) => (
							<li key={task.id}>
								<strong>{task.name}</strong> (ID: {task.id}) - {task.status}
								<br />
								{/* Explicitly create a Date object from dueDate before calling toLocaleDateString() */}
								Points: {task.pointEstimate} | Due:{" "}
								{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}
								{/* Accessing assignee properties directly from the fetched data */}
								{task.assignee && <p className='sub-info'>Assignee: {task.assignee.fullName}</p>}
								<p className='sub-info'>Tags: {task.tags.join(", ")}</p>
							</li>
						))}
					</ul>
				) : (
					!tasksLoading && <p>No tasks found.</p>
				)}
			</div>

			{/* Users Section */}
			<div className='data-viewer__section'>
				<h3>All Users:</h3>
				{usersLoading && <p>Loading users...</p>}
				{usersError && <p className='error-message'>Error: {usersError.message}</p>}
				{usersData && usersData.users.length > 0 ? (
					<ul>
						{/* Type 'user' directly from the data structure provided by usersData.users */}
						{usersData.users.slice(0, 5).map((user) => (
							<li key={user.id}>
								<strong>{user.fullName}</strong> ({user.email})
								<br />
								ID: {user.id} | Type: {user.type}
							</li>
						))}
					</ul>
				) : (
					!usersLoading && <p>No users found.</p>
				)}
			</div>
		</div>
	);
};

export default DataViewer;
