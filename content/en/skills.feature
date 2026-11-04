# language: en

@skills
Feature: Skills

  Scenario Outline: <layer> testing
    Given the "<layer>" layer
    Then I work with "<tools>"

    Examples:
      | layer         | tools                                          |
      | Web           | Playwright, Selenium, Cypress, Robot Framework |
      | Mobile        | Appium                                         |
      | API           | RestAssured                                    |
      | Performance   | k6                                             |
      | Accessibility | axe-core                                       |

  Scenario: Languages
    Given test code to write
    Then I use "Java", "Python", "JavaScript" or "TypeScript"
    And I write the scenarios in "Gherkin" with "Cucumber"

  Scenario: Testing types
    Given a delivery to validate
    Then I do manual, exploratory, regression, API, web, mobile, performance and load testing

  Scenario: Day to day
    Given an agile team, using "Scrum" or "Kanban"
    Then I work with BDD, Shift Left and acceptance criteria
    And I track tasks in "Jira" and code in "Git"
