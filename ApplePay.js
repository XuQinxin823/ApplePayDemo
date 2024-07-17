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
appleButton.addEventListener("click", function () {
    var applePaySession = new ApplePaySession(13, {
        countryCode: "US",
        currencyCode: "USD",
        supportedNetworks: ["visa"],
        merchantCapabilities: ["supports3DS"],
        total: {label: "Good try", amount: "1.00"}
    });
    applePaySession.begin();


    // First event Apple triggers. Validate the Apple Pay Session from the backend
    applePaySession.onvalidatemerchant = function (event) {
        var theValidationURL = event.validationURL;
        validateTheSession(theValidationURL, function (merchantSession) {
            applePaysession.completeMerchantValidation(merchantSession);
        });
    };

    // Event triggers after the user has confirmed the transaction with the Touch ID or Face ID.
    // Will contain the payment token
    applePaySession.onpaymentauthorized = function (event) {
        var applePaymentToken = event.payment.token;

        pay(applePaymentToken, function (outcome) {
            if (outcome) {
                applePaySession.completePayment(ApplePaySession.STATUS_SUCCESS);
            } else {
                applePaySession.completePayment(ApplePaySession.STATUS_FAILURE);
            }
        });
    };
});


var validateTheSession = function (theValidateURL, callback){
    axios
        .post(
            BACKEND_URL_VALIDATE_SESSION,
            {
                appleUrl:theValidateURL
            },
            {
                headers:{
                    "Access-Control-Allow-Origin":"*"
                }
            })
        .then(function (response){
            callback(response.data);
        });
    };

var pay = function (applePaymentToken, callback){
    //Send the validation URl to the backend
    axios
        .post(
            BACKEND_URL_PAY,
            {
                token:applePaymentToken
            },
            {
                headers:{
                    "Access-Control-Allow-Origin":"*"
                }
            })
        .then(function (response){
            callback(response.data);
        });
    };