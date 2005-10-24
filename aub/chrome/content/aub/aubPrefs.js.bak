function init() {
	var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);

	aubPopulateField("name1", prefs);
	aubPopulateField("name2", prefs);
	aubPopulateField("name3", prefs);
  
	aubPopulateField("url1", prefs);
	aubPopulateField("url2", prefs);
	aubPopulateField("url3", prefs);
}

function aubPopulateField(fieldName, prefs) {
	var tmp;

	if (prefs.getPrefType("@EXTENSION@."+fieldName) == prefs.PREF_STRING){
		tmp = prefs.getCharPref("@EXTENSION@."+fieldName);
	} else {
		tmp = "Unknown";
	}

	document.getElementById(fieldName).value = tmp;
}

function accept() {
	var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);

	aubSaveField("name1", prefs);
	aubSaveField("name2", prefs);
	aubSaveField("name3", prefs);

	aubSaveField("url1", prefs);
	aubSaveField("url2", prefs);
	aubSaveField("url3", prefs);
}

function aubSaveField(fieldName, prefs) {
	var tmp = document.getElementById(fieldName).value;
	prefs.setCharPref("@EXTENSION@."+fieldName, tmp);
}

