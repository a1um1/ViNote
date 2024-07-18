"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNoteStore } from "@/lib/state";
import { createRef, useEffect, useState } from "react";
const pad = (num: number) => `000${num}`.slice(-2);
const sec2time = (time: number) => {
	const hours = Math.floor(time / 60 / 60);
	const minutes = Math.floor(time / 60) % 60;
	const seconds = Math.floor(time - minutes * 60);
	return `${hours > 0 ? `${pad(hours)}:` : ""}${pad(minutes)}:${pad(seconds)}`;
};
export const Viewer = () => {
	const [videoUrl, setVideoUrl] = useState<string | null>(null);
	const videoRef = createRef<HTMLVideoElement>();
	const [name, setName] = useState<string | null>(null);
	const [toNote, setToNote] = useState<string>("");
	const [time, setTime] = useState<number>(0);
	const notes = useNoteStore();
	const currentNote = Object.entries(notes.notes[name || ""] || {});

	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.ontimeupdate = (e) => {
				console.log(e);
				// @ts-ignore
				setTime(Math.floor(e.target?.currentTime || 0));
			};
		}
	}, [videoRef.current]);
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const url = URL.createObjectURL(file);
			setName(file.name);
			setVideoUrl(url);
		}
	};

	return (
		<>
			<div
				className="flex"
				onDragOver={(e) => e.preventDefault()}
				onDrop={(e) => {
					e.preventDefault();
					const file = e.dataTransfer.files[0];
					if (file) {
						const url = URL.createObjectURL(file);
						setVideoUrl(url);
					}
				}}
			>
				<div className="bg-black w-4/5">
					{/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
					<video
						controls
						src={videoUrl || ""}
						ref={videoRef}
						className="w-full h-screen"
					/>
				</div>
				<div className="w-1/5 p-4 flex gap-2 flex-col">
					<h1 className="bg-w">Notes</h1>
					<p className="text-xs">Loading File : {name}</p>
					<div className="h-full bg-secondary overflow-auto -mx-4 px-4 flex flex-col divide-y py-1">
						{currentNote.map(([timestamp, note]) => (
							<button
								key={timestamp}
								className="py-1.5 text-left"
								type="button"
								onClick={() => {
									if (videoRef.current)
										videoRef.current.currentTime = +timestamp;
								}}
							>
								<div className="flex items-center justify-between w-full">
									<p className="text-xs">{sec2time(+timestamp)}</p>
									<Button
										size="sm"
										className="p-1 h-4 text-red-500"
										variant="ghost"
										onClick={() => notes.deleteNote(name || "", +timestamp)}
									>
										{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-3 w-3"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M3 6h18" />
											<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
											<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
											<line x1="10" x2="10" y1="11" y2="17" />
											<line x1="14" x2="14" y1="11" y2="17" />
										</svg>
									</Button>
								</div>
								<p className="text-sm">{note}</p>
							</button>
						))}
					</div>
					<Textarea
						placeholder="Add Note"
						value={toNote}
						onChange={(e) => setToNote(e.currentTarget.value)}
					/>
					<Button
						onClick={(e) => {
							if (name != null) {
								notes.addNote(name, time, toNote);
								setToNote("");
							}
						}}
					>
						Add Note @ {sec2time(time)}
					</Button>
					<p className="text-xs">
						Made with ❤️ <code>a1um1</code>
					</p>
				</div>
			</div>
			{videoUrl ? (
				<></>
			) : (
				<div className="absolute w-full h-dvh bg-background z-10 left-0 top-0">
					<input
						type="file"
						accept="video/*"
						onChange={handleFileChange}
						id="upload"
						hidden
					/>
					<label
						htmlFor="upload"
						className="w-full h-dvh flex items-center justify-center"
						onDragOver={(e) => e.preventDefault()}
						onDrop={(e) => {
							e.preventDefault();
							const file = e.dataTransfer.files[0];
							if (file) {
								const url = URL.createObjectURL(file);
								setName(file.name);
								setVideoUrl(url);
							}
						}}
					>
						<p>Darg Or Click to load video</p>
					</label>
				</div>
			)}
		</>
	);
};
