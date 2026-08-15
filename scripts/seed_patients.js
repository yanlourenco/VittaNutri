import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.VITE_DATABASE_URL || 'postgresql://neondb_owner:npg_JiILodXxSg48@ep-wild-flower-acin8qgg-pooler.sa-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require';

const sql = neon(DATABASE_URL);

const PATIENT_TEMPLATES = [
  {
    nome: 'Mariana Vasconcelos',
    data_nascimento: '1994-06-15',
    sexo: 'Feminino',
    whatsapp: '(11) 98765-4321',
    email: 'mariana.vasconcelos@email.com',
    peso_inicial: 68.5,
    altura: 1.65,
    objetivos: ['Emagrecer', 'Reeducação alimentar'],
    objetivo_texto: 'Perda de gordura com preservação de massa magra e melhora na digestão.',
    nivel_atividade: 'Moderadamente ativo',
    patologias: ['Nenhum'],
    restricoes_alimentares: ['Lactose'],
    alergias: ['Nenhum'],
    medicamentos: 'Nenhum',
    suplementos: 'Whey isolado sem lactose, Vitamina D3 2000UI',
    refeicoes_por_dia: 4,
    horario_acorda: '06:30',
    horario_dorme: '22:30',
    litros_agua: 2.5,
    atividade_fisica: true,
    atividade_fisica_descricao: 'Musculação 4x na semana (50 min)',
    observacoes: 'Boa adesão ao plano anterior, relata melhora de energia.',
    consultas: [
      {
        data_consulta: '2026-06-10',
        peso: 68.5,
        cintura: 78.0,
        quadril: 102.0,
        percentual_gordura: 28.5,
        observacoes: 'Primeira consulta. Anamnese completa e estabelecimento de metas.',
        proximo_retorno: '2026-07-10'
      },
      {
        data_consulta: '2026-07-10',
        peso: 66.8,
        cintura: 75.5,
        quadril: 100.5,
        percentual_gordura: 26.8,
        observacoes: 'Excelente redução de medidas. Redução calórica leve para platô.',
        proximo_retorno: '2026-08-25'
      }
    ],
    plano: {
      titulo: 'Plano Nutricional — Definição & Leveza',
      meta_calorica: 1650,
      observacoes_gerais: 'Priorizar alimentos frescos e ricos em fibras. Evitar ultraprocessados à noite.',
      refeicoes: [
        { horario: '07:00', nome: 'Café da Manhã', alimentos: 'Omelete de 2 ovos com espinafre + 1 fatia de pão integral + 1 café sem açúcar', substituicoes: 'Tofu mexido com cúrcuma + 1 fatia de tapioca' },
        { horario: '10:00', nome: 'Lanche da Manhã', alimentos: '1 maçã + 15g de castanhas de caju', substituicoes: '1 pera + 10 amêndoas' },
        { horario: '12:30', nome: 'Almoço', alimentos: '120g de filé de frango grelhado + 100g de arroz integral + mix de folhas verdes à vontade + 1 concha de feijão', substituicoes: '130g de tilápia grelhada + 120g de batata doce cozida' },
        { horario: '16:00', nome: 'Lanche da Tarde', alimentos: 'Iogurte vegetal/zero lactose com 1 colher de chia e morangos picados', substituicoes: 'Shake de whey protein batido com água de coco e banana' },
        { horario: '19:30', nome: 'Jantar', alimentos: 'Bowl de salada colorida com 100g de atum sólido e azeite extravirgem (1 colher de sobremesa)', substituicoes: 'Sopa detox de legumes com frango desfiado' }
      ]
    }
  },
  {
    nome: 'Carlos Eduardo Silveira',
    data_nascimento: '1988-11-22',
    sexo: 'Masculino',
    whatsapp: '(21) 99123-8877',
    email: 'carlos.silveira@email.com',
    peso_inicial: 84.0,
    altura: 1.78,
    objetivos: ['Ganhar massa', 'Performance esportiva'],
    objetivo_texto: 'Hipertrofia muscular e aumento de força nos treinos de crossfit.',
    nivel_atividade: 'Muito ativo',
    patologias: ['Nenhum'],
    restricoes_alimentares: ['Nenhum'],
    alergias: ['Frutos do mar'],
    medicamentos: 'Nenhum',
    suplementos: 'Creatina Monohidratada 5g, Beta-alanina, Whey 100% Concentrado',
    refeicoes_por_dia: 5,
    horario_acorda: '05:45',
    horario_dorme: '23:00',
    litros_agua: 3.5,
    atividade_fisica: true,
    atividade_fisica_descricao: 'Crossfit 5x/semana + corrida aos domingos',
    observacoes: 'Metabolismo acelerado, necessita de aporte glicídico adequado antes dos treinos.',
    consultas: [
      {
        data_consulta: '2026-05-15',
        peso: 84.0,
        cintura: 86.0,
        quadril: 104.0,
        percentual_gordura: 16.5,
        observacoes: 'Início do protocolo de ganho hipertrófico.',
        proximo_retorno: null // Paciente sem retorno (>30 dias)
      }
    ],
    plano: {
      titulo: 'Protocolo Hipertrofia & Alto Desempenho',
      meta_calorica: 2850,
      observacoes_gerais: 'Garantir ingestão de creatina diária e hidratação rigorosa.',
      refeicoes: [
        { horario: '06:15', nome: 'Pré-Treino', alimentos: '1 banana amassada com 30g de aveia em flocos e 1 colher de mel', substituicoes: '2 torradas integrais com geleia 100% fruta' },
        { horario: '08:00', nome: 'Café da Manhã Pós-Treino', alimentos: '3 ovos mexidos + 2 fatias de pão sourdough + 1 copo de suco de laranja natural', substituicoes: 'Vitamina de whey, aveia, morango e pasta de amendoim' },
        { horario: '12:00', nome: 'Almoço', alimentos: '180g de patinho moído + 180g de arroz branco + 100g de feijão carioca + legumes no vapor', substituicoes: '180g de peito de frango + 200g de mandioca cozida' },
        { horario: '15:30', nome: 'Lanche da Tarde', alimentos: 'Pão francês com queijo minas frescal (2 fatias) e 1 maçã', substituicoes: 'Tapioca com 2 ovos e queijo branco' },
        { horario: '19:30', nome: 'Jantar', alimentos: '180g de filé de sobrecoxa sem pele + 150g de purê de batata inglesa + salada verde à vontade', substituicoes: 'Omelete de 3 ovos com legumes e arroz integral' },
        { horario: '22:00', nome: 'Ceia', alimentos: 'Iogurte natural integral com 1 scoop de whey protein', substituicoes: '20g de castanhas do pará' }
      ]
    }
  },
  {
    nome: 'Beatriz Fagundes Rocha',
    data_nascimento: '1976-03-08',
    sexo: 'Feminino',
    whatsapp: '(31) 98456-1122',
    email: 'beatriz.rocha@email.com',
    peso_inicial: 76.2,
    altura: 1.62,
    objetivos: ['Controlar diabetes', 'Saúde geral'],
    objetivo_texto: 'Controle de glicemia em jejum e perda moderada de peso corporal.',
    nivel_atividade: 'Levemente ativo',
    patologias: ['Diabetes', 'Hipertensão'],
    restricoes_alimentares: ['Açúcar'],
    alergias: ['Nenhum'],
    medicamentos: 'Metformina 850mg, Losartana 50mg',
    suplementos: 'Ômega 3 TG 1000mg, Magnésio Dimalato',
    refeicoes_por_dia: 4,
    horario_acorda: '07:00',
    horario_dorme: '22:00',
    litros_agua: 2.0,
    atividade_fisica: true,
    atividade_fisica_descricao: 'Caminhada moderada 3x na semana (40 min)',
    observacoes: 'Necessidade de controle de carga glicêmica em todas as refeições.',
    consultas: [
      {
        data_consulta: '2026-06-01',
        peso: 76.2,
        cintura: 88.0,
        quadril: 108.0,
        percentual_gordura: 34.0,
        observacoes: 'Exames laboratoriais avaliados. Glicemia 128 mg/dL.',
        proximo_retorno: '2026-07-05'
      },
      {
        data_consulta: '2026-07-05',
        peso: 74.0,
        cintura: 85.0,
        quadril: 106.0,
        percentual_gordura: 32.2,
        observacoes: 'Glicemia em jejum caiu para 104 mg/dL. Ótimo progresso.',
        proximo_retorno: '2026-08-20'
      }
    ],
    plano: {
      titulo: 'Plano de Controle Glicêmico & Saúde Cardiovascular',
      meta_calorica: 1500,
      observacoes_gerais: 'Evitar alimentos com alto índice glicêmico isolados. Sempre associar fibras ou proteínas.',
      refeicoes: [
        { horario: '07:30', nome: 'Café da Manhã', alimentos: '2 fatias de pão 100% integral com pasta de ovos cozidos com azeite + chá verde sem açúcar', substituicoes: 'Mingau de farelo de aveia com sementes de abóbora e canela' },
        { horario: '10:30', nome: 'Lanche Matinal', alimentos: '1 fatia média de mamão papaia com 1 colher de semente de linhaça dourada moída', substituicoes: '1 punhado de nozes (3 unidades)' },
        { horario: '12:45', nome: 'Almoço', alimentos: '100g de peito de frango em cubos com legumes + salada crua variada + 3 colheres de sopa de lentilha', substituicoes: '100g de carne bovina magra + abobrinha refogada + feijão fradinho' },
        { horario: '16:00', nome: 'Lanche da Tarde', alimentos: 'Iogurte natural sem açúcar com 1 colher de farelo de aveia e morangos frescos', substituicoes: '1 torrada integral com queijo cottage e orégano' },
        { horario: '19:30', nome: 'Jantar', alimentos: 'Omelete de 2 ovos com tomate picado, espinafre e orégano + prato de salada de folhas', substituicoes: 'Caldo de abóbora com frango desfiado e sementes de gergelim' }
      ]
    }
  },
  {
    nome: 'Rodrigo Alcantara Martins',
    data_nascimento: '1999-09-14',
    sexo: 'Masculino',
    whatsapp: '(41) 99876-5544',
    email: 'rodrigo.alcantara@email.com',
    peso_inicial: 92.4,
    altura: 1.82,
    objetivos: ['Emagrecer', 'Reeducação alimentar'],
    objetivo_texto: 'Redução de gordura visceral e melhora na disposição no trabalho em home office.',
    nivel_atividade: 'Sedentário',
    patologias: ['Colesterol alto'],
    restricoes_alimentares: ['Nenhum'],
    alergias: ['Nenhum'],
    medicamentos: 'Nenhum',
    suplementos: 'Multivitamínico, Fibras prebióticas (Psyllium)',
    refeicoes_por_dia: 3,
    horario_acorda: '08:00',
    horario_dorme: '00:00',
    litros_agua: 2.2,
    atividade_fisica: false,
    atividade_fisica_descricao: '',
    observacoes: 'Passa mais de 10 horas sentado por dia. Tendência ao consumo de lanches rápidos.',
    consultas: [
      {
        data_consulta: '2026-05-20',
        peso: 92.4,
        cintura: 98.0,
        quadril: 110.0,
        percentual_gordura: 27.8,
        observacoes: 'Consulta inicial. Perfil lipídico com LDL elevado (158 mg/dL).',
        proximo_retorno: null // Paciente sem retorno (>30 dias)
      }
    ],
    plano: {
      titulo: 'Plano Nutricional — Queima de Gordura & Saúde Lipídica',
      meta_calorica: 1900,
      observacoes_gerais: 'Aumentar gradualmente a ingestão de água e evitar beliscar snacks entre as refeições.',
      refeicoes: [
        { horario: '08:30', nome: 'Café da Manhã', alimentos: '2 ovos mexidos com azeite + 1 fatia de pão integral + 1 xícara de café preto sem açúcar', substituicoes: 'Vitamina de frutas vermelhas com leite desnatado e aveia' },
        { horario: '13:00', nome: 'Almoço', alimentos: '150g de peito de frango grelhado + 120g de arroz integral + 1 concha de feijão preto + salada de folhas à vontade com azeite', substituicoes: '150g de filé de peixe assado + 150g de batata baroa cozida' },
        { horario: '17:00', nome: 'Lanche da Tarde', alimentos: '1 maçã com casca + 20g de castanhas do caju sem sal', substituicoes: 'Iogurte natural desnatado com 1 colher de sopa de chia' },
        { horario: '20:30', nome: 'Jantar', alimentos: 'Bowl de legumes grelhados (brócolis, cenoura, abobrinha) com 140g de carne bovina magra desfiada', substituicoes: 'Omelete de 3 claras e 1 gema com legumes picados' }
      ]
    }
  },
  {
    nome: 'Fernanda Lins Albuquerque',
    data_nascimento: '2001-12-03',
    sexo: 'Feminino',
    whatsapp: '(81) 98877-3322',
    email: 'fernanda.lins@email.com',
    peso_inicial: 54.0,
    altura: 1.60,
    objetivos: ['Ganhar massa', 'Saúde geral'],
    objetivo_texto: 'Ganho de peso saudável com ênfase em hipertrofia de membros inferiores.',
    nivel_atividade: 'Moderadamente ativo',
    patologias: ['Nenhum'],
    restricoes_alimentares: ['Glúten'],
    alergias: ['Amendoim'],
    medicamentos: 'Nenhum',
    suplementos: 'Creatina 3g, Whey isolado sem glúten',
    refeicoes_por_dia: 5,
    horario_acorda: '06:45',
    horario_dorme: '23:15',
    litros_agua: 2.3,
    atividade_fisica: true,
    atividade_fisica_descricao: 'Musculação 4x/semana (foco em membros inferiores) + Pilates 1x/semana',
    observacoes: 'Dificuldade de atingir superávit calórico devido à saciedade precoce.',
    consultas: [
      {
        data_consulta: '2026-07-20',
        peso: 54.0,
        cintura: 64.0,
        quadril: 92.0,
        percentual_gordura: 19.5,
        observacoes: 'Primeira consulta de periodização nutricional.',
        proximo_retorno: '2026-08-28'
      }
    ],
    plano: {
      titulo: 'Plano Superávit Calórico Limpo & Sem Glúten',
      meta_calorica: 2150,
      observacoes_gerais: 'Fração calórica distribuída em refeições de alta densidade nutricional.',
      refeicoes: [
        { horario: '07:15', nome: 'Café da Manhã', alimentos: 'Tapioca com 2 ovos e 1 fatia de queijo minas + 1 banana com 1 colher de mel', substituicoes: 'Pão sem glúten com pasta de gergelim (tahine) e ovos mexidos' },
        { horario: '10:00', nome: 'Lanche da Manhã', alimentos: 'Vitamina de abacate com leite sem lactose e 1 scoop de whey protein', substituicoes: 'Mix de castanhas (30g) + 1 fatia de mamão com aveia sem glúten' },
        { horario: '12:30', nome: 'Almoço', alimentos: '130g de filé de frango grelhado + 150g de arroz branco + 100g de feijão + purê de abóbora + azeite', substituicoes: '130g de salmão grelhado + 160g de mandioca cozida' },
        { horario: '16:00', nome: 'Lanche da Tarde', alimentos: '2 bananas amassadas com 30g de aveia sem glúten e 1 colher de mel', substituicoes: 'Smoothie de manga com whey e leite de coco' },
        { horario: '19:45', nome: 'Jantar', alimentos: '120g de carne moída com batata inglesa cozida (150g) e brócolis ao vapor com azeite', substituicoes: 'Omelete de 3 ovos com queijo e arroz branco' }
      ]
    }
  }
];

