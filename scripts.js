//seleciona os elementos do form
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")
const expenseList = document.querySelector("ul")

//seleciona elementos de totais
const expenseQuantity = document.querySelector("aside header p span")
const expenseTotal = document.querySelector("aside header h2")

//captura evento e formatar valor
amount.oninput = () => {
    let value = amount.value.replace(/\D/g, "")
    //transforma o valor em centavos
    value = Number(value) / 100

    //retorno para a variavel
    amount.value = formatCurrencyBRL(value)
}

//formata valor moeda brasileira
function formatCurrencyBRL(value) {
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })
    return value
}

form.onsubmit = (event) => {
    //previne comportamento de att 
    event.preventDefault()

    //cria objeto com detalhes da nova despesa

    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date()
    }
    expenseAdd(newExpense)
}

//adição dos itens na lista 
function expenseAdd(newExpense) {
    try {
        //cria o elemento
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        //criando icone da categoria
        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute("alt", newExpense.category_name)

        //criando a info da despesa
        const expenseInfo = document.createElement("div")
        expenseInfo.classList.add("expense-info")

        //criando o nome da despesa
        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense

        //criando a categoria da despesa
        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpense.category_name

        //add nome e categoria na div antes do item
        expenseInfo.append(expenseName, expenseCategory)

        //add o valor
        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        expenseAmount.innerHTML = `<small>R$</small> ${newExpense.amount.replace("R$", "") }` 

        const removeIcon = document.createElement("img")
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute("src","img/remove.svg")
        removeIcon.setAttribute("alt","remover")

        //add info no item
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

        //add os itens
        expenseList.append(expenseItem)

        //chama a atualização de totais
        updateTotals()

        //limpa o form
        formClear()
    } catch (error) {
        alert('Não foi possível atualizar a lista de despesa')
        console.log(error)
    }
}

function updateTotals(){
    try {
        //recupera todos os itens li da lista ul
        const items = expenseList.children

        //att a quantidade de itens na lista
        expenseQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

        //variavel para incrementar o total 
        let total = 0;

        //percorrer cada item (li) 
        for(let item=0; item < items.length; item++){
            //percorre cada item e busca somente a classe
            const itemAmount = items[item].querySelector(".expense-amount")

            //agora vamos pegar somente o valor
            const value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",",".")

            //conversao float
            const valueFormatted = parseFloat(value)

            //verificar se realmente é um número
            if(isNaN(valueFormatted)){
                return alert('Não foi possível calcular o total. O valor não parece ser um número')
            }

            //incremento do valor total
            total += valueFormatted
        }
        // expenseTotal.textContent = total
        // expenseTotal.innerHTML = `<small>R$</small> ${String(total).replace(".", ",") }` 

        total = formatCurrencyBRL(total).replace("R$","")
        expenseTotal.innerHTML = ""
        expenseTotal.append(total)
    } catch (error){ 
        console.log(error)
        alert('Não foi possível atualizar os valores')
    }
}

expenseList.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-icon")){
        //obter a lista pai do elemento
        const item = event.target.closest(".expense")
        item.remove()
    }
    updateTotals()
})

function formClear(){
    expense.value = ""
    category.value = ""
    amount.value = ""
}

expense.focus()