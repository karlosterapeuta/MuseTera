import { NextResponse } from 'next/server'
import { supabaseHelpers } from '@/lib/supabase'

export async function GET() {
  try {
    // 1. Testar conexão
    console.log('1. Testando conexão com Supabase...')
    const isConnected = await supabaseHelpers.checkSupabaseConnection()
    if (!isConnected) throw new Error('Falha na conexão com Supabase')

    // 2. Criar paciente de teste
    const patientData = {
      name: 'Paciente Teste',
      birth_date: '2000-01-01',
      contact: '(11) 99999-9999',
      responsible: 'Responsável Teste'
    }
    const patient = await supabaseHelpers.createPatient(patientData)

    // 3. Criar sessão de teste
    const sessionData = {
      patient_id: patient.id,
      date: new Date().toISOString(),
      notes: 'Sessão de teste para verificar integração',
      emotional_state: {
        frequency: 600,
        consciousness: 'Paz',
        emotion: 'Felicidade'
      }
    }
    const session = await supabaseHelpers.createSession(sessionData)

    // 4. Criar avaliação de teste
    const assessmentData = {
      patient_id: patient.id,
      date: new Date().toISOString(),
      type: 'inicial',
      content: {
        objetivo: 'Teste de integração',
        observacoes: 'Avaliação criada para testar o banco de dados'
      }
    }
    const assessment = await supabaseHelpers.createAssessment(assessmentData)

    // 5. Buscar dados inseridos
    const patients = await supabaseHelpers.getPatients()
    const sessions = await supabaseHelpers.getSessionsByPatientId(patient.id)
    const assessments = await supabaseHelpers.getAssessmentsByPatientId(patient.id)

    return NextResponse.json({
      success: true,
      data: {
        patient,
        session,
        assessment,
        counts: {
          patients: patients.length,
          sessions: sessions.length,
          assessments: assessments.length
        }
      }
    })

  } catch (error) {
    console.error('Erro durante os testes:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
