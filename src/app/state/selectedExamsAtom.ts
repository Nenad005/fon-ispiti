import { atom } from "jotai";

export const selectedExamsAtom = atom<Record<string, string[]>>({});