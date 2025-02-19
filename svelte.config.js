// Default config

// import adapter from '@sveltejs/adapter-auto';
// import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// /** @type {import('@sveltejs/kit').Config} */
// const config = {
// 	// Consult https://svelte.dev/docs/kit/integrations
// 	// for more information about preprocessors
// 	preprocess: vitePreprocess(),

// 	kit: {
// 		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
// 		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
// 		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
// 		adapter: adapter()
// 	}
// };

// export default config;

import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import dotenv from 'dotenv';

dotenv.config();

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  // Modified version of one of the solutions at:
  // https://stackoverflow.com/questions/60677782/how-to-disable-svelte-warning-unused-css-selector
  
  // this actually doesn't work so I commented it out
  // onwarn: (warning, handler) => {
  //   if (warning.code === 'css_unused_selector') {
  //     return;
  //   }
  //   handler(warning);
  // },
  
  kit: {
    adapter: adapter(),
    env: {
      dir: process.cwd()
    }
  }
};

export default config;