import React from "react";

interface ErrorBoundaryProps {
	children: React.ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	// This static method is called after an error has been thrown by a descendant component.
	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error: error };
	}

	// This method is called after an error has been thrown.
	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error("Uncaught error:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className='flex flex-col items-center justify-center h-screen bg-red-100'>
					<h1 className='text-6xl font-bold text-red-800 mb-4'>Oops!</h1>
					<p className='text-2xl text-red-600 mb-8'>Something went wrong.</p>
					<p className='text-lg text-red-500 mb-4'>
						{this.state.error?.message || "An unknown error occurred."}
					</p>
					<button
						onClick={() => this.setState({ hasError: false, error: null })}
						className='px-6 py-3 bg-blue-500 text-white rounded-md text-lg hover:bg-blue-600 transition-colors'
					>
						Try again
					</button>
				</div>
			);
		}

		return this.props.children;
	}
}
