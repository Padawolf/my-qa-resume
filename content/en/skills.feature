# language: en

@skills
Feature: Toolbox

  Scenario Outline: Automate <layer> tests
    Given a system with a "<layer>" layer
    When I need automated tests
    Then I use "<tools>"

    Examples:
      | layer       | tools                              |
      | Web         | Selenium, Cypress, Robot Framework |
      | Mobile      | Appium                             |
      | API         | RestAssured                        |
      | Performance | k6                                 |

  Scenario: Everyday languages and tools
    Given I am writing test code
    Then I use "Java" and "JavaScript"
    And I describe behaviour in "Gherkin" with "Cucumber"
    And I organise the work with "Jira" and "Git"

  Scenario: Testing types
    Given a delivery to validate
    Then I choose between manual, exploratory, regression, API, web, mobile, performance and load testing

  Scenario: Practices
    Given an agile team working with "Scrum" or "Kanban"
    Then I apply BDD, Shift Left and acceptance criteria definition
    And I keep the tests running in CI/CD pipelines
