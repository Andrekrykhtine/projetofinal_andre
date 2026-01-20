let plantas = JSON.parse(localStorage.getItem("minhasPlantas")) || [];
let imagemBase64 = "";

function limparForm() {
  document.getElementById("formPlanta").reset();
  const preview = document.getElementById("previewFoto");
  preview.style.display = "none";
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("formModal"),
  );
  modal.hide();
}

document.getElementById("foto").addEventListener("change", function (event) {
  const file = event.target.files[0];
  const preview = document.getElementById("previewFoto");

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imagemBase64 = e.target.result;
      preview.src = imagemBase64;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    preview.style.display = "none";
    imagemBase64 = "";
  }
});

document
  .getElementById("formPlanta")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const hoje = new Date();
    const diasFrequencia = parseInt(
      document.getElementById("frequenciaRega").value,
      10,
    );
    const primeiraProximaRega = new Date(
      hoje.getTime() + diasFrequencia * 24 * 60 * 60 * 1000,
    );

    const novaPlanta = {
      id: Date.now(),
      nome: document.getElementById("nome").value,
      foto: document.getElementById("foto").files[0]?.name || "",
      fotoBase64: imagemBase64,
      rega: document.getElementById("frequenciaRega").value,
      adubo: document.getElementById("frequenciaAdubacao").value,
      obs: document.getElementById("observacoes").value || "Sem observações",
      dataCadastro: dataAtualBR(),
      proximaRega: primeiraProximaRega.toLocaleDateString("pt-BR"),
    };

    plantas.push(novaPlanta);
    localStorage.setItem("minhasPlantas", JSON.stringify(plantas));

    limparForm();

    exibirPlantas();
  });

function dataAtualBR() {
  return new Date().toLocaleDateString("pt-BR");
}

function compararDatas(dataBR) {
  const [dia, mes, ano] = dataBR.split("/").map(Number);

  const dataProxima = new Date(ano, mes - 1, dia);
  const hoje = new Date();

  dataProxima.setHours(0, 0, 0, 0);
  hoje.setHours(0, 0, 0, 0);

  return dataProxima <= hoje;
}

function exibirPlantas() {
  const container = document.getElementById("plantasContainer");

  if (plantas.length === 0) {
    container.innerHTML =
      '<div class="col-12"><div class="alert alert-info text-center">Nenhuma planta cadastrada. Adicione a primeira! 🌱</div></div>';
    return;
  }

  let html = "";

  plantas.forEach((planta) => {
    const precisaRegarHoje = compararDatas(planta.proximaRega);

    const textoBotao = precisaRegarHoje
      ? "Regar hoje"
      : `Regar dia ${planta.proximaRega}`;

    const classeBotao = precisaRegarHoje ? "btn-danger" : "btn-info";

    html +=`  
      <div class="col-lg-4 col-md-6">
        <div class="card h-100 shadow-sm">
          <img src="${planta.fotoBase64 || "https://picsum.photos/300/200?random=1"}" 
               class="card-img-top" alt="${planta.nome}" 
               style="height: 200px; object-fit: cover;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${planta.nome}</h5>
            <p class="card-text flex-grow-1">
              <i class="bi bi-droplet-half text-primary"></i> Rega: ${planta.rega} dia(s) na semana<br>
              <i class="bi bi-basket3 text-success"></i> Adubo: ${planta.adubo} vez(es) ao mês
            </p>
            <small class="text-muted">${planta.obs}</small>
            <button class="btn btn-danger btn-sm mt-2" onclick="removerPlanta(${planta.id})">
              <i class="bi bi-trash"></i> Remover
            </button>
            <button class="btn ${classeBotao} btn-sm mt-2" onclick="regarPlanta(${planta.id})">
              <i class="bi bi-cloud-hail-fill"></i> ${textoBotao}
            </button>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html; 
  console.table(plantas);
}


document.addEventListener("DOMContentLoaded", exibirPlantas);

function regarPlanta(id) {
  const planta = plantas.find((p) => p.id === id);

  const hoje = new Date();
  planta.ultimaRega = hoje.toLocaleDateString("pt-BR");

  const diasFrequencia = planta.rega;
  const proxima = new Date(
    hoje.getTime() + diasFrequencia * 24 * 60 * 60 * 1000,
  );

  planta.proximaRega = proxima.toLocaleDateString("pt-BR");

  localStorage.setItem("minhasPlantas", JSON.stringify(plantas));
  exibirPlantas();
}

function removerPlanta(id) {
  plantas = plantas.filter((p) => p.id !== id);
  localStorage.setItem("minhasPlantas", JSON.stringify(plantas));
  exibirPlantas();
}

document
  .getElementById("formModal")
  .addEventListener("hidden.bs.modal", function () {
    limparForm();
  });
