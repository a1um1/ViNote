import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface NoteState {
	notes: Record<string, Record<number, string>>;
	addNote: (file: string, timestamp: number, content?: string) => void;
	deleteNote: (file: string, timestamp: number) => void;
}

export const useNoteStore = create<NoteState>()(
	persist(
		(set, get) => ({
			notes: {},
			addNote: (file, timestamp, content = "") => {
				const notes = get().notes;
				notes[file] ||= {};
				notes[file][timestamp] = content;
				set({ notes });
			},
			deleteNote: (file, timestamp) => {
				const notes = get().notes;
				delete notes[file][timestamp];
				set({ notes });
			},
		}),
		{
			name: "notes-storage",
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
