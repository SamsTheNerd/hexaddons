

window.onload = () => {
    var addons = getAddons();
    addons.forEach((addon) => putCard(addon, "mainAddonGrid"));
}