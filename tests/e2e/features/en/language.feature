# language: en

@e2e @language
Feature: Read the site in Portuguese or English
  As a recruiter outside Brazil
  I want to switch the site language
  So that I can read the introduction in English

  Scenario: Switch to English
    Given I opened the site in "Portuguese"
    When I switch the language to "English"
    Then the page is in language "en"
    And the editor shows the file "about_me.feature"
    And the editor contains "Feature: Meet Natalia Pandolfi"

  Scenario: Back to Portuguese without losing the open file
    Given I opened the site in "English"
    And I opened the file "experience.feature"
    When I switch the language to "Português"
    Then the page is in language "pt-BR"
    And the editor shows the file "experiencia.feature"
