import { neon } from '@neondatabase/serverless';

const DEFAULT_DB_URL = 'postgresql://neondb_owner:npg_JiILodXxSg48@ep-wild-flower-acin8qgg-pooler.sa-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require';
const connectionString = import.meta.env.VITE_DATABASE_URL || DEFAULT_DB_URL;

let sql = null;
if (connectionString) {
  try {
    sql = neon(connectionString);
  } catch (err) {
    console.warn('Neon connection initialization notice:', err);
  }
}

// Fallback Local Storage keys
const LS_KEYS = {
  NUTRICIONISTAS: 'vn_nutricionistas',
  PACIENTES: 'vn_pacientes',
  CONSULTAS: 'vn_consultas',
  PLANOS: 'vn_planos_alimentares'
};

const getLS = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const setLS = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('LocalStorage write error:', err);
  }
};

const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Obtém ou cria o registro do nutricionista na tabela public.nutricionistas
 */
export async function getOrCreateNutricionista(user) {
  if (!user || !user.email) return null;

  if (sql) {
    try {
      const existing = await sql`
        SELECT * FROM public.nutricionistas 
        WHERE email = ${user.email} 
        LIMIT 1
      `;
      if (existing && existing.length > 0) {
        return existing[0];
      }

      const inserted = await sql`
        INSERT INTO public.nutricionistas (nome, email)
        VALUES (${user.name || user.email.split('@')[0]}, ${user.email})
        RETURNING *
      `;
      return inserted[0];
    } catch (err) {
      console.warn('Database fallback on getOrCreateNutricionista:', err);
    }
  }

  // Fallback LocalStorage
  const list = getLS(LS_KEYS.NUTRICIONISTAS);
  let item = list.find(n => n.email === user.email);
  if (!item) {
    item = {
      id: generateUUID(),
      nome: user.name || user.email.split('@')[0],
      email: user.email,
      created_at: new Date().toISOString()
    };
    list.push(item);
    setLS(LS_KEYS.NUTRICIONISTAS, list);
  }
  return item;
}

/**
 * PACIENTES
 */
export async function getPacientes(nutricionistaId) {
  if (!nutricionistaId) return [];

  if (sql) {
    try {
      const rows = await sql`
        SELECT p.*,
          (SELECT COUNT(*)::int FROM public.consultas c WHERE c.paciente_id = p.id) as total_consultas,
          (SELECT MAX(c.data_consulta) FROM public.consultas c WHERE c.paciente_id = p.id) as ultima_consulta,
          (SELECT c.proximo_retorno FROM public.consultas c WHERE c.paciente_id = p.id AND c.proximo_retorno >= CURRENT_DATE ORDER BY c.proximo_retorno ASC LIMIT 1) as proximo_retorno
        FROM public.pacientes p
        WHERE p.nutricionista_id = ${nutricionistaId}
        ORDER BY p.created_at DESC
      `;
      return rows;
    } catch (err) {
      console.warn('Database error on getPacientes, trying fallback:', err);
    }
  }

  const pacientes = getLS(LS_KEYS.PACIENTES).filter(p => p.nutricionista_id === nutricionistaId);
  const consultas = getLS(LS_KEYS.CONSULTAS);
  return pacientes.map(p => {
    const pConsultas = consultas.filter(c => c.paciente_id === p.id);
    const sorted = [...pConsultas].sort((a, b) => new Date(b.data_consulta) - new Date(a.data_consulta));
    const upcoming = pConsultas
      .filter(c => c.proximo_retorno && new Date(c.proximo_retorno) >= new Date())
      .sort((a, b) => new Date(a.proximo_retorno) - new Date(b.proximo_retorno))[0];

    return {
      ...p,
      total_consultas: pConsultas.length,
      ultima_consulta: sorted[0]?.data_consulta || null,
      proximo_retorno: upcoming?.proximo_retorno || null
    };
  });
}

