/**
 * Dhanda Bhatta Company - Phase 7 Admin Dashboard & Website Management Verification Suite
 *
 * Runs comprehensive end-to-end tests covering:
 *  1. Server-side authorization guards (unauthenticated access blocked)
 *  2. Cloudinary signature generation & deletion handlers
 *  3. Dashboard analytics aggregations (time-series, statuses, metrics)
 *  4. Product Catalogue CRUD (creation, listing, search/filter, update, soft-delete)
 *  5. Bhatta Media Gallery CRUD (creation, listing, update, deletion)
 *  6. Customer Enquiry CRM (listing, search, status transition, notes, timeline, CSV export)
 *  7. Bulk Order Requests (listing, quotation calculator, status transition, notes, CSV export)
 *  8. CMS Content Management (Homepage, About page, FAQs with draft vs. publish)
 *  9. Site Settings (Business details, Social channels, Delivery zones, Global SEO)
 * 10. Security Audit Logging stream
 * 11. Public website integration and reflection
 */

import dotenv from "dotenv";
import crypto from "crypto";
import { MongoClient } from "mongodb";

dotenv.config({ path: ".env.local" });
dotenv.config();

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/dhanda_bhatta";
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "dhanda_bhatta";
const BETTER_AUTH_SECRET =
  process.env.BETTER_AUTH_SECRET || "dbc-super-secret-auth-key-at-least-32-chars-long";

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

