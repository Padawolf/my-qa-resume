# language: en
# Author: Natalia Pandolfi

@profile @smoke
Feature: Meet Natalia Pandolfi
  As a recruiter, product team or curious developer
  I want to know who the QA behind these scenarios is
  So that I can decide whether we should work together

  Background:
    Given the visitor opened this file

  Scenario: Introduction
    Given my name is "Natalia Pandolfi"
    And I am a "Senior QA Engineer" at "Zup Innovation"
    When someone asks me what I do
    Then I answer "test automation for web, mobile and APIs, plus performance testing"
    And I put automated tests right inside the CI/CD pipeline

  Scenario: Quality from product discovery onwards
    Given a new idea is still on paper
    When the team starts discovery
    Then I am already working with the Product Owner
    And I help define requirements, acceptance criteria and test scenarios
    But I don't wait for the code to be ready to start testing
