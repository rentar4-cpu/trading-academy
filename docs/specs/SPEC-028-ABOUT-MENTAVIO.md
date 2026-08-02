# SPEC-028 — About Mentavio

**Status:** Planned  
**Created:** 2026-08-02  
**Product area:** Product identity, onboarding, public presentation

## Goal

Create a permanent **About Mentavio** section that explains the product clearly to a person who has never seen the project before.

The user must be able to understand within a few seconds:

- what Mentavio is;
- who it is for;
- what the user can do inside the platform;
- why the platform exists;
- that it is an educational simulation and not a broker or real-money trading service.

This requirement is separate from tester instructions, APK installation guidance, temporary links, backend details, and development notes.

## Approved product description

> **Mentavio is an educational market simulation platform designed to help beginners understand how financial markets work through practical experience.**
>
> Users explore a fictional market, manage a simulated portfolio, respond to market events, and observe how their decisions affect risk and performance — without using real money.
>
> The platform combines interactive simulation, concise educational content, and an AI mentor that explains financial concepts and helps users understand the consequences of their choices.
>
> Mentavio is not a broker, an investment service, or a real-money trading platform. Its purpose is to make financial education clearer, safer, and more practical for people with little or no previous investing experience.

The wording may later be refined through an approved brand review, but its meaning must not be weakened or changed without an explicit product decision.

## Required placement

The About section must be accessible from:

- the main landing-page navigation;
- the landing-page footer;
- the browser application;
- the Android application and Android WebView.

A dedicated route such as `/about` may be used.

## Requirements

- Keep the copy concise and easy to understand.
- Match the existing Mentavio visual style.
- Make the page responsive on desktop and mobile.
- Ensure all navigation links work in the browser version and Android WebView.
- Allow the page to load without a user account.
- Include a clear educational-simulation disclaimer.
- Do not imply guaranteed profit, brokerage activity, real-market execution, or professional financial advice.
- Do not include tester instructions, temporary URLs, backend details, or debug information.
- Do not change unrelated working simulator functionality.

## Suggested structure

1. What Mentavio is
2. How the experience works
3. Who it is for
4. The role of Sophia, the AI mentor
5. What Mentavio is not
6. Educational-simulation disclaimer
7. Call to action: start the simulation or return to the platform

## Acceptance criteria

The requirement is complete when:

- a new user can reach the About section from the public landing page;
- the same content is reachable in the browser application;
- it renders correctly in the Android application;
- all navigation links work;
- the page is usable on a narrow phone screen;
- the approved product description is present;
- no tester-only or development-only information appears;
- no existing working feature is broken.

## Required testing

Verify:

- desktop browser rendering;
- mobile browser rendering;
- Android WebView rendering;
- header and footer navigation;
- direct loading of the About route;
- browser refresh behavior;
- absence of broken links and obsolete branding.

## Implementation constraint

Do not rebuild the product from scratch. Inspect the existing landing page, routing, localization, browser application, and Android integration before making changes. Preserve working functionality and implement the About section as a focused product-information feature.
