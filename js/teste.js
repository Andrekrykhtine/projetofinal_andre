let dataAtual = new Date(); // Ex: 2025-01-19
console.log("Data original:", dataAtual.toLocaleDateString());

let dias = 20;
dataAtual.setDate(dataAtual.getDate() + dias);
console.log("Data após adicionar dias:", dataAtual.toLocaleDateString()); // Ex: 2025-01-26

