import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { CheckCircle, XCircle, Shield, Brain, Target, TrendingUp, Users, Zap } from 'lucide-react'
import './App.css'

function App() {
  const [jobText, setJobText] = useState('')
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)

  const handlePredict = async () => {
    if (!jobText.trim()) {
      alert('Please enter job posting text')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('https://5000-ie9nrdarahjrtt8okjby1-daa712f1.manusvm.computer/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ job_post_text: jobText }),
      })
      
      const data = await response.json()
      setPrediction(data)
    } catch (error) {
      console.error('Error:', error)
      alert('Error occurred during prediction')
    } finally {
      setLoading(false)
    }
  }

  const demoJobPostings = [
    {
      title: "Suspicious Job Posting",
      text: "URGENT! Data Entry Specialist needed. Work from home, earn $5000/week! No experience required. Just send $50 processing fee to get started. Contact us immediately!",
      expected: "FAKE"
    },
    {
      title: "Legitimate Job Posting",
      text: "Software Engineer - Full Stack Developer at TechCorp Inc. We are seeking an experienced full-stack developer to join our engineering team. Requirements: 3+ years experience with React, Node.js, and PostgreSQL. Competitive salary $80,000-$120,000. Benefits include health insurance, 401k, and flexible PTO.",
      expected: "REAL"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Fake Job Posting Detector</h1>
            </div>
            <Badge variant="secondary" className="text-sm">AI-Powered Protection</Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Protecting Job Seekers from Fraudulent Opportunities
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            An advanced NLP-powered solution that identifies fake job postings using machine learning 
            and anomaly detection techniques, helping combat the growing job scam epidemic.
          </p>
          <div className="flex justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">Machine Learning</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">95.4% Accuracy</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">Real-time Detection</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-8">Live Demo</h3>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Test the Detector</CardTitle>
              <CardDescription>
                Paste any job posting text below to see if it's legitimate or fraudulent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste job posting text here..."
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
                className="min-h-32"
              />
              <Button 
                onClick={handlePredict} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Analyzing...' : 'Analyze Job Posting'}
              </Button>
              
              {prediction && (
                <Alert className={prediction.is_fake ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
                  <div className="flex items-center space-x-2">
                    {prediction.is_fake ? (
                      <XCircle className="h-5 w-5 text-red-600" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    <AlertDescription className="font-medium">
                      This job posting is likely {prediction.is_fake ? 'FAKE' : 'REAL'}
                      <br />
                      <span className="text-sm text-gray-600">
                        Confidence: Real ({(prediction.prediction_proba[0] * 100).toFixed(1)}%), 
                        Fake ({(prediction.prediction_proba[1] * 100).toFixed(1)}%)
                      </span>
                    </AlertDescription>
                  </div>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Demo Examples */}
          <div className="grid md:grid-cols-2 gap-6">
            {demoJobPostings.map((demo, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{demo.title}</CardTitle>
                  <Badge variant={demo.expected === 'FAKE' ? 'destructive' : 'default'}>
                    Expected: {demo.expected}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{demo.text}</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setJobText(demo.text)}
                  >
                    Try This Example
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Project Overview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12">Project Overview</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-6 w-6 text-blue-600" />
                  <span>Problem Statement</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Job scams are increasingly prevalent, with fraudulent postings targeting vulnerable job seekers. 
                  Our solution addresses this critical social issue using advanced AI techniques.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-6 w-6 text-green-600" />
                  <span>Technical Approach</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Combines NLP text classification using TF-IDF features with Logistic Regression, 
                  enhanced by heuristic-based anomaly detection for comprehensive fraud identification.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                  <span>Impact & Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Achieved 95.4% accuracy on test data, providing reliable protection for job seekers 
                  and contributing to a safer online job market ecosystem.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12">Technical Implementation</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Data Processing Pipeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">1</Badge>
                  <span>Data Collection from Kaggle (18K job postings)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">2</Badge>
                  <span>Text preprocessing with NLTK (tokenization, stopword removal)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">3</Badge>
                  <span>Feature extraction using TF-IDF vectorization</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">4</Badge>
                  <span>Heuristic-based anomaly detection</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Model Architecture</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">ML</Badge>
                  <span>Logistic Regression with TF-IDF features</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">NLP</Badge>
                  <span>Text classification on combined job posting fields</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">API</Badge>
                  <span>Flask web application with REST endpoints</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">UI</Badge>
                  <span>Responsive React frontend with real-time predictions</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Future Enhancements */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12">Future Enhancements</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Advanced NLP Models</h4>
                <p className="text-sm text-gray-600">Implement BiLSTM and RoBERTa for improved accuracy</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">User Feedback Loop</h4>
                <p className="text-sm text-gray-600">Continuous learning from user corrections</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Zap className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Real-time Scraping</h4>
                <p className="text-sm text-gray-600">Live monitoring of job boards</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <TrendingUp className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Analytics Dashboard</h4>
                <p className="text-sm text-gray-600">Comprehensive fraud trend analysis</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg font-semibold mb-2">Fake Job Posting Detector</p>
          <p className="text-gray-400">Internship Project - Combating Job Fraud with AI</p>
          <p className="text-gray-400 mt-2">Built with React, Flask, scikit-learn, and NLTK</p>
        </div>
      </footer>
    </div>
  )
}

export default App

