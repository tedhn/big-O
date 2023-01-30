import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

import { transform } from "@babel/standalone";
import Draggable from "react-draggable";
import { useNavigate } from "react-router-dom";
import { projectType } from "../App";

interface Props {
	project: projectType;

	setProject: React.Dispatch<React.SetStateAction<projectType>>;
}

const CodeEditor: React.FC<Props> = ({ project, setProject }) => {
	const navigate = useNavigate();

	const [projectName, setprojectName] = useState(project.projectName);
	const [html, setHtml] = useState(project.codes.html);
	const [css, setCss] = useState(project.codes.css);
	const [js, setJs] = useState(project.codes.js);
	const [es5, setEs5] = useState(
		transform(project.codes.js, { presets: ["es2015", "react"] }).code
	);
	const [error, setError] = useState({
		code: "",
		reasonCode: "",
		loc: { line: 0, column: 0, index: 0 },
	});

	const [focus, setFocus] = useState({
		type: "html",
		content: html,
		name: "index.html",
	});

	const srcDoc = `
		<html>
			${html}
			<style>${css}</style>
			<script>${es5}</script>
		</html>
		`;

	const errorDoc = `
		<html>
			<body>${error.reasonCode} (${error.loc.line + ":" + error.loc.column})</body>
			<style>body{display:flex; justify-content:center; align-items:center;width:100vw;height:100vh;margin:0;padding:0;color:red;font-size:24px;}</style>
		</html>
		`;

	useEffect(() => {
		if (project.id === "") {
			navigate("/");
		}
	}, [project]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			try {
				const es5Code = transform(js, { presets: ["es2015", "react"] });

				setError({
					code: "",
					reasonCode: "",
					loc: { line: 0, column: 0, index: 0 },
				});
				setEs5(es5Code.code);
			} catch (e: any) {
				setError(e);
			}
		}, 2000);

		return () => clearTimeout(timeout);
	}, [js]);

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

	const changeFocus = (value: string) => {
		let newFocus = { type: "", content: "", name: "" };

		if (value === "html") {
			newFocus = { type: "html", content: html, name: "index.html" };
		} else if (value === "css") {
			newFocus = { type: "css", content: css, name: "index.css" };
		} else {
			newFocus = { type: "javascript", content: js, name: "index.js" };
		}

		setFocus(newFocus);
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

	const updateProjectName = (e: any) => {
		setprojectName(e.target.value);
	};

	return (
		<div className="flex h-full">
			<div className="flex flex-col gap-4 px-4 py-2">
				<div
					className="px-4 py-1 mx-auto rounded-md cursor-pointer  hover:bg-neutral-600/50"
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
							? "px-4 py-1 rounded-md cursor-pointer  bg-white/75 text-neutral-600"
							: 'px-4 py-1 rounded-md cursor-pointer  hover:bg-neutral-600/50"'
					}
					onClick={() => changeFocus("html")}
				>
					HTML
				</div>
				<div
					className={
						focus.type === "css"
							? "px-4 py-1 rounded-md cursor-pointer  bg-white/75 text-neutral-600"
							: 'px-4 py-1 rounded-md cursor-pointer  hover:bg-neutral-600/50"'
					}
					onClick={() => changeFocus("css")}
				>
					CSS
				</div>
				<div
					className={
						focus.type === "javascript"
							? "px-4 py-1 rounded-md cursor-pointer  bg-white/75 text-neutral-600"
							: 'px-4 py-1 rounded-md cursor-pointer  hover:bg-neutral-600/50"'
					}
					onClick={() => changeFocus("js")}
				>
					JS
				</div>
			</div>

			<div className="w-1/2 h-full py-2 flex flex-col">
				<input
					value={projectName}
					placeholder={projectName === "" ? "Untitled" : ""}
					onChange={(e) => updateProjectName(e)}
					className="px-2 py-1  bg-transparent border-b-2 border-transparent outline-none focus:border-white  my-2"
				/>

				<Editor
					path={focus.name}
					defaultLanguage={focus.type}
					defaultValue={focus.content}
					onChange={onChange}
					className="grow mb-2 rounded-md"
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
				<div className="bg-white w-full h-full  text-black ">
					{/* <div className="h-8 bg-black flex justify-start  p-2 items-center gap-1">
						<div className="rounded-full cursor-pointer bg-red-600 h-3 w-3"></div>
						<div className="rounded-full cursor-pointer bg-orange-400 h-3 w-3"></div>
						<div className="rounded-full cursor-pointer bg-green-600 h-3 w-3"></div>
					</div> */}
					<iframe
						srcDoc={error.code === "" ? srcDoc : errorDoc}
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

export default CodeEditor;
