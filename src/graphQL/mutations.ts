import { gql } from "@apollo/client";

export const CREATE_TASK_MUTATION = gql`
	mutation CreateTask($input: CreateTaskInput!) {
		createTask(input: $input) {
			id
			name
			status
			pointEstimate
			dueDate
			tags
			position
			assignee {
				id
				fullName
				email
				avatar
				type
				createdAt
				updatedAt
			}
			creator {
				id
				fullName
				email
				avatar
				type
				createdAt
				updatedAt
			}
			createdAt
		}
	}
`;

export const UPDATE_TASK_MUTATION = gql`
	mutation UpdateTask($input: UpdateTaskInput!) {
		updateTask(input: $input) {
			id
			name
			status
			pointEstimate
			dueDate
			tags
			position
			assignee {
				id
				fullName
				email
				avatar
				type
				createdAt
				updatedAt
			}
			creator {
				id
				fullName
				email
				avatar
				type
				createdAt
				updatedAt
			}
			createdAt
		}
	}
`;

export const DELETE_TASK_MUTATION = gql`
	mutation DeleteTask($input: DeleteTaskInput!) {
		deleteTask(input: $input) {
			id
			name
			status
			pointEstimate
			dueDate
			tags
			position
			assignee {
				id
				fullName
				email
				avatar
				type
				createdAt
				updatedAt
			}
			creator {
				id
				fullName
				email
				avatar
				type
				createdAt
				updatedAt
			}
			createdAt
		}
	}
`;
