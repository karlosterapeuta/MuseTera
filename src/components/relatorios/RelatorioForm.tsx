'use client'

import { useState } from 'react'
import { jsPDF } from 'jspdf'
import { Card } from '@/components/ui/Card'
import { toast } from '@/components/ui/Toast'
import { PatientSelect } from '../processos/PatientSelect'
import { Patient } from '@/types'
import { formatarData } from '@/utils/formatters'

const TIPOS_RELATORIO = [
  { id: 'sessao', label: 'Relatório de Sessão' },
  { id: 'avaliacao', label: 'Relatório de Escala de Avaliação TEA' },
  { id: 'evolucao_mensal', label: 'Relatório de Evolução Mensal' },
  { id: 'evolucao_semestral', label: 'Relatório de Evolução Semestral' },
  { id: 'alta', label: 'Relatório de Alta' },
  { id: 'familia', label: 'Relatório para Família' },
  { id: 'equipe', label: 'Relatório para Equipe' },
  { id: 'parecer', label: 'Parecer Musicoterapêutico' }
]

const MODELOS_SESSAO = [
  { 
    id: 'interacao_musical',
    label: 'Enfoque na Interação Musical',
    descricao: 'Modelo focado no desenvolvimento da interação social através de atividades musicais.'
  },
  { 
    id: 'exploracao_sonora',
    label: 'Enfoque na Exploração Sonora e Rítmica',
    descricao: 'Modelo focado no desenvolvimento da percepção auditiva e coordenação motora.'
  },
  { 
    id: 'regulacao_emocional',
    label: 'Enfoque na Regulação Emocional e Sensorial',
    descricao: 'Modelo focado na autorregulação emocional através de experiências musicais.'
  }
]

const MODELOS_EVOLUCAO = [
  {
    id: 'desenvolvimento_musical_social',
    label: 'Enfoque em Desenvolvimento Musical e Social',
    descricao: 'Modelo focado no engajamento em atividades de interação musical e desenvolvimento social.',
    template: {
      objetivosTerapeuticos: 'Promover maior engajamento em atividades de interação musical.\nIncentivar a percepção e exploração sonora.\nReduzir comportamentos restritivos durante as sessões.',
      intervencoes: 'Sessões estruturadas com canções de saudação e encerramento para regular a transição entre atividades.\nUso de instrumentos de percussão para explorar padrões rítmicos simples.\nAtividades de imitação vocal para estimular interação social e comunicação.',
      observacoesEvolucao: 'Interação social-cognição: Apresentou maior contato visual e engajamento com o terapeuta.\nExploração sonora: Houve aumento no uso intencional de instrumentos musicais.\nComportamentos restritivos: Redução de estereotipias em momentos musicais estruturados.',
      consideracoesGerais: 'O paciente respondeu positivamente às atividades de exploração rítmica e vocal. Recomenda-se manter a estrutura de sessões com foco em imitação e inclusão gradual de tarefas colaborativas.',
      proximosPassos: 'Introduzir repertório musical com letras que estimulem ações motoras.\nUtilizar instrumentos que demandem maior coordenação motora fina.\nProporcionar experiências musicais que envolvam turnos e respostas sociais.'
    }
  },
  {
    id: 'regulacao_comunicacao',
    label: 'Enfoque em Regulação Emocional e Comunicação',
    descricao: 'Modelo focado na regulação emocional e desenvolvimento da comunicação através da música.',
    template: {
      objetivosTerapeuticos: 'Reduzir comportamentos de agressividade e reclusão durante as sessões.\nPromover a exploração vocal em contextos musicais.\nTrabalhar estratégias de regulação emocional por meio da música.',
      intervencoes: 'Sessões com uso de melodias estruturadas para transições.\nAtividades que integram canções com movimentos corporais específicos.\nIntrodução de pausas musicais para promover o autocontrole e antecipação de respostas.',
      observacoesEvolucao: 'Regulação emocional: Houve diminuição significativa de episódios de agressividade.\nExploração vocal: Passou a emitir sons vocais consistentes em resposta a estímulos musicais.\nReclusão: Participação ativa aumentou, com redução no tempo de isolamento.',
      consideracoesGerais: 'O paciente apresentou evolução consistente na autorregulação e respondeu bem a melodias com andamento lento. A exploração vocal ainda requer reforço, mas os avanços são promissores.',
      proximosPassos: 'Aumentar a complexidade das atividades de regulação emocional.\nExplorar repertórios que incluam histórias cantadas, promovendo associação vocal.\nTrabalhar dinâmicas de grupo para ampliar a interação social.'
    }
  },
  {
    id: 'exploracao_corporal',
    label: 'Foco em Exploração Corporal e Rítmica',
    descricao: 'Desenvolvimento motor e integração sensorial através de experiências musicais.',
    template: {
      objetivosTerapeuticos: 'Estimular a movimentação corporal com a música.\nTrabalhar a integração sensorial utilizando diferentes timbres e texturas sonoras.\nAmpliar a resposta intencional a estímulos musicais.',
      intervencoes: 'Introdução de instrumentos de diferentes tamanhos, pesos e texturas para estimulação sensorial.\nUtilização de melodias com variação de timbre para trabalhar discriminação auditiva.\nAtividades que envolvem movimentação corporal coordenada, como marchas e danças simples.',
      observacoesEvolucao: 'Coordenação motora: Apresentou melhora significativa na manipulação de instrumentos musicais, com aumento na precisão dos movimentos em 60%.\nIntegração sensorial: Demonstrou maior tolerância a texturas e sons variados, respondendo com interesse e curiosidade.\nEngajamento corporal: Passou a participar ativamente de atividades motoras, incluindo movimentos sincronizados em resposta a ritmos musicais.\nAtenção musical: Aumentou o tempo de foco em tarefas musicais estruturadas, alcançando até 25 minutos por sessão.',
      consideracoesGerais: 'O paciente demonstrou evolução em sua capacidade de responder a estímulos rítmicos, apresentando maior sincronização entre movimento e som.',
      proximosPassos: 'Aumentar a complexidade dos padrões rítmicos.\nIntroduzir instrumentos que desafiem ainda mais a coordenação motora fina.\nExplorar repertórios que exijam maior controle motor em turnos musicais.'
    }
  }
]

