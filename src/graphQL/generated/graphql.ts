import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
	[_ in K]?: never;
};
export type Incremental<T> =
	| T
	| { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: { input: string; output: string };
	String: { input: string; output: string };
	Boolean: { input: boolean; output: boolean };
	Int: { input: number; output: number };
	Float: { input: number; output: number };
	DateTime: { input: Date; output: Date };
};

export type CreateTaskInput = {
	assigneeId?: InputMaybe<Scalars["String"]["input"]>;
	dueDate: Scalars["DateTime"]["input"];
	name: Scalars["String"]["input"];
	pointEstimate: PointEstimate;
	status: Status;
	tags: TaskTag[];
};

export type DeleteTaskInput = {
	id: Scalars["String"]["input"];
};

export type FilterTaskInput = {
	assigneeId?: InputMaybe<Scalars["String"]["input"]>;
	dueDate?: InputMaybe<Scalars["DateTime"]["input"]>;
	name?: InputMaybe<Scalars["String"]["input"]>;
	ownerId?: InputMaybe<Scalars["String"]["input"]>;
	pointEstimate?: InputMaybe<PointEstimate>;
	status?: InputMaybe<Status>;
	tags?: InputMaybe<TaskTag[]>;
};

export type Mutation = {
	__typename?: "Mutation";
	createTask: Task;
	deleteTask: Task;
	updateTask: Task;
};

export type MutationCreateTaskArgs = {
	input: CreateTaskInput;
};

export type MutationDeleteTaskArgs = {
	input: DeleteTaskInput;
};

export type MutationUpdateTaskArgs = {
	input: UpdateTaskInput;
};

/** Estimate point for a task */
export type PointEstimate = "EIGHT" | "FOUR" | "THREE" | "TWO" | "ONE" | "ZERO";

export type Query = {
	__typename?: "Query";
	profile: User;
	tasks: Task[];
	users: User[];
};

export type QueryTasksArgs = {
	input: FilterTaskInput;
};

/** Status for Task */
export type Status = "BACKLOG" | "CANCELLED" | "DONE" | "IN_PROGRESS" | "TODO";

export type Task = {
	__typename?: "Task";
	assignee?: Maybe<User>;
	createdAt: Scalars["DateTime"]["output"];
	creator: User;
	dueDate: Scalars["DateTime"]["output"];
	id: Scalars["ID"]["output"];
	name: Scalars["String"]["output"];
	pointEstimate: PointEstimate;
	position: Scalars["Float"]["output"];
	status: Status;
	tags: TaskTag[];
};

/** Enum for tags for tasks */
export type TaskTag = "ANDROID" | "IOS" | "NODE_JS" | "RAILS" | "REACT";

export type UpdateTaskInput = {
	assigneeId?: InputMaybe<Scalars["String"]["input"]>;
	dueDate?: InputMaybe<Scalars["DateTime"]["input"]>;
	id: Scalars["String"]["input"];
	name?: InputMaybe<Scalars["String"]["input"]>;
	pointEstimate?: InputMaybe<PointEstimate>;
	position?: InputMaybe<Scalars["Float"]["input"]>;
	status?: InputMaybe<Status>;
	tags?: InputMaybe<TaskTag[]>;
};

export type User = {
	__typename?: "User";
	avatar?: Maybe<Scalars["String"]["output"]>;
	createdAt: Scalars["DateTime"]["output"];
	email: Scalars["String"]["output"];
	fullName: Scalars["String"]["output"];
	id: Scalars["ID"]["output"];
	type: UserType;
	updatedAt: Scalars["DateTime"]["output"];
};

/** Type of the User */
export type UserType = "ADMIN" | "CANDIDATE";

export type ProfileQueryVariables = Exact<{ [key: string]: never }>;

export type ProfileQuery = {
	__typename?: "Query";
	profile: {
		__typename?: "User";
		id: string;
		fullName: string;
		email: string;
		avatar?: string | null;
		type: UserType;
		createdAt: Date;
		updatedAt: Date;
	};
};

// ! FALLBACK CHANGE: export type TasksQueryVariables = Exact<{ [key: string]: never }>;

export type TasksQueryVariables = Exact<{
	input: FilterTaskInput;
}>;

export type TasksQuery = {
	__typename?: "Query";
	tasks: Array<{
		__typename?: "Task";
		id: string;
		name: string;
		status: Status;
		pointEstimate: PointEstimate;
		dueDate: Date;
		tags: TaskTag[];
		position: number;
		createdAt: Date;
		assignee?: { __typename?: "User"; id: string; fullName: string; avatar?: string | null } | null;
		creator: { __typename?: "User"; id: string; fullName: string };
	}>;
};

