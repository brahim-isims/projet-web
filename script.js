document.addEventListener('DOMContentLoaded', function() {
    
    var orderForm = document.getElementById("orderFormElement");
    if (orderForm) {
        var selected = JSON.parse(localStorage.getItem('selectedPerfume'));
        if (selected) {
            document.getElementById('perfume').value = selected.name;
            document.getElementById('price').value = selected.price;
        }

        orderForm.addEventListener("submit", function (e) { 
            e.preventDefault(); 
            envoyerCommandeAJAX(); 
        }); 
    }
    document.body.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('order-btn')) {
            var data = {
                name: e.target.getAttribute('data-name'),
                price: e.target.getAttribute('data-price')
            };
            localStorage.setItem('selectedPerfume', JSON.stringify(data));
            window.location.href = 'order.html';
        }
        
        if (e.target.id === 'menuToggle' || e.target.parentElement.id === 'menuToggle') {
            document.getElementById("sidebar").classList.toggle("active");
        }
    });
});
function envoyerCommandeAJAX() {
    var xhr = null; //
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest(); //
    } else if (window.ActiveXObject) {
        xhr = new ActiveXObject("Microsoft.XMLHTTP"); //
    } else {
        alert("Votre navigateur n'est pas compatible avec AJAX..."); //
        return;
    }
    var clientName = document.getElementById("name").value;
    var perfumeName = document.getElementById("perfume").value;
    var quantity = document.getElementById("quantity").value;
    xhr.onreadystatechange = function () {

        if (xhr.readyState === 4 && xhr.status === 200) { //
            console.log("Réponse reçue : " + xhr.responseText); 
            generateReceipt(); 
        }
    };
    xhr.open("POST", "traiter_commande.php", true); 
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); //
    var params = "nom=" + encodeURIComponent(clientName) + 
                 "&parfum=" + encodeURIComponent(perfumeName) + 
                 "&qte=" + encodeURIComponent(quantity); //
    
    xhr.send(params); 
}
function generateReceipt() { 
    var name = document.getElementById("name").value; 
    var perfume = document.getElementById("perfume").value;
    var price = parseFloat(document.getElementById("price").value) || 50;
    var qte = parseInt(document.getElementById("quantity").value); 
    var ticket = document.getElementById("summaryDetails"); 

    if (!name || qte <= 0) {
        alert("Veuillez entrer un nom et une quantité valides");
        return;
    } 

    var total = (qte * price).toFixed(2);
    ticket.innerHTML = "<h3>Reçu</h3><p>Produit: " + perfume + "</p><p>Client: " + name + "</p><p>Total: " + total + "€</p>"; 
    ticket.style.border = "1px solid #9932cc";
    ticket.style.padding = "20px";
}
