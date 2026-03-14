# Guide de Démarrage Rapide - TicketFlow

## Prérequis

- **Java 21+**
- **Node.js 20+**
- **Maven 3.8+**
- **Angular CLI 21+**

## Installation et Lancement

### 1. Backend (Spring Boot 3.3)

```bash
# Naviguer vers le dossier backend
cd backend

# Installer les dépendances et compiler
mvn clean install -DskipTests

# Lancer l'application
mvn spring-boot:run
```

**Le backend démarre sur :** `http://localhost:8080`

### 2. Frontend (Angular 21)

```bash
# Naviguer vers le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

**Le frontend est accessible sur :** `http://localhost:4200`

##  Accéder à la Documentation API

Une fois le backend démarré :

1. Ouvrir : `http://localhost:8080/swagger-ui.html`
2. Tester les endpoints directement depuis l'interface Swagger UI.
3. S'authentifier avec le bouton **"Authorize"** en utilisant un token JWT.

##  Comptes de Test par Défaut

Les comptes suivants sont créés automatiquement lors du premier lancement :

### Administrateur
- **Email :** `admin@ticketflow.com`
- **Mot de passe :** `admin123`
- **Rôle :** `ADMIN`

---

##  Tester l'API avec Swagger

### Étape 1 : S'authentifier
1. Aller sur `http://localhost:8080/swagger-ui.html`
2. Localiser le controller **auth-controller**
3. Exécuter `POST /api/auth/signin` avec les identifiants admin ci-dessus.
4. Copier la valeur de `accessToken` dans la réponse JSON.
5. Cliquer sur le bouton **"Authorize"** en haut de la page.
6. Entrer : `Bearer VOTRE_TOKEN_ICI`
7. Cliquer sur **Authorize** puis **Close**.

### Étape 2 : Tester les Endpoints
Vous pouvez maintenant tester les routes protégées comme `GET /api/tickets` ou `POST /api/projets`.

---

##  Base de Données H2 (Mode Debug)

Par défaut, l'application utilise une base de données H2 en mémoire.

**Console H2 :** `http://localhost:8080/h2-console`
- **JDBC URL :** `jdbc:h2:mem:ticketflow`
- **Username :** `sa`
- **Password :** *(vide)*

---

##  Dépannage

### Problème de version Java
Si `mvn spring-boot:run` échoue, vérifiez que votre `JAVA_HOME` pointe vers **Java 21**.
```bash
java -version
```

### Problème de dépendances Frontend
En cas d'erreur bizarre au lancement du frontend :
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 🏗️ Structure du Projet

- `/backend` : API REST Spring Boot 3.3 + JPA Hibernate.
- `/frontend` : Application SPA Angular 21 + Design Glassmorphism.

---

**Besoin d'aide ?** Consultez le [README.md](README.md) pour les détails sur l'architecture et les nouvelles fonctionnalités premium.
