# SANAD

| Dossier | Composant | Documentation |
| --- | --- | --- |
| `backend/` | API ASP.NET Core et tests .NET 8 | [Guide du backend](backend/BackEnd/SanadPlatform.API/README.md) |
| `frontend/` | Application pour les patients et les professionnels | [Guide du frontend](frontend/README.md) |
| `admin/` | Interface d’administration | [Guide de l’admin](admin/README.md) |

La [documentation des API](APIs/APIS/Api%20Doc/README.md) et les [diagrammes UML](diagrammes_uml/) se trouvent à la racine.

## Démarrer en local

Pour lancer le frontend ou l’admin, ouvrez un terminal dans le dossier correspondant et exécutez `npm ci`, puis `npm run dev`. Consultez le guide du frontend pour régler l’URL de l’API.

Pour l’API, installez le SDK .NET 8 et configurez PostgreSQL. Copiez `backend/.env.example` vers `backend/.env`, renseignez les trois valeurs, puis exécutez `docker compose up -d` depuis `backend/` pour lancer MinIO, RabbitMQ et ClamAV. Utilisez les mêmes identifiants MinIO et le même mot de passe RabbitMQ dans la configuration de l’API.

Renseignez les réglages de l’API avec les variables d’environnement suivantes avant de lancer le projet. Les paramètres à deux niveaux utilisent `__` comme séparateur.

| Variables d’environnement | Valeurs |
| --- | --- |
| `ConnectionStrings__DefaultConnection`, `ConnectionStrings__LoggingDatabase` | Chaînes de connexion PostgreSQL complètes |
| `JwtSettings__SecretKey`, `LoginOtpSettings__CodeHashSecret` | Secrets distincts d’au moins 32 caractères |
| `Security__EncryptionKey` | Clé de 32 octets encodée en Base64 |
| `Email__SenderEmail`, `Email__SenderPassword` | Compte SMTP et mot de passe |
| `MinioSettings__AccessKey`, `MinioSettings__SecretKey`, `RabbitMQ__Password` | Identifiants des services locaux |
| `ProviderSignupUploadTokens__SigningKey` | Clé de signature obligatoire hors développement |
| `WebPush__PublicKey`, `WebPush__PrivateKey` | Paire VAPID pour activer les notifications Web Push |

Depuis la racine, lancez `dotnet run --project backend/BackEnd/SanadPlatform.API`. Les scripts SQL de peuplement fournissent des données de démonstration destinées au développement et aux tests.
