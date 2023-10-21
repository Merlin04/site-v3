export default function(save) {
    return save.filter(r => r.include).map(i => `- [${i.repo.replaceAll("Merlin04/", "")}](https://github.com/${i.repo}): ${i.description}`).join("\n");
}