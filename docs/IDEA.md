# The Founding Idea

> Translated from the original Portuguese notes that started Trato. The benchmark video they analyze is linked in the [README](../README.md); the full report is in [BENCHMARK_REPORT.md](BENCHMARK_REPORT.md).

The study in the video brings valuable insights for building our own spec-driven framework, especially because it reveals how current tools fail to balance planning (requirement extraction) and testability.

The evaluation was based on delivering a PRD (Product Requirements Document) focused on business rules for a Stripe integration, and used the *LLM-as-a-judge* concept to score the results. The final grade was composed of 60% for correct construction (scope adherence) and 40% for test quality and proof of functionality.

Here is the summary of strengths and weaknesses of each tested approach, which serve as the foundation for the framework:

## Analysis of the tested frameworks

**1. TLC Spec Driven (overall winner, but weak at planning)**

- **Testing (strength):** The framework that best tested the application (both unit and end-to-end) and delivered the highest final quality. It forces implementation by mapping every acceptance criterion of the specification directly to a test case. It also analyzes the codebase and existing patterns to propose the right tests.
- **Planning (weakness):** Had the worst score in requirement extraction. The problem is that it leaves too many decisions open to the AI agent's interpretation. For example, depending on the size or type of the project (such as a simple API), the framework lets the AI "skip" the technical design phase or ignore exceptions and edge cases, which hurts requirement extraction.

**2. Superpowers (excellent at planning, terrible at testing)**

- **Planning (strength):** The best at extracting requirements, including implicit ones. The secret is that it **does not allow** the AI to skip design steps and forces the elicitation of items that are not clear in the PRD, such as errors, edge cases, and constraints.
- **Testing (weakness):** Failed badly at turning those requirements into tests. Most of the time it ignored unit tests and created end-to-end tests with very weak assertions. It also lacks a mechanism to validate whether the planned test was actually implemented in the code.

**3. OpenSpec (faithful to scope, inconsistent at testing)**

- **Planning (strength):** Excellent at extracting requirements and the best at respecting scope (it does not invent features that were not requested).
- **Testing (weakness):** Highly unstable. Its test quality varies a lot because it has no strong harness (guidelines and validations) of its own, depending entirely on the AI model and the repository's basic instructions. At times it can even get in the way of a good AI model when testing.

**4. GitHub SpecKit (the most detailed and expensive)**

- **Characteristics:** The framework with the largest structural harness. It separates APIs, webhooks, and data models into distinct files and applies many defensive tests.
- **Where it fails:** It creates more scope than necessary and loses track of task prioritization. By generating too many files, it increases the chance of probabilistic AI hallucination, resulting in low-value tests and forgetting to test the user's critical paths. It is also the most expensive (around 36 million tokens per execution).

**5. Pure models (the baseline)**

The test revealed something surprising: using only strong models (Claude Opus for planning and Sonnet for implementing), combined with a repository with excellent guidelines (a good `agents.md` file defining testing and architecture rules), produced a score of 0.89 — tying with the best frameworks. Frameworks with weak testing, such as Superpowers and OpenSpec, even worsened the result the pure model would have achieved on its own.

---

## How to structure the framework (insights for excellence)

To build a framework that excels at **both**, we must merge the best practices identified in the video:

**For planning (inspired by Superpowers):**

- **Force boundary extraction:** No loose ends. Require the AI to actively document error cases, constraints, and edge scenarios that were not in the original PRD.
- **Avoid excessive autonomy:** Do not let the AI decide to skip steps based on "project size" (TLC's mistake). The design pipeline must be mandatory.
- **Define clear stopping limits:** Instruct the AI in quantifiable terms (e.g. "stop after detailing X", "restrict yourself to Y") to prevent it from inventing extra scope (SpecKit's mistake).

**For testing (inspired by TLC):**

- **1-to-1 mapping:** Every acceptance criterion in the PRD and the specification must, mandatorily, be converted into a clear test case. The test cannot be postponed; it is the final proof that the requirement was met.
- **Context analysis:** The framework must instruct the agent to analyze the current codebase to understand the project's testing patterns (where unit, domain, or E2E tests fit) and apply them accordingly.
- **Proof-based evaluation:** Create a validation step where the AI agent is required to fill in a checklist proving where each test was implemented and whether the assertion is strong enough.

In summary, the ideal framework must have the requirement-extraction rigor and inflexibility of Superpowers, coupled with TLC's strict specification-to-test binding engineering, all while keeping a lean prompt/harness so it does not burn excessive tokens like SpecKit.
