var @EXTENSION@PrefsVar = {

init: function() {
	var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
    var count = @EXTENSION@PrefsVar.getIntegerPreferenceValue("iterator", prefs, 3);
    var parent = document.getElementById("rows");
    var children;
    var isParent;
    var newParent;
    var parentStack = new Array();
    var countStack = new Array();
    var childCounter = count;
    var stackPointer = 0;

    document.documentElement.getButton("accept").hidden = false;
    document.getElementById("openPref").selectedIndex = @EXTENSION@PrefsVar.getIntegerPreferenceValue("open", prefs, 1);
    document.getElementById("variable").value = @EXTENSION@PrefsVar.getCharacterPreferenceValue("variable", prefs, "");

    for (var i = 1; i <= count; i++) {
        children = @EXTENSION@PrefsVar.getIntegerPreferenceValue("children"+i, prefs);
        isParent = (children > 0);
        newParent = @EXTENSION@PrefsVar.addTreeItem(parent, @EXTENSION@PrefsVar.getCharacterPreferenceValue("name"+i, prefs, "Unknown"), @EXTENSION@PrefsVar.getCharacterPreferenceValue("url"+i, prefs, "Unknown"), isParent);
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
},

addTreeItem: function(parent, name, url, folder) {
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
},

addItem: function() {
    @EXTENSION@PrefsVar.addTreeItem(@EXTENSION@PrefsVar.findParent(), "New Item", "http://"+document.getElementById("variable").value, false);
},

addFolder: function() {
    @EXTENSION@PrefsVar.addTreeItem(@EXTENSION@PrefsVar.findParent(), "New Folder", "", true);
},

findParent: function() {
    var tree = @EXTENSION@PrefsVar.getTree();
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
},

deleteItem: function(folderSelectedMessage) {
    var tree = @EXTENSION@PrefsVar.getTree();
    var item = tree.view.getItemAtIndex(tree.currentIndex);
    var flag = true;
    if (item.getAttribute("container") == "true") {
        flag = confirm(folderSelectedMessage);
    }
    if (flag) {
        item.parentNode.removeChild(item);
    }
},

moveItem: function(direction, nothingSelectedMessage) {
    var tree = @EXTENSION@PrefsVar.getTree();
    var index = tree.currentIndex;
    if (index == -1) {
        alert(nothingSelectedMessage);
    } else {
        var item = tree.view.getItemAtIndex(index);
        if (direction == "up") {
            if (item.previousSibling) {
                item.parentNode.insertBefore(item, item.previousSibling)
                tree.view.selection.select(index - 1)
            }
        } else {
            if (item.nextSibling) {
                item.parentNode.insertBefore(item.nextSibling, item)
                tree.view.selection.select(index + 1)
            }
        }
    }
},

getCharacterPreferenceValue: function(fieldName, prefs, defaultValue) {
	var tmp;

	if (prefs.getPrefType("@EXTENSION@."+fieldName) == prefs.PREF_STRING) {
		tmp = prefs.getCharPref("@EXTENSION@."+fieldName);
	} else {
		tmp = defaultValue;
	}

	return tmp;
},

getIntegerPreferenceValue: function(fieldName, prefs, defaultValue) {
	var tmp;

	if (prefs.getPrefType("@EXTENSION@."+fieldName) == prefs.PREF_INT) {
		tmp = prefs.getIntPref("@EXTENSION@."+fieldName);
	} else {
		tmp = defaultValue;
	}

	return tmp;
},

accept: function() {
	var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
    var tree = @EXTENSION@PrefsVar.getTree();
    var count = tree.view.rowCount;
    var j;
    var children;

    // remove the flag so that the menu will be rebuilt next time it's opened
    var menuItem = window.opener.document.getElementById("context-@EXTENSION@");
    if (menuItem) {
        menuItem.setAttribute("flags", "");
    }

    @EXTENSION@PrefsVar.saveIntField("open", document.getElementById("openPref").selectedIndex, prefs);
    @EXTENSION@PrefsVar.saveField("variable", document.getElementById("variable").value, prefs);

    if (count > 0) {
        @EXTENSION@PrefsVar.saveIntField("iterator", count, prefs);

        for (var i = 0; i < count; i++) {
            j = i + 1;
            children = 0;
            @EXTENSION@PrefsVar.saveField("name"+j, tree.view.getCellText(i, tree.columns["nameColumn"]), prefs);
            @EXTENSION@PrefsVar.saveField("url"+j, tree.view.getCellText(i, tree.columns["urlColumn"]), prefs);
            if (tree.view.isContainer(i)) {
                children = tree.view.getItemAtIndex(i).firstChild.childNodes.length;
            }
            @EXTENSION@PrefsVar.saveIntField("children"+j, children, prefs);
        }
    }
},

saveField: function(fieldName, newValue, prefs) {
	prefs.setCharPref("@EXTENSION@."+fieldName, newValue);
},

saveIntField: function(fieldName, newValue, prefs) {
	prefs.setIntPref("@EXTENSION@."+fieldName, newValue);
},

getTree: function() {
    return document.getElementById("treeThing");
}
};
