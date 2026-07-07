# Spec: Rename to Trato + npx installer + English docs

Status: Implemented
Owner: Claude (decisões confirmadas pelo usuário via perguntas)
Data: 2026-07-07

## Pedido original

"Precisamos dar um bom nome pq my-spec-driven foi temporário. Tbm precisamos nos preocupar como os usuários vão instalar isso em seus projetos. Tem que ser algo plug and play."
Respostas do usuário: nome **Trato**, instalação **npx init**, docs **só inglês**.

## Contexto lido

- AGENTS.md, README.md, CLAUDE.md, templates/spec.md, templates/exemplo-spec.md (estado atual, PT).
- npm: `trato` livre (404 no registry).
- Categoria: OpenSpec/spec-kit usam CLI init que copia arquivos.

## Contrato de escopo

### Requisitos explicitos

| ID | Requisito | Fonte |
| --- | --- | --- |
| R-001 | Renomear framework para Trato | resposta usuário |
| R-002 | Instalação plug and play via `npx trato init` | pedido + resposta |
| R-003 | Documentação distribuída só em inglês | resposta usuário |

### Implicacoes necessarias

| ID | Implicacao | Por que e necessaria |
| --- | --- | --- |
| I-001 | Reestruturar repo como pacote npm (package.json, bin/trato.js) | sem isso npx não funciona |
| I-002 | Layout alvo: TRATO.md (regras) + specs/TEMPLATE.md + specs/EXAMPLE.md | installer precisa de arquivos canônicos para copiar |
| I-003 | Installer faz append (não overwrite) em AGENTS.md/CLAUDE.md existentes | projetos alvo já têm esses arquivos; sobrescrever destruiria instruções do usuário |
| I-004 | Installer idempotente (rodar 2x não duplica) | plug and play implica re-execução segura |
| I-005 | Traduzir regras/template/exemplo/README para inglês | R-003 |

### Suposicoes pendentes

| ID | Suposicao | Decisao necessaria |
| --- | --- | --- |
| S-001 | Publicar no npm agora | usuário decide quando publicar |

### Fora de escopo

| ID | Item | Motivo |
| --- | --- | --- |
| O-001 | curl installer | usuário escolheu só npx |
| O-002 | Renomear diretório local my-spec-driven | ação do usuário fora da sessão (CWD ativo) |
| O-003 | Mover IDEIA.md/RELATORIO_VIDEO.md | não pedido |

## Criterios de aceite

| ID | Cobre | Criterio verificavel |
| --- | --- | --- |
| AC-001 | R-002, I-002 | Dado projeto vazio, quando roda `trato init`, então existem TRATO.md, specs/TEMPLATE.md, specs/EXAMPLE.md, AGENTS.md e CLAUDE.md com referência a TRATO.md. |
| AC-002 | I-003 | Dado projeto com AGENTS.md e CLAUDE.md preexistentes com conteúdo, quando roda `trato init`, então conteúdo original preservado e bloco Trato adicionado ao final. |
| AC-003 | I-004 | Dado projeto já inicializado, quando roda `trato init` de novo, então nenhum arquivo duplicado/alterado e saída indica skip. |
| AC-004 | R-001, R-003 | Dado o repo, quando inspecionado, então arquivos distribuídos (TRATO.md, specs/TEMPLATE.md, specs/EXAMPLE.md, README.md) estão em inglês e usam o nome Trato. |

## Matriz de testes

| ID | Cobre | Tipo | Arquivo/alvo | Assercao forte esperada | Status |
| --- | --- | --- | --- | --- | --- |
| T-001 | AC-001 | manual (script) | scratchpad projeto vazio | 5 arquivos criados, AGENTS.md/CLAUDE.md contêm "TRATO.md" | Planned |
| T-002 | AC-002 | manual (script) | scratchpad projeto com arquivos | conteúdo original intacto (diff) + bloco appended | Planned |
| T-003 | AC-003 | manual (script) | rerun no mesmo projeto | checksums inalterados, output "skipped" | Planned |
| T-004 | AC-004 | manual | grep no repo | zero PT nos arquivos distribuídos, nome Trato presente | Planned |

Prova manual: repo é markdown + 1 script Node sem framework de teste; script de verificação no scratchpad é a automação viável.

## Plano de implementacao

1. Criar TRATO.md (regras em EN), specs/TEMPLATE.md, specs/EXAMPLE.md.
2. Criar bin/trato.js (Node puro, zero deps) + package.json.
3. Reescrever README.md em EN; apontar AGENTS.md/CLAUDE.md do repo para TRATO.md; remover templates/.
4. Rodar T-001..T-004 e preencher matriz de prova.

## Matriz de prova

| AC | Teste/prova | Comando | Resultado | Evidencia |
| --- | --- | --- | --- | --- |
| AC-001 | T-001 | `node bin/trato.js init <dir-vazio>` | Pass | `created TRATO.md / created specs/ / created specs/TEMPLATE.md / created specs/EXAMPLE.md / created AGENTS.md / created CLAUDE.md`; grep confirma "TRATO.md" nos dois |
| AC-002 | T-002 | `trato init` em dir com AGENTS.md/CLAUDE.md | Pass | `grep -c "Use tabs" AGENTS.md` = 1, `grep -c "Be terse" CLAUDE.md` = 1, bloco `trato:start` presente |
| AC-003 | T-003 | rerun `trato init` + diff de md5 | Pass | `Files are identical` (checksums AGENTS/CLAUDE/TRATO inalterados) |
| AC-004 | T-004 | grep acentos PT em TRATO.md/TEMPLATE.md/README.md | Pass | `none`; `trato --version` = `0.1.0` |

## Riscos e limites

- S-001: publicação npm pendente de decisão; até lá `npx trato` não resolve (usar `npx github:<user>/trato` ou publicar).
