var fetchFullModData = (modid) => {
    return fetch(`https://api.modrinth.com/v2/project/${modid}`)
    .then((response) => response.json());
}

const modrinthRE = new RegExp(".*modrinth\.com\/(?:(?:mod)|(?:resourcepack))\/([a-zA-Z\-]+).*");

var idFromUrl = (url) => {
    console.log(url);
    return url.match(modrinthRE)[1];
}

// returns a promise with the parsed data that we actually want
var getModData = (addon) => {
    if(addon.modrinth_url != null){
        return fetchFullModData(idFromUrl(addon.modrinth_url)).then((data) => {
            return {
                icon_url: data["icon_url"],
                platforms: data["loaders"],
                source_url: data["source_url"],
                book_url: data["wiki_url"],
                downloads: data["downloads"],
                game_versions: data["game_versions"],
                published_date: Date.parse(data["published"]),
                updated_date: Date.parse(data["updated"]),
                description: data["description"],
            };
        });
    } else {
        return new Promise((resolve, reject) => {
            resolve({});
        });
    }
}