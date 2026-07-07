# Trato — Spec-Driven Pact

Follow these rules for any product task, feature, bugfix, or refactor with behavioral impact.

## Core rule

Do not implement before a minimal contract exists:

- accepted scope;
- acceptance criteria;
- criterion -> test/proof matrix;
- short implementation plan.

Trivial = zero observable behavior change (typo, comment, internal rename, formatting). Only then may the contract be inline in the response or plan. Any observable behavior change requires creating/updating `specs/<NNNNN>-<slug>.md` from `specs/TEMPLATE.md` (filled example: `specs/EXAMPLE.md`). The number is the highest existing prefix plus one, zero-padded to five digits, starting at `00001`, so specs stay ordered by creation. `TEMPLATE.md` and `EXAMPLE.md` keep their names and are never numbered. Diff size does not define triviality; behavior does. When in doubt, treat as non-trivial.

Approval gate: do not implement a spec with `Status: Draft`. Present the spec, wait for user approval, and change the status to `Approved` before coding. A user request that already explicitly approves the plan counts as approval.

## 1. Discovery

Before planning, read the request, existing specs, related code and tests. Identify the project's real patterns before proposing architecture or tests.

## 2. Scope contract

Classify everything into four groups:

- **Explicit:** directly requested by the user or the spec. May implement.
- **Necessary implication:** indispensable for the explicit scope to work. May implement, but record it.
- **Assumption:** plausible, but not indispensable. Do not implement without confirmation.
- **Out of scope:** record it and do not implement.

Do not create features, screens, configurations, endpoints, automations, or extra cases just because they seem useful.

If a doubt blocks progress, ask up to 3 objective questions. If it does not block, record it as an assumption or out of scope and proceed only with the safe scope.

## 3. Acceptance criteria

Every accepted requirement must have at least one acceptance criterion with an `AC-###` ID.

Prefer a verifiable format:

```text
Given <state>, when <action>, then <observable result>.
```

Mandatory elicitation: before closing the criteria, walk through typical errors, edge cases, and constraints (invalid or empty input, limits, duplication, concurrency, external dependency failure, permissions) and classify each one in the scope contract:

- explicit or necessary implication: becomes an `AC-###`;
- plausible but not indispensable: record as an assumption with an objective question;
- irrelevant: out of scope with a reason.

No discovered edge case may be silently ignored, and none becomes scope without confirmation. Do not turn vague possibilities into scope.

## 4. Test matrix

Before implementing, map every `AC-###` to at least one `T-###`.

Choose the level by behavior:

- unit/domain for pure rules and validations;
- integration for contracts between modules, database, queues, internal APIs, or adapters;
- E2E for critical user flows;
- manual proof only when automation is not viable in the current context.

Strong assertions verify business results, persisted state, expected side effects, specific messages/errors, or relevant external calls. Avoid tests that merely render, return 200, take broad snapshots, or check that something "exists".

No `AC-###` may be left without a test/proof. If it is not testable, explain why and flag it as a risk.

## 5. Implementation

Implement only explicit requirements and necessary implications. If new behavior emerges, stop, update the scope contract, and treat it as an assumption until confirmed.

Follow the project's existing patterns. Do not introduce a new library, framework, structural file, or abstraction without a concrete need for the accepted scope.

## 6. Final proof

Before finishing:

- run the relevant tests, lint, or build;
- fill in the spec's proof matrix when a spec file exists;
- in the evidence column, paste a real excerpt of the command output (test name + pass/fail), never your own description of the result;
- re-read every `T-###` in the test file and confirm the assertion verifies the business result of the corresponding `AC-###`, not just that the code runs without error;
- check that every `AC-###` has evidence;
- report the commands executed and their results.

Do not declare a task done without verification. If you cannot run something, say exactly what was missing and what risk remains.

After the proof, change the spec status to `Implemented`. An implemented spec is a historical record: if behavior changes later, update the existing spec or create a new spec that references it. Do not leave an `Approved` spec orphaned after delivering.

## Definition of done

- No invented scope.
- Accepted requirements traced to acceptance criteria.
- Acceptance criteria traced to tests/proofs.
- Strong assertions for the critical paths.
- Verification executed, or its absence explicitly stated.
