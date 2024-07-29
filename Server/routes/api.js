const axios = require('axios');
const https = require("https");
const { Checkout } = require("checkout-sdk-node");
const fs = require("fs");
var express = require("express");
var path = require("path");
var router = express.Router();
const ckoAPI = 'https://api.sandbox.checkout.com/'; // Replace with the correct API endpoint
const ckoSK = 'sbox_fml2lnajshvyzujlntuunbg7iay'; // Replace with your Checkout.com secret key

//var cko = new Checkout("sk_sbox_fml2lnajshvyzujlntuunbg7iay",{pk:"pk_sbox_mbqioufmvwkamz3jjewh7o5aji#"});

// Display the HTML page by default
router.get("/", (request, response) => {
  console.log(`lala`);
  response.sendFile(path.join(__dirname, "../index.html"));
});

//Validate the Apple Pay session
router.post("/validateSession", async (request, response) => {
    console.log("/validateSession")
    // Get the URL from the front end
    const { appleUrl } = request.body;

    try {
        let httpsAgent = new https.Agent({
            rejectUnauthorized: false,
            cert: await fs.promises.readFile(
                path.join(__dirname, "../Certificates/certificate_sandbox.pem")
            ),
            key: await fs.promises.readFile(
                path.join(__dirname, "../Certificates/certificate_sandbox.key")
            )
        });

        let axiosResponse = await axios.post(
            "https://apple-pay-gateway.apple.com/paymentservices/paymentSession",
            {
                merchantIdentifier: "merchant.com.xuqinxintestdomain.sandbox",
                domainName: "xuqinxin823-github-io.onrender.com",
                displayName: "merchant id for test environment"
            },
            {
                httpsAgent
            }
        );

        console.log(axiosResponse.data);
        response.send(axiosResponse.data);
    } catch (error) {
        console.error('Error:', error);
        response.status(500).send(error);
    }
});

router.post("/pay", async (request, response) => {
    console.log("/pay");
    const { version, data, signature, header } = request.body.token.paymentData;
    console.error(version);

    try {
        // Request an Apple Pay token
        let checkoutTokenResponse = await axios.post(`${ckoAPI}/tokens`, {
            method: 'POST',
            headers: {
                'Authorization': `sk_${ckoSK}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: "applepay",
                token_data: {
                    version: version,
                    data: data,
                    signature: signature,
                    header: {
                        ephemeralPublicKey: header.ephemeralPublicKey,
                        publicKeyHash: header.publicKeyHash,
                        transactionId: header.transactionId
                    }
                }
            })
        });

        if (!checkoutTokenResponse.ok) {
            throw new Error(`Error creating token: ${checkoutTokenResponse.statusText}`);
        }

        let checkoutToken = await checkoutTokenResponse.json();

        // Process the payment
        let paymentResponse = await axios.post(`${ckoAPI}/payments`, {
            method: 'POST',
            headers: {
                'Authorization': `sk_${ckoSK}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                source: {
                    token: checkoutToken.token_data
                },
                amount: 1000,
                currency: "USD"
            })
        });


// router.post("/pay", async (request, response) => {
//     // Get the URL from the front end
//     const { version, data, signature, header } = request.body.token.paymentData;

//     let checkoutToken = await cko.tokens.request({
//         type: "applepay",
//         token_data:{
//          version: version,
//          data: data,
//          signature: signature,
//          header:{
//               ephemeralPublicKey: header.ephemeralPublicKey,
//               publicKeyHash: header.publicKeyHash,
//               transactionId: header.transactionId
//          }
//         }
//     });

//     const payment = await cko.payments.request({
//     source:{
//         token: checkoutToken.token_data
//     },
//         amount: 1000,
//         currency: "USD"
//     });
        if (!paymentResponse.ok) {
            throw new Error(`Error processing payment: ${paymentResponse.statusText}`);
        }

        let payment = await paymentResponse.json();
        console.log(payment);
        response.send(payment);
    } catch (error) {
        console.error('Error:', error);
        response.status(500).send(error.message);
}
}
);

module.exports = router;