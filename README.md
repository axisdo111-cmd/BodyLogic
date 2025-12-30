# BodyLogic

**BodyLogic** est un projet open-source basé sur **Expo / React Native (TypeScript)**, structuré autour d’un **moteur de calcul métier indépendant** et d’une **interface mobile**.

Le projet met l’accent sur la **séparation stricte des responsabilités**, la **fiabilité du moteur**, et la **réutilisabilité du code**.

---

## 🚀 Fonctionnalités

- Architecture claire **moteur (core) / interface (app)**
- Moteur de calcul **pur, déterministe et testable**
- Interface mobile développée avec **Expo**
- Base pour une calculatrice avancée :
  - Mode **CALC**
  - Mode **DATE-TIME**
- Gestion explicite des erreurs métier

---

## 🧱 Architecture
BodyLogic/
│
├── core/ # Moteur métier (TypeScript pur)
│ ├── errors.ts # Erreurs métier typées
│ └── index.ts # API publique du moteur
│
├── app/ # Interface Expo / React Native
│ ├── App.tsx
│ ├── screens/
│ └── components/
│
├── App.tsx # Point d’entrée Expo
├── tests/ # Tests (à venir)
├── .gitignore
├── package.json
└── README.md