export type UsersQueryVariables = Exact<{ [key: string]: never }>;

export type UsersQuery = {
	__typename?: "Query";
	users: Array<{
		__typename?: "User";
		id: string;
		fullName: string;
		email: string;
		avatar?: string | null;
		type: UserType;
		createdAt: Date;
		updatedAt: Date;
	}>;
};

export const ProfileDocument = gql`
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

/**
 * __useProfileQuery__
 *
 * To run a query within a React component, call `useProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useProfileQuery(
	baseOptions?: Apollo.QueryHookOptions<ProfileQuery, ProfileQueryVariables>,
) {
	const options = { ...defaultOptions, ...baseOptions };
	return Apollo.useQuery<ProfileQuery, ProfileQueryVariables>(ProfileDocument, options);
}
export function useProfileLazyQuery(
	baseOptions?: Apollo.LazyQueryHookOptions<ProfileQuery, ProfileQueryVariables>,
) {
	const options = { ...defaultOptions, ...baseOptions };
	return Apollo.useLazyQuery<ProfileQuery, ProfileQueryVariables>(ProfileDocument, options);
}
export function useProfileSuspenseQuery(
	baseOptions?:
		| Apollo.SkipToken
		| Apollo.SuspenseQueryHookOptions<ProfileQuery, ProfileQueryVariables>,
) {
	const options =
		baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
	return Apollo.useSuspenseQuery<ProfileQuery, ProfileQueryVariables>(ProfileDocument, options);
}
export type ProfileQueryHookResult = ReturnType<typeof useProfileQuery>;
export type ProfileLazyQueryHookResult = ReturnType<typeof useProfileLazyQuery>;
export type ProfileSuspenseQueryHookResult = ReturnType<typeof useProfileSuspenseQuery>;
export type ProfileQueryResult = Apollo.QueryResult<ProfileQuery, ProfileQueryVariables>;
export const TasksDocument = gql`
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

/**
 * __useTasksQuery__
 *
 * To run a query within a React component, call `useTasksQuery` and pass it any options that fit your needs.
 * When your component renders, `useTasksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTasksQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useTasksQuery(
	baseOptions: Apollo.QueryHookOptions<TasksQuery, TasksQueryVariables> &
		({ variables: TasksQueryVariables; skip?: boolean } | { skip: boolean }),
) {
	const options = { ...defaultOptions, ...baseOptions };
	return Apollo.useQuery<TasksQuery, TasksQueryVariables>(TasksDocument, options);
}
export function useTasksLazyQuery(
	baseOptions?: Apollo.LazyQueryHookOptions<TasksQuery, TasksQueryVariables>,
) {
	const options = { ...defaultOptions, ...baseOptions };
	return Apollo.useLazyQuery<TasksQuery, TasksQueryVariables>(TasksDocument, options);
}
export function useTasksSuspenseQuery(
	baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<TasksQuery, TasksQueryVariables>,
) {
	const options =
		baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
	return Apollo.useSuspenseQuery<TasksQuery, TasksQueryVariables>(TasksDocument, options);
}
export type TasksQueryHookResult = ReturnType<typeof useTasksQuery>;
export type TasksLazyQueryHookResult = ReturnType<typeof useTasksLazyQuery>;
export type TasksSuspenseQueryHookResult = ReturnType<typeof useTasksSuspenseQuery>;
export type TasksQueryResult = Apollo.QueryResult<TasksQuery, TasksQueryVariables>;
export const UsersDocument = gql`
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

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useUsersQuery(
	baseOptions?: Apollo.QueryHookOptions<UsersQuery, UsersQueryVariables>,
) {
	const options = { ...defaultOptions, ...baseOptions };
	return Apollo.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
}
export function useUsersLazyQuery(
	baseOptions?: Apollo.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>,
) {
	const options = { ...defaultOptions, ...baseOptions };
	return Apollo.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
}
export function useUsersSuspenseQuery(
	baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UsersQuery, UsersQueryVariables>,
) {
	const options =
		baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
	return Apollo.useSuspenseQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
}
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersSuspenseQueryHookResult = ReturnType<typeof useUsersSuspenseQuery>;
export type UsersQueryResult = Apollo.QueryResult<UsersQuery, UsersQueryVariables>;
