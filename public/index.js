let idEditar = null;

listar();

function novo(){

    idEditar = null;

    document.getElementById("formulario").style.display = "block";

    document.getElementById("txtnome").value = "";
    document.getElementById("txttelefone").value = "";
    document.getElementById("txtemail").value = "";

    window.scrollTo({top:0, behavior:'smooth'});
}

function cancelar(){

    document.getElementById("formulario").style.display = "none";

}

async function listar(){

    document.getElementById("conteudo").innerHTML = "Carregando...";

    const resp = await fetch("/pessoa");

    const dados = await resp.json();

    let tabela = `
    <table class="table table-hover table-bordered">

    <thead class="table-success">

        <tr>
            <th>Nome</th>
            <th>Telefone</th>
            <th>Email</th>
            <th width="150">Ações</th>
        </tr>

    </thead>

    <tbody>
    `;

    for(let i=0;i<dados.length;i++){

        tabela += `
        <tr>

        <td>${dados[i].nome}</td>

        <td>${dados[i].telefone}</td>

        <td>${dados[i].email}</td>

        <td>

        <button class="btn btn-warning btn-sm"
        onclick="editar(${dados[i].idpessoa})">
        Editar
        </button>

        <button class="btn btn-danger btn-sm"
        onclick="excluir(${dados[i].idpessoa})">
        Excluir
        </button>

        </td>

        </tr>
        `;
    }

    tabela += "</tbody></table>";

    document.getElementById("conteudo").innerHTML = tabela;

}

async function salvar(){

    const dados = {

        nome: document.getElementById("txtnome").value,
        telefone: document.getElementById("txttelefone").value,
        email: document.getElementById("txtemail").value

    };

    if(idEditar == null){

        await fetch("/pessoa",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(dados)

        });

    }else{

        await fetch("/pessoa/"+idEditar,{

            method:"PUT",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(dados)

        });

        idEditar = null;
    }

    document.getElementById("formulario").style.display = "none";

    listar();

}

async function editar(id){

    const resp = await fetch("/pessoa/"+id);

    const dados = await resp.json();

    idEditar = id;

    document.getElementById("txtnome").value = dados.nome;
    document.getElementById("txttelefone").value = dados.telefone;
    document.getElementById("txtemail").value = dados.email;

    document.getElementById("formulario").style.display = "block";

    window.scrollTo({top:0, behavior:'smooth'});
}

async function excluir(id){

    if(!confirm("Deseja excluir essa pessoa?"))
        return;

    await fetch("/pessoa/"+id,{
        method:"DELETE"
    });

    listar();

}