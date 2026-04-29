# Atmospheric Wallpaper

Live wallpaper para Windows com efeito de atmospheric scattering que muda automaticamente baseado na hora do dia.

## Características

- 🌅 **Iluminação dinâmica**: A cor do céu e intensidade do sol mudam automaticamente conforme a hora do dia
- ☁️ **Nuvens procedurais**: Efeito de nuvens geradas via shader
- 🎨 **Visual idêntico ao original**: Mantém o mesmo nível visual e efeitos da referência
- 💻 **Otimizado para desktop**: Roda como wallpaper em segundo plano

## Instalação

### Opção 1: Baixar Instalador Pronto (Recomendado)

A maneira mais fácil de instalar é baixar o instalador pronto diretamente da página de **Releases** deste repositório no GitHub:

1. Vá até a aba **[Releases](../../releases)** no topo desta página
2. Baixe o arquivo `Atmospheric.Wallpaper.Setup.X.X.X.exe` mais recente
3. Execute o instalador e siga as instruções
4. Pronto! O wallpaper começará a rodar automaticamente

**Não é necessário instalar Node.js, npm ou usar terminal!**

### Opção 2: Compilar do Código Fonte

Se você deseja compilar o projeto a partir do código fonte:

#### Pré-requisitos

- Node.js (versão 16 ou superior)
- Windows 10/11

#### Passos

1. Clone este repositório ou baixe o código fonte
2. Instale as dependências:
```bash
npm install
```

3. Execute o programa para testar:
```bash
npm start
```

4. Para criar um executável Windows com instalador:
```bash
npm run dist
```

O instalador será gerado na pasta `dist`.

## Como Funciona

O programa usa:
- **Electron**: Para criar uma janela fullscreen transparente que fica sempre no topo
- **Three.js + React Three Fiber**: Para renderização 3D com shaders personalizados
- **GLSL Shaders**: Para os efeitos de scattering atmosférico, nuvens e iluminação

### Ciclo Diário

- **Dia (6h-18h)**: Céu azul brilhante, sol intenso
- **Manhã/Tarde (5h-6h, 18h-19h)**: Tons alaranjados e dourados
- **Crepúsculo/Amanhecer (4h-5h, 19h-20h)**: Cores roxas e azuis escuras
- **Noite (20h-4h)**: Céu escuro com iluminação suave

## Estrutura do Projeto

```
atmospheric-wallpaper/
├── main.js          # Processo principal do Electron
├── index.html       # HTML base
├── renderer.jsx     # Renderizador React com Three.js
└── package.json     # Configuração do projeto
```

## Notas

- O programa é projetado para rodar em segundo plano como wallpaper
- Para fechar, use o Gerenciador de Tarefas (Ctrl+Shift+Esc)
- Consome poucos recursos graças à otimização dos shaders

## Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

### Sobre a Licença MIT

A MIT License é uma licença de software livre permissiva que permite:

✅ **Usar** - Você pode usar este software para qualquer propósito  
✅ **Modificar** - Você pode modificar o código fonte  
✅ **Distribuir** - Você pode distribuir cópias do software  
✅ **Vender** - Você pode vender cópias deste software  
✅ **Sub-licenciar** - Você pode incluir este software em outros projetos  

A única exigência é que a nota de copyright original e a permissão sejam incluídas em todas as cópias ou partes substanciais do software.

O software é fornecido "como está", sem garantias de qualquer tipo, expressas ou implícitas.

---

## Créditos e Referência

Este projeto foi desenvolvido como uma adaptação para live wallpaper no Windows, baseado na implementação original de **Atmospheric Scattering** criada por **Maxime Heckel**.

🔗 **Referência Original**: https://r3f.maximeheckel.com/atmospheric-scattering-3

### O que foi adaptado:

- Remoção do elemento central (esfera) para focar apenas no céu atmosférico
- Implementação de ciclo diário automático que ajusta a iluminação conforme a hora do sistema
- Adaptação para rodar como wallpaper fullscreen no Windows usando Electron
- Manutenção dos shaders GLSL originais de atmospheric scattering e nuvens procedurais

Agradecimentos a Maxime Heckel pela implementação original incrível que serviu de base para este projeto. 🙏
