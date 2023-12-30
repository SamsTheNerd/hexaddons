
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

const SECTION_HEADER_NAMES = {
    addons: "Addons",
    interop: "Interop",
    datapacks: "Data Packs",
    resourcepacks: "Resource Packs",
    tools: "Tools",
    devTools: "Addon Dev Tools"
}

const SECTION_TOC_NAMES = {
    ... SECTION_HEADER_NAMES,
    devTools: "Dev Tools"
}

const SECTION_HEADER_ICONS = {
    addons: "./otherIcons/hexxy.png",
    interop: "./otherIcons/chain.png",
    datapacks: "./otherIcons/command_block.gif",
    resourcepacks: "./otherIcons/painting.png",
    tools: "./otherIcons/diamond_pickaxe.png",
    devTools: "./otherIcons/creative_unlocker.png"
}

// add icons + toc
var putSectionIcons = () => {
    var tocElements = "";
    Object.keys(SECTION_HEADER_NAMES).forEach((section) => {
        tocElements += `<p class="tocLinkPContainer"><a class="tocLink" href="#${section}">
        <img class="pixelated" src="${SECTION_HEADER_ICONS[section]}">
        ${SECTION_TOC_NAMES[section]}
    </a></p>`
        var icon = `<img class="pixelated sectionIcon" src="${SECTION_HEADER_ICONS[section]}">`;
        document.getElementById(section).innerHTML = icon + SECTION_HEADER_NAMES[section] + icon;
    });
    document.getElementById("nav-toc-bar").innerHTML = tocElements;
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

    var resourcepacks = getResourcePacks();


    var datapacks = getDatapacks();
    datapacks.forEach((datapack) => {
        putToolCard(datapack, "datapacksGrid");
    });

    putSectionIcons();

}