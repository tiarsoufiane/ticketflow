# TicketFlow - Guide de Déploiement

## 🚀 Déploiement Backend sur Render.com

> Le projet inclut un fichier `render.yaml` (Blueprint) qui automatise la création
> du service web et de la base de données MySQL sur Render.

### 1. Créer un compte Render
- Aller sur [render.com](https://render.com)
- Se connecter avec GitHub

### 2. Créer le Blueprint (infrastructure as code)
1. Dans le dashboard Render, cliquer sur **New → Blueprint**
2. Connecter votre repository GitHub `tiarsoufiane/ticketflow`
3. Render détecte automatiquement `render.yaml` et crée :
   - La base de données MySQL **`ticketflow-db`** (plan free)
   - Le service web Docker **`ticketflow-backend`** (plan free)

### 3. Configurer les variables d'environnement
La plupart des variables sont auto-injectées par Render via le Blueprint.
La seule variable à saisir **manuellement** dans le dashboard est :

| Variable | Valeur |
|---|---|
| `DATABASE_URL` | `jdbc:mysql://<host>:<port>/ticketflow?createDatabaseIfNotExist=true&serverTimezone=UTC` |
| `FRONTEND_URL` | `https://votre-app.vercel.app` *(après déploiement Vercel)* |

> **Comment trouver host/port ?**
> Dashboard Render → `ticketflow-db` → onglet **Info** → copiez *Hostname* et *Port*.

Les variables suivantes sont gérées automatiquement par le Blueprint :

```
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=(généré automatiquement par Render)
DB_USERNAME=(injecté depuis ticketflow-db)
DB_PASSWORD=(injecté depuis ticketflow-db)
PORT=8080
```

### 4. Déployer
- Render déclenche un build Docker automatiquement à chaque `git push` sur `main`
- URL du backend : `https://ticketflow-backend.onrender.com`

### 5. Vérifier le démarrage
Consulter les logs dans : **Dashboard → ticketflow-backend → Logs**

Tester l'endpoint de santé :
```
GET https://ticketflow-backend.onrender.com/api/auth/ping
```

---

## 🌐 Déploiement Frontend sur Vercel

### 1. Créer un compte Vercel
- Aller sur [vercel.com](https://vercel.com)
- Se connecter avec GitHub

### 2. Importer le projet
1. Cliquer sur **Add New... → Project**
2. Importer le repository `tiarsoufiane/ticketflow`
3. Root Directory : `frontend`
4. Framework Preset : Détection automatique (Angular)

### 3. Configurer les variables d'environnement
```
BACKEND_API_URL=https://ticketflow-backend.onrender.com
```

### 4. Configuration du Build
- Build Command : `npm run build`
- Output Directory : `dist/frontend/browser`
- Install Command : `npm install`

### 5. Déployer
- Vercel déploie automatiquement à chaque push
- URL : `https://votre-app.vercel.app`

### 6. Mettre à jour FRONTEND_URL sur Render
Une fois l'URL Vercel connue, retourner dans **Dashboard Render → ticketflow-backend → Environment**
et mettre à jour `FRONTEND_URL` avec l'URL Vercel exacte.

---

## 📝 Étapes de préparation

### 1. Pousser le code sur GitHub
```bash
git add .
git commit -m "Migration Railway → Render"
git push origin main
```

### 2. Mettre à jour les URLs
Vérifiez que `frontend/src/environments/environment.prod.ts` contient la bonne URL Render :
```typescript
apiUrl: 'https://ticketflow-backend.onrender.com/api'
```

### 3. Configurer CORS
Le backend lit la variable `FRONTEND_URL` pour autoriser les requêtes CORS.
Assurez-vous qu'elle correspond exactement à votre domaine Vercel.

---

## 🏗️ Stack Technique de Déploiement

| Couche | Technologie | Hébergement |
|---|---|---|
| Backend | Java 21 + Spring Boot 3.3 | Render (Docker) |
| Base de données | MySQL 8 | Render (managed DB) |
| Frontend | Angular 19+ | Vercel |
| Build | Maven 3.9 / Node 20 | CI/CD automatique |

---

## 🎯 Conseils

1. **Sécurité** : `JWT_SECRET` est auto-généré par Render — ne le partagez pas.
2. **Logs** : Dashboard Render → service → **Logs** pour débugger le démarrage.
3. **Cold Start** : Le plan gratuit Render met le service en veille après 15 min d'inactivité. Le premier appel peut prendre ~30 s.
4. **Database** : MySQL sur Render Free est limité à 1 Go — largement suffisant pour TicketFlow.
5. **DATABASE_URL** : Doit être au format JDBC, pas une URL standard. Exemple :
   `jdbc:mysql://oregon-mysql.render.com:3306/ticketflow?createDatabaseIfNotExist=true&serverTimezone=UTC`

---

**Besoin d'aide ?**
- Render Docs : https://render.com/docs
- Vercel Docs : https://vercel.com/docs
- Support RedTech : support@redtech.com
