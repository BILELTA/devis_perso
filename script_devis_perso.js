var serviceCounter = 2;

// --- Fonctions d'aide ---

function formatCurrency(amount) {
    if (isNaN(amount) || amount === null) return '0,00 €';
    return parseFloat(amount).toFixed(2).replace('.', ',') + ' €';
}

/**
 * Lit un fichier (le logo) et le convertit en Data URL (Base64).
 */
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve(null);
            return;
        }
        
        const maxFileSize = 500 * 1024; 
        if (file.size > maxFileSize) {
            reject(new Error("Le fichier est trop volumineux (Max 500ko). Veuillez importer un fichier plus petit."));
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = () => {
            resolve(reader.result); 
        };
        
        reader.onerror = (error) => {
            reject(new Error("Erreur de lecture du fichier."));
        };
        
        reader.readAsDataURL(file);
    });
}

// --- Fonctions de Persistance (Émetteur et Conditions) ---

function saveSellerData() {
    const sellerData = {
        name: document.getElementById('sellerName').value.trim(),
        address: document.getElementById('sellerAddress').value.trim(),
        city: document.getElementById('sellerCity').value.trim(),
        siret: document.getElementById('sellerSiret').value.trim()
    };
    localStorage.setItem('sellerData', JSON.stringify(sellerData));
}

function saveConditions() {
    const conditions = document.getElementById('customConditions');
    if (conditions) {
        localStorage.setItem('customConditions', conditions.value.trim());
    }
}

// NOTE: loadSellerData et loadConditions sont appelées dans le script HTML lors de l'ouverture de la modale.

// --- Gestion des services personnalisés ---

// Dans la fonction addNewService()
function addNewService() {
    var servicesContainer = document.getElementById('servicesContainer');
    
    var serviceContainer = document.createElement('div');
    serviceContainer.className = 'option';
    serviceContainer.style.display = 'flex';
    serviceContainer.style.alignItems = 'center';
    serviceContainer.style.marginTop = '10px';
    
    // NOUVEAU : CRÉER LES INPUTS AVANT D'Y AJOUTER DES ÉCOUTEURS
    var categoryInput = document.createElement('input');
    categoryInput.type = 'text';
    categoryInput.className = 'service-input category-input';
    categoryInput.placeholder = 'Catégorie';
    
    var optionInput = document.createElement('input');
    optionInput.type = 'text';
    optionInput.className = 'service-input';
    optionInput.placeholder = 'Option';
    
    var priceInput = document.createElement('input');
    priceInput.type = 'text';
    priceInput.className = 'price-input';
    priceInput.style.width = '80px';
    priceInput.placeholder = 'Prix HT (€)'; 
    
    var quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.className = 'quantity-input';
    quantityInput.min = '1';
    quantityInput.value = '1';
    quantityInput.placeholder = 'Qté';

    var addButton = document.createElement('button');
    addButton.className = 'add-button';
    addButton.textContent = '+';
    addButton.addEventListener('click', addNewService);

    var deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = '-';
    deleteButton.addEventListener('click', removeService);

    // AJOUT DES ÉCOUTEURS D'INPUT APRÈS LA CRÉATION
    categoryInput.addEventListener('input', updateRealTimeTotal);
    optionInput.addEventListener('input', updateRealTimeTotal);
    priceInput.addEventListener('input', updateRealTimeTotal);
    quantityInput.addEventListener('input', updateRealTimeTotal);
    
    serviceContainer.appendChild(categoryInput);
    serviceContainer.appendChild(optionInput);
    serviceContainer.appendChild(priceInput);
    serviceContainer.appendChild(quantityInput);
    serviceContainer.appendChild(addButton);
    serviceContainer.appendChild(deleteButton);
    servicesContainer.appendChild(serviceContainer);
    
    serviceCounter++;
    updateRealTimeTotal(); 
}

function removeService(event) {
    const servicesContainer = document.getElementById('servicesContainer');
    const serviceContainer = event.target.parentNode;

    // Empêche la suppression de la première ligne
    if (servicesContainer.children.length <= 1) {
        return;
    }

    serviceContainer.remove();
    updateRealTimeTotal();
}

/**
 * Récupère toutes les données des services et calcule le total HT brut.
 * @param {boolean} validate - Si true, effectue une validation stricte et affiche des alertes.
 * @returns {{data: Array<{category: string, option: string, price: number, quantity: number}>, totalHT: number, isValid: boolean}}
 */
