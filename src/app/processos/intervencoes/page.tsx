'use client'

import { useState } from 'react'
import { CheckCircleIcon, BeakerIcon } from '@heroicons/react/24/solid'
import jsPDF from 'jspdf'
import { PatientSelect } from '@/components/processos/PatientSelect'
import { Patient } from '@/types'
import { Logo } from '@/components/Logo'

interface Intervencao {
  categoria: string
  atividades: string[]
  objetivos: string[]
}

const intervencoesPredefinidas: Intervencao[] = [
  {
    categoria: 'Re-criação Musical',
    atividades: [
      'Cantar canções familiares do paciente',
      'Tocar instrumentos em grupo (percussão)',
      'Tocar instrumentos em grupo (harmônicos)',
      'Reproduzir ritmos simples',
      'Reproduzir ritmos complexos',
      'Acompanhamento musical com palmas',
      'Regência musical básica',
      'Cantar em diferentes tonalidades',
      'Reproduzir melodias conhecidas',
      'Criar arranjos simples',
      'Participar de coral terapêutico',
      'Praticar respiração com canto',
      'Exercícios de articulação vocal',
      'Jogos musicais em grupo'
    ],
    objetivos: [
      'Desenvolver habilidades motoras finas',
      'Desenvolver habilidades motoras grossas',
      'Promover interação social em grupo',
      'Melhorar coordenação motora',
      'Estimular memória musical de curto prazo',
      'Estimular memória musical de longo prazo',
      'Aumentar capacidade respiratória',
      'Melhorar articulação vocal',
      'Desenvolver senso rítmico',
      'Fortalecer músculos da face e boca',
      'Aumentar amplitude de movimento',
      'Promover expressão emocional',
      'Desenvolver habilidades sociais'
    ]
  },
  {
    categoria: 'Improvisação',
    atividades: [
      'Improvisação vocal livre',
      'Improvisação vocal temática',
      'Improvisação instrumental livre',
      'Improvisação instrumental guiada',
      'Criação de melodias simples',
      'Exploração sonora com objetos',
      'Diálogo musical em dupla',
      'Improvisação em grupo com tema',
      'Criação de paisagens sonoras',
      'Improvisação com loops',
      'Experimentação com diferentes timbres',
      'Improvisação com histórias sonoras',
      'Criação de ritmos corporais',
      'Improvisação com tecnologia musical'
    ],
    objetivos: [
      'Expressar emoções de forma não-verbal',
      'Desenvolver criatividade musical',
      'Aumentar autoconfiança expressiva',
      'Trabalhar comunicação não-verbal',
      'Reduzir ansiedade social',
      'Explorar identidade sonora',
      'Desenvolver escuta ativa',
      'Promover autoexpressão',
      'Estimular imaginação',
      'Trabalhar resolução de problemas',
      'Desenvolver flexibilidade cognitiva',
      'Aumentar repertório expressivo',
      'Melhorar interação social'
    ]
  },
  {
    categoria: 'Composição',
    atividades: [
      'Criação de letras temáticas',
      'Composição melódica guiada',
      'Songwriting terapêutico individual',
      'Songwriting terapêutico em grupo',
      'Paródias de músicas conhecidas',
      'Criação de rap terapêutico',
      'Composição de jingles pessoais',
      'Musicar poesias',
      'Criar histórias musicadas',
      'Composição com tecnologia',
      'Criação de mantras pessoais',
      'Composição de canções de poder',
      'Adaptação de músicas existentes',
      'Criação de músicas para rituais'
    ],
    objetivos: [
      'Processamento emocional profundo',
      'Desenvolvimento cognitivo musical',
      'Expressão de sentimentos complexos',
      'Fortalecimento da identidade pessoal',
      'Desenvolvimento de narrativa pessoal',
      'Integração de experiências',
      'Aumento da autoestima',
      'Desenvolvimento de autonomia',
      'Processamento de trauma',
      'Construção de recursos internos',
      'Desenvolvimento de resiliência',
      'Exploração de valores pessoais',
      'Construção de significado'
    ]
  },
  {
    categoria: 'Audição Musical',
    atividades: [
      'Escuta ativa guiada',
      'Relaxamento com música',
      'Análise lírica terapêutica',
      'Reminiscência musical',
      'Imaginação guiada com música',
      'Meditação musical',
      'Audição de playlists temáticas',
      'Identificação de emoções na música',
      'Escuta corporal',
      'Audição de sons da natureza',
      'Exercícios de discriminação sonora',
      'Viagem musical autobiográfica',
      'Escuta mindful',
      'Análise de elementos musicais'
    ],
    objetivos: [
      'Redução de ansiedade e estresse',
      'Estimulação sensorial auditiva',
      'Processamento de memórias significativas',
      'Regulação emocional através da música',
      'Desenvolvimento de mindfulness',
      'Melhora da concentração',
      'Expansão do repertório musical',
      'Desenvolvimento de preferências musicais',
      'Aumento da consciência corporal',
      'Promoção de relaxamento profundo',
      'Facilitação de introspecção',
      'Desenvolvimento de recursos de coping',
      'Integração sensorial'
    ]
  },
  {
    categoria: 'Técnicas Receptivas',
    atividades: [
      'GIM (Guided Imagery and Music)',
      'Relaxamento Progressivo com Música',
      'Visualização Criativa Musical',
      'Escuta Analítica',
      'Trabalho com Música e Cores',
      'Música e Movimento Consciente',
      'Audição em Estado Alterado',
      'Trabalho com Símbolos Sonoros',
      'Música e Respiração',
      'Experiências Culminantes Musicais',
      'Viagem Sonora Xamânica',
      'Ritual Sonoro Terapêutico',
      'Banho Sonoro',
      'Meditação Sonora'
    ],
    objetivos: [
      'Exploração do inconsciente',
      'Integração mente-corpo',
      'Desenvolvimento espiritual',
      'Expansão da consciência',
      'Processamento simbólico',
      'Cura energética',
      'Transformação pessoal',
      'Conexão com recursos internos',
      'Desenvolvimento da intuição',
      'Integração de polaridades',
      'Abertura para transcendência',
      'Harmonização energética',
      'Desenvolvimento da presença'
    ]
  }
]

