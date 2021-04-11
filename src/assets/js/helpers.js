export const stringToHex = (string) => {
    let result = "";
    for (let i = 0; i < string.length; i++) {
        let hex = string.charCodeAt(i).toString(16);
        result += hex.slice(-4);
    }
    return result;
}

export const stringToBinary = (text) => {
    let output = [];
    for (let i = 0; i < text.length; i++) {
        let bin = text[i].charCodeAt().toString(2);
        output.push(Array(8 - bin.length + 1).join("0") + bin);
    }
    return output.join("");
}

export const reverseString = (str) => {
    return str.split("").reverse().join("");
}