function getCustomServicesData(validate = false) {
    const customServicesData = [];
    let isValid = true; 
    let totalHT = 0;

    const serviceContainers = document.querySelectorAll('#servicesContainer > div.option');
    
    serviceContainers.forEach((serviceContainer) => {
        const categoryInput = serviceContainer.querySelector('.category-input');
        const optionInput = serviceContainer.querySelector('.service-input:not(.category-input)');
        const priceInput = serviceContainer.querySelector('.price-input');
        const quantityInput = serviceContainer.querySelector('.quantity-input');

        const category = categoryInput ? categoryInput.value.trim() : '';
        const option = optionInput ? optionInput.value.trim() : '';
        
        // On remplace la virgule par le point pour le parseFloat
        const price = parseFloat(priceInput ? priceInput.value.replace(',', '.') : 0) || 0; 
        const quantity = parseInt(quantityInput ? quantityInput.value : 1) || 1;
        
        const subTotal = price * quantity;
        totalHT += subTotal;

        let rowValid = true;

        if (validate) {
            // Validation stricte uniquement si appelée depuis generateDevisFinal()
            if (!category || !option || price < 0 || quantity < 1) { 
                rowValid = false;
                isValid = false;
            }

            if (!category) categoryInput.classList.add('invalid-input'); else categoryInput.classList.remove('invalid-input');
            if (!option) optionInput.classList.add('invalid-input'); else optionInput.classList.remove('invalid-input');
            if (price < 0) priceInput.classList.add('invalid-input'); else priceInput.classList.remove('invalid-input'); 
            if (quantity < 1) quantityInput.classList.add('invalid-input'); else quantityInput.classList.remove('invalid-input');
        }

        // On stocke la ligne si elle est valide (en mode validation) ou si elle contient des données (en mode calcul)
        if (validate ? rowValid : (category || option || price > 0)) { 
            customServicesData.push({ category, option, price, quantity });
        }
    });

    if (validate && !isValid && customServicesData.length > 0) {
        alert("Veuillez corriger les lignes de service marquées en rouge.");
    } else if (validate && customServicesData.length === 0) {
        alert("Veuillez remplir au moins une ligne de service pour générer le devis.");
        isValid = false;
    }
    
    return { data: customServicesData, totalHT: totalHT, isValid: isValid && customServicesData.length > 0 };
}


/**
 * Calcule le total HT actuel et met à jour l'affichage dans la page (1.A).
 */
function updateRealTimeTotal() {
    const { totalHT } = getCustomServicesData(false); // On n'appelle PAS la validation ici
    const totalElement = document.getElementById('realTimeTotal');
    
    if (totalElement) {
        totalElement.textContent = formatCurrency(totalHT);
    }
}


/**
 * Génère le contenu HTML du devis pour le PDF ou l'impression.
 */
