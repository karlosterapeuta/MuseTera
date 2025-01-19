'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { checkSupabaseConnection, supabase } from '@/lib/supabase'

// Verificar estrutura das tabelas
async function checkTables() {
  const { data: tables, error } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
  
  if (error) {
    console.error('Erro ao verificar tabelas:', error)
    return false
  }

  const requiredTables = ['patients', 'sessions', 'assessments']
  const existingTables = tables.map(t => t.table_name)
  
  console.log('Tabelas existentes:', existingTables)
  
  const missingTables = requiredTables.filter(t => !existingTables.includes(t))
  if (missingTables.length > 0) {
    console.error('Tabelas faltando:', missingTables)
    return false
  }
  
  return true
}

export default async function HomePage() {
  const isConnected = await checkSupabaseConnection()
  const tablesExist = await checkTables()

  if (!isConnected || !tablesExist) {
    return (
      <div className="p-4">
        <h1 className="text-red-600">Erro de Conexão com o Banco de Dados</h1>
        <p>Por favor, verifique se todas as tabelas necessárias estão criadas no Supabase.</p>
      </div>
    )
  }

  const router = useRouter()
  
  useEffect(() => {
    router.push('/login')
  }, [router])
  
  return null
}
