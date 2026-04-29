# Sun Wallpaper

Live wallpaper para Windows com efeito de atmospheric scattering que muda automaticamente baseado na hora do dia.

## 🚀 Instalação

Para usar este live wallpaper, você precisa ter o **Node.js** instalado no seu computador:

1. Baixe e instale o Node.js em: https://nodejs.org/
2. Clone ou baixe este repositório
3. Abra o terminal na pasta do projeto
4. Instale as dependências:
```bash
npm install
```
5. Execute o wallpaper:
```bash
npm start
```

O wallpaper será exibido em tela cheia. 

### 🎮 Controles

- Mova o mouse para o **canto superior direito** da tela para revelar os controles
- ⚙️ **Configurações**: Ative/desative a inicialização automática com o Windows
- ✕ **Fechar**: Encerre o aplicativo

---

## Características

- 🌅 **Iluminação dinâmica**: A cor do céu e intensidade do sol mudam automaticamente conforme a hora do dia
- ☁️ **Nuvens procedurais**: Efeito de nuvens geradas via shader
- 🎨 **Visual idêntico ao original**: Mantém o mesmo nível visual e efeitos da referência
- 💻 **Otimizado para desktop**: Roda como wallpaper em segundo plano
- ⚙️ **Inicialização automática**: Opção para iniciar com o Windows (configurável)
- 🎮 **Controles intuitivos**: Interface que aparece apenas quando necessário

---

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
sun-wallpaper/
├── main.js          # Processo principal do Electron com IPC handlers
├── preload.js       # Ponte segura entre processos (contextBridge)
├── index.html       # HTML base com UI dos controles e modal de configurações
├── renderer.jsx     # Renderizador React com Three.js e shaders GLSL
└── package.json     # Configuração do projeto
```

---

## Notas

- O programa é projetado para rodar em segundo plano como wallpaper
- Para fechar, mova o mouse para o canto superior direito e clique em "Fechar"
- Consome poucos recursos graças à otimização dos shaders
- A inicialização automática com o Windows pode ser ativada nas configurações

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
