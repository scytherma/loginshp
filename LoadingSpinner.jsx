import { motion } from 'framer-motion'
import { Search, TrendingUp, BarChart3, Users } from 'lucide-react'

const LoadingSpinner = ({ message = "Analisando dados do mercado..." }) => {
  const icons = [Search, TrendingUp, BarChart3, Users]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-16"
    >
      {/* Spinner principal */}
      <div className="relative mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"
        />
        
        {/* Ícones orbitando */}
        <div className="absolute inset-0">
          {icons.map((Icon, index) => (
            <motion.div
              key={index}
              animate={{ rotate: -360 }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "linear",
                delay: index * 0.2
              }}
              className="absolute inset-0"
            >
              <motion.div
                className="absolute w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) translateY(-40px) rotate(${index * 90}deg) translateY(40px)`
                }}
                whileHover={{ scale: 1.1 }}
              >
                <Icon className="w-4 h-4 text-blue-600" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Texto de loading */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{message}</h3>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-gray-600"
        >
          Isso pode levar alguns segundos...
        </motion.p>
      </motion.div>

      {/* Barra de progresso animada */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 3, repeat: Infinity }}
        className="mt-6 h-1 bg-blue-600 rounded-full"
        style={{ width: "200px", maxWidth: "200px" }}
      />

      {/* Pontos de loading */}
      <div className="flex space-x-2 mt-4">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              delay: index * 0.2
            }}
            className="w-2 h-2 bg-blue-600 rounded-full"
          />
        ))}
      </div>
    </motion.div>
  )
}

export default LoadingSpinner
