

window.onload = () => {
    var addons = getAddons();
    addons.forEach((addon) => {
        if(addon.type == "addon"){
            putCard(addon, "mainAddonGrid")
        }
        if(addon.type == "interop"){
            putInteropCard(addon, "interopGrid")
        }
    });

    var tools = getTools();
    tools.forEach((tool) => {
        putToolCard(tool, "toolsGrid");
    });
}