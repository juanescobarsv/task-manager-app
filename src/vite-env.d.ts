/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

// Declare modules for SVG imports as React components
// This tells TypeScript that importing a .svg file with ?react suffix
// will yield a React component.
declare module "*.svg?react" {
	import * as React from "react";

	const SVG: React.FC<React.SVGProps<SVGSVGElement>>;
	export default SVG;
}
