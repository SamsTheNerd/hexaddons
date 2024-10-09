
var putPlatformButtons = () => {
    var platformButtons = "";
    PLATFORMS.forEach((platform) => {
        platformButtons += `<img src="./platformIcons/${platform}Icon.png" class="platformButton" id="${platform}Button" onclick="togglePlatform('${platform}')" title="filter for ${platform}">`
    })
    var versionButtons = "";
    GAME_VERSIONS.forEach((version) => {
        versionButtons += `<img src="./versionIcons/${version}.png" class="platformButton" id="v${version}Button" onclick="toggleVersion('${version}')" title="filter for v${version.replaceAll("-", ".")}">`
    })
    document.getElementById("addonPlatformButtons").innerHTML = platformButtons + `<div class="platformDivider bigDivider"></div>` + versionButtons;
    updateFilterStyling();
}

var SELECTED_PLATFORMS = [];
var SELECTED_VERSIONS = [];

var updateFilterStyling = () => {
    var platsToUse = SELECTED_PLATFORMS
    var versionsToUse = SELECTED_VERSIONS
    if(platsToUse.length == 0) platsToUse = PLATFORMS
    if(versionsToUse.length == 0) versionsToUse = GAME_VERSIONS

    var filterStyle = ``;

    for(const plat of platsToUse){
        for(const vers of versionsToUse){
            filterStyle += `.addonCard.${plat}.v${vers} { display: flex!important; } \n`
        }
    }
    for(const plat of platsToUse){
        filterStyle += `#${plat}Button { filter: none; } \n`
    }
    for(const vers of versionsToUse){
        filterStyle += `#v${vers}Button { filter: none; } \n`
    }
    document.getElementById("cardFilterStyle").innerHTML = filterStyle;
}

var togglePlatform = (platform) => {
    /** expected behavior:
     * click = toggle
     * none selected = no filtering (rather than filter none)
     */
    if(SELECTED_PLATFORMS.includes(platform)){
        SELECTED_PLATFORMS = SELECTED_PLATFORMS.filter(p => p != platform)
    } else {
        SELECTED_PLATFORMS.push(platform);
    }
    updateFilterStyling();
}

var toggleVersion = (version) => {
    if(SELECTED_VERSIONS.includes(version)){
        SELECTED_VERSIONS = SELECTED_VERSIONS.filter(v => v != version)
    } else {
        SELECTED_VERSIONS.push(version);
    }
    updateFilterStyling();
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

    putPlatformButtons();

    var addons = getAddons();

    var tools = getTools();
    tools.forEach((tool) => {
        if(tool.addon){ // tool specfically for addon devs
            putToolCard(tool, "devToolsGrid");
        } else { // normal tool
            putToolCard(tool, "toolsGrid");
        }
    });

    var resourcepacks = getResourcePacks();


    var datapacks = getDatapacks();
    datapacks.forEach((datapack) => {
        putToolCard(datapack, "datapacksGrid");
    });

    putSectionIcons();

}