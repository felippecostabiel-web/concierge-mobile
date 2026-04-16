# Padroes UI/UX — Global

> Diretrizes visuais e de experiencia que se aplicam a todos os produtos com interface. Agentes devem consultar este documento ao criar ou modificar UI.

## Principios de Design

1. **Clareza acima de decoracao** — o usuario deve entender o que fazer sem pensar
2. **Consistencia entre produtos** — o ecossistema Reserva Fiscal deve parecer uma familia
3. **Mobile-first** — projetar para mobile e expandir para desktop
4. **Acessibilidade basica** — contraste adequado, textos legiveis, areas de toque suficientes

## Sistema Visual

### Cores
> Definir paleta e documentar aqui. Exemplo de estrutura:

- **Primaria:** (a definir)
- **Secundaria:** (a definir)
- **Sucesso:** (a definir)
- **Erro:** (a definir)
- **Alerta:** (a definir)
- **Neutros:** (a definir — background, texto, bordas)

### Tipografia
- **Fonte principal:** (a definir)
- **Fonte secundaria/mono:** (a definir)
- **Escala:** (a definir — h1 a body, line-height, spacing)

### Espacamento
- Unidade base: (a definir — ex: 4px, 8px)
- Padding padrao em cards/containers: (a definir)
- Gap entre elementos: (a definir)

### Componentes Padrao
> Lista de componentes reutilizaveis entre projetos.

- Botoes (primario, secundario, ghost, destructive)
- Inputs (text, select, checkbox, radio, date)
- Cards
- Tabelas
- Modais
- Toasts/notificacoes
- Navigation (sidebar, topbar, breadcrumbs)
- Loading states

### Icones
- Biblioteca: (a definir — ex: Lucide, Phosphor)
- Tamanho padrao: (a definir)

## Padroes de Interacao

### Formularios
- Labels sempre visiveis (nao usar placeholder como label)
- Validacao inline em tempo real
- Mensagens de erro claras e acionaveis
- Botao de submit desabilitado ate formulario valido

### Feedback ao Usuario
- Acoes destrutivas pedem confirmacao
- Sucesso: toast temporario
- Erro: mensagem persistente com acao clara
- Loading: skeleton ou spinner (nunca tela em branco)

### Navegacao
- Breadcrumbs em telas com profundidade > 2 niveis
- Back button sempre disponivel
- Estado atual sempre visivel (menu ativo, breadcrumb)

## Por Produto
> Adaptacoes especificas por produto (herdam tudo acima).

| Produto | Adaptacao |
|---------|-----------|
| [[PRJ-Ambiente-Reserva]] | (a definir) |
| [[PRJ-CRM-ReservaFiscal]] | (a definir) |
| [[PRJ-Analitic-ReservaFiscal]] | Dashboard heavy — foco em data viz |
| [[PRJ-Marechal-Barbearia]] | Produto independente — pode ter identidade visual propria |
