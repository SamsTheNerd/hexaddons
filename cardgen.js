var ADDON_DATA = {};

var ADDON_CARDS = {};
var MAJOR_INTEROP_CARDS = {};
var MINOR_INTEROP_CARDS = {};

const ADDON_CARD_TYPES = {
    addon: ADDON_CARDS,
    majorinterop: MAJOR_INTEROP_CARDS,
    minorinterop: MINOR_INTEROP_CARDS
}

const ADDON_GRIDS = {
    addon: "mainAddonGrid",
    majorinterop: "majorInteropGrid",
    minorinterop: "minorInteropGrid"
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
            getModData(addon).then((data) => {
                console.log(`${addon.name} data: ${data}`);
                ADDON_DATA[addon.name] = Object.assign(ADDON_DATA[addon.name], data);
                // maybe some 're-sort' type of function needs to be called here
                genCard(addon);
                displayAddonCards(addon.type);
            });
        }
        genCard(addon); // just an initial thing
    });
    displayAddonCards();
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

const SORT_FUNCTIONS = {
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
    }
}

// also to resort them
var displayAddonCards = (type = "addon", sortType = "downloads") => {
    var containerId = ADDON_GRIDS[type];
    document.getElementById(containerId).innerHTML = "";
    var addons = [];
    Object.values(ADDON_DATA).forEach((addon) => {
        if(addon.type == type){
            addons.push(addon);
        }
    });
    addons.sort(SORT_FUNCTIONS[sortType]);
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
        links += `<a target="_blank" href="${addon.source_url}" class="addonLink sourceLink">
            <img src="./otherIcons/GithubIcon.png" title="Source" alt="GitHub Icon" class="linkIcon">
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

// given an addon object make the card for it
var genCard = (addon) => {
    var iconUrl = addon.icon_url;
    var platformIcons = ``;
    if(addon.platforms != null){
        addon.platforms.forEach((platform) => {
            platformIcons += `<img src="./platformIcons/${platform}Icon.png" alt="${platform} icon" class="platformIcon">`
        })
    }

    var links = makeLinks(addon);

    var card = `
    <div class="addonCard" id="${addon.name}Card">
        <div class="addonCardHeader">
            <img src="${iconUrl}" alt="${addon.name} icon" class="addonIcon">
            <h3 class="addonTitle${addon.hex_provided ? " hexProvidedTitle" : ""}">${addon.name}</h3>
        </div>
        <div class="platformShelf">${platformIcons}</div>
        <p class="addonDescription">${addon.description}</p>
        <div class="linkShelf">${links}</div>
    </div>
    `
    ADDON_CARD_TYPES[addon.type][addon.name] = card;
    return card;
}

var putCard = (addon, containerId) => {
    var container = document.getElementById(containerId);
    container.innerHTML += genCard(addon);
}

var genInteropCard = (addon) => {
    var platformIcons = ``;
    addon.platforms.forEach((platform) => {
        platformIcons += `<img src="./platformIcons/${platform}Icon.png" alt="${platform} icon" class="platformIcon">`
    })
    // if(addon.hex_provided){
    //     platformIcons += "<span class='hexProvidedSpan'>|<img src='./otherIcons/hexxy.png' title='Hex Provided' alt='Hex Provided' class='platformIcon'></span>";
    // }

    var links = makeLinks(addon);
    

    var card = `
    <div class="addonCard interopCard" id="${addon.name}Card">
        <div class="addonCardHeader">
            <h3 class="addonTitle${addon.hex_provided ? " hexProvidedTitle" : ""}">${addon.name}
            </h3>
        </div>
        <div class="platformShelf">${platformIcons}</div>
        <p class="addonDescription">${addon.description}</p>
        <div class="linkShelf">${links}</div>
    </div>
    `
    return card;
}

var putInteropCard = (addon, containerId) => {
    var container = document.getElementById(containerId);
    container.innerHTML += genInteropCard(addon);
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