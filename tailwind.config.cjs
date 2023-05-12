const plugin = require("tailwindcss/plugin");
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		screens: {
			"sm": "40em",
			"md": "52em",
			"lg": "64em",
			"xl": "100em"
		},
		fontFamily: {
			body: "JetBrains Mono, monospace",
			heading: "JetBrains Mono, monospace", // todo: play around with this
			monospace: "JetBrains Mono, monospace"
		},
		fontSize: {
			"0": 16,
			"1": 20,
			"2": 24,
			// "3": [32, "100%"],
			// "4": [48, "100%"],
			// "5": [64, "100%"],
			// "6": [72, "100%"]
			"3": 32,
			"4": 48,
			"5": 64,
			"6": 72
		},
		fontWeight: {
			body: 400,
			heading: 700,
			bold: 500
		},
		letterSpacing: {
			body: "normal"
		},
		colors: {
			"background": "#1D1D26",
			"dark": "#2C2C3B",
			"text": "#D0D0D9",
			"primary": "#713A91",
			"accent": "#FFBEFF",
			"primary-teal": "#3A9272",
			"primary-green": "#5A923A",
			"primary-maroon": "#923A5A",
			"accent-yellow": "#FFFFBD",
			"accent-lightblue": "#BDFFFF",
			"accent-orange": "#FFDEBD",
			"accent-green": "#BDFFBD",
			"accent-blue": "#BDDEFF",
			// "blue": "#5BC0BE",
			// "cyan": "#31AFD4",
			// "salmon": "#DB504A",
			// "moss": "#899D78",
			// "lightblue": "#ACEDFF"
		},
		container: {
			center: true,
			padding: "2rem"
		},
		extend: {
			typography: ({ theme }) => ({
				DEFAULT: {
					css: {
						'--tw-prose-body': theme('colors.text'),
						'--tw-prose-headings': theme('colors.text'),
						'--tw-prose-lead': theme('colors.text'),
						'--tw-prose-links': theme('colors.accent'),
						'--tw-prose-bold': theme('colors.text'),
						'--tw-prose-counters': theme('colors.text'),
						'--tw-prose-bullets': theme('colors.primary'),
						'--tw-prose-hr': theme('colors.dark'),
						'--tw-prose-quotes': theme('colors.text'),
						'--tw-prose-quote-borders': theme('colors.text'),
						'--tw-prose-captions': theme('colors.text'),
						'--tw-prose-code': theme('colors.text'),
						'--tw-prose-pre-code': theme('colors.text'),
						'--tw-prose-pre-bg': theme('colors.text'),
						'--tw-prose-th-borders': theme('colors.text'),
						'--tw-prose-td-borders': theme('colors.text')
					},
				},
			}),
		}
	},
	plugins: [
		require("@tailwindcss/forms"),
		require("@tailwindcss/aspect-ratio"),
		require("@tailwindcss/typography"),
		plugin(function ({ addComponents, theme }) {
			addComponents({
				// TODO: add custom components here
				".text-highlight": {
					borderRadius: "0.25rem",
					color: theme("colors.text"),
					backgroundColor: theme("colors.primary"),
					fontWeight: "700",
					paddingTop: "0.1rem",
					paddingBottom: "0.1rem",
					paddingLeft: "0.15rem",
					paddingRight: "0.15rem",
					marginLeft: "-0.15rem",
					marginRight: "-0.15rem",
					// second element so the padding is applied on each broken line but not the border radius
					"& > span": {
						paddingLeft: "0.1rem",
						paddingRight: "0.1rem",
						boxDecorationBreak: "clone",
						"-webkit-box-decoration-break": "clone",
					}
				},
				".link": {
					color: theme("colors.accent"),
					textDecoration: "underline"
				},
				".space-before-headings": {
					"& h1:not(:first-child), h2:not(:first-child), h3:not(:first-child), h4:not(:first-child), h5:not(:first-child), h6:not(:first-child)": {
						marginTop: "1rem"
					}
				},
				".checkbox": {
					// this is a checkbox that displays the status in ASCII text.
					// it displays [ ] if not checked, and [x] if checked.
					// I am going to implement it without any javascript, using psuedo elements.
					// below is the implementation of the checkbox CSS:

					// hide the checkbox
					position: "absolute",
					opacity: "0",
					// make the checkbox focusable
					"&:focus + label": {
						outline: "2px solid " + theme("colors.primary")
					},
					// when the checkbox is checked, add a checkmark
					"&:checked + label": {
						"&::before": {
							content: "'[x] '"
						}
					},
					"& + label": {
						userSelect: "none",
						cursor: "pointer",
						"&::before": {
							content: "'[ ] '"
						}
					}
				}
			});
		})
	]
}
