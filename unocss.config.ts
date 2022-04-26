import { defineConfig, presetAttributify, presetUno, type UserConfig } from "unocss";
import transformerVariantGroup from "@unocss/transformer-variant-group";
import transformerDirective from "@unocss/transformer-directives";

export default defineConfig({
	include: ["{test,src}/**/*.{html,ts,svelte}", "../../libs/ui/package/**/*.{ts,svelte}"],
	presets: [
		presetAttributify({ prefix: "uno-" }),
		presetUno(),
	],
	transformers: [transformerDirective({ enforce: "pre" }), transformerVariantGroup()],
	shortcuts: [
		{
			"?": "b-4 border-red-500",
			"??": "b-4 border-green-500",
			"???": "b-4 border-blue-500",
			"flex-center": "flex justify-center items-center",
			"flex-main-center": "flex justify-center",
			"flex-cross-center": "flex items-center",
			"flex-1": "flex-[1_1_0px]"
		}
	],
	rules: [
		[
			/text-fluid(?:-\[)?(.*?)]?$/,
			([_, clamp = "1rem,1rem,1rem"]) => ({
				"font-size": `clamp(${clamp.replaceAll("_", " ")})`
			})
		]
	]
} as UserConfig);
