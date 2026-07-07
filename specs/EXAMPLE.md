# Spec: Percentage discount coupon at checkout

<!-- ILLUSTRATIVE EXAMPLE of the filled template. Not a real spec of this repository. -->

Status: Implemented
Owner: agent
Date: 2026-07-07

## Original request

"I want to apply a percentage discount coupon at checkout. The user types the code and the total is recalculated."

## Context read

- `src/checkout/total.ts` (current total calculation)
- `src/checkout/total.test.ts` (existing unit test pattern)
- `specs/` (no previous checkout spec)

## Scope contract

### Explicit requirements

| ID | Requirement | Source |
| --- | --- | --- |
| R-001 | Apply percentage coupon to the checkout total | request |
| R-002 | Recalculate total when the code is entered | request |

### Necessary implications

| ID | Implication | Why it is necessary |
| --- | --- | --- |
| I-001 | Reject nonexistent or expired codes with a specific error | otherwise an invalid coupon discounts or breaks the total |

### Pending assumptions

| ID | Assumption | Decision needed |
| --- | --- | --- |
| S-001 | Limit to 1 coupon per purchase | Allow stacking coupons? |
| S-002 | Does the coupon apply to shipping? | Discount on items only or on total including shipping? |

### Out of scope

| ID | Item | Reason |
| --- | --- | --- |
| O-001 | Coupon admin screen | not requested |
| O-002 | Fixed-amount coupon | request mentions percentage only |

## Acceptance criteria

| ID | Covers | Verifiable criterion |
| --- | --- | --- |
| AC-001 | R-001, R-002 | Given a $100 cart and a valid 10% coupon, when the user applies the code, then the displayed and persisted total is $90. |
| AC-002 | I-001 | Given a nonexistent or expired code, when the user applies it, then the total does not change and the response carries the error `INVALID_COUPON`. |

## Test matrix

| ID | Covers | Type | File/target | Expected strong assertion | Status |
| --- | --- | --- | --- | --- | --- |
| T-001 | AC-001 | unit | `src/checkout/total.test.ts` | returned total = 90.00 and order persisted with `discount: 10.00` | Done |
| T-002 | AC-002 | integration | `src/checkout/apply-coupon.test.ts` | 422 response with `code: "INVALID_COUPON"` and persisted total unchanged | Done |

## Implementation plan

1. Add `applyCoupon(total, coupon)` in `src/checkout/total.ts`.
2. Validate the coupon (existence, expiry) in the `apply-coupon` handler.
3. Write T-001 and T-002 following the existing test patterns.

## Proof matrix

| AC | Test/proof | Command | Result | Evidence |
| --- | --- | --- | --- | --- |
| AC-001 | T-001 | `npm test -- total.test.ts` | Pass | `✓ applies 10% coupon: total 90.00, discount persisted (12 ms)` |
| AC-002 | T-002 | `npm test -- apply-coupon.test.ts` | Pass | `✓ rejects expired coupon with 422 INVALID_COUPON, total unchanged (31 ms)` |

## Risks and limits

- S-001 and S-002 remain pending; minimal behavior implemented (1 coupon, discount on items only) after user confirmation.