export async function createPaciente(nutricionistaId, data) {
  if (!nutricionistaId) throw new Error('Nutricionista não identificado.');

  const cleanData = {
    nutricionista_id: nutricionistaId,
    nome: data.nome,
    data_nascimento: data.data_nascimento || null,
    sexo: data.sexo || null,
    whatsapp: data.whatsapp || null,
    email: data.email || null,
    peso_inicial: data.peso_inicial ? parseFloat(data.peso_inicial) : null,
    altura: data.altura ? parseFloat(data.altura) : null,
    objetivos: Array.isArray(data.objetivos) ? data.objetivos : [],
    objetivo_texto: data.objetivo_texto || null,
    nivel_atividade: data.nivel_atividade || 'Sedentário',
    patologias: Array.isArray(data.patologias) ? data.patologias : [],
    restricoes_alimentares: Array.isArray(data.restricoes_alimentares) ? data.restricoes_alimentares : [],
    alergias: Array.isArray(data.alergias) ? data.alergias : [],
    medicamentos: data.medicamentos || null,
    suplementos: data.suplementos || null,
    refeicoes_por_dia: data.refeicoes_por_dia ? parseInt(data.refeicoes_por_dia) : 3,
    horario_acorda: data.horario_acorda || null,
    horario_dorme: data.horario_dorme || null,
    litros_agua: data.litros_agua ? parseFloat(data.litros_agua) : null,
    atividade_fisica: Boolean(data.atividade_fisica),
    atividade_fisica_descricao: data.atividade_fisica_descricao || null,
    observacoes: data.observacoes || null
  };

  if (sql) {
    try {
      const inserted = await sql`
        INSERT INTO public.pacientes (
          nutricionista_id, nome, data_nascimento, sexo, whatsapp, email,
          peso_inicial, altura, objetivos, objetivo_texto, nivel_atividade,
          patologias, restricoes_alimentares, alergias, medicamentos, suplementos,
          refeicoes_por_dia, horario_acorda, horario_dorme, litros_agua,
          atividade_fisica, atividade_fisica_descricao, observacoes
        ) VALUES (
          ${cleanData.nutricionista_id}, ${cleanData.nome}, ${cleanData.data_nascimento},
          ${cleanData.sexo}, ${cleanData.whatsapp}, ${cleanData.email},
          ${cleanData.peso_inicial}, ${cleanData.altura}, ${cleanData.objetivos},
          ${cleanData.objetivo_texto}, ${cleanData.nivel_atividade}, ${cleanData.patologias},
          ${cleanData.restricoes_alimentares}, ${cleanData.alergias}, ${cleanData.medicamentos},
          ${cleanData.suplementos}, ${cleanData.refeicoes_por_dia}, ${cleanData.horario_acorda},
          ${cleanData.horario_dorme}, ${cleanData.litros_agua}, ${cleanData.atividade_fisica},
          ${cleanData.atividade_fisica_descricao}, ${cleanData.observacoes}
        )
        RETURNING *
      `;
      return inserted[0];
    } catch (err) {
      console.warn('Database error on createPaciente, using local fallback:', err);
    }
  }

  const list = getLS(LS_KEYS.PACIENTES);
  const newItem = {
    id: generateUUID(),
    ...cleanData,
    created_at: new Date().toISOString()
  };
  list.unshift(newItem);
  setLS(LS_KEYS.PACIENTES, list);
  return newItem;
}

