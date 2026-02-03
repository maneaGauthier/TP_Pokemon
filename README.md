# 📱 Pokédex React Application

Ce projet est une application web interactive réalisée avec **React**, permettant de consulter les Pokémons de la première génération et de gérer sa propre équipe de capture.

## ✨ Fonctionnalités Principales

### 🏠 Page d'Accueil
- **Affichage** : Liste des 151 Pokémons de la 1ère génération.
- **Cartes Interactives** : Effet de retournement 3D (Flip) au clic.
  - *Recto* : Image, Nom, Types, Statistiques, Lien vers le détail.
  - *Verso* : Dos de carte officiel (Design bleu).
  - *Bouton (+)* : Ajout rapide au Pokédex latéral.

### 🎒 Sidebar (Mon Pokédex)
- **Menu Latéral** : Repliable et dépliable.
- **Gestion d'équipe** :
  - Ajout de Pokémons sans doublons.
  - Suppression de Pokémons via une croix rouge.
  - Compteur de Pokémons capturés en temps réel.
- **Design** : Ne cache pas le contenu principal (le site se décale).

### 🔍 Page Détail
- **Navigation** : Bouton retour vers l'accueil.
- **Famille d'Évolution Complète** : Algorithme intelligent affichant toute la lignée (Parents, Enfants, Petits-enfants) quel que soit le Pokémon consulté (ex: Tortank affiche aussi Carapuce et Carabaffe).
- **Mise en avant** : Le Pokémon actuel est surligné dans la liste des évolutions.

### ⚙️ Technique & UX
- **Routing** : Gestion des pages via `react-router-dom` (Accueil, Détail, 404, Mentions Légales).
- **Chargement** : Spinner animé (Loader) pendant les appels API.
- **Gestion d'erreurs** : Page 404 personnalisée.

## 🛠️ Stack Technique

- **Framework** : React.js (Vite)
- **Langage** : JavaScript (ES6+)
- **Style** : SCSS (Sass) avec architecture modulaire.
- **Routing** : React Router DOM v6.
- **Données (APIs)** :
  - [PokebuildAPI](https://pokebuildapi.fr/) : Pour les données et images en Français.
  - [PokeAPI](https://pokeapi.co/) : Utilisée spécifiquement pour reconstruire les arbres généalogiques d'évolution complexes.

## 📋 Pré-requis

Avant de lancer le projet, assurez-vous d'avoir installé **Node.js** et **npm** sur votre machine.

Vous pouvez vérifier leur présence en tapant ces commandes dans votre terminal :
```bash
node -v
npm -v
```

## 🚀 Installation et Lancement

Cloner le projet :
```bash
git clone https://github.com/maneaGauthier/TP_Pokemon.git
cd TP_Pokemon
```

Installer les dépendances :
```bash
npm install
```

Lancer le serveur de développement Démarre le projet en local :

```bash
npm run dev
```

Accéder à l'application Ouvrez votre navigateur sur l'URL indiquée (ex: http://localhost:5173)