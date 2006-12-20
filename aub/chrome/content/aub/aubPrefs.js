function init() {
	var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
    var count = getIntegerPreferenceValue("iterator", prefs, 3);
    var parent = document.getElementById("rows");
    var children;
    var isParent;
    var newParent;
    var parentStack = new Array();
    var countStack = new Array();
    var childCounter = count;
    var stackPointer = 0;

    document.getElementById("openPref").selectedIndex = getIntegerPreferenceValue("open", prefs, 1);
    document.getElementById("variable").value = getCharacterPreferenceValue("variable", prefs, "");

    for (var i = 1; i <= count; i++) {
        children = getIntegerPreferenceValue("children"+i, prefs);
        isParent = (children > 0);
        newParent = addTreeItem(parent, getCharacterPreferenceValue("name"+i, prefs, "Unknown"), getCharacterPreferenceValue("url"+i, prefs, "Unknown"), isParent);
        childCounter--;
        if (isParent) {
            parentStack[stackPointer] = parent;
            countStack[stackPointer] = childCounter;
            parent = newParent;
            childCounter = children;
            stackPointer++;
        }
        while (childCounter == 0 && stackPointer > 0) {
            stackPointer--;
            parent = parentStack[stackPointer];
            childCounter = countStack[stackPointer];
        }
    }
}

function addTreeItem(parent, name, url, folder) {
    var tempItem;
    var tempRow;
    var newParent;

    tempItem = document.createElement("treeitem");

    if (folder) {
        tempItem.setAttribute("container", "true");
        tempItem.setAttribute("open", "true");
        newParent = document.createElement("treechildren");
        tempItem.appendChild(newParent);
    }

    parent.appendChild(tempItem);
    tempRow = document.createElement("treerow");
    tempItem.appendChild(tempRow);

    tempItem = document.createElement("treecell");
    tempItem.setAttribute("label", name);
    tempRow.appendChild(tempItem);

    tempItem = document.createElement("treecell");
    tempItem.setAttribute("label", url);
    tempRow.appendChild(tempItem);

    return newParent;
}

function itemSelected() {
    var tree = getTree();
    var index = tree.currentIndex;
    if (index != -1) { // this can happen when an item is deleted
        document.getElementById("inputName").value = tree.view.getCellText(index, tree.columns["nameColumn"]);
        document.getElementById("inputUrl").value = tree.view.getCellText(index, tree.columns["urlColumn"]);
    }
}

function addItem() {
    addTreeItem(findParent(), trim(document.getElementById("inputName").value), trim(document.getElementById("inputUrl").value), false);
}

function addFolder() {
    addTreeItem(findParent(), trim(document.getElementById("inputName").value), "", true);
}

function findParent() {
    var tree = getTree();
    var index = tree.currentIndex;
    var parent = document.getElementById("rows");
    if (index != -1) {
        var item = tree.view.getItemAtIndex(index);
        if (item.getAttribute("container") == "true") {
            item.setAttribute("open", "true");
            parent = item.firstChild;
        }
    }
    return parent;
}

function deleteItem(folderSelectedMessage) {
    var tree = getTree();
    var item = tree.view.getItemAtIndex(tree.currentIndex);
    var flag = true;
    if (item.getAttribute("container") == "true") {
        flag = confirm(folderSelectedMessage);
    }
    if (flag) {
        item.parentNode.removeChild(item);
    }
}

function updateItem(nothingSelectedMessage) {
    var tree = getTree();
    var index = tree.currentIndex;
    if (index == -1) {
        alert(nothingSelectedMessage);
    } else {
        tree.view.setCellText(index, tree.columns["nameColumn"], document.getElementById("inputName").value);
        if (!tree.view.isContainer(index)) {
            tree.view.setCellText(index, tree.columns["urlColumn"], document.getElementById("inputUrl").value);
        }
    }
}

function clearAll() {
    var tree = getTree();
    // todo find out why I can't set this to "", then I wouldn't need the trim function.
    document.getElementById("inputName").value = " ";
    document.getElementById("inputUrl").value = " ";
    tree.view.selection.select(-1);
}

function getCharacterPreferenceValue(fieldName, prefs, defaultValue) {
	var tmp;

	if (prefs.getPrefType("@EXTENSION@."+fieldName) == prefs.PREF_STRING){
		tmp = prefs.getCharPref("@EXTENSION@."+fieldName);
	} else {
		tmp = defaultValue;
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
    var children;

    // remove the flag so that the menu will be rebuilt next time it's opened
    var menuItem = window.opener.document.getElementById("context-@EXTENSION@");
    if (menuItem) {
        menuItem.setAttribute("flags", "");
    }

    saveIntField("open", document.getElementById("openPref").selectedIndex, prefs);
    saveField("variable", document.getElementById("variable").value, prefs);

    if (count > 0) {
        saveIntField("iterator", count, prefs);

        for (var i = 0; i < count; i++) {
            j = i + 1;
            children = 0;
            saveField("name"+j, tree.view.getCellText(i, tree.columns["nameColumn"]), prefs);
            saveField("url"+j, tree.view.getCellText(i, tree.columns["urlColumn"]), prefs);
            if (tree.view.isContainer(i)) {
                children = tree.view.getItemAtIndex(i).firstChild.childNodes.length;
            }
            saveIntField("children"+j, children, prefs);
        }
    }
}

function saveField(fieldName, newValue, prefs) {
	prefs.setCharPref("@EXTENSION@."+fieldName, newValue);
}

function saveIntField(fieldName, newValue, prefs) {
	prefs.setIntPref("@EXTENSION@."+fieldName, newValue);
}

function trim(str) {
   return str.replace(/^\s*|\s*$/g, "");
}

function getTree() {
    return document.getElementById("treeThing");
}

