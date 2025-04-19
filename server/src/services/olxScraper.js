import puppeteer from 'puppeteer';

/**
 * Scrapes car ad data from an olx.ba URL using Puppeteer
 * @param {string} url - The URL of the car ad on olx.ba
 * @returns {Promise<Object>} - The scraped car ad data
 */
export async function scrapeOlxCarAd(url) {
  if (!url.includes('olx.ba')) {
    throw new Error('URL must be from olx.ba domain');
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });

  const title = await page.$eval('[data-v-226c5608].main-title-listing', el => el.innerText.trim());

  let description = "";
  try {
    description = await page.$eval('.central-inner', el => {
      el.querySelectorAll('br').forEach(br => {
        const nl = document.createTextNode('\n');
        br.parentNode.insertBefore(nl, br);
        br.remove();
      });
      return el.innerText.trim();
    });
  } catch (error) {
    console.log('Description not found, using empty string');
  }

  const price = await page.$eval('[data-v-0c5ffd31].price-heading', el => el.innerText.trim());

  const requiredAttributes = await page.$$eval('div.required-attributes div.required-wrap', wraps => {
    const attrs = {};
    wraps.forEach(wrap => {
      const tds = wrap.querySelectorAll('td');
      if (tds.length >= 2) {
        const key = tds[0].innerText.trim();
        const valCell = tds[1];
        const hasIcon = valCell.querySelector('svg') !== null;
        const value = hasIcon ? true : valCell.innerText.trim();
        attrs[key] = value;
      }
    });
    return attrs;
  });

  const sectionData = await page.$$eval('div.flex.flex-col > h2.section-title', headings => {
    const data = {};
    headings.forEach(heading => {
      const section = heading.innerText.trim();
      const table = heading.nextElementSibling;
      if (table && table.tagName === 'TABLE') {
        const rows = table.querySelectorAll('tbody tr');
        const sectionObj = {};
        rows.forEach(row => {
          const cells = row.querySelectorAll('td');
          if (cells.length >= 2) {
            const key = cells[0].innerText.trim();
            const valCell = cells[1];
            const hasIcon = valCell.querySelector('svg') !== null;
            const value = hasIcon ? true : valCell.innerText.trim();
            sectionObj[key] = value;
          }
        });
        data[section] = sectionObj;
      }
    });
    return data;
  });

  const specifications = sectionData['Specifikacije'] || {};
  const equipment = sectionData['Oprema'] || {};

  const imageUrls = await page.$$eval('.swiper-wrapper div img', imgs =>
    imgs.map(img => img.src).filter(src => !!src)
  );


const meta = await page.evaluate(() => {
  const labels = Array.from(document.querySelectorAll('label.btn-pill'));
  let updatedAt = null;
  let views = null;

  labels.forEach(label => {
    const text = label.innerText.trim().toUpperCase();

    if (text.startsWith('OBNOVLJEN:')) {
      updatedAt = text.replace('OBNOVLJEN:', '').trim();
    }

    if (text.startsWith('PREGLEDI:')) {
      views = text.replace('PREGLEDI:', '').trim();
    }
  });

  return { updatedAt, views };
});


  await browser.close();

  return {
    title,
    description: description ?? "",
    price,
    requiredAttributes,
    specifications,
    equipment,
    imageUrls,
    updatedAt: meta.updatedAt,
    views: meta.views
  };
}
