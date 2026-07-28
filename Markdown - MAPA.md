# 🩺 Mapa da Pressão Arterial - Aplicação Web de Saúde Digital

Aplicação web moderna, acessível e otimizada para idosos e hipertensos, desenhada para registro e acompanhamento semanal da pressão arterial com integração ao **Google Sheets** e **Google Drive**.

---

## 🚀 Funcionalidades

- **Interface Clean & Acessível**: Inspirada em apps corporativos de saúde (Apple Health, Google Health).
- **Entrada Facilitada**: Botões e fontes amplas, campos autoformatados.
- **Validação Inteligente**: Interpretação automática dos níveis de PA de acordo com as Diretrizes Brasileiras de Hipertensão.
- **Gráficos e Estatísticas**: Médias de Sistólica, Diastólica, Frequência Cardíaca e gráfico de evolução semanal com Chart.js.
- **Suporte Off-line e Nuvem**: Escolha entre armazenamento local (`LocalStorage`) ou salvamento em nuvem via **Google Apps Script**.
- **Layout de Impressão A4**: Formatação limpa pronta para impressão física ou exportação via PDF pelo navegador com campos de assinatura médica.

---

## 🛠️ Passo a Passo de Instalação e Implantação

### Opção A: Uso Local (Apenas Navegador)
1. Faça o download dos arquivos `index.html`, `style.css` e `script.js` na mesma pasta.
2. Abra o arquivo `index.html` em qualquer navegador moderno (Chrome, Edge, Safari, Firefox).
3. O sistema estará pronto para uso salvando as informações no próprio navegador do usuário.

---

### Opção B: Integração com Google Sheets e Google Drive (Google Apps Script)

Para permitir que o paciente clique em **Salvar Informações** e os dados sejam enviados diretamente para uma planilha no Google Drive:

1. Acesse o [Google Drive](https://drive.google.com).
2. Clique em **Novo** > **Mais** > **Google Apps Script**.
3. Apague qualquer código no editor e cole o conteúdo do arquivo `apps-script.gs`.
4. Clique no menu superior **Implantar** > **Nova implantação**.
5. No ícone de engrenagem (Selecione o tipo), escolha **App da Web**.
6. Preencha as configurações:
   - **Descrição**: API Mapa da Pressão Arterial
   - **Executar como**: *Sua conta (Eu)*
   - **Quem tem acesso**: *Qualquer pessoa* (Necessário para permitir envio do formulário sem login)
7. Clique em **Implantar**, autorize as permissões de acesso ao Drive.
8. Copie o **URL do App da Web** gerado.
9. Abra o arquivo `script.js` do seu projeto, encontre a linha 8:
   ```javascript
   const APPS_SCRIPT_URL = 'SUA_URL_DO_GOOGLE_APPS_SCRIPT_AQUI';