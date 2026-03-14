# TicketFlow - Système de Gestion de Tickets

## Vue d'ensemble

TicketFlow est une application fullstack moderne de gestion de tickets de support technique. Elle arbore un design **Premium Glassmorphism** et offre une expérience utilisateur fluide pour les clients, techniciens et administrateurs.

**Architecture :**
- **Backend** : Spring Boot 3.3 + Spring Security (JWT) + Java 21
- **Frontend** : Angular 21 + CSS Modern (Glassmorphism)

---

## Points Forts & Améliorations Récentes

### Interface Premium (Design System)
- **Glassmorphism** : Utilisation intensive d'effets de transparence, de flou d'arrière-plan (`backdrop-filter`) et de bordures subtiles pour un rendu haut de gamme.
- **Responsive & Centré** : Mise en page optimisée, cartes de connexion compactes et centrées, espacements raffinés.
- **Zéro "Yellow Background"** : Correction des styles d'autofill des navigateurs pour préserver l'esthétique sombre/verre.

### Sécurité & Validation (Password 2.0)
- **Standard 6-12** : Tous les mots de passe de l'application sont régis par une règle stricte de **6 à 12 caractères**.
- **Validation Backend** : Intégration de `@Size(min = 6, max = 12)` sur les DTOs d'inscription et de modification.

---

## Démarrage Rapide

### Configuration Locale

#### 1. Backend
```bash
cd backend
mvn spring-boot:run
```
- **API** : `http://localhost:8080/api`
- **Swagger UI** : `http://localhost:8080/swagger-ui.html`

#### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
- **Accès** : `http://localhost:4200`

---

## Déploiement

L'application est configurée pour un déploiement CI/CD automatique :
- **Backend (Railway)** : Déploiement via `Dockerfile` et support MySQL intégré.
- **Frontend (Vercel)** : Configuration optimisée dans `vercel.json` pour la gestion des routes Angular.

---

## Endpoints & Rôles

### Rôles
| Rôle | Permissions |
|------|-------------|
| **ADMIN** | Gestion totale (utilisateurs, clients, techniciens, projets, tickets) |
| **TECHNICIEN** | Gestion des tickets assignés, dashboard technique |
| **CLIENT** | Création de tickets, suivi de projets, contact support |

### API Principale
- `POST /api/auth/signin` : Connexion
- `POST /api/auth/signup` : Inscription (avec validation 6-12 car.)
- `GET /api/tickets` : Gestion du cycle de vie des incidents
- `GET /api/projets` : Gestion des projets par client

---

## Technologies Utilisées

| Secteur | Stack |
|---------|-------|
| **Core API** | Spring Boot 3.3.0 |
| **Sécurité** | Spring Security + JWT |
| **Persistance** | Spring Data JPA + MySQL |
| **Frontend** | Angular 21 + RxJS |
| **Style** | CSS3 (Custom Glassmorphism) |
| **Doc** | SpringDoc OpenAPI (Swagger) |

---
**Version :** 1.1.0 (Édition Premium)  
**Date :** Décembre 2025  
**Auteur :** Soufiane TIAR
