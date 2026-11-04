# language: pt

@e2e @idioma
Funcionalidade: Ler o site em português ou em inglês
  Como recrutadora de fora do Brasil
  Quero trocar o idioma do site
  Para ler a apresentação em inglês

  Cenário: Trocar para inglês
    Dado que abri o site em "português"
    Quando eu troco o idioma para "English"
    Então a página está no idioma "en"
    E o editor mostra o arquivo "about_me.feature"
    E o editor contém "Feature: Meet Natalia Pandolfi"

  Cenário: Voltar para português sem perder o arquivo aberto
    Dado que abri o site em "inglês"
    E que abri o arquivo "experience.feature"
    Quando eu troco o idioma para "Português"
    Então a página está no idioma "pt-BR"
    E o editor mostra o arquivo "experiencia.feature"
