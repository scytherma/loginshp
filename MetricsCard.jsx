import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const MetricsCard = ({ title, value, change, changeType, icon: Icon, color = "blue" }) => {
  const getChangeIcon = () => {
    if (changeType === 'increase') return <TrendingUp className="w-4 h-4" />
    if (changeType === 'decrease') return <TrendingDown className="w-4 h-4" />
    return <Minus className="w-4 h-4" />
  }

  const getChangeColor = () => {
    if (changeType === 'increase') return 'text-green-600'
    if (changeType === 'decrease') return 'text-red-600'
    return 'text-gray-600'
  }

  const getColorClasses = () => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200',
      red: 'bg-red-50 text-red-600 border-red-200'
    }
    return colors[color] || colors.blue
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-md p-6 border-l-4 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 ${getChangeColor()}`}>
              {getChangeIcon()}
              <span className="ml-1 text-sm font-medium">{change}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-full ${getColorClasses()}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default MetricsCard
