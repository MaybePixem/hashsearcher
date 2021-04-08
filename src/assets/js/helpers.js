export const stringToHex = (string) => {
    let hex, i;

    let result = "";
    for (i = 0; i < string.length; i++) {
        hex = string.charCodeAt(i).toString(16);
        result += hex.slice(-4);
    }
    return result;
}

export const stringToBinary = (text) => {
    var length = text.length,
        output = [];
    for (var i = 0; i < length; i++) {
        var bin = text[i].charCodeAt().toString(2);
        output.push(Array(8 - bin.length + 1).join("0") + bin);
    }
    return output.join("");
}

export const reverseString = (str) => {
    return str.split("").reverse().join("");
}