# Atleth - Readme

## 1 - Installation
### Installer l'application 
- Cloner le projet
- `npm install`
- `npm start`
### Configurer Metamask
- https://metamask.io/
- Installer l'extension sur un navigateur (Chrome)
- Créer un compte
- Dans l'onglet "Reseau principal ethereum" en haut de l'interface metamask,
choisir "Reseau de test Ropsten" (L'application est déployée sur un réseau
test pour ne pas devoir dépenser de vrais ethereums) 
- Obtenir des ethers : A partir de l'interface Metamask, cliquer sur "Dépot",
puis en bas de la page "Obtenir des ethers."

Ce lien redirige vers un site permettant d'obtenir des ethers sur le réseau test
en cliquant sur "Request 1 ether from faucet"


- Une fois les ethers obtenus, vous pouvez intéragir avec le site et parier !
## 2 - Fonctionement de l'application web
Cette application permet de parier sur un match en utilisant la technologie blockchain.
Chaque joueur peut parier X ethers sur une équipe, et ces ethers sont stockés 
directement sur le contrat, et non par l'application (pas d'autorité tierce entre les parieurs).

Une fois le match terminé, on peut déclencher une fonction permettant de redistribuer
les ethers aux gagnants : Ils gagnent la somme pariée initialement + une pondération
de la somme pariée sur l'équipe perdante suivant son pari initial.
La redistribution est faite automatiquement par le smart-contract.

## 3 - Structure du code

L'application est développée avec React, en utilisant create-react-app.

### Javascript

- **src/App.js** - **src/modules/PlayerOne.jsx** & **src/modules/PlayerTwo.jsx** pour le front end

### Solidity

Solidity est le language permettant de développer des smart contracts ethereums.
Le smart contract de cette application est situé dans **contracts/Atleth.sol**

Pour être utilisé par le front, le contrat est compilé (grâce a Truffle) et
transformé en .json. Retrouvable dans **src/contracts/Atleth.json**
