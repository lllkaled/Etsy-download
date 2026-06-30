/* =========================================================
   1. PRODUCT CATALOG
   -----------------------------------------------------------
   To add a NEW product, just add a new entry below.
   No HTML editing required — ever.

   key          -> matches the ?product= value in the URL
   title        -> shown as the page heading
   image        -> path to the product image (see /assets/products)
   downloadUrl  -> the Google Drive (or other) link customers
                   land on after verifying their email
========================================================= */
const PRODUCTS = {

  shopify: {
    title: "Shopify Starter Theme Kit",
    image: "assets/products/shopify.jpg",
    downloadUrl: "https://drive.google.com/drive/folders/PASTE_SHOPIFY_FOLDER_ID"
  },

  canva: {
    title: "Canva Content Calendar Templates",
    image: "assets/products/canva.jpg",
    downloadUrl: "https://drive.google.com/drive/folders/PASTE_CANVA_FOLDER_ID"
  },

  capcut: {
    title: "CapCut Reels Template Pack",
    image: "assets/products/capcut.jpg",
    downloadUrl: "https://drive.google.com/drive/folders/PASTE_CAPCUT_FOLDER_ID"
  },

  // wedding-planner: {
  //   title: "Nikah & Ceremony Wedding Planner",
  //   image: "assets/products/wedding-planner.jpg",
  //   downloadUrl: "https://drive.google.com/drive/folders/PASTE_FOLDER_ID"
  // },

};

/* =========================================================
   2. CONFIG — paste your deployed Google Apps Script URL here
========================================================= */
const APPS_SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

/* =========================================================
   3. APP LOGIC
========================================================= */
(function () {
  const els = {
    loading:  document.getElementById("state-loading"),
    notfound: document.getElementById("state-notfound"),
    main:     document.getElementById("state-main"),
    productImage: document.getElementById("product-image"),
    productTitle: document.getElementById("product-title"),
    form:        document.getElementById("access-form"),
    emailInput:  document.getElementById("email"),
    emailField:  null, // set below
    consent:     document.getElementById("consent"),
    submitBtn:   document.getElementById("submit-btn"),
    formError:   document.getElementById("form-error"),
    successBlock: document.getElementById("success-block"),
    downloadBtn:  document.getElementById("download-btn"),
  };
  els.emailField = els.emailInput.closest(".field");

  function show(el) { el.classList.remove("hidden"); }
  function hide(el) { el.classList.add("hidden"); }

  function getProductFromURL() {
    const params = new URLSearchParams(window.location.search);
    const key = (params.get("product") || "").trim().toLowerCase();
    return { key, product: PRODUCTS[key] || null };
  }

  function isValidEmail(value) {
    // simple, reliable RFC-5322-ish check
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function setSubmitting(isSubmitting) {
    els.submitBtn.disabled = isSubmitting;
    els.submitBtn.querySelector(".btn-label").textContent = isSubmitting
      ? "Sending…"
      : "Access My Files";
    const spinner = els.submitBtn.querySelector(".btn-spinner");
    isSubmitting ? show(spinner) : hide(spinner);
  }

  function showSuccess(downloadUrl) {
    hide(els.form);
    els.downloadBtn.href = downloadUrl;
    show(els.successBlock);
  }

  async function submitToAppsScript(payload) {
    // Apps Script web apps don't support CORS preflight requests,
    // so we send a simple "text/plain" POST (no custom headers)
    // which the browser treats as a simple request and Apps
    // Script can still parse via e.postData.contents.
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });

    // Apps Script returns JSON like { "result": "success" }
    let data = null;
    try { data = await response.json(); } catch (e) { /* ignore */ }

    if (!response.ok || (data && data.result === "error")) {
      throw new Error((data && data.message) || "Request failed");
    }
    return data;
  }

  function init() {
    const { key, product } = getProductFromURL();

    if (!product) {
      hide(els.loading);
      show(els.notfound);
      return;
    }

    els.productImage.src = product.image;
    els.productImage.alt = product.title;
    els.productTitle.textContent = product.title;
    document.title = product.title + " — Access Your Files";

    hide(els.loading);
    show(els.main);

    els.form.addEventListener("submit", async function (e) {
      e.preventDefault();
      hide(els.formError);

      const email = els.emailInput.value.trim();
      const valid = isValidEmail(email);
      els.emailField.classList.toggle("invalid", !valid);
      els.emailInput.classList.toggle("invalid", !valid);
      if (!valid) {
        els.emailInput.focus();
        return;
      }

      setSubmitting(true);

      const payload = {
        email: email,
        product: product.title,
        productKey: key,
        consent: els.consent.checked ? "Yes" : "No",
        timestamp: new Date().toISOString(),
      };

      try {
        if (
          APPS_SCRIPT_URL &&
          !APPS_SCRIPT_URL.includes("PASTE_YOUR_GOOGLE_APPS_SCRIPT")
        ) {
          await submitToAppsScript(payload);
        }
        showSuccess(product.downloadUrl);
      } catch (err) {
        console.error(err);
        setSubmitting(false);
        show(els.formError);
        return;
      }

      setSubmitting(false);
    });

    // live-clear the error state once they start fixing the email
    els.emailInput.addEventListener("input", function () {
      if (els.emailField.classList.contains("invalid") && isValidEmail(els.emailInput.value.trim())) {
        els.emailField.classList.remove("invalid");
        els.emailInput.classList.remove("invalid");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
