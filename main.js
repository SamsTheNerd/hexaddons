
var putPlatformButtons = () => {
    var platformButtons = "";
    PLATFORMS.forEach((platform) => {
        document.getElementById("body").classList.add(platform);
        platformButtons += `<img src="./platformIcons/${platform}Icon.png" class="platformButton" id="${platform}Button" onclick="togglePlatform('${platform}')">`
    })
    document.getElementById("addonPlatformButtons").innerHTML = platformButtons;
}

var togglePlatform = (platform) => {
    var othersSelected = false;
    PLATFORMS.forEach((otherPlatform) => {
        if(otherPlatform != platform && document.getElementById("body").classList.contains(otherPlatform)){
            othersSelected = true;
        }
        document.getElementById("body").classList.remove(otherPlatform);
    });
    if(othersSelected){
        document.getElementById("body").classList.add(platform);
    } else {
        PLATFORMS.forEach((otherPlatform) => {
            document.getElementById("body").classList.add(otherPlatform);
        });
    }
}

window.onload = () => {
    var addons = getAddons();
    

    var tools = getTools();
    tools.forEach((tool) => {
        if(tool.addon){ // tool specfically for addon devs
            putToolCard(tool, "devToolsGrid");
        } else { // normal tool
            putToolCard(tool, "toolsGrid");
        }
    });

    putPlatformButtons();

    var datapacks = getDatapacks();
    datapacks.forEach((datapack) => {
        putToolCard(datapack, "datapacksGrid");
    });
}