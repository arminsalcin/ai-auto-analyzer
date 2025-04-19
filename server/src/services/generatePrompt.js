/**
 * Formatira podatke o vozilu u strukturirani prompt za GPT-4 Turbo Vision analizu
 * @param {Object} carData - Podaci o vozilu
 * @returns {Object} Formatirani prompt za OpenAI API
 */
export function generatePrompt(carData) {
    // Ograniči broj slika na 6
    const limitedImageUrls = carData.imageUrls.slice(0, 10);
  
    // Formatiraj obavezne atribute
    const requiredAttributesText = Object.entries(carData.requiredAttributes || {})
      .map(([key, value]) => `- ${key}: ${value}`)
      .join('\n');
  
    // Filtriraj najvažnije specifikacije (npr. boja, pogon, tip karoserije)
    const importantSpecs = ['Tip', 'Pogon', 'Boja', 'Ocarinjen', 'Posjeduje gume','Godina prve registracije','Broj stepeni prijenosa','Servisna knjiga','Broj prethodnih vlasnika','Datum objave'];
    const specificationsText = Object.entries(carData.specifications || {})
      .filter(([key]) => importantSpecs.includes(key))
      .map(([key, value]) => `- ${key}: ${value}`)
      .join('\n');
    
    // Filtriraj opremu: prikaži samo onu koja je true i bitna
    const importantEquipmentKeywords = [
      'kamera', 'led', 'grijanje', 'masaza', 'navigacija', 'klima', 'start-stop', 'senzor',
      'bluetooth', 'touch', 'tempomat'
    ];
  
    const equipmentText = Object.entries(carData.equipment || {})
      .filter(([key, value]) =>
        value === true ||
        (typeof value === 'string' &&
          importantEquipmentKeywords.some(keyword =>
            key.toLowerCase().includes(keyword) || value.toLowerCase().includes(keyword)
          ))
      )
      .map(([key, value]) => `- ${key}: ${value}`)
      .join('\n');
  
      const promptText = `🔎 *Analiza oglasa za polovno vozilo (BiH tržište)*

      👤 Kupac traži pouzdano vozilo srednje klase, s fokusom na dugoročno vlasništvo, nisku potrošnju i što manje skrivenih problema. Želi izbjeći vozila s manipulacijama, lošim održavanjem ili lošim odnosom cijene i kvaliteta.
      
      📌 **Naslov:** ${carData.title}  
      💰 **Cijena:** ${carData.price}  
      📝 **Opis:** ${carData.description}
      
      📇 **Atributi:**  
      ${requiredAttributesText}
      
      📊 **Specifikacije:**  
      ${specificationsText}
      
      ⚙️ **Oprema:**  
      ${equipmentText}
      
      **Oglas:**  
      - Datum objave: ${carData.specifications['Datum objave']}  
      - Datum obnove: ${carData.updatedAt}  
      - Broj pregleda: ${carData.views}
      
      🧠 **Procijeni:**  
      1. Vrijedi li auto pogledati ili kupiti?  
      2. Ima li šta sumnjivo u oglasu (opis, oprema, cijena, lokacija)?  
      3. Je li cijena realna za BiH tržište – i koju bi ti predložio kao fer cijenu za ovo vozilo?  
      4. Koliko vrijedi auto u ovom stanju na BiH tržištu?  
      5. Da li ovaj model ima poznate mane ili probleme na koje treba obratiti pažnju?  
      6. Šta se vidi na slikama (ako ih ima) – obrati pažnju na oštećenja limarije, da li je farban, tragovi udara, zamjena dijelova, stanje enterijera?  
      7. Postoji li neka bolja ponuda trenutno na tržištu za sličan model (po godini, kilometraži i cijeni)?
      
      🚨 Ako oglas djeluje sumnjivo ili kao potencijalna prevara (npr. previsoka kilometraža, loš opis, slaba oprema, sumnjiva cijena, vozilo iz šverca, "hitna prodaja", neusklađenost informacija), naglasi to vrlo jasno i objasni zašto.
      
      🎯 Na kraju:  
      - Daj **ocjenu vozila od 1 do 10** (1 = loše, 10 = izvrsno)  
      - Jasno reci **da li bi preporučio kupcu da pogleda ili kupi auto**  
      - Piši **iskreno**, kao da pomažeš bliskom prijatelju da ne napravi grešku  
      - Budi **jako striktan** – ne preporučuj auto koji nije dobar  
      - Obrati pažnju i na **datum objave**, **datum obnove**, te **broj pregleda** – ako je auto dugo na oglasu i ima mnogo pregleda, moguće je da postoji razlog zašto se ne prodaje
      
      ✍️ Piši u stilu iskusnog auto mehaničara ili trgovca: konkretno, direktno, sa znanjem o tržištu i tehničkim detaljima.  
      
      📄 Formatiraj odgovor ovako (obavezno po redoslijedu i strukturi):
      
      ---
      
      ## 🧠 Procjena oglasa
      
      **1. Vrijedi li auto pogledati ili kupiti?**  
      _Tvoj odgovor ovdje..._
      
      **2. Ima li šta sumnjivo u oglasu?**  
      _Tvoj odgovor ovdje..._
      
      **3. Je li cijena realna i koju bi predložio?**  
      _Tvoj odgovor ovdje..._
      
      **4. Koliko vrijedi auto na tržištu?**  
      _Tvoj odgovor ovdje..._
      
      **5. Ima li ovaj model poznate mane?**  
      _Tvoj odgovor ovdje..._
      
      **6. Vizuelna analiza (slike):**  
      _Tvoj odgovor ovdje..._
      
      **7. Postoje li bolje ponude na tržištu?**  
      _Tvoj odgovor ovdje..._
      
      ---
      
      ## 🚩 Sumnje i rizici
      
      Ako postoji nešto sumnjivo, napiši ovdje u formi liste, npr.:
      - Loš opis
      - Prevelika kilometraža
      - Slaba oprema
      - "Hitna prodaja"
      - Auto dugo na oglasu
      
      ---
      
      ## 🎯 Zaključak
      
      - **Ocjena auta (1-10):** X/10  
      - **Preporuka:** Da / Ne – preporučujem da se auto pogleda / ne preporučujem kupovinu  
      - **Kratak sažetak:**  
      _2-3 rečenice koje sumiraju stanje auta, glavne prednosti ili mane._
      
      ---
      
      📌 Formatiraj sve u **Markdownu**, koristi **boldirano** za pitanja i ključne riječi. Neka odgovor uvijek prati istu strukturu bez preskakanja sekcija.
      `;
      
      
  
    return {    
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: promptText },
            ...limitedImageUrls.map(url => ({
              type: 'image_url',
              image_url: {
                url: url,
                detail: 'low'
              }
            }))
          ]
        }
      ]
    };
  }
  