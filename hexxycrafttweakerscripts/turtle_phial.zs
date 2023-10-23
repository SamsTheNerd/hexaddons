craftingTable.removeByName("computercraft:turtle_normal");
craftingTable.addShaped("hexxycraft/turtle_normal", <item:computercraft:turtle_normal>, [
    [<tag:items:c:iron_ingots>, <item:hexcasting:battery>, <tag:items:c:iron_ingots>],
    [<tag:items:c:iron_ingots>, <item:computercraft:computer_normal>, <tag:items:c:iron_ingots>],
    [<tag:items:c:iron_ingots>, <tag:items:c:wooden_chests>, <tag:items:c:iron_ingots>]
]);

craftingTable.removeByName("computercraft:turtle_advanced");
craftingTable.addShaped("hexxycraft/turtle_advanced", <item:computercraft:turtle_advanced>, [
    [<tag:items:c:gold_ingots>, <item:hexcasting:battery>, <tag:items:c:gold_ingots>],
    [<tag:items:c:gold_ingots>, <item:computercraft:computer_advanced>, <tag:items:c:gold_ingots>],
    [<tag:items:c:gold_ingots>, <tag:items:c:wooden_chests>, <tag:items:c:gold_ingots>]
]);

craftingTable.removeByName("computercraft:turtle_advanced_upgrade");
craftingTable.addShaped("hexxycraft/turtle_advanced_upgrade", <item:computercraft:turtle_advanced>, [
    [<tag:items:c:gold_ingots>, <item:minecraft:air>, <tag:items:c:gold_ingots>],
    [<tag:items:c:gold_ingots>, <item:computercraft:turtle_normal>, <tag:items:c:gold_ingots>],
    [<item:minecraft:air>, <tag:items:c:gold_blocks>, <item:minecraft:air>]
]);
