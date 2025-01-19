'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, supabaseHelpers } from '@/lib/supabase'

// Verificar estrutura das tabelas
async function checkTables() {
  const { data: tables, error } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .in('table_name', ['patients', 'sessions', 'assessments'])

  if (error) {
    console.error('Erro ao verificar tabelas:', error)
    return false
  }

  const requiredTables = ['patients', 'sessions', 'assessments']
  const existingTables = tables.map(t => t.table_name)
  const missingTables = requiredTables.filter(t => !existingTables.includes(t))

  if (missingTables.length > 0) {
    console.error('Tabelas faltando:', missingTables)
    return false
  }

  return true
}

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    async function checkDatabase() {
      // Verificar conexão com Supabase
      const isConnected = await supabaseHelpers.checkSupabaseConnection()
      if (!isConnected) {
        console.error('Não foi possível conectar ao Supabase')
        return
      }

      // Verificar estrutura do banco de dados
      const tablesOk = await checkTables()
      if (!tablesOk) {
        console.error('Estrutura do banco de dados incorreta')
        return
      }

      console.log('Banco de dados verificado com sucesso!')
    }

    checkDatabase()
  }, [])

  return null
}
