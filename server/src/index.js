import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import { scrapeOlxCarAd } from './services/olxScraper.js'
import { analyzeWithVision } from './services/openai.js'
import { limiter } from './middleware/rateLimiter.js'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

// Primjena rate limitera na sve rute
app.use(limiter)

// Konfiguracija CORS-a
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}))

app.post('/api/analyze', async (req, res) => {      
    try {
        const { url } = req.body    
        if (!url) {
            return res.status(400).json({ error: 'URL je obavezan' })
        }

        // Validacija URL formata
        if (!url.startsWith('https://olx.ba/')) {
            return res.status(400).json({ error: 'Nevažeći OLX URL' })
        }

        // Scrape the OLX car ad
        const carData = await scrapeOlxCarAd(url)   


        // Get AI analysis
        const analysis = await analyzeWithVision({
            carData
        })

        return res.json({ data:{...analysis,...carData} })
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred'
        return res.status(500).json({ error: errorMessage })
    }
})


app.listen(4000, () => {
    console.log('Server running on http://localhost:4000')
})
