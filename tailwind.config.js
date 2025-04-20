// tailwind.config.js
// @ts-ignore
import daisyui from "daisyui";
export const content = ["./src/**/*.{html,js}"];
export const theme = {
  extend: {},
};
daisyui.themes = ["black", "lofi"];

export const plugins = [daisyui];
