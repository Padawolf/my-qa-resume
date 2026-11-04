# language: pt

@e2e @navegacao
Funcionalidade: Navegar pelos arquivos da IDE
  Como visitante do site
  Quero abrir cada arquivo da apresentação
  Para conhecer a Natalia pelo caminho que eu preferir

  Contexto:
    Dado que abri o site em "português"

  Cenário: Abrir um arquivo pela janela de projeto
    Quando eu clico no arquivo "experiencia.feature" na janela de projeto
    Então o editor mostra o arquivo "experiencia.feature"
    E o editor contém "Automação de testes web, mobile e de APIs"

  Cenário: Abrir um arquivo por link direto
    Quando eu acesso o endereço com "#skills"
    Então o editor mostra o arquivo "habilidades.feature"

  Cenário: Trocar de arquivo pelo teclado
    Quando eu pressiono "Alt+5"
    Então o editor mostra o arquivo "contato.feature"

  Esquema do Cenário: A aba "<aba>" abre o arquivo certo
    Quando eu clico na aba "<aba>"
    Então o editor mostra o arquivo "<aba>"

    Exemplos:
      | aba               |
      | sobre_mim.feature |
      | formacao.feature  |

  @mobile
  Cenário: Usar o site no celular
    Dado que estou usando um celular
    Quando eu clico no arquivo "contato.feature" na janela de projeto
    Então o editor mostra o arquivo "contato.feature"
    E a página não tem rolagem horizontal
