import { useState } from 'react'
import { motion } from 'framer-motion'

const BrazilMap = ({ regionsData, onStateHover, onStateLeave }) => {
  const [hoveredState, setHoveredState] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  const handleStateMouseEnter = (stateCode, event) => {
    setHoveredState(stateCode)
    setTooltipPosition({ x: event.clientX, y: event.clientY })
    if (onStateHover) onStateHover(stateCode)
  }

  const handleStateMouseLeave = () => {
    setHoveredState(null)
    if (onStateLeave) onStateLeave()
  }

  const handleStateMouseMove = (event) => {
    setTooltipPosition({ x: event.clientX, y: event.clientY })
  }

  const getStateColor = (status) => {
    switch (status) {
      case 'excelente': return '#2563eb' // blue-600
      case 'bom': return '#60a5fa' // blue-400
      case 'médio': return '#fbbf24' // yellow-400
      case 'ruim': return '#ef4444' // red-400
      default: return '#d1d5db' // gray-300
    }
  }

  const getStateData = (stateCode) => {
    return regionsData.find(region => region.state === stateCode) || {}
  }

  return (
    <div className="relative w-full h-full">
      <svg
        viewBox="0 0 1000 800"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Acre (AC) */}
        <motion.path
          d="M150 400 L200 400 L200 450 L150 450 Z"
          fill={getStateColor(getStateData('AC').status)}
          stroke="#ffffff"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-200"
          whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
          onMouseEnter={(e) => handleStateMouseEnter('AC', e)}
          onMouseLeave={handleStateMouseLeave}
          onMouseMove={handleStateMouseMove}
        />

        {/* Alagoas (AL) */}
        <motion.path
          d="M650 350 L680 350 L680 380 L650 380 Z"
          fill={getStateColor(getStateData('AL').status)}
          stroke="#ffffff"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-200"
          whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
          onMouseEnter={(e) => handleStateMouseEnter('AL', e)}
          onMouseLeave={handleStateMouseLeave}
          onMouseMove={handleStateMouseMove}
        />

        {/* Amapá (AP) */}
        <motion.path
          d="M350 150 L400 150 L400 200 L350 200 Z"
          fill={getStateColor(getStateData('AP').status)}
          stroke="#ffffff"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-200"
          whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
          onMouseEnter={(e) => handleStateMouseEnter('AP', e)}
          onMouseLeave={handleStateMouseLeave}
          onMouseMove={handleStateMouseMove}
        />

        {/* Amazonas (AM) */}
        <motion.path
          d="M200 200 L350 200 L350 350 L200 350 Z"
          fill={getStateColor(getStateData('AM').status)}
          stroke="#ffffff"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-200"
          whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
          onMouseEnter={(e) => handleStateMouseEnter('AM', e)}
          onMouseLeave={handleStateMouseLeave}
          onMouseMove={handleStateMouseMove}
        />

        {/* Bahia (BA) */}
        <motion.path
          d="M500 350 L600 350 L600 450 L500 450 Z"
          fill={getStateColor(getStateData('BA').status)}
          stroke="#ffffff"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-200"
          whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
          onMouseEnter={(e) => handleStateMouseEnter('BA', e)}
          onMouseLeave={handleStateMouseLeave}
          onMouseMove={handleStateMouseMove}
        />

        {/* Ceará (CE) */}
        <motion.path
          d="M550 250 L620 250 L620 300 L550 300 Z"
          fill={getStateColor(getStateData('CE').status)}
          stroke="#ffffff"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-200"
          whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
          onMouseEnter={(e) => handleStateMouseEnter('CE', e)}
          onMouseLeave={handleStateMouseLeave}
          onMouseMove={handleStateMouseMove}
        />

        {/* Distrito Federal (DF) */}
        <motion.circle
          cx="480"
          cy="380"
          r="8"
          fill={getStateColor(getStateData('DF').status)}
          stroke="#ffffff"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-200"
          whileHover={{ scale: 1.2, filter: "brightness(1.1)" }}
          onMouseEnter={(e) => handleStateMouseEnter('DF', e)}
          onMouseLeave={handleStateMouseLeave}
          onMouseMove={handleStateMouseMove}
        />

        {/* Espírito Santo (ES) */}
        <motion.path
          d="M580 450 L610 450 L610 480 L580 480 Z"
          fill={getStateColor(getStateData('ES').status)}
          stroke="#ffffff"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-200"
          whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
          onMouseEnter={(e) => handleStateMouseEnter('ES', e)}
          onMouseLeave={handleStateMouseLeave}
          onMouseMove={handleStateMouseMove}
        />

        {/* Goiás (GO) */}
        <motion.path
          d="M450 350 L520 350 L520 420 L450 420 Z"
          fill={getStateColor(getStateData('GO').status)}
          stroke="#ffffff"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-200"
          whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
          onMouseEnter={(e) => handleStateMouseEnter('GO', e)}
          onMouseLeave={handleStateMouseLeave}
          onMouseMove={handleStateMouseMove}
        />

        {/* Maranhão (MA) */}
        <motion.path
          d="M450 250 L550 250 L550 320 L450 320 Z"
          fill={getStateColor(getStateData('MA').status)}
          stroke="#ffffff"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-200"
          whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
          onMouseEnter={(e) => handleStateMouseEnter('MA', e)}
          onMouseLeave={handleStateMouseLeave}
          onMouseMove={handleStateMouseMove}
        />

        {/* Mato Grosso (MT) */}
        <motion.path
          d="M350 350 L450 350 L450 450 L350 450 Z"
          fill={getStateColor(getStateData('MT').status)}
          stroke="#ffffff"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-200"
          whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
          onMouseEnter={(e) => handleStateMouseEnter('MT', e)}
          onMouseLeave={handleStateMouseLeave}
          onMouseMove={handleStateMouseMove}
        />

        {/* Mato Grosso do Sul (MS) */}
        <motion.path
          d="M350 450 L450 450 L450 520 L350 520 Z"
          fill={getStateColor(getStateData('MS').status)}
          stroke="#ffffff"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-200"
          whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
          onMouseEnter={(e) => handleStateMouseEnter('MS', e)}
          onMouseLeave={handleStateMouseLeave}
          onMouseMove={handleStateMouseMove}
        />

        {/* Minas Gerais (MG) */}
        <motion.path
          d="M500 420 L580 420 L580 500 L500 500 Z"
          fill={getStateColor(getStateData('MG').status)}
          stroke="#ffffff"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-200"
          whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
          onMouseEnter={(e) => handleStateMouseEnter('MG', e)}
          onMouseLeave={handleStateMouseLeave}
          onMouseMove={handleStateMouseMove}
        />

        {/* Pará (PA) */}
        <motion.path
          d="M350 200 L500 200 L500 300 L350 300 Z"
          fill={getStateColor(getStateData('PA').status)}
          stroke="#ffffff"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-200"
          whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
          onMouseEnter={(e) => handleStateMouseEnter('PA', e)}
          onMouseLeave={handleStateMouseLeave}
          onMouseMove={handleStateMouseMove}
        />

        {/* Paraíba (PB) */}
        <motion.path
          d="M620 280 L650 280 L650 310 L620 310 Z"
          fill={getStateColor(getStateData('PB').status)}
          stroke="#ffffff"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-200"
          whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
          onMouseEnter={(e) => handleStateMouseEnter('PB', e)}
          onMouseLeave={handleStateMouseLeave}
          onMouseMove={handleStateMouseMove}
        />

        {/* Paraná (PR) */}
        <motion.path
          d="M450 520 L520 520 L520 580 L450 580 Z"
          fill={getStateColor(getStateData('PR').status)}
          stroke="#ffffff"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-200"
          whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
          onMouseEnter={(e) => handleStateMouseEnter('PR', e)}
          onMouseLeave={handleStateMouseLeave}
          onMouseMove={handleStateMouseMove}
        />

        {/* Pernambuco (PE) */}
        <motion.path
          d="M600 300 L650 300 L650 350 L600 350 Z"
          fill={getStateColor(getStateData('PE').status)}
          stroke="#ffffff"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-200"
          whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
          onMouseEnter={(e) => handleStateMouseEnter('PE', e)}
          onMouseLeave={handleStateMouseLeave}
          onMouseMove={handleStateMouseMove}
        />

        {/* Piauí (PI) */}
        <motion.path
          d="M500 280 L550 280 L550 350 L500 350 Z"
          fill={getStateColor(getStateData('PI').status)}
          stroke="#ffffff"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-200"
          whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
          onMouseEnter={(e) => handleStateMouseEnter('PI', e)}
          onMouseLeave={handleStateMouseLeave}
          onMouseMove={handleStateMouseMove}
        />

        {/* Rio de Janeiro (RJ) */}
        <motion.path
          d="M580 480 L620 480 L620 520 L580 520 Z"
          fill={getStateColor(getStateData('RJ').status)}
          stroke="#ffffff"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-200"
          whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
          onMouseEnter={(e) => handleStateMouseEnter('RJ', e)}
          onMouseLeave={handleStateMouseLeave}
          onMouseMove={handleStateMouseMove}
        />

        {/* Rio Grande do Norte (RN) */}
        <motion.path
          d="M620 250 L660 250 L660 280 L620 280 Z"
          fill={getStateColor(getStateData('RN').status)}
          stroke="#ffffff"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-200"
          whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
          onMouseEnter={(e) => handleStateMouseEnter('RN', e)}
          onMouseLeave={handleStateMouseLeave}
          onMouseMove={handleStateMouseMove}
        />

        {/* Rio Grande do Sul (RS) */}
        <motion.path
          d="M420 580 L500 580 L500 650 L420 650 Z"
          fill={getStateColor(getStateData('RS').status)}
          stroke="#ffffff"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-200"
          whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
          onMouseEnter={(e) => handleStateMouseEnter('RS', e)}
          onMouseLeave={handleStateMouseLeave}
          onMouseMove={handleStateMouseMove}
        />

        {/* Rondônia (RO) */}
        <motion.path
          d="M250 350 L320 350 L320 420 L250 420 Z"
          fill={getStateColor(getStateData('RO').status)}
          stroke="#ffffff"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-200"
          whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
          onMouseEnter={(e) => handleStateMouseEnter('RO', e)}
          onMouseLeave={handleStateMouseLeave}
          onMouseMove={handleStateMouseMove}
        />

        {/* Roraima (RR) */}
        <motion.path
          d="M250 150 L350 150 L350 200 L250 200 Z"
          fill={getStateColor(getStateData('RR').status)}
          stroke="#ffffff"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-200"
          whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
          onMouseEnter={(e) => handleStateMouseEnter('RR', e)}
          onMouseLeave={handleStateMouseLeave}
          onMouseMove={handleStateMouseMove}
        />

        {/* Santa Catarina (SC) */}
        <motion.path
          d="M450 580 L520 580 L520 620 L450 620 Z"
          fill={getStateColor(getStateData('SC').status)}
          stroke="#ffffff"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-200"
          whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
          onMouseEnter={(e) => handleStateMouseEnter('SC', e)}
          onMouseLeave={handleStateMouseLeave}
          onMouseMove={handleStateMouseMove}
        />

        {/* São Paulo (SP) */}
        <motion.path
          d="M520 480 L580 480 L580 540 L520 540 Z"
          fill={getStateColor(getStateData('SP').status)}
          stroke="#ffffff"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-200"
          whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
          onMouseEnter={(e) => handleStateMouseEnter('SP', e)}
          onMouseLeave={handleStateMouseLeave}
          onMouseMove={handleStateMouseMove}
        />

        {/* Sergipe (SE) */}
        <motion.path
          d="M630 350 L660 350 L660 380 L630 380 Z"
          fill={getStateColor(getStateData('SE').status)}
          stroke="#ffffff"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-200"
          whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
          onMouseEnter={(e) => handleStateMouseEnter('SE', e)}
          onMouseLeave={handleStateMouseLeave}
          onMouseMove={handleStateMouseMove}
        />

        {/* Tocantins (TO) */}
        <motion.path
          d="M450 300 L500 300 L500 370 L450 370 Z"
          fill={getStateColor(getStateData('TO').status)}
          stroke="#ffffff"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-200"
          whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
          onMouseEnter={(e) => handleStateMouseEnter('TO', e)}
          onMouseLeave={handleStateMouseLeave}
          onMouseMove={handleStateMouseMove}
        />
      </svg>

      {/* Tooltip */}
      {hoveredState && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed z-50 bg-gray-900 text-white p-3 rounded-lg shadow-lg pointer-events-none"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y - 10,
            transform: 'translate(0, -100%)'
          }}
        >
          <div className="text-sm font-semibold">{hoveredState}</div>
          {getStateData(hoveredState).searches && (
            <>
              <div className="text-xs">Pesquisas: {getStateData(hoveredState).searches}</div>
              <div className="text-xs">Interesse: {getStateData(hoveredState).percentage}%</div>
              <div className="text-xs capitalize">Status: {getStateData(hoveredState).status}</div>
            </>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default BrazilMap