export async function updatePaciente(id, data) {
  if (!id) throw new Error('ID do paciente é obrigatório.');

  const cleanData = {
    nome: data.nome,
    data_nascimento: data.data_nascimento || null,
    sexo: data.sexo || null,
    whatsapp: data.whatsapp || null,
    email: data.email || null,
    peso_inicial: data.peso_inicial ? parseFloat(data.peso_inicial) : null,
    altura: data.altura ? parseFloat(data.altura) : null,
    objetivos: Array.isArray(data.objetivos) ? data.objetivos : [],
    objetivo_texto: data.objetivo_texto || null,
    nivel_atividade: data.nivel_atividade || 'Sedentário',
    patologias: Array.isArray(data.patologias) ? data.patologias : [],
    restricoes_alimentares: Array.isArray(data.restricoes_alimentares) ? data.restricoes_alimentares : [],
    alergias: Array.isArray(data.alergias) ? data.alergias : [],
    medicamentos: data.medicamentos || null,
    suplementos: data.suplementos || null,
    refeicoes_por_dia: data.refeicoes_por_dia ? parseInt(data.refeicoes_por_dia) : 3,
    horario_acorda: data.horario_acorda || null,
    horario_dorme: data.horario_dorme || null,
    litros_agua: data.litros_agua ? parseFloat(data.litros_agua) : null,
    atividade_fisica: Boolean(data.atividade_fisica),
    atividade_fisica_descricao: data.atividade_fisica_descricao || null,
    observacoes: data.observacoes || null
  };

  if (sql) {
    try {
      const updated = await sql`
        UPDATE public.pacientes SET
          nome = ${cleanData.nome},
          data_nascimento = ${cleanData.data_nascimento},
          sexo = ${cleanData.sexo},
          whatsapp = ${cleanData.whatsapp},
          email = ${cleanData.email},
          peso_inicial = ${cleanData.peso_inicial},
          altura = ${cleanData.altura},
          objetivos = ${cleanData.objetivos},
          objetivo_texto = ${cleanData.objetivo_texto},
          nivel_atividade = ${cleanData.nivel_atividade},
          patologias = ${cleanData.patologias},
          restricoes_alimentares = ${cleanData.restricoes_alimentares},
          alergias = ${cleanData.alergias},
          medicamentos = ${cleanData.medicamentos},
          suplementos = ${cleanData.suplementos},
          refeicoes_por_dia = ${cleanData.refeicoes_por_dia},
          horario_acorda = ${cleanData.horario_acorda},
          horario_dorme = ${cleanData.horario_dorme},
          litros_agua = ${cleanData.litros_agua},
          atividade_fisica = ${cleanData.atividade_fisica},
          atividade_fisica_descricao = ${cleanData.atividade_fisica_descricao},
          observacoes = ${cleanData.observacoes}
        WHERE id = ${id}
        RETURNING *
      `;
      return updated[0];
    } catch (err) {
      console.warn('Database error on updatePaciente, fallback:', err);
    }
  }

  const list = getLS(LS_KEYS.PACIENTES);
  const index = list.findIndex(p => p.id === id);
  if (index !== -1) {
    list[index] = { ...list[index], ...cleanData };
    setLS(LS_KEYS.PACIENTES, list);
    return list[index];
  }
  throw new Error('Paciente não encontrado');
}

export async function deletePaciente(id) {
  if (!id) throw new Error('ID do paciente é obrigatório.');

  if (sql) {
    try {
      await sql`DELETE FROM public.pacientes WHERE id = ${id}`;
      return true;
    } catch (err) {
      console.warn('Database error on deletePaciente, fallback:', err);
    }
  }

  let list = getLS(LS_KEYS.PACIENTES).filter(p => p.id !== id);
  setLS(LS_KEYS.PACIENTES, list);
  let consultas = getLS(LS_KEYS.CONSULTAS).filter(c => c.paciente_id !== id);
  setLS(LS_KEYS.CONSULTAS, consultas);
  let planos = getLS(LS_KEYS.PLANOS).filter(pl => pl.paciente_id !== id);
  setLS(LS_KEYS.PLANOS, planos);
  return true;
}

/**
 * CONSULTAS & MEDIÇÕES ANTROPOMÉTRICAS
 */
