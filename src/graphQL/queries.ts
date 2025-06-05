import { gql } from "@apollo/client";

export const GET_USER_PROFILE = gql`
	query Profile {
		profile {
			id
			fullName
			email
			avatar
			type
			createdAt
			updatedAt
		}
	}
`;

export const GET_TASKS_LIST = gql`
	query Tasks {
		tasks(input: {}) {
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
				avatar
			}
			creator {
				id
				fullName
			}
			createdAt
		}
	}
`;

export const GET_ALL_USERS = gql`
	query Users {
		users {
			id
			fullName
			email
			avatar
			type
			createdAt
			updatedAt
		}
	}
`;
