# language: en
# Author: Natalia Pandolfi

@profile @smoke
Feature: Meet Natalia Pandolfi
  As a recruiter, product team or curious developer
  I want to know who the QA behind these scenarios is
  So that I can see how she could contribute to my team

  Background:
    Given the visitor opened this file

  Scenario: Introduction
    Given my name is "Natalia Pandolfi"
    And I am a "QA Engineer"
    When someone asks what a QA does around here
    Then the short answer is "helping the team find the bug before the user does"
    And the long answer is in the other files in this folder

  Scenario: Quality from discovery onwards
    Given a new idea is still on paper
    When the team starts discovery
    Then QA is already part of the conversation with the Product Owner
    And requirements, acceptance criteria and test scenarios are written together
    But testing doesn't wait for the code to be ready

  Scenario: What working together looks like
    Given quality is the whole team's responsibility
    Then technical risks are explained to non-technical people
    And the uncomfortable question comes up during refinement, before it becomes a production incident
    And knowledge is shared, because QA is neither a bottleneck nor the deploy's bouncer

  Scenario: This site is tested too
    Given a résumé will accept anything you write on it
    When you open the "e2e/" folder right here
    Then you find this site's tests in "Playwright" and "TypeScript", written in BDD
    And they check accessibility with "axe", both languages and performance
    And they run on GitHub Actions on every push, with the result in the "Output" window