const MODELOS_EVOLUCAO_SEMESTRAL = [
  {
    id: 'desenvolvimento_integral',
    label: 'Desenvolvimento Integral por Meio da Música',
    descricao: 'Foco no desenvolvimento global com ênfase em interação social e comunicação musical.',
    template: {
      objetivosTerapeuticos: 'Promover o desenvolvimento global com ênfase em interação social e comunicação musical.\nTrabalhar a regulação emocional em contextos musicais.\nIncentivar o engajamento em atividades colaborativas com foco no desenvolvimento social-cognitivo.',
      estrategiasIntervencoes: 'Uso de canções temáticas e atividades instrumentais para promover respostas sociais.\nIntrodução de tarefas em pares, promovendo turnos e compartilhamento de instrumentos.\nExploração de timbres variados para estimular a percepção sonora.',
      resultadosObservados: 'Interação social: Maior frequência de respostas sociais espontâneas, como contato visual e sorrisos direcionados, em 80% das sessões.\nRegulação emocional: Houve redução de comportamentos agressivos em situações de frustração, com melhorias evidentes na capacidade de aguardar turnos musicais.\nEngajamento: O paciente demonstrou maior tempo de atenção em atividades estruturadas, permanecendo engajado por até 20 minutos consecutivos.\nExploração musical: Apresentou preferências musicais mais definidas, vocalizando ou movimentando-se em resposta a estímulos específicos.',
      pontosDestaque: 'O paciente progrediu em suas habilidades sociais e demonstrou maior flexibilidade em mudanças de atividades. As intervenções que utilizaram instrumentos de percussão foram especialmente eficazes.',
      recomendacoes: 'Intensificar atividades que demandem cooperação e planejamento conjunto.\nIntroduzir desafios rítmicos progressivos.\nTrabalhar canções que estimulem narrativas simples e comunicação funcional.'
    }
  },
  {
    id: 'comunicacao_percepcao',
    label: 'Enfoque em Comunicação e Percepção Musical',
    descricao: 'Foco na comunicação não verbal e vocal através da música, e desenvolvimento da percepção rítmica.',
    template: {
      objetivosTerapeuticos: 'Estimular a comunicação não verbal e vocal por meio da música.\nTrabalhar a percepção rítmica e a coordenação motora com instrumentos musicais.\nReduzir comportamentos restritivos durante as sessões.',
      estrategiasIntervencoes: 'Uso de canções com estruturas repetitivas para facilitar a participação vocal.\nExercícios rítmicos utilizando tambores, chocalhos e palmas.\nSessões com pausas planejadas para estimular a antecipação e respostas vocais ou corporais.',
      resultadosObservados: 'Exploração vocal: O paciente passou a emitir sons vocais consistentes em resposta a estímulos musicais, incluindo tentativa de repetição de melodias simples.\nPercepção rítmica: Houve progresso na execução de padrões rítmicos básicos, com aumento de precisão em 40% ao longo do semestre.\nComportamentos restritivos: Episódios de estereotipias diminuíram significativamente em contextos de maior engajamento musical.\nInteração musical: Demonstrou maior iniciativa em atividades interativas, como imitação rítmica e vocal com o terapeuta.',
      pontosDestaque: 'As atividades que envolveram alternância de turnos e dinâmicas rítmicas tiveram impacto positivo, especialmente no estímulo à interação vocal.',
      recomendacoes: 'Ampliar o repertório vocal com canções que contenham palavras-chave do cotidiano do paciente.\nIncorporar exercícios rítmicos mais complexos com variação de dinâmica e velocidade.\nFocar em atividades que estimulem ainda mais a interação social.'
    }
  },
  {
    id: 'coordenacao_integracao',
    label: 'Foco em Coordenação Motora e Integração Sensorial',
    descricao: 'Desenvolvimento motor e integração sensorial através de experiências musicais.',
    template: {
      objetivosTerapeuticos: 'Promover o desenvolvimento motor por meio da música.\nTrabalhar a integração sensorial utilizando diferentes timbres e texturas sonoras.\nAmpliar a resposta intencional a estímulos musicais.',
      estrategiasIntervencoes: 'Introdução de instrumentos de diferentes tamanhos, pesos e texturas para estimulação sensorial.\nUtilização de melodias com variação de timbre para trabalhar discriminação auditiva.\nAtividades que envolvem movimentação corporal coordenada, como marchas e danças simples.',
      resultadosObservados: 'Coordenação motora: Apresentou melhora significativa na manipulação de instrumentos musicais, com aumento na precisão dos movimentos em 60%.\nIntegração sensorial: Demonstrou maior tolerância a texturas e sons variados, respondendo com interesse e curiosidade.\nEngajamento corporal: Passou a participar ativamente de atividades motoras, incluindo movimentos sincronizados em resposta a ritmos musicais.\nAtenção musical: Aumentou o tempo de foco em tarefas musicais estruturadas, alcançando até 25 minutos por sessão.',
      pontosDestaque: 'As atividades que combinaram estímulos táteis, visuais e auditivos mostraram ser eficazes na ampliação da tolerância sensorial e coordenação motora.',
      recomendacoes: 'Introduzir atividades que combinem movimento e canto para fortalecer a integração sensório-motora.\nUtilizar instrumentos que desafiem ainda mais a coordenação motora fina.\nExplorar repertórios que exijam maior controle motor em turnos musicais.'
    }
  }
]

