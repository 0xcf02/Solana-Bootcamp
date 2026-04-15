import {
  banner,
  step,
  success,
  info,
  divider,
  keyValue,
} from "./helpers/display.js";

export async function main(): Promise<void> {
  banner("Lesson 12: x402 Micropayments");

  info('HTTP 402 "Payment Required" was defined in HTTP/1.1 (1997).');
  info('It was "reserved for future use" for nearly 30 years.');
  info("Solana finally makes it practical: $0.001/request, $0.00025 fees.\n");

  // ── Step 1: Protocol overview ──────────────────────────────────────

  step(1, "Understanding the x402 Protocol");
  info("x402 adds a payment layer to standard HTTP:\n");
  info("  Client                    Server");
  info("    |                         |");
  info("    |---- GET /weather ------>|");
  info("    |                         |");
  info("    |<--- 402 Payment --------|  <- price: $0.001");
  info("    |     Required            |     payTo: <address>");
  info("    |                         |     network: solana");
  info("    |                         |");
  info("    |  [sign payment off-chain]");
  info("    |                         |");
  info("    |---- GET /weather ------>|");
  info("    |     + X-PAYMENT header  |");
  info("    |                         |");
  info("    |<--- 200 OK ------------|  <- weather data!");
  info("    |     (payment settled)   |");
  info("");
  info("The key insight: the first request carries NO payment.");
  info("The server tells the client exactly what to pay, then the");
  info("client signs and retries — all automatically.");

  // ── Step 2: Server setup ───────────────────────────────────────────

  step(2, "Server Setup (Express + x402 middleware)");
  info("The server protects endpoints with a payment requirement:\n");
  console.log(
    [
      '    import express from "express";',
      '    import { paymentMiddleware } from "@x402/express";',
      "",
      "    const app = express();",
      '    const facilitatorUrl = "https://x402.org/facilitator";',
      '    const payTo = "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU";',
      "",
      "    // Any route behind this middleware requires payment",
      '    app.use("/weather", paymentMiddleware(',
      "      facilitatorUrl,",
      "      payTo,",
      "      {",
      "        maxDeadline: 60,        // payment valid for 60s",
      '        description: "Weather API call",',
      "        amount: 0.001,          // $0.001 USDC per request",
      '        network: "solana",',
      "      }",
      "    ));",
      "",
      '    app.get("/weather", (req, res) => {',
      "      // Only reached after payment is verified",
      '      res.json({ city: "Sao Paulo", temp: "28C", humidity: "65%" });',
      "    });",
    ].join("\n"),
  );

  info("\nThe middleware intercepts requests without valid payment");
  info("and returns 402 with payment instructions in the response body.");

  // ── Step 3: Client setup ───────────────────────────────────────────

  step(3, "Client Flow (automatic payment handling)");
  info("The client wraps fetch() to handle 402 responses automatically:\n");
  console.log(
    [
      '    import { wrapFetchWithPayment } from "@x402/svm";',
      '    import { Keypair } from "@solana/web3.js";',
      "",
      "    const wallet = Keypair.fromSecretKey(/* ... */);",
      '    const payingFetch = wrapFetchWithPayment(wallet, "solana");',
      "",
      "    // Looks like a normal fetch — payment is invisible",
      '    const response = await payingFetch("https://api.example.com/weather");',
      "    const data = await response.json();",
      '    console.log(data); // { city: "Sao Paulo", temp: "28C" }',
    ].join("\n"),
  );

  info("\nUnder the hood:");
  info("  1. fetch() sends GET without payment");
  info("  2. Server returns 402 with price + payment address");
  info("  3. Client signs a payment authorization (off-chain, no tx yet)");
  info("  4. Client retries with X-PAYMENT header");
  info("  5. Server verifies via facilitator, settles on-chain, returns data");

  // ── Step 4: Simulated flow ─────────────────────────────────────────

  step(4, "Simulating the HTTP Flow");

  info("--- Request 1: No payment attached ---\n");
  keyValue("Request", "GET /weather HTTP/1.1");
  keyValue("Host", "api.example.com");
  info("");
  keyValue("Response", "402 Payment Required");
  keyValue("Content-Type", "application/json");
  console.log(
    [
      "",
      "    {",
      '      "x402Version": 1,',
      '      "schemes": [{',
      '        "scheme": "exact",',
      '        "network": "solana",',
      '        "maxAmountRequired": "1000",',
      '        "resource": "https://api.example.com/weather",',
      '        "description": "Weather API call",',
      '        "mimeType": "application/json",',
      '        "payTo": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",',
      '        "maxDeadline": 60',
      "      }]",
      "    }",
    ].join("\n"),
  );

  divider();

  info("--- Client signs payment off-chain ---\n");
  keyValue("Scheme", "exact");
  keyValue("Amount", "1000 (0.001 USDC, 6 decimals)");
  keyValue("Signed by", "Client wallet keypair");
  info("");
  info("No on-chain transaction yet — just a cryptographic signature");
  info("proving the client authorizes this specific payment.");

  divider();

  info("--- Request 2: Payment header attached ---\n");
  keyValue("Request", "GET /weather HTTP/1.1");
  keyValue("Host", "api.example.com");
  keyValue("X-PAYMENT", "<base64-encoded-signed-payment-payload>");
  info("");
  keyValue("Response", "200 OK");
  console.log(
    [
      "",
      "    {",
      '      "city": "Sao Paulo",',
      '      "temp": "28C",',
      '      "humidity": "65%"',
      "    }",
    ].join("\n"),
  );

  info("\nThe facilitator settles the payment on Solana in the background.");
  info("The client gets data immediately — no waiting for confirmation.");

  // ── Step 5: Why it matters ─────────────────────────────────────────

  step(5, "Why This Matters");

  info("Traditional payments cannot handle micropayments:\n");
  keyValue("Stripe minimum", "$0.50 + 2.9% + $0.30 per charge");
  keyValue("PayPal minimum", "$0.01 + 2.9% + $0.30 per charge");
  keyValue("x402 on Solana", "$0.001 + ~$0.00025 fee (any amount)");
  info("");
  info("A $0.001 payment through Stripe costs $0.30 in fees (30,000%).");
  info("The same payment on Solana costs $0.00025 in fees (25%).");

  divider();

  info("What changes with x402:\n");
  info("  No wallet popups   - payment is automatic and invisible");
  info("  No subscriptions   - pay only for what you use");
  info("  No API keys        - your wallet IS your identity");
  info("  No minimums        - charge $0.0001 if you want");
  info("  No chargebacks     - blockchain settlement is final");

  divider();

  info("Use cases:\n");
  info("  Pay-per-article    - news sites without paywalls");
  info("  API monetization   - charge per call, no key management");
  info("  AI inference       - per-token billing for LLM APIs");
  info("  IoT data markets   - sensors selling readings directly");
  info("  Content tipping    - micropay creators per view");
  info("  Rate limiting      - economic spam prevention");

  // ── Step 6: The bigger picture ─────────────────────────────────────

  step(6, "The Bigger Picture");

  info("x402 is not just a payment protocol — it is a new HTTP primitive.\n");
  info("Every URL becomes a potential payment endpoint.");
  info("Every wallet becomes a potential customer.");
  info("Every server becomes a potential merchant.\n");
  info("The web was built with a payment status code from day one.");
  info("It took blockchain to make it useful.");

  divider();

  success('x402 turns HTTP 402 from "reserved" to "revolutionary".\n');
  info("Resources:");
  keyValue("Protocol spec", "https://www.x402.org/");
  keyValue(
    "Solana guide",
    "https://solana.com/developers/guides/getstarted/intro-to-x402",
  );
  keyValue("GitHub", "https://github.com/coinbase/x402");
  info("");
}

main().catch(console.error);
