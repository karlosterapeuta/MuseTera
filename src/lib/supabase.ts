import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jztbkimlcrfndooyhohg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6dGJraW1sY3JmbmRvb3lob2hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxMDIzODQsImV4cCI6MjA1MjY3ODM4NH0.Q6nTndaG8t4rOp-Gp0Fo8JTGPfVKLeKJ25ml_5HpVxs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Função helper para verificar a conexão
export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('patients').select('count')
    if (error) throw error
    console.log('Conexão com Supabase estabelecida com sucesso!')
    return true
  } catch (error) {
    console.error('Erro ao conectar com Supabase:', error)
    return false
  }
}

// Tipos para as tabelas principais
export interface Patient {
  id: string
  name: string
  birth_date: string
  contact: string
  responsible: string
  created_at: string
}

export interface Session {
  id: string
  patient_id: string
  date: string
  notes: string
  emotional_state: string
  created_at: string
}

export interface Assessment {
  id: string
  patient_id: string
  date: string
  type: string
  content: any
  created_at: string
}

// Funções helpers para operações comuns
export const supabaseHelpers = {
  // Pacientes
  async getPatients() {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('name')
    if (error) throw error
    return data
  },

  async getPatientById(id: string) {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  // Sessões
  async getSessionsByPatientId(patientId: string) {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('patient_id', patientId)
      .order('date', { ascending: false })
    if (error) throw error
    return data
  },

  // Avaliações
  async getAssessmentsByPatientId(patientId: string) {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('patient_id', patientId)
      .order('date', { ascending: false })
    if (error) throw error
    return data
  },

  // Funções de criação
  async createPatient(patient: Omit<Patient, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('patients')
      .insert([patient])
      .select()
    if (error) throw error
    return data[0]
  },

  async createSession(session: Omit<Session, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('sessions')
      .insert([session])
      .select()
    if (error) throw error
    return data[0]
  },

  async createAssessment(assessment: Omit<Assessment, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('assessments')
      .insert([assessment])
      .select()
    if (error) throw error
    return data[0]
  }
}
