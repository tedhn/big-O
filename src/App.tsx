import { useEffect, useState } from "react";
import {
	createBrowserRouter,
	RouterProvider,
	Route,
	Link,
	Navigate,
} from "react-router-dom";

import { useNavigate } from "react-router-dom";

import CodeEditor from "./pages/Editor";
import Home from "./pages/Home";
import ReactEditor from "./pages/ReactEditor";

export type projectType = {
	id: string;
	projectName: string;
	type: string;
	codes: {
		html: string;
		css: string;
		js: string;
	};
};

function App() {
	// const navigate = useNavigate();

	const [project, setProject] = useState({
		id: "",
		projectName: "",
		type: "",
		codes: {
			html: "",
			css: "",
			js: "",
		},
	});

	// useEffect(() => {
	// 	if (project.id !== "") {
	// 		navigate(`/editor/${project.id}`);
	// 	}
	// }, [project]);

	const router = createBrowserRouter([
		{
			path: "/",
			element: <Home project={project} setProject={setProject} />,
			errorElement: (
				<div className="container h-full flex items-center justify-center mx-auto text-center text-6xl">
					page not found
				</div>
			),
		},
		{
			path: "editor",
			element: <CodeEditor project={project} setProject={setProject} />,
			errorElement: (
				<div className="container h-full flex items-center justify-center mx-auto text-center text-6xl">
					page not found
				</div>
			),
			children: [
				{
					path: ":id",
					element: <CodeEditor project={project} setProject={setProject} />,
				},
			],
		},
		{
			path: "react",
			element: <ReactEditor project={project} setProject={setProject} />,

			errorElement: (
				<div className="container h-full flex items-center justify-center mx-auto text-center text-6xl">
					page not found
				</div>
			),
			children: [
				{
					path: ":id",
					element: <ReactEditor project={project} setProject={setProject} />,
				},
			],
		},
	]);

	return (
		<div className="w-screen h-screen bg-slate-100">
			{/* <CodeEditor /> */}
			<RouterProvider router={router} />
		</div>
	);
}

export default App;