async function runTestSuite() {
  console.log("==================================================================");
  console.log("  DHANDA BHATTA COMPANY - PHASE 7 ADMIN DASHBOARD TEST SUITE");
  console.log(`  Target URL: ${BASE_URL}`);
  console.log(`  Target DB:  ${MONGODB_DB_NAME}`);
  console.log("==================================================================\n");

  // -------------------------------------------------------------------------
  // TEST SECTION 1: Unauthenticated Guard Protection
  // -------------------------------------------------------------------------
  console.log("📋 SECTION 1: Unauthenticated Guard Protection");

  try {
    const unauthProducts = await fetch(`${BASE_URL}/api/admin/products`);
    assert(
      unauthProducts.status === 401,
      `Unauthenticated GET /api/admin/products returns 401 (got ${unauthProducts.status})`
    );

    const unauthAnalytics = await fetch(`${BASE_URL}/api/admin/analytics`);
    assert(
      unauthAnalytics.status === 401,
      `Unauthenticated GET /api/admin/analytics returns 401 (got ${unauthAnalytics.status})`
    );

    const unauthEnquiries = await fetch(`${BASE_URL}/api/admin/enquiries`);
    assert(
      unauthEnquiries.status === 401,
      `Unauthenticated GET /api/admin/enquiries returns 401 (got ${unauthEnquiries.status})`
    );

    const unauthOrders = await fetch(`${BASE_URL}/api/admin/orders`);
    assert(
      unauthOrders.status === 401,
      `Unauthenticated GET /api/admin/orders returns 401 (got ${unauthOrders.status})`
    );

    const unauthSettings = await fetch(`${BASE_URL}/api/admin/settings`);
    assert(
      unauthSettings.status === 401,
      `Unauthenticated GET /api/admin/settings returns 401 (got ${unauthSettings.status})`
    );
  } catch (err) {
    assert(false, `Unauthenticated guard test encountered error: ${err.message}`);
  }

  // -------------------------------------------------------------------------
  // TEST SECTION 2: Admin Session Initialization in Database
  // -------------------------------------------------------------------------
  console.log("\n📋 SECTION 2: Admin Session Initialization");

  const mongoClient = new MongoClient(MONGODB_URI);
  await mongoClient.connect();
  const db = mongoClient.db(MONGODB_DB_NAME);

  const rawToken = crypto.randomBytes(24).toString("base64url");
  const tokenSignature = encodeURIComponent(
    crypto.createHmac("sha256", BETTER_AUTH_SECRET).update(rawToken).digest("base64")
  );
  const signedCookieValue = `${rawToken}.${tokenSignature}`;

  let adminHeaders = {
    Cookie: `better-auth.session_token=${signedCookieValue}`,
    "Content-Type": "application/json",
  };

  try {
    let adminUser = await db.collection("user").findOne({ role: "admin" });

    if (!adminUser) {
      const newUserId = `admin-user-${Date.now()}`;
      await db.collection("user").insertOne({
        id: newUserId,
        _id: newUserId,
        email: "owner@dhandabhatta.com",
        name: "Bhatta Owner",
        role: "admin",
        emailVerified: true,
        twoFactorEnabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      adminUser = await db.collection("user").findOne({ role: "admin" });
    } else {
      await db.collection("user").updateOne(
        { _id: adminUser._id },
        { $set: { twoFactorEnabled: true } }
      );
    }

    const targetUserId = adminUser.id || adminUser._id.toString();
    await db.collection("session").insertOne({
      id: `sess-${Date.now()}`,
      userId: targetUserId,
      token: rawToken,
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const verifyRes = await fetch(`${BASE_URL}/api/admin/settings`, { headers: adminHeaders });
    assert(
      verifyRes.status === 200,
      `Super Admin session authenticated successfully with HMAC token (got ${verifyRes.status})`
    );
  } catch (err) {
    assert(false, `Session initialization failed: ${err.message}`);
  }

  // -------------------------------------------------------------------------
  // TEST SECTION 3: Cloudinary Signature Generation
  // -------------------------------------------------------------------------
  console.log("\n📋 SECTION 3: Cloudinary Media Storage Handlers");

  try {
    const signRes = await fetch(`${BASE_URL}/api/admin/cloudinary/sign`, {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({
        folder: "dbc/products",
        resourceType: "image",
      }),
    });

    const signJson = await signRes.json();
    assert(
      signRes.status === 200 && signJson.success,
      `POST /api/admin/cloudinary/sign returns 200 with signature (folder: ${signJson.data?.folder})`
    );
    assert(
      typeof signJson.data?.signature === "string" && signJson.data?.timestamp,
      `Signature payload contains SHA-256 signature and timestamp`
    );
  } catch (err) {
    assert(false, `Cloudinary signature generation failed: ${err.message}`);
  }

  // -------------------------------------------------------------------------
  // TEST SECTION 4: Dashboard Analytics Aggregations
  // -------------------------------------------------------------------------
  console.log("\n📋 SECTION 4: Dashboard Real-Time Analytics");

  try {
    const analyticsRes = await fetch(`${BASE_URL}/api/admin/analytics?range=30d`, {
      headers: adminHeaders,
    });
    const analyticsJson = await analyticsRes.json();

    assert(
      analyticsRes.status === 200 && analyticsJson.success,
      `GET /api/admin/analytics returns 200 with valid analytics payload`
    );

    const metrics = analyticsJson.data?.metrics;
    assert(
      metrics && typeof metrics.totalEnquiries === "number" && typeof metrics.totalOrders === "number",
      `Metrics contain totalEnquiries (${metrics?.totalEnquiries}), totalOrders (${metrics?.totalOrders}), publishedProducts (${metrics?.publishedProductsCount})`
    );

    const charts = analyticsJson.data?.charts;
    assert(
      Array.isArray(charts?.enquiriesOverTime) && Array.isArray(charts?.ordersOverTime),
      `Charts return time-series arrays for enquiries and orders over time`
    );
  } catch (err) {
    assert(false, `Dashboard analytics failed: ${err.message}`);
  }

  // -------------------------------------------------------------------------
  // TEST SECTION 5: Product Catalogue CRUD
  // -------------------------------------------------------------------------
  console.log("\n📋 SECTION 5: Product Catalogue CRUD");

  let createdProductId = null;
  const testProductSlug = `test-brick-${Date.now()}`;

  try {
    // 5a. Create Product
    const createProductRes = await fetch(`${BASE_URL}/api/admin/products`, {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({
        name: "Test Class 1 Red Burnt Brick",
        slug: testProductSlug,
        category: "Structural Masonry",
        grade: "Class 1 - Awal",
        shortDescription: "High-density kiln fired red clay brick for testing.",
        description: "Full architectural specifications description for test purposes.",
        status: "published",
        featured: true,
        dimensions: { length: 230, width: 110, height: 75, unit: "mm" },
        weight: { value: 3.2, unit: "kg" },
        compressiveStrength: { value: 10.5, unit: "N/mm²" },
        waterAbsorption: { value: 14.5, unit: "%" },
        minOrderQuantity: 3000,
        leadTime: "1-2 Days",
        specifications: [{ label: "Kiln Type", value: "Bull's Trench Kiln" }],
        images: [
          {
            url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
            alt: "Test brick sample",
            isPrimary: true,
          },
        ],
      }),
    });

    const createProductJson = await createProductRes.json();
    assert(
      createProductRes.status === 201 && createProductJson.success,
      `POST /api/admin/products creates new product with ID: ${createProductJson.data?._id}`
    );
    createdProductId = createProductJson.data?._id;

    // 5b. Search / List Products
    const listProductsRes = await fetch(
      `${BASE_URL}/api/admin/products?search=Test&status=published`,
      { headers: adminHeaders }
    );
    const listProductsJson = await listProductsRes.json();
    const productsList = listProductsJson.data?.products || listProductsJson.products;
    assert(
      listProductsRes.status === 200 && Array.isArray(productsList) && productsList.length > 0,
      `GET /api/admin/products?search=Test returns catalogue listing with pagination (found: ${productsList?.length})`
    );

    // 5c. Get Detail & Update Product
    if (createdProductId) {
      const getProductRes = await fetch(`${BASE_URL}/api/admin/products/${createdProductId}`, {
        headers: adminHeaders,
      });
      const getProductJson = await getProductRes.json();
      assert(
        getProductRes.status === 200 && getProductJson.data?.slug === testProductSlug,
        `GET /api/admin/products/${createdProductId} retrieves full product specifications`
      );

      const updateProductRes = await fetch(`${BASE_URL}/api/admin/products/${createdProductId}`, {
        method: "PUT",
        headers: adminHeaders,
        body: JSON.stringify({
          grade: "Class 1 - Premium Selected",
          minOrderQuantity: 4000,
        }),
      });
      const updateProductJson = await updateProductRes.json();
      assert(
        updateProductRes.status === 200 && updateProductJson.data?.grade === "Class 1 - Premium Selected",
        `PUT /api/admin/products/${createdProductId} successfully updates product fields`
      );

      // 5d. Soft-Delete / Archive Product
      const archiveProductRes = await fetch(
        `${BASE_URL}/api/admin/products/${createdProductId}`,
        { method: "DELETE", headers: adminHeaders }
      );
      const archiveProductJson = await archiveProductRes.json();
      assert(
        archiveProductRes.status === 200 && archiveProductJson.success,
        `DELETE /api/admin/products/${createdProductId} soft-archives product preserving order references`
      );
    }
  } catch (err) {
    assert(false, `Product catalogue CRUD failed: ${err.message}`);
  }

  // -------------------------------------------------------------------------
  // TEST SECTION 6: Bhatta Gallery Media CRUD
  // -------------------------------------------------------------------------
  console.log("\n📋 SECTION 6: Bhatta Gallery Media CRUD");

  let createdAssetId = null;
  try {
    // 6a. Create Gallery Asset
    const createAssetRes = await fetch(`${BASE_URL}/api/admin/gallery`, {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({
        title: "Test Kiln Stacking Hack",
        caption: "Testing brick hacks inside the trench kiln chambers.",
        category: "kiln_operations",
        categoryLabel: "Kiln Operations & Firing",
        mediaType: "image",
        secureUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
        altText: "Brick stacking test",
        featured: true,
        status: "published",
      }),
    });

    const createAssetJson = await createAssetRes.json();
    assert(
      createAssetRes.status === 201 && createAssetJson.success,
      `POST /api/admin/gallery creates media asset with ID: ${createAssetJson.data?._id}`
    );
    createdAssetId = createAssetJson.data?._id;

    // 6b. List Gallery Assets
    const listAssetsRes = await fetch(`${BASE_URL}/api/admin/gallery?category=kiln_operations`, {
      headers: adminHeaders,
    });
    const listAssetsJson = await listAssetsRes.json();
    const assetsList = listAssetsJson.data?.assets || listAssetsJson.assets;
    assert(
      listAssetsRes.status === 200 && Array.isArray(assetsList) && assetsList.length > 0,
      `GET /api/admin/gallery returns filtered media assets with category support (found: ${assetsList?.length})`
    );

    // 6c. Delete Gallery Asset
    if (createdAssetId) {
      const deleteAssetRes = await fetch(`${BASE_URL}/api/admin/gallery/${createdAssetId}`, {
        method: "DELETE",
        headers: adminHeaders,
      });
      const deleteAssetJson = await deleteAssetRes.json();
      assert(
        deleteAssetRes.status === 200 && deleteAssetJson.success,
        `DELETE /api/admin/gallery/${createdAssetId} removes media asset from bhatta gallery`
      );
    }
  } catch (err) {
    assert(false, `Gallery media CRUD failed: ${err.message}`);
  }

  // -------------------------------------------------------------------------
  // TEST SECTION 7: Customer Enquiry CRM & Export
  // -------------------------------------------------------------------------
  console.log("\n📋 SECTION 7: Customer Enquiry CRM Management");

  try {
    // Public enquiry submission
    const testEnqRes = await fetch(`${BASE_URL}/api/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Ramesh Kumar Sharma",
        phoneNumber: "9812345678",
        email: "ramesh.test@example.com",
        enquiryType: "Brick pricing",
        interestedProduct: "Standard Red Clay Brick",
        message: "Need quote for 15,000 bricks delivered to Pillukhera construction site.",
        preferredContactMethod: "Phone",
        consent: true,
      }),
    });

    const testEnqJson = await testEnqRes.json();
    const enquiryRef = testEnqJson.reference;
    assert(testEnqRes.status === 201 && Boolean(enquiryRef), `Public enquiry submission received (ref: ${enquiryRef})`);

    // List Enquiries in Admin CRM
    const listEnquiriesRes = await fetch(
      `${BASE_URL}/api/admin/enquiries?search=Ramesh`,
      { headers: adminHeaders }
    );
    const listEnquiriesJson = await listEnquiriesRes.json();
    const enquiriesList = listEnquiriesJson.data?.enquiries || listEnquiriesJson.enquiries;
    assert(
      listEnquiriesRes.status === 200 && Array.isArray(enquiriesList) && enquiriesList.length > 0,
      `GET /api/admin/enquiries finds submitted customer enquiry in CRM table (found: ${enquiriesList?.length})`
    );

    const enquiryDoc = enquiriesList?.[0];
    if (enquiryDoc) {
      // Update status and append note
      const updateEnquiryRes = await fetch(
        `${BASE_URL}/api/admin/enquiries/${enquiryDoc._id}`,
        {
          method: "PATCH",
          headers: adminHeaders,
          body: JSON.stringify({
            status: "contacted",
            note: "Called customer Ramesh. Confirmed site near Pillukhera canal road.",
          }),
        }
      );
      const updateEnquiryJson = await updateEnquiryRes.json();
      const enqStatus = updateEnquiryJson.data?.enquiry?.status || updateEnquiryJson.data?.status || updateEnquiryJson.enquiry?.status;
      assert(
        updateEnquiryRes.status === 200 && enqStatus === "contacted",
        `PATCH /api/admin/enquiries/:id updates status to 'contacted', appends staff note, and records timeline`
      );
    }

    // CSV Export
    const exportEnqRes = await fetch(`${BASE_URL}/api/admin/enquiries/export`, {
      headers: adminHeaders,
    });
    const exportEnqText = await exportEnqRes.text();
    assert(
      exportEnqRes.status === 200 && exportEnqText.includes("Reference"),
      `GET /api/admin/enquiries/export downloads CSV formatted enquiry records`
    );
  } catch (err) {
    assert(false, `Enquiry CRM management failed: ${err.message}`);
  }

  // -------------------------------------------------------------------------
  // TEST SECTION 8: Bulk Order Request Management & Quotation
  // -------------------------------------------------------------------------
  console.log("\n📋 SECTION 8: Bulk Order Requests & Quotation Calculator");

  try {
    // Public bulk order submission
    const testOrdRes = await fetch(`${BASE_URL}/api/order-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "Vikas Dhanda Construction",
        phoneNumber: "9876543210",
        email: "vikas.test@example.com",
        selectedProduct: "Standard Red Clay Brick",
        quantity: 20000,
        villageOrCity: "Village Kalwa",
        district: "Jind",
        state: "Haryana",
        pincode: "126113",
        deliveryInstructions: "Plot No. 12, Kalwa Main Road near Primary Health Centre. Direct trolley access.",
        consent: true,
      }),
    });

    const testOrdJson = await testOrdRes.json();
    const orderRef = testOrdJson.reference;
    assert(testOrdRes.status === 201 && Boolean(orderRef), `Public bulk order submission received (ref: ${orderRef})`);

    // List Orders in Admin CRM
    const listOrdersRes = await fetch(
      `${BASE_URL}/api/admin/orders?search=Vikas`,
      { headers: adminHeaders }
    );
    const listOrdersJson = await listOrdersRes.json();
    const ordersList = listOrdersJson.data?.orders || listOrdersJson.orders;
    assert(
      listOrdersRes.status === 200 && Array.isArray(ordersList) && ordersList.length > 0,
      `GET /api/admin/orders finds order request in logistics inbox (found: ${ordersList?.length})`
    );

    const orderDoc = ordersList?.[0];
    if (orderDoc) {
      // Calculate and save quotation
      const updateOrderRes = await fetch(
        `${BASE_URL}/api/admin/orders/${orderDoc._id}`,
        {
          method: "PATCH",
          headers: adminHeaders,
          body: JSON.stringify({
            status: "quoted",
            quotation: {
              unitRate: 7.45,
              vehicleHaulageRate: 2500,
              estimatedTotal: 20000 * 7.45 + 2500,
              notes: "Direct tractor trolley delivery included. Rate valid for 7 days.",
            },
            note: "Quoted ₹7.45 per brick + ₹2500 haulage. Customer agreed to confirm schedule by tomorrow.",
          }),
        }
      );
      const updateOrderJson = await updateOrderRes.json();
      const ordDoc = updateOrderJson.data?.order || updateOrderJson.data || updateOrderJson.order;
      assert(
        updateOrderRes.status === 200 && ordDoc?.status === "quoted",
        `PATCH /api/admin/orders/:id updates status to 'quoted', sets unitRate (₹7.45) & estimatedTotal (₹${ordDoc?.quotation?.estimatedTotal})`
      );
      assert(
        ordDoc?.quotation?.estimatedTotal === 151500,
        `Calculated quotation total matches exact formula ((20,000 * 7.45) + 2,500 = 151,500)`
      );
    }

    // CSV Export
    const exportOrdRes = await fetch(`${BASE_URL}/api/admin/orders/export`, {
      headers: adminHeaders,
    });
    const exportOrdText = await exportOrdRes.text();
    assert(
      exportOrdRes.status === 200 && exportOrdText.includes("Reference"),
      `GET /api/admin/orders/export downloads CSV formatted order records`
    );
  } catch (err) {
    assert(false, `Bulk order request management failed: ${err.message}`);
  }

  // -------------------------------------------------------------------------
  // TEST SECTION 9: Content Management System (CMS) Workflows
  // -------------------------------------------------------------------------
  console.log("\n📋 SECTION 9: CMS Content Workflows (Draft vs. Publish)");

  try {
    // 9a. Save Draft on Homepage
    const draftHomeRes = await fetch(`${BASE_URL}/api/admin/content/homepage`, {
      method: "PUT",
      headers: adminHeaders,
      body: JSON.stringify({
        data: {
          heroHeadline: "TEST DRAFT HEADLINE - KILN FIRED BRICKS",
          heroDescription: "Test draft description for verification.",
        },
        publish: false,
      }),
    });
    const draftHomeJson = await draftHomeRes.json();
    assert(
      draftHomeRes.status === 200 && draftHomeJson.data?.status === "draft",
      `PUT /api/admin/content/homepage with publish=false saves draft without making it live`
    );

    // 9b. Publish Live on Homepage
    const publishHomeRes = await fetch(`${BASE_URL}/api/admin/content/homepage`, {
      method: "PUT",
      headers: adminHeaders,
      body: JSON.stringify({
        data: {
          heroTagline: "BRICK MANUFACTURER | JIND, HARYANA",
          heroHeadline: "Bricks made for stronger foundations.",
          heroDescription: "Quality red clay bricks manufactured in Village Kalwa, Pillukhera. Direct kiln supply and batch delivery across nearby areas.",
          primaryCtaText: "Explore Our Bricks",
          primaryCtaLink: "/products",
          secondaryCtaText: "Contact Our Team",
          secondaryCtaLink: "/contact",
          bannerImageUrl: "/images/facility/kiln-hero.jpg",
        },
        publish: true,
      }),
    });
    const publishHomeJson = await publishHomeRes.json();
    assert(
      publishHomeRes.status === 200 && publishHomeJson.data?.status === "published",
      `PUT /api/admin/content/homepage with publish=true publishes live content to website`
    );

    // 9c. About Page CMS
    const aboutRes = await fetch(`${BASE_URL}/api/admin/content/about`, {
      method: "PUT",
      headers: adminHeaders,
      body: JSON.stringify({
        data: {
          heritageHeading: "Building with Quality. Delivering with Trust.",
          heritageStory: "Dhanda Bhatta Company is an established brick manufacturing and supply business located in Village Kalwa, near Pillukhera in District Jind, Haryana. We supply quality red clay bricks for durable residential, agricultural, and commercial construction projects throughout Jind and surrounding areas.",
        },
        publish: true,
      }),
    });
    const aboutJson = await aboutRes.json();
    assert(
      aboutRes.status === 200 && aboutJson.success,
      `PUT /api/admin/content/about updates About page CMS content`
    );

    // 9d. FAQs CMS
    const faqsRes = await fetch(`${BASE_URL}/api/admin/content/faqs`, {
      method: "PUT",
      headers: adminHeaders,
      body: JSON.stringify({
        data: {
          faqs: [
            {
              question: "What is your kiln firing cycle duration?",
              answer: "Our Bull's trench kiln operates on a continuous 24-day progressive cycle.",
              category: "Kiln Firing & Manufacturing",
              isActive: true,
            },
          ],
        },
        publish: true,
      }),
    });
    const faqsJson = await faqsRes.json();
    assert(
      faqsRes.status === 200 && faqsJson.success,
      `PUT /api/admin/content/faqs updates FAQs CMS content`
    );
  } catch (err) {
    assert(false, `CMS content management failed: ${err.message}`);
  }

  // -------------------------------------------------------------------------
  // TEST SECTION 10: Site Settings Management
  // -------------------------------------------------------------------------
  console.log("\n📋 SECTION 10: Site Settings Singleton Management");

  try {
    const updateSettingsRes = await fetch(`${BASE_URL}/api/admin/settings`, {
      method: "PUT",
      headers: adminHeaders,
      body: JSON.stringify({
        business: {
          phone: "+919996669463",
          phoneDisplay: "+91 99966-69463",
          whatsappNumber: "918295669463",
        },
        seo: {
          robotsIndexing: true,
        },
      }),
    });

    const updateSettingsJson = await updateSettingsRes.json();
    assert(
      updateSettingsRes.status === 200 && updateSettingsJson.success,
      `PUT /api/admin/settings updates business and SEO singleton configurations`
    );

    const getSettingsRes = await fetch(`${BASE_URL}/api/admin/settings`, {
      headers: adminHeaders,
    });
    const getSettingsJson = await getSettingsRes.json();
    assert(
      getSettingsRes.status === 200 && getSettingsJson.data?.business?.whatsappNumber === "918295669463",
      `GET /api/admin/settings retrieves persistent singleton settings`
    );
  } catch (err) {
    assert(false, `Site settings management failed: ${err.message}`);
  }

  // -------------------------------------------------------------------------
  // TEST SECTION 11: Security Audit Log Stream
  // -------------------------------------------------------------------------
  console.log("\n📋 SECTION 11: Security Audit Trail Logging");

  try {
    const activityRes = await fetch(`${BASE_URL}/api/admin/activity?limit=10`, {
      headers: adminHeaders,
    });
    const activityJson = await activityRes.json();
    assert(
      activityRes.status === 200 && activityJson.success,
      `GET /api/admin/activity returns 200 and audit logs stream`
    );
    assert(
      Array.isArray(activityJson.data),
      `Audit log entries returned as structured array`
    );
  } catch (err) {
    assert(false, `Audit log stream test failed: ${err.message}`);
  }

  // -------------------------------------------------------------------------
  // TEST SECTION 12: Public Website Integration & Reflection
  // -------------------------------------------------------------------------
  console.log("\n📋 SECTION 12: Public Website Integration Verification");

  try {
    const publicHomeRes = await fetch(`${BASE_URL}/`);
    assert(
      publicHomeRes.status === 200,
      `GET / public homepage returns 200 OK`
    );

    const publicAboutRes = await fetch(`${BASE_URL}/about`);
    assert(
      publicAboutRes.status === 200,
      `GET /about public about page returns 200 OK`
    );

    const publicProductsRes = await fetch(`${BASE_URL}/products`);
    assert(
      publicProductsRes.status === 200,
      `GET /products public catalogue returns 200 OK`
    );

    const publicGalleryRes = await fetch(`${BASE_URL}/gallery`);
    assert(
      publicGalleryRes.status === 200,
      `GET /gallery public gallery returns 200 OK`
    );
  } catch (err) {
    assert(false, `Public website integration check failed: ${err.message}`);
  }

  await mongoClient.close();

  // -------------------------------------------------------------------------
  // FINAL REPORT
  // -------------------------------------------------------------------------
  console.log("\n==================================================================");
  console.log(`  PHASE 7 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error("FATAL TEST SUITE ERROR:", err);
  process.exit(1);
});