async function seed() {
  console.log('Iniciando cadastro de 5 pacientes para cada nutricionista...');

  const nutritionists = await sql`SELECT * FROM public.nutricionistas ORDER BY created_at ASC;`;
  console.log(`Encontradas ${nutritionists.length} nutricionistas.`);

  for (const nutri of nutritionists) {
    console.log(`\n--- Nutricionista: ${nutri.nome} (${nutri.email}) [ID: ${nutri.id}] ---`);

    // Remove existing patients for this nutritionist to avoid duplicates if re-running
    await sql`DELETE FROM public.pacientes WHERE nutricionista_id = ${nutri.id};`;

    for (const tpl of PATIENT_TEMPLATES) {
      const [insertedPatient] = await sql`
        INSERT INTO public.pacientes (
          nutricionista_id,
          nome,
          data_nascimento,
          sexo,
          whatsapp,
          email,
          peso_inicial,
          altura,
          objetivos,
          objetivo_texto,
          nivel_atividade,
          patologias,
          restricoes_alimentares,
          alergias,
          medicamentos,
          suplementos,
          refeicoes_por_dia,
          horario_acorda,
          horario_dorme,
          litros_agua,
          atividade_fisica,
          atividade_fisica_descricao,
          observacoes
        ) VALUES (
          ${nutri.id},
          ${tpl.nome},
          ${tpl.data_nascimento},
          ${tpl.sexo},
          ${tpl.whatsapp},
          ${tpl.email},
          ${tpl.peso_inicial},
          ${tpl.altura},
          ${tpl.objetivos},
          ${tpl.objetivo_texto},
          ${tpl.nivel_atividade},
          ${tpl.patologias},
          ${tpl.restricoes_alimentares},
          ${tpl.alergias},
          ${tpl.medicamentos},
          ${tpl.suplementos},
          ${tpl.refeicoes_por_dia},
          ${tpl.horario_acorda},
          ${tpl.horario_dorme},
          ${tpl.litros_agua},
          ${tpl.atividade_fisica},
          ${tpl.atividade_fisica_descricao},
          ${tpl.observacoes}
        )
        RETURNING *;
      `;

      console.log(`  + Paciente criado: ${insertedPatient.nome} (ID: ${insertedPatient.id})`);

      // Inserir consultas
      if (tpl.consultas && tpl.consultas.length > 0) {
        for (const c of tpl.consultas) {
          await sql`
            INSERT INTO public.consultas (
              paciente_id,
              data_consulta,
              peso,
              cintura,
              quadril,
              percentual_gordura,
              observacoes,
              proximo_retorno
            ) VALUES (
              ${insertedPatient.id},
              ${c.data_consulta},
              ${c.peso},
              ${c.cintura},
              ${c.quadril},
              ${c.percentual_gordura},
              ${c.observacoes},
              ${c.proximo_retorno}
            );
          `;
        }
        console.log(`    -> ${tpl.consultas.length} consultas registradas.`);
      }

      // Inserir plano alimentar
      if (tpl.plano) {
        await sql`
          INSERT INTO public.planos_alimentares (
            paciente_id,
            conteudo
          ) VALUES (
            ${insertedPatient.id},
            ${JSON.stringify(tpl.plano)}
          );
        `;
        console.log(`    -> 1 plano alimentar associado.`);
      }
    }
  }

  console.log('\nSeed finalizado com sucesso! Todos os nutricionistas possuem 5 pacientes completos.');
}

seed().catch(err => {
  console.error('Erro no seed:', err);
  process.exit(1);
});
