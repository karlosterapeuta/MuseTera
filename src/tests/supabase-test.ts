import { supabase, supabaseHelpers } from '../lib/supabase'

async function testSupabaseConnection() {
  try {
    // 1. Testar conexão
    console.log('1. Testando conexão com Supabase...')
    const isConnected = await supabaseHelpers.checkSupabaseConnection()
    if (!isConnected) throw new Error('Falha na conexão com Supabase')
    console.log('✅ Conexão estabelecida com sucesso!')

    // 2. Criar paciente de teste
    console.log('\n2. Criando paciente de teste...')
    const patientData = {
      name: 'Paciente Teste',
      birthDate: '2000-01-01',
      phone: '(11) 99999-9999',
      therapistId: '123',
      status: 'active' as const
    }
    const patient = await supabaseHelpers.createPatient(patientData)
    console.log('✅ Paciente criado:', patient)

    // 3. Criar sessão de teste
    console.log('\n3. Criando sessão de teste...')
    const sessionData = {
      patientId: patient.id,
      date: new Date().toISOString(),
      notes: 'Sessão de teste para verificar integração',
      emotional_state: {
        frequency: 600,
        consciousness: 'Paz',
        emotion: 'Felicidade'
      },
      interventions: []
    }
    const session = await supabaseHelpers.createSession(sessionData)
    console.log('✅ Sessão criada:', session)

    // 4. Criar avaliação de teste
    console.log('\n4. Criando avaliação de teste...')
    const assessmentData = {
      patientId: patient.id,
      date: new Date().toISOString(),
      type: 'inicial',
      content: {
        objetivo: 'Teste de integração',
        observacoes: 'Avaliação criada para testar o banco de dados'
      }
    }
    const assessment = await supabaseHelpers.createAssessment(assessmentData)
    console.log('✅ Avaliação criada:', assessment)

    // 5. Buscar dados inseridos
    console.log('\n5. Verificando dados inseridos...')
    const patients = await supabaseHelpers.getPatients()
    const sessions = await supabaseHelpers.getSessionsByPatientId(patient.id)
    const assessments = await supabaseHelpers.getAssessmentsByPatientId(patient.id)

    console.log('✅ Dados recuperados com sucesso!')
    console.log('Total de pacientes:', patients.length)
    console.log('Total de sessões:', sessions.length)
    console.log('Total de avaliações:', assessments.length)

  } catch (error) {
    console.error('❌ Erro durante os testes:', error)
    throw error
  }
}

// Executar os testes
testSupabaseConnection()
