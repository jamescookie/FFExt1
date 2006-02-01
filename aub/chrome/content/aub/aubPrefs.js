function init() {
	var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
    var count = getIntegerPreferenceValue("iterator", prefs, 3);

    document.getElementById("iterator").value = count;

    var tempItem;
    var fieldName;
    var rowParent = document.getElementById("rows");
    var numberColumnParent = document.getElementById("numberColumn");
    var nameColumnParent = document.getElementById("nameColumn");
    var urlColumnParent = document.getElementById("urlColumn");

    for (var i = 1; i <= count; i++) {
        rowParent.appendChild(document.createElement("row"));

        tempItem = document.createElement("label");
        tempItem.setAttribute("value", i);
        numberColumnParent.appendChild(tempItem);

        tempItem = document.createElement("textbox");
        fieldName = "name"+i;
        tempItem.setAttribute("id", fieldName);
        tempItem.setAttribute("value", getCharacterPreferenceValue(fieldName, prefs));
        nameColumnParent.appendChild(tempItem);

        tempItem = document.createElement("textbox");
        fieldName = "url"+i;
        tempItem.setAttribute("id", fieldName);
        tempItem.setAttribute("value", getCharacterPreferenceValue(fieldName, prefs));
        urlColumnParent.appendChild(tempItem);
    }
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
    var count = getIntegerPreferenceValue("iterator", prefs, 3);
    var newIterator = document.getElementById("iterator").value;

    if ((newIterator / newIterator) == 1) {
        prefs.setIntPref("@EXTENSION@.iterator", newIterator);
    }
    for (var i = 1; i <= count; i++) {
        saveField("name"+i, prefs);
        saveField("url"+i, prefs);
    }
}

function saveField(fieldName, prefs) {
	var tmp = document.getElementById(fieldName).value;
	prefs.setCharPref("@EXTENSION@."+fieldName, tmp);
}

