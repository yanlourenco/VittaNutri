# Prompt 4 — Cadastro e listagem de pacientes

Agora vamos criar a tela de pacientes do sistema. Ela é composta por duas partes: a listagem de pacientes e o formulário de cadastro/edição.

## Tela de listagem de pacientes
- Exibir todos os pacientes cadastrados pela nutricionista logada em tempo real via Neon PostgreSQL
- Cada paciente exibe: nome, objetivo principal, data da última consulta, contato e status de retorno
- Campo de busca por nome, e-mail ou WhatsApp no topo da listagem
- Filtro por objetivos clínicos e pílulas de status rápido (Todos, Sem Retorno >30d, Com Retorno)
- Botão "Novo Paciente" que abre o formulário de cadastro
- Cada linha da tabela é interativa e clicável, redirecionando diretamente para o prontuário/perfil do paciente
- Se não houver pacientes cadastrados, exibir a mensagem "Nenhum paciente cadastrado ainda"
- Ações rápidas em cada paciente: Abrir Prontuário, Editar Dados e Excluir Paciente (com confirmação em modal customizado)

## Formulário de cadastro / edição — Anamnese Clínica
O formulário é organizado em 3 abas estruturadas com barra de progresso visual (Wizard): Pessoal, Clínico e Hábitos.

### Aba 1 — Pessoal
- Nome completo (texto, obrigatório)
- Data de nascimento (seletor de data — sistema calcula a idade automaticamente e exibe em badge "X anos", obrigatório)
- Sexo (seleção única: Feminino, Masculino, Outro)
- WhatsApp (número com máscara e formatação automática, obrigatório)
- Email (texto, formato email)

### Aba 2 — Clínico
- Peso atual em kg (número — sistema exibe sufixo "kg" automaticamente, obrigatório)
- Altura em cm (número — sistema exibe sufixo "cm" automaticamente e converte para metros no cálculo, obrigatório)
- IMC (calculado automaticamente em tempo real a partir de peso e altura, somente leitura, com classificação OMS por cores)
- Objetivo (múltipla escolha: Emagrecer, Ganhar massa, Controlar diabetes, Saúde geral, Performance esportiva, Reeducação alimentar) + campo de texto livre para detalhamento adicional
- Nível de atividade física (seleção única: Sedentário, Levemente ativo, Moderadamente ativo, Muito ativo, Extremamente ativo)
- Patologias ou condições de saúde (múltipla escolha: Diabetes, Hipertensão, Hipotireoidismo, Hipertireoidismo, Síndrome do ovário policístico, Doença celíaca, Colesterol alto) + opção "Nenhum" (com desmarcação automática das outras) + campo com botão "+ Adicionar" para inclusão de patologias customizadas livres
- Restrições alimentares (múltipla escolha: Lactose, Glúten, Açúcar, Carne vermelha, Frutos do mar) + opção "Nenhum" + campo com botão "+ Adicionar" para inclusão de restrições customizadas
- Alergias alimentares (múltipla escolha: Amendoim, Leite, Ovo, Soja, Trigo, Frutos do mar) + opção "Nenhum" + campo com botão "+ Adicionar" para inclusão de alergias customizadas
- Medicamentos contínuos (texto livre)
- Suplementos em uso (texto livre)

### Aba 3 — Hábitos
- Quantas refeições faz por dia (número, padrão 3)
- Horário que acorda (campo inteligente com conversão automática para formato HH:MM ao sair do campo, ex: 6 → "06:00", 630 → "06:30")
- Horário que dorme (campo inteligente com conversão automática para formato HH:MM ao sair do campo, ex: 23 → "23:00", 2230 → "22:30")
- Quantidade de água por dia (número — sistema exibe sufixo "litros" automaticamente)
- Pratica atividade física (checkbox / toggle sim/não — se sim, abre campo de texto para modalidade e frequência semanal)
- Observações gerais (texto livre para histórico familiar e queixas gastrointestinais)

## Regras importantes
- Os campos obrigatórios validados são: nome completo, data de nascimento, whatsapp, peso e altura
- Ao salvar, vincular o paciente à nutricionista logada via `nutricionista_id`
- Após salvar com sucesso, redirecionar/abrir imediatamente o perfil/prontuário do paciente recém cadastrado
- Exibir toast notification de feedback de sucesso ao salvar e ao atualizar
- Permitir edição e atualização completa de todos os dados cadastrais do paciente
- Modal de confirmação seguro (`ConfirmModal`) antes de excluir paciente

## Design
- Padrão visual do sistema em Azul Meia-Noite (`#0b132b`), Azul Claro (`#0284c7`), Cinza Slate e Branco Puro
- Iconografia profissional com Lucide React (sem emojis informais)
- Menu lateral fixo e cabeçalho mantidos