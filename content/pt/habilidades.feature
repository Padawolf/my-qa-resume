# language: pt

@habilidades
Funcionalidade: Caixa de ferramentas
  Ferramenta boa é a que resolve o problema do time

  Esquema do Cenário: Automatizar testes de <camada>
    Dado um sistema com a camada "<camada>"
    Quando ela precisa de testes automatizados
    Então a escolha é "<ferramentas>"

    Exemplos:
      | camada         | ferramentas                                    |
      | Web            | Playwright, Selenium, Cypress, Robot Framework |
      | Mobile         | Appium                                         |
      | API            | RestAssured                                    |
      | Performance    | k6                                             |
      | Acessibilidade | axe-core                                       |

  Cenário: Linguagens e ferramentas do dia a dia
    Dado código de teste para escrever
    Então as linguagens são "Java", "Python", "JavaScript" e "TypeScript"
    E o comportamento é descrito em "Gherkin" com "Cucumber", para produto e dev lerem o mesmo teste
    E o trabalho é organizado com "Jira" e "Git"

  Cenário: Tipos de teste
    Dado uma entrega para validar
    Quando a pergunta é "o que pode dar errado aqui?"
    Então a escolha passa por testes manuais, exploratórios, de regressão, de API, web, mobile, de performance e de carga
    Mas a automação segue a pirâmide de testes e o risco, não a vontade de automatizar tudo

  Cenário: Práticas
    Dado um time ágil trabalhando com "Scrum" ou "Kanban"
    Então BDD, Shift Left e critérios de aceite bem definidos fazem parte da rotina
    E teste flaky é tratado como bug: investigado, corrigido ou removido
