import './App.css'
import { OlxAnalyzerForm } from './components/olx-analyzer-form'

function App() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-8">OLX AI Auto Analyzer</h1>
      <OlxAnalyzerForm />
    </div>
  )
}

export default App
