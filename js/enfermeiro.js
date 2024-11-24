let selectedKit = null;
let addedItems = [];

function filterKits() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const kits = document.querySelectorAll('.kit-item');
    kits.forEach(kit => {
        const text = kit.innerText.toLowerCase();
        if (text.includes(searchTerm)) {
            kit.style.display = 'block';
        } else {
            kit.style.display = 'none';
        }
    });
}
function selectKit(kitName) {
    selectedKit = kitName;
    document.getElementById('kit-selected').innerText = `Kit Selecionado: ${kitName}`;
    document.getElementById('form-container').style.display = 'block';
    document.getElementById('back-button').style.display = 'block'; 
}

function goBack() {
    selectedKit = null;
    addedItems = [];
    document.getElementById('kit-selected').innerText = "Nenhum kit selecionado";
    document.getElementById('form-container').style.display = 'none';
    document.getElementById('back-button').style.display = 'none';
    document.getElementById('items-added').innerHTML = '';
}

// Processa o formulário de agendamento
document.getElementById('surgery-form').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Cirurgia agendada com sucesso!');
    goBack(); 
});