const MODELOS_RELATORIO = {
  interacao_musical: {
    titulo: "Relatório de Sessão - Enfoque na Interação Musical",
    template: {
      objetivosTerapeuticos: `- Promover a interação social através de atividades musicais.
- Estimular a exploração sonora e a participação ativa.
- Trabalhar na regulação emocional mediada pela música.`,
      atividadesRealizadas: `1. Improvisação musical conjunta utilizando instrumentos de percussão.
2. Jogo musical "imitação de sons" para promover reciprocidade.
3. Música dirigida para exploração vocal e corporal.`,
      observacoesClinicas: `Durante a sessão, o paciente demonstrou [comportamento observado], evidenciando [análise do comportamento]. Houve engajamento específico na atividade de [atividade], o que indica [interpretação]. Notou-se também [outras observações clínicas].`,
      resultadosProgresso: `O paciente foi capaz de [habilidade ou resposta observada], mostrando progresso em relação a [meta ou habilidade específica]. O uso da música como mediador auxiliou na regulação emocional e na expressão de [aspecto emocional ou social].`,
      planoProximaSessao: `Continuar com o foco na interação musical e introduzir atividades de [nova atividade planejada], visando [objetivo específico].`
    }
  },
  exploracao_sonora: {
    titulo: "Relatório de Sessão - Enfoque na Exploração Sonora e Rítmica",
    template: {
      objetivosTerapeuticos: `- Desenvolver a percepção auditiva e coordenação motora.
- Estimular o reconhecimento e produção de padrões rítmicos.
- Trabalhar a concentração e a organização cognitiva.`,
      atividadesRealizadas: `1. Exercícios de escuta ativa com diferentes timbres e frequências.
2. Sequências rítmicas com instrumentos de percussão e palmas.
3. Jogos musicais envolvendo mudanças de dinâmica e intensidade.`,
      observacoesClinicas: `O paciente mostrou [resposta observada] ao ser exposto a padrões sonoros complexos. Durante a atividade rítmica, foi notório o progresso em [habilidade específica]. Contudo, [limitação ou desafio] foi observado, indicando a necessidade de [ajuste ou intervenção futura].`,
      resultadosProgresso: `Houve um avanço significativo na capacidade de [meta alcançada], especialmente em [atividade ou comportamento]. O paciente apresentou sinais de maior [competência adquirida] ao longo da sessão.`,
      planoProximaSessao: `Enfatizar a prática de sequências rítmicas mais desafiadoras e integrar elementos melódicos para diversificar os estímulos.`
    }
  },
  regulacao_emocional: {
    titulo: "Relatório de Sessão - Enfoque na Regulação Emocional e Sensorial",
    template: {
      objetivosTerapeuticos: `- Promover a autorregulação emocional por meio de experiências musicais.
- Trabalhar a tolerância a diferentes estímulos sonoros.
- Favorecer a expressão emocional através da música.`,
      atividadesRealizadas: `1. Sessão de relaxamento com música instrumental de baixa frequência.
2. Utilização de instrumentos para expressão emocional (por exemplo, tambor para liberação de tensão).
3. Criação de uma "música do humor" baseada no estado emocional inicial.`,
      observacoesClinicas: `O paciente demonstrou [comportamento observado], particularmente durante [atividade ou momento]. A tolerância a [estímulo sonoro] foi [melhorada ou desafiada], e houve manifestação de [expressão emocional]. A resposta geral indica [interpretação clínica].`,
      resultadosProgresso: `O paciente apresentou [evidência de progresso], especialmente em relação à capacidade de [meta alcançada]. O uso da música como ferramenta para regulação sensorial mostrou-se eficaz para [resultado específico].`,
      planoProximaSessao: `Introduzir técnicas adicionais de regulação emocional utilizando música ao vivo e expandir o repertório sonoro para trabalhar a flexibilização cognitiva.`
    }
  },
  avaliacao: {
    titulo: "Relatório de Escala de Avaliação TEA",
    template: {
      dataAvaliacao: new Date().toISOString().split('T')[0],  // Data atual como padrão
      objetivoAvaliacao: 'Avaliar o desenvolvimento musical do paciente por meio da Escala de Avaliação TEA, identificando habilidades relacionadas à percepção, exploração e interação musical, bem como a presença de comportamentos restritivos. A avaliação tem como objetivo orientar estratégias de intervenção musicoterapêutica personalizadas.',
      metodologia: 'A aplicação da Escala de Avaliação TEA foi realizada em sessões presenciais, utilizando instrumentos musicais diversos (tambores, chocalhos, metalofones, entre outros) e estímulos sonoros (canções, ritmos e dinâmicas vocais).',
      comportamentosRestritivos: '',
      percepcaoExploracao: '',
      interacaoSocial: '',
      exploracaoVocal: '',
      percepcaoRitmica: '',
      movimentacaoCorporal: '',
      analiseGeral: '',
      recomendacoes: ''
    }
  },
  parecer: {
    titulo: "PARECER MUSICOTERAPICO CLÍNICO",
    template: {
      cabecalho: "Musicoterapeuta\nKarlos Eduardo Teixeira - Registro Profissional: 0066/22MT-UBAM\nPaciente: Isaac Luiz Trajano da Silva",
      introducao: "Isaac Luiz, Iniciou os atendimentos de musicoterapia no inicio de julho de 2024, as sessões eram realizadas 1 vez por semana que passou a ser quinzenal com duração de 30 minutos. As intervenções, objetivam estimular e promover o desenvolvimento cognitivo da criança, bem como desenvolver raciocínio lógico, através de motivos ritimicos e melodicos que sob a direção do terapeuta realiza a sonorização das mesmas, juntamente com o paciente. Utilizamos, xilofone, teclado, ukulele e sinos coloridos realizando o pareamento de cores e trabalhando outras questoes como: foco atencional, atenção sustentada e atendimento de comandos. Esta abordagem, promove a comunicação e expressão através de associações visuais e auditivas.",
      habilidadesCognitivas: "Em relação às habilidades cognitivas, Isaac já consegue manter o foco nas demandas propostas na sessão musicoterapia, associando diferentes informações. Estas funções executivas são de suma importância para as atividades da vida diária e escolares, porque oportuniza o controle emocional e auto regulação da conduta.",
      participacao: "Isaac Luiz, participa das propostas que trazemos nos atendimentos atingindo bons resultados na sessão que ampliam o seu desenvolvimento global e execução das propostas musicoterápicas, porém, ainda é necessário dar continuidade ao atendimento para seu desenvolvimento cognitivo.",
      conclusao: "Diante das informações apresentadas acima, o paciente Isaac exibe evolução do quadro clínico e vem apresentando respostas aos estímulos oferecidos durante as sessões de musicoterapia. É sugerido a continuidade das terapias, para potencializar as habilidades comunicativas e sociais visando o alcance de melhores prognósticos."
    }
  }
};

