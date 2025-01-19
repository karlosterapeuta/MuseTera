'use client'

import { useRef } from 'react'
import { Patient } from '@/types'
import jsPDF from 'jspdf'

interface RelatorioPDFProps {
  data: any
  patient: Patient
  tipo: string
  onExport?: () => void
}

export function RelatorioPDF({ data, patient, tipo, onExport }: RelatorioPDFProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  const formatarData = (data: Date): string => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(data)
  }

  const getTipoRelatorio = (tipo: string): string => {
    const tipos: Record<string, string> = {
      sessao: 'Relatório de Sessão',
      evolucao_mensal: 'Relatório de Evolução Mensal',
      evolucao_semestral: 'Relatório de Evolução Semestral',
      avaliacao: 'Relatório de Avaliação',
      alta: 'Relatório de Alta',
      familia: 'Relatório para Família',
      equipe: 'Relatório para Equipe'
    }
    return tipos[tipo] || tipo
  }

  const renderParecerMusicoterapeutico = (doc: jsPDF, data: any, yPos: number): number => {
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('PARECER MUSICOTERAPICO CLÍNICO', doc.internal.pageSize.getWidth() / 2, yPos, { align: 'center' })
    yPos += 15

    // Cabeçalho
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('Musicoterapeuta', 20, yPos)
    yPos += 7
    doc.text('José Batista da Silva Filho – AMTPE 100-1', 20, yPos)
    yPos += 7
    doc.text(`Paciente: ${data.paciente || 'Isaac Luiz Trajano da Silva'}`, 20, yPos)
    yPos += 15

    // Introdução
    const introducaoText = "Isaac Luiz, Iniciou os atendimentos de musicoterapia no inicio de julho de 2024, as sessões eram realizadas 1 vez por semana que passou a ser quinzenal com duração de 30 minutos. As intervenções, objetivam estimular e promover o desenvolvimento cognitivo da criança, bem como desenvolver raciocínio lógico, através de motivos ritimicos e melodicos que sob a direção do terapeuta realiza a sonorização das mesmas, juntamente com o paciente. Utilizamos, xilofone, teclado, ukulele e sinos coloridos realizando o pareamento de cores e trabalhando outras questoes como: foco atencional, atenção sustentada e atendimento de comandos. Esta abordagem, promove a comunicação e expressão através de associações visuais e auditivas."
    const linhasIntroducao = doc.splitTextToSize(introducaoText, doc.internal.pageSize.getWidth() - 40)
    doc.text(linhasIntroducao, 20, yPos)
    yPos += linhasIntroducao.length * 7 + 10

    // Habilidades Cognitivas
    const habilidadesText = "Em relação às habilidades cognitivas, Isaac já consegue manter o foco nas demandas propostas na sessão musicoterapia, associando diferentes informações. Estas funções executivas são de suma importância para as atividades da vida diária e escolares, porque oportuniza o controle emocional e auto regulação da conduta."
    const linhasHabilidades = doc.splitTextToSize(habilidadesText, doc.internal.pageSize.getWidth() - 40)
    doc.text(linhasHabilidades, 20, yPos)
    yPos += linhasHabilidades.length * 7 + 10

    // Participação
    const participacaoText = "Isaac Luiz, participa das propostas que trazemos nos atendimentos atingindo bons resultados na sessão que ampliam o seu desenvolvimento global e execução das propostas musicoterápicas, porém, ainda é necessário dar continuidade ao atendimento para seu desenvolvimento cognitivo."
    const linhasParticipacao = doc.splitTextToSize(participacaoText, doc.internal.pageSize.getWidth() - 40)
    doc.text(linhasParticipacao, 20, yPos)
    yPos += linhasParticipacao.length * 7 + 10

    // Conclusão
    const conclusaoText = "Diante das informações apresentadas acima, o paciente Isaac exibe evolução do quadro clínico e vem apresentando respostas aos estímulos oferecidos durante as sessões de musicoterapia. É sugerido a continuidade das terapias, para potencializar as habilidades comunicativas e sociais visando o alcance de melhores prognósticos."
    const linhasConclusao = doc.splitTextToSize(conclusaoText, doc.internal.pageSize.getWidth() - 40)
    doc.text(linhasConclusao, 20, yPos)
    yPos += linhasConclusao.length * 7 + 10

    return yPos
  }

  const handleDownload = () => {
    const doc = new jsPDF()
    let yPos = 20

    // Função para adicionar o rodapé
    const addFooter = () => {
      const footerText = "Karlos Eduardo Teixeira - Musicoterapeuta - Registro Profissional: 0066/22MT-UBAM"
      const pageHeight = doc.internal.pageSize.getHeight()
      
      // Adicionar linha separadora
      doc.setDrawColor(0)
      doc.line(20, pageHeight - 25, doc.internal.pageSize.getWidth() - 20, pageHeight - 25)
      
      // Adicionar texto do rodapé
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(footerText, doc.internal.pageSize.getWidth() / 2, pageHeight - 15, { align: 'center' })
    }

    // Configurações de fonte e tamanho
    doc.setFont('helvetica')
    
    if (tipo === 'parecer') {
      yPos = renderParecerMusicoterapeutico(doc, data, yPos)
    } else {
      // Título
      doc.setFontSize(18)
      doc.text(getTipoRelatorio(tipo), doc.internal.pageSize.getWidth() / 2, yPos, { align: 'center' })
      yPos += 15

      // Data
      doc.setFontSize(12)
      doc.text(`Data: ${formatarData(new Date())}`, doc.internal.pageSize.getWidth() / 2, yPos, { align: 'center' })
      yPos += 20

      // Dados do Paciente
      doc.setFontSize(14)
      doc.text('Dados do Paciente', 20, yPos)
      yPos += 10

      doc.setFontSize(12)
      doc.text(`Nome: ${patient.name}`, 20, yPos)
      yPos += 7
      doc.text(`Data de Nascimento: ${formatarData(patient.dateOfBirth)}`, 20, yPos)
      yPos += 15

      // Conteúdo do Relatório
      Object.entries(data).forEach(([secao, campos]: [string, any]) => {
        if (typeof campos === 'object' && campos !== null) {
          // Verifica se precisa adicionar nova página
          if (yPos > doc.internal.pageSize.getHeight() - 40) {
            addFooter() // Adiciona rodapé antes de criar nova página
            doc.addPage()
            yPos = 20
          }

          // Título da seção
          doc.setFontSize(14)
          doc.setFont('helvetica', 'bold')
          doc.text(secao, 20, yPos)
          yPos += 10

          // Campos da seção
          doc.setFontSize(12)
          doc.setFont('helvetica', 'normal')
          Object.entries(campos).forEach(([campo, valor]: [string, any]) => {
            if (valor) {
              // Verifica se precisa adicionar nova página
              if (yPos > doc.internal.pageSize.getHeight() - 40) {
                addFooter() // Adiciona rodapé antes de criar nova página
                doc.addPage()
                yPos = 20
              }

              // Se for array, junta os itens com vírgula
              const textoValor = Array.isArray(valor) ? valor.join(', ') : valor.toString()
              
              // Quebra o texto em linhas se for muito longo
              const linhas = doc.splitTextToSize(textoValor, doc.internal.pageSize.getWidth() - 40)
              
              doc.setFont('helvetica', 'bold')
              doc.text(`${campo}: `, 20, yPos)
              
              // Calcula a largura do label para posicionar o valor
              const labelWidth = doc.getTextWidth(`${campo}: `)
              
              doc.setFont('helvetica', 'normal')
              linhas.forEach((linha: string) => {
                if (yPos > doc.internal.pageSize.getHeight() - 40) {
                  addFooter() // Adiciona rodapé antes de criar nova página
                  doc.addPage()
                  yPos = 20
                }
                doc.text(linha, 20 + labelWidth, yPos)
                yPos += 7
              })
              
              yPos += 3
            }
          })
          yPos += 10
        }
      })

      // Adiciona rodapé na última página
      addFooter()
    }

    // Salvar o PDF
    doc.save(`relatorio_${patient.name.toLowerCase().replace(/ /g, '_')}.pdf`)
    
    if (onExport) {
      onExport()
    }
  }

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
    >
      <span className="material-icons text-xl">picture_as_pdf</span>
      Exportar PDF
    </button>
  )
}