export interface EmotionalLevel {
  frequency: number;
  consciousness: string;
  emotion: string;
  category: 'OMEGA' | 'EXPANSAO' | 'NEUTRALIDADE' | 'CONTRACAO' | 'ALFA';
  description: string;
  musicalRecommendation: string;
  brazilianExamples: string[];
}

export const HAWKINS_LEVELS: EmotionalLevel[] = [
  {
    frequency: 700,
    consciousness: 'Iluminação (Consciência maior)',
    emotion: 'Indescritível',
    category: 'OMEGA',
    description: 'Estado de consciência expandida e conexão universal',
    musicalRecommendation: 'Mantras sagrados, músicas de meditação profunda e sons binaurais em frequências elevadas (700-1000Hz)',
    brazilianExamples: [
      'Música "Om" - Snatam Kaur (versão brasileira)',
      'Mantras Guarani tradicionais',
      'Sons da Floresta Amazônica (frequências naturais)',
      'Aquarela do Brasil - Ary Barroso',
      'Garota de Ipanema - Tom Jobim'
    ]
  },
  {
    frequency: 600,
    consciousness: 'Paz',
    emotion: 'Felicidade',
    category: 'EXPANSAO',
    description: 'Estado de tranquilidade profunda e contentamento',
    musicalRecommendation: 'Músicas com frequências de 700Hz para elevar ainda mais o estado de paz e harmonia',
    brazilianExamples: [
      'Águas de Março - Tom Jobim',
      'Tarde em Itapoã - Vinicius de Moraes',
      'Chega de Saudade - João Gilberto',
      'Manhã de Carnaval - Luiz Bonfá',
      'Samba em Prelúdio - Baden Powell e Vinicius de Moraes'
    ]
  },
  {
    frequency: 540,
    consciousness: 'Alegria',
    emotion: 'Serenidade',
    category: 'EXPANSAO',
    description: 'Sensação de bem-estar e harmonia',
    musicalRecommendation: 'Músicas com frequências de 600Hz para amplificar a serenidade e alcançar estados mais elevados',
    brazilianExamples: [
      'Mas Que Nada - Jorge Ben Jor',
      'Deixa a Vida Me Levar - Zeca Pagodinho',
      'País Tropical - Jorge Ben Jor',
      'Taj Mahal - Jorge Ben Jor',
      'Malandro é Malandro e Mané é Mané - Bezerra da Silva'
    ]
  },
  {
    frequency: 500,
    consciousness: 'Amor',
    emotion: 'Reverência',
    category: 'EXPANSAO',
    description: 'Sentimento de amor incondicional e compaixão',
    musicalRecommendation: 'Músicas com frequências de 540-600Hz para potencializar o amor e expandir a consciência',
    brazilianExamples: [
      'Maria Maria - Milton Nascimento',
      'Cálice - Chico Buarque',
      'O Que Foi Feito Devera - Milton Nascimento',
      'Amor de Índio - Beto Guedes',
      'Caçador de Mim - Milton Nascimento'
    ]
  },
  {
    frequency: 400,
    consciousness: 'Razão',
    emotion: 'Compreensão',
    category: 'EXPANSAO',
    description: 'Capacidade de análise e entendimento claro',
    musicalRecommendation: 'Músicas com frequências de 500Hz para elevar a compreensão ao nível do amor universal',
    brazilianExamples: [
      'Construção - Chico Buarque',
      'Metamorfose Ambulante - Raul Seixas',
      'Paciência - Lenine',
      'Sampa - Caetano Veloso',
      'Resposta ao Tempo - Nana Caymmi'
    ]
  },
  {
    frequency: 350,
    consciousness: 'Aceitação',
    emotion: 'Perdão',
    category: 'EXPANSAO',
    description: 'Estado de aceitação e perdão',
    musicalRecommendation: 'Músicas com frequências de 400-500Hz para transformar aceitação em compreensão e amor',
    brazilianExamples: [
      'O Que É, O Que É? - Gonzaguinha',
      'Tocando em Frente - Almir Sater',
      'Romaria - Renato Teixeira',
      'Força Estranha - Caetano Veloso',
      'Dias Melhores - Jota Quest'
    ]
  },
  {
    frequency: 310,
    consciousness: 'Boa vontade',
    emotion: 'Otimista',
    category: 'EXPANSAO',
    description: 'Disposição positiva e otimismo',
    musicalRecommendation: 'Músicas com frequências de 350-400Hz para elevar a boa vontade à aceitação plena',
    brazilianExamples: [
      'O Sol - Jota Quest',
      'Tempos Modernos - Lulu Santos',
      'Pra Não Dizer Que Não Falei das Flores - Geraldo Vandré',
      'Enquanto Houver Sol - Titãs',
      'Andança - Beth Carvalho'
    ]
  },
  {
    frequency: 250,
    consciousness: 'Neutralidade',
    emotion: 'Verdadeiro',
    category: 'NEUTRALIDADE',
    description: 'Estado de equilíbrio e clareza',
    musicalRecommendation: 'Músicas com frequências de 310-350Hz para transformar neutralidade em boa vontade e aceitação',
    brazilianExamples: [
      'Como Nossos Pais - Elis Regina',
      'Verdade - Zeca Pagodinho',
      'Nos Bailes da Vida - Milton Nascimento',
      'Opinião - Nara Leão',
      'Roda Viva - Chico Buarque'
    ]
  },
  {
    frequency: 200,
    consciousness: 'Coragem',
    emotion: 'Afirmação',
    category: 'NEUTRALIDADE',
    description: 'Força interior e determinação',
    musicalRecommendation: 'Músicas com frequências de 250-310Hz para elevar a coragem à neutralidade e boa vontade',
    brazilianExamples: [
      'Maria, Maria - Milton Nascimento',
      'Guerreiro Menino - Fagner',
      'Não Deixe o Samba Morrer - Alcione',
      'Volta por Cima - Paulo Vanzolini',
      'O Bêbado e a Equilibrista - Elis Regina'
    ]
  },
  {
    frequency: 175,
    consciousness: 'Orgulho',
    emotion: 'Desprezo',
    category: 'CONTRACAO',
    description: 'Senso de superioridade',
    musicalRecommendation: 'Músicas com frequências de 400-500Hz para transformar orgulho em aceitação e amor',
    brazilianExamples: [
      'Comportamento Geral - Gonzaguinha',
      'A Massa - Raimundos',
      'Que País É Este - Legião Urbana',
      'Ideologia - Cazuza',
      'Geração Coca-Cola - Legião Urbana'
    ]
  },
  {
    frequency: 150,
    consciousness: 'Raiva',
    emotion: 'Ódio',
    category: 'CONTRACAO',
    description: 'Estado de irritação e hostilidade',
    musicalRecommendation: 'Músicas com frequências de 500-600Hz para transformar raiva em paz e serenidade',
    brazilianExamples: [
      'Fora da Ordem - Caetano Veloso',
      'Até Quando? - Gabriel O Pensador',
      'Que País É Este - Legião Urbana',
      'Polícia - Titãs',
      'Homem na Estrada - Racionais MCs'
    ]
  },
  {
    frequency: 125,
    consciousness: 'Apego',
    emotion: 'Desejo',
    category: 'CONTRACAO',
    description: 'Necessidade de controle e posse',
    musicalRecommendation: 'Músicas com frequências de 400-540Hz para transformar apego em compreensão e amor',
    brazilianExamples: [
      'Eu Quero É Botar Meu Bloco na Rua - Sergio Sampaio',
      'Comida - Titãs',
      'Maluco Beleza - Raul Seixas',
      'Metamorfose Ambulante - Raul Seixas',
      'Ouro de Tolo - Raul Seixas'
    ]
  },
  {
    frequency: 100,
    consciousness: 'Medo',
    emotion: 'Ansiedade',
    category: 'CONTRACAO',
    description: 'Estado de apreensão e insegurança',
    musicalRecommendation: 'Músicas com frequências de 500-700Hz para transformar medo em coragem e paz',
    brazilianExamples: [
      'Trem das Onze - Adoniran Barbosa',
      'Medo de Amar - Vinícius de Moraes',
      'Nervos de Aço - Paulinho da Viola',
      'Angústia - Cartola',
      'Carinhoso - Pixinguinha'
    ]
  },
  {
    frequency: 75,
    consciousness: 'Tristeza',
    emotion: 'Arrependimento',
    category: 'ALFA',
    description: 'Sentimento de perda e melancolia',
    musicalRecommendation: 'Músicas com frequências de 400-600Hz para transformar tristeza em alegria e serenidade',
    brazilianExamples: [
      'Chão de Giz - Zé Ramalho',
      'As Rosas Não Falam - Cartola',
      'Último Desejo - Noel Rosa',
      'Volta por Cima - Paulo Vanzolini',
      'Lágrimas de Amor - Cartola'
    ]
  },
  {
    frequency: 50,
    consciousness: 'Apatia',
    emotion: 'Desespero',
    category: 'ALFA',
    description: 'Falta de energia e motivação',
    musicalRecommendation: 'Músicas com frequências de 500-700Hz para elevar a apatia à paz e iluminação',
    brazilianExamples: [
      'Luz do Sol - Caetano Veloso',
      'Bom Dia - Tim Maia',
      'Novo Tempo - Ivan Lins',
      'Dias Melhores - Jota Quest',
      'Enquanto Houver Sol - Titãs'
    ]
  },
  {
    frequency: 30,
    consciousness: 'Culpa',
    emotion: 'Ofensa',
    category: 'ALFA',
    description: 'Sentimento de culpa e remorso',
    musicalRecommendation: 'Músicas com frequências de 400-600Hz para transformar culpa em amor e perdão',
    brazilianExamples: [
      'Perdão - Frejat',
      'Pedido de Perdão - Paulinho da Viola',
      'Me Perdoa - Djavan',
      'Desculpe o Auê - Rita Lee',
      'Perdão - Jorge Aragão'
    ]
  },
  {
    frequency: 20,
    consciousness: 'Vergonha',
    emotion: 'Humilhação',
    category: 'ALFA',
    description: 'Baixa autoestima e autodepreciação',
    musicalRecommendation: 'Músicas com frequências de 500-700Hz para elevar a vergonha ao amor próprio e paz',
    brazilianExamples: [
      'Negro é Lindo - Jorge Ben Jor',
      'Identidade - Jorge Aragão',
      'Eu Sou Negão - Gerônimo',
      'A Carne - Elza Soares',
      'Respeitem Meus Cabelos, Brancos - Chico César'
    ]
  }
];
