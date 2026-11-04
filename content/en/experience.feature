# language: en

@experience
Feature: Work experience

  Scenario: Web, mobile and API test automation
    Given large systems with a lot of traffic
    When a new feature starts being developed
    Then I write the web, mobile and API automated tests alongside it
    And I get those suites running in the CI/CD pipeline

  Scenario: Performance and load testing
    Given a system that is about to get a lot of traffic
    Then I plan and run performance and load tests to find out how much it can take

  Scenario: Test strategy
    Given web, mobile and API applications
    When the team needs to decide what to test and how
    Then I define the test strategy and follow the execution with the team

  @ai
  Scenario: AI-generated infrastructure tests
    Given I built a knowledge base that reads infrastructure-as-code projects
    When a project declares resources such as S3 buckets, access policies and authorization rules
    Then it generates automated tests that check each resource was created and works as the project describes

  @ai
  Scenario: Test automation repositories from APIs
    Given I built another knowledge base, one that reads APIs
    When test automation has to start from scratch
    Then it helps build the skeleton of the test repository

  Scenario: BDD and good practices
    Given teams with different ways of testing
    Then I helped them adopt BDD and QA best practices
    And I worked closely with developers, from the bug found to the tested fix
