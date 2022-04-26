import adapter from '@sveltejs/adapter-auto';
import UnoCss from "unocss/vite";
import { extractorSvelte } from "unocss";
import preprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),
		vite: {
			plugins: [
				UnoCss({extractors: [extractorSvelte]}),
			]
		}
	}
};

export default config;
