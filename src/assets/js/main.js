import privateKeyToAddress from 'ethereum-private-key-to-address';
import $ from 'jquery';
import sha256 from 'js-sha256';
import { stringToHex, stringToBinary, reverseString } from './helpers';
import { sha3_256, keccak256, shake128, shake256 } from 'js-sha3';
import '../css/styles.css';
let timerValue = 0;
let timerInterval;
const ETHERSCANAPITOKEN = "YourApiKeyToken";

const generateResults = () => {
    const text = $("#text").val();
    let normalHashArray = calculateHashes(text);
    let hexHashArray = calculateHashes(stringToHex(text));
    let binHashArray = calculateHashes(stringToBinary(text));
    let reversedHashArray = calculateHashes(reverseString(text));
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
    $.get(`https://api.etherscan.io/api?module=account&action=balancemulti&address=${publicKeyList}&tag=latest&apikey=${ETHERSCANAPITOKEN}`, (data) => {
        if (data.status === "0") {
            alert("Etherscan rate limit reached");
        } else {
            if (ETHERSCANAPITOKEN === "YourApiKeyToken") {
                $("#text").attr("disabled", "disabled");
                timerValue = 5000;
                timerInterval = setInterval(executeTimer, 100);
            }
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
        const currentBalance = etherBalances.find(e => e.account === element.publicKey).balance;
        $(`#tableBody${target}`).append(` 
                <tr class="${currentBalance > 0 ? "highlighted" : ""} table-light">
                    <th scope="row">${element.hash}</th>
                    <td><a target="_blank" href="https://etherscan.io/address/${element.publicKey}">${element.publicKey}</a></td>
                    <td >${currentBalance}</td>
                    <td>${element.privateKey}</td>
                </tr>`);
    });
}

$("#text").on("keypress", (event) => { if (event.key === "Enter") generateResults() });