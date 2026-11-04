# language: en

@education
Feature: Education, certifications and languages
  Testing well is also something you study

  Scenario Outline: Certification <certification>
    Given the certification "<certification>"
    Then it was issued by "<issuer>" in <year>

    Examples:
      | certification                                 | issuer    | year |
      | ISTQB CTFL - Certified Tester Foundation Level | BSTQB     | 2023 |
      | DevOps Essentials                             | CertiProf | 2020 |
      | Scrum Foundation Professional Certificate     | CertiProf | 2020 |

  Scenario: Postgraduate studies
    Given the course "Postgraduate Certificate in Software Architecture"
    Then I studied at "FIAP" from 2024 to 2025
    And that architecture view helps spot where systems tend to fail

  Scenario: Degree
    Given the course "Associate Degree in Systems Analysis and Development"
    Then I graduated from "Impacta Tecnologia", where I studied from 2018 to 2020

  Scenario: Languages
    Given someone wants to talk to me
    Then it can be in "Portuguese", as a native speaker
    And also in "English", at an advanced professional working level
