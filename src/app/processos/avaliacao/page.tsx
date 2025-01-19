'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/Card'
import { PatientSelect } from '@/components/processos/PatientSelect'
import { Patient } from '@/types'
import { formatarData } from '@/utils/formatters'
import { ClipboardDocumentCheckIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline'
import jsPDF from 'jspdf'
import { ResultadosGraficos } from '@/components/processos/ResultadosGraficos'
import { ESCALA_DEMUCA } from '@/data/escalaDemuca'
import html2canvas from 'html2canvas'
import { Logo } from '@/components/Logo'
import Image from 'next/image'
import Script from 'next/script'

const calcularPontuacao = (categoria: typeof ESCALA_DEMUCA[0], avaliacoes: Record<string, string>) => {
  let total = 0
  
  categoria.parametros.forEach(parametro => {
    const nomeParametro = typeof parametro === 'string' ? parametro : parametro.nome
    const resposta = avaliacoes[nomeParametro]
    if (!resposta) return

    let pontos = 0
    if (resposta === 'nao') pontos = categoria.escala.nao
    if (resposta === 'pouco') pontos = categoria.escala.pouco
    if (resposta === 'muito') pontos = categoria.escala.muito

    // Aplica multiplicador se existir
    if (typeof parametro === 'object' && parametro.multiplicador) {
      pontos *= parametro.multiplicador
    }

    total += pontos
  })

  return total
}

const calcularPorcentagens = (avaliacoes: Record<string, string>) => {
  const habilidades = []
  const categorias = []

  ESCALA_DEMUCA.forEach(categoria => {
    const pontuacao = calcularPontuacao(categoria, avaliacoes)
    const totalPontos = categoria.escala.nao + categoria.escala.pouco + categoria.escala.muito
    const porcentagem = (pontuacao / totalPontos) * 100

    categorias.push({ name: categoria.categoria, value: porcentagem.toFixed(2) })

    categoria.parametros.forEach(parametro => {
      const nome = typeof parametro === 'string' ? parametro : parametro.nome
      const valor = avaliacoes[nome] || 'Não avaliado'
      const pontos = valor === 'nao' ? categoria.escala.nao : valor === 'pouco' ? categoria.escala.pouco : categoria.escala.muito
      const porcentagem = (pontos / totalPontos) * 100

      habilidades.push({ name: nome, value: porcentagem.toFixed(2) })
    })
  })

  return { habilidades, categorias }
}

const loadImage = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(img, 0, 0)
      resolve(canvas.toDataURL())
    }
    img.onerror = reject
    img.src = url
  })
}

