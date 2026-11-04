# language: en

@experience
Feature: Work experience
  Less about where, more about what was done,
  always with the same mission: fewer bugs reaching users

  Scenario: Web, mobile and API test automation
    Given large-scale, high-traffic systems
    When a new feature starts being developed
    Then web, mobile and API test automation starts along with it
    And the automated suites run in CI/CD as a quality gate for every delivery

  Scenario: Performance and load testing
    Given a system that has to handle real traffic
    When it's time to find out how far it can go
    Then performance and load tests show the limit before users do

  Scenario: Test strategy
    Given web, mobile and API-driven applications
    When the team has to decide what to test, how, and how far
    Then the test strategy is defined and executed from the start

  @ai
  Scenario: AI applied to infrastructure testing
    Given a knowledge base built to read infrastructure-as-code (IaC) projects
    When a project declares resources such as S3 buckets, access policies and authorization rules
    Then automated tests are generated from that reading
    And they validate that each resource was created and behaves as the project describes

  @ai
  Scenario: AI applied to kicking off projects
    Given a knowledge base built to read APIs
    When a new project has to start from scratch
    Then it helps build the skeleton of the test automation repository
    And the team starts from a ready structure instead of an empty folder

  Scenario: Quality culture
    Given teams with different levels of testing maturity
    Then BDD and QA best practices spread across teams, one scenario at a time
    And the work with developers is side by side, from "found a bug" to "fixed and tested"
