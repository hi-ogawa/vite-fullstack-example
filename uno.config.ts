import { antdPreset } from "@hiogawa/unocss-preset-antd";
import {
  defineConfig,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  presets: [antdPreset(), presetUno()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
});
