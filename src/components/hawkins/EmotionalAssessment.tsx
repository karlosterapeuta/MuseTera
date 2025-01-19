'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { HAWKINS_LEVELS, EmotionalLevel } from '@/types/hawkins'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

export default function EmotionalAssessment() {
  const [selectedLevel, setSelectedLevel] = useState<EmotionalLevel | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'OMEGA':
        return 'bg-purple-100 text-purple-800'
      case 'EXPANSAO':
        return 'bg-blue-100 text-blue-800'
      case 'NEUTRALIDADE':
        return 'bg-green-100 text-green-800'
      case 'CONTRACAO':
        return 'bg-orange-100 text-orange-800'
      case 'ALFA':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <label className="block text-lg md:text-xl font-medium text-gray-700">
            Selecione seu estado emocional atual:
          </label>
          <select
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-lg md:text-xl text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
            style={{
              fontSize: '18px',
              lineHeight: '1.5',
              minHeight: '45px'
            }}
            onChange={(e) => {
              const level = HAWKINS_LEVELS.find(
                (l) => l.frequency.toString() === e.target.value
              )
              setSelectedLevel(level || null)
              setShowDetails(true)
            }}
            value={selectedLevel?.frequency || ''}
          >
            <option 
              value="" 
              className="text-lg md:text-xl py-2"
              style={{
                fontSize: '18px',
                padding: '10px',
                lineHeight: '1.5'
              }}
            >
              Escolha um estado emocional
            </option>
            {HAWKINS_LEVELS.map((level) => (
              <option 
                key={level.frequency} 
                value={level.frequency} 
                className="text-lg md:text-xl py-2"
                style={{
                  fontSize: '18px',
                  padding: '10px',
                  lineHeight: '1.5'
                }}
              >
                {level.consciousness} - {level.emotion}
              </option>
            ))}
          </select>
        </div>

        {selectedLevel && (
          <div className="mt-6 space-y-6">
            <div className="space-y-4">
              <div className={`inline-block px-4 py-2 rounded-full text-lg md:text-xl font-medium ${getCategoryColor(selectedLevel.category)}`}>
                {selectedLevel.category}
              </div>
              <div className="space-y-3">
                <h3 className="text-xl md:text-2xl font-semibold">
                  {selectedLevel.consciousness}
                </h3>
                <p className="text-lg md:text-xl text-gray-600">
                  <span className="font-medium">Emoção:</span> {selectedLevel.emotion}
                </p>
                <p className="text-lg md:text-xl text-gray-600">
                  <span className="font-medium">Frequência:</span> {selectedLevel.frequency}Hz
                </p>
              </div>
              <div className="pt-4">
                <h4 className="font-medium text-lg md:text-xl mb-2">Descrição:</h4>
                <p className="text-lg md:text-xl text-gray-700">{selectedLevel.description}</p>
              </div>
              <div className="pt-4">
                <h4 className="font-medium text-lg md:text-xl mb-2">Recomendação Musical:</h4>
                <p className="text-lg md:text-xl text-gray-700">{selectedLevel.musicalRecommendation}</p>
              </div>
              <div className="pt-4">
                <h4 className="font-medium text-lg md:text-xl mb-2">Exemplos de Músicas Brasileiras:</h4>
                <ul className="list-disc list-inside space-y-3 text-lg md:text-xl text-gray-700">
                  {selectedLevel.brazilianExamples.map((example, index) => (
                    <li key={index}>{example}</li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-gray-500 hover:text-gray-700"
              >
                {showDetails ? (
                  <ChevronUpIcon className="h-5 w-5" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Escala Visual */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Escala de Consciência</h3>
        <div className="space-y-2">
          {Object.entries({
            'OMEGA (700Hz)': 'bg-purple-200',
            'EXPANSÃO (310-600Hz)': 'bg-blue-200',
            'NEUTRALIDADE (200-250Hz)': 'bg-green-200',
            'CONTRAÇÃO (100-175Hz)': 'bg-yellow-200',
            'ALFA (20-75Hz)': 'bg-red-200'
          }).map(([label, bgColor]) => (
            <div
              key={label}
              className={`p-2 rounded-lg ${bgColor} text-sm font-medium`}
            >
              {label}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
