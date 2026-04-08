export type CharacterOption = {
  accent: string;
  id: string;
  imageSource: number;
  label: string;
};

export const LEGACY_CHARACTER_MAP: Record<string, string> = {
  alligator: "frog",
  bee: "frog",
  bear: "dog",
  dolphin: "frog",
  elephant: "panda",
  fish: "frog",
  giraffe: "bunny",
  hamster: "dog",
  hedgehog: "bunny",
  koala: "panda",
  lion: "fox",
  octopus: "frog",
  otter: "panda",
  penguin: "panda",
  raccoon: "panda",
  sloth: "dog",
  snail: "bunny",
  tiger: "fox",
  turtle: "frog",
  unicorn: "bunny",
  whale: "frog",
};

// Swap these six `avatars/*.svg` sources to the final raster pack in
// `assets/images/avatars-clean/*.png` when the clean rendered set is ready.
// Keeping the mapping centralized means the signup/profile flow will not
// need any more UI changes.
export const CHARACTER_OPTIONS: CharacterOption[] = [
  { id: "bunny", label: "Bunny", imageSource: require("../assets/images/avatars/bunny.svg"), accent: "#FFC6D8" },
  { id: "cat", label: "Cat", imageSource: require("../assets/images/avatars/cat.svg"), accent: "#F6C07E" },
  { id: "dog", label: "Dog", imageSource: require("../assets/images/avatars/dog.svg"), accent: "#F2CA8B" },
  { id: "fox", label: "Fox", imageSource: require("../assets/images/avatars/fox.svg"), accent: "#F09A4A" },
  { id: "frog", label: "Frog", imageSource: require("../assets/images/avatars/frog.svg"), accent: "#9BE166" },
  { id: "panda", label: "Panda", imageSource: require("../assets/images/avatars/panda.svg"), accent: "#EFEDEF" },
];

export function normalizeCharacterId(characterId: string | undefined) {
  if (!characterId) {
    return "";
  }

  return LEGACY_CHARACTER_MAP[characterId] ?? characterId;
}
