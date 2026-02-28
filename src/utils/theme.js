import { useColorScheme } from "react-native";

export const DARK = {
  bg:           "#121213",
  surface:      "#1a1a1b",
  surface2:     "#242424",
  border:       "#3a3a3c",
  text:         "#ffffff",
  textMuted:    "#818384",
  correct:      "#538d4e",
  present:      "#b59f3b",
  absent:       "#3a3a3c",
  tileEmpty:    "transparent",
  tileActive:   "transparent",
  tileBorderEmpty:  "#3a3a3c",
  tileBorderActive: "#999",
  keyDefault:   "#818384",
  keyText:      "#ffffff",
  headerBorder: "#3a3a3c",
  modalBg:      "#1a1a1b",
  pip:          "#3a3a3c",
};

export const LIGHT = {
  bg:           "#ffffff",
  surface:      "#f6f7f8",
  surface2:     "#ececec",
  border:       "#d3d6da",
  text:         "#1a1a1b",
  textMuted:    "#787c7e",
  correct:      "#6aaa64",
  present:      "#c9b458",
  absent:       "#787c7e",
  tileEmpty:    "transparent",
  tileActive:   "transparent",
  tileBorderEmpty:  "#d3d6da",
  tileBorderActive: "#878a8c",
  keyDefault:   "#d3d6da",
  keyText:      "#1a1a1b",
  headerBorder: "#d3d6da",
  modalBg:      "#ffffff",
  pip:          "#d3d6da",
};

export function useTheme() {
  const scheme = useColorScheme();
  return scheme === "dark" ? DARK : LIGHT;
}
