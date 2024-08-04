//made by Shibva_
// HUGE THANKS TO kindlich, for helping me out the most ^w^

import crafttweaker.api.item.IItemStack;
import crafttweaker.api.data.MapData;
import crafttweaker.api.data.IData;


// Bonk the broken recpies
craftingTable.remove(<item:hexcasting:focus>.withTag({sealed: 1, VisualOverride: "any"}));
craftingTable.remove(<item:hexcasting:spellbook>.withTag({VisualOverride: "any", page_idx: 0, sealed_pages: {"1": 1}, page_names: {}}));

//Recpie Injections
craftingTable.addShapeless(
    "seal_focus_fix", 
    <item:hexcasting:focus>.withTag({sealed: 1, VisualOverride: "any"}),
    [<item:hexcasting:focus> | <item:hexcasting:focus>.withTag({VisualOverride: "any"}), <item:minecraft:honeycomb>],
    (usualOut as IItemStack, inputs as IItemStack[]) => {
        if (inputs[0].hasTag && !("sealed" in inputs[0].getOrCreateTag())) {
            return usualOut.withTag(inputs[0].getOrCreateTag().merge({"sealed": 1}) as MapData);
        }
        else {
            return <item:minecraft:air>;
        }
    }
);

craftingTable.addShapeless(
    "seal_book_fix", 
    <item:hexcasting:spellbook>.withTag({VisualOverride: "any", page_idx: 0, sealed_pages: {"1": 1}, page_names: {}}),
    [<item:hexcasting:spellbook> | <item:hexcasting:spellbook>.withTag({VisualOverride: "any"}), <item:minecraft:honeycomb>],
    (usualOut as IItemStack, inputs as IItemStack[]) => {
        var itemData = inputs[0].getOrCreateTag() as IData;
        var X = itemData["page_idx"];
        var pages = itemData["pages"];

        if !("sealed_pages" in inputs[0].getOrCreateTag()) {
            itemData = itemData.merge({sealed_pages:{}});
        }
        var sealPage = itemData["sealed_pages"];
        if ("sealed_pages" in itemData && !(X.getAsString() in sealPage) && X.getAsString() in pages) {
            sealPage.put(X.getAsString(), 1);
            return usualOut.withTag(itemData.merge({sealed_pages: sealPage}));
        }

        else {
            return <item:minecraft:air>;
        }
    }
);


