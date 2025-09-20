import { useState } from 'react'
import { Search, TrendingUp, MapPin, Users, DollarSign, BarChart3, Lightbulb, Eye, Target, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import BrazilMap from './components/BrazilMap'
import MetricsCard from './components/MetricsCard'
import LoadingSpinner from './components/LoadingSpinner'
import './App.css'

// Dados mockados para demonstração
const mockTrendData = [
  { month: 'Jan', interest: 65 },
  { month: 'Fev', interest: 59 },
  { month: 'Mar', interest: 80 },
  { month: 'Abr', interest: 81 },
  { month: 'Mai', interest: 56 },
  { month: 'Jun', interest: 55 },
  { month: 'Jul', interest: 40 },
  { month: 'Ago', interest: 70 },
  { month: 'Set', interest: 75 }
]

const mockDemographicsData = [
  { range: '< R$2k', percentage: 20 },
  { range: 'R$2k-5k', percentage: 40 },
  { range: 'R$5k-10k', percentage: 25 },
  { range: '> R$10k', percentage: 15 }
]

const mockSalesData = [
  { quarter: 'Q1', sales: 100 },
  { quarter: 'Q2', sales: 120 },
  { quarter: 'Q3', sales: 90 },
  { quarter: 'Q4', sales: 150 }
]

const mockCompetitors = [
  { name: 'Concorrente A', price: 'Alto', rating: 4.5, priceLevel: 'high' },
  { name: 'Concorrente B', price: 'Médio', rating: 3.8, priceLevel: 'medium' },
  { name: 'Concorrente C', price: 'Baixo', rating: 2.1, priceLevel: 'low' },
  { name: 'Concorrente D', price: 'Médio', rating: 4.0, priceLevel: 'medium' },
  { name: 'Concorrente E', price: 'Alto', rating: 3.5, priceLevel: 'high' }
]

const mockRegions = [
  { state: 'SP', searches: 1500, percentage: 30, status: 'excelente' },
  { state: 'RJ', searches: 800, percentage: 15, status: 'bom' },
  { state: 'MG', searches: 600, percentage: 10, status: 'médio' },
  { state: 'BA', searches: 300, percentage: 5, status: 'ruim' },
  { state: 'RS', searches: 400, percentage: 7, status: 'bom' },
  { state: 'PR', searches: 350, percentage: 6, status: 'bom' },
  { state: 'SC', searches: 250, percentage: 4, status: 'médio' },
  { state: 'GO', searches: 200, percentage: 3, status: 'médio' },
  { state: 'PE', searches: 180, percentage: 3, status: 'ruim' },
  { state: 'CE', searches: 150, percentage: 2, status: 'ruim' },
  { state: 'PA', searches: 120, percentage: 2, status: 'ruim' },
  { state: 'MT', searches: 100, percentage: 1, status: 'médio' },
  { state: 'DF', searches: 90, percentage: 1, status: 'bom' },
  { state: 'ES', searches: 80, percentage: 1, status: 'médio' },
  { state: 'AM', searches: 70, percentage: 1, status: 'ruim' }
]

const mockInsights = [
  { type: 'positive', title: 'Pontos Positivos', description: 'Alta demanda e boa margem de lucro no mercado atual.' },
  { type: 'prediction', title: 'Previsão de Vendas', description: 'Aumento estimado de 20% nos próximos 6 meses.' },
  { type: 'decision', title: 'Compensa Vender?', description: 'Sim, o mercado é promissor com baixa concorrência.' },
  { type: 'complaints', title: 'Reclamações', description: 'Baixas e irrelevantes, principalmente sobre entrega.' }
]

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleSearch = async () => {
    if (searchQuery.trim().length < 3) {
      alert('Por favor, digite pelo menos 3 caracteres para pesquisar.')
      return
    }

    setIsLoading(true)
    
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsLoading(false)
    setShowResults(true)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const getPriceBadgeColor = (priceLevel) => {
    switch (priceLevel) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'excelente': return 'bg-blue-600'
      case 'bom': return 'bg-blue-400'
      case 'médio': return 'bg-yellow-400'
      case 'ruim': return 'bg-red-400'
      default: return 'bg-gray-400'
    }
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>)
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">☆</span>)
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">☆</span>)
    }
    
    return stars
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            <Search className="inline-block mr-3 text-blue-600" size={40} />
            Pesquisa de Mercado
          </h1>
          <p className="text-gray-600 text-lg">Analise tendências, concorrência e oportunidades de mercado</p>
        </motion.div>

        {/* Search Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Pesquisar Produto</CardTitle>
              <CardDescription>Digite o nome do produto que deseja analisar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Ex: Smartphone Samsung Galaxy..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSearch} 
                  disabled={isLoading || searchQuery.trim().length < 3}
                  className="px-8"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analisando...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Pesquisar
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && <LoadingSpinner />}
        </AnimatePresence>

        {/* Results Section */}
        <AnimatePresence>
          {showResults && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Métricas Principais */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricsCard
                  title="Volume de Pesquisas"
                  value="5,247"
                  change="+12% vs mês anterior"
                  changeType="increase"
                  icon={Eye}
                  color="blue"
                />
                <MetricsCard
                  title="Interesse Médio"
                  value="73%"
                  change="+8% vs mês anterior"
                  changeType="increase"
                  icon={Target}
                  color="green"
                />
                <MetricsCard
                  title="Competitividade"
                  value="Média"
                  change="5 concorrentes ativos"
                  changeType="neutral"
                  icon={BarChart3}
                  color="orange"
                />
                <MetricsCard
                  title="Potencial de Lucro"
                  value="Alto"
                  change="Margem de 30%"
                  changeType="increase"
                  icon={Zap}
                  color="purple"
                />
              </div>

              {/* Gráficos e Análises */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Tendência de Busca */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-2"
              >
                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="mr-2 text-green-600" />
                      Tendência de Busca
                    </CardTitle>
                    <CardDescription>Interesse ao longo do tempo</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={mockTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="interest" 
                          stroke="#2563eb" 
                          strokeWidth={3}
                          dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    <div className="flex justify-between mt-4 text-sm">
                      <span className="text-green-600 font-medium">↗ +15% (7 dias)</span>
                      <span className="text-blue-600 font-medium">↗ +8% (30 dias)</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Preço Sugerido */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <DollarSign className="mr-2 text-green-600" />
                      Preço Sugerido
                    </CardTitle>
                    <CardDescription>Baseado na análise de mercado</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">R$ 129,90</div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Margem de 30%
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Mapa de Regiões */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2"
              >
                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="mr-2 text-blue-600" />
                      Interesse por Região
                    </CardTitle>
                    <CardDescription>Mapa interativo do Brasil com dados de pesquisa</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96 w-full">
                      <BrazilMap regionsData={mockRegions} />
                    </div>
                    <div className="mt-4 flex justify-center space-x-4 text-xs">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-red-400 rounded-full mr-1"></div>
                        <span>Ruim</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mr-1"></div>
                        <span>Médio</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-1"></div>
                        <span>Bom</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-1"></div>
                        <span>Excelente</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Demografia */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 text-purple-600" />
                      Demografia
                    </CardTitle>
                    <CardDescription>Distribuição de renda</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={mockDemographicsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="percentage" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Concorrência */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="lg:col-span-2"
              >
                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="mr-2 text-orange-600" />
                      Análise de Concorrência
                    </CardTitle>
                    <CardDescription>Principais concorrentes no mercado</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Produto</th>
                            <th className="text-left py-2">Preço</th>
                            <th className="text-left py-2">Avaliação</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockCompetitors.map((competitor, index) => (
                            <motion.tr
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * index }}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="py-3">{competitor.name}</td>
                              <td className="py-3">
                                <Badge className={getPriceBadgeColor(competitor.priceLevel)}>
                                  {competitor.price}
                                </Badge>
                              </td>
                              <td className="py-3">
                                <div className="flex items-center">
                                  {renderStars(competitor.rating)}
                                  <span className="ml-2 text-sm text-gray-600">
                                    {competitor.rating}
                                  </span>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Insights de Vendas */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="mr-2 text-indigo-600" />
                      Insights de Vendas
                    </CardTitle>
                    <CardDescription>Sazonalidade e tendências</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={mockSalesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="quarter" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="sales" fill="#6366f1" />
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2 text-sm">
                      <p><strong>Sazonalidade:</strong> Alta no final do ano</p>
                      <p><strong>Tendência:</strong> Crescimento constante</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Insights e Recomendações */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="lg:col-span-3"
              >
                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lightbulb className="mr-2 text-yellow-600" />
                      Insights e Recomendações
                    </CardTitle>
                    <CardDescription>Análise detalhada e sugestões estratégicas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mockInsights.map((insight, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className={`p-4 rounded-lg border-l-4 ${
                            insight.type === 'positive' ? 'border-green-500 bg-green-50' :
                            insight.type === 'prediction' ? 'border-blue-500 bg-blue-50' :
                            insight.type === 'decision' ? 'border-purple-500 bg-purple-50' :
                            'border-orange-500 bg-orange-50'
                          }`}
                        >
                          <h4 className="font-semibold mb-2">{insight.title}</h4>
                          <p className="text-sm text-gray-700">{insight.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App
