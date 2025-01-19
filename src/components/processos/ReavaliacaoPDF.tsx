'use client'

import { Patient } from '@/types'
import { ReavaliacaoQuestion, REAVALIACAO_QUESTIONS } from '@/types/reavaliacao'
import jsPDF from 'jspdf'

interface ReavaliacaoPDFProps {
  patient: Patient
  data: Record<string, string | string[]>
  idade: string
}

export function ReavaliacaoPDF({ patient, data, idade }: ReavaliacaoPDFProps) {
  const handleDownload = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault() // Previne a navegação padrão
    
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
    
    // Título
    doc.setFontSize(18)
    doc.text('Reavaliação Musicoterapêutica', doc.internal.pageSize.getWidth() / 2, yPos, { align: 'center' })
    yPos += 15

    // Data e identificação
    doc.setFontSize(10)
    doc.text(new Date().toLocaleDateString('pt-BR'), doc.internal.pageSize.getWidth() - 20, yPos, { align: 'right' })
    doc.text('MuseTera', doc.internal.pageSize.getWidth() - 20, yPos + 5, { align: 'right' })
    yPos += 20

    // Dados do Paciente
    doc.setFontSize(14)
    doc.text('Dados do Paciente', 20, yPos)
    yPos += 15
    
    doc.setFontSize(12)
    doc.text(`Nome: ${patient?.nome || 'Não informado'}`, 20, yPos)
    yPos += 10
    doc.text(`Idade: ${idade || 'Não informada'} anos`, 20, yPos)
    yPos += 15

    // Questões da Reavaliação
    doc.setFontSize(14)
    doc.text('Questões da Reavaliação', 20, yPos)
    yPos += 10

    REAVALIACAO_QUESTIONS.forEach((question) => {
      if (yPos > doc.internal.pageSize.getHeight() - 40) {
        addFooter() // Adiciona rodapé antes de criar nova página
        doc.addPage()
        yPos = 20
      }

      doc.setFontSize(12)
      doc.text(question.question, 20, yPos)
      yPos += 10

      // Resposta
      doc.setFontSize(10)
      const resposta = data[question.id]?.toString() || 'Não respondido'
      const respostaLinhas = doc.splitTextToSize(resposta, 170)
      respostaLinhas.forEach((linha: string) => {
        if (yPos > doc.internal.pageSize.getHeight() - 40) {
          addFooter() // Adiciona rodapé antes de criar nova página
          doc.addPage()
          yPos = 20
        }
        doc.text(linha, 30, yPos)
        yPos += 7
      })
      yPos += 5
    })

    // Adiciona rodapé na última página
    addFooter()

    // Salva o PDF
    doc.save(`reavaliacao_${patient?.nome ? patient.nome.toLowerCase().replace(/\s+/g, '_') : 'sem_nome'}.pdf`)
  }

  return (
    <button
      onClick={handleDownload}
      type="button"
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Exportar PDF
    </button>
  )
}

export default ReavaliacaoPDF