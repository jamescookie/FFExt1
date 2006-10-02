
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
            if (!menuitem.hidden) {
                var popupmenu = document.getElementById("@EXTENSION@-popup");
                var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);

                // Remove anything there currently
                for (var i = popupmenu.childNodes.length - 1; i >= 0; i--) {
                    popupmenu.removeChild(popupmenu.childNodes.item(i));
                }

                var count = prefs.getIntPref("@EXTENSION@.iterator");
                var tempItem;
                for (var i = 1; i <= count; i++) {
                    tempItem = document.createElement("menuitem");
                    @EXTENSION@Var.addMenuLabel(tempItem, i, prefs);
                    tempItem.setAttribute("oncommand", "@EXTENSION@Var.@EXTENSION@('"+i+"');");
                    popupmenu.appendChild(tempItem);
                }

                popupmenu.appendChild(document.createElement("menuseparator"));
                tempItem = document.createElement("menuitem");
                tempItem.setAttribute("label", "Options...");
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

        if (selection.length >= 255){
            selection = selection.substring(0, 254);
        }

        return selection;
    },

    addMenuLabel: function(menuitem, num, prefs) {
		var label = "";
		if (prefs.getPrefType("@EXTENSION@.name"+num) == prefs.PREF_STRING) {
			label = prefs.getCharPref("@EXTENSION@.name"+num);
		}
		if (label == "") {
			label = "Unknown";
		}
		menuitem.setAttribute("label", label);
	},

	@EXTENSION@: function(urlToUse) {
        var thing = @EXTENSION@Var.getSelectedText();
        var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);

		var url;
		if (prefs.getPrefType("@EXTENSION@.url"+urlToUse) == prefs.PREF_STRING){
			url = prefs.getCharPref("@EXTENSION@.url"+urlToUse);
		} else {
			url = "http://www.google.com/search?q=";
		}

		var newTab = getBrowser().addTab(url + thing);
		if (!gPrefService.getBoolPref('browser.tabs.loadInBackground')) getBrowser().selectedTab = newTab;
	}
}

window.addEventListener('load', function() {@EXTENSION@Var.onLoad();}, false);