export default function AvaliacaoPage() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [avaliacoes, setAvaliacoes] = useState<Record<string, string>>({})
  const [observacoes, setObservacoes] = useState('')
  const pieChartRef = useRef<HTMLDivElement>(null)
  const barChartRef = useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = useState(false)
  const [scriptsLoaded, setScriptsLoaded] = useState({
    jspdf: false,
    autotable: false,
    html2canvas: false
  })

  const handleScriptsLoad = (scriptName: 'jspdf' | 'autotable' | 'html2canvas') => {
    setScriptsLoaded(prev => ({
      ...prev,
      [scriptName]: true
    }))
  }

  useEffect(() => {
    if (scriptsLoaded.jspdf && scriptsLoaded.autotable && scriptsLoaded.html2canvas) {
      setIsReady(true)
    }
  }, [scriptsLoaded])

  const gerarPDF = async () => {
    if (!selectedPatient) {
      alert('Por favor, selecione um paciente antes de gerar o PDF.')
      return
    }

    try {
      const doc = new jsPDF()

      // Adiciona a logo
      try {
        const response = await fetch('/logo-musicoterapia.png')
        const blob = await response.blob()
        const reader = new FileReader()
        
        await new Promise((resolve) => {
          reader.onload = () => {
            if (reader.result) {
              doc.addImage(reader.result as string, 'PNG', 10, 10, 20, 20)
            }
            resolve(null)
          }
          reader.readAsDataURL(blob)
        })
      } catch (error) {
        console.error('Erro ao carregar a logo:', error)
      }

      // Recuperar dados do musicoterapeuta
      let profissionalInfo = {
        nome: '',
        registro: ''
      }

      const savedProfessional = localStorage.getItem('professional')
      if (savedProfessional) {
        const profissionalData = JSON.parse(savedProfessional)
        profissionalInfo = {
          nome: profissionalData.nome,
          registro: profissionalData.registro
        }
      }

      // Função auxiliar para adicionar retângulo com cor de fundo
      const addColoredRect = (y: number, height: number, color: string) => {
        doc.setFillColor(color)
        doc.rect(0, y, doc.internal.pageSize.getWidth(), height, 'F')
      }

      // Função para adicionar o rodapé
      const addFooter = () => {
        const pageHeight = doc.internal.pageSize.getHeight()
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        
        // Adiciona linha horizontal
        doc.setDrawColor(200, 200, 200) // cor cinza claro
        doc.line(20, pageHeight - 25, doc.internal.pageSize.getWidth() - 20, pageHeight - 25)
        
        // Centraliza o texto do rodapé
        const footerText = [
          profissionalInfo.nome,
          `Musicoterapeuta - MT ${profissionalInfo.registro}`,
          new Date().toLocaleDateString('pt-BR')
        ]
        
        footerText.forEach((text, index) => {
          const textWidth = doc.getStringUnitWidth(text) * 10 / doc.internal.scaleFactor
          const x = (doc.internal.pageSize.getWidth() - textWidth) / 2
          doc.text(text, x, pageHeight - 20 + (index * 5))
        })
      }

      // Cabeçalho
      addColoredRect(0, 60, '#f3f4f6')
      doc.setFontSize(24)
      doc.setTextColor('#1f2937')
      doc.text('ESCALA PARA AVALIAÇÃO TEA', 105, 35, { align: 'center' })
        
      let yPos = 70 // Começa o conteúdo após o cabeçalho

      // Informações do paciente
      doc.setFillColor('#ffffff')
      doc.setDrawColor('#e5e7eb')
      doc.roundedRect(10, yPos, doc.internal.pageSize.getWidth() - 20, 40, 3, 3, 'FD')
      
      doc.setFontSize(12)
      doc.setTextColor('#374151')
      yPos += 15
      doc.text(`Paciente: ${selectedPatient?.nome || 'Não informado'}`, 20, yPos)
      yPos += 10
      doc.text(`Data de Nascimento: ${formatarData(selectedPatient?.dataNascimento)}`, 20, yPos)
      doc.text(`Data da Avaliação: ${new Date().toLocaleDateString()}`, doc.internal.pageSize.getWidth() - 20, yPos, { align: 'right' })
      
      yPos += 25

      // Resultados da avaliação
      doc.setFontSize(16)
      doc.setTextColor('#1f2937')
      doc.text('Resultados da Avaliação', 105, yPos, { align: 'center' })
      
      yPos += 15

      // Adiciona os resultados de cada categoria
      ESCALA_DEMUCA.forEach((categoria, index) => {
        // Adiciona fundo alternado para cada categoria
        const isEven = index % 2 === 0
        addColoredRect(yPos - 5, 25, isEven ? '#f9fafb' : '#ffffff')

        doc.setFontSize(14)
        doc.setTextColor('#1f2937')
        doc.text(categoria.categoria, 20, yPos)
        
        yPos += 10
        doc.setFontSize(10)
        doc.setTextColor('#4b5563')

        categoria.parametros.forEach(parametro => {
          const nome = typeof parametro === 'string' ? parametro : parametro.nome
          const multiplicador = typeof parametro === 'string' ? '' : ' (2x)'
          const valor = avaliacoes[nome] || 'Não avaliado'

          // Cria uma caixa para cada resposta
          const text = `${nome}${multiplicador}: ${valor}`
          doc.setDrawColor('#e5e7eb')
          doc.setFillColor('#ffffff')
          doc.roundedRect(30, yPos - 4, 150, 8, 1, 1, 'FD')
          doc.text(text, 35, yPos)

          yPos += 10

          // Adiciona nova página se necessário
          if (yPos > doc.internal.pageSize.getHeight() - 20) {
            doc.addPage()
            yPos = 20
            addFooter()
          }
        })
        yPos += 5
      })

      // Nova página para os gráficos
      doc.addPage()
      yPos = 20

      // Título da página de gráficos
      addColoredRect(0, 40, '#f3f4f6')
      doc.setFontSize(20)
      doc.setTextColor('#1f2937')
      doc.text('Visualização Gráfica dos Resultados', 105, 25, { align: 'center' })

      // Captura e adiciona o gráfico de pizza
      if (pieChartRef.current) {
        const pieCanvas = await html2canvas(pieChartRef.current)
        const pieImgData = pieCanvas.toDataURL('image/png')
        doc.addImage(pieImgData, 'PNG', 20, 50, 170, 100)
      }

      // Captura e adiciona o gráfico de barras
      if (barChartRef.current) {
        const barCanvas = await html2canvas(barChartRef.current)
        const barImgData = barCanvas.toDataURL('image/png')
        doc.addImage(barImgData, 'PNG', 20, 160, 170, 100)
      }

      // Rodapé
      const yPosAssinatura = doc.internal.pageSize.getHeight() - 40
      addColoredRect(yPosAssinatura, 40, '#f3f4f6')
      doc.setFontSize(10)
      doc.setTextColor('#4b5563')
      doc.text('_'.repeat(50), 20, yPosAssinatura + 15)

      // Adiciona o rodapé em todas as páginas
      const totalPages = doc.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)
        addFooter()
      }

      // Salva o PDF
      const nomeArquivo = `avaliacao_${selectedPatient?.nome?.toLowerCase().replace(/\s+/g, '_') || 'sem_nome'}_${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(nomeArquivo)
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      alert('Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.')
    }
  }

  const handleAvaliacaoChange = (parametro: string, valor: string) => {
    setAvaliacoes(prev => ({
      ...prev,
      [parametro]: valor
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <Script src="https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js" onLoad={() => handleScriptsLoad('jspdf')} />
      <Script src="https://unpkg.com/jspdf-autotable@3.5.25/dist/jspdf-autotable.min.js" onLoad={() => handleScriptsLoad('autotable')} />
      <Script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js" onLoad={() => handleScriptsLoad('html2canvas')} />
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div className="logo-mt">
            <Logo />
          </div>
        </div>

        <Card>
          <div className="p-4 sm:p-6 md:p-8">
            <div className="space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="w-full">
                      <PatientSelect
                        onSelect={setSelectedPatient}
                        selectedId={selectedPatient?.id}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Número da Avaliação
                  </label>
                  <div className="relative">
                    <select
                      value={'1'}
                      onChange={(e) => {}}
                      className="block w-full rounded-lg border-gray-300 py-2.5 pl-3 pr-10 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="1">Avaliação 1</option>
                      <option value="2">Avaliação 2</option>
                      <option value="3">Avaliação 3</option>
                      <option value="4">Avaliação 4</option>
                      <option value="5">Avaliação 5</option>
                    </select>
                  </div>
                </div>
              </div>

              {selectedPatient && (
                <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                          {selectedPatient.nome}
                        </h3>
                        <p className="mt-1 text-xs sm:text-sm text-gray-600">
                          Data de Nascimento: {formatarData(selectedPatient.dataNascimento)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 bg-indigo-50 px-2 sm:px-3 py-1.5 rounded-lg">
                        <ClipboardDocumentCheckIcon className="h-4 sm:h-5 w-4 sm:w-5 text-indigo-600" />
                        <span className="text-xs sm:text-sm font-medium text-indigo-700">Avaliação 1</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {ESCALA_DEMUCA.map((categoria, categoriaIndex) => (
                      <div key={categoriaIndex} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="bg-gray-100 p-3 sm:p-4 border-b border-gray-200">
                          <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                            {categoria.categoria}
                          </h3>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                              <tr className="bg-gray-50">
                                <th scope="col" className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 w-2/4">
                                  Parâmetros
                                </th>
                                <th scope="col" className="px-2 sm:px-3 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold text-gray-900">
                                  Não
                                </th>
                                <th scope="col" className="px-2 sm:px-3 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold text-gray-900">
                                  Pouco
                                </th>
                                <th scope="col" className="px-2 sm:px-3 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold text-gray-900">
                                  Muito
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                              {categoria.parametros.map((parametro, index) => (
                                <tr 
                                  key={typeof parametro === 'string' ? parametro : parametro.nome}
                                  className="hover:bg-gray-50 transition-colors duration-150"
                                >
                                  <td className="whitespace-normal px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm text-gray-700">
                                    <div className="flex items-center gap-1 sm:gap-2">
                                      <span>{typeof parametro === 'string' ? parametro : parametro.nome}</span>
                                      {typeof parametro === 'object' && parametro.multiplicador === 2 && (
                                        <span className="inline-flex items-center rounded-md bg-red-50 px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                                          x2
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  {['nao', 'pouco', 'muito'].map((valor) => (
                                    <td key={valor} className="whitespace-normal px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm text-center">
                                      <div className="flex justify-center">
                                        <input
                                          type="radio"
                                          name={typeof parametro === 'string' ? parametro : parametro.nome}
                                          value={valor}
                                          checked={avaliacoes[typeof parametro === 'string' ? parametro : parametro.nome] === valor}
                                          onChange={() => handleAvaliacaoChange(typeof parametro === 'string' ? parametro : parametro.nome, valor)}
                                          className={`w-4 sm:w-5 h-4 sm:h-5 cursor-pointer appearance-none rounded-full transition-all duration-200 ease-in-out
                                            ${valor === 'nao' 
                                              ? `border-2 border-red-500 ${
                                                  avaliacoes[typeof parametro === 'string' ? parametro : parametro.nome] === valor 
                                                    ? 'bg-red-500 ring-2 ring-red-200' 
                                                    : 'bg-white hover:bg-red-50'
                                                }` 
                                              : valor === 'pouco'
                                              ? `border-2 border-yellow-500 ${
                                                  avaliacoes[typeof parametro === 'string' ? parametro : parametro.nome] === valor 
                                                    ? 'bg-yellow-500 ring-2 ring-yellow-200' 
                                                    : 'bg-white hover:bg-yellow-50'
                                                }`
                                              : `border-2 border-green-500 ${
                                                  avaliacoes[typeof parametro === 'string' ? parametro : parametro.nome] === valor 
                                                    ? 'bg-green-500 ring-2 ring-green-200' 
                                                    : 'bg-white hover:bg-green-50'
                                                }`
                                            }`}
                                        />
                                      </div>
                                    </td>
                                  ))}
                                </tr>
                              ))}
                              <tr className="bg-gray-50">
                                <td className="whitespace-normal px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 text-right">
                                  Pontuação
                                </td>
                                <td className="whitespace-normal px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-900 text-center">
                                  {categoria.escala.nao}
                                </td>
                                <td className="whitespace-normal px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-900 text-center">
                                  {categoria.escala.pouco}
                                </td>
                                <td className="whitespace-normal px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-900 text-center">
                                  {categoria.escala.muito}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-6 sm:mt-8">
                    <button
                      type="button"
                      className="w-full sm:w-auto inline-flex items-center justify-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
      {selectedPatient && <ResultadosGraficos avaliacoes={avaliacoes} pieChartRef={pieChartRef} barChartRef={barChartRef}/>}
    </div>
  )
}