/**
 * @type {import("@merlin04/ghcms").ConfigObj}
 */
export const config = {
    users: ["Merlin04", "obl-ong", "kobra-dev"],
    saveFile: "./ghcms.json",
    deltasFile: "./ghcms.deltas",
    output: "./src/content/ghcms.mdx",
    customFields: [{
        key: "include",
        displayName: "?",
        type: "checkbox",
        default: false
    }, {
        key: "star",
        displayName: "★",
        type: "checkbox",
        default: false
    }]
};

/**
 * @type {import("@merlin04/ghcms").ConfigFn}
 */
export default async (save) => {
    const all = save.filter(r => r.include);
    const starred = all.filter(r => r.star);
    const notStarred = all.filter(r => !r.star);

    const entry = r => `- [${r.name}](https://github.com/${r.repo}): ${r.description}`;

    return `I've built a lot of projects. Here are some of the bigger ones:

${starred.map(entry).join("\n")}}

And here's some smaller tools/utilities/experiments:

${notStarred.map(entry).join("\n")}`;
};