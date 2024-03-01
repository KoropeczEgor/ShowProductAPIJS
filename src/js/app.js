const BASE_URL = "http://api.valantis.store:40000/";
const left = document.querySelector(".left");
const right = document.querySelector(".right");
let offset = 0;
const offsetCount = 50;

left.addEventListener("click", () => {
  if (offset === 0) {
    offset;
  } else {
    offset -= offsetCount;
  }

  getProduct();
});
right.addEventListener("click", () => {
  offset += offsetCount;
  getProduct();
});

getProduct();

async function apiRequest(url, body) {
  const _apiKey = "Valantis";
  const _date = new Date().toISOString().replace(/-/g, "").split("T")[0];
  const password = md5(`${_apiKey}_${_date}`);

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
}
async function getProduct() {
  const bodyIds = {
    action: "get_ids",
    params: { offset, limit: 1000 },
  };
  const respData = await apiRequest(BASE_URL, bodyIds);

  const bodyItems = {
    action: "get_items",
    params: { ids: respData.result },
  };
  const items = await apiRequest(BASE_URL, bodyItems);
  showProduct(items);
}

function showProduct(data, rowPerPage, page) {
  const productsEl = document.querySelector(".products");
  document.querySelector(".products").innerHTML = "";

  data.result.forEach((product) => {
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
