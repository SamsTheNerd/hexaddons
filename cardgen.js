var ADDON_DATA = {};

var ADDON_CARDS = {};
var INTEROP_CARDS = {};

var RESOURCE_PACK_DATA = {};
var RESOURCE_PACK_CARDS = {};

var TEAM_DATA = {};
var AUTHOR_DISPLAY_DATA = undefined
var LINK_MATCHERS = undefined

const ADDON_CARD_TYPES = {
    addon: ADDON_CARDS,
    interop: INTEROP_CARDS,
    resourcepack: RESOURCE_PACK_CARDS
}

const ADDON_GRIDS = {
    addon: "mainAddonGrid",
    interop: "interopGrid",
    resourcepack: "resourcepacksGrid",
}

const DATA_HOLDERS = {
    addon: ADDON_DATA,
    interop: ADDON_DATA,
    resourcepack: RESOURCE_PACK_DATA
}

const PLATFORMS = ["fabric", "forge", "neoforge", "quilt"];
const GAME_VERSIONS = ["1-18-2", "1-19-2", "1-20-1"];
// yeah, this is stupid, i'm fully aware, but i figure 
const GAME_VERSIONS_MAP = {
    "1.18.2": "1-18-2",
    "1.19.2": "1-19-2",
    "1.20":   "1-20-1",
    "1.20.1": "1-20-1"
}

var handleMultiAddonData = (dataHolder, datas) => {
    var addonTypes = {};
    for(const dataName of Object.keys(datas)){
        var addon = dataHolder[dataName]
        addonTypes[addon.type] = true;
        handleAddonData(addon, datas[dataName])
    }
    Object.keys(addonTypes).map(t => displayAddonCards(t))
    getTeamDataMulti(Object.values(datas).map(d => d.team_id)).then(handleTeamDataUpdate);
}

function refreshAllCards(){
    for(const dataHolderType of Object.keys(DATA_HOLDERS)){
        var dataHolder = DATA_HOLDERS[dataHolderType];
        for(const addon of Object.values(dataHolder)){
            genCard(addon);
        }
        displayAddonCards(dataHolderType)
    }
}

var handleTeamDataUpdate = (teamData) => {
    for(const teamId of Object.keys(teamData)){
        if(!TEAM_DATA[teamId]) TEAM_DATA[teamId] = []
        for(const member of teamData[teamId]){
            if(TEAM_DATA[teamId].includes(member)) continue;
            TEAM_DATA[teamId].push(member);
        }
    }
    refreshAllCards();
}

var handleAddonData = (addon, data) => {
    var dataHolder = DATA_HOLDERS[addon.type];
    // console.log(`${addon.name} data: ${data}`);
    Object.keys(data).forEach((key) => {
        // do some nonsense to get as many platforms as possible
        if( key == "platforms"){
            var platforms = [];
            if(data[key] != null){
                data[key].forEach((platform) => {
                    if(!platforms.includes(platform))
                        platforms.push(platform);
                });
            }
            if(dataHolder[addon.name][key] != null){
                dataHolder[addon.name][key].forEach((platform) => {
                    if(!platforms.includes(platform))
                        platforms.push(platform);
                });
            }
            dataHolder[addon.name][key] = platforms;
        } else if(data[key] != null && dataHolder[addon.name][key] == null){
            if(key == "book_url" && addon.type != "addon") dataHolder[addon.name]["book_icon"] = "./otherIcons/MCBookIcon.png" // so interop wikis aren't hex books
            dataHolder[addon.name][key] = data[key];
        } 
        if(key == "game_versions"){
            var versions = {};
            data[key].forEach((version) => {
                if(GAME_VERSIONS_MAP[version] != null){
                    versions[GAME_VERSIONS_MAP[version]] = true;
                } else {
                    // console.warn(`${addon.name} has hex-less version: ${version}`);
                }
            })
            dataHolder[addon.name][key] = Object.keys(versions);
        }
    });
    // maybe some 're-sort' type of function needs to be called here
    genCard(addon);
    // displayAddonCards(addon.type);
}