const MODELOS_AVALIACAO = [
  {
    id: 'tea_completo',
    label: 'Avaliação TEA Completa',
    descricao: 'Avaliação completa com todos os domínios da Escala de Avaliação TEA',
    template: {
      dataAvaliacao: new Date().toISOString().split('T')[0],  // Data atual como padrão
      objetivoAvaliacao: `Avaliar o desenvolvimento musical do paciente por meio da Escala de Avaliação TEA, identificando habilidades relacionadas à percepção, exploração e interação musical, bem como a presença de comportamentos restritivos. A avaliação tem como objetivo orientar estratégias de intervenção musicoterapêutica personalizadas.`,
      
      metodologia: `A aplicação da Escala de Avaliação TEA foi realizada em sessões presenciais, utilizando instrumentos musicais diversos (tambores, chocalhos, metalofones, entre outros) e estímulos sonoros (canções, ritmos e dinâmicas vocais). Cada item avaliado foi pontuado de acordo com os seguintes níveis:

0: Ausente
1: Inicial
2: Desenvolvido parcialmente
3: Desenvolvido plenamente

Os seguintes domínios foram observados e pontuados:
- Comportamentos Restritivos
- Percepção-Exploração Sonora
- Interação Social-Cognição
- Exploração Vocal
- Percepção-Exploração Rítmica
- Movimentação Corporal com a Música`,
      
      comportamentosRestritivos: `Itens avaliados: Estereotipias, Agressividade, Desinteresse, Passividade, Reclusão, Resistência e Pirraça.

Pontuação Total: [Pontuação total aqui]

Observações:
- Episódios de estereotipias foram frequentes em momentos de transição entre atividades musicais.
- Houve resistência inicial ao uso de novos instrumentos, reduzida progressivamente com estímulos visuais e sonoros.`,
      
      percepcaoSonora: `Itens avaliados: Reação a estímulos sonoros, curiosidade em explorar sons e discriminação auditiva.

Pontuação Total: [Pontuação total aqui]

Observações:
- Demonstrou preferência por instrumentos de percussão e reagiu de forma consistente a mudanças de dinâmica e intensidade sonora.
- A discriminação auditiva foi evidenciada na capacidade de diferenciar sons graves e agudos.`,
      
      interacaoSocial: `Itens avaliados: Engajamento com o terapeuta, imitação musical e troca de turnos.

Pontuação Total: [Pontuação total aqui]

Observações:
- Houve melhora no contato visual durante atividades de troca de turnos.
- Respostas imitativas ainda limitadas, mas com progressos em imitação rítmica simples.`,
      
      exploracaoVocal: `Itens avaliados: Produção vocal espontânea, imitação de melodias e associação som-palavra.

Pontuação Total: [Pontuação total aqui]

Observações:
- Emissão vocal espontânea ocorreu principalmente em canções com repetições.
- Dificuldade em reproduzir melodias complexas, mas com esforço progressivo em padrões simples.`,
      
      percepcaoRitmica: `Itens avaliados: Reação a estímulos rítmicos, produção rítmica espontânea e capacidade de manter o tempo.

Pontuação Total: [Pontuação total aqui]

Observações:
- Apresentou interesse e engajamento em padrões rítmicos básicos.
- Dificuldade em manter o ritmo por longos períodos, com necessidade de suporte do terapeuta.`,
      
      movimentacaoCorporal: `Itens avaliados: Reação corporal a estímulos musicais, coordenação motora e sincronização com a música.

Pontuação Total: [Pontuação total aqui]

Observações:
- Respondeu de forma espontânea a estímulos de andamentos rápidos, com movimentos sincronizados em 50% das vezes.
- A coordenação motora fina ainda necessita de suporte específico.`,
      
      analiseGeral: `Os resultados da avaliação indicam que o paciente apresenta um desenvolvimento musical consistente em áreas como percepção sonora e engajamento com estímulos rítmicos. Entretanto, desafios permanecem nas dimensões de interação social e exploração vocal, que requerem abordagens terapêuticas mais direcionadas.

Os comportamentos restritivos observados, especialmente a resistência e a passividade, tendem a ser reduzidos com atividades de maior engajamento musical.`,
      
      recomendacoes: `Com base nos resultados, sugere-se:

1. Intervenções Focadas em Ritmo: Introduzir atividades que envolvam padrões rítmicos simples, com progressão gradual para maior complexidade.

2. Exploração Sonora e Vocal: Promover atividades com instrumentos de diferentes timbres para incentivar respostas vocais e discriminação auditiva.

3. Atividades Interativas: Implementar exercícios de troca de turnos e imitação musical para fortalecer habilidades sociais.

4. Estratégias de Regulação: Utilizar canções de transição para minimizar comportamentos restritivos e melhorar a adaptação às mudanças.`
    }
  },
  {
    id: 'parecer_padrao',
    label: 'Parecer Musicoterapêutico Padrão',
    descricao: 'Modelo completo de parecer musicoterapêutico com avaliação detalhada do paciente',
    template: {
      dataAvaliacao: new Date().toISOString().split('T')[0],
      introducao: 'Iniciou os atendimentos de musicoterapia no inicio de julho de 2024, as sessões eram realizadas 1 vez por semana que passou a ser quinzenal com duração de 30 minutos. As intervenções, objetivam estimular e promover o desenvolvimento cognitivo da criança, bem como desenvolver raciocínio lógico, através de motivos ritimicos e melodicos que sob a direção do terapeuta realiza a sonorização das mesmas, juntamente com o paciente. Utilizamos, xilofone, teclado, ukulele e sinos coloridos realizando o pareamento de cores e trabalhando outras questoes como: foco atencional, atenção sustentada e atendimento de comandos. Esta abordagem, promove a comunicação e expressão através de associações visuais e auditivas.',
      habilidadesCognitivas: 'Em relação às habilidades cognitivas, já consegue manter o foco nas demandas propostas na sessão musicoterapia, associando diferentes informações. Estas funções executivas são de suma importância para as atividades da vida diária e escolares, porque oportuniza o controle emocional e auto regulação da conduta.',
      participacao: 'Participa das propostas que trazemos nos atendimentos atingindo bons resultados na sessão que ampliam o seu desenvolvimento global e execução das propostas musicoterápicas, porém, ainda é necessário dar continuidade ao atendimento para seu desenvolvimento cognitivo.',
      conclusao: 'Diante das informações apresentadas acima, o paciente exibe evolução do quadro clínico e vem apresentando respostas aos estímulos oferecidos durante as sessões de musicoterapia. É sugerido a continuidade das terapias, para potencializar as habilidades comunicativas e sociais visando o alcance de melhores prognósticos.'
    }
  }
];

