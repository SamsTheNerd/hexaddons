
var getAddons = () => {
    var request = new XMLHttpRequest();
    request.open("GET", "./hexaddons.json", false);
    request.send(null)
    var allAddons = JSON.parse(request.responseText);
    return allAddons;
}


// given an addon object make the card for it
var genCard = (addon) => {
    var iconUrl = addon.icon_url;
    var platformIcons = ``;
    addon.platforms.forEach((platform) => {
        platformIcons += `<img src="./platformIcons/${platform}Icon.png" alt="${platform} icon" class="platformIcon">`
    })

    var links = ``;
    if(addon.modrinth_url != null) {
        links += `<a target="_blank" href="${addon.modrinth_url}" class="addonLink modrinthLink">Modrinth</a><br>`
    }
    if(addon.curseforge_url != null) {
        links += `<a target="_blank" href="${addon.curseforge_url}" class="addonLink curseforgeLink">CurseForge</a><br>`
    }
    if(addon.book_url != null){
        links += `<a target="_blank" href="${addon.book_url}" class="addonLink bookLink">Book</a><br>`
    }
    if(addon.source_url != null){
        links += `<a target="_blank" href="${addon.source_url}" class="addonLink sourceLink">Source</a><br>`
    }

    var card = `
    <div class="addonCard" id="${addon.name}Card">
        <div class="addonCardHeader">
            <img src="${iconUrl}" alt="${addon.name} icon" class="addonIcon">
            <h3 class="addonTitle">${addon.name}</h3>
        </div>
        <div class="platformShelf">${platformIcons}</div>
        <p class="addonDescription">${addon.description}</p>
        <p class="linkShelf">${links}</p>
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
    if(addon.hex_provided){
        platformIcons += "<span class='hexProvidedSpan'>|<img src='./otherIcons/hexxy.png' title='Hex Provided' alt='Hex Provided' class='platformIcon'></span>";
    }

    var links = ``;
    if(addon.modrinth_url != null) {
        links += `<a target="_blank" href="${addon.modrinth_url}" class="addonLink modrinthLink">Modrinth</a><br>`
    }
    if(addon.curseforge_url != null) {
        links += `<a target="_blank" href="${addon.curseforge_url}" class="addonLink curseforgeLink">CurseForge</a><br>`
    }
    if(addon.book_url != null){
        links += `<a target="_blank" href="${addon.book_url}" class="addonLink bookLink">Book</a><br>`
    }
    if(addon.source_url != null){
        links += `<a target="_blank" href="${addon.source_url}" class="addonLink sourceLink">Source</a><br>`
    }
    

    var card = `
    <div class="addonCard interopCard" id="${addon.name}Card">
        <div class="addonCardHeader">
            <h3 class="addonTitle">${addon.name}
            </h3>
        </div>
        <div class="platformShelf">${platformIcons}</div>
        <p class="addonDescription">${addon.description}</p>
        <p class="linkShelf">${links}</p>
    </div>
    `
    return card;
}

var putInteropCard = (addon, containerId) => {
    var container = document.getElementById(containerId);
    container.innerHTML += genInteropCard(addon);
}