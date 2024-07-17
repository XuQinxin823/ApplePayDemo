var MECHANT_ID = "merchant.test.example.com"
var BACKEND_URL_VALIDATE_SESSION = window.location.href + "validateSession";
var BACKEND_URL_PAY = window.location.href + "pay";

var appleButton = document.querySelector(".apple-pay-button")

//Check if Apple Pay is available
// if (window.ApplePaySession &6
//     ApplePaySession.canMakePaymentsWithActiveCard(MECHANT_ID)
// ){
//     appleButton.style.display = "block"
// }
if (window.ApplePaySession) {
    if (ApplePaySession.canMakePayments()) {
        //Show the Apple Pay Button
        document.getElementById('appleButton').style.display = 'block';
    }
}

//Handle the Apple Pay button click
appleButton.addEventListener("click", function (){
    var applePaySession = new ApplePaySession (13,{
        countryCode: "US",
        currencyCode: "USD",
        supportedNetworks: ["visa"],
        merchantCapabilities:["supports3DS"],
        total: { label:"Good try", amount: "1.00"}
    });
    applePaySession.begin();
}

    // 处理会话事件
    applePaySession.onvalidatemerchant = function (event) {
        // 在这里与服务器通信，完成商户验证
        // 使用event.validationURL和服务器返回的merchantSession对象调用
        // applePaySession.completeMerchantValidation(merchantSession);
    };

    applePaySession.onpaymentauthorized = function (event) {
        // 处理授权的支付
        // 使用event.payment.token等支付详情与服务器通信
        // applePaySession.completePayment(ApplePaySession.STATUS_SUCCESS);
    };