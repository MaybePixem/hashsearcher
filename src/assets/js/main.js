
import $ from 'jquery';
import '../css/styles.css';
const ETHERSCANAPITOKEN = "18CID9V5IXX655ID8W1XJFSYJT3H4PNGN7";
const UNIV2 = '0xda3706c9a099077e6bc389d1baf918565212a54d';
const UNIV2TOKEN = '0xda3706c9a099077e6bc389d1baf918565212a54d';
const VIDYA = '0x3D3D35bb9bEC23b06Ca00fe472b50E7A4c692C30';
const WETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
let counter = 0;
const doCall = async (url) => {
    const data = await $.get(url);
    if (ETHERSCANAPITOKEN === "YourApiKeyToken") {
        await new Promise((resolve) => setTimeout(resolve, 50))
    }
    counter++;
    $("#timer").text(counter + "/4");
    if (typeof data.result === "object") {
        return data.result.ethusd.substring(0, 6);
    }
    return String(data.result).substring(0, data.result.length - 14) / 1000;
}

const generateResults = async () => {
    $("#timer").text("0/4");
    const ownedLP = $("#ownedLP").val();
    $("#ownedLP").attr("disabled", "disabled");
    const totalVidya = await doCall(`https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${VIDYA}&address=${UNIV2}&tag=latest&apikey=${ETHERSCANAPITOKEN}`);
    const totalETH = await doCall(`https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${WETH}&address=${UNIV2}&tag=latest&apikey=${ETHERSCANAPITOKEN}`);
    const totalLP = await doCall(`https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=${UNIV2TOKEN}&apikey=${ETHERSCANAPITOKEN}`);
    const ethPrice = await doCall(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${ETHERSCANAPITOKEN}`);
    const share = ownedLP / totalLP;
    displayResult(totalETH * share, totalVidya * share, ownedLP, ethPrice * 2 * (totalETH * share));
    $("#ownedLP").removeAttr("disabled");
    counter = 0;
}

const displayResult = (eth, vidya, lp, total) => {
    $(`#tableBodyNormal`).empty();
    $(`#tableBodyNormal`).append(` 
                <tr table-light">
                    <td>${lp}</a></td>
                    <td>${Math.round(vidya * 10000) / 10000}</td>
                    <td>${Math.round(eth * 10000) / 10000}</td>
                    <td>${Math.round(total * 1000) / 1000}$</td>
                </tr>`);
}

$("#text").on("keypress", (event) => { if (event.key === "Enter") generateResults() });
$("#ownedLP").on("keypress", (event) => { if (event.key === "Enter") generateResults() });