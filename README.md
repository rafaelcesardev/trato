# Trato

**A lean spec-driven pact for coding agents.** No pipeline, no ceremony, no token-hungry harness — just a contract your agent must honor: agreed scope, acceptance criteria, a criterion-to-test matrix, and proof of done.

*Trato* is Portuguese for "deal": the agent implements the deal — nothing less, nothing more.

## Install

```bash
npx trato init
```

That's it. Works with Claude Code, Codex, and any tool that reads `AGENTS.md`/`CLAUDE.md`.

The command is non-destructive and idempotent. In your project it:

- creates `TRATO.md` (the rules) and `specs/` with `TEMPLATE.md` and a filled `EXAMPLE.md`;
- appends a short Trato block to your existing `AGENTS.md` and `CLAUDE.md` (or creates them) — your current instructions are never overwritten;
- can be re-run safely: already-installed files are skipped.

Then just work normally. Your agent now plans with a scope contract, maps every acceptance criterion to a test, and proves the result with real command output. Ready-to-use prompts below.

## How it works

The complete rules live in [TRATO.md](TRATO.md) — a single short file, the only thing your agent needs to read. The flow:

1. **Discovery** — read the request, existing specs, code, and test patterns first.
2. **Scope contract** — classify everything as explicit, necessary implication, assumption, or out of scope. Assumptions are never implemented without confirmation.
3. **Acceptance criteria** — every requirement gets a verifiable `AC-###` (Given/When/Then). Edge cases, errors, and constraints are actively elicited — never silently skipped, never silently added.
4. **Test matrix** — every `AC-###` maps to a `T-###` with a strong assertion before any code is written.
5. **Approval gate** — specs are implemented only after approval (`Draft` → `Approved`).
6. **Proof** — the agent fills a proof matrix pasting real command output, then re-reads each test to confirm the assertion checks the business result.

See [specs/EXAMPLE.md](specs/EXAMPLE.md) for what a finished spec looks like.

## Why Trato exists

Trato was born from the benchmark video below (in Portuguese), which stress-tested the main spec-driven frameworks on the same task: a Stripe billing module for a streaming service, specified as a business-rules PRD with no code. Each framework ran 3 times (12 runs total), planned by Claude Opus 4.8 and implemented by Sonnet 4.6, scored by an LLM-as-judge forced to prove its evaluation against a checklist — 60% implementation correctness, 40% testing quality.

[![Spec-driven frameworks benchmark (video, in Portuguese)](https://img.youtube.com/vi/gK1atE0ssfg/maxresdefault.jpg)](https://youtu.be/gK1atE0ssfg)

The result: **no framework was good at both planning and testing.**

| Framework | Score | Great at | Fails at | Tokens |
| --- | --- | --- | --- | --- |
| TLC Spec Driven | 0.92 | Test rigor: every criterion maps to a test, matched to codebase patterns | Requirement extraction — lets the agent skip design when the project "looks simple" | 31M |
| SpecKit | 0.90 | Exhaustive detail and research | Scope creep, lost priorities, low-value tests, highest cost | 36M |
| OpenSpec | 0.89 | Scope fidelity — builds exactly what the PRD says, 100% of the time | Unstable testing; no harness of its own, fully model-dependent | 24M |
| Superpowers | 0.85 | Requirement and edge-case extraction; design phase is non-skippable | Weak assertions, skipped unit tests, no check that planned tests were implemented | 31M |
| **Pure Opus + good AGENTS.md** | **0.89** | Baseline: no framework at all | — | **18M** |

Two findings shaped Trato's design:

1. **A strong model with nothing but clear repo guidelines matched the best frameworks** — at roughly half the token cost. Heavy harnesses added little; weak ones (the study showed) can actively *hinder* a good model.
2. **Each framework's strength is a written rule, not machinery.** Superpowers wins planning because design is non-skippable. OpenSpec wins scope because nothing unrequested gets built. TLC wins testing because every criterion must map to a test.

So Trato is the merge of those rules — and only the rules — in one short file:

- **From Superpowers:** design can't be skipped, and edge cases/errors/constraints must be actively elicited. Trato closes the loophole TLC fell into: "trivial" is defined by observable behavior, not by how simple the task looks.
- **From OpenSpec:** the four-way scope contract. Elicited edge cases become questions or assumptions, never silent scope.
- **From TLC:** the mandatory criterion→test matrix with strong assertions. Trato adds what Superpowers lacked: proof requires pasting real command output, and the agent must re-read each test to confirm the assertion checks the business result.
- **From the pure-model baseline:** stay small. Trato is markdown your agent reads once — no CLI in the loop, no generated file tree, no 36M-token runs.

Want the full story? The complete benchmark report is in [docs/BENCHMARK_REPORT.md](docs/BENCHMARK_REPORT.md), and the founding notes that turned it into Trato are in [docs/IDEA.md](docs/IDEA.md).

## Prompts

Plan (no code yet):

```text
Read TRATO.md and plan <task> as specs/<slug>.md. Do not implement yet. Separate explicit requirements, necessary implications, pending assumptions, and out-of-scope items. Walk through errors, edge cases, and constraints and classify each one. Propose at least one verifiable test or proof per acceptance criterion. Leave the spec as Draft and wait for approval.
```

Implement (after approval):

```text
Implement specs/<slug>.md following TRATO.md. Only start if the status is Approved. Do not add new scope. If you discover an uncovered decision, update the spec and stop for confirmation when the decision changes behavior. When done, run the relevant checks and fill the proof matrix with real command output.
```

## Files

- `TRATO.md` — the rules agents follow. Single source of truth.
- `specs/TEMPLATE.md` — spec template: scope, criteria, tests, proof.
- `specs/EXAMPLE.md` — filled example.
- `bin/trato.js` — the installer (`trato init`).
- `docs/BENCHMARK_REPORT.md` — full report of the benchmark that motivated Trato.
- `docs/IDEA.md` — the founding notes derived from it.

## Contributing

Trato is a community project and intentionally tiny — the whole framework is a few markdown files. Found a loophole an agent slips through? A rule that burns tokens without adding rigor? Open an issue or PR.

## License

MIT
