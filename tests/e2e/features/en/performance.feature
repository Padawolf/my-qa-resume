# language: en

@e2e @performance
Feature: Performance test with bugs
  As a site visitor
  I want to release bugs in a game window
  So that I can see whether the IDE handles the load and fix what I can

  Background:
    Given I opened the site in "English"
    And I opened the performance test

  Scenario: Release a normal amount of bugs
    When I choose 50 bugs
    And I release the bugs
    Then the FPS counter appears on screen
    And the bugs only fall inside the game window
    And the performance test shows "50 bugs in"
    And the performance test shows "Average FPS"
    And the performance test shows "shipped to production"

  @mobile
  Scenario: On a phone the rain is capped at 500 bugs
    Given I am using a phone
    When I choose 1000 bugs
    And I release the bugs
    Then the performance test shows "500 bugs in"
    And the performance test shows "Phone: capped at 500 bugs"

  @a11y
  Scenario: With reduced motion the bugs do not fall
    Given I prefer reduced motion
    When I choose 20 bugs
    And I release the bugs
    Then the performance test shows "Reduced motion"

  @a11y
  Scenario: Close the game with the keyboard
    Then the page has no serious accessibility violations
    When I press "Escape"
    Then the performance test is closed

  Scenario: One billion bugs crash the system on purpose
    When I choose 1000000000 bugs
    And I release the bugs
    Then the expected error screen is visible
    When I press "Enter"
    Then the expected error screen is not visible
