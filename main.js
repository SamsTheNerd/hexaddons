

window.onload = () => {
    var addons = getAddons();
    addons.forEach((addon) => {
        if(addon.type == "addon"){
            putCard(addon, "mainAddonGrid")
        }
        if(addon.type == "majorinterop"){
            putCard(addon, "majorInteropGrid")
        }
        if(addon.type == "minorinterop"){
            putInteropCard(addon, "minorInteropGrid")
        }
    });

    var tools = getTools();
    tools.forEach((tool) => {
        if(tool.addon){ // tool specfically for addon devs
            putToolCard(tool, "devToolsGrid");
        } else { // normal tool
            putToolCard(tool, "toolsGrid");
        }
    });

    var datapacks = getDatapacks();
    datapacks.forEach((datapack) => {
        putToolCard(datapack, "datapacksGrid");
    });
}