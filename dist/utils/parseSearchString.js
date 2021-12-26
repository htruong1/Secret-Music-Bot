"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSearchString = void 0;
var SearchParams;
(function (SearchParams) {
    SearchParams["YOUTUBE"] = "youtube.com";
    SearchParams["SPOTIFY"] = "spotify";
})(SearchParams || (SearchParams = {}));
const parseSearchString = (songSearchParams) => {
    if (songSearchParams[0].includes(SearchParams.YOUTUBE)) {
        return songSearchParams[0];
    }
    return songSearchParams.join(" ");
};
exports.parseSearchString = parseSearchString;
//# sourceMappingURL=parseSearchString.js.map