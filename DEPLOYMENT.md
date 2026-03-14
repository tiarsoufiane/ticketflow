# TicketFlow - Guide de Déploiement Gratuit

## 🚀 Déploiement Backend sur Railway.app

### 1. Créer un compte Railway
- Aller sur [railway.app](https://railway.app)
- Se connecter avec GitHub

### 2. Créer un nouveau projet
1. Cliquer sur "New Project"
2. Choisir "Deploy from GitHub repo"
3. Sélectionner votre repository (pousser le code sur GitHub d'abord)
4. Railway détectera automatiquement le projet Spring Boot

### 3. Ajouter MySQL
1. Dans votre projet Railway, cliquer sur "+ New"
2. Choisir "Database" → "Add MySQL"
3. Railway créera automatiquement la variable `DATABASE_URL`

### 4. Configurer les variables d'environnement
Dans les settings de votre service backend, ajouter :
```
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=(auto-généré par Railway)
DB_USERNAME=(auto-généré par Railway)
DB_PASSWORD=(auto-généré par Railway)
JWT_SECRET=VotreCléSecrèteJWT256Bits
FRONTEND_URL=https://votre-app.vercel.app
```

### 5. Déployer
- Railway déploie automatiquement à chaque push sur GitHub
- URL du backend : `https://votre-app.up.railway.app`

---

## 🌐 Déploiement Frontend sur Vercel

### 1. Créer un compte Vercel
- Aller sur [vercel.com](https://vercel.com)
- Se connecter avec GitHub

### 2. Importer le projet
1. Cliquer sur "Add New..." → "Project"
2. Importer votre repository GitHub
3. Root Directory : `frontend`
4. Framework Preset : Détection automatique (Angular)

### 3. Configurer les variables d'environnement (optionnel)
Si vous utilisez des variables d'environnement Angular :
```
BACKEND_API_URL=https://votre-backend.up.railway.app
```

### 4. Configuration du Build
- Build Command : `npm run build`
- Output Directory : `dist/frontend/browser`
- Install Command : `npm install`

### 5. Déployer
- Vercel déploie automatiquement
- URL : `https://votre-app.vercel.app`

---

## 📝 Étapes de préparation

### 1. Pousser le code sur GitHub
```bash
git add .
git commit -m "Mise à jour version Premium"
git push origin main
```

### 2. Mettre à jour les URLs
Vérifiez que `frontend/src/environments/environment.prod.ts` contient la bonne URL de votre backend Railway.

### 3. Configurer CORS
Le backend est configuré pour autoriser les requêtes provenant de votre domaine Vercel via la variable `FRONTEND_URL`.

---

## 🏗️ Stack Technique de Déploiement

- **Backend** : Java 21 (Amazon Corretto / OpenJDK)
- **Framework** : Spring Boot 3.3.0
- **Frontend** : Angular 21 (v19/v21 core)
- **Build Tool** : Maven 3.9+ / Node 20+

---

## 🎯 Alternatives & Conseils

1. **Sécurité** : Changez impérativement `JWT_SECRET` dans les variables d'environnement Railway.
2. **Logs** : Utilisez `railway logs` ou l'interface web pour débugger le démarrage.
3. **Database** : MySQL sur Railway est limité à 1Go en mode gratuit, ce qui est largement suffisant pour TicketFlow.

---

**Besoin d'aide ?** 
- Railway Support : https://docs.railway.app
- Vercel Support : https://vercel.com/docs
- Support RedTech : support@redtech.com
