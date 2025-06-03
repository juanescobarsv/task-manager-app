import React from "react";
import { useQuery } from "@apollo/client";
import { GET_USER_PROFILE, GET_TASKS_LIST, GET_ALL_USERS } from "../graphQL/queries";

const DataViewer: React.FC = () => {
	// --- Fetch User Profile ---
	const {
		loading: profileLoading,
		error: profileError,
		data: profileData,
	} = useQuery(GET_USER_PROFILE);

	// --- Fetch Tasks ---
	// For demonstration, we'll provide an empty filter input.
	// In a real application, you'd pass dynamic variables based on user interaction.
	const {
		loading: tasksLoading,
		error: tasksError,
		data: tasksData,
	} = useQuery(GET_TASKS_LIST, {
		variables: {
			input: {}, // Empty input to fetch all tasks (or as many as the API allows without specific filters)
		},
	});

	// --- Fetch All Users ---
	const { loading: usersLoading, error: usersError, data: usersData } = useQuery(GET_ALL_USERS);

	return (
		<div className='data-viewer'>
			<h2>API Data Viewer</h2>

			{/* User Profile Section */}
			<div className='data-viewer__section'>
				<h3>Current User Profile:</h3>
				{profileLoading && <p>Loading profile...</p>}
				{profileError && <p className='error-message'>Error: {profileError.message}</p>}
				{profileData && profileData.profile ? (
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
						{tasksData.tasks.slice(0, 5).map(
							(
								task: any, // Limiting to 5 for brevity
							) => (
								<li key={task.id}>
									<strong>{task.name}</strong> (ID: {task.id}) - {task.status}
									<br />
									Points: {task.pointEstimate} | Due: {task.dueDate}
									{task.assignee && <p className='sub-info'>Assignee: {task.assignee.fullName}</p>}
									<p className='sub-info'>Tags: {task.tags.join(", ")}</p>
								</li>
							),
						)}
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
						{usersData.users.slice(0, 5).map(
							(
								user: any, // Limiting to 5 for brevity
							) => (
								<li key={user.id}>
									<strong>{user.fullName}</strong> ({user.email})
									<br />
									ID: {user.id} | Type: {user.type}
								</li>
							),
						)}
					</ul>
				) : (
					!usersLoading && <p>No users found.</p>
				)}
			</div>
		</div>
	);
};

export default DataViewer;
