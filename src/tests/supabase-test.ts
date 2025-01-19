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
      birth_date: '2000-01-01',
      contact: '(11) 99999-9999',
      responsible: 'Responsável Teste'
    }
    const patient = await supabaseHelpers.createPatient(patientData)
    console.log('✅ Paciente criado:', patient)

    // 3. Criar sessão de teste
    console.log('\n3. Criando sessão de teste...')
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
    console.log('✅ Sessão criada:', session)

    // 4. Criar avaliação de teste
    console.log('\n4. Criando avaliação de teste...')
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
    console.log('✅ Avaliação criada:', assessment)

    // 5. Buscar dados inseridos
    console.log('\n5. Buscando dados inseridos...')
    const patients = await supabaseHelpers.getPatients()
    console.log('✅ Pacientes encontrados:', patients.length)
    
    const sessions = await supabaseHelpers.getSessionsByPatientId(patient.id)
    console.log('✅ Sessões do paciente:', sessions.length)
    
    const assessments = await supabaseHelpers.getAssessmentsByPatientId(patient.id)
    console.log('✅ Avaliações do paciente:', assessments.length)

    console.log('\n✨ Todos os testes completados com sucesso!')
    return true

  } catch (error) {
    console.error('❌ Erro durante os testes:', error)
    return false
  }
}

// Executar os testes
testSupabaseConnection()
