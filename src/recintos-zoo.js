import readline from 'readline';

class RecintosZoo {
    constructor() {
        this.recintos = [
            { id: 1, bioma: ['savana'], tamanho: 10, animais: [{ especie: 'MACACO', quantidade: 3 }] },
            { id: 2, bioma: ['floresta'], tamanho: 5, animais: [] },
            { id: 3, bioma: ['savana', 'rio'], tamanho: 7, animais: [{ especie: 'GAZELA', quantidade: 1 }] },
            { id: 4, bioma: ['rio'], tamanho: 8, animais: [] },
            { id: 5, bioma: ['savana'], tamanho: 9, animais: [{ especie: 'LEAO', quantidade: 1 }] }
        ];

        this.animais = {
            LEAO: { tamanho: 3, bioma: ['savana'], carnivoro: true },
            LEOPARDO: { tamanho: 2, bioma: ['savana'], carnivoro: true },
            CROCODILO: { tamanho: 3, bioma: ['rio'], carnivoro: true },
            MACACO: { tamanho: 1, bioma: ['savana', 'floresta'], carnivoro: false },
            GAZELA: { tamanho: 2, bioma: ['savana'], carnivoro: false },
            HIPOPOTAMO: { tamanho: 4, bioma: ['savana', 'rio'], carnivoro: false }
        };
    }

    analisaRecintos(tipoAnimal, quantidade) {
        if (!this.animais[tipoAnimal]) {
            return { erro: "Animal inválido" };
        }

        if (quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }

        const animalInfo = this.animais[tipoAnimal];
        let recintosViaveis = [];

        for (let recinto of this.recintos) {
            if (!recinto.bioma.some(b => animalInfo.bioma.includes(b))) continue;

            const possuiOutrasEspecies = recinto.animais.some(a => a.especie !== tipoAnimal);
            if (animalInfo.carnivoro && possuiOutrasEspecies) continue;

            const espacoOcupado = recinto.animais.reduce((sum, a) => {
                return sum + this.animais[a.especie].tamanho * a.quantidade;
            }, 0);

            const espacoExtra = recinto.animais.length > 0 && !possuiOutrasEspecies ? 1 : 0;
            const espacoLivre = recinto.tamanho - espacoOcupado - espacoExtra;

            if (espacoLivre >= animalInfo.tamanho * quantidade) {
                recintosViaveis.push({
                    id: recinto.id,
                    espacoLivre: espacoLivre - animalInfo.tamanho * quantidade,
                    espacoTotal: recinto.tamanho
                });
            }
        }

        recintosViaveis.sort((a, b) => a.id - b.id);

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        return {
            recintosViaveis: recintosViaveis.map(r =>
                `Recinto ${r.id} (espaço livre: ${r.espacoLivre} total: ${r.espacoTotal})`
            )
        };
    }
}


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const zoo = new RecintosZoo();

rl.question('Digite a espécie do animal: ', (tipoAnimal) => {
    rl.question('Digite a quantidade de animais: ', (quantidade) => {
        quantidade = parseInt(quantidade);

        const resultado = zoo.analisaRecintos(tipoAnimal.toUpperCase(), quantidade);
        if (resultado.erro) {
            console.log(resultado.erro);
        } else {
            console.log('Recintos viáveis:', resultado.recintosViaveis);
        }
        
        rl.close();
    });
});

export { RecintosZoo as RecintosZoo };