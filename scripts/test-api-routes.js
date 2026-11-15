/**
 * Dhanda Bhatta Company - Comprehensive API Route Test Suite
 *
 * Tests Route Handlers on running server (http://localhost:3000):
 * - Health Check endpoint
 * - Public catalogue endpoints (read-only)
 * - Public enquiry submission (write-only)
 * - Public bulk order request submission (write-only)
 * - Security guards: 405 Method Not Allowed on forbidden verbs
 * - Anti-spam honeypot detection
 * - Zod schema validation errors
 */

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log(`=================================================`);
  console.log(`  DBC API INTEGRATION TEST SUITE`);
  console.log(`  Target: ${BASE_URL}`);
  console.log(`=================================================\n`);

  // 1. Health Check
  console.log("[1] Testing Health Endpoint (GET /api/health)");
  try {
    const res = await fetch(`${BASE_URL}/api/health`);
    const data = await res.json();
    assert(res.status === 200, `Status is 200 (Got ${res.status})`);
    assert(data.status === "healthy", `Status string is "healthy"`);
    assert(data.database && typeof data.database === "object", "Database status object returned");
  } catch (err) {
    assert(false, `Health check request failed: ${err.message}`);
  }

  // 2. Public Products
  console.log("\n[2] Testing Public Products (GET /api/public/products)");
  try {
    const res = await fetch(`${BASE_URL}/api/public/products`);
    const data = await res.json();
    assert(res.status === 200, `Status is 200 (Got ${res.status})`);
    assert(data.success === true, "success is true");
    assert(Array.isArray(data.data) && data.data.length > 0, `Returned ${data.data?.length} products`);
    assert(res.headers.get("cache-control")?.includes("s-maxage"), "Cache-Control header present");
  } catch (err) {
    assert(false, `Products request failed: ${err.message}`);
  }

  // 3. Single Product & 404
  console.log("\n[3] Testing Single Product Lookup");
  try {
    const resFound = await fetch(`${BASE_URL}/api/public/products/first-class-red-bricks`);
    const dataFound = await resFound.json();
    assert(resFound.status === 200, `Existing product returns 200`);
    assert(dataFound.data?.slug === "first-class-red-bricks", `Correct product slug returned`);

    const resNotFound = await fetch(`${BASE_URL}/api/public/products/non-existent-brick-xyz`);
    assert(resNotFound.status === 404, `Non-existent product returns 404`);
  } catch (err) {
    assert(false, `Product detail lookup failed: ${err.message}`);
  }

  // 4. Public Gallery
  console.log("\n[4] Testing Public Gallery (GET /api/public/gallery)");
  try {
    const res = await fetch(`${BASE_URL}/api/public/gallery`);
    const data = await res.json();
    assert(res.status === 200, `Status is 200`);
    assert(data.success === true, "success is true");
    assert(Array.isArray(data.data) && data.data.length > 0, `Returned ${data.data?.length} gallery assets`);
  } catch (err) {
    assert(false, `Gallery request failed: ${err.message}`);
  }

  // 5. Method Guards (405 Method Not Allowed)
  console.log("\n[5] Testing Security Guards (Reject forbidden HTTP verbs)");
  try {
    // GET /api/enquiries should be 405 (Customer enquiries must NEVER be publicly readable)
    const resEnquiryGet = await fetch(`${BASE_URL}/api/enquiries`);
    assert(resEnquiryGet.status === 405, `GET /api/enquiries returns 405 Method Not Allowed (Got ${resEnquiryGet.status})`);
    assert(resEnquiryGet.headers.get("allow")?.includes("POST"), `Allow header specifies POST`);

    // GET /api/order-requests should be 405
    const resOrderGet = await fetch(`${BASE_URL}/api/order-requests`);
    assert(resOrderGet.status === 405, `GET /api/order-requests returns 405 Method Not Allowed (Got ${resOrderGet.status})`);
    assert(resOrderGet.headers.get("allow")?.includes("POST"), `Allow header specifies POST`);

    // POST /api/public/products should be 405
    const resProductPost = await fetch(`${BASE_URL}/api/public/products`, { method: "POST" });
    assert(resProductPost.status === 405, `POST /api/public/products returns 405`);
  } catch (err) {
    assert(false, `Security guard check failed: ${err.message}`);
  }

  // 6. Enquiry Submission (POST /api/enquiries)
  console.log("\n[6] Testing Enquiry Submission (POST /api/enquiries)");
  try {
    // Valid submission
    const validEnquiry = {
      fullName: "Ramesh Sharma",
      phoneNumber: "9812345678",
      email: "ramesh@example.com",
      enquiryType: "Brick pricing",
      interestedProduct: "First Class Red Clay Bricks",
      message: "Looking for quote on 20,000 bricks delivered to Jind.",
      preferredContactMethod: "Phone",
      consent: true,
      website_hp: "",
    };

    const resValid = await fetch(`${BASE_URL}/api/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validEnquiry),
    });
    const dataValid = await resValid.json();
    assert(resValid.status === 201, `Valid enquiry returns 201 Created (Got ${resValid.status})`);
    assert(Boolean(dataValid.reference && dataValid.reference.startsWith("ENQ-")), `Generated reference ID: ${dataValid.reference}`);

    // Invalid submission (missing name and invalid phone)
    const invalidEnquiry = {
      fullName: "R",
      phoneNumber: "12345",
      enquiryType: "Brick pricing",
      message: "Short",
      consent: false,
    };
    const resInvalid = await fetch(`${BASE_URL}/api/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalidEnquiry),
    });
    assert(resInvalid.status === 400, `Invalid enquiry returns 400 Bad Request`);

    // Honeypot spam submission
    const spamEnquiry = {
      ...validEnquiry,
      website_hp: "http://spam-bot.xyz",
    };
    const resSpam = await fetch(`${BASE_URL}/api/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(spamEnquiry),
    });
    assert(resSpam.status === 400, `Honeypot filled returns 400 Spam Rejected`);
  } catch (err) {
    assert(false, `Enquiry submission test failed: ${err.message}`);
  }

  // 7. Bulk Order Request Submission (POST /api/order-requests)
  console.log("\n[7] Testing Order Request Submission (POST /api/order-requests)");
  try {
    const validOrder = {
      customerName: "Vikram Hooda",
      phoneNumber: "9876543210",
      email: "vikram@example.com",
      selectedProduct: "First Class Red Clay Bricks",
      quantity: 15000,
      villageOrCity: "Village Kalwa",
      district: "Jind",
      state: "Haryana",
      pincode: "126113",
      expectedDeliveryDate: "2026-12-01",
      deliveryInstructions: "Direct site unloading near primary school.",
      consent: true,
      website_hp: "",
    };

    const resOrder = await fetch(`${BASE_URL}/api/order-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validOrder),
    });
    const dataOrder = await resOrder.json();
    assert(resOrder.status === 201, `Valid order request returns 201 Created (Got ${resOrder.status})`);
    assert(Boolean(dataOrder.reference && dataOrder.reference.startsWith("ORD-")), `Generated reference ID: ${dataOrder.reference}`);
    assert(dataOrder.isRequestOnly === true, `isRequestOnly is true (request only, not automated sale)`);

    // Invalid order (quantity 0)
    const invalidOrder = {
      ...validOrder,
      quantity: 0,
    };
    const resInvalidOrder = await fetch(`${BASE_URL}/api/order-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalidOrder),
    });
    assert(resInvalidOrder.status === 400, `Invalid order quantity returns 400`);
  } catch (err) {
    assert(false, `Order request test failed: ${err.message}`);
  }

  console.log("\n=================================================");
  console.log(`  TEST RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
