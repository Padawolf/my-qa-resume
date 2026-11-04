# language: pt

@habilidades
Funcionalidade: Caixa de ferramentas

  Esquema do Cenário: Automatizar testes de <camada>
    Dado um sistema com a camada "<camada>"
    Quando eu preciso de testes automatizados
    Então eu uso "<ferramentas>"

    Exemplos:
      | camada      | ferramentas                        |
      | Web         | Selenium, Cypress, Robot Framework |
      | Mobile      | Appium                             |
      | API         | RestAssured                        |
      | Performance | k6                                 |

  Cenário: Linguagens e ferramentas do dia a dia
    Dado que eu escrevo código de teste
    Então eu uso "Java" e "JavaScript"
    E descrevo o comportamento em "Gherkin" com "Cucumber"
    E organizo o trabalho com "Jira" e "Git"

  Cenário: Tipos de teste
    Dado uma entrega para validar
    Então eu escolho entre testes manuais, exploratórios, de regressão, de API, web, mobile, de performance e de carga

  Cenário: Práticas
    Dado um time ágil trabalhando com "Scrum" ou "Kanban"
    Então eu aplico BDD, Shift Left e definição de critérios de aceite
    E mantenho os testes rodando nos pipelines de CI/CD
