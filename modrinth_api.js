var fetchFullModData = (modid) => {
    return fetch(`https://api.modrinth.com/v2/project/${modid}`)
    .then((response) => response.json());
}

const modrinthRE = new RegExp(".*modrinth\.com\/(?:(?:mod)|(?:resourcepack))\/([a-zA-Z\-]+).*");
var slugsToNames = {};

var idFromUrl = (url) => {
    // console.log(url);
    return url.match(modrinthRE)[1];
}

// takes an array of addons, returns a promise with a map of addon ids -> modrinth data
var getModDataMulti =(addons) => {
    var addonSlugs = [];
    // console.log(addons)
    for(const addon of addons){
        // console.log(addon);
        if(addon.modrinth_url != null){
            var slug = idFromUrl(addon.modrinth_url);
            slugsToNames[slug] = addon.name;
            addonSlugs.push(slug);
        }
    }
    var addonSlugsStr = addonSlugs.map(s => `"${s}"`).join(",");
    return fetch(`https://api.modrinth.com/v2/projects?ids=[${addonSlugsStr}]`)
    .then(response => response.json())
    .then(datas => {
        var dataObj = {};
        for(const data of datas){
            dataObj[slugsToNames[data.slug]] = {
                icon_url: data["icon_url"],
                platforms: data["loaders"],
                source_url: data["source_url"],
                book_url: data["wiki_url"],
                downloads: data["downloads"],
                game_versions: data["game_versions"],
                published_date: Date.parse(data["published"]),
                updated_date: Date.parse(data["updated"]),
                description: data["description"],
            }
        }
        return dataObj;
    })
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