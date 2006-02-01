
var @EXTENSION@Var = {

	onLoad: function() {
		// Add Event Listeners
		var contextMenu = document.getElementById('contentAreaContextMenu');
		contextMenu.addEventListener('popupshowing', function() {@EXTENSION@Var.prepareContextMenu();}, false);
	},

	prepareContextMenu: function() {
        var menuitem = document.getElementById("context-@EXTENSION@");
		if (menuitem) {
			menuitem.hidden = !gContextMenu.isTextSelected;
			if (!menuitem.hidden) {
                var popupmenu = document.getElementById("@EXTENSION@-popup");
                var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);

                // Remove anything there currently
                for (var i = popupmenu.childNodes.length - 1; i >= 0; i--) {
                    popupmenu.removeChild(popupmenu.childNodes.item(i));
                }

                var count = prefs.getIntPref("@EXTENSION@.iterator");
                for (var i = 1; i <= count; i++) {
                    var tempItem = document.createElement("menuitem");
                    @EXTENSION@Var.addMenuLabel(tempItem, i, prefs);
                    tempItem.setAttribute("oncommand", "@EXTENSION@Var.@EXTENSION@(gContextMenu.searchSelected(), '"+i+"');");
                    popupmenu.appendChild(tempItem);
                }
			}
		}
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

	@EXTENSION@: function(thing, urlToUse) {
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
