# Analysis of Spec-Driven Development Frameworks for 2026

> AI-generated report of the benchmark video that motivated Trato (linked in the [README](../README.md)). See also [IDEA.md](IDEA.md) for the founding notes derived from it.

## Executive summary

This briefing document provides a technical evaluation of prominent spec-driven development frameworks, including SpecKit, Superpowers, TLC Spec Driven, and OpenSpec. The analysis is based on a series of controlled tests designed to measure each framework's efficacy in requirement extraction, implementation accuracy, and testing quality.

The evaluation concludes that while Superpowers leads in requirement extraction and OpenSpec excels in scope adherence, the TLC Spec Driven framework provides the highest overall quality due to its superior testing harness. Notably, the study reveals that high-performing models (such as Claude Opus) can achieve results comparable to specialized frameworks if the underlying repository possesses a strong internal "harness" (defined conventions and guidelines). However, frameworks remain essential for legacy systems and complex business logic where manual review and spec-correction are required.

## Methodology and evaluation framework

The benchmark involved 12 total executions — three runs per framework — to establish a statistical average. The technical environment and criteria were structured as follows:

- **Models used:** Claude Opus 4.8 was utilized for the planning phase, while Claude Sonnet 4.6 was used for implementation.
- **Source input:** A Product Requirements Document (PRD) focused on a streaming service's billing module integrated with Stripe. The PRD contained business rules and user stories (e.g., starting free trials with or without cards) but no code.
- **Scoring weight:**
  - Implementation (60%): ability to build the correct features based on the PRD.
  - Testing (40%): ability to prove functionality through unit and end-to-end (E2E) tests.
- **Evaluation method:** "LLM as a judge." A specialized skill called Spec Driven Evil was used to force the AI to prove its evaluations against a checklist, minimizing probabilistic variance to within 2–3%.

## Framework performance analysis

### 1. TLC Spec Driven

Despite scoring lower in initial requirement extraction, this framework achieved the highest overall score due to its consistency and testing rigor.

- **Strengths:** Best-in-class unit and E2E testing; high consistency in quality; analyzes the existing codebase to match patterns.
- **Weaknesses:** Worst at requirement extraction; tends to skip design phases if the agent perceives the project as "simple," leading to minor omissions in business logic.

### 2. GitHub SpecKit

SpecKit is characterized by its exhaustive detailing and complex harness.

- **Strengths:** Highest level of detail; generates separate files for APIs, webhooks, data models, and research phases.
- **Weaknesses:** High "scope creep" (builds more than requested); highest token consumption; occasionally misses tests for core features while testing secondary components.

### 3. Superpowers

Superpowers is widely used but showed a significant disparity between planning and verification.

- **Strengths:** Best at extracting requirements and identifying edge cases/restrictions; forces a non-skippable design phase.
- **Weaknesses:** Poor at transforming requirements into test cases; weak assertions; often fails to implement unit tests.

### 4. OpenSpec

OpenSpec aims to be the standard for spec-driven development, focusing on strict adherence to provided instructions.

- **Strengths:** Excellent at following the specific scope provided without adding unnecessary features; high requirement extraction capability.
- **Weaknesses:** Highly unstable testing performance; the testing harness is heavily dependent on the model rather than the framework's internal logic.

## Comparative metrics

| Framework | Implementation & testing score | Primary strength | Token cost (millions) |
| --- | --- | --- | --- |
| TLC Spec Driven | 0.92 (rank 1) | Testing consistency | 31M |
| SpecKit | 0.90 (rank 2) | Exhaustive detail | 36M |
| OpenSpec | 0.89 (rank 3) | Scope adherence | 24M |
| Superpowers | 0.85 (rank 4) | Requirement extraction | 31M |
| Pure Opus (baseline) | 0.89 | N/A | 18M |

### Secondary metrics

- **Implicit requirement discovery:** Superpowers ranked first, followed by SpecKit and TLC. OpenSpec ranked last, as it rarely looks beyond the explicit text.
- **Scope adherence:** OpenSpec was the most disciplined, following the PRD 100% of the time. SpecKit frequently lost track of priorities or failed to create files it had planned.
- **Robustness (defensive testing):** SpecKit produced the most tests, though many were of low value. TLC and OpenSpec provided more focused robustness.

## Critical findings on model vs. framework

A significant takeaway from the research is the performance of "pure models" (using a model without a spec framework).

- **The baseline:** Claude Opus 4.8, when given only the PRD and a repository with a strong internal harness (clear conventions in `agents.md`), achieved a score of 0.89. This matched or outperformed several frameworks.
- **Model sensitivity:** Models like GPT 5.5 (score: 0.75) and Gemini/Composer (score: 0.63) performed poorly in these tests due to an inability to follow complex rules or provide consistent reasoning.
- **Framework interference:** In some instances, the harnesses of OpenSpec and Superpowers actually hindered the performance of high-quality models. If the framework's testing logic is weak, it can confuse a model that might otherwise have written better code and tests independently.

## Final conclusions and recommendations

The choice of framework should be dictated by the specific needs of the development team:

1. **For maximum reliability:** TLC Spec Driven is recommended for its balance of implementation and rigorous testing, provided the user manually verifies that no minor business requirements were skipped during extraction.
2. **For new complex architectures:** SpecKit is ideal for projects requiring deep research and detailed documentation (APIs, data models), provided the user is prepared for higher token costs and potential scope creep.
3. **For strict requirement following:** OpenSpec is the best choice for users who want exactly what is in the PRD and nothing more, though it requires supplementary manual testing.
4. **For discovery and edge cases:** Superpowers is the superior tool for identifying "hidden" requirements and edge cases, but users must implement their own harness to ensure those requirements are actually tested.

Ultimately, the effectiveness of any spec-driven approach is heavily reliant on the repository harness. Maintaining an `agents.md` file with clear instructions on testing standards and code quality is essential to prevent frameworks from "trapping" models in suboptimal outputs.
