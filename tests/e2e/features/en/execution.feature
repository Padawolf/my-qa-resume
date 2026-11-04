# language: en

@e2e @execution
Feature: See the result of the latest CI run
  As a curious visitor
  I want to press "Run"
  So that I can see the real test report for this site

  Scenario: Report with every test passing
    Given the CI published the "passing" report
    And I opened the site in "English"
    When I click the run button
    Then the output shows "4 Scenarios (4 passed)"
    And the output shows "BUILD SUCCESS"

  Scenario: Report with one failing test
    Given the CI published the "failing" report
    And I opened the site in "English"
    When I press "F9"
    Then the output shows "1 failed"
    And the output shows "BUILD FAILURE"

  Scenario: No report yet
    Given the CI has not published any report yet
    When I open the site in "English"
    Then the output shows "No CI report found"
