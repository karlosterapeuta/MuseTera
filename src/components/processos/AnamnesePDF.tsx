'use client'

import { Patient } from '@/types'
import { AnamneseQuestion, ANAMNESE_QUESTIONS } from '@/types/anamnese'
import jsPDF from 'jspdf'

interface AnamnesePDFProps {
  patient: Patient
  data: Record<string, string | string[]>
}

export function AnamnesePDF({ patient, data }: AnamnesePDFProps) {
  const handleDownload = () => {
    // Criar nova instância do PDF
    const doc = new jsPDF()
    let yPos = 20

    // Recuperar dados do musicoterapeuta
    let profissionalInfo = {
      nome: '',
      registro: ''
    }

    if (typeof window !== 'undefined') {
      const savedProfessional = localStorage.getItem('professional')
      if (savedProfessional) {
        const profissionalData = JSON.parse(savedProfessional)
        profissionalInfo = {
          nome: profissionalData.nome,
          registro: profissionalData.registro
        }
      }
    }

    // Título
    doc.setFontSize(18)
    doc.text('Anamnese Musicoterapêutica', doc.internal.pageSize.getWidth() / 2, yPos, { align: 'center' })
    yPos += 15

    // Data e identificação
    doc.setFontSize(10)
    doc.text(new Date().toLocaleDateString('pt-BR'), doc.internal.pageSize.getWidth() - 20, yPos, { align: 'right' })
    doc.text('MuseTera', doc.internal.pageSize.getWidth() - 20, yPos + 5, { align: 'right' })
    yPos += 20

    // Dados do Paciente
    doc.setFontSize(14)
    doc.text('Dados do Paciente', 20, yPos)
    yPos += 10

    doc.setFontSize(12)
    doc.text(`Nome: ${patient?.name || 'Não informado'}`, 20, yPos)
    yPos += 7
    doc.text(`Data de Nascimento: ${patient?.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('pt-BR') : 'Não informado'}`, 20, yPos)
    yPos += 7
    doc.text(`Contato: ${patient?.contactInfo?.phone || 'Não informado'}`, 20, yPos)
    yPos += 7
    doc.text(`Status: ${patient?.status === 'active' ? 'Ativo' : 'Inativo'}`, 20, yPos)
    yPos += 15

    // Questões da Anamnese
    const questionsByCategory = ANAMNESE_QUESTIONS.reduce((acc, question) => {
      if (!acc[question.category]) {
        acc[question.category] = []
      }
      acc[question.category].push(question)
      return acc
    }, {} as Record<string, AnamneseQuestion[]>)

    Object.entries(questionsByCategory).forEach(([category, questions]) => {
      // Verifica se precisa adicionar nova página
      if (yPos > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage()
        yPos = 20
      }

      // Título da categoria
      doc.setFontSize(14)
      doc.text(translateCategory(category), 20, yPos)
      yPos += 10

      // Questões
      doc.setFontSize(12)
      questions.forEach(question => {
        // Verifica se precisa adicionar nova página
        if (yPos > doc.internal.pageSize.getHeight() - 40) {
          doc.addPage()
          yPos = 20
        }

        // Adiciona o rodapé em cada página
        addFooter(doc, profissionalInfo)

        doc.setFont('helvetica', 'bold')
        doc.text(question.question, 20, yPos)
        yPos += 7

        doc.setFont('helvetica', 'normal')
        const resposta = formatValue(data?.[question.id])
        const linhas = doc.splitTextToSize(resposta, doc.internal.pageSize.getWidth() - 40)
        linhas.forEach((linha: string) => {
          if (yPos > doc.internal.pageSize.getHeight() - 20) {
            doc.addPage()
            yPos = 20
            // Adiciona o rodapé na nova página
            addFooter(doc, profissionalInfo)
          }
          doc.text(linha, 20, yPos)
          yPos += 7
        })
        yPos += 3
      })
      yPos += 10
    })

    // Adiciona o rodapé na última página
    addFooter(doc, profissionalInfo)

    // Salva o PDF
    doc.save(`anamnese_${patient.name.toLowerCase().replace(/\s+/g, '_')}.pdf`)
  }

  return (
    <button
      onClick={handleDownload}
      className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
    >
      Exportar PDF
    </button>
  )
}

function translateCategory(category: string) {
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

function formatValue(value: string | string[] | undefined): string {
  if (!value) return '-'
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  return value
}

function addFooter(doc: jsPDF, profissionalInfo: { nome: string, registro: string }) {
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