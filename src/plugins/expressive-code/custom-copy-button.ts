import type { ExpressiveCodePlugin } from "@expressive-code/core";
import { definePlugin } from "@expressive-code/core";
import type { Element } from "hast";

const runnableRustLanguages = new Set(["rust", "rs"]);

export function pluginCustomCopyButton(): ExpressiveCodePlugin {
	return definePlugin({
		name: "Custom Code Actions",
		hooks: {
			postprocessRenderedBlock: (context) => {
				function traverse(node: Element) {
					if (node.type === "element" && node.tagName === "pre") {
						processCodeBlock(node);
						return;
					}
					if (node.children) {
						for (const child of node.children) {
							if (child.type === "element") traverse(child);
						}
					}
				}

				function getLanguage(node: Element) {
					const properties = node.properties ?? {};
					const rawLanguage =
						properties["data-language"] ??
						properties.dataLanguage ??
						context.codeBlock?.language;

					return String(rawLanguage ?? "").toLowerCase();
				}

				function addClass(node: Element, className: string) {
					node.properties ??= {};
					const existing = node.properties.className;
					const classes = Array.isArray(existing)
						? existing.map(String)
						: typeof existing === "string"
							? existing.split(/\s+/).filter(Boolean)
							: [];

					if (!classes.includes(className)) {
						classes.push(className);
					}
					node.properties.className = classes;
				}

				function processCodeBlock(node: Element) {
					const language = getLanguage(node);
					const isRustBlock = runnableRustLanguages.has(language);
					const copyButton = {
						type: "element" as const,
						tagName: "button",
						properties: {
							className: ["copy-btn"],
							"aria-label": "Copy code",
							title: "Copy code",
						},
						children: [
							{
								type: "element" as const,
								tagName: "div",
								properties: {
									className: ["copy-btn-icon"],
								},
								children: [
									{
										type: "element" as const,
										tagName: "svg",
										properties: {
											viewBox: "0 -960 960 960",
											xmlns: "http://www.w3.org/2000/svg",
											className: ["copy-btn-icon", "copy-icon"],
										},
										children: [
											{
												type: "element" as const,
												tagName: "path",
												properties: {
													d: "M368.37-237.37q-34.48 0-58.74-24.26-24.26-24.26-24.26-58.74v-474.26q0-34.48 24.26-58.74 24.26-24.26 58.74-24.26h378.26q34.48 0 58.74 24.26 24.26 24.26 24.26 58.74v474.26q0 34.48-24.26 58.74-24.26 24.26-58.74 24.26H368.37Zm0-83h378.26v-474.26H368.37v474.26Zm-155 238q-34.48 0-58.74-24.26-24.26-24.26-24.26-58.74v-515.76q0-17.45 11.96-29.48 11.97-12.02 29.33-12.02t29.54 12.02q12.17 12.03 12.17 29.48v515.76h419.76q17.45 0 29.48 11.96 12.02 11.97 12.02 29.33t-12.02 29.54q-12.03 12.17-29.48 12.17H213.37Zm155-238v-474.26 474.26Z",
												},
												children: [],
											},
										],
									},
									{
										type: "element" as const,
										tagName: "svg",
										properties: {
											viewBox: "0 -960 960 960",
											xmlns: "http://www.w3.org/2000/svg",
											className: ["copy-btn-icon", "success-icon"],
										},
										children: [
											{
												type: "element" as const,
												tagName: "path",
												properties: {
													d: "m389-377.13 294.7-294.7q12.58-12.67 29.52-12.67 16.93 0 29.61 12.67 12.67 12.68 12.67 29.53 0 16.86-12.28 29.14L419.07-288.41q-12.59 12.67-29.52 12.67-16.94 0-29.62-12.67L217.41-430.93q-12.67-12.68-12.79-29.45-.12-16.77 12.55-29.45 12.68-12.67 29.62-12.67 16.93 0 29.28 12.67L389-377.13Z",
												},
												children: [],
											},
										],
									},
								],
							},
						],
					} as Element;

					const rustRunButton = {
						type: "element" as const,
						tagName: "button",
						properties: {
							className: ["rust-run-btn"],
							"aria-label": "Run Rust code",
							title: "Run Rust code",
							type: "button",
						},
						children: [
							{
								type: "element" as const,
								tagName: "svg",
								properties: {
									viewBox: "0 -960 960 960",
									xmlns: "http://www.w3.org/2000/svg",
									className: ["code-action-icon", "rust-run-icon"],
								},
								children: [
									{
										type: "element" as const,
										tagName: "path",
										properties: {
											d: "M320-200v-560l440 280-440 280Z",
										},
										children: [],
									},
								],
							},
						],
					} as Element;

					if (!node.children) {
						node.children = [];
					}
					if (isRustBlock) {
						addClass(node, "rust-playground-code");
						node.children.push(rustRunButton);
					}
					node.children.push(copyButton);
				}

				traverse(context.renderData.blockAst);
			},
		},
	});
}
