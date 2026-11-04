# language: en

@contact
Feature: Get in touch
  Every previous scenario passed. Just this one left.

  Scenario: Talk about quality
    Given you have read the scenarios this far
    When you want to talk about testing, automation, quality or a job opening
    Then find me at:
      | channel  | address                      |
      | LinkedIn | linkedin.com/in/nat-pandolfi |
      | E-mail   | nataliaspandolfi@gmail.com   |
    And the reply arrives before the next deploy
    But if that deploy is on a Friday afternoon, we'll talk about that too
