const privateKeyToAddress = require('ethereum-private-key-to-address')
const $ = require("jquery");
const sha256 = require("js-sha256")
const sha3_256 = require('js-sha3').sha3_256;
const keccak256 = require('js-sha3').keccak256;
const shake128 = require('js-sha3').shake128;
const shake256 = require('js-sha3').shake256;
let timerValue = 0;
let timerInterval;

const generateResults = () => {
    let normalHashArray = [];
    let hexHashArray = [];
    let binHashArray = [];
    let reversedHashArray = [];
    const text = $("#text").val();
    normalHashArray = calculateHashes(text);
    hexHashArray = calculateHashes(stringToHex(text));
    binHashArray = calculateHashes(stringToBinary(text));
    reversedHashArray = calculateHashes(reverseString(text));
    //Get ether balance
    let publicKeyList = [];
    normalHashArray.forEach(e => {
        publicKeyList.push(e.publicKey);
    });
    hexHashArray.forEach(e => {
        publicKeyList.push(e.publicKey);
    });
    binHashArray.forEach(e => {
        publicKeyList.push(e.publicKey);
    });
    reversedHashArray.forEach(e => {
        publicKeyList.push(e.publicKey);
    });
    $.get(`https://api.etherscan.io/api?module=account&action=balancemulti&address=${publicKeyList}&tag=latest&apikey=YourApiKeyToken`, (data) => {
        if (data.status === "0") {
            alert("Etherscan rate limit reached");
        } else {
            $("#text").attr("disabled", "disabled");
            timerValue = 5000;
            timerInterval = setInterval(executeTimer, 100);
            console.log(data.message, data.result);
            displayResult(normalHashArray, "Normal", data.result, text);
            displayResult(hexHashArray, "Hex", data.result, stringToHex(text));
            displayResult(binHashArray, "Binary", data.result, stringToBinary(text));
            displayResult(reversedHashArray, "Reversed", data.result, reverseString(text));
        }
    });
}

const calculateHashes = (text) => {
    const hashArray = [];
    //SHA-256
    const textSha256 = sha256(text);
    hashArray.push({ hash: "SHA-256", publicKey: privateKeyToAddress(textSha256), privateKey: textSha256 });
    //SHA3-256
    const textSha3_256 = sha3_256(text);
    hashArray.push({ hash: "SHA3-256", publicKey: privateKeyToAddress(textSha3_256), privateKey: textSha3_256 });
    //KECCAK-256
    const textKeccak_256 = keccak256(text);
    hashArray.push({ hash: "KECCAK-256", publicKey: privateKeyToAddress(textKeccak_256), privateKey: textKeccak_256 });
    //SHAKE-128
    const texShake_128 = shake128(text, 256);
    hashArray.push({ hash: "SHAKE-128", publicKey: privateKeyToAddress(texShake_128), privateKey: texShake_128 });
    //SHAKE-256
    const texShake_256 = shake256(text, 256);
    hashArray.push({ hash: "SHAKE-256", publicKey: privateKeyToAddress(texShake_256), privateKey: texShake_256 });

    return hashArray;
}

const stringToHex = (string) => {
    let hex, i;

    let result = "";
    for (i = 0; i < string.length; i++) {
        hex = string.charCodeAt(i).toString(16);
        result += hex.slice(-4);
    }
    return result;
}

const stringToBinary = (text) => {
    var length = text.length,
        output = [];
    for (var i = 0; i < length; i++) {
        var bin = text[i].charCodeAt().toString(2);
        output.push(Array(8 - bin.length + 1).join("0") + bin);
    }
    return output.join("");
}

const reverseString = (str) => {
    return str.split("").reverse().join("");
}

const executeTimer = () => {
    if (timerValue === 0) {
        clearInterval(timerInterval);
        $("#timer").text("");
        $("#text").removeAttr("disabled");
    } else {
        timerValue -= 100;
        $("#timer").text(timerValue / 1000 + "s");
    }
}

const displayResult = (hashArray, target, etherBalances, text) => {
    $(`#tableBody${target}`).empty();
    $(`#field${target}`).text(text);
    hashArray.forEach(element => {
        $(`#tableBody${target}`).append(` 
                <tr class="table-light">
                    <th scope="row">${element.hash}</th>
                    <td><a target="_blank" href="https://etherscan.io/address/${element.publicKey}">${element.publicKey}</a></td>
                    <td>${etherBalances.find(e => e.account === element.publicKey).balance}</td>
                    <td>${element.privateKey}</td>
                </tr>`);
    });
}

//$("#text").on("blur", generateResults);
$("#text").on("keypress", (event) => { if (event.key === "Enter") generateResults() });