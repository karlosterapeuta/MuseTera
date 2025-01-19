'use client'

import { Card } from '@/components/ui/Card'
import EmotionalAssessment from '@/components/hawkins/EmotionalAssessment'

export default function BibliotecaPage() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Hawkins</h1>
        <div className="mt-4 bg-white rounded-lg shadow p-6">
          <p className="text-gray-700 leading-relaxed">
            A escala "Níveis de consciência de Hawkins" foi desenvolvida pelo psiquiatra David R. Hawkins. 
            Esta metodologia inovadora é capaz de medir a frequência do campo vibracional de pessoas, filmes, 
            documentos, criando uma escala abrangente de estados de consciência.
          </p>
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Como funciona?</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Selecione seu estado emocional atual no menu</li>
              <li>Visualize a frequência correspondente em Hz</li>
              <li>Explore a descrição detalhada do estado</li>
              <li>Receba recomendações musicais personalizadas</li>
            </ul>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Use esta ferramenta para:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Avaliar seu estado emocional atual</li>
              <li>Compreender diferentes níveis de consciência</li>
              <li>Receber sugestões musicais terapêuticas</li>
              <li>Acompanhar sua evolução ao longo do tempo</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Avaliação Emocional de Hawkins */}
      <EmotionalAssessment />
    </div>
  )
}