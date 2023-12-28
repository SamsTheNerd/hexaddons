

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

    var datapacks = getDatapacks();
    datapacks.forEach((datapack) => {
        putToolCard(datapack, "datapacksGrid");
    });
}