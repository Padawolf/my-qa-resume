# language: en

@e2e @navigation
Feature: Browse the IDE files
  As a site visitor
  I want to open each file of the introduction
  So that I can get to know Natalia in whatever order I prefer

  Background:
    Given I opened the site in "English"

  Scenario: Open a file from the project window
    When I click the file "experience.feature" in the project window
    Then the editor shows the file "experience.feature"
    And the editor contains "Web, mobile and API test automation"

  Scenario: Open a file from a direct link
    When I visit the address with "#skills"
    Then the editor shows the file "skills.feature"

  Scenario: Switch files with the keyboard
    When I press "Alt+5"
    Then the editor shows the file "contact.feature"

  Scenario Outline: The "<tab>" tab opens the right file
    When I click the tab "<tab>"
    Then the editor shows the file "<tab>"

    Examples:
      | tab               |
      | about_me.feature  |
      | education.feature |

  @mobile
  Scenario: Use the site on a phone
    Given I am using a phone
    When I click the file "contact.feature" in the project window
    Then the editor shows the file "contact.feature"
    And the page has no horizontal scroll
