import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Typewriter from "typewriter-effect";

import { vanillaTemplate, reactTemplate } from "../templates";
import { projectType } from "../App";

import ReactIcon from "../assets/react.svg";
import HTMLIcon from "../assets/html.svg";
import code from "../assets/code.svg";

interface Props {
	project: projectType;
	setProject: React.Dispatch<React.SetStateAction<projectType>>;
}

const subtitle = ["React", "Vanilla HTML", "You"];

const Home: React.FC<Props> = ({ project, setProject }) => {
	const navigate = useNavigate();

	const [localProjects, setLocalProjects] = useState<Array<projectType>>([]);

	const [isHovering, setIsHovering] = useState<Array<boolean>>([]);
	const [isShowModal, setIsShowModal] = useState(false);

	const createNew = (projectType: string) => {
		const id = uuidv4();

		setProject({
			id: id,
			projectName: "",
			type: projectType,
			codes: projectType === "react" ? reactTemplate : vanillaTemplate,
		});
	};

	const loadSavedProject = (id: string) => {
		const savedProject = localProjects.filter(
			(localProject) => localProject.id === id
		)[0];

		setProject(savedProject);
	};

	useEffect(() => {
		if (project.id !== "") {
			if (project.type === "react") {
				navigate(`/react/${project.id}`);
			} else {
				navigate(`/editor/${project.id}`);
			}
		}
	}, [project]);

	useEffect(() => {
		const localProjects =
			localStorage.getItem("BIGO_LOCALPROJECTS") !== null
				? JSON.parse(localStorage.getItem("BIGO_LOCALPROJECTS")!)
				: [];

		setIsHovering(Array(localProjects.length).fill(false));
		setLocalProjects(localProjects);
	}, []);

	const handleHover = (index: number, value: boolean) => {
		let newArr = [...isHovering];

		newArr[index] = value;

		setIsHovering(newArr);
	};

	const handleDelete = (id: string, e: any) => {
		e.stopPropagation();

		let newProjectlist = [...localProjects];

		newProjectlist = localProjects.filter((project) => {
			return project.id !== id;
		});

		localStorage.setItem("BIGO_LOCALPROJECTS", JSON.stringify(newProjectlist));
		setLocalProjects(newProjectlist);
	};

	return (
		<div
			className="container flex items-center w-full h-full gap-6 mx-auto "
			onClick={() => setIsShowModal(false)}
		>
			<div className="flex flex-col justify-center w-1/2 gap-12 ml-44">
				<div className="font-bold text-9xl brush">BigO</div>

				<div className="flex text-xl font-medium">
					<div className="mr-1">An online editor just for </div>
					<Typewriter
						options={{
							strings: subtitle,
							autoStart: true,
							loop: true,
						}}
					/>
				</div>

				<div className="flex gap-4">
					<div
						onClick={(e) => {
							e.stopPropagation();
							setIsShowModal(true);
						}}
						className="px-3 py-1 text-center text-white border-2 rounded-md cursor-pointer bg-neutral-600 border-neutral-600 hover:border-neutral-600/75 hover:bg-neutral-600/75"
					>
						Create New Project
					</div>
				</div>
			</div>

			<div className="flex flex-col justify-center w-full h-4/5">
				{localProjects.length !== 0 ? (
					<div className="ml-20">
						<div className="text-xl font-bold">Recent Projects </div>
						<div className="flex flex-wrap gap-4 my-4 overflow-auto">
							{localProjects.map((localproject, index) => {
								return (
									<div
										key={localproject.id}
										onClick={() => loadSavedProject(localproject.id)}
										onMouseEnter={() => handleHover(index, true)}
										onMouseLeave={() => handleHover(index, false)}
										className="relative p-3 rounded-lg cursor-pointer hover:bg-neutral-300/50"
									>
										{localproject.type === "react" ? (
											<img src={ReactIcon} className="w-16 h-16 mx-auto mb-4" />
										) : (
											<img src={HTMLIcon} className="w-16 h-16 mx-auto mb-4" />
										)}

										<div className="w-24 text-center truncate">
											{localproject.projectName
												? localproject.projectName
												: localproject.id}
										</div>

										{isHovering[index] ? (
											<div
												className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 text-white bg-red-500 rounded-full"
												onClick={(e) => handleDelete(localproject.id, e)}
											>
												x
											</div>
										) : null}
									</div>
								);
							})}
						</div>
					</div>
				) : (
					<div className="flex w-full p-8 mx-auto ">
						<img src={code} />
					</div>
				)}
			</div>

			{isShowModal ? (
				<div className="absolute p-8 text-white -translate-x-1/2 -translate-y-1/2 rounded-md shadow-md bg-neutral-600 top-1/2 left-1/2">
					<div>Which Type of Project would you like to craete.</div>
					<div className="flex items-center gap-4 my-8 justify-evenly">
						<div
							className="p-3 rounded-lg cursor-pointer hover:bg-neutral-300/50"
							onClick={() => createNew("react")}
						>
							<img src={ReactIcon} className="w-16 h-16 mx-auto mb-4" />
							<div className="w-24 text-center truncate">React</div>
						</div>

						<div
							className="p-3 rounded-lg cursor-pointer hover:bg-neutral-300/50"
							onClick={() => createNew("vanilla")}
						>
							<img src={HTMLIcon} className="w-16 h-16 mx-auto mb-4" />
							<div className="w-24 text-center truncate">Vanilla</div>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
};

export default Home;
