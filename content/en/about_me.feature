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
    When someone asks what I do
    Then I tell them I work on web, mobile and API test automation and on performance testing
    And that I like to join a project early, while it's still in discovery

  Scenario: How I like to work
    Given a team starting on a new feature
    Then I talk to the Product Owner before any code exists
    And I help write the requirements, the acceptance criteria and the test scenarios
    And I explain risks in a way that non-technical people can follow too

  Scenario: About this site
    Given I built this site as an old-school IDE, with the introduction in Gherkin
    Then its code and tests are on GitHub, linked in the project window
    And my PDF résumé is there too, ready to download
