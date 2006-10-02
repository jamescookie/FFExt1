function init() {
	var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
    var count = getIntegerPreferenceValue("iterator", prefs, 3);
    var rowParent = document.getElementById("rows");

    for (var i = 1; i <= count; i++) {
        addTreeItem(rowParent, getCharacterPreferenceValue("name"+i, prefs), getCharacterPreferenceValue("url"+i, prefs));
    }
}

function addTreeItem(parent, name, url) {
    var tempItem;
    var tempRow;

    tempItem = document.createElement("treeitem");
    parent.appendChild(tempItem);
    tempRow = document.createElement("treerow");
    tempItem.appendChild(tempRow);

    tempItem = document.createElement("treecell");
    tempItem.setAttribute("label", name);
    tempRow.appendChild(tempItem);

    tempItem = document.createElement("treecell");
    tempItem.setAttribute("label", url);
    tempRow.appendChild(tempItem);
}

function itemSelected() {
    var tree = getTree();
    document.getElementById("inputName").value = tree.view.getCellText(tree.currentIndex, tree.columns["nameColumn"]);
    document.getElementById("inputUrl").value = tree.view.getCellText(tree.currentIndex, tree.columns["urlColumn"]);
}

function addItem() {
    addTreeItem(document.getElementById("rows"), trim(document.getElementById("inputName").value), trim(document.getElementById("inputUrl").value));
}

function deleteItem() {
    var tree = getTree();
    var item = tree.view.getItemAtIndex(tree.currentIndex);
    item.parentNode.removeChild(item);
}

function updateItem(message) {
    var tree = getTree();
    var index = tree.currentIndex;
    if (index == -1) {
        alert(message);
    } else {
        tree.view.setCellText(tree.currentIndex, tree.columns["nameColumn"], document.getElementById("inputName").value);
        tree.view.setCellText(tree.currentIndex, tree.columns["urlColumn"], document.getElementById("inputUrl").value);
    }
}

function clearAll() {
    var tree = getTree();
    // todo find out why I can't set this to "", then I wouldn't need the trim function.
    document.getElementById("inputName").value = " ";
    document.getElementById("inputUrl").value = " ";
    tree.view.selection.select(-1);
}

function getCharacterPreferenceValue(fieldName, prefs) {
	var tmp;

	if (prefs.getPrefType("@EXTENSION@."+fieldName) == prefs.PREF_STRING){
		tmp = prefs.getCharPref("@EXTENSION@."+fieldName);
	} else {
		tmp = "Unknown";
	}

	return tmp;
}

function getIntegerPreferenceValue(fieldName, prefs, defaultValue) {
	var tmp;

	if (prefs.getPrefType("@EXTENSION@."+fieldName) == prefs.PREF_INT){
		tmp = prefs.getIntPref("@EXTENSION@."+fieldName);
	} else {
		tmp = defaultValue;
	}

	return tmp;
}

function accept() {
	var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
    var tree = getTree();
    var count = tree.view.rowCount;
    var j;

    if (count > 0) {
        prefs.setIntPref("@EXTENSION@.iterator", count);

        for (var i = 0; i < count; i++) {
            j = i + 1;
            saveField("name"+j, tree.view.getCellText(i, tree.columns["nameColumn"]), prefs);
            saveField("url"+j, tree.view.getCellText(i, tree.columns["urlColumn"]), prefs);
        }
    }
}

function saveField(fieldName, newValue, prefs) {
	prefs.setCharPref("@EXTENSION@."+fieldName, newValue);
}

function trim(str) {
   return str.replace(/^\s*|\s*$/g, "");
}

function getTree() {
    return document.getElementById("treeThing");
}

