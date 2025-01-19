export function formatarData(data: Date | string | null | undefined): string {
  if (!data) return 'Não informado'
  
  try {
    const date = data instanceof Date ? data : new Date(data)
    if (isNaN(date.getTime())) return 'Data inválida'
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  } catch (error) {
    return 'Data inválida'
  }
}