const CAMPOS_ESPECIFICOS = {
  parecer: [
    {
      titulo: 'Dados do Parecer',
      campos: [
        { 
          id: 'data', 
          label: 'Data', 
          tipo: 'date',
          valor: new Date().toISOString().split('T')[0]
        }
      ]
    },
    {
      titulo: 'Conteúdo do Parecer',
      campos: [
        {
          id: 'introducao',
          label: 'Introdução e Contextualização',
          tipo: 'textarea',
          valor: 'Iniciou os atendimentos de musicoterapia no inicio de julho de 2024, as sessões eram realizadas 1 vez por semana que passou a ser quinzenal com duração de 30 minutos. As intervenções, objetivam estimular e promover o desenvolvimento cognitivo da criança, bem como desenvolver raciocínio lógico, através de motivos ritimicos e melodicos que sob a direção do terapeuta realiza a sonorização das mesmas, juntamente com o paciente. Utilizamos, xilofone, teclado, ukulele e sinos coloridos realizando o pareamento de cores e trabalhando outras questoes como: foco atencional, atenção sustentada e atendimento de comandos. Esta abordagem, promove a comunicação e expressão através de associações visuais e auditivas.'
        },
        {
          id: 'habilidadesCognitivas',
          label: 'Avaliação das Habilidades Cognitivas',
          tipo: 'textarea',
          valor: 'Em relação às habilidades cognitivas, já consegue manter o foco nas demandas propostas na sessão musicoterapia, associando diferentes informações. Estas funções executivas são de suma importância para as atividades da vida diária e escolares, porque oportuniza o controle emocional e auto regulação da conduta.'
        },
        {
          id: 'participacao',
          label: 'Participação e Desenvolvimento',
          tipo: 'textarea',
          valor: 'Participa das propostas que trazemos nos atendimentos atingindo bons resultados na sessão que ampliam o seu desenvolvimento global e execução das propostas musicoterápicas, porém, ainda é necessário dar continuidade ao atendimento para seu desenvolvimento cognitivo.'
        },
        {
          id: 'conclusao',
          label: 'Conclusão e Recomendações',
          tipo: 'textarea',
          valor: 'Diante das informações apresentadas acima, o paciente exibe evolução do quadro clínico e vem apresentando respostas aos estímulos oferecidos durante as sessões de musicoterapia. É sugerido a continuidade das terapias, para potencializar as habilidades comunicativas e sociais visando o alcance de melhores prognósticos.'
        }
      ]
    }
  ],
  sessao: [
    {
      titulo: 'Dados da Sessão Terapêutica',
      campos: [
        { id: 'data', label: 'Data', tipo: 'date' },
        { id: 'horario', label: 'Horário', tipo: 'time' },
        { id: 'numeroSessao', label: 'Número da Sessão', tipo: 'number' },
        { id: 'duracao', label: 'Duração (minutos)', tipo: 'number' },
        { id: 'setting', label: 'Setting Terapêutico', tipo: 'select',
          opcoes: [
            'Consultório',
            'Domiciliar',
            'Institucional',
            'Ambiente Virtual',
            'Outro'
          ]
        }
      ]
    },
    {
      titulo: 'Planejamento Terapêutico',
      campos: [
        { 
          id: 'objetivosSessao', 
          label: 'Objetivos Específicos da Sessão', 
          tipo: 'multiselect',
          opcoes: [
            'Desenvolvimento de habilidades pragmáticas da comunicação',
            'Promoção da interação social recíproca',
            'Facilitação da expressão e regulação emocional',
            'Desenvolvimento psicomotor integrado',
            'Estimulação das funções executivas',
            'Desenvolvimento da percepção e processamento auditivo',
            'Integração sensorial através de estímulos sonoro-musicais',
            'Desenvolvimento de estratégias de autorregulação'
          ]
        }
      ]
    },
    {
      titulo: 'Descrição das Intervenções Musicoterapêuticas',
      campos: [
        {
          id: 'metodologiasAplicadas',
          label: 'Metodologias Aplicadas',
          tipo: 'multiselect',
          opcoes: [
            'Improvisação Clínica (Modelo Nordoff-Robbins)',
            'Re-criação Musical Terapêutica',
            'Composição Musical Direcionada',
            'Audição Musical Receptiva (GIM adaptado)',
            'Técnicas de Musicoterapia Neurológica (NMT)',
            'Método STAM (Sons e Transcendência)',
            'Técnicas de ISO e Entrainment',
            'Abordagem Plurimodal em Musicoterapia'
          ]
        },
        {
          id: 'instrumentosUtilizados',
          label: 'Recursos Sonoro-Musicais',
          tipo: 'multiselect',
          opcoes: [
            'Instrumentos de Percussão (especificar)',
            'Instrumentos Melódicos (especificar)',
            'Instrumentos Harmônicos (especificar)',
            'Recursos Tecnológicos/DAW',
            'Voz e Corpo',
            'Material Sonoro Gravado',
            'Instrumentos Adaptados',
            'Recursos Auxiliares'
          ]
        },
        {
          id: 'descricaoIntervencoes',
          label: 'Descrição Detalhada das Intervenções',
          tipo: 'textarea',
          placeholder: 'Descreva a sequência e desenvolvimento das intervenções realizadas, incluindo adaptações necessárias e progressão das atividades.'
        }
      ]
    },
    {
      titulo: 'Resposta do Paciente',
      campos: [
        {
          id: 'respostaMusical',
          label: 'Resposta Musical',
          tipo: 'multiselect',
          opcoes: [
            'Demonstrou engajamento musical ativo',
            'Apresentou iniciativas sonoro-musicais',
            'Manteve sincronia rítmica',
            'Explorou variações melódicas',
            'Respondeu a mudanças dinâmicas',
            'Demonstrou preferências musicais',
            'Estabeleceu diálogo sonoro-musical',
            'Apresentou expressividade musical'
          ]
        },
        {
          id: 'respostaComportamental',
          label: 'Aspectos Comportamentais',
          tipo: 'multiselect',
          opcoes: [
            'Manteve engajamento nas propostas terapêuticas',
            'Demonstrou regulação sensorial adequada',
            'Apresentou reciprocidade socioemocional',
            'Manteve atenção sustentada',
            'Demonstrou compreensão das consignas',
            'Apresentou comportamento colaborativo',
            'Manifestou adequação postural',
            'Demonstrou autorregulação emocional'
          ]
        },
        {
          id: 'descricaoRespostas',
          label: 'Análise das Respostas',
          tipo: 'textarea',
          placeholder: 'Descreva detalhadamente as respostas observadas, incluindo padrões comportamentais, mudanças significativas e aspectos relevantes da interação terapêutica.'
        }
      ]
    },
    {
      titulo: 'Avaliação Técnica',
      campos: [
        {
          id: 'avaliacaoObjetivos',
          label: 'Análise dos Objetivos',
          tipo: 'multiselect',
          opcoes: [
            'Objetivos totalmente alcançados',
            'Objetivos parcialmente alcançados',
            'Objetivos em desenvolvimento',
            'Necessidade de reformulação',
            'Identificação de novos objetivos',
            'Manutenção do planejamento atual'
          ]
        },
        {
          id: 'avaliacaoTecnica',
          label: 'Parecer Técnico',
          tipo: 'textarea',
          placeholder: 'Apresente sua análise técnica sobre a eficácia das intervenções, progressos observados e fundamentação teórica pertinente.'
        }
      ]
    },
    {
      titulo: 'Planejamento Futuro',
      campos: [
        {
          id: 'planejamentoFuturo',
          label: 'Direcionamentos Terapêuticos',
          tipo: 'multiselect',
          opcoes: [
            'Manutenção das estratégias atuais',
            'Adaptação das intervenções',
            'Introdução de novas técnicas',
            'Ajuste dos objetivos terapêuticos',
            'Necessidade de avaliação específica',
            'Indicação para abordagem interdisciplinar'
          ]
        },
        {
          id: 'observacoesAdicionais',
          label: 'Observações Complementares',
          tipo: 'textarea',
          placeholder: 'Registre informações adicionais relevantes, intercorrências ou observações específicas que contribuam para o processo terapêutico.'
        }
      ]
    }
  ],

  evolucao_mensal: [
    {
      titulo: 'Análise da Evolução Terapêutica',
      campos: [
        {
          id: 'evolucaoMusical',
          label: 'Desenvolvimento Sonoro-Musical',
          tipo: 'multiselect',
          opcoes: [
            'Aprimoramento da percepção e discriminação rítmica',
            'Desenvolvimento da expressão vocal e melódica',
            'Expansão do repertório sonoro-musical',
            'Ampliação do engajamento instrumental',
            'Desenvolvimento da criatividade e expressão musical',
            'Aprimoramento da coordenação neuromotora',
            'Desenvolvimento das habilidades de improvisação clínica'
          ]
        },
        {
          id: 'evolucaoComportamental',
          label: 'Desenvolvimento Comportamental',
          tipo: 'multiselect',
          opcoes: [
            'Redução significativa de comportamentos disfuncionais',
            'Aprimoramento da regulação emocional',
            'Aumento do limiar de tolerância à frustração',
            'Ampliação do período de sustentação da atenção',
            'Melhora na organização e planejamento comportamental',
            'Desenvolvimento da flexibilidade cognitiva',
            'Redução dos níveis de ansiedade'
          ]
        }
      ]
    },
    {
      titulo: 'Avaliação dos Objetivos Terapêuticos',
      campos: [
        {
          id: 'objetivosAlcancados',
          label: 'Objetivos Alcançados',
          tipo: 'multiselect',
          opcoes: [
            'Desenvolvimento significativo da comunicação pragmática',
            'Ampliação das habilidades sociointeracionais',
            'Desenvolvimento das competências musicais terapêuticas',
            'Aprimoramento da expressão e regulação emocional',
            'Desenvolvimento da autonomia funcional',
            'Evolução do desenvolvimento neuropsicomotor',
            'Estabelecimento de estratégias de autorregulação'
          ]
        }
      ]
    }
  ],

  alta: [
    {
      titulo: 'Critérios de Alta Terapêutica',
      campos: [
        {
          id: 'motivosAlta',
          label: 'Justificativa Clínica',
          tipo: 'multiselect',
          opcoes: [
            'Consecução dos objetivos terapêuticos estabelecidos',
            'Desenvolvimento satisfatório das habilidades-alvo',
            'Estabilização do quadro comportamental e emocional',
            'Desenvolvimento da autonomia nas intervenções propostas',
            'Generalização das habilidades adquiridas',
            'Indicação para outras modalidades terapêuticas complementares'
          ]
        }
      ]
    },
    {
      titulo: 'Orientações Terapêuticas',
      campos: [
        {
          id: 'recomendacoes',
          label: 'Recomendações Técnicas',
          tipo: 'multiselect',
          opcoes: [
            'Manutenção das atividades musicoterapêuticas em ambiente domiciliar',
            'Continuidade da estimulação sonoro-musical',
            'Participação em atividades musicais socializantes',
            'Acompanhamento periódico para monitoramento',
            'Integração com outras abordagens terapêuticas',
            'Manutenção do suporte familiar nas atividades propostas'
          ]
        }
      ]
    }
  ],
  avaliacao: [
    {
      titulo: 'Avaliação TEA',
      campos: [
        {
          id: 'dataAvaliacao',
          label: 'Data da Avaliação',
          tipo: 'date'
        },
        {
          id: 'objetivoAvaliacao',
          label: 'Objetivo da Avaliação',
          tipo: 'textarea',
          placeholder: 'Descreva o objetivo da avaliação...'
        },
        {
          id: 'metodologia',
          label: 'Metodologia',
          tipo: 'textarea',
          placeholder: 'Descreva a metodologia utilizada...'
        },
        {
          id: 'comportamentosRestritivos',
          label: 'Comportamentos Restritivos',
          tipo: 'textarea',
          placeholder: 'Descreva os comportamentos restritivos observados...'
        },
        {
          id: 'percepcaoSonora',
          label: 'Percepção-Exploração Sonora',
          tipo: 'textarea',
          placeholder: 'Descreva a percepção e exploração sonora...'
        },
        {
          id: 'interacaoSocial',
          label: 'Interação Social-Cognição',
          tipo: 'textarea',
          placeholder: 'Descreva a interação social e aspectos cognitivos...'
        },
        {
          id: 'exploracaoVocal',
          label: 'Exploração Vocal',
          tipo: 'textarea',
          placeholder: 'Descreva a exploração vocal...'
        },
        {
          id: 'percepcaoRitmica',
          label: 'Percepção-Exploração Rítmica',
          tipo: 'textarea',
          placeholder: 'Descreva a percepção e exploração rítmica...'
        },
        {
          id: 'movimentacaoCorporal',
          label: 'Movimentação Corporal',
          tipo: 'textarea',
          placeholder: 'Descreva a movimentação corporal com a música...'
        },
        {
          id: 'analiseGeral',
          label: 'Análise Geral e Considerações',
          tipo: 'textarea',
          placeholder: 'Faça uma análise geral dos resultados...'
        },
        {
          id: 'recomendacoes',
          label: 'Recomendações',
          tipo: 'textarea',
          placeholder: 'Liste as recomendações para intervenção...'
        }
      ]
    }
  ],
  parecer: [
    {
      titulo: 'Dados do Parecer',
      campos: [
        { 
          id: 'data', 
          label: 'Data', 
          tipo: 'date',
          valor: new Date().toISOString().split('T')[0]
        }
      ]
    },
    {
      titulo: 'Conteúdo do Parecer',
      campos: [
        {
          id: 'introducao',
          label: 'Introdução e Contextualização',
          tipo: 'textarea',
          valor: 'Iniciou os atendimentos de musicoterapia no inicio de julho de 2024, as sessões eram realizadas 1 vez por semana que passou a ser quinzenal com duração de 30 minutos. As intervenções, objetivam estimular e promover o desenvolvimento cognitivo da criança, bem como desenvolver raciocínio lógico, através de motivos ritimicos e melodicos que sob a direção do terapeuta realiza a sonorização das mesmas, juntamente com o paciente. Utilizamos, xilofone, teclado, ukulele e sinos coloridos realizando o pareamento de cores e trabalhando outras questoes como: foco atencional, atenção sustentada e atendimento de comandos. Esta abordagem, promove a comunicação e expressão através de associações visuais e auditivas.'
        },
        {
          id: 'habilidadesCognitivas',
          label: 'Avaliação das Habilidades Cognitivas',
          tipo: 'textarea',
          valor: 'Em relação às habilidades cognitivas, já consegue manter o foco nas demandas propostas na sessão musicoterapia, associando diferentes informações. Estas funções executivas são de suma importância para as atividades da vida diária e escolares, porque oportuniza o controle emocional e auto regulação da conduta.'
        },
        {
          id: 'participacao',
          label: 'Participação e Desenvolvimento',
          tipo: 'textarea',
          valor: 'Participa das propostas que trazemos nos atendimentos atingindo bons resultados na sessão que ampliam o seu desenvolvimento global e execução das propostas musicoterápicas, porém, ainda é necessário dar continuidade ao atendimento para seu desenvolvimento cognitivo.'
        },
        {
          id: 'conclusao',
          label: 'Conclusão e Recomendações',
          tipo: 'textarea',
          valor: 'Diante das informações apresentadas acima, o paciente exibe evolução do quadro clínico e vem apresentando respostas aos estímulos oferecidos durante as sessões de musicoterapia. É sugerido a continuidade das terapias, para potencializar as habilidades comunicativas e sociais visando o alcance de melhores prognósticos.'
        }
      ]
    }
  ],
}

