'use client'

import { useSearchParams } from 'next/navigation'
import { RelatorioForm } from '@/components/relatorios/RelatorioForm'
import { useRouter } from 'next/navigation'

export default function NovoRelatorioPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tipo = searchParams.get('tipo') as 'avaliacao_inicial' | 'sessao' | 'evolucao_mensal' | 'evolucao_semestral' | 'reavaliacao' | 'alta' | 'familia' | 'equipe'

  const handleSubmit = async (data: any) => {
    try {
      const relatorios = JSON.parse(localStorage.getItem('relatorios') || '[]')
      relatorios.push({
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      })
      localStorage.setItem('relatorios', JSON.stringify(relatorios))
      
      router.push('/relatorios/lista')
    } catch (error) {
      console.error('Erro ao salvar relatório:', error)
    }
  }

  if (!tipo) {
    router.push('/relatorios')
    return null
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {tipo === 'avaliacao_inicial' ? 'Relatório de Avaliação Inicial' :
           tipo === 'sessao' ? 'Relatório de Sessão' :
           tipo === 'evolucao_mensal' ? 'Relatório de Evolução Mensal' :
           tipo === 'evolucao_semestral' ? 'Relatório de Evolução Semestral' :
           tipo === 'reavaliacao' ? 'Relatório de Reavaliação' :
           tipo === 'alta' ? 'Relatório de Alta' :
           tipo === 'familia' ? 'Relatório para Família' :
           'Relatório para Equipe'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Preencha os campos abaixo para gerar o relatório
        </p>
      </div>

      <RelatorioForm 
        tipo={tipo} 
        onSubmit={handleSubmit}
      />
      <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-3 sm:space-y-0 sm:space-x-reverse">
        <button
          type="button"
          onClick={gerarPDF}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Gerar PDF
        </button>
      </div>
    </div>
  )
} 