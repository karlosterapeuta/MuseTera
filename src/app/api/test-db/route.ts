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
      notes: 'Sessão de teste',
      emotional_state: 'Neutro'
    }
    const session = await supabaseHelpers.createSession(sessionData)

    // 4. Criar avaliação de teste
    const assessmentData = {
      patient_id: patient.id,
      date: new Date().toISOString(),
      type: 'inicial',
      content: {
        observacoes: 'Avaliação de teste',
        conclusao: 'Teste concluído com sucesso'
      }
    }
    const assessment = await supabaseHelpers.createAssessment(assessmentData)

    return NextResponse.json({
      success: true,
      message: 'Teste completo!',
      data: {
        patient,
        session,
        assessment
      }
    })

  } catch (error) {
    console.error('Erro no teste:', error)
    return NextResponse.json({
      success: false,
      message: error.message || 'Erro interno no servidor',
      error: error
    }, { status: 500 })
  }
}
