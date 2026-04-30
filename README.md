# NetEscol — Site Institucional

Site institucional do NetEscol, sistema SaaS de gestão escolar municipal voltado para prefeituras. Hospedado em [https://www.netescol.com.br](https://www.netescol.com.br).

> Este repositório é **apenas o site institucional** (landing page + páginas legais). O sistema NetEscol em si (app de gestão) vive em outro repositório e roda em [https://app.netescol.com.br](https://app.netescol.com.br).

---

## Stack

| Camada | Tecnologia |
|---|---|
| Marcação | HTML5 semântico |
| Estilo | CSS3 puro (Inter via Google Fonts) |
| Comportamento | JavaScript ES6+ vanilla (sem frameworks) |
| Hospedagem | GitHub Pages (branch `master`) |
| Domínio | `netescol.com.br` (via arquivo `CNAME`) |
| Analytics | Google Analytics 4 + GoatCounter (sem cookies, LGPD-friendly) |
| Formulário | POST para `https://app.netescol.com.br/api/contact` (backend do sistema) |

Sem build step, sem bundler, sem dependências NPM. Edita o arquivo, dá push, vai para produção.

---

## Estrutura de pastas

```
.
├── CNAME                    # domínio do GitHub Pages (não mover)
├── robots.txt               # diretivas para crawlers
├── sitemap.xml              # mapa do site
├── README.md                # este arquivo
│
├── index.html               # landing page principal
├── termos.html              # termos de uso
├── privacidade.html         # política de privacidade
├── lgpd.html                # conformidade LGPD
├── status.html              # status em tempo real (API + DB + site)
│
└── assets/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── script.js
    └── images/
        ├── favicon.png
        ├── logo-sistema.png         # PNG da logo (favicon, og-image fallback)
        ├── og-image.png             # imagem 1200x630 para compartilhamento social
        ├── app-screenshot.png       # mockup do portal do responsável
        ├── logo-netescol.svg        # logo vetorial (referência da marca)
        └── logo-netescol-dark.svg   # variante para fundo claro
```

---

## Como rodar localmente

Qualquer servidor estático serve. Exemplos:

```bash
# Python (já instalado em quase todo lugar)
python -m http.server 8000

# Node
npx serve .

# PHP
php -S localhost:8000
```

Abra `http://localhost:8000`. O formulário de contato faz POST para a API real em produção — para testar sem enviar lead de verdade, comente o submit em `assets/js/script.js`.

---

## Deploy

Push direto na branch `master` aciona o build do GitHub Pages.

```bash
git add <arquivos>
git commit -m "tipo(escopo): descrição em pt-BR"
git push origin master
```

O build leva ~40 segundos. Verifique o status com:

```bash
gh api repos/alianzcontabilidade-cyber/netescol-site/pages/builds/latest --jq '{status,commit,duration}'
```

Se der `404 — There isn't a GitHub Pages site here`, o GH Pages foi desligado no repositório. Reativar:

```bash
gh api -X POST repos/alianzcontabilidade-cyber/netescol-site/pages \
  -f 'source[branch]=master' -f 'source[path]=/'
```

---

## Identidade visual

### Cores

| Token | Hex | Uso |
|---|---|---|
| `--primary` | `#1e3a5f` | Texto principal, navbar |
| `--primary-light` | `#2a5a8c` | Hover, gradientes |
| `--primary-dark` | `#0f172a` | Footer, fundo escuro |
| `--accent` | `#22c55e` | CTAs, sucesso, verde da marca |
| `--accent-light` | `#4ade80` | Variante clara do verde |
| `--accent-dark` | `#16a34a` | Variante escura do verde |
| `--bg` | `#F8FAFC` | Fundo neutro |
| `--bg-alt` | `#EBF4FF` | Fundo alternado de seções |
| `--text` | `#1E293B` | Corpo de texto |
| `--text-light` | `#64748B` | Texto secundário |

Definidas em `:root` no topo de `assets/css/style.css`.

### Fonte

- **Família:** [Inter](https://fonts.google.com/specimen/Inter), com fallback `-apple-system, BlinkMacSystemFont, sans-serif`.
- **Pesos carregados:** 300, 400, 600, 700, 800.

### Logo

A logo do navbar e do footer é um **composto HTML+CSS+SVG inline** (não é uma imagem):

```html
<div class="netescol-logo netescol-logo-sm">
  <span>Net</span><span>Esc</span><svg>...bars...</svg><span>l</span>
</div>
```

**Não substituir por `<img src="logo-netescol.svg">`.** O arquivo SVG existe em `assets/images/`, mas usa `<text font-family="Inter">` — quando carregado via `<img>`, o SVG fica isolado e não acessa a fonte Inter do documento, caindo para Arial e desalinhando os textos. O composto herda a fonte do documento e renderiza correto. Se um dia precisar trocar para SVG puro, primeiro converter os `<text>` em `<path>`.

Tamanhos disponíveis via classe modificadora:
- `.netescol-logo-sm` — navbar (texto 28px / svg 34px)
- `.netescol-logo-md` — footer (texto 32px / svg 38px)
- `.netescol-logo-lg` — hero (texto 64px / svg 72px)

### Favicon e og-image

- Favicon: `assets/images/logo-sistema.png` (16KB, fundo navy arredondado).
- Open Graph / Twitter Card: `assets/images/og-image.png` (1200×630).

---

## Integrações externas

| Recurso | Endpoint |
|---|---|
| API de contato | `https://app.netescol.com.br/api/contact` |
| API de health (status) | `https://app.netescol.com.br/api/health` |
| Google Analytics 4 | ID `G-X86882PN4S` |
| GoatCounter | `netescol.goatcounter.com` |
| Google Fonts | `fonts.googleapis.com` (preconnect já configurado) |

Status atual da API e DB pode ser visto em [/status.html](https://www.netescol.com.br/status.html).

---

## Convenções de commit

Formato `tipo(escopo): descrição em pt-BR com acento`. Tipos usados:

- `feat` — nova funcionalidade visível ao usuário
- `fix` — correção de bug ou regressão
- `refactor` — reorganização sem mudança de comportamento
- `chore` — manutenção (limpeza, dependências, configuração)
- `docs` — apenas documentação
- `perf` — melhoria de performance
- `style` — formatação (sem mudança de lógica)

---

## Licença

Conteúdo proprietário do NetEscol. Todos os direitos reservados.
