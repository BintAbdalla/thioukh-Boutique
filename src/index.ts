// Import du module readline
import * as readline from 'readline';

// Interface générique
interface Entity {
  id: number;
}

// Classe générique CRUD
class GenericCrud<T extends Entity> {
  private items: T[] = [];

  create(item: T): T {
    this.items.push(item);
    return item;
  }

  read(): T[] {
    return this.items;
  }

  update(id: number, updatedItem: Partial<T>): T | undefined {
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.items[index] = { ...this.items[index], ...updatedItem };
      return this.items[index];
    }
    return undefined;
  }

  delete(id: number): boolean {
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }
}

// Entités
interface Fil extends Entity { libelle: string; }
interface Tissu extends Entity { couleur: string; categorieId: number; quantite: number; }
interface Bouton extends Entity { type: string; quantite: number; }
interface Aiguille extends Entity { libelle: string; quantite: number; }
interface Categorie extends Entity { libelle: string; }

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Instances génériques
const filCrud = new GenericCrud<Fil>();
const tissuCrud = new GenericCrud<Tissu>();
const boutonCrud = new GenericCrud<Bouton>();
const aiguilleCrud = new GenericCrud<Aiguille>();
const categorieCrud = new GenericCrud<Categorie>();

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
      case '1': entityMenu(filCrud, 'Fil', ['libelle']); break;
      case '2': entityMenu(tissuCrud, 'Tissu', ['couleur', 'categorieId', 'quantite']); break;
      case '3': entityMenu(boutonCrud, 'Bouton', ['type', 'quantite']); break;
      case '4': entityMenu(aiguilleCrud, 'Aiguille', ['libelle', 'quantite']); break;
      case '5': entityMenu(categorieCrud, 'Categorie', ['libelle']); break;
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

function entityMenu<T extends Entity>(crud: GenericCrud<T>, entityName: string, fields: string[]) {
  console.log(`\n--- Menu ${entityName} ---`);
  console.log(`1. Ajouter un ${entityName}`);
  console.log(`2. Afficher les ${entityName}s`);
  console.log(`3. Modifier un ${entityName}`);
  console.log(`4. Supprimer un ${entityName}`);
  console.log('5. Retour');
  rl.question('Choisissez une option: ', (choice) => {
    switch (choice) {
      case '1':
        const item: any = {};
        rl.question('ID: ', (id) => {
          item.id = parseInt(id);
          const askField = (index: number) => {
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
          const updateItem: any = {};
          const askUpdateField = (index: number) => {
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
