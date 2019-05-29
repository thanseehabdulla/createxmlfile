let fs = require('fs');
const fetch = require("node-fetch");

let brands = []
let categories = []
let productSets = []
let lastModified;


async function f() {

await fetch('https://uatapi.twinning.com/catalog-service/v1/en-us/sitemapvalues')
.then(function(response) {
  return response.json();
})
.then(function(result) {
  
  let data =  result.data
  brands = data.brands
  categories = data.categories
  productSets = data.productSets
  lastModified = new Date(data.timeStamp)

});

const today = formatDate(new Date());

const sitemapXmlBrand = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> 
  ${brands.map(
    path => `<url>
    <siteUrl>${path.siteUrl}</siteUrl>
    <description>${path.description}</description>
    <shouldDisplay>${path.shouldDisplay}</shouldDisplay>
    <responseCode>${path.responseCode}</responseCode>
    <name>${path.name}</name>
    <id>${path.id}</id>
    <message>${path.message}</message>
    <landingPage>${path.landingPage}</landingPage>
    <lastmod>${
        lastModified
        ? lastModified
        : today
    }</lastmod>
  </url>`
  )}
</urlset>`;

const sitemapXmlCategories = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> 
  ${categories.map(
    path => `<url>
    <description>${path.description}</description>
    <id>${path.id}</id>
    <name>${path.name}</name>
    <urlIndex>${path.urlIndex}</urlIndex>
    <lastmod>${
        lastModified
        ? lastModified
        : today
    }</lastmod>
    <subCategories>
    ${(path.subCategories).map(res => `
    <description>${path.description}</description>
    <filterKey>${path.filterKey}</filterKey>
    <id>${path.id}</id>
    <name>${path.name}</name>
    <urlIndex>${path.urlIndex}</urlIndex>
    `)}
    </subCategories>
  </url>`
  )}
</urlset>`;

const sitemapXmlProductSets = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> 
  ${productSets.map(
    path => `<url>
    <deleted>${path.deleted}</deleted>
    <id>${path.id}</id>
    <message>${path.message}</message>
    <mixMatchAvailable>${path.mixMatchAvailable}</mixMatchAvailable>
    <productTemplateId>${path.productTemplateId}</productTemplateId>
    <recommendedAvailable>${path.recommendedAvailable}</recommendedAvailable>
    <responseCode>${path.responseCode}</responseCode>
    <shareEnabled>${path.shareEnabled}</shareEnabled>
    <shouldDisplay>${path.shouldDisplay}</shouldDisplay>
    <stockAvailable>${path.stockAvailable}</stockAvailable>
    <totalReviews>${path.totalReviews}</totalReviews>
    <lastmod>${
        lastModified
        ? lastModified
        : today
    }</lastmod>
    <localisations>
    ${
        (path.localisations).map(res =>  
            `
            <responseCode>${res.id}</responseCode>
            <languageTag>${res.languageTag}</languageTag>
            <message>${res.message}</message>
            <pageDescription>${res.pageDescription}</pageDescription>
            <productSetDescription>${res.productSetDescription}</productSetDescription>
            <responseCode>${res.responseCode}</responseCode>
            <shouldDisplay>${res.shouldDisplay}</shouldDisplay>
            <subTitle>${res.subTitle}</subTitle>
            `)
    }
</localisations>

  </url>`
  )}
</urlset>`;

let date = new Date();

await fs.writeFileSync(`out/sitemap_brand_${date.getTime()}.xml`, sitemapXmlBrand);
await fs.writeFileSync(`out/sitemap_categories_${date.getTime()}.xml`, sitemapXmlCategories);
await fs.writeFileSync(`out/sitemap_product_sets_${date.getTime()}.xml`, sitemapXmlProductSets);
console.log("sitemaps.xml saved!");

}

f();

function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
  
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
  
    return [year, month, day].join("-");
  };