'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { PatientSelect } from '@/components/processos/PatientSelect'
import { Patient } from '@/types'
import Link from 'next/link'
import { AnamneseQuestion, ANAMNESE_QUESTIONS } from '@/types/anamnese'
import { AnamnesePDF } from '@/components/processos/AnamnesePDF'
import { useAnamneses } from '@/hooks/useAnamneses'
import { Logo } from '@/components/Logo'

export default function AnamnesePage() {
  const router = useRouter()
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <Logo size="sm" />
        </div>

        <Card>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Anamnese Musicoterapêutica</h1>
            
            <div className="space-y-6">
              <div className="mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <div className="w-full md:w-2/3">
                    <PatientSelect
                      onSelect={setSelectedPatient}
                      selectedId={selectedPatient?.id}
                    />
                  </div>
                  <div className="w-full md:w-1/3 md:mt-8">
                    <Link
                      href="/pacientes/novo"
                      className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 text-lg md:text-xl font-medium flex items-center justify-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Novo Paciente
                    </Link>
                  </div>
                </div>
              </div>

              {selectedPatient && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Anamnese de {selectedPatient.name}
                  </h2>
                  <AnamneseForm patient={selectedPatient} />
                </div>
              )}

              {!selectedPatient && (
                <div className="text-center py-6 text-gray-500">
                  Selecione um paciente ou cadastre um novo para iniciar a anamnese musicoterapêutica
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

function AnamneseForm({ patient }: { patient: Patient }) {
  const router = useRouter()
  const { addAnamnese } = useAnamneses()
  const [formData, setFormData] = useState<Record<string, string | string[]>>({})
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const anamneseData = {
        patientId: patient.id,
        respostas: formData,
        observacoes: formData.observacoes as string
      }

      addAnamnese(anamneseData)

      // Mostra mensagem de sucesso
      alert('Anamnese salva com sucesso!')
      
      // Redireciona para a lista de pacientes ou outra página relevante
      router.push('/pacientes')
    } catch (error) {
      console.error('Erro ao salvar anamnese:', error)
      alert('Erro ao salvar anamnese. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (questionId: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  // Agrupa as questões por categoria
  const questionsByCategory = ANAMNESE_QUESTIONS.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = []
    }
    acc[question.category].push(question)
    return acc
  }, {} as Record<string, AnamneseQuestion[]>)

  // Traduz o nome da categoria
  const translateCategory = (category: string) => {
    const translations: Record<string, string> = {
      dados_pessoais: 'Dados Pessoais e Familiares',
      historia_musical: 'História Musical',
      desenvolvimento: 'Desenvolvimento',
      comportamento: 'Comportamento',
      saude: 'Saúde',
      social: 'Aspectos Sociais',
      preferencias_musicais: 'Preferências Musicais'
    }
    return translations[category] || category
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {Object.entries(questionsByCategory).map(([category, questions]) => (
        <Card key={category}>
          <div className="p-3">
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              {translateCategory(category)}
            </h3>
            <div className="space-y-3">
              {questions.map((question) => (
                <div key={question.id} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {question.question}
                  </label>
                  {question.type === 'text' && (
                    <textarea
                      className="w-full p-1.5 border rounded-md resize-none text-sm"
                      rows={2}
                      value={formData[question.id] as string || ''}
                      onChange={(e) => handleInputChange(question.id, e.target.value)}
                      placeholder="Digite aqui..."
                    />
                  )}
                  {question.type === 'single' && (
                    <select
                      className="w-full p-1.5 border rounded-md bg-white text-sm"
                      value={formData[question.id] as string || ''}
                      onChange={(e) => handleInputChange(question.id, e.target.value)}
                    >
                      <option value="">Selecione...</option>
                      {question.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                  {question.type === 'multiple' && (
                    <div className="grid grid-cols-2 gap-1.5 text-sm">
                      {question.options?.map((option) => (
                        <label key={option} className="flex items-center gap-1.5">
                          <input
                            type="checkbox"
                            checked={Array.isArray(formData[question.id]) && formData[question.id].includes(option)}
                            onChange={(e) => {
                              const currentValue = Array.isArray(formData[question.id]) ? formData[question.id] : []
                              const newValue = e.target.checked
                                ? [...currentValue, option]
                                : currentValue.filter(v => v !== option)
                              handleInputChange(question.id, newValue)
                            }}
                            className="rounded border-gray-300 h-3.5 w-3.5"
                          />
                          <span className="text-gray-700 text-sm">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}

      <div className="flex justify-end gap-3 mt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50"
        >
          Cancelar
        </button>
        <AnamnesePDF 
          patient={patient}
          data={formData}
        />
      </div>
    </form>
  )
} 