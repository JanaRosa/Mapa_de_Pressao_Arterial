🩺 Sistema Digital de Monitoramento - Mapa de Pressão Arterial
Este sistema é uma solução completa para o acompanhamento semanal da pressão arterial e frequência cardíaca. Ele combina um formulário web interativo (Frontend) com automações em nuvem via Google Apps Script e Google Drive (Backend), permitindo que pacientes registrem suas medições diárias e que profissionais de saúde ou acompanhantes organizem essas informações de forma automática.

📱 1. O Formulário Web (Frontend)
O formulário web serve como a interface amigável de coleta e análise em tempo real para o usuário:

Cadastro Inicial do Paciente: Coleta dados pessoais cruciais, como Nome, Idade, Data de Nascimento, Telefone de Contato e Início do Acompanhamento.

Registro Semanal Dinâmico (7 Dias): Dividido em blocos individuais para cada dia da semana, permitindo o preenchimento de duas medições diárias:

☀️ Manhã: Medição antes da medicação habitual (Pressão Arterial e Frequência Cardíaca).

🌙 Noite: Medição no período noturno (Pressão Arterial e Frequência Cardíaca).

Sintomas / Observações: Campo dedicado para anotações diárias (ex: tonturas, dores de cabeça, estresse).

Classificação e Validação Inteligente em Tempo Real: Conforme o usuário digita no formato padrão 120/80, o sistema valida os dados e classifica instantaneamente a medição com marcadores visuais (cores e selos), indicando desde Pressão Normal até Hipertensão Grave (Estágio 3).

Resumo e Estatísticas Automáticas: O painel calcula instantaneamente:

Total de medições realizadas e pendentes (de um total de 14).

Médias de Pressão Sistólica (Máxima), Diastólica (Mínima) e Frequência Cardíaca do período.

Valore máximo e mínimo registrados no período.

Gráfico Dinâmico Interativo: Renderiza um gráfico de linhas (Chart.js) mostrando a variação da pressão e dos batimentos ao longo dos 7 dias para facilitar a leitura visual.

Persistência de Dados (Salvamento Local): Mantém as informações salvas no navegador (localStorage), garantindo que o usuário não perca o preenchimento se fechar a página por engano.

☁️ 2. A Integração com a Planilha no Google Drive (Backend)
Ao clicar no botão de salvamento/envio, o sistema conecta-se ao Google Apps Script via Webhook (POST) para processar e estruturar os dados na nuvem:

Criação de Pasta Automática: Localiza ou cria automaticamente uma pasta dedicada chamada "MAPA DE PRESSÃO ARTERIAL" dentro do Google Drive associado.

Geração de Ficha Individual: Cria uma planilha do Google Sheets exclusiva para cada envio, nomeada de forma padronizada com o nome do paciente e o carimbo de data e hora (ex: Mapa_PA_Nome_Do_Paciente_28-07-2026_1930).

Estruturação e Formatação do Relatório:

Cabeçalho Profissional: Exibe os dados do paciente e o momento exato em que a ficha foi gerada.

Tabela Separada de Registros: Organiza as medições dividindo a pressão em PAS (Sistólica) e PAD (Diastólica) em colunas distintas, o que viabiliza análises numéricas precisas.

Cálculo Automático de Médias no Sheets: Insere fórmulas nativas do Google Sheets (=AVERAGE(...)) na última linha da tabela para calcular a média real do período.

Anotações Gerais: Inclui uma seção específica para observações gerais informadas pelo paciente.

Design Limpo e Organizado: Aplica formatação de cores, centralização de textos e ajuste automático de largura de colunas para pronta impressão ou exportação em PDF.