export async function getConsultas(pacienteId) {
  if (!pacienteId) return [];

  if (sql) {
    try {
      const rows = await sql`
        SELECT * FROM public.consultas
        WHERE paciente_id = ${pacienteId}
        ORDER BY data_consulta DESC, created_at DESC
      `;
      return rows;
    } catch (err) {
      console.warn('Database error on getConsultas, fallback:', err);
    }
  }

  return getLS(LS_KEYS.CONSULTAS)
    .filter(c => c.paciente_id === pacienteId)
    .sort((a, b) => new Date(b.data_consulta) - new Date(a.data_consulta));
}

export async function createConsulta(data) {
  if (!data.paciente_id) throw new Error('Paciente é obrigatório.');
  if (!data.data_consulta) throw new Error('Data da consulta é obrigatória.');

  const cleanData = {
    paciente_id: data.paciente_id,
    data_consulta: data.data_consulta,
    peso: data.peso ? parseFloat(data.peso) : null,
    cintura: data.cintura ? parseFloat(data.cintura) : null,
    quadril: data.quadril ? parseFloat(data.quadril) : null,
    percentual_gordura: data.percentual_gordura ? parseFloat(data.percentual_gordura) : null,
    observacoes: data.observacoes || null,
    proximo_retorno: data.proximo_retorno || null
  };

  if (sql) {
    try {
      const inserted = await sql`
        INSERT INTO public.consultas (
          paciente_id, data_consulta, peso, cintura, quadril, percentual_gordura, observacoes, proximo_retorno
        ) VALUES (
          ${cleanData.paciente_id}, ${cleanData.data_consulta}, ${cleanData.peso},
          ${cleanData.cintura}, ${cleanData.quadril}, ${cleanData.percentual_gordura},
          ${cleanData.observacoes}, ${cleanData.proximo_retorno}
        )
        RETURNING *
      `;
      return inserted[0];
    } catch (err) {
      console.warn('Database error on createConsulta, fallback:', err);
    }
  }

  const list = getLS(LS_KEYS.CONSULTAS);
  const newItem = {
    id: generateUUID(),
    ...cleanData,
    created_at: new Date().toISOString()
  };
  list.unshift(newItem);
  setLS(LS_KEYS.CONSULTAS, list);
  return newItem;
}

export async function updateConsulta(id, data) {
  if (!id) throw new Error('ID da consulta é obrigatório.');

  const cleanData = {
    data_consulta: data.data_consulta,
    peso: data.peso ? parseFloat(data.peso) : null,
    cintura: data.cintura ? parseFloat(data.cintura) : null,
    quadril: data.quadril ? parseFloat(data.quadril) : null,
    percentual_gordura: data.percentual_gordura ? parseFloat(data.percentual_gordura) : null,
    observacoes: data.observacoes || null,
    proximo_retorno: data.proximo_retorno || null
  };

  if (sql) {
    try {
      const updated = await sql`
        UPDATE public.consultas SET
          data_consulta = ${cleanData.data_consulta},
          peso = ${cleanData.peso},
          cintura = ${cleanData.cintura},
          quadril = ${cleanData.quadril},
          percentual_gordura = ${cleanData.percentual_gordura},
          observacoes = ${cleanData.observacoes},
          proximo_retorno = ${cleanData.proximo_retorno}
        WHERE id = ${id}
        RETURNING *
      `;
      return updated[0];
    } catch (err) {
      console.warn('Database error on updateConsulta, fallback:', err);
    }
  }

  const list = getLS(LS_KEYS.CONSULTAS);
  const index = list.findIndex(c => c.id === id);
  if (index !== -1) {
    list[index] = { ...list[index], ...cleanData };
    setLS(LS_KEYS.CONSULTAS, list);
    return list[index];
  }
  throw new Error('Consulta não encontrada.');
}

export async function deleteConsulta(id) {
  if (!id) return false;

  if (sql) {
    try {
      await sql`DELETE FROM public.consultas WHERE id = ${id}`;
      return true;
    } catch (err) {
      console.warn('Database error on deleteConsulta, fallback:', err);
    }
  }

  let list = getLS(LS_KEYS.CONSULTAS).filter(c => c.id !== id);
  setLS(LS_KEYS.CONSULTAS, list);
  return true;
}

