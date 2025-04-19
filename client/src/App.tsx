import './App.css'
import { OlxAnalyzerForm } from './components/olx-analyzer-form'

function App() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-8">AI Auto Analyzer</h1>
      <p>Note this is not official app by OLX this is only tool that parses their ads</p>
      <OlxAnalyzerForm />
    </div>
  )
}

export default App
