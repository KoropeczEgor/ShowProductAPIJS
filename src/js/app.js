"use strict";
window.addEventListener("DOMContentLoaded", async () => {
  const BASE_URL = "http://api.valantis.store:40000/";
  const _apiKey = "Valantis";
  const _date = new Date().toISOString().replace(/-/g, "").split("T")[0];
  const password = md5(`${_apiKey}_${_date}`);
  const left = document.querySelector(".left");
  const right = document.querySelector(".right");
  const loading = document.querySelector(".loading");
  let isLoading;
  let offset = 0;
  const offsetCount = 50;

  trigerLoading(true);
  const products = await getProduct();

  trigerLoading(false);
  function trigerLoading(triger) {
    if (triger) {
      isLoading = true;
      loading.style.display = "flex";
      return;
    }
    isLoading = false;
    loading.style.display = "none";
  }
  left.addEventListener("click", async () => {
    if (offset === 0) return;
    offset -= offsetCount;
    trigerLoading(true);
    await getProduct();
    trigerLoading(false);
  });

  right.addEventListener("click", async () => {
    if (products?.result.length < offsetCount) return;
    offset += offsetCount;
    trigerLoading(true);
    await getProduct();
    trigerLoading(false);
  });

  async function apiRequest(url, body) {
    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth": password,
        },
        body: JSON.stringify(body),
      });
      const data = await resp.json();

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async function getProduct() {
    const bodyIds = {
      action: "get_ids",
      params: { offset, limit: offsetCount },
    };
    const respData = await apiRequest(BASE_URL, bodyIds);

    const bodyItems = {
      action: "get_items",
      params: { ids: respData.result },
    };
    const products = await apiRequest(BASE_URL, bodyItems);
    showProduct(products);
    return products;
  }

  function showProduct(data) {
    const productsEl = document.querySelector(".products");

    data?.result.forEach((product) => {
      const productEl = document.createElement("div");
      productEl.classList.add("product");
      productEl.innerHTML = `
      <div id="${product.id}" class="product-card">
      <h3>${(() => {
        if (product.brand === null) {
          return "Goold";
        } else {
          return product.brand;
        }
      })()}</h3>
      <p>${product.price}</p>
      <p>${product.product}</p>
      </div>
      
      `;
      productsEl.appendChild(productEl);
    });
  }
});
