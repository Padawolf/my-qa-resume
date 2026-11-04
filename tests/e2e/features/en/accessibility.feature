# language: en

@e2e @a11y
Feature: Accessibility
  As someone who browses with a keyboard or a screen reader
  I want to use the site without barriers
  So that I can meet Natalia like any other visitor

  Scenario Outline: <language> page with no serious violations
    Given I opened the site in "<language>"
    Then the page has no serious accessibility violations

    Examples:
      | language   |
      | Portuguese |
      | English    |

  Scenario: Open and close the help with the keyboard
    Given I opened the site in "English"
    When I press "F1"
    Then the help dialog is visible
    When I press "Escape"
    Then the help dialog is not visible