interface RelatorioFormProps {
  onSubmit: (data: any) => void
}

export function RelatorioForm({ onSubmit }: RelatorioFormProps) {
  const [tipoRelatorio, setTipoRelatorio] = useState('')
  const [modelo, setModelo] = useState('')
  const [paciente, setPaciente] = useState<Patient | null>(null)
  const [selectedPatientId, setSelectedPatientId] = useState<string>('')
  const [formData, setFormData] = useState<any>({})

  const handleTipoRelatorioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tipo = e.target.value
    setTipoRelatorio(tipo)
    setModelo('')
    setFormData({})
  }

  const handleModeloChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const modeloId = e.target.value
    setModelo(modeloId)
    
    // Preencher dados do template se existir
    const modeloTemplate = MODELOS_RELATORIO[modeloId]?.template
    if (modeloTemplate) {
      setFormData(prev => ({
        ...prev,
        ...modeloTemplate
      }))
    }
  }

  const handlePacienteSelect = (patient: Patient | null) => {
    setPaciente(patient)
    setSelectedPatientId(patient?.id || '')
  }

  const handleInputChange = (campo: string, valor: string) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!paciente) {
      toast.error('Selecione um paciente')
      return
    }

    const dadosRelatorio = {
      tipo: tipoRelatorio,
      modelo,
      paciente,
      ...formData
    }

    onSubmit(dadosRelatorio)
  }

  const handleExportPDF = () => {
    if (!paciente) {
      toast.error('Selecione um paciente')
      return
    }

    // Recuperar dados do musicoterapeuta do localStorage
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

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    let yPosition = 20

    // Cabeçalho
    doc.setFontSize(16)
    doc.text('Parecer Musicoterapêutico', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 20

    // Data e Paciente
    doc.setFontSize(12)
    doc.text(`Data: ${formData.data || formatarData(new Date())}`, 20, yPosition)
    yPosition += 10
    doc.text(`Paciente: ${paciente.nome}`, 20, yPosition)
    yPosition += 10
    doc.text(`Musicoterapeuta: ${profissionalInfo.nome}`, 20, yPosition)
    doc.text(`Registro: MT ${profissionalInfo.registro}`, pageWidth - 20, yPosition, { align: 'right' })
    yPosition += 20

    // Conteúdo
    const addSection = (title: string, content: string) => {
      doc.setFontSize(14)
      doc.text(title, 20, yPosition)
      yPosition += 10
      doc.setFontSize(12)
      
      const lines = doc.splitTextToSize(content, pageWidth - 40)
      doc.text(lines, 20, yPosition)
      yPosition += (lines.length * 7) + 10

      if (yPosition > pageHeight - 60) {  // Ajustado para deixar espaço para o rodapé
        addFooter()
        doc.addPage()
        yPosition = 20
      }
    }

    // Função para adicionar o rodapé
    const addFooter = () => {
      const footerY = pageHeight - 30
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      
      // Linha divisória
      doc.setDrawColor(0)
      doc.line(20, footerY - 10, pageWidth - 20, footerY - 10)
      
      // Texto do rodapé
      doc.text(profissionalInfo.nome, 20, footerY)
      doc.text('Musicoterapeuta', 20, footerY + 6)
      doc.text(`MT ${profissionalInfo.registro}`, 20, footerY + 12)
      
      // Data à direita
      const dataText = `Recife, ${formatarData(new Date())}`
      const dataWidth = doc.getTextWidth(dataText)
      doc.text(dataText, pageWidth - 20 - dataWidth, footerY + 6)
    }

    // Adicionar seções do parecer
    const secoes = [
      {
        titulo: 'Introdução e Contextualização',
        conteudo: formData.introducao || CAMPOS_ESPECIFICOS.parecer[1].campos[0].valor
      },
      {
        titulo: 'Avaliação das Habilidades Cognitivas',
        conteudo: formData.habilidadesCognitivas || CAMPOS_ESPECIFICOS.parecer[1].campos[1].valor
      },
      {
        titulo: 'Participação e Desenvolvimento',
        conteudo: formData.participacao || CAMPOS_ESPECIFICOS.parecer[1].campos[2].valor
      },
      {
        titulo: 'Conclusão e Recomendações',
        conteudo: formData.conclusao || CAMPOS_ESPECIFICOS.parecer[1].campos[3].valor
      }
    ]

    // Adicionar cada seção ao PDF
    secoes.forEach(secao => {
      if (secao.conteudo) {
        addSection(secao.titulo, secao.conteudo)
      }
    })

    // Adicionar rodapé na última página
    addFooter()

    // Salvar o PDF
    doc.save(`parecer_musicoterapeutico_${paciente.nome.toLowerCase().replace(/ /g, '_')}.pdf`)
    toast.success('PDF gerado com sucesso!')
  }

  const getModelosDisponiveis = () => {
    switch (tipoRelatorio) {
      case 'sessao':
        return MODELOS_SESSAO
      case 'evolucao_mensal':
      case 'evolucao_semestral':
        return MODELOS_EVOLUCAO
      default:
        return []
    }
  }

  const getCamposEspecificos = () => {
    return CAMPOS_ESPECIFICOS[tipoRelatorio as keyof typeof CAMPOS_ESPECIFICOS] || []
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="paciente" className="block text-sm font-medium text-gray-700">
              Paciente
            </label>
            <div className="mt-1">
              <PatientSelect 
                onSelect={handlePacienteSelect} 
                selectedId={selectedPatientId}
              />
            </div>
          </div>

          <div>
            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
              Tipo de Relatório
            </label>
            <select
              id="tipo"
              value={tipoRelatorio}
              onChange={handleTipoRelatorioChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Selecione um tipo</option>
              {TIPOS_RELATORIO.map(tipo => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>

          {tipoRelatorio && getModelosDisponiveis().length > 0 && (
            <div>
              <label htmlFor="modelo" className="block text-sm font-medium text-gray-700">
                Modelo
              </label>
              <select
                id="modelo"
                value={modelo}
                onChange={handleModeloChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Selecione um modelo</option>
                {getModelosDisponiveis().map(modelo => (
                  <option key={modelo.id} value={modelo.id}>
                    {modelo.label}
                  </option>
                ))}
              </select>
              {modelo && (
                <p className="mt-2 text-sm text-gray-500">
                  {getModelosDisponiveis().find(m => m.id === modelo)?.descricao}
                </p>
              )}
            </div>
          )}
        </div>
      </Card>

      {tipoRelatorio && (
        <Card className="p-6">
          <div className="space-y-6">
            {getCamposEspecificos().map(secao => (
              <div key={secao.titulo} className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">{secao.titulo}</h3>
                <div className="space-y-4">
                  {secao.campos.map(campo => (
                    <div key={campo.id}>
                      <label htmlFor={campo.id} className="block text-sm font-medium text-gray-700">
                        {campo.label}
                      </label>
                      <div className="mt-1">
                        {campo.tipo === 'textarea' ? (
                          <textarea
                            id={campo.id}
                            value={formData[campo.id] || campo.valor || ''}
                            onChange={(e) => handleInputChange(campo.id, e.target.value)}
                            rows={4}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        ) : campo.tipo === 'date' ? (
                          <input
                            type="date"
                            id={campo.id}
                            value={formData[campo.id] || campo.valor || ''}
                            onChange={(e) => handleInputChange(campo.id, e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        ) : (
                          <input
                            type="text"
                            id={campo.id}
                            value={formData[campo.id] || campo.valor || ''}
                            onChange={(e) => handleInputChange(campo.id, e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={handleExportPDF}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Exportar PDF
        </button>
      </div>
    </form>
  )
}