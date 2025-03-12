"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// Import du module readline
const readline = __importStar(require("readline"));
// Classe générique CRUD
class GenericCrud {
    constructor() {
        this.items = [];
    }
    create(item) {
        this.items.push(item);
        return item;
    }
    read() {
        return this.items;
    }
    update(id, updatedItem) {
        const index = this.items.findIndex((item) => item.id === id);
        if (index !== -1) {
            this.items[index] = { ...this.items[index], ...updatedItem };
            return this.items[index];
        }
        return undefined;
    }
    delete(id) {
        const index = this.items.findIndex((item) => item.id === id);
        if (index !== -1) {
            this.items.splice(index, 1);
            return true;
        }
        return false;
    }
}
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
// Instances génériques
const filCrud = new GenericCrud();
const tissuCrud = new GenericCrud();
const boutonCrud = new GenericCrud();
const aiguilleCrud = new GenericCrud();
const categorieCrud = new GenericCrud();
function mainMenu() {
    console.log('\n--- Menu Principal ---');
    console.log('1. Gérer les Fils');
    console.log('2. Gérer les Tissus');
    console.log('3. Gérer les Boutons');
    console.log('4. Gérer les Aiguilles');
    console.log('5. Gérer les Catégories');
    console.log('6. Quitter');
    rl.question('Choisissez une option: ', (choice) => {
        switch (choice) {
            case '1':
                entityMenu(filCrud, 'Fil', ['libelle']);
                break;
            case '2':
                entityMenu(tissuCrud, 'Tissu', ['couleur', 'categorieId', 'quantite']);
                break;
            case '3':
                entityMenu(boutonCrud, 'Bouton', ['type', 'quantite']);
                break;
            case '4':
                entityMenu(aiguilleCrud, 'Aiguille', ['libelle', 'quantite']);
                break;
            case '5':
                entityMenu(categorieCrud, 'Categorie', ['libelle']);
                break;
            case '6':
                console.log('Au revoir!');
                rl.close();
                break;
            default:
                console.log('Option invalide.');
                mainMenu();
                break;
        }
    });
}
function entityMenu(crud, entityName, fields) {
    console.log(`\n--- Menu ${entityName} ---`);
    console.log(`1. Ajouter un ${entityName}`);
    console.log(`2. Afficher les ${entityName}s`);
    console.log(`3. Modifier un ${entityName}`);
    console.log(`4. Supprimer un ${entityName}`);
    console.log('5. Retour');
    rl.question('Choisissez une option: ', (choice) => {
        switch (choice) {
            case '1':
                const item = {};
                rl.question('ID: ', (id) => {
                    item.id = parseInt(id);
                    const askField = (index) => {
                        if (index >= fields.length) {
                            crud.create(item);
                            console.log(`${entityName} ajouté avec succès.`);
                            return entityMenu(crud, entityName, fields);
                        }
                        rl.question(`${fields[index]}: `, (value) => {
                            item[fields[index]] = isNaN(Number(value)) ? value : Number(value);
                            askField(index + 1);
                        });
                    };
                    askField(0);
                });
                break;
            case '2':
                console.log(`Liste des ${entityName}s:`, crud.read());
                entityMenu(crud, entityName, fields);
                break;
            case '3':
                rl.question('ID à modifier: ', (id) => {
                    const updateItem = {};
                    const askUpdateField = (index) => {
                        if (index >= fields.length) {
                            const updated = crud.update(parseInt(id), updateItem);
                            console.log(updated ? `${entityName} mis à jour.` : `${entityName} non trouvé.`);
                            return entityMenu(crud, entityName, fields);
                        }
                        rl.question(`Nouveau ${fields[index]}: `, (value) => {
                            updateItem[fields[index]] = isNaN(Number(value)) ? value : Number(value);
                            askUpdateField(index + 1);
                        });
                    };
                    askUpdateField(0);
                });
                break;
            case '4':
                rl.question('ID à supprimer: ', (id) => {
                    const deleted = crud.delete(parseInt(id));
                    console.log(deleted ? `${entityName} supprimé.` : `${entityName} non trouvé.`);
                    entityMenu(crud, entityName, fields);
                });
                break;
            case '5':
                mainMenu();
                break;
            default:
                console.log('Option invalide.');
                entityMenu(crud, entityName, fields);
                break;
        }
    });
}
mainMenu();
