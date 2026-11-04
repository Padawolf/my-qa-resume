# language: pt

@habilidades
Funcionalidade: Habilidades

  Esquema do Cenário: Testes de <camada>
    Dado a camada "<camada>"
    Então trabalho com "<ferramentas>"

    Exemplos:
      | camada         | ferramentas                                    |
      | Web            | Playwright, Selenium, Cypress, Robot Framework |
      | Mobile         | Appium                                         |
      | API            | RestAssured                                    |
      | Performance    | k6                                             |
      | Acessibilidade | axe-core                                       |

  Cenário: Linguagens
    Dado código de teste para escrever
    Então uso "Java", "Python", "JavaScript" ou "TypeScript"
    E escrevo os cenários em "Gherkin" com "Cucumber"

  Cenário: Tipos de teste
    Dado uma entrega para validar
    Então faço testes manuais, exploratórios, de regressão, de API, web, mobile, de performance e de carga

  Cenário: Dia a dia
    Dado um time ágil, com "Scrum" ou "Kanban"
    Então trabalho com BDD, Shift Left e critérios de aceite
    E organizo as tarefas no "Jira" e o código no "Git"
