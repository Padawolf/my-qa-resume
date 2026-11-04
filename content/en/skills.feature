# language: en

@skills
Feature: Toolbox
  A good tool is the one that solves the team's problem

  Scenario Outline: Automate <layer> tests
    Given a system with a "<layer>" layer
    When it needs automated tests
    Then the choice is "<tools>"

    Examples:
      | layer         | tools                                          |
      | Web           | Playwright, Selenium, Cypress, Robot Framework |
      | Mobile        | Appium                                         |
      | API           | RestAssured                                    |
      | Performance   | k6                                             |
      | Accessibility | axe-core                                       |

  Scenario: Everyday languages and tools
    Given test code to write
    Then the languages are "Java", "Python", "JavaScript" and "TypeScript"
    And behaviour is described in "Gherkin" with "Cucumber", so product and devs read the same test
    And the work is organised with "Jira" and "Git"

  Scenario: Testing types
    Given a delivery to validate
    When the question is "what could go wrong here?"
    Then the choice ranges across manual, exploratory, regression, API, web, mobile, performance and load testing
    But automation follows the test pyramid and the risk, not the urge to automate everything

  Scenario: Practices
    Given an agile team working with "Scrum" or "Kanban"
    Then BDD, Shift Left and well-defined acceptance criteria are part of the routine
    And a flaky test is treated as a bug: investigated, fixed or deleted
