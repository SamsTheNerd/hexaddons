
var getAddons = () => {
    var request = new XMLHttpRequest();
    request.open("GET", "./hexaddons.json", false);
    request.send(null)
    var allAddons = JSON.parse(request.responseText);
    return allAddons;
}

var getTools = () => {
    var request = new XMLHttpRequest();
    request.open("GET", "./hextools.json", false);
    request.send(null)
    var allTools = JSON.parse(request.responseText);
    return allTools;
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
    if(addon.book_url != null){
        links += `<a target="_blank" href="${addon.book_url}" class="addonLink bookLink">
            <img src="./otherIcons/BookIcon.png" title="Book" alt="Hexcasting Guide Book Icon" class="linkIcon bookIcon">
        </a>`
    }
    if(addon.source_url != null){
        links += `<a target="_blank" href="${addon.source_url}" class="addonLink sourceLink">
            <img src="./otherIcons/GithubIcon.png" title="Source" alt="GitHub Icon" class="linkIcon">
        </a>`
    }
    return links;
}

// given an addon object make the card for it
var genCard = (addon) => {
    var iconUrl = addon.icon_url;
    var platformIcons = ``;
    addon.platforms.forEach((platform) => {
        platformIcons += `<img src="./platformIcons/${platform}Icon.png" alt="${platform} icon" class="platformIcon">`
    })

    var links = makeLinks(addon);

    var card = `
    <div class="addonCard" id="${addon.name}Card">
        <div class="addonCardHeader">
            <img src="${iconUrl}" alt="${addon.name} icon" class="addonIcon">
            <h3 class="addonTitle">${addon.name}</h3>
        </div>
        <div class="platformShelf">${platformIcons}</div>
        <p class="addonDescription">${addon.description}</p>
        <div class="linkShelf">${links}</div>
    </div>
    `
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