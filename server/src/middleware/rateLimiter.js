import rateLimit from 'express-rate-limit';

// Konfiguracija rate limitera
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuta
  max: 100, // Limit od 100 zahtjeva po IP adresi
  message: {
    error: 'Previše zahtjeva sa ove IP adrese, pokušajte ponovo za 15 minuta'
  },
  standardHeaders: true,
  legacyHeaders: false
});