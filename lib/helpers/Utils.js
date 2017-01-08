"use strict";
class Utils {
    static timeHuman(ms) {
        let x = ms / 1000;
        let seconds = x % 60;
        x /= 60;
        let minutes = x % 60;
        if (minutes >= 1) {
            return `${Math.round(minutes)}min ${parseFloat(seconds).toFixed(2)}s`;
        }
        else {
            return `${parseFloat(seconds).toFixed(2)}s`;
        }
    }
}
exports.Utils = Utils;
//# sourceMappingURL=Utils.js.map