export default function IntervencoesPage() {
  const [intervencoesSelecionadas, setIntervencoesSelecionadas] = useState<{
    [categoria: string]: {
      atividades: string[]
      objetivos: string[]
    }
  }>({})

  const [observacoes, setObservacoes] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [data, setData] = useState('')
  const [idade, setIdade] = useState<string>('')

  const toggleAtividade = (categoria: string, atividade: string) => {
    setIntervencoesSelecionadas(prev => {
      const categoriaAtual = prev[categoria] || { atividades: [], objetivos: [] }
      const atividades = categoriaAtual.atividades.includes(atividade)
        ? categoriaAtual.atividades.filter(a => a !== atividade)
        : [...categoriaAtual.atividades, atividade]

      return {
        ...prev,
        [categoria]: {
          ...categoriaAtual,
          atividades
        }
      }
    })
  }

  const toggleObjetivo = (categoria: string, objetivo: string) => {
    setIntervencoesSelecionadas(prev => {
      const categoriaAtual = prev[categoria] || { atividades: [], objetivos: [] }
      const objetivos = categoriaAtual.objetivos.includes(objetivo)
        ? categoriaAtual.objetivos.filter(o => o !== objetivo)
        : [...categoriaAtual.objetivos, objetivo]

      return {
        ...prev,
        [categoria]: {
          ...categoriaAtual,
          objetivos
        }
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPatient) {
      alert('Por favor, selecione um paciente')
      return
    }
    if (!data) {
      alert('Por favor, selecione uma data')
      return
    }
    gerarPDF()
  }

  const gerarPDF = () => {
    const doc = new jsPDF()

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

    // Título do documento
    doc.setFontSize(16)
    doc.text('Registro de Intervenções Musicoterapêuticas', 105, 20, { align: 'center' })

    // Informações do paciente
    doc.setFontSize(12)
    doc.text(`Nome do Paciente: ${selectedPatient?.nome}`, 20, 40)
    doc.text(`Idade: ${idade}`, 20, 50)
    doc.text(`Data: ${data}`, 20, 60)

    // Intervenções selecionadas
    doc.setFontSize(14)
    doc.text('Intervenções Selecionadas', 20, 80)

    let yOffset = 90
    Object.entries(intervencoesSelecionadas).forEach(([categoria, dados]) => {
      doc.setFontSize(12)
      doc.text(`Categoria: ${categoria}`, 20, yOffset)
      yOffset += 10

      if (dados.atividades.length > 0) {
        doc.text('Atividades:', 30, yOffset)
        yOffset += 10
        dados.atividades.forEach(atividade => {
          doc.text(`• ${atividade}`, 40, yOffset)
          yOffset += 7
        })
      }

      if (dados.objetivos.length > 0) {
        yOffset += 5
        doc.text('Objetivos:', 30, yOffset)
        yOffset += 10
        dados.objetivos.forEach(objetivo => {
          doc.text(`• ${objetivo}`, 40, yOffset)
          yOffset += 7
        })
      }

      yOffset += 10
    })

    // Observações
    if (observacoes) {
      doc.text('Observações:', 20, yOffset)
      yOffset += 10
      doc.setFontSize(10)
      const splitObservacoes = doc.splitTextToSize(observacoes, 170)
      doc.text(splitObservacoes, 20, yOffset)
      yOffset += splitObservacoes.length * 7 + 20 // Adiciona espaço extra após as observações
    }

    // Verifica se precisa adicionar nova página
    const pageHeight = doc.internal.pageSize.getHeight()
    if (yOffset > pageHeight - 60) {
      doc.addPage()
      yOffset = 20
    }

    // Adiciona assinatura do profissional no final
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    
    // Adiciona linha para assinatura
    doc.setDrawColor(0)
    const lineY = yOffset + 20
    doc.line(20, lineY, 190, lineY)
    
    // Adiciona informações do profissional
    doc.text(profissionalInfo.nome, 105, lineY + 10, { align: 'center' })
    doc.text(`Musicoterapeuta - MT ${profissionalInfo.registro}`, 105, lineY + 15, { align: 'center' })
    doc.text(new Date().toLocaleDateString('pt-BR'), 105, lineY + 20, { align: 'center' })

    // Salva o PDF
    doc.save(`intervencoes_${selectedPatient?.nome?.toLowerCase().replace(/\s+/g, '_')}_${data}.pdf`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <Logo size="sm" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="flex-grow">
              <PatientSelect
                onSelect={setSelectedPatient}
                selectedId={selectedPatient?.id}
              />
            </div>
            <div className="w-full sm:w-32">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Idade
              </label>
              <input
                type="number"
                value={idade}
                onChange={(e) => setIdade(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Idade"
              />
            </div>
            <div className="w-full sm:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data da Sessão
              </label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {intervencoesPredefinidas.map((intervencao) => (
            <div key={intervencao.categoria} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <BeakerIcon className="h-6 w-6 text-indigo-500 mr-2" />
                {intervencao.categoria}
              </h2>

              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Atividades</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {intervencao.atividades.map((atividade) => (
                    <label
                      key={atividade}
                      className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={intervencoesSelecionadas[intervencao.categoria]?.atividades.includes(atividade)}
                        onChange={() => toggleAtividade(intervencao.categoria, atividade)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{atividade}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Objetivos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {intervencao.objetivos.map((objetivo) => (
                    <label
                      key={objetivo}
                      className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={intervencoesSelecionadas[intervencao.categoria]?.objetivos.includes(objetivo)}
                        onChange={() => toggleObjetivo(intervencao.categoria, objetivo)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{objetivo}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Observações Adicionais</h3>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="w-full h-32 p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Adicione observações específicas sobre as intervenções..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              Baixar PDF
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}