/**
 * PLANOS ALIMENTARES
 */
export async function getPlanosAlimentares(pacienteId) {
  if (!pacienteId) return [];

  if (sql) {
    try {
      const rows = await sql`
        SELECT * FROM public.planos_alimentares
        WHERE paciente_id = ${pacienteId}
        ORDER BY created_at DESC
      `;
      return rows;
    } catch (err) {
      console.warn('Database error on getPlanosAlimentares, fallback:', err);
    }
  }

  return getLS(LS_KEYS.PLANOS)
    .filter(pl => pl.paciente_id === pacienteId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export async function getAllPlanosAlimentares(nutricionistaId) {
  if (!nutricionistaId) return [];

  if (sql) {
    try {
      const rows = await sql`
        SELECT pl.*, p.nome as paciente_nome, p.email as paciente_email, p.whatsapp as paciente_whatsapp
        FROM public.planos_alimentares pl
        INNER JOIN public.pacientes p ON pl.paciente_id = p.id
        WHERE p.nutricionista_id = ${nutricionistaId}
        ORDER BY pl.created_at DESC
      `;
      return rows;
    } catch (err) {
      console.warn('Database error on getAllPlanosAlimentares, fallback:', err);
    }
  }

  const pacientes = getLS(LS_KEYS.PACIENTES).filter(p => p.nutricionista_id === nutricionistaId);
  const pMap = Object.fromEntries(pacientes.map(p => [p.id, p]));
  const planos = getLS(LS_KEYS.PLANOS).filter(pl => pMap[pl.paciente_id]);

  return planos.map(pl => ({
    ...pl,
    paciente_nome: pMap[pl.paciente_id]?.nome || 'Desconhecido',
    paciente_email: pMap[pl.paciente_id]?.email || '',
    paciente_whatsapp: pMap[pl.paciente_id]?.whatsapp || ''
  })).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export async function createPlanoAlimentar(data) {
  if (!data.paciente_id) throw new Error('Paciente é obrigatório.');
  if (!data.conteudo) throw new Error('Conteúdo do plano é obrigatório.');

  const cleanData = {
    paciente_id: data.paciente_id,
    conteudo: typeof data.conteudo === 'string' ? JSON.parse(data.conteudo) : data.conteudo
  };

  if (sql) {
    try {
      const inserted = await sql`
        INSERT INTO public.planos_alimentares (paciente_id, conteudo)
        VALUES (${cleanData.paciente_id}, ${JSON.stringify(cleanData.conteudo)})
        RETURNING *
      `;
      return inserted[0];
    } catch (err) {
      console.warn('Database error on createPlanoAlimentar, fallback:', err);
    }
  }

  const list = getLS(LS_KEYS.PLANOS);
  const newItem = {
    id: generateUUID(),
    ...cleanData,
    created_at: new Date().toISOString()
  };
  list.unshift(newItem);
  setLS(LS_KEYS.PLANOS, list);
  return newItem;
}

export async function updatePlanoAlimentar(id, data) {
  if (!id) throw new Error('ID do plano é obrigatório.');

  const cleanConteudo = typeof data.conteudo === 'string' ? JSON.parse(data.conteudo) : data.conteudo;

  if (sql) {
    try {
      const updated = await sql`
        UPDATE public.planos_alimentares SET
          conteudo = ${JSON.stringify(cleanConteudo)}
        WHERE id = ${id}
        RETURNING *
      `;
      return updated[0];
    } catch (err) {
      console.warn('Database error on updatePlanoAlimentar, fallback:', err);
    }
  }

  const list = getLS(LS_KEYS.PLANOS);
  const index = list.findIndex(p => p.id === id);
  if (index !== -1) {
    list[index] = { ...list[index], conteudo: cleanConteudo };
    setLS(LS_KEYS.PLANOS, list);
    return list[index];
  }
  throw new Error('Plano alimentar não encontrado.');
}

export async function deletePlanoAlimentar(id) {
  if (!id) return false;

  if (sql) {
    try {
      await sql`DELETE FROM public.planos_alimentares WHERE id = ${id}`;
      return true;
    } catch (err) {
      console.warn('Database error on deletePlanoAlimentar, fallback:', err);
    }
  }

  let list = getLS(LS_KEYS.PLANOS).filter(p => p.id !== id);
  setLS(LS_KEYS.PLANOS, list);
  return true;
}

/**
 * DASHBOARD STATS & MÉTRICAS (PROMPT 3 COMPLIANCE)
 * - Card 1: Total de pacientes ativos (da nutricionista)
 * - Card 2: Consultas da semana atual
 * - Card 3: Pacientes sem retorno (última consulta > 30 dias sem próximo retorno agendado)
 */
export async function getDashboardData(nutricionistaId) {
  if (!nutricionistaId) return null;

  try {
    const pacientes = await getPacientes(nutricionistaId);
    let totalConsultas = 0;
    let consultasSemana = 0;
    let consultasRecentes = [];
    let proximosRetornos = [];
    let pacientesSemRetorno = [];
    let planosCount = 0;

    if (sql) {
      try {
        // Estatísticas agregadas
        const stats = await sql`
          SELECT 
            (SELECT COUNT(*)::int FROM public.consultas c INNER JOIN public.pacientes p ON c.paciente_id = p.id WHERE p.nutricionista_id = ${nutricionistaId}) as total_consultas,
            (SELECT COUNT(*)::int FROM public.consultas c INNER JOIN public.pacientes p ON c.paciente_id = p.id WHERE p.nutricionista_id = ${nutricionistaId} AND c.data_consulta >= date_trunc('week', CURRENT_DATE)::date AND c.data_consulta <= (date_trunc('week', CURRENT_DATE) + interval '6 days')::date) as consultas_semana,
            (SELECT COUNT(*)::int FROM public.planos_alimentares pl INNER JOIN public.pacientes p ON pl.paciente_id = p.id WHERE p.nutricionista_id = ${nutricionistaId}) as total_planos
        `;
        totalConsultas = stats[0]?.total_consultas || 0;
        consultasSemana = stats[0]?.consultas_semana || 0;
        planosCount = stats[0]?.total_planos || 0;

        // Pacientes sem retorno: última consulta há mais de 30 dias E sem próximo retorno agendado (ou retorno já vencido)
        pacientesSemRetorno = await sql`
          SELECT 
            p.id, 
            p.nome, 
            p.email, 
            p.whatsapp,
            p.sexo,
            p.nivel_atividade,
            p.peso_inicial,
            MAX(c.data_consulta) as ultima_consulta,
            MAX(c.proximo_retorno) as proximo_retorno
          FROM public.pacientes p
          LEFT JOIN public.consultas c ON c.paciente_id = p.id
          WHERE p.nutricionista_id = ${nutricionistaId}
          GROUP BY p.id, p.nome, p.email, p.whatsapp, p.sexo, p.nivel_atividade, p.peso_inicial, p.created_at
          HAVING (
            (MAX(c.data_consulta) IS NOT NULL AND MAX(c.data_consulta) < (CURRENT_DATE - interval '30 days')::date)
            OR (MAX(c.data_consulta) IS NULL AND p.created_at < (CURRENT_DATE - interval '30 days'))
          )
          AND (MAX(c.proximo_retorno) IS NULL OR MAX(c.proximo_retorno) < CURRENT_DATE)
          ORDER BY COALESCE(MAX(c.data_consulta), p.created_at::date) ASC
        `;

        consultasRecentes = await sql`
          SELECT c.*, p.nome as paciente_nome, p.whatsapp as paciente_whatsapp
          FROM public.consultas c
          INNER JOIN public.pacientes p ON c.paciente_id = p.id
          WHERE p.nutricionista_id = ${nutricionistaId}
          ORDER BY c.data_consulta DESC, c.created_at DESC
          LIMIT 5
        `;

        proximosRetornos = await sql`
          SELECT c.*, p.nome as paciente_nome, p.whatsapp as paciente_whatsapp
          FROM public.consultas c
          INNER JOIN public.pacientes p ON c.paciente_id = p.id
          WHERE p.nutricionista_id = ${nutricionistaId}
            AND c.proximo_retorno >= CURRENT_DATE
          ORDER BY c.proximo_retorno ASC
          LIMIT 6
        `;
      } catch (err) {
        console.warn('Fallback inside getDashboardData:', err);
      }
    }

    // Fallback local caso offline ou sem registros via DB
    if (pacientesSemRetorno.length === 0 && consultasRecentes.length === 0) {
      const pIds = new Set(pacientes.map(p => p.id));
      const allConsultas = getLS(LS_KEYS.CONSULTAS).filter(c => pIds.has(c.paciente_id));
      const allPlanos = getLS(LS_KEYS.PLANOS).filter(pl => pIds.has(pl.paciente_id));
      
      totalConsultas = allConsultas.length;
      planosCount = allPlanos.length;

      // Calcular início e fim da semana atual
      const now = new Date();
      const currentDay = now.getDay();
      const diffToMonday = now.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
      const monday = new Date(now.setDate(diffToMonday));
      monday.setHours(0, 0, 0, 0);

      consultasSemana = allConsultas.filter(c => {
        const cDate = new Date(c.data_consulta);
        return cDate >= monday;
      }).length;

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      pacientesSemRetorno = pacientes.filter(p => {
        const pConsultas = allConsultas.filter(c => c.paciente_id === p.id);
        const sorted = [...pConsultas].sort((a, b) => new Date(b.data_consulta) - new Date(a.data_consulta));
        const lastConsulta = sorted[0];
        const upcoming = pConsultas.find(c => c.proximo_retorno && new Date(c.proximo_retorno) >= new Date());

        if (upcoming) return false;

        if (lastConsulta) {
          return new Date(lastConsulta.data_consulta) < thirtyDaysAgo;
        } else {
          return p.created_at && new Date(p.created_at) < thirtyDaysAgo;
        }
      });

      const pMap = Object.fromEntries(pacientes.map(p => [p.id, p]));
      consultasRecentes = allConsultas
        .map(c => ({ ...c, paciente_nome: pMap[c.paciente_id]?.nome || 'Paciente', paciente_whatsapp: pMap[c.paciente_id]?.whatsapp || '' }))
        .sort((a, b) => new Date(b.data_consulta) - new Date(a.data_consulta))
        .slice(0, 5);

      proximosRetornos = allConsultas
        .filter(c => c.proximo_retorno && new Date(c.proximo_retorno) >= new Date(new Date().setHours(0, 0, 0, 0)))
        .map(c => ({ ...c, paciente_nome: pMap[c.paciente_id]?.nome || 'Paciente', paciente_whatsapp: pMap[c.paciente_id]?.whatsapp || '' }))
        .sort((a, b) => new Date(a.proximo_retorno) - new Date(b.proximo_retorno))
        .slice(0, 6);
    }

    // Distribuição de Objetivos
    const objetivosCount = {};
    pacientes.forEach(p => {
      if (Array.isArray(p.objetivos)) {
        p.objetivos.forEach(obj => {
          objetivosCount[obj] = (objetivosCount[obj] || 0) + 1;
        });
      }
    });

    return {
      totalPacientes: pacientes.length,
      totalConsultas,
      consultasSemana,
      totalPlanos: planosCount,
      totalProximosRetornos: proximosRetornos.length,
      pacientesSemRetorno: pacientesSemRetorno || [],
      proximosRetornos,
      consultasRecentes,
      objetivosCount,
      pacientes
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return null;
  }
}
