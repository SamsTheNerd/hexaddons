

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
        putToolCard(tool, "toolsGrid");
    });
}