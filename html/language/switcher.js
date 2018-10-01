// Global var :(
var mlrLangInUse;
var mlr = function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.dropID, dropID = _c === void 0 ? "mbPOCControlsLangDrop" : _c, _d = _b.stringAttribute, stringAttribute = _d === void 0 ? "data-mlr-text" : _d, _e = _b.chosenLang, chosenLang = _e === void 0 ? "English" : _e, _f = _b.mLstrings, mLstrings = _f === void 0 ? MLstrings : _f, _g = _b.countryCodes, countryCodes = _g === void 0 ? false : _g, _h = _b.countryCodeData, countryCodeData = _h === void 0 ? [] : _h;
    var root = document.documentElement;
    var listOfLanguages = Object.keys(mLstrings[0]);
    mlrLangInUse = chosenLang;
    (function createMLDrop() {
        var mbPOCControlsLangDrop = document.getElementById(dropID);
        // Reset the menu
        mbPOCControlsLangDrop.innerHTML = "";
        // Now build the options
        listOfLanguages.forEach(function (lang, langidx) {
            var HTMLoption = document.createElement("option");
            HTMLoption.value = lang;
            HTMLoption.textContent = lang;
            mbPOCControlsLangDrop.appendChild(HTMLoption);
            if (lang === chosenLang) {
                mbPOCControlsLangDrop.value = lang;
            }
        });
        mbPOCControlsLangDrop.addEventListener("change", function (e) {
            mlrLangInUse = mbPOCControlsLangDrop[mbPOCControlsLangDrop.selectedIndex].value;
            resolveAllMLStrings();
            // Here we update the 2-digit lang attribute if required
            if (countryCodes === true) {
                if (!Array.isArray(countryCodeData) || !countryCodeData.length) {
                    console.warn("Cannot access strings for language codes");
                    return;
                }
                root.setAttribute("lang", updateCountryCodeOnHTML().code);
            }
        });
    })();
    function updateCountryCodeOnHTML() {
        return countryCodeData.find(function (this2Digit) { return this2Digit.name === mlrLangInUse; });
    }
    function resolveAllMLStrings() {
        var stringsToBeResolved = document.querySelectorAll("[" + stringAttribute + "]");
        stringsToBeResolved.forEach(function (stringToBeResolved) {
            var originaltextContent = stringToBeResolved.textContent;
            var resolvedText = resolveMLString(originaltextContent, mLstrings);
            stringToBeResolved.textContent = resolvedText;
        });
    }
};
function resolveMLString(stringToBeResolved, mLstrings) {
    var matchingStringIndex = mLstrings.find(function (stringObj) {
        // Create an array of the objects values:
        var stringValues = Object.values(stringObj);
        // Now return if we can find that string anywhere in there
        return stringValues.includes(stringToBeResolved);
    });
    if (matchingStringIndex) {
        return matchingStringIndex[mlrLangInUse];
    }
    else {
        // If we don't have a match in our language strings, return the original
        return stringToBeResolved;
    }
}
mlr({
    dropID: "mbPOCControlsLangDrop",
    stringAttribute: "data-mlr-text",
    chosenLang: "English",
    mLstrings: MLstrings,
    countryCodes: true,
    countryCodeData: mlCodes
});
