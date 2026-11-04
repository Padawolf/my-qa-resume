# language: pt

@formacao
Funcionalidade: Formação, certificações e idiomas
  Testar bem também se estuda

  Esquema do Cenário: Certificação <certificacao>
    Dado a certificação "<certificacao>"
    Então ela foi emitida por "<emissor>" em <ano>

    Exemplos:
      | certificacao                                  | emissor   | ano  |
      | ISTQB CTFL - Certified Tester Foundation Level | BSTQB     | 2023 |
      | DevOps Essentials                             | CertiProf | 2020 |
      | Scrum Foundation Professional Certificate     | CertiProf | 2020 |

  Cenário: Pós-graduação
    Dado o curso "Pós-graduação em Arquitetura de Software"
    Então estudei na "FIAP" de 2024 a 2025
    E essa visão de arquitetura ajuda a enxergar onde o sistema costuma falhar

  Cenário: Graduação
    Dado o curso "Tecnólogo em Análise e Desenvolvimento de Sistemas"
    Então me formei na "Impacta Tecnologia", onde estudei de 2018 a 2020

  Cenário: Idiomas
    Dado que alguém quer conversar comigo
    Então pode ser em "português", língua nativa
    E também em "inglês", em nível avançado de uso profissional
