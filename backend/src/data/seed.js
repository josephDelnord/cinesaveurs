import dotenv from "dotenv";
import Role from "../models/Role.js";
import User from "../models/User.js";
import Recipe from "../models/Recipe.js";
import Category from "../models/Category.js";
import Comment from "../models/Comment.js";
import Score from "../models/Score.js";
import Status from "../models/Status.js";
import Ingredient from "../models/Ingredient.js";
import Instruction from "../models/Instruction.js";

dotenv.config();

async function seedDatabase() {
  try {
    // Log de débogage
    console.log("Début du seeding");

    // Vérification et suppression de tous les index existants
    const existingIndexes = await Role.collection.indexes();
    console.log("Index existants:", existingIndexes);

    // Supprimer tous les index et les recréer
    await Role.collection.dropIndexes();
    await Role.createIndexes();

    // Vider la base de données
    await Promise.all([
      User.deleteMany({}),
      Recipe.deleteMany({}),
      Category.deleteMany({}),
      Comment.deleteMany({}),
      Score.deleteMany({}),
      Ingredient.deleteMany({}),
      Instruction.deleteMany({}),
      Role.deleteMany({}),
      Status.deleteMany({}),
    ]);

    // Créer des rôles avec gestion des erreurs
    const rolesToCreate = [
      { role_name: "admin" },
      { role_name: "user" },
      { role_name: "guest" },
    ];

    const roles = [];
    for (const roleData of rolesToCreate) {
      try {
        const role = await Role.create(roleData);
        roles.push(role);
        console.log(`Rôle créé : ${role.role_name}`);
      } catch (roleError) {
        console.error(
          `Erreur lors de la création du rôle ${roleData.role_name}:`,
          roleError
        );

        // Si l'erreur est due à un doublon, essayez de trouver ou de mettre à jour
        if (roleError.code === 11000) {
          const existingRole = await Role.findOne({
            role_name: roleData.role_name,
          });
          if (existingRole) {
            console.log(`Rôle ${roleData.role_name} existe déjà`);
            roles.push(existingRole);
          }
        }
      }
    }
    console.log(
      "Rôles créés:",
      roles.map((r) => r.role_name)
    );

    // Créer des statuts
    const status = await Status.create([
      { status_name: "active" },
      { status_name: "inactive" },
      { status_name: "suspended" },
      { status_name: "banned" },
    ]);

    // Créer des utilisateurs avec des données fictives
    const users = await User.create([
      {
        username: "Admin User",
        email: "admin@example.com",
        password: "Password@12345",
        confirmPassword: "Password@12345",
        status: status[0]._id,
        role: roles.find((r) => r.role_name === "admin")._id,
      },
      {
        username: "Guest User",
        email: "guest@example.com",
        password: "Password@12345",
        confirmPassword: "Password@12345",
        status: status[1]._id,
        role: roles.find((r) => r.role_name === "guest")._id,
      },
      {
        username: "Chef Gordon Ramsay",
        email: "gordon@example.com",
        password: "Password@12345",
        confirmPassword: "Password@12345",
        status: status[0]._id,
        role: roles.find((r) => r.role_name === "user")._id,
      },
      {
        username: "Regular User",
        email: "user@example.com",
        password: "Password@12345",
        confirmPassword: "Password@12345",
        status: status[0]._id,
        role: roles.find((r) => r.role_name === "user")._id,
      },
      {
        username: "Alice Dupont",
        email: "alice.dupont@example.com",
        password: "Password@12345",
        confirmPassword: "Password@12345",
        status: status[0]._id,
        role: roles.find((r) => r.role_name === "user")._id,
      },
      {
        username: "Bob Martin",
        email: "bob.martin@example.com",
        password: "Password@12345",
        confirmPassword: "Password@12345",
        status: status[0]._id,
        role: roles.find((r) => r.role_name === "user")._id,
      },
      {
        username: "Claire Lefevre",
        email: "claire.lefevre@example.com",
        password: "Password@12345",
        confirmPassword: "Password@12345",
        status: status[0]._id,
        role: roles.find((r) => r.role_name === "user")._id,
      },
      {
        username: "David Leclerc",
        email: "david.leclerc@example.com",
        password: "Password@12345",
        confirmPassword: "Password@12345",
        status: status[0]._id,
        role: roles.find((r) => r.role_name === "user")._id,
      },
      {
        username: "Eva Durand",
        email: "eva.durand@example.com",
        password: "Password@12345",
        confirmPassword: "Password@12345",
        status: status[0]._id,
        role: roles.find((r) => r.role_name === "user")._id,
      },
      {
        username: "Frank Sorel",
        email: "frank.sorel@example.com",
        password: "Password@12345",
        confirmPassword: "Password@12345",
        status: status[0]._id,
        role: roles.find((r) => r.role_name === "user")._id,
      },
      {
        username: "Jon Snow",
        email: "jonsnow@got.com",
        password: "Password@12345",
        confirmPassword: "Password@12345",
        status: status[0]._id,
        role: roles.find((r) => r.role_name === "user")._id,
      },
      {
        username: "Sherlock Holmes",
        email: "sherlock@bakerstreet.com",
        password: "Password@12345",
        confirmPassword: "Password@12345",
        status: status[1]._id,
        role: roles.find((r) => r.role_name === "user")._id,
      },
      {
        username: "Tony Stark",
        email: "tony.stark@starkindustries.com",
        password: "Password@12345",
        confirmPassword: "Password@12345",
        status: status[1]._id,
        role: roles.find((r) => r.role_name === "user")._id,
      },
    ]);

    // Créer les ingrédients
    const ingredients = await Ingredient.create([
      // 0
      {
        name: "Fond de tarte précuit",
        quantity: 1,
        unit: "pièce",
      },
      // 1
      {
        name: "Fromage à la crème",
        quantity: 255,
        unit: "g",
      },
      // 2
      {
        name: "Jus de citron",
        quantity: 1 / 2,
        unit: "c. à café",
      },
      // 3
      {
        name: "Sucre glace tamisé",
        quantity: 75,
        unit: "g",
      },
      // 4
      {
        name: "Crème fouettée Cool Whip",
        quantity: 255,
        unit: "g",
      },
      // 5
      {
        name: "Crème fouettée maison",
        quantity: 750,
        unit: "ml",
      },
      // 6
      {
        name: "Fraises fraîches",
        quantity: 1,
        unit: "barquette",
      },
      // 7
      {
        name: "Glaçage à la fraise",
        quantity: 300,
        unit: "g",
      },
      // 8
      {
        name: "Feuilles de menthe fraîche",
        quantity_description: "au goût",
        unit: "pièce",
      },
      // 9
      {
        name: "Huile",
        quantity: 15,
        unit: "ml",
      },
      // 10
      {
        name: "Champignons Baby Bella",
        quantity: 227,
        unit: "g",
      },
      // 11
      {
        name: "Farine",
        quantity: 240,
        unit: "g",
      },
      // 12
      {
        name: "Levure chimique",
        quantity: 12,
        unit: "g",
      },
      // 13
      {
        name: "Sel",
        quantity: 5,
        unit: "g",
      },
      // 14
      {
        name: "Poivre concassé",
        quantity: 1,
        unit: "g",
      },
      // 15
      {
        name: "Romarin frais",
        quantity: 1,
        unit: "g",
      },
      // 16
      {
        name: "Beurre",
        quantity: 85,
        unit: "g",
      },
      // 17
      {
        name: "Fromage cheddar râpé",
        quantity: 120,
        unit: "g",
      },
      // 18
      {
        name: "Bacon précuit",
        quantity: 3,
        unit: "tranches",
      },
      // 19
      {
        name: "Œufs",
        quantity: 2,
        unit: "pièce",
      },
      // 20
      {
        name: "Crème épaisse",
        quantity: 120,
        unit: "ml",
      },
      // 21
      {
        name: "Eau",
        quantity: 15,
        unit: "ml",
      },
      // 22
      {
        name: "Pita ou pain plat",
        quantity: 1,
        unit: "pièce",
      },
      // 23
      {
        name: "Sauce/condiment au choix (Hummus, Tahini, Mayonnaise, Yaourt grec, Ranch, Chutney mangue épicé)",
        quantity_description: "au goût",
        unit: "portion",
      },
      // 24
      {
        name: "Tomates Roma",
        quantity: 3,
        unit: "pièce",
      },
      // 25
      {
        name: "Concombre anglais",
        quantity: 1,
        unit: "pièce",
      },
      // 26
      {
        name: "Oignon doux",
        quantity: 1,
        unit: "pièce",
      },
      // 27
      {
        name: "Persil frais",
        quantity_description: "au goût",
        unit: "pièce",
      },
      // 28
      {
        name: "Frites",
        quantity_description: "au goût",
        unit: "portion",
      },
      // 29
      {
        name: "Cornichons",
        quantity_description: "au goût",
        unit: "pièce",
      },
      // 30
      {
        name: "Épaule d'agneau désossée",
        quantity: 1800,
        unit: "g",
      },
      // 31
      {
        name: "Yaourt grec",
        quantity: 120,
        unit: "g",
      },
      // 32
      {
        name: "Jus de citron",
        quantity: 30,
        unit: "ml",
      },
      // 33
      {
        name: "Vinaigre blanc",
        quantity: 30,
        unit: "ml",
      },
      // 34
      {
        name: "Ail haché",
        quantity: 15,
        unit: "g",
      },
      // 35
      {
        name: "Sel",
        quantity: 5,
        unit: "g",
      },
      // 36
      {
        name: "Poivre noir",
        quantity: 1,
        unit: "g",
      },
      // 37
      {
        name: "Cumin",
        quantity: 2,
        unit: "g",
      },
      // 38
      {
        name: "Piment de la Jamaïque",
        quantity: 2,
        unit: "g",
      },
      // 39
      {
        name: "Piment de Cayenne",
        quantity: 1,
        unit: "g",
      },
      // 40
      {
        name: "Huile d'olive",
        quantity: 30,
        unit: "ml",
      },
      // 41
      {
        name: "Mini Cow Tail Caramel Candies ou Cubes de Caramel",
        quantity: 1 / 2,
        unit: "paquet",
      },
      // 42
      {
        name: "CandiQuick (ou chocolat à fondre)",
        quantity: 1,
        unit: "paquet",
      },
      // 43
      {
        name: "Sirop de fraise",
        quantity_description: "au goût",
        unit: "portion",
      },
      // 44
      {
        name: "Boîte de mélange à gâteau blanc (~15,25oz)",
        quantity: 1,
        unit: "boîte",
      },
      // 45
      {
        name: "Cotton Candy Bleu",
        quantity: 1,
        unit: "paquet (ou contenant)",
      },
      // 46
      {
        name: "Pouding instantané à la vanille au chocolat blanc (~3,5oz)",
        quantity: 1,
        unit: "paquet",
      },
      // 47
      {
        name: "Cool Whip",
        quantity: 4,
        unit: "oz",
      },
      // 48
      {
        name: "Frosting à la crème au beurre blanc",
        quantity_description: "au choix",
        unit: "portion",
      },
      // 49
      {
        name: "Candy Melts Bleu Clair",
        quantity: 3 / 4,
        unit: "tasse",
      },
      // 50
      {
        name: "Candy Melts Bleu Foncé",
        quantity: 3 / 4,
        unit: "tasse",
      },
      // 51
      {
        name: "Candy Melts Noir",
        quantity: 3 / 4,
        unit: "tasse",
      },
      // 52
      {
        name: "EZ-Thin ou autre aidant à tremper les Candy Melts",
        quantity_description: "au besoin",
        unit: "petite quantité",
      },
      // 53
      {
        name: "Dragées perles/sprinkles",
        quantity_description: "au goût",
        unit: "portion",
      },
      // 54
      {
        name: "Beurre",
        quantity: 1,
        unit: "c. à soupe",
      },
      // 55
      {
        name: "Œufs",
        quantity: 2,
        unit: "unité",
      },
      // 56
      {
        name: "Lait",
        quantity: 2,
        unit: "c. à soupe",
      },
      // 57
      {
        name: "Sel et Poivre",
        quantity_description: "au goût",
        unit: "portion",
      },
      // 58
      {
        name: "Ciboules fraîches finement hachées",
        quantity: 1,
        unit: "portion",
      },
      // 59
      {
        name: "Avocat",
        quantity: 1,
        unit: "tranche",
      },
      // 60
      {
        name: "Muffin Anglais",
        quantity: 1,
        unit: "unité",
      },
      // 61
      {
        name: "Tranches de fromage mozzarella",
        quantity: 2,
        unit: "unité",
      },
      // 62
      {
        name: "Sauce spaghetti ou pizza",
        quantity_description: "au goût",
        unit: "portion",
      },
      // 63
      {
        name: "Pepperoni",
        quantity: 2 - 12,
        unit: "pièce",
      },
      // 64
      {
        name: "Olives noires tranchées",
        quantity_description: "au goût",
        unit: "portion",
      },
      // 65
      {
        name: "Beurre doux",
        quantity: 230,
        unit: "g",
      },
      // 66
      {
        name: "Sucre granulé",
        quantity: 100,
        unit: "g",
      },
      // 67
      {
        name: "Sucre brun clair",
        quantity: 50,
        unit: "g",
      },
      // 68
      {
        name: "Jaune d'œuf",
        quantity: 1,
        unit: "pièce",
      },
      // 69
      {
        name: "Extrait de vanille",
        quantity: 7.5,
        unit: "ml",
      },
      // 70
      {
        name: "Farine de blé",
        quantity: 360,
        unit: "g",
      },
      // 71
      {
        name: "Noix de muscade",
        quantity: 0.5,
        unit: "g",
      },
      // 72
      {
        name: "Sel",
        quantity: 2,
        unit: "g",
      },
      // 73
      {
        name: "Confiture de framboise ou de fraise sans morceaux",
        quantity: 150,
        unit: "g",
      },
      // 74
      {
        name: "Sof'ella Pumpkin Spice Pot de Crème",
        quantity: 1,
        unit: "paquet",
      },
      // 75
      {
        name: "Lait entier",
        quantity: 480,
        unit: "ml",
      },
      // 76
      {
        name: "Beurre",
        quantity: 1,
        unit: "c. à soupe",
      },
      // 77
      {
        name: "Beurre de cacahuète",
        quantity: 1 / 4,
        unit: "tasse",
      },
      // 78
      {
        name: "Sucre glace tamisé",
        quantity: 1 / 3,
        unit: "tasse + 2 c. à soupe",
      },
      // 79
      {
        name: "Pépites de chocolat",
        quantity: 1,
        unit: "tasse",
      },
      // 80
      {
        name: "Aide à tremper (facultatif)",
        quantity_description: "un peu",
        unit: "au besoin",
      },
    ]);

    // Créer des instructions
    const instructions = await Instruction.create([
      //0
      {
        step_number: 1,
        instruction:
          "Préparer la crème : Mélangez le fromage à la crème, le jus de citron et le sucre glace jusqu'à obtenir une texture lisse. Incorporez délicatement la crème fouettée. Versez la moitié dans le fond de tarte refroidi (scellez avec de la confiture d'abricot chaude si souhaité).",
      },
      //1
      {
        step_number: 2,
        instruction:
          "Ajouter les fraises : Coupez les fraises (en réservant quelques-unes) et disposez-les sur la crème en une couche uniforme. Ajoutez une fine couche de glaçage, puis recouvrez avec le reste de la crème. Placez au congélateur 10-15 min.",
      },
      //2
      {
        step_number: 3,
        instruction:
          "Finition : Étalez une dernière couche de glaçage rouge vif. Décorez avec une fraise coupée au centre et des feuilles de menthe. Réfrigérez au moins 1 heure (idéalement toute une nuit).",
      },
      //3
      {
        step_number: 4,
        instruction:
          "Servir : Décorez chaque part avec une fraise et des feuilles de menthe.",
      },
      //4
      {
        step_number: 1,
        instruction:
          "Préchauffer le four à 230°C. Faire revenir les champignons dans l'huile pendant 3 minutes, puis les égoutter sur du papier absorbant.",
      },
      //5
      {
        step_number: 2,
        instruction:
          "Mélanger la farine, la levure, le sel, le poivre et le romarin. Ajouter le beurre, puis le fromage râpé.",
      },
      //6
      {
        step_number: 3,
        instruction:
          "Battre 1 œuf avec la crème, puis mélanger à la pâte avec les champignons et le bacon.",
      },
      //7
      {
        step_number: 4,
        instruction:
          "Former une boule, puis l'étaler en un disque de 15 cm. Couper en 6 à 8 parts et placer sur une plaque de cuisson.",
      },
      //8
      {
        step_number: 5,
        instruction:
          "Badigeonner les scones avec l'œuf battu, saupoudrer de fromage râpé et ajouter une tranche de champignon sur chaque scone.",
      },
      //9
      {
        step_number: 6,
        instruction:
          "Cuire au four pendant 12-15 minutes, jusqu'à ce qu'ils soient dorés. Servir avec du beurre.",
      },
      //10
      {
        step_number: 1,
        instruction:
          "Découper la viande en morceaux de 8-10 cm d'épaisseur. Mélanger tous les ingrédients sauf l'huile et verser sur la viande. Ajouter l'huile et couvrir de film plastique et de papier d'aluminium. Laisser mariner au réfrigérateur 24 heures.",
      },
      //11
      {
        step_number: 2,
        instruction:
          "Préchauffer le four à 130°C. Retirer le film plastique et recouvrir la viande de papier d'aluminium. Placer au four pendant environ 2 heures.",
      },
      //12
      {
        step_number: 3,
        instruction:
          "Faire chauffer une poêle ou un grill. Faire saisir la viande des deux côtés jusqu'à ce qu'elle soit dorée et légèrement croustillante, environ 1 à 2 minutes.",
      },
      //13
      {
        step_number: 4,
        instruction:
          "Cuire les frites comme indiqué sur l'emballage. Réchauffer les pains pita ou le pain plat au micro-ondes pendant environ 30 secondes.",
      },
      //14
      {
        step_number: 5,
        instruction:
          "Étaler la sauce de votre choix sur le pain. Découper la viande en tranches fines et les ajouter sur le pain.",
      },
      //15
      {
        step_number: 6,
        instruction:
          "Ajouter des tranches de tomate, concombre, oignon et persil. Vous pouvez aussi ajouter des frites et des cornichons dans le sandwich.",
      },
      //16
      {
        step_number: 7,
        instruction:
          "Assaisonner selon votre goût et plier le pain pour former le sandwich. Déguster !",
      },
      //17
      {
        step_number: 1,
        instruction:
          "Étirez et torsadez les bonbons au caramel jusqu'à ce qu'ils aient environ 6 cm de long et 1 cm de diamètre. Enfoncez un cure-dent à une extrémité de chaque morceau, en laissant assez de cure-dent pour pouvoir le tenir, puis placez les bonbons sur une grande feuille de papier parchemin.",
      },
      //18
      {
        step_number: 2,
        instruction:
          "Faites fondre le CandiQuick selon les instructions du paquet et versez-le dans un verre haut (si vous utilisez des pépites de chocolat, faites-les fondre par incréments de 30 secondes au micro-ondes ou au bain-marie). Tenez les bonbons au caramel par les cure-dents et trempez-les un par un dans le chocolat fondu, en tapotant légèrement pour laisser l'excédent tomber, puis placez-les à nouveau sur le papier parchemin. Après avoir trempé quelques bonbons, faites des marques en diagonale sur leur surface avec le cure-dent pour créer un effet bois. Continuez à tremper et marquer jusqu'à ce que tous les bonbons soient sur le parchemin. Laissez-les durcir complètement.",
      },
      //19
      {
        step_number: 3,
        instruction:
          "Prenez un bonbon trempé par son cure-dent et maintenez-le horizontalement. Utilisez les ciseaux de cuisine pour couper l'extrémité sans cure-dent en biais, créant ainsi l'aspect pointu d'un stake. Coupez également tout excédent de chocolat sur les côtés du bonbon qui pourrait s'être étalé après le trempage. Placez le bonbon terminé sur votre plat de service et retirez le cure-dent. Servez avec du sirop de fraise optionnel.",
      },
      //20
      {
        step_number: 1,
        instruction:
          "Préparez le pouding et laissez-le refroidir selon les instructions sur le paquet. Incorporez la crème fouettée jusqu'à ce que le mélange soit bien combiné et aéré. Mettez-le au réfrigérateur jusqu'à ce qu'il soit prêt à être utilisé.",
      },
      //21
      {
        step_number: 2,
        instruction:
          "Préparez les cupcakes dans des caissettes blanches selon les instructions du paquet de mélange à gâteau. Laissez-les refroidir complètement et découpez délicatement le centre des cupcakes, environ à la taille d'un quart, sans aller jusqu'au fond. Réservez les morceaux découpés pour plus tard. Préparez le frosting si vous ne l'achetez pas tout fait.",
      },
      //22
      {
        step_number: 3,
        instruction:
          "Tapissez un grand plateau de papier parchemin. Faites fondre les candy melts noirs dans un bol allant au micro-ondes en les chauffant par incréments de 30 secondes, en remuant après chaque chauffe, jusqu'à ce qu'ils soient complètement fondus (ajoutez l'aide à tremper si vous en utilisez).",
      },
      //23
      {
        step_number: 4,
        instruction:
          'Versez le chocolat fondu dans un sac de décoration en plastique ou une bouteille et déposez plusieurs segments de ligne d\'environ 1/4" de large x 1 1/2" de long sur le papier parchemin, autant que de cupcakes. Ce seront les corps de vos papillons. Laissez durcir.',
      },
      //24
      {
        step_number: 5,
        instruction:
          'Répétez le processus de fonte avec les candy melts bleu foncé et bleu clair. Avec le bleu foncé, formez un "ᗺ" et un "ᗷ" pour chaque cupcake (vous pouvez les rendre plus pointus si vous le souhaitez). Ce seront les contours des ailes du papillon.',
      },
      //25
      {
        step_number: 6,
        instruction:
          "Ajoutez une fine couche de bleu clair sur chaque contour d'aile et faites tourbillonner un peu de bleu foncé avec un cure-dent (vous pouvez voir sur les photos que j'ai essayé différentes façons de décorer les ailes, mais j'aime le tourbillon de bleu foncé dans le bleu clair le plus). Vous pouvez aussi utiliser le cure-dent pour dessiner un motif en spirale dans le bleu clair après qu'il se soit un peu solidifié. Laissez durcir complètement les ailes, puis retirez-les délicatement du papier.",
      },
      //26
      {
        step_number: 7,
        instruction:
          "Remplissez un sac en plastique avec le mélange de pouding et crème fouettée et découpez un coin. Pochez le mélange dans les centres des cupcakes. Remplissez un autre sac avec le frosting et pochez une fine couche sur chaque cupcake (ou étalez-la simplement avec un couteau à beurre). Placez du coton candy bleu sur chaque cupcake pour couvrir le frosting.",
      },
      //27
      {
        step_number: 8,
        instruction:
          "Note : Si vous souhaitez sauter l'étape du coton candy et éviter sa désintégration, omettez-le et colorez votre frosting en bleu à la place ! Pochez une couche de frosting en forme de nuage sur chaque cupcake, puis continuez l'assemblage des papillons.",
      },
      //28
      {
        step_number: 9,
        instruction:
          "Utilisez de petites gouttes de candy melt pour fixer un corps de papillon noir sur le dessus de chaque cupcake. Placez un cure-dent de chaque côté de chaque segment de candy melt noir (deux cure-dents par cupcake) à un angle de 45º. Un par un, pochez une fine ligne de candy melt noir sur les côtés des segments noirs et placez rapidement une aile bleue de chaque côté, les bords droits dans le candy melt que vous venez de poser, en les inclinant avec les cure-dents. Laissez durcir en place, puis retirez les cure-dents.",
      },
      //29
      {
        step_number: 10,
        instruction:
          "Décorez les cupcakes avec de petites perles en sucre en les fixant avec un peu de candy melt sur un cure-dent. Mangez les cupcakes rapidement car au fil du temps, l'humidité du cupcake fera fondre le coton candy!",
      },
      //30
      {
        step_number: 1,
        instruction:
          "Dans une poêle moyenne à feu moyen, faites fondre le beurre et faites-le tourbillonner pour bien enrober la poêle. Battez les œufs avec le lait jusqu'à ce que les blancs soient complètement cassés, puis ajoutez du sel et du poivre.",
      },
      //31
      {
        step_number: 2,
        instruction:
          "Versez les œufs dans la poêle et utilisez immédiatement une spatule pour pousser l'œuf cuit des bords vers le centre, laissant l'œuf encore liquide remplir les espaces créés. Une fois que l'œuf est presque pris et plus liquide, repliez 2 bords vers le centre et superposez-les (comme un dépliant). Retournez l'omelette avec soin et faites cuire quelques secondes de plus.",
      },
      //32
      {
        step_number: 3,
        instruction:
          "Faites glisser l'omelette sur une assiette et saupoudrez de ciboules finement hachées, ainsi que de sel et de poivre au goût. Servez avec des tranches d'avocat et du pain artisanal croûté, si vous le souhaitez.",
      },
      //33
      {
        step_number: 1,
        instruction:
          "Préchauffez votre four à 350ºF (175ºC). Placez une tranche de mozzarella sur la moitié d'un muffin anglais et faites-le toaster au four sur une plaque jusqu'à ce que le fromage soit fondu.",
      },
      //34
      {
        step_number: 2,
        instruction:
          "Retirez du four et ajoutez de la sauce spaghetti ou pizza sur le fromage fondu, puis étalez-la uniformément. Placez au moins six morceaux de pepperoni (pour une double couche, mettez 12 morceaux !) sur la sauce, puis ajoutez une autre tranche de mozzarella.",
      },
      //35
      {
        step_number: 3,
        instruction:
          "Utilisez un petit emporte-pièce rond pour découper un cercle au centre d'une tranche de pepperoni et placez ce 'O' sur la mozzarella pour créer le goggle. Placez une olive noire coupée au centre du 'O' pour faire l'œil et découpez un autre pepperoni en deux bandes que vous disposerez sur les côtés pour faire les bretelles du goggle.",
      },
      //36
      {
        step_number: 4,
        instruction:
          "Coupez une olive noire en deux pour obtenir une forme en 'U' et placez-la sous le goggle pour faire un sourire. Placez deux ou trois morceaux d'olive noire coupés au-dessus du goggle pour faire les cheveux.",
      },
      //37
      {
        step_number: 5,
        instruction:
          "Mettez la pizza dans le four et faites cuire jusqu'à ce que le fromage fonde autour des bords. Retirez du four et réajustez les morceaux de 'cheveux' en olive noire s'ils ont glissé pendant la cuisson. Dégustez et savourez !",
      },
      //38
      {
        step_number: 1,
        instruction:
          "Préchauffez votre four à 180°C. Dans un grand bol, crémez le beurre à vitesse moyenne, puis ajoutez les deux sucres et mélangez. Ajoutez le jaune d'œuf et l'extrait de vanille et mélangez jusqu'à incorporation complète. Baissez la vitesse et ajoutez la farine, le sel et la noix de muscade, petit à petit, jusqu'à ce que la pâte forme une boule.",
      },
      //39
      {
        step_number: 2,
        instruction:
          "Sur une feuille de papier sulfurisé, étalez environ la moitié de la pâte en une épaisseur de 3 mm. Utilisez un emporte-pièce pour découper des cercles et laissez de l'espace entre chaque cercle. Retirez les chutes de pâte et remettez-les dans la boule de pâte. Utilisez un emporte-pièce plus petit pour découper un cercle au centre de la moitié des biscuits.",
      },
      //40
      {
        step_number: 3,
        instruction:
          "Placez les biscuits découpés sur une plaque de cuisson et faites-les cuire pendant environ 8 minutes, ou jusqu'à ce que les bords commencent à dorer. Laissez refroidir complètement.",
      },
      //41
      {
        step_number: 4,
        instruction:
          "Une fois les biscuits refroidis, étalez une fine couche de confiture sur chaque biscuit entier, en laissant un peu d'espace autour des bords. Posez un biscuit avec le centre découpé sur chaque biscuit garni de confiture et appuyez légèrement.",
      },
      //42
      {
        step_number: 5,
        instruction:
          "Servez les biscuits avec une tasse de thé chaud. Ils sont encore meilleurs le lendemain, après avoir reposé et que la confiture ait bien pris.",
      },
      //43
      {
        step_number: 1,
        instruction:
          "Versez le mélange pour pot de crème et le lait dans une casserole sur feu moyen-élevé. Fouettez jusqu'à ce que le mélange épaississe et commence à frémir. Réduisez le feu et laissez cuire encore 30 secondes. Retirez du feu.",
      },
      //44
      {
        step_number: 2,
        instruction:
          "Versez le mélange dans des ramequins ou des petits verres et laissez reposer à température ambiante jusqu'à ce qu'il atteigne la température ambiante. Ensuite, placez-les au réfrigérateur pendant 1 à 2 heures pour qu'ils prennent.",
      },
      //45
      {
        step_number: 3,
        instruction:
          "Servez avec de la crème fouettée (voir la recette ici) et saupoudrez de noix de muscade sur le dessus.",
      },
      //46
      {
        step_number: 1,
        instruction:
          "Faire fondre le beurre et le beurre de cacahuète dans une casserole à feu doux. Ajouter le sucre glace et mélanger jusqu'à obtenir une texture lisse.",
      },
      //47
      {
        step_number: 2,
        instruction:
          "Former des boules avec le mélange de beurre de cacahuète, les envelopper dans du film plastique et les placer au congélateur pendant 3 minutes.",
      },
      //48
      {
        step_number: 3,
        instruction:
          "Faire fondre le chocolat au micro-ondes par intervalles de 30 secondes, puis ajouter un peu d'huile ou de Crisco pour rendre le chocolat plus fluide.",
      },
      //49
      {
        step_number: 4,
        instruction:
          "Verser une petite quantité de chocolat fondu dans chaque moule, tapoter le moule pour répartir uniformément le chocolat, puis laisser durcir.",
      },
      //50
      {
        step_number: 5,
        instruction:
          "Placer un petit morceau de mélange de beurre de cacahuète au centre de chaque cavité, puis recouvrir avec le reste de chocolat fondu. Laisser durcir au moins 30 minutes.",
      },
      //51
      {
        step_number: 6,
        instruction:
          "Démouler délicatement les bonbons et les placer dans des caissettes ou des petites coupelles si nécessaire.",
      },
    ]);

    // Créer des catégories de recettes
    const categories = await Category.create([
      { name: "Entrées" },
      { name: "Plats principaux" },
      { name: "Desserts" },
      { name: "Boissons" },
    ]);

    // Créer des recettes avec des données fictives
    const recipes = await Recipe.create([
      {
        title: "Tarte Royale de Princesse Chewing-Gum",
        description:
          "Un dessert royal inspiré des aventures de Finn et Jake, cette tarte parfaite célèbre la délicatesse sucrée de la Princesse Chewing-Gum, sans potion paralysante, mais pleine de saveurs mémorables !",
        anecdote:
          'Recette de tarte inspirée de la Princesse Chewing-Gum dans "Adventure Time"',
        ingredients: [
          ingredients[0]._id,
          ingredients[1]._id,
          ingredients[2]._id,
          ingredients[3]._id,
          ingredients[4]._id,
          ingredients[5]._id,
          ingredients[6]._id,
          ingredients[7]._id,
          ingredients[8]._id,
        ],
        instructions: [
          instructions[0]._id,
          instructions[1]._id,
          instructions[2]._id,
          instructions[3]._id,
        ],
        source: "Adventure Time",
        category: [categories[2]._id],
        image: "/img1.webp",
      },
      {
        title: "Scones aux Champignons du Pays des Merveilles",
        description:
          "Ces scones savoureux inspirés du célèbre pays d'Alice sont faits de champignons Bella, de bacon et de fromage cheddar, parfaits pour un goûter royal. Ajoutez une touche de poivre et de bacon si vous le souhaitez !",
        anecdote:
          "Recette de scones aux champignons du Pays des Merveilles, un délice pour les petits et les grands !",
        ingredients: [
          ingredients[9]._id,
          ingredients[10]._id,
          ingredients[11]._id,
          ingredients[12]._id,
          ingredients[13]._id,
          ingredients[14]._id,
          ingredients[15]._id,
          ingredients[16]._id,
          ingredients[17]._id,
          ingredients[18]._id,
          ingredients[19]._id,
          ingredients[20]._id,
          ingredients[21]._id,
        ],
        instructions: [
          instructions[4]._id,
          instructions[5]._id,
          instructions[6]._id,
          instructions[7]._id,
          instructions[8]._id,
          instructions[9]._id,
        ],
        source: "Alice au Pays des Merveilles",
        category: [categories[1]._id],
        image: "/img2.webp",
      },
      {
        title: "Shawarma",
        description:
          "Un délicieux sandwich à base de viande d'agneau marinée, accompagné de légumes frais, de frites et d'une sauce de votre choix, inspiré de la scène d'\"Avengers\" !",
        anecdote: 'Recette de Shawarma inspirée de la scène d\'"Avengers"',
        ingredients: [
          ingredients[22]._id,
          ingredients[23]._id,
          ingredients[24]._id,
          ingredients[25]._id,
          ingredients[26]._id,
          ingredients[27]._id,
          ingredients[28]._id,
          ingredients[29]._id,
          ingredients[30]._id,
          ingredients[31]._id,
          ingredients[32]._id,
          ingredients[33]._id,
          ingredients[34]._id,
          ingredients[35]._id,
          ingredients[36]._id,
          ingredients[37]._id,
          ingredients[38]._id,
          ingredients[39]._id,
          ingredients[40]._id,
        ],
        instructions: [
          instructions[10]._id,
          instructions[11]._id,
          instructions[12]._id,
          instructions[13]._id,
          instructions[14]._id,
          instructions[15]._id,
          instructions[16]._id,
        ],
        source: "Avengers",
        category: [categories[1]._id],
        image: "/img3.webp",
      },
      {
        title: "Buffy's Chocolate Caramel Stakes",
        description:
          "Des bonbons caramel trempés dans du chocolat, créant l'illusion de stakes pour une soirée thématique Buffy ou vampire !",
        anecdote:
          "Recette de Buffy's Chocolate Caramel Stakes pour une soirée Buffy ou vampire !",
        ingredients: [
          ingredients[41]._id,
          ingredients[42]._id,
          ingredients[43]._id,
        ],
        instructions: [
          instructions[17]._id,
          instructions[18]._id,
          instructions[19]._id,
        ],
        source: "Buffy the Vampire Slayer",
        category: [categories[1]._id],
        image: "/img4.webp",
      },
      {
        title: "Cinderella's Butterfly Cupcakes",
        description:
          'Des cupcakes inspirés par le film "Cinderella" (2015) avec des décorations de papillons et des motifs de nuages.',
        anecdote:
          'Recette de cupcakes inspirés par le film "Cinderella" (2015). Parfait pour une fête de princesse !',
        ingredients: [
          ingredients[44]._id,
          ingredients[45]._id,
          ingredients[46]._id,
          ingredients[47]._id,
          ingredients[48]._id,
          ingredients[49]._id,
          ingredients[50]._id,
          ingredients[51]._id,
          ingredients[52]._id,
          ingredients[53]._id,
        ],
        instructions: [
          instructions[20]._id,
          instructions[21]._id,
          instructions[22]._id,
          instructions[23]._id,
          instructions[24]._id,
          instructions[25]._id,
          instructions[26]._id,
          instructions[27]._id,
          instructions[28]._id,
          instructions[29]._id,
        ],
        source: "Cinderella (2015)",
        category: [categories[2]._id],
        image: "/img5.webp",
      },
      {
        title: "Fisk Omelette",
        description:
          "Un omelette légère inspirée par la scène d'ouverture de \"Daredevil\" S1 EP8, accompagnée de tranches d'avocat et de pain artisanal.",
        anecdote:
          "Recette d'omelette inspirée de la scène d'ouverture de \"Daredevil\" S1 EP8, en particulier à la scène d'ouverture où le héros navigue dans un monde de tensions et de justice. Parfait pour une soirée de cinéma ou de divertissement !",
        ingredients: [
          ingredients[54]._id,
          ingredients[55]._id,
          ingredients[56]._id,
          ingredients[57]._id,
          ingredients[58]._id,
          ingredients[59]._id,
        ],
        instructions: [
          instructions[30]._id,
          instructions[31]._id,
          instructions[32]._id,
        ],
        source: "Daredevil",
        category: [categories[0]._id],
        image: "/img6.webp",
      },
      {
        title: "Mini Minion Pizza",
        description:
          "De petites pizzas sur muffins anglais, inspirées des Minions, avec du fromage mozzarella, du pepperoni et des olives pour créer les visages des Minions.",
        anecdote:
          "es petites pizzas sont parfaites pour une fête à thème Minion ou pour un repas amusant en famille.",
        ingredients: [
          ingredients[60]._id,
          ingredients[61]._id,
          ingredients[62]._id,
          ingredients[63]._id,
          ingredients[64]._id,
        ],
        instructions: [
          instructions[33]._id,
          instructions[34]._id,
          instructions[35]._id,
          instructions[36]._id,
          instructions[37]._id,
        ],
        source: "Fête Minion",
        category: [categories[1]._id],
        image: "/img7.webp",
      },
      {
        title: "Biscuit Dodger à la Confiture",
        description:
          "Des biscuits sablés avec de la confiture au centre, inspirés des aventures de Matt Smith en tant que Le Docteur. Parfait pour accompagner une tasse de thé !",
        anecdote: "All right...it is a jammy dodger, but I was promised tea!",
        ingredients: [
          ingredients[65]._id,
          ingredients[66]._id,
          ingredients[67]._id,
          ingredients[68]._id,
          ingredients[69]._id,
          ingredients[70]._id,
          ingredients[71]._id,
          ingredients[72]._id,
          ingredients[73]._id,
        ],
        instructions: [
          instructions[38]._id,
          instructions[39]._id,
          instructions[40]._id,
          instructions[41]._id,
          instructions[42]._id,
        ],
        source: "Doctor Who",
        category: [categories[1]._id],
        image: "/img8.webp",
      },
      {
        title: "Pot de Crème à la Citrouille Épices",
        description:
          "Un dessert crémeux et épicé qui rappelle la saison d'Halloween, fait à partir d'un mélange de Sof'ella. Idéal pour accompagner un thé ou à servir lors de fêtes.",
        anecdote:
          "Inspiré par l'univers magique de Harry Potter, ce pot de crème rappelle les nombreux délices à la citrouille de la saga.",
        ingredients: [ingredients[74]._id, ingredients[75]._id],
        instructions: [
          instructions[43]._id,
          instructions[44]._id,
          instructions[45]._id,
        ],
        source: "Harry Potter",
        category: [categories[2]._id],
        image: "/img9.webp",
      },
      {
        title: "Peanut Butter Chocolate Cups",
        description:
          "Des bouchées sucrées et chocolatées avec un cœur au beurre de cacahuète crémeux, inspirées des classiques mais revisitées pour un goût irrésistible.",
        anecdote:
          "Recette de Peanut Butter Chocolate Cups, un délice pour les petits et les grands !",
        ingredients: [
          ingredients[76]._id,
          ingredients[77]._id,
          ingredients[78]._id,
          ingredients[79]._id,
          ingredients[80]._id,
        ],
        instructions: [
          instructions[46]._id,
          instructions[47]._id,
          instructions[48]._id,
          instructions[49]._id,
          instructions[50]._id,
          instructions[51]._id,
        ],
        source: "Reese's Peanut Butter Cups",
        category: [categories[2]._id],
        image: "/img10.webp",
      },
    ]);

    // Créer des commentaires
    await Comment.create([
      {
        content: "Excellent, mes enfants ont adoré !",
        user: users[1]._id,
        recipe: recipes[0]._id,
      },
      {
        content: "Un plat délicieux, facile à préparer.",
        user: users[2]._id,
        recipe: recipes[1]._id,
      },
      {
        content: "Recette rapide et simple, j’ai adoré !",
        user: users[3]._id,
        recipe: recipes[2]._id,
      },
      {
        content: "Très bon, idéal pour le matin.",
        user: users[4]._id,
        recipe: recipes[3]._id,
      },
      {
        content: "Cette recette est incroyable, tout comme dans la série !",
        user: users[5]._id,
        recipe: recipes[6]._id,
      },
      {
        content: "Excellent, mes enfants ont adoré !",
        user: users[6]._id,
        recipe: recipes[7]._id,
      },
      {
        content: "Elle est délicieuse, j’ai adoré !",
        user: users[7]._id,
        recipe: recipes[4]._id,
      },
    ]);

    // Créer des scores
    await Score.create([
      {
        score: 5,
        user: users[1]._id,
        recipe: recipes[0]._id,
      },
      {
        score: 4,
        user: users[2]._id,
        recipe: recipes[1]._id,
      },
      {
        score: 3,
        user: users[3]._id,
        recipe: recipes[2]._id,
      },
      {
        score: 5,
        user: users[4]._id,
        recipe: recipes[6]._id,
      },
      {
        score: 5,
        user: users[5]._id,
        recipe: recipes[5]._id,
      },
      {
        score: 4,
        user: users[6]._id,
        recipe: recipes[6]._id,
      },
      {
        score: 5,
        user: users[7]._id,
        recipe: recipes[4]._id,
      },
    ]);

    console.log("Base de données initialisée avec succès !");
  } catch (error) {
    console.error("Erreur lors du seeding :", error);
  }
}

export default seedDatabase;
