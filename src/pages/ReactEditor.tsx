import React, { useEffect, useState } from "react";
import { transform } from "@babel/standalone";
import { projectType } from "../App";
import Editor from "@monaco-editor/react";
import { useNavigate } from "react-router-dom";

interface Props {
	project: projectType;

	setProject: React.Dispatch<React.SetStateAction<projectType>>;
}

const ReactEditor: React.FC<Props> = ({ project, setProject }) => {
	const navigate = useNavigate();

	const [projectName, setprojectName] = useState(project.projectName);
	const [html, setHtml] = useState(project.codes.html);
	const [css, setCss] = useState(project.codes.css);
	const [js, setJs] = useState(project.codes.js);
	const [es5, setEs5] = useState(
		transform(project.codes.js, { presets: ["es2015", "react"] }).code
	);

	const [focus, setFocus] = useState({
		type: "html",
		content: html,
		name: "index.html",
	});

	const srcDoc = `
		<html>
			<body>${html}</body>
			<style>${css}</style>
			<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
			<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
			<script>${es5}</script>
		</html>
		`;

	useEffect(() => {
		const timeout = setTimeout(() => {
			try {
				const es5Code = transform(js, { presets: ["es2015", "react"] });

				setEs5(es5Code.code);
			} catch (e: any) {
				console.log(e);
			}
		}, 2000);

		return () => clearTimeout(timeout);
	}, [js]);

	useEffect(() => {
		if (project.id === "") {
			navigate("/");
		}
	}, [project]);

	const onHtmlChange = (value: string | undefined) => {
		if (value !== undefined) setHtml(value);
	};

	const onCssChange = (value: string | undefined) => {
		if (value !== undefined) setCss(value);
	};
	const onJsChange = (value: string | undefined) => {
		if (value !== undefined) {
			setJs(value);
		}
	};

	const onChange = (value: string | undefined) => {
		if (focus.type === "html") {
			onHtmlChange(value);
		} else if (focus.type === "css") {
			onCssChange(value);
		} else if (focus.type === "javascript") {
			onJsChange(value);
		}
	};

	const changeFocus = (value: string) => {
		let newFocus = { type: "", content: "", name: "" };

		if (value === "html") {
			newFocus = { type: "html", content: html, name: "index.html" };
		} else if (value === "css") {
			newFocus = { type: "css", content: css, name: "index.css" };
		} else {
			newFocus = { type: "javascript", content: js, name: "index.jsx" };
		}

		setFocus(newFocus);
	};

	const saveProject = () => {
		let isInLocal = false;

		const localProjects =
			localStorage.getItem("BIGO_LOCALPROJECTS") !== null
				? JSON.parse(localStorage.getItem("BIGO_LOCALPROJECTS")!)
				: [];

		localProjects.forEach((localProject: projectType) => {
			if (localProject.id === project.id) {
				localProject.codes.html = html;
				localProject.codes.css = css;
				localProject.codes.js = js;
				localProject.projectName = projectName;
				isInLocal = true;
			}

			console.log(localProject);
		});

		if (isInLocal) {
			localStorage.setItem("BIGO_LOCALPROJECTS", JSON.stringify(localProjects));
		} else {
			localStorage.setItem(
				"BIGO_LOCALPROJECTS",
				JSON.stringify([
					...localProjects,
					{
						id: project.id,
						type: project.type,
						projectName: projectName,
						codes: { html, css, js },
					},
				])
			);
		}
	};
	const updateProjectName = (e: any) => {
		setprojectName(e.target.value);
	};

	const handleExit = () => {
		saveProject();

		setProject({
			id: "",
			projectName: "",
			type: "",
			codes: {
				html: "",
				css: "",
				js: "",
			},
		});
	};

	return (
		<div className="flex h-full">
			<div className="flex flex-col gap-4 px-4 py-2">
				<div
					className="px-4 py-1 mx-auto rounded-md cursor-pointer hover:bg-neutral-600/50"
					onClick={handleExit}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-8 h-8"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
						/>
					</svg>
				</div>

				<div
					className={
						focus.type === "html"
							? "px-4 py-1 rounded-md cursor-pointer  bg-neutral-600/75 text-white"
							: 'px-4 py-1 rounded-md cursor-pointer  hover:bg-neutral-600/50"'
					}
					onClick={() => changeFocus("html")}
				>
					HTML
				</div>
				<div
					className={
						focus.type === "css"
							? "px-4 py-1 rounded-md cursor-pointer  bg-neutral-600/75 text-white"
							: 'px-4 py-1 rounded-md cursor-pointer  hover:bg-neutral-600/50"'
					}
					onClick={() => changeFocus("css")}
				>
					CSS
				</div>
				<div
					className={
						focus.type === "javascript"
							? "px-4 py-1 rounded-md cursor-pointer  bg-neutral-600/75 text-white"
							: 'px-4 py-1 rounded-md cursor-pointer  hover:bg-neutral-600/50"'
					}
					onClick={() => changeFocus("js")}
				>
					JS
				</div>
			</div>

			<div className="flex flex-col w-1/2 h-full py-2">
				<input
					value={projectName}
					placeholder={projectName === "" ? "Untitled" : ""}
					onChange={(e) => updateProjectName(e)}
					className="px-2 py-1 my-2 bg-transparent border-b-2 border-transparent outline-none focus:border-neutral-600"
				/>

				<Editor
					path={focus.name}
					defaultLanguage={focus.type}
					defaultValue={focus.content}
					onChange={onChange}
					className="mb-2 rounded-md grow"
				/>
			</div>

			{/* <Editor
					defaultLanguage="css"
					theme="vs-dark"
					defaultValue={css}
					onChange={onCssChange}
				/>
				<Editor
					defaultLanguage="javascript"
					theme="vs-dark"
					defaultValue={js}
					onChange={onJsChange}
				/> */}

			{/* <Draggable> */}
			<div className="grow">
				<div className="w-full h-full text-black bg-white ">
					{/* <div className="flex items-center justify-start h-8 gap-1 p-2 bg-black">
						<div className="w-3 h-3 bg-red-600 rounded-full cursor-pointer"></div>
						<div className="w-3 h-3 bg-orange-400 rounded-full cursor-pointer"></div>
						<div className="w-3 h-3 bg-green-600 rounded-full cursor-pointer"></div>
					</div> */}
					<iframe
						srcDoc={srcDoc}
						title="output"
						sandbox="allow-scripts"
						width={"100%"}
						height={"100%"}
					/>
				</div>
			</div>
			{/* </Draggable> */}
		</div>
	);
};

export default ReactEditor;
