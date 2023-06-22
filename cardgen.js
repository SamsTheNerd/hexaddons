
var getAddons = () => {
    var request = new XMLHttpRequest();
    request.open("GET", "./hexaddons.json", false);
    request.send(null)
    var my_JSON_object = JSON.parse(request.responseText);
    return my_JSON_object;
}


// given an addon object make the card for it
var genCard = (addon) => {
    var iconUrl = addon.icon_url;
    var platformIcons = ``;
    addon.platforms.forEach((platform) => {
        platformIcons += `<img src="./platformIcons/${platform}Icon.png" alt="${platform} icon" class="platformIcon">`
    })

    var card = `
    <div class="addonCard" id="${addon.name}Card">
        <div class="addonCardHeader">
            <img src="${iconUrl}" alt="${addon.name} icon" class="addonIcon">
            <h3 class="addonTitle">${addon.name}</h3>
        </div>
        <div class="platformShelf">${platformIcons}</div>
        <p class="addonDescription">${addon.description}</p>
    </div>
    `
    return card;
}

var putCard = (addon, containerId) => {
    var container = document.getElementById(containerId);
    container.innerHTML += genCard(addon);
}