function buildDevisHTML(options) {
    const { 
        logoDataURL, 
        devisNumber, 
        clientName, 
        clientAddress, 
        clientCity, 
        clientSiret,
        devisTitle, 
        devisDate, 
        tvaRate, 
        customServicesData, 
        totalCostHT, // Total HT Brut
        totalCostHTAfterDiscount, // Nouveau Total HT après réduction
        totalTVA, 
        totalCostTTC,
        sellerName,
        sellerAddress,
        sellerCity,
        sellerSiret,
        discountValue,
        discountType,
        customConditions
    } = options;

    let devisHTML = '';
    
    // En-tête (Logo et Infos Société)
    devisHTML += `<div style='display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px;'>
        <div style='font-size: 11px; line-height: 1.5;'>
            <strong style="font-size: 14px;">${sellerName}</strong><br>
            ${sellerAddress}<br>
            ${sellerCity}<br>
            SIRET / TVA : ${sellerSiret}<br>
        </div>`;
    
    // Insertion du logo Base64
    if (logoDataURL) {
        devisHTML += `<img src='${logoDataURL}' alt='Logo Société' style='max-width: 150px; height: auto;'>`;
    }
    
    devisHTML += `</div>`; 


    // Infos Devis et Client
    devisHTML += `<div class="devis-header" style="border: 1px solid #ccc; padding: 15px; border-radius: 4px; margin-bottom: 30px; background-color: #f7f7f7;">
        <h2 style='font-size: 18px; margin-bottom: 10px; font-weight: 700; color: #34495E;'>DEVIS N° ${devisNumber.toString().padStart(4, '0')} - ${devisTitle}</h2>
        
        <div style='display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 15px;'>
            <div><strong>Date d'émission :</strong> ${devisDate}</div>
            <div><strong>Valable jusqu'au :</strong> ${
            // Calcule la date de validité (ex: 30 jours)
            (() => {
                const parts = devisDate.split('/');
                if (parts.length === 3) {
                    const date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`); 
                    date.setDate(date.getDate() + 30);
                    const dd = String(date.getDate()).padStart(2, '0');
                    const mm = String(date.getMonth() + 1).padStart(2, '0');
                    const yyyy = date.getFullYear();
                    return `${dd}/${mm}/${yyyy}`;
                }
                return "N/A";
            })()
            }</div>
        </div>
        
        <h3 style="font-size: 14px; font-weight: 600; margin-bottom: 5px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Client :</h3>
        <p style='font-size: 12px; line-height: 1.4;'>
            <strong>${clientName}</strong><br>
            ${clientAddress}<br>
            ${clientCity}<br>
            N° SIRET / TVA : ${clientSiret}
        </p>
    </div>`;
    
    // Tableau des services
    devisHTML += `<table style='width: 100%; font-size: 11px; font-family: "Open Sans", sans-serif; border-collapse: collapse; margin-bottom: 20px;'>`;
    devisHTML += `<thead style="font-weight: bold; background-color: #e8e8e8;">`;
    devisHTML += `<tr>
        <th style='border-bottom: 2px solid black; text-align: left; padding: 8px 5px;'>Catégorie</th>
        <th style='border-bottom: 2px solid black; text-align: left; padding: 8px 5px;'>Désignation</th>
        <th style='border-bottom: 2px solid black; text-align: right; padding: 8px 5px;' class='align-right'>Qté</th>
        <th style='border-bottom: 2px solid black; text-align: right; padding: 8px 5px;' class='align-right'>Prix Unit. HT</th>
        <th style='border-bottom: 2px solid black; text-align: right; padding: 8px 5px;' class='align-right'>Total HT</th>
    </tr>`;
    devisHTML += `</thead><tbody>`;

    for (const serviceData of customServicesData) {
        const { category, option, price, quantity } = serviceData;
        const totalHT = price * quantity; 
        
        const formattedUnitPrice = formatCurrency(price);
        const formattedTotalHT = formatCurrency(totalHT);

        const categoryCell = `<td class="category-cell" style="padding: 5px 5px; font-weight: 600;">${category}</td>`;

        devisHTML += `<tr>${categoryCell}
            <td style="padding: 5px 5px;">${option}</td>
            <td class='align-right' style="padding: 5px 5px;">${quantity}</td>
            <td class='align-right' style="padding: 5px 5px;">${formattedUnitPrice}</td>
            <td class='align-right' style="padding: 5px 5px; background-color: #f9f9f9;">${formattedTotalHT}</td>
        </tr>`;
    }

    devisHTML += `<tr><td colspan='5' style='height: 10px; border-top: 1px solid #ddd;'></td></tr>`; 
    devisHTML += `</tbody></table>`;

    // Bloc des totaux (avec Rabais)
    devisHTML += `<div style="width: 300px; margin-left: auto; font-size: 12px;">`;
    devisHTML += `<table style='width: 100%; border-collapse: collapse;'>`;
    
    // 1. TOTAL HORS TAXES (BRUT)
    devisHTML += `<tr class='total-row'><td style='text-align: right; padding: 5px 5px; font-weight: 400;'>TOTAL HORS TAXES : </td><td class='align-right' style='padding: 5px 5px; font-weight: 600; background-color: #f0f0f0;'>${formatCurrency(totalCostHT)}</td></tr>`;
    
    // 2. LIGNE DE RÉDUCTION (si applicable)
    if (discountValue > 0) {
        let discountDisplay = (discountType === 'percent') ? `${discountValue.toFixed(2)} %` : formatCurrency(discountValue);
        let discountAmount = totalCostHT - totalCostHTAfterDiscount;

        devisHTML += `<tr class='discount-row'><td style='text-align: right; padding: 5px 5px; font-weight: 400; color: #E74C3C;'>RÉDUCTION (${discountDisplay}) : </td><td class='align-right' style='padding: 5px 5px; font-weight: 600; color: #E74C3C; background-color: #fbe6e6;'>-${formatCurrency(discountAmount)}</td></tr>`;

        // 3. TOTAL HORS TAXES (APRES RÉDUCTION)
        devisHTML += `<tr class='total-row'><td style='text-align: right; padding: 5px 5px; font-weight: 400; border-top: 1px dashed #ddd;'>TOTAL HT NET : </td><td class='align-right' style='padding: 5px 5px; font-weight: 600; background-color: #f0f0f0; border-top: 1px dashed #ddd;'>${formatCurrency(totalCostHTAfterDiscount)}</td></tr>`;
    } else {
        // Renommer TOTAL HT en TOTAL HT NET s'il n'y a pas de rabais
        devisHTML += `<tr class='total-row'><td style='text-align: right; padding: 5px 5px; font-weight: 400;'>TOTAL HT NET : </td><td class='align-right' style='padding: 5px 5px; font-weight: 600; background-color: #f0f0f0;'>${formatCurrency(totalCostHT)}</td></tr>`;
    }

    // 4. TVA
    devisHTML += `<tr class='total-row'><td style='text-align: right; padding: 5px 5px; font-weight: 400;'>TVA (${tvaRate} %) : </td><td class='align-right' style='padding: 5px 5px; font-weight: 600;'>${formatCurrency(totalTVA)}</td></td></tr>`;
    
    // 5. TOTAL TTC
    devisHTML += `<tr style='border-top: 2px solid #333;'><td style='text-align: right; padding: 8px 5px; font-weight: 700; background-color: #e0e0e0;'>TOTAL TTC : </td><td class='align-right' style='font-weight: 700; background-color: #e0e0e0; padding: 8px 5px;'>${formatCurrency(totalCostTTC)}</td></tr>`;
    devisHTML += `</table></div>`;
    
    // Mentions légales et Signatures
    devisHTML += `<div style='font-size: 10px; margin-top: 50px; padding-top: 10px; border-top: 1px solid #ddd;'>`;

    if (customConditions) {
        devisHTML += `<strong>Conditions de Vente et Mentions Légales :</strong><br>`;
        // Remplacement des sauts de ligne (\n) par des balises <br>
        devisHTML += customConditions.replace(/\n/g, '<br>');
    } else {
        devisHTML += `<p>Conditions non spécifiées. Veuillez les ajouter dans la modale.</p>`;
    }
    
    // Bloc Signature
    devisHTML += `<div style="margin-top: 30px; border: 1px solid #ccc; padding: 10px; text-align: center; width: 50%; float: left; margin-right: 5%;">
        <strong>Bon pour Accord (Client) :</strong><br><br>
        Date : ______________<br>
        Signature :
    </div>
    <div style="margin-top: 30px; border: 1px solid #ccc; padding: 10px; text-align: center; width: 40%; float: left;">
        <strong>Votre Signature :</strong><br><br><br>
        Signature :
    </div>`;
    
    devisHTML += `</div>`;


    return devisHTML;
}

/**
 * Fonction principale asynchrone pour générer le devis PDF.
 */
async function generateDevisFinal() {
    // 1. Récupération des inputs
    const sellerNameInput = document.getElementById('sellerName');
    const sellerAddressInput = document.getElementById('sellerAddress');
    const sellerCityInput = document.getElementById('sellerCity');
    const sellerSiretInput = document.getElementById('sellerSiret');

    const logoFileInput = document.getElementById('logoFileInput');
    const devisNumberCustomInput = document.getElementById('devisNumberCustom');
    const devisDateInput = document.getElementById('devisDate');
    const devisTitleInput = document.getElementById('devisTitle');
    const clientNameInput = document.getElementById('clientName');
    const clientAddressInput = document.getElementById('clientAddress');
    const clientCityInput = document.getElementById('clientCity');
    const clientSiretInput = document.getElementById('clientSiret');

    const tvaRateInput = document.getElementById('tvaRate');
    const customConditionsInput = document.getElementById('customConditions'); 
    const discountValueInput = document.getElementById('discountValue');
    const discountTypeInput = document.getElementById('discountType');


    // 2. Validation de la modale (champs obligatoires)
    let dialogValid = true;
    
    const inputsToValidate = [
        sellerNameInput, sellerAddressInput, sellerCityInput, sellerSiretInput, 
        devisNumberCustomInput, devisDateInput, devisTitleInput, 
        clientNameInput, clientAddressInput, clientCityInput, clientSiretInput 
    ];
    
    inputsToValidate.forEach(input => {
        if (input.value.trim() === '') {
            input.classList.add('invalid-input'); 
            dialogValid = false;
        } else {
            input.classList.remove('invalid-input'); 
        }
    });

    const tvaRate = parseFloat(tvaRateInput.value) || 0;
    if (tvaRate < 0 || isNaN(tvaRate)) {
        tvaRateInput.classList.add('invalid-input'); 
        dialogValid = false;
    } else { 
        tvaRateInput.classList.remove('invalid-input'); 
    }

    if (!dialogValid) {
        alert("Veuillez remplir tous les champs obligatoires marqués en rouge dans la modale.");
        return;
    }

    // 3. Sauvegarde des données (Émetteur et Conditions)
    saveSellerData();
    saveConditions();

    // 4. Traitement du fichier logo (ASYNCHRONE)
    let logoDataURL = null;
    try {
        if (logoFileInput.files && logoFileInput.files.length > 0) {
            logoDataURL = await readFileAsDataURL(logoFileInput.files[0]); 
        }
    } catch (e) {
        alert("Erreur lors de l'import du logo: " + e.message + " La génération du devis se poursuit sans logo.");
        logoDataURL = null; 
    }

    // 5. Récupération et validation des services
    const { data: customServicesData, totalHT: totalCostHT, isValid: servicesValid } = getCustomServicesData(true);
    
    if (!servicesValid) {
        closeDevisDialog(); 
        return;
    }

    // 6. Calculs (y compris le rabais)
    const currentDevisNumber = parseInt(devisNumberCustomInput.value);
    
    if (currentDevisNumber > (parseInt(localStorage.getItem('devisNumber')) || 0)) {
        localStorage.setItem('devisNumber', currentDevisNumber);
    }
    
    // Calcul du Rabais
    const discountValue = parseFloat(discountValueInput.value) || 0;
    const discountType = discountTypeInput.value;
    let discountAmount = 0;

    if (discountType === 'percent') {
        discountAmount = totalCostHT * (discountValue / 100);
    } else {
        discountAmount = discountValue;
    }

    // Le rabais ne peut pas être supérieur au total HT brut
    if (discountAmount > totalCostHT) {
        discountAmount = totalCostHT;
    }
    
    const totalCostHTAfterDiscount = totalCostHT - discountAmount;

    // Calcul final (sur le montant après rabais)
    const totalTVA = totalCostHTAfterDiscount * (tvaRate / 100);
    const totalCostTTC = totalCostHTAfterDiscount + totalTVA;


    // 7. Préparation des données et génération du HTML
    const devisOptions = {
        logoDataURL: logoDataURL,
        devisNumber: currentDevisNumber,
        devisTitle: devisTitleInput.value.trim(),
        devisDate: devisDateInput.value,
        
        sellerName: sellerNameInput.value.trim(),
        sellerAddress: sellerAddressInput.value.trim(),
        sellerCity: sellerCityInput.value.trim(),
        sellerSiret: sellerSiretInput.value.trim(),

        clientName: clientNameInput.value.trim(),
        clientAddress: clientAddressInput.value.trim(),
        clientCity: clientCityInput.value.trim(),
        clientSiret: clientSiretInput.value.trim(),
        
        tvaRate,
        customServicesData,
        totalCostHT,
        totalCostHTAfterDiscount, 
        totalTVA,
        totalCostTTC,
        discountValue,
        discountType,
        customConditions: customConditionsInput.value.trim()
    };

    const devisHTMLContent = buildDevisHTML(devisOptions);

    // 8. Génération et téléchargement du PDF
    const content = document.createElement('div');
    content.innerHTML = devisHTMLContent;
    
    const paddedDevisNumber = currentDevisNumber.toString().padStart(4, '0');
    const cleanClientName = devisOptions.clientName.replace(/[^a-z0-9]/gi, '_'); 
    const cleanDevisTitle = devisOptions.devisTitle.replace(/[^a-z0-9]/gi, '_');
    const fileName = `Devis_${paddedDevisNumber}_${cleanClientName}_${cleanDevisTitle}.pdf`;

    html2pdf().from(content).set({
        margin: [10, 10, 10, 10], 
        filename: fileName,
        html2canvas: { scale: 2, logging: false, dpi: 192, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).save();

    closeDevisDialog();
}