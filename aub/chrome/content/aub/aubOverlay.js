
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
				var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
				@EXTENSION@Var.addMenuLabel(1, prefs);
				@EXTENSION@Var.addMenuLabel(2, prefs);
				@EXTENSION@Var.addMenuLabel(3, prefs);
			}
		}
	},

	addMenuLabel: function(num, prefs) {
		var menuitem = document.getElementById("@EXTENSION@-menu"+num);
		var label = "";
		if (prefs.getPrefType("@EXTENSION@.name"+num) == prefs.PREF_STRING) {
			label = prefs.getCharPref("@EXTENSION@.name"+num);
		}
		if (label == "") {
			label = "Unknown";
		}
		menuitem.label = label;
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
