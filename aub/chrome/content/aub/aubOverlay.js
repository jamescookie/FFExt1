
var @EXTENSION@Var = {

	onLoad: function() {
		// Add Event Listeners
        if (document.getElementById("contentAreaContextMenu")){
            document.getElementById("contentAreaContextMenu").addEventListener("popupshowing", function() {@EXTENSION@Var.prepareContextMenu();}, false);
        } else if (document.getElementById("messagePaneContext")){
            document.getElementById("messagePaneContext").addEventListener("popupshowing", function() {@EXTENSION@Var.prepareContextMenu();}, false);
        } else if (document.getElementById("msgComposeContext")){
            document.getElementById("msgComposeContext").addEventListener("popupshowing", function() {@EXTENSION@Var.prepareContextMenu();}, false);
        }
	},

	prepareContextMenu: function() {
        var menuitem = document.getElementById("context-@EXTENSION@");
		if (menuitem) {
            var selectedText = @EXTENSION@Var.getSelectedText();
            menuitem.hidden = (selectedText == "");
            if (!menuitem.hidden && menuitem.getAttribute("flags") != "built") {
                menuitem.setAttribute("flags", "built");
                var popupmenu = document.getElementById("@EXTENSION@-popup");
                var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);

                // Remove anything there currently
                for (var i = popupmenu.childNodes.length - 1; i >= 0; i--) {
                    popupmenu.removeChild(popupmenu.childNodes.item(i));
                }

                var count = @EXTENSION@Var.getIntegerPreferenceValue("iterator", prefs, 0);
                var tempItem;
                var children;
                var isParent;
                var parentStack = new Array();
                var countStack = new Array();
                var childCounter = count;
                var stackPointer = 0;

                for (var i = 1; i <= count; i++) {
                    children = @EXTENSION@Var.getIntegerPreferenceValue("children"+i, prefs, 0);
                    isParent = (children > 0);
                    childCounter--;
                    if (isParent) {
                        parentStack[stackPointer] = popupmenu;
                        countStack[stackPointer] = childCounter;
                        childCounter = children;
                        stackPointer++;

                        tempItem = document.createElement("menu");
                        @EXTENSION@Var.addMenuLabel(tempItem, i, prefs);
                        popupmenu.appendChild(tempItem);
                        popupmenu = document.createElement("menupopup");
                        tempItem.appendChild(popupmenu);
                    } else {
                        tempItem = document.createElement("menuitem");
                        @EXTENSION@Var.addMenuLabel(tempItem, i, prefs);
                        tempItem.setAttribute("oncommand", "@EXTENSION@Var.@EXTENSION@('"+i+"');");
                        popupmenu.appendChild(tempItem);
                    }

                    while (childCounter == 0 && stackPointer > 0) {
                        stackPointer--;
                        popupmenu = parentStack[stackPointer];
                        childCounter = countStack[stackPointer];
                    }
                }

                popupmenu.appendChild(document.createElement("menuseparator"));
                tempItem = document.createElement("menuitem");
                var localeBundle = document.getElementById("@EXTENSION@-bundle");
                tempItem.setAttribute("label", localeBundle.getString("options")+'...');
                tempItem.setAttribute("oncommand", "window.openDialog('chrome://@EXTENSION@/content/@EXTENSION@Prefs.xul');");
                popupmenu.appendChild(tempItem);
            }
		}
	},

    getSelectedText: function() {
        var node = document.popupNode;
        var selection = "";

        if ((node instanceof HTMLTextAreaElement) || (node instanceof HTMLInputElement && node.type == "text")) {
            selection = node.value.substring(node.selectionStart, node.selectionEnd);
        } else {
            try {
                selection = getBrowserSelection();  // firefox 2+
            } catch(e) {
                selection = gContextMenu.searchSelected();
            }
        }

        if (selection.length >= 255) {
            selection = selection.substring(0, 254);
        }

        if (selection == "" && gContextMenu.onLink) {
            selection = gContextMenu.linkURL;
        }

        return selection;
    },

    addMenuLabel: function(menuitem, num, prefs) {
        var labelStr = @EXTENSION@Var.getCharacterPreferenceValue("name"+num, prefs, "");
		if (labelStr == "") {
			labelStr = "Unknown";
		}
		menuitem.setAttribute("label", labelStr);
	},

    getIntegerPreferenceValue: function(fieldName, prefs, defaultValue) {
        var tmp;

        if (prefs.getPrefType("@EXTENSION@."+fieldName) == prefs.PREF_INT){
            tmp = prefs.getIntPref("@EXTENSION@."+fieldName);
        } else {
            tmp = defaultValue;
        }

        return tmp;
    },

    getCharacterPreferenceValue: function(fieldName, prefs, defaultValue) {
        var tmp;

        if (prefs.getPrefType("@EXTENSION@."+fieldName) == prefs.PREF_STRING){
            tmp = prefs.getCharPref("@EXTENSION@."+fieldName);
        } else {
            tmp = defaultValue;
        }

        return tmp;
    },

	@EXTENSION@: function(urlToUse) {
        var thing = @EXTENSION@Var.getSelectedText();
        var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
        var OPEN_IN_TAB            = 0;
        var OPEN_IN_BACKGROUND_TAB = 1;
        var OPEN_IN_WINDOW         = 2;
        var OPEN_IN_CURRENT        = 3;

		var url = @EXTENSION@Var.getCharacterPreferenceValue("url"+urlToUse, prefs, "http://www.google.com/search?q=");
		var variable = @EXTENSION@Var.getCharacterPreferenceValue("variable", prefs, "");
        var urlToOpen;

        if (variable == "") {
            urlToOpen = url + thing;
        } else {
            var index = url.indexOf(variable);
            if (index == -1) {
                urlToOpen = url + thing;
            } else {
                urlToOpen = url.substring(0, index) + thing + url.substring(index + variable.length);
            }
        }

        var openPref = @EXTENSION@Var.getIntegerPreferenceValue("open", prefs, 1);
        if (openPref == OPEN_IN_WINDOW) {
            window.openDialog(getBrowserURL(), '_blank', 'chrome,all,dialog=no', urlToOpen);
        } else if (openPref == OPEN_IN_CURRENT) {
            getBrowser().loadURI(urlToOpen);
        } else {
            var newTab = getBrowser().addTab(urlToOpen);
            if (openPref == OPEN_IN_TAB) {
                getBrowser().selectedTab = newTab;
            }
        }
	}
}

window.addEventListener('load', function() {@EXTENSION@Var.onLoad();}, false);
