class Carro {
    constructor(id, nome, modelo, ano, posicaoNaLista) {
        this.id = id;
        this.nome = nome;
        this.modelo = modelo;
        this.ano = ano;


        this.posicaoNaLista = posicaoNaLista; //atributo para facilitar a alteração e exclusão 
    }
}