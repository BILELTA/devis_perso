// Fonction pour gérer l'accessibilité du champ de quantité en fonction de l'état de la case à cocher
function toggleQuantity(optionId) {
  const quantityInput = document.getElementById(optionId + 'Quantity');
  const checkbox = document.getElementById(optionId + 'Checkbox');
  quantityInput.disabled = !checkbox.checked;
}

function calculateTotal(totalCost) {
  totalCost = 0;

  // Prix unitaires pour chaque option
  const prices = {
    linuxDeBase: 20,
    linuxExtension1vCPU: 4,
    linuxExtension1RAM: 2,
    linuxExtension50Disk: 4,
    windowsDeBase: 32,
    windowsExtension1vCPU: 11,
    windowsExtension1RAM: 2,
    windowsExtension50Disk: 6,
    hebergementSecConnectiviteOption1: 1840,
    hebergementSecConnectiviteRocade1: 640,
    hebergementSecConnectiviteRocade3: 960,
    hebergementSecConnectiviteRocade6: 1280,
    hebergementSecConnectiviteOption2: 1680,
    hebergementSecConnectiviteOption3: 11760,
    hebergementSecEnergieOption1: 576.3208,
    hebergementSecEnergieOption2: 1160,
    hebergementSecEnergieOption3: 576,
    hebergementSecPRAOption1: 0,
    hebergementSecPRAOption2: 0,
    hebergementSecPRAOption3: 148,
    infrastructureAsAServiceOption1: 800,
    infrastructureAsAServiceOption2: 210,
    infrastructureAsAServiceOption3: 40,
    infrastructureAsAServiceOption4: 80,
    infrastructureAsAServiceOption5: 300,
    infrastructureAsAServiceOption6: 500,
    sauvegardeOption1: 5,
    sauvegardeOption2: 8,
    sauvegardeOption3: 70,
    sauvegardeOption4: 10,
    sauvegardeOption5: 15,
    sauvegardeOption6: 50,
    sauvegardeOption7: 95,
    servicesOption1: 20,
    servicesOption2: 15,
    servicesOption3: 20,
    servicesOption4: 30,
    servicesOption5: 15,
    servicesOption6: 2,
    servicesOption7: 1,
    servicesOption8: 5,
    servicesOption9: 5,
    servicesOption10: 20,
    servicesOption11: 1,
    servicesOption12: 20,
    servicesOption13: 19,
    servicesOption14: 5,
    servicesOption15: 20,
    servicesOption16: 5,
    servicesOption17: 5,
  };
  

  // Parcourir chaque option
  for (let optionId in prices) {
    // Vérifier si la case à cocher est sélectionnée
    const checkbox = document.getElementById(optionId + 'Checkbox');
    if (checkbox.checked) {
      // Obtenir la quantité
      const quantity = parseInt(document.getElementById(optionId + 'Quantity').value) || 0;
      // Ajouter le coût de cette option au coût total
      totalCost += prices[optionId] * quantity;
    }
  }

  // Mettre à jour le coût total sur la page
  document.getElementById('total').innerText = totalCost.toFixed(2) + ' €';
  return totalCost;
}

function calculateTotalTTC(totalCost) {
  const tauxTVA = 20;
  const totalTTC = totalCost * (1 + tauxTVA / 100);
  return totalTTC.toFixed(2);
}

// Écouteur d'événement pour détecter les changements d'état des cases à cocher
document.addEventListener('DOMContentLoaded', function() {
  const checkboxes = document.querySelectorAll('.option input[type="checkbox"]');
  checkboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
      const optionId = checkbox.id.replace('Checkbox', '');
      toggleQuantity(optionId);
      calculateTotal();
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('linuxDeBaseCheckbox').addEventListener('change', toggleInput);
  document.getElementById('linuxExtension1vCPUCheckbox').addEventListener('change', toggleInput);
  document.getElementById('linuxExtension1RAMCheckbox').addEventListener('change', toggleInput);
  document.getElementById('linuxExtension50DiskCheckbox').addEventListener('change', toggleInput);
});

function toggleInput(event) {
  const quantityInput = event.target.parentElement.nextElementSibling;
  quantityInput.disabled = !event.target.checked;
  calculateTotal();
}

document.addEventListener("DOMContentLoaded", function () {
  // Ajout d'écouteurs d'événements aux checkboxes et input de quantité.
  document.querySelectorAll('.option input').forEach(function (inputElem) {
    inputElem.addEventListener('input', calculateTotal);
  });
});

function generateDevis() {
  let totalCost = calculateTotal();

  let devisNumber = localStorage.getItem('devisNumber');

  if (devisNumber === null) {
    devisNumber = 1;
  } else {
    devisNumber = parseInt(devisNumber) + 1;
  }

  localStorage.setItem('devisNumber', devisNumber);

  let devis = "<h2 style='font-size: 14px;'>Devis N° " + String(devisNumber).padStart(5, '0') + "</h2>";
  devis += "<table style='width: 100%; font-size: 10px; font-style: Opensans; border-collapse: collapse;'>";
  devis += "<tr><th style='border-bottom: 1px solid black; text-align: left; padding-left: 0px;'>Catégorie</th><th style='border-bottom: 1px solid black; text-align: left; padding-left: 0px;'>Option</th><th style='border-bottom: 1px solid black; text-align: left; padding-right: 10px;' class='align-right'>Quantité</th><th style='border-bottom: 1px solid black; text-align: left; padding-left: 0px;' class='align-right'>Prix</th><th style='border-bottom: 1px solid black; text-align: left; padding-left: 0px;' class='align-right'>FRM*</th></tr>";

  // Génération des options pour la catégorie Machine Virtuelle - Linux
  if (document.getElementById('linuxDeBaseCheckbox').checked) {
    let linuxDeBaseQuantity = parseInt(document.getElementById('linuxDeBaseQuantity').value || 0);
    let linuxExtension1vCPUQuantity = parseInt(document.getElementById('linuxExtension1vCPUQuantity').value || 0);
    let linuxExtension1RAMQuantity = parseInt(document.getElementById('linuxExtension1RAMQuantity').value || 0);
    let linuxExtension50DiskQuantity = parseInt(document.getElementById('linuxExtension50DiskQuantity').value || 0);
    let linuxExtension1vCPUUnitPrice= 4;
    let linuxExtension1RAMUnitPrice = 2;
    let linuxExtension50DiskUnitPrice = 4;
    let linuxDeBaseUnitPrice = 20;
    let linuxDeBaseRecurringCost = 0; // Ajoutez la valeur des frais récurrents mensuels ici pour l'option Linux de base
    let linuxExtension1vCPURecurringCost = 0; 
    let linuxExtension1RAMRecurringCost = 0;
    let linuxExtension50DiskRecurringCost = 0;
    devis += "<tr><td rowspan='4' style='font-weight: bold; vertical-align: top;'>Machine Virtuelle - Linux</td><td>VM de base (2vCPU, RAM 4Go, 50Go disque)</td><td class='align-right'>" + linuxDeBaseQuantity + "</td><td class='align-right'>" + linuxDeBaseUnitPrice + ",00 €</td><td class='align-right'>" + linuxDeBaseRecurringCost + ",00 €</td></tr>";
    devis += "<tr><td>Extension 1vCPU</td><td class='align-right'>" + linuxExtension1vCPUQuantity + "</td><td class='align-right'>" + linuxExtension1vCPUUnitPrice + ",00 €</td><td class='align-right'>" + linuxExtension1vCPURecurringCost + ",00 €</td></tr>";
    devis += "<tr><td>Extension 1Go de RAM</td><td class='align-right'>" + linuxExtension1RAMQuantity + "</td><td class='align-right'>" + linuxExtension1RAMUnitPrice + ",00 €</td><td class='align-right'>" + linuxExtension1RAMRecurringCost + ",00 €</td></tr>";
    devis += "<tr><td>Extension 50Go de disque</td><td class='align-right'>" + linuxExtension50DiskQuantity + "</td><td class='align-right'>" + linuxExtension50DiskUnitPrice + ",00 €</td><td class='align-right'>" + linuxExtension50DiskRecurringCost + ",00 €</td></tr>";  }

  devis += "<tr><td style='height: 20px;'>&nbsp;</td><td></td><td></td><td></td><td></td></tr>"; // Espace entre les catégories

  // Génération des options pour la catégorie Machine Virtuelle - Windows Server 2019
  if (document.getElementById('windowsDeBaseCheckbox').checked) {
    let windowsDeBaseQuantity = parseInt(document.getElementById('windowsDeBaseQuantity').value || 0);
    let windowsDeBaseUnitPrice = 32;
    let windowsDeBaseRecurringCost = 0;
  
    let windowsExtension1vCPUQuantity = parseInt(document.getElementById('windowsExtension1vCPUQuantity').value || 0);
    let windowsExtension1vCPUUnitPrice = 11;
    let windowsExtension1vCPURecurringCost = 0;
  
    let windowsExtension1RAMQuantity = parseInt(document.getElementById('windowsExtension1RAMQuantity').value || 0);
    let windowsExtension1RAMUnitPrice = 2;
    let windowsExtension1RAMRecurringCost = 0;
  
    let windowsExtension50DiskQuantity = parseInt(document.getElementById('windowsExtension50DiskQuantity').value || 0);
    let windowsExtension50DiskUnitPrice = 6;
    let windowsExtension50DiskRecurringCost = 0;
  
    devis += "<tr><td rowspan='4' style='font-weight: bold; vertical-align: top;'>Machine Virtuelle - Windows Server 2019</td><td>VM de base (2vCPU, RAM 4Go, 50Go disque)</td><td class='align-right'>" + windowsDeBaseQuantity + "</td><td class='align-right'>" + windowsDeBaseUnitPrice + ",00 €</td><td class='align-right'>" + windowsDeBaseRecurringCost + ",00 €</td></tr>";
    devis += "<tr><td>Extension 1vCPU</td><td class='align-right'>" + windowsExtension1vCPUQuantity + "</td><td class='align-right'>" + windowsExtension1vCPUUnitPrice + ",00 €</td><td class='align-right'>" + windowsExtension1vCPURecurringCost + ",00 €</td></tr>";
    devis += "<tr><td>Extension 1Go de RAM</td><td class='align-right'>" + windowsExtension1RAMQuantity + "</td><td class='align-right'>" + windowsExtension1RAMUnitPrice + ",00 €</td><td class='align-right'>" + windowsExtension1RAMRecurringCost + ",00 €</td></tr>";
    devis += "<tr><td>Extension 50Go de disque</td><td class='align-right'>" + windowsExtension50DiskQuantity + "</td><td class='align-right'>" + windowsExtension50DiskUnitPrice + ",00 €</td><td class='align-right'>" + windowsExtension50DiskRecurringCost + ",00 €</td></tr>";  }

  devis += "<tr><td style='height: 20px;'>&nbsp;</td><td></td><td></td><td></td><td></td></tr>"; // Espace entre les catégories

  // Génération des options pour la catégorie Hébergment sec et connectivité

  if (document.getElementById('hebergementSecConnectiviteOption1Checkbox').checked) {
    let hebergementSecConnectiviteOption1Quantity = parseInt(document.getElementById('hebergementSecConnectiviteOption1Quantity').value || 0);
    let hebergementSecConnectiviteOption1UnitPrice = 1200.00;
    let hebergementSecConnectiviteOption1RecurringCost = 640.00;
  
    devis += "<tr><td style='font-weight: bold;'>Hébergement sec et Connectivité</td><td>Une baie 42 U 800 mm x1070 mm</td><td class='align-right'>" + hebergementSecConnectiviteOption1Quantity + "</td><td class='align-right'>" + hebergementSecConnectiviteOption1UnitPrice + ",00 €</td><td class='align-right'>" + hebergementSecConnectiviteOption1RecurringCost + ",00 €</td></tr>";
  }
  
  if (document.getElementById('hebergementSecConnectiviteRocade1Checkbox').checked) {
    let hebergementSecConnectiviteRocade1Quantity = parseInt(document.getElementById('hebergementSecConnectiviteRocade1Quantity').value || 0);
    let hebergementSecConnectiviteRocade1UnitPrice = 640.00;
    let hebergementSecConnectiviteRocade1RecurringCost = 0;
  
    devis += "<tr><td></td><td>Rocade 1 paire de fibres MMR-Baie</td><td class='align-right'>" + hebergementSecConnectiviteRocade1Quantity + "</td><td class='align-right'>" + hebergementSecConnectiviteRocade1UnitPrice + ",00 €</td><td class='align-right'>" + hebergementSecConnectiviteRocade1RecurringCost + ",00 €</td></tr>";
  }
  
  if (document.getElementById('hebergementSecConnectiviteRocade3Checkbox').checked) {
    let hebergementSecConnectiviteRocade3Quantity = parseInt(document.getElementById('hebergementSecConnectiviteRocade3Quantity').value || 0);
    let hebergementSecConnectiviteRocade3UnitPrice = 960.00;
    let hebergementSecConnectiviteRocade3RecurringCost = 0;
  
    devis += "<tr><td></td><td>Rocade 3 paire de fibres MMR-Baie</td><td class='align-right'>" + hebergementSecConnectiviteRocade3Quantity + "</td><td class='align-right'>" + hebergementSecConnectiviteRocade3UnitPrice + ",00 €</td><td class='align-right'>" + hebergementSecConnectiviteRocade3RecurringCost + ",00 €</td></tr>";
  }
  
  if (document.getElementById('hebergementSecConnectiviteRocade6Checkbox').checked) {
    let hebergementSecConnectiviteRocade6Quantity = parseInt(document.getElementById('hebergementSecConnectiviteRocade6Quantity').value || 0);
    let hebergementSecConnectiviteRocade6UnitPrice = 1280.00;
    let hebergementSecConnectiviteRocade6RecurringCost = 0;
  
    devis += "<tr><td></td><td>Rocade 6 paire de fibres MMR-Baie</td><td class='align-right'>" + hebergementSecConnectiviteRocade6Quantity + "</td><td class='align-right'>" + hebergementSecConnectiviteRocade6UnitPrice + ",00 €</td><td class='align-right'>" + hebergementSecConnectiviteRocade6RecurringCost + ",00 €</td></tr>";
  }
  
  if (document.getElementById('hebergementSecConnectiviteOption2Checkbox').checked) {
    let hebergementSecConnectiviteOption2Quantity = parseInt(document.getElementById('hebergementSecConnectiviteOption2Quantity').value || 0);
    let hebergementSecConnectiviteOption2UnitPrice = 960.00;
    let hebergementSecConnectiviteOption2RecurringCost = 720.00;
  
    devis += "<tr><td></td><td>Emplacement 20 U dans les baies mutualisées</td><td class='align-right'>" + hebergementSecConnectiviteOption2Quantity + "</td><td class='align-right'>" + hebergementSecConnectiviteOption2UnitPrice + ",00 €</td><td class='align-right'>" + hebergementSecConnectiviteOption2RecurringCost + ",00 €</td></tr>";
  }
  
  if (document.getElementById('hebergementSecConnectiviteOption3Checkbox').checked) {
    let hebergementSecConnectiviteOption3Quantity = parseInt(document.getElementById('hebergementSecConnectiviteOption3Quantity').value || 0);
    let hebergementSecConnectiviteOption3UnitPrice = 11760.00;
    let hebergementSecConnectiviteOption3RecurringCost = 0;
  
    devis += "<tr><td></td><td>Liaison activée 10G ou équivalent entre un des 3 POP VONUM</td><td class='align-right'>" + hebergementSecConnectiviteOption3Quantity + "</td><td class='align-right'>" + hebergementSecConnectiviteOption3UnitPrice + ",00 €</td><td class='align-right'>" + hebergementSecConnectiviteOption3RecurringCost + ",00 €</td></tr>";
  }
  
  devis += "<tr><td style='height: 20px;'>&nbsp;</td><td></td><td></td><td></td><td></td></tr>"; // Espace entre les catégories
  
  // Génération des options pour la catégorie Hébergment sec et énergie

  if (document.getElementById('hebergementSecEnergieOption1Checkbox').checked) {
    let hebergementSecEnergieOption1Quantity = parseInt(document.getElementById('hebergementSecEnergieOption1Quantity').value || 0);
    let hebergementSecEnergieOption1UnitPrice = 576.00;
    let hebergementSecEnergieOption1RecuringCost = 0.3208;
  
    devis += "<tr><td style='font-weight: bold;'>Hébergement sec et énergie</td><td>Energie double Feed 220V-32A-7KvA</td><td class='align-right'>" + hebergementSecEnergieOption1Quantity + "</td><td class='align-right'>" + hebergementSecEnergieOption1UnitPrice + ",00 €</td><td class='align-right'>" + hebergementSecEnergieOption1RecuringCost + " € / KwA</td></tr>";
  }

  if (document.getElementById('hebergementSecEnergieOption2Checkbox').checked) {
    let hebergementSecEnergieOption2Quantity = parseInt(document.getElementById('hebergementSecEnergieOption2Quantity').value || 0);
    let hebergementSecEnergieOption2UnitPrice = 1160.00;
    let hebergementSecEnergieOption2RecuringCost = 0;
  
    devis += "<tr><td></td><td>Bandeau électrique manageable</td><td class='align-right'>" + hebergementSecEnergieOption2Quantity + "</td><td class='align-right'>" + hebergementSecEnergieOption2UnitPrice + ",00 €</td><td class='align-right'>" + hebergementSecEnergieOption2RecuringCost + ",00 €</td></tr>";
  }
  if (document.getElementById('hebergementSecEnergieOption3Checkbox').checked) {
    let hebergementSecEnergieOption3Quantity = parseInt(document.getElementById('hebergementSecEnergieOption3Quantity').value || 0);
    let hebergementSecEnergieOption3UnitPrice = 576.00;
    let hebergementSecEnergieOption3RecuringCost = 0;
  
    devis += "<tr><td></td><td>Fourniture d’un STS 16A</td><td class='align-right'>" + hebergementSecEnergieOption3Quantity + "</td><td class='align-right'>" + hebergementSecEnergieOption3UnitPrice + ",00 €</td><td class='align-right'>" + hebergementSecEnergieOption3RecuringCost + ",00 €</td></tr>";
  }

  devis += "<tr><td style='height: 20px;'>&nbsp;</td><td></td><td></td><td></td><td></td></tr>"; // Espace entre les catégories

  // Génération des options pour la catégorie Hébergment sec et PRA

  if (document.getElementById('hebergementSecPRAOption1Checkbox').checked) {
    let hebergementSecPRAOption1Quantity = parseInt(document.getElementById('hebergementSecPRAOption1Quantity').value || 0);
    let hebergementSecPRAOption1UnitPrice = "SBE*";
    let hebergementSecPRAOption1RecuringCost = 0;
  
    devis += "<tr><td style='font-weight: bold;'>Hébergement sec et PRA</td><td>Mise à disposition d’une salle de replie</td><td class='align-right'>" + hebergementSecPRAOption1Quantity + "</td><td class='align-right'>" + hebergementSecPRAOption1UnitPrice + "</td><td class='align-right'>" + hebergementSecPRAOption1RecuringCost + "</td></tr>";
  }

  if (document.getElementById('hebergementSecPRAOption2Checkbox').checked) {
    let hebergementSecPRAOption2Quantity = parseInt(document.getElementById('hebergementSecPRAOption2Quantity').value || 0);
    let hebergementSecPRAOption2UnitPrice = "SBE*"
    let hebergementSecPRAOption2RecuringCost = 0;
  
    devis += "<tr><td></td><td>Mise à disposition d’une salle de réunion</td><td class='align-right'>" + hebergementSecPRAOption2Quantity + "</td><td class='align-right'>" + hebergementSecPRAOption2UnitPrice + "</td><td class='align-right'>" + hebergementSecPRAOption2RecuringCost + "</td></tr>";
  }

  if (document.getElementById('hebergementSecPRAOption3Checkbox').checked) {
    let hebergementSecPRAOption3Quantity = parseInt(document.getElementById('hebergementSecPRAOption3Quantity').value || 0);
    let hebergementSecPRAOption3UnitPrice = 148;
    let hebergementSecPRAOption3RecuringCost = 0;
  
    devis += "<tr><td></td><td>Mise à disposition de postes de travail</td><td class='align-right'>" + hebergementSecPRAOption3Quantity + "</td><td class='align-right'>" + hebergementSecPRAOption3UnitPrice + ",00 €</td><td class='align-right'>" + hebergementSecPRAOption3RecuringCost + ",00 €</td></tr>";
  } 

  devis += "<tr><td style='height: 20px;'>&nbsp;</td><td></td><td></td><td></td><td></td></tr>"; // Espace entre les catégories


   // Génération des options pour la catégorie Infrastructure as a Service (IaaS)

   if (document.getElementById('infrastructureAsAServiceOption1Checkbox').checked) {
    let infrastructureAsAServiceOption1Quantity = parseInt(document.getElementById('infrastructureAsAServiceOption1Quantity').value || 0);
    let infrastructureAsAServiceOption1UnitPrice = 800;
    let infrastructureAsAServiceOption1RecuringCost = 0;
  
    devis += "<tr><td style='font-weight: bold;'>Infrastructure as a Service (IaaS)</td><td>Serveur Hote de Virtualisation dédié - gros</td><td class='align-right'>" + infrastructureAsAServiceOption1Quantity + "</td><td class='align-right'>" + infrastructureAsAServiceOption1UnitPrice + ", 00 €</td><td class='align-right'>" + infrastructureAsAServiceOption1RecuringCost + ",00 €</td></tr>";
  }
  
  if (document.getElementById('infrastructureAsAServiceOption2Checkbox').checked) {
    let infrastructureAsAServiceOption2Quantity = parseInt(document.getElementById('infrastructureAsAServiceOption2Quantity').value || 0);
    let infrastructureAsAServiceOption2UnitPrice = 210;
    let infrastructureAsAServiceOption2RecuringCost = 0;
  
    devis += "<tr><td></td><td>Serveur Hote de Virtualisation dédié - petit</td><td class='align-right'>" + infrastructureAsAServiceOption2Quantity + "</td><td class='align-right'>" + infrastructureAsAServiceOption2UnitPrice + ",00 €</td><td class='align-right'>" + infrastructureAsAServiceOption2RecuringCost + ",00 €</td></tr>";
  }
  
  if (document.getElementById('infrastructureAsAServiceOption3Checkbox').checked) {
    let infrastructureAsAServiceOption3Quantity = parseInt(document.getElementById('infrastructureAsAServiceOption3Quantity').value || 0);
    let infrastructureAsAServiceOption3UnitPrice = 40;
    let infrastructureAsAServiceOption3RecuringCost = 0;
  
    devis += "<tr><td></td><td>Espace de stockage sur SAN 500Go</td><td class='align-right'>" + infrastructureAsAServiceOption3Quantity + "</td><td class='align-right'>" + infrastructureAsAServiceOption3UnitPrice + ",00 €</td><td class='align-right'>" + infrastructureAsAServiceOption3RecuringCost + ",00 €</td></tr>";
  }
  
  if (document.getElementById('infrastructureAsAServiceOption4Checkbox').checked) {
    let infrastructureAsAServiceOption4Quantity = parseInt(document.getElementById('infrastructureAsAServiceOption4Quantity').value || 0);
    let infrastructureAsAServiceOption4UnitPrice = 80;
    let infrastructureAsAServiceOption4RecuringCost = 0;
  
    devis += "<tr><td></td><td>Espace de stockage sur SAN 1To</td><td class='align-right'>" + infrastructureAsAServiceOption4Quantity + "</td><td class='align-right'>" + infrastructureAsAServiceOption4UnitPrice + ",00 €</td><td class='align-right'>" + infrastructureAsAServiceOption4RecuringCost + ",00 €</td></tr>";
  }
  
  if (document.getElementById('infrastructureAsAServiceOption5Checkbox').checked) {
    let infrastructureAsAServiceOption5Quantity = parseInt(document.getElementById('infrastructureAsAServiceOption5Quantity').value || 0);
    let infrastructureAsAServiceOption5UnitPrice = 300;
    let infrastructureAsAServiceOption5RecuringCost = 0;
  
    devis += "<tr><td></td><td>Espace de stockage sur SAN 5To</td><td class='align-right'>" + infrastructureAsAServiceOption5Quantity + "</td><td class='align-right'>" + infrastructureAsAServiceOption5UnitPrice + ",00 €</td><td class='align-right'>" + infrastructureAsAServiceOption5RecuringCost + ",00 €</td></tr>";
  }
  
  if (document.getElementById('infrastructureAsAServiceOption6Checkbox').checked) {
    let infrastructureAsAServiceOption6Quantity = parseInt(document.getElementById('infrastructureAsAServiceOption6Quantity').value || 0);
    let infrastructureAsAServiceOption6UnitPrice = 500;
    let infrastructureAsAServiceOption6RecuringCost = 0;
  
    devis += "<tr><td></td><td>Espace de stockage sur SAN 10To</td><td class='align-right'>" + infrastructureAsAServiceOption6Quantity + "</td><td class='align-right'>" + infrastructureAsAServiceOption6UnitPrice + ",00 €</td><td class='align-right'>" + infrastructureAsAServiceOption6RecuringCost + ",00 €</td></tr>";
  }
  
  devis += "<tr><td style='height: 20px;'>&nbsp;</td><td></td><td></td><td></td><td></td></tr>"; // Espace entre les catégories
  
  // Génération des options pour la catégorie Sauvegarde
  
  if (document.getElementById('sauvegardeOption1Checkbox').checked) {
    let sauvegardeOption1Quantity = parseInt(document.getElementById('sauvegardeOption1Quantity').value || 0);
    let sauvegardeOption1UnitPrice = 5;
    let sauvegardeOption1RecuringCost = 0;
  
    devis += "<tr><td style='font-weight: bold;'>Sauvegarde</td><td>Espace sur NAS sauvegarde - 500Go</td><td class='align-right'>" + sauvegardeOption1Quantity + "</td><td class='align-right'>" + sauvegardeOption1UnitPrice +",00 €</td><td class='align-right'>" + sauvegardeOption1RecuringCost + ",00 €</td></tr>";
  }
  
  if (document.getElementById('sauvegardeOption2Checkbox').checked) {
    let sauvegardeOption2Quantity = parseInt(document.getElementById('sauvegardeOption2Quantity').value || 0);
    let sauvegardeOption2UnitPrice = 8;
    let sauvegardeOption2RecuringCost = 0;
  
    devis += "<tr><td></td><td>Espace sur NAS sauvegarde - 1To</td><td class='align-right'>" + sauvegardeOption2Quantity + "</td><td class='align-right'>" + sauvegardeOption2UnitPrice + ",00 €</td><td class='align-right'>" + sauvegardeOption2RecuringCost + ",00 €</td></tr>";
  }
  
  if (document.getElementById('sauvegardeOption3Checkbox').checked) {
    let sauvegardeOption3Quantity = parseInt(document.getElementById('sauvegardeOption3Quantity').value || 0);
    let sauvegardeOption3UnitPrice = 70;
    let sauvegardeOption3RecuringCost = 0;
  
    devis += "<tr><td></td><td>Espace sur NAS sauvegarde - 10To</td><td class='align-right'>" + sauvegardeOption3Quantity + "</td><td class='align-right'>" + sauvegardeOption3UnitPrice + ",00 €</td><td class='align-right'>" + sauvegardeOption3RecuringCost + ",00 €</td></tr>";
  }
  
  if (document.getElementById('sauvegardeOption4Checkbox').checked) {
    let sauvegardeOption4Quantity = parseInt(document.getElementById('sauvegardeOption4Quantity').value || 0);
    let sauvegardeOption4UnitPrice = 10;
    let sauvegardeOption4RecuringCost = 0;
  
    devis += "<tr><td></td><td>Sauvegarde managée avec agent - 500Go</td><td class='align-right'>" + sauvegardeOption4Quantity + "</td><td class='align-right'>" + sauvegardeOption4UnitPrice + ",00 €</td><td class='align-right'>" + sauvegardeOption4RecuringCost + ",00 €</td></tr>";
  }
  
  if (document.getElementById('sauvegardeOption5Checkbox').checked) {
    let sauvegardeOption5Quantity = parseInt(document.getElementById('sauvegardeOption5Quantity').value || 0);
    let sauvegardeOption5UnitPrice = 15;
    let sauvegardeOption5RecuringCost = 0;
  
    devis += "<tr><td></td><td>Sauvegarde managée avec agent - 1To</td><td class='align-right'>" + sauvegardeOption5Quantity + "</td><td class='align-right'>" + sauvegardeOption5UnitPrice + ",00 €</td><td class='align-right'>" + sauvegardeOption5RecuringCost + ",00 €</td></tr>";
  }
  
  if (document.getElementById('sauvegardeOption6Checkbox').checked) {
    let sauvegardeOption6Quantity = parseInt(document.getElementById('sauvegardeOption6Quantity').value || 0);
    let sauvegardeOption6UnitPrice = 50;
    let sauvegardeOption6RecuringCost = 0;
  
    devis += "<tr><td></td><td>Sauvegarde managée avec agent - 5To</td><td class='align-right'>" + sauvegardeOption6Quantity + "</td><td class='align-right'>" + sauvegardeOption6UnitPrice + ",00 €</td><td class='align-right'>" + sauvegardeOption6RecuringCost + ",00 €</td></tr>";
  }
  
  if (document.getElementById('sauvegardeOption7Checkbox').checked) {
    let sauvegardeOption7Quantity = parseInt(document.getElementById('sauvegardeOption7Quantity').value || 0);
    let sauvegardeOption7UnitPrice = 95;
    let sauvegardeOption7RecuringCost = 0;
  
    devis += "<tr><td></td><td>Sauvegarde managée avec agent - 10To</td><td class='align-right'>" + sauvegardeOption7Quantity + "</td><td class='align-right'>" + sauvegardeOption7UnitPrice + ",00 €</td><td class='align-right'>" + sauvegardeOption7RecuringCost + ",00 €</td></tr>";
  }
  

  devis += "<tr><td style='height: 20px;'>&nbsp;</td><td></td><td></td><td></td><td></td></tr>"; // Espace entre les catégories


   // Génération des options pour la catégorie Services

   if (document.getElementById('servicesOption1Checkbox').checked) {
    let servicesOption1Quantity = parseInt(document.getElementById('servicesOption1Quantity').value || 0);
    let servicesOption1UnitPrice = 20;
    let servicesOption1RecuringCost = 0;
    
    devis += "<tr><td style='font-weight: bold;'>Services</td><td>Firewall as a Service</td><td class='align-right'>" + servicesOption1Quantity + "</td><td class='align-right'>" + servicesOption1UnitPrice + ",00 €</td><td class='align-right'>" + servicesOption1RecuringCost + ",00 €</td></tr>";

  }

  if (document.getElementById('servicesOption2Checkbox').checked) {
    let servicesOption2Quantity = parseInt(document.getElementById('servicesOption2Quantity').value || 0);
    let servicesOption2UnitPrice = 15;
    let servicesOption2RecuringCost = 0;

    devis += "<tr><td></td><td>LoadBalancing as a Service niveau 3</td><td class='align-right'>" + servicesOption2Quantity + "</td><td class='align-right'>" + servicesOption2UnitPrice + ",00 €</td><td class='align-right'>" + servicesOption2RecuringCost + ",00 €</td></tr>"; 

  } 

  if (document.getElementById('servicesOption3Checkbox').checked) {
    let servicesOption3Quantity = parseInt(document.getElementById('servicesOption3Quantity').value || 0);
    let servicesOption3UnitPrice = 20;
    let servicesOption3RecuringCost = 0;

    devis += "<tr><td></td><td>LoadBalancing as a Service niveau 7</td><td class='align-right'>" + servicesOption3Quantity + "</td><td class='align-right'>" + servicesOption3UnitPrice + ",00 €</td><td class='align-right'>" + servicesOption3RecuringCost + ",00 €</td></tr>"; 

  } 

  if (document.getElementById('servicesOption4Checkbox').checked) {
    let servicesOption4Quantity = parseInt(document.getElementById('servicesOption4Quantity').value || 0);
    let servicesOption4UnitPrice = 30;
    let servicesOption4RecuringCost = 0;

    devis += "<tr><td></td><td>Haute Disponibilité VM Actif / Passif</td><td class='align-right'>" + servicesOption4Quantity + "</td><td class='align-right'>" + servicesOption4UnitPrice + ",00 €</td><td class='align-right'>" + servicesOption4RecuringCost + ",00 €</td></tr>"; 

  } 

  if (document.getElementById('servicesOption5Checkbox').checked) {
    let servicesOption5Quantity = parseInt(document.getElementById('servicesOption5Quantity').value || 0);
    let servicesOption5UnitPrice = 15;
    let servicesOption5RecuringCost = 0;

    devis += "<tr><td></td><td>QoS 3 niveaux (Temps Réel / Métier / Autre)</td><td class='align-right'>" + servicesOption5Quantity + "</td><td class='align-right'>" + servicesOption5UnitPrice + ",00 €</td><td class='align-right'>" + servicesOption5RecuringCost + ",00 €</td></tr>"; 

  } 

  if (document.getElementById('servicesOption6Checkbox').checked) {
    let servicesOption6Quantity = parseInt(document.getElementById('servicesOption6Quantity').value || 0);
    let servicesOption6UnitPrice = 2;
    let servicesOption6RecuringCost = 0;

    devis += "<tr><td></td><td>Nom de domaine (.com, .fr, .net, .org)</td><td class='align-right'>" + servicesOption6Quantity + "</td><td class='align-right'>" + servicesOption6UnitPrice + ",00 €</td><td class='align-right'>" + servicesOption6RecuringCost + ",00 €</td></tr>"; 

  } 

  if (document.getElementById('servicesOption7Checkbox').checked) {
    let servicesOption7Quantity = parseInt(document.getElementById('servicesOption7Quantity').value || 0);
    let servicesOption7UnitPrice = 1;
    let servicesOption7RecuringCost = 0;

    devis += "<tr><td></td><td>Boite email simple 10Go</td><td class='align-right'>" + servicesOption7Quantity + "</td><td class='align-right'>" + servicesOption7UnitPrice + ",00 € / boîte</td><td class='align-right'>" + servicesOption7RecuringCost + ",00 €</td></tr>"; 

  } 

  if (document.getElementById('servicesOption8Checkbox').checked) {
    let servicesOption8Quantity = parseInt(document.getElementById('servicesOption8Quantity').value || 0);
    let servicesOption8UnitPrice = 5;
    let servicesOption8RecuringCost = 0;

    devis += "<tr><td></td><td>Boite email collaborative</td><td class='align-right'>" + servicesOption8Quantity + "</td><td class='align-right'>" + servicesOption8UnitPrice + ",00 € / boîte</td><td class='align-right'>" + servicesOption8RecuringCost + ",00 €</td></tr>"; 

  } 

  if (document.getElementById('servicesOption9Checkbox').checked) {
    let servicesOption9Quantity = parseInt(document.getElementById('servicesOption9Quantity').value || 0);
    let servicesOption9UnitPrice = 5;
    let servicesOption9RecuringCost = 0;

    devis += "<tr><td></td><td>VPN Nomade SSL</td><td class='align-right'>" + servicesOption9Quantity + "</td><td class='align-right'>" + servicesOption9UnitPrice + ",00 € / compte</td><td class='align-right'>" + servicesOption9RecuringCost + ",00 €</td></tr>"; 

  } 

  if (document.getElementById('servicesOption10Checkbox').checked) {
    let servicesOption10Quantity = parseInt(document.getElementById('servicesOption10Quantity').value || 0);
    let servicesOption10UnitPrice = 20;
    let servicesOption10RecuringCost = 0;

    devis += "<tr><td></td><td>VPN IPSec</td><td class='align-right'>" + servicesOption10Quantity + "</td><td class='align-right'>" + servicesOption10UnitPrice + ",00 € / peer</td><td class='align-right'>" + servicesOption10RecuringCost + ",00 €</td></tr>"; 

  } 

  if (document.getElementById('servicesOption11Checkbox').checked) {
    let servicesOption11Quantity = parseInt(document.getElementById('servicesOption11Quantity').value || 0);
    let servicesOption11UnitPrice = 1;
    let servicesOption11RecuringCost = 0;

    devis += "<tr><td></td><td>Certificat SSL Let's Encrypt</td><td class='align-right'>" + servicesOption11Quantity + "</td><td class='align-right'>" + servicesOption11UnitPrice + ",00 €</td><td class='align-right'>" + servicesOption11RecuringCost + ",00 €</td></tr>"; 

  }

  if (document.getElementById('servicesOption12Checkbox').checked) {
    let servicesOption12Quantity = parseInt(document.getElementById('servicesOption12Quantity').value || 0);
    let servicesOption12UnitPrice = 20;
    let servicesOption12RecuringCost = 0;

    devis += "<tr><td></td><td>4 adresses IPv4 fixe supplémentaires</td><td class='align-right'>" + servicesOption12Quantity + "</td><td class='align-right'>" + servicesOption12UnitPrice + ",00 €</td><td class='align-right'>" + servicesOption12RecuringCost + ",00 €</td></tr>"; 

  }

  if (document.getElementById('servicesOption13Checkbox').checked) {
    let servicesOption13Quantity = parseInt(document.getElementById('servicesOption13Quantity').value || 0);
    let servicesOption13UnitPrice = 19;
    let servicesOption13RecuringCost = 0;

    devis += "<tr><td></td><td>Sonde de trafic</td><td class='align-right'>" + servicesOption13Quantity + "</td><td class='align-right'>" + servicesOption13UnitPrice + ",00 €</td><td class='align-right'>" + servicesOption13RecuringCost + ",00 €</td></tr>"; 

  }

  if (document.getElementById('servicesOption14Checkbox').checked) {
    let servicesOption14Quantity = parseInt(document.getElementById('servicesOption14Quantity').value || 0);
    let servicesOption14UnitPrice = 5;
    let servicesOption14RecuringCost = 0;

    devis += "<tr><td></td><td>Hébergement Web PHP / MySQL (10Go) mutualisé</td><td class='align-right'>" + servicesOption14Quantity + "</td><td class='align-right'>" + servicesOption14UnitPrice + ",00 €</td><td class='align-right'>" + servicesOption14RecuringCost + ",00 €</td></tr>"; 

  }

  if (document.getElementById('servicesOption15Checkbox').checked) {
    let servicesOption15Quantity = parseInt(document.getElementById('servicesOption15Quantity').value || 0);
    let servicesOption15UnitPrice = 20;
    let servicesOption15RecuringCost = 0;

    devis += "<tr><td></td><td>Hébergement Web PHP / MySQL (10Go) dédié</td><td class='align-right'>" + servicesOption15Quantity + "</td><td class='align-right'>" + servicesOption15UnitPrice + ",00 €</td><td class='align-right'>" + servicesOption15RecuringCost + ",00 €</td></tr>"; 

  }

  if (document.getElementById('servicesOption16Checkbox').checked) {
    let servicesOption16Quantity = parseInt(document.getElementById('servicesOption16Quantity').value || 0);
    let servicesOption16UnitPrice = 5;
    let servicesOption16RecuringCost = 0;

    devis += "<tr><td></td><td>Supervision (40 sondes)</td><td class='align-right'>" + servicesOption16Quantity + "</td><td class='align-right'>" + servicesOption16UnitPrice + ",00 €</td><td class='align-right'>" + servicesOption16RecuringCost + ",00 €</td></tr>"; 

  }
  
  if (document.getElementById('servicesOption17Checkbox').checked) {
    let servicesOption17Quantity = parseInt(document.getElementById('servicesOption17Quantity').value || 0);
    let servicesOption17UnitPrice = 5;
    let servicesOption17RecuringCost = 0;

    devis += "<tr><td></td><td>Monitoring (40 graphiques)</td><td class='align-right'>" + servicesOption17Quantity + "</td><td class='align-right'>" + servicesOption17UnitPrice + ",00 €</td><td class='align-right'>" + servicesOption17RecuringCost + ",00 €</td></tr>";

  }

  devis += "<tr><td style='height: 20px;'>&nbsp;</td><td></td><td></td><td></td><td></td></tr>"; // Espace entre les catégories

  devis += "</table>";
  devis += "<div style='text-align: right; margin-top: 20px; border-top: 1px solid black; padding-top: 10px; font-size: 12px;'><strong>Total HT : </strong>" + calculateTotal(totalCost) + " €</div>";
  devis += "<div style='text-align: right;font-size: 12px;'><strong>Total TTC : </strong>" + calculateTotalTTC(totalCost) + " €</div>";
  devis += "<div style='font-size: 10px; margin-top: 10px;'>*FRM : Frais récurrents mensuels</div>"; 
  devis += "<div style='font-size: 10px; margin-top: 10px;'>*SBE : Selon besoin exprimé</div>"; 

  let printWindow = window.open("", "_blank");
  printWindow.document.open();
  printWindow.document.write('<html><head><title>Devis ' + String(devisNumber).padStart(5, '0') + '</title></head><body>');
  printWindow.document.write('<div style="display: flex; align-items: center; justify-content: flex-end;"><img src="/Users/bileltaleb-ahmed/Desktop/Bilel/VONUM/logo.png" alt="Logo" style="max-width: 150px; height: auto;"></div>');
  printWindow.document.write(devis);
  printWindow.document.write('</body></html>');
  printWindow.document.close();

  printWindow.addEventListener('load', function() {
    printWindow.print();
    printWindow.document.close();
  });
}

document.addEventListener('DOMContentLoaded', function() {
  flatpickr('#date', { dateFormat: 'Y-m-d' });
  flatpickr('#echeance', { dateFormat: 'Y-m-d' });
});