// initializes stuff a good bit
var getAddons = () => {
    var request = new XMLHttpRequest();
    request.open("GET", "./hexaddons.json", false);
    request.send(null)
    var allAddons = JSON.parse(request.responseText);
    allAddons.forEach((addon) => {
        if(ADDON_DATA[addon.name] == null){
            ADDON_DATA[addon.name] = addon;
            // getModData(addon).then((data) => {
            //     handleAddonData(addon, data, ADDON_DATA);
            // });
        }
        genCard(addon); // just an initial thing
    });
    displayAddonCards();
    getModDataMulti(allAddons).then( datas => handleMultiAddonData(ADDON_DATA, datas));
    return allAddons;
}

var getTools = () => {
    var request = new XMLHttpRequest();
    request.open("GET", "./hextools.json", false);
    request.send(null)
    var allTools = JSON.parse(request.responseText);
    return allTools;
}

var getDatapacks = () => {
    var request = new XMLHttpRequest();
    request.open("GET", "./hexdatapacks.json", false);
    request.send(null)
    var allDatapacks = JSON.parse(request.responseText);
    return allDatapacks;
}

// these also want to use modrinth style stuff
var getResourcePacks = () => {
    var request = new XMLHttpRequest();
    request.open("GET", "./hexresourcepacks.json", false);
    request.send(null)
    var allDatapacks = JSON.parse(request.responseText);
    allDatapacks.forEach((addon) => {
        addon.type = "resourcepack";
        if(RESOURCE_PACK_DATA[addon.name] == null){
            RESOURCE_PACK_DATA[addon.name] = addon;
            // getModData(addon).then((data) => {
            //     data.platforms = [];
            //     handleAddonData(addon, data, RESOURCE_PACK_DATA);
            // });
        }
        genCard(addon); // just an initial thing
    });
    getModDataMulti(allDatapacks).then( datas => handleMultiAddonData(RESOURCE_PACK_DATA, datas));
    displayAddonCards("resourcepack");
    return allDatapacks;
}

var getAuthorData = () => {
    if(AUTHOR_DISPLAY_DATA) return AUTHOR_DISPLAY_DATA;
    var request = new XMLHttpRequest();
    request.open("GET", "./authordata.json", false);
    request.send(null)
    AUTHOR_DISPLAY_DATA = JSON.parse(request.responseText);
    for(const authorId of Object.keys(AUTHOR_DISPLAY_DATA)){
        AUTHOR_DISPLAY_DATA[authorId].id = authorId;
    }
    return AUTHOR_DISPLAY_DATA;
}

var getLinkMatchers = () => {
    if(LINK_MATCHERS) return LINK_MATCHERS;
    var request = new XMLHttpRequest();
    request.open("GET", "./linkmatchers.json", false);
    request.send(null)
    LINK_MATCHERS = JSON.parse(request.responseText);
    return LINK_MATCHERS;
}

// sort interop addons first by minor or not (so push ones that mostly just add recipes to the bottom) then by download count
const interopSort = (a, b) => {
    if(a.minor == b.minor){
        var aDownloads = a.downloads == null ? 0 : a.downloads;
        var bDownloads = b.downloads == null ? 0 : b.downloads;
        return bDownloads - aDownloads;
    }
    return a.minor == true ? 1 : -1;
}

const SORT_FUNCTIONS = {
    featured: (a, b) => {
        // prioritize newly released/updated mods

        var rlyOld = DAY * 10000;

        var aNewness = (Date.now() - a.published_date) || rlyOld;
        var bNewness = (Date.now() - b.published_date) || rlyOld;

        var aUpdatedness = (Date.now() - a.updated_date) || rlyOld;
        var bUpdatedness = (Date.now() - b.updated_date) || rlyOld;

        var isANew = (aNewness < DAY * 30);
        var isBNew = (bNewness < DAY * 30);

        var isAUpdated = (aUpdatedness < DAY * 7);
        var isBUpdated = (bUpdatedness < DAY * 7);

        // one or both of these is new, prioritize newer release (ignoring potentially newer updates)
        if(isANew || isBNew) return aNewness - bNewness; 

        // one or both is recently updated (but not newly released), prioritize newer update
        if(isAUpdated || isBUpdated) return aUpdatedness - bUpdatedness

        // fallback to downloads if they're not new
        return SORT_FUNCTIONS.downloads(a,b);
    },

    downloads: (a, b) => {
        var aDownloads = a.downloads == null ? 0 : a.downloads;
        var bDownloads = b.downloads == null ? 0 : b.downloads;
        return bDownloads - aDownloads;
    },

    updated: (a, b) => {
        return b.updated_date - a.updated_date;
    },

    newest: (a, b) => {
        return b.published_date - a.published_date;
    },

    oldest: (a, b) => {
        return a.published_date - b.published_date;
    }, 

    alphabetical: (a,b) => {
        return a.name.localeCompare(b.name);
    }
}

// also to resort them
var displayAddonCards = (type = "addon", sortType = "featured") => {
    var containerId = ADDON_GRIDS[type];
    document.getElementById(containerId).innerHTML = "";
    var addons = [];
    var dataHolder = DATA_HOLDERS[type];

    Object.values(dataHolder).forEach((addon) => {
        if(addon.type == type){
            addons.push(addon);
        }
    });
    if(type == "interop"){
        addons.sort(interopSort);
    } else {
        addons.sort(SORT_FUNCTIONS[sortType]);
    }
    addons.forEach((addon) => {
        var card = ADDON_CARD_TYPES[type][addon.name];
        document.getElementById(containerId).innerHTML += card;
    });
}

var sortAddons = (selectorId, type) => {
    displayAddonCards(type, document.getElementById(selectorId).value);
}

var makeLinks = (addon) => {
    var links = ``;
    if(addon.modrinth_url != null) {
        links += `<a target="_blank" href="${addon.modrinth_url}" class="addonLink modrinthLink">
            <img src="./otherIcons/ModrinthIcon.png" title="Modrinth" alt="Modrinth Icon" class="linkIcon">
        </a>`
    }
    if(addon.curseforge_url != null) {
        links += `<a target="_blank" href="${addon.curseforge_url}" class="addonLink curseforgeLink">
            <img src="./otherIcons/CurseforgeIcon.png" title="CurseForge" alt="CurseForge Icon" class="linkIcon">
        </a>`
    }
    if(addon.source_url != null){
        var sourceIcon;
        if(addon.source_icon_url){
            sourceIcon = addon.source_icon_url;
        } else {
            sourceIcon = "/otherIcons/GithubIcon.png"; // idk valid fallback
            for(const linkType of getLinkMatchers()){
                if(new RegExp(linkType.matcher).test(addon.source_url)){
                    sourceIcon = linkType.icon;
                    break;
                }
            }
        }
        links += `<a target="_blank" href="${addon.source_url}" class="addonLink sourceLink">
            <img src="${sourceIcon}" title="Source" alt="GitHub Icon" class="linkIcon">
        </a>`
    }
    if(addon.book_url != null){
        links += `<a target="_blank" href="${addon.book_url}" class="addonLink bookLink">
            <img src="${addon.book_icon == null ? "./otherIcons/BookIcon.png" : addon.book_icon}" title="Book" alt="Hexcasting Guide Book Icon" class="linkIcon bookIcon">
        </a>`;
        // links = `<div class="fakeItem"></div>` + links;
    }
    
    return links;
}

const DAY = 1000 * 60 * 60 * 24;

// given an addon object make the card for it
var genCard = (addon) => {
    var iconUrl = addon.icon_url;
    if(iconUrl == null||iconUrl == undefined){
        iconUrl = "./otherIcons/hexxy.png"
    }
    var platformIcons = ``;
    var platformClasses = ``;
    if(addon.platforms != null){
        addon.platforms.sort();
        addon.platforms.forEach((platform) => {
            platformIcons += `<img src="./platformIcons/${platform}Icon.png" alt="${platform} icon" class="platformIcon" title="available for ${platform}">`
            platformClasses += ` ${platform}`;
        })
    }
    if(addon.type == "addon"){
        platformClasses += " filterable"
    }
    var versionIcons = ``;
    var versionClasses = ``;
    if(addon.game_versions != null){
        addon.game_versions.sort();
        addon.game_versions.forEach((version) => {
            versionIcons += `<img src="./versionIcons/${version}.png" alt="${version} icon" class="versionIcon" title="available for v${version.replaceAll("-", ".")}">`
            versionClasses += ` v${version}`;
        })
    }

    var platformDivider = "";
    if(versionIcons != "" && platformIcons != ""){
        platformDivider = `<div class="platformDivider"></div>`
    }

    var links = makeLinks(addon);

    var banner = "";

    if(Date.now() - addon.published_date < DAY * 30){
        banner = `<img src="./otherIcons/new_banner.svg" class="newBanner cardBanner">`;
    } else if(Date.now() - addon.updated_date < DAY * 7){
        // gloopdate banner !!
        if(addon.name == "Hex Gloop"){
            banner = `<img src="./otherIcons/gloopdate_banner.svg" class="updateBanner gloopdateBanner cardBanner">`;
        } else {
            banner = `<img src="./otherIcons/update_banner.svg" class="updateBanner cardBanner">`;
        }
    }
    
    var authorStr = "";
    var authors = []
    if(addon.authors) authors = authors = authors.concat(addon.authors.map(author => {
        if(getAuthorData()[author]) return getAuthorData()[author]
        return {
            display: author
        }
    }));
    // console.log(TEAM_DATA[addon.team_id])
    if(TEAM_DATA[addon.team_id]){
        authors = authors.concat(TEAM_DATA[addon.team_id].map(author => {
            var authData = {
                id: author,
                display: author,
                url: `https://modrinth.com/user/${author}`
            };
            if(getAuthorData()[author]){
                Object.assign(authData, getAuthorData()[author])
            }
            return authData;
        }));
    }
    // console.log(authors);
    authorStr = authors.map(member => {
        if(member.url){
            return `<a target="_blank" class="addonAuthor authorSpecific-${member.id}" href="${member.url}">${member.display}</a>`
        } else {
            return `<a class="addonAuthor authorSpecific-${member.id}">${member.display}</a>`
        }
    }).join("")

    var card = `
    <div class="addonCard ${platformClasses} ${versionClasses} ${addon.type}TypeCard" id="${addon.name}Card">
        <div class="addonCardHeader">
            <img src="${iconUrl}" alt="${addon.name} icon" class="addonIcon">
            <div class="addonSubheader">
                <h3 class="addonTitle${addon.hex_provided ? " hexProvidedTitle" : ""}">${addon.name}</h3>
                ${authorStr}
            </div>
        </div>
        <div class="platformShelf">${platformIcons} ${platformDivider} ${versionIcons}</div>
        <p class="addonDescription">${addon.description}</p>
        <div class="linkShelf">${links}</div>
        ${banner}
    </div>
    `
    ADDON_CARD_TYPES[addon.type][addon.name] = card;
    return card;
}

var putCard = (addon, containerId) => {
    var container = document.getElementById(containerId);
    container.innerHTML += genCard(addon);
}

var genToolCard = (tool) => {
    var card = `
    <div class="addonCard toolCard" id="${tool.name}Card">
        <div class="addonCardHeader">
            <h3 class="addonTitle"><a href="${tool.link}">${tool.name}</a></h3>
        </div>
        <p class="addonDescription">${tool.description}</p>
    </div>
    `
    return card;
}

var putToolCard = (tool, containerId) => {
    var container = document.getElementById(containerId);
    container.innerHTML += genToolCard(tool);
}