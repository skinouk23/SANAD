# Deployment Checklist

## 🚀 Pre-Deployment

### Code Quality
- [ ] All code reviewed and approved
- [ ] No hardcoded secrets or credentials
- [ ] No console.log or debug statements
- [ ] All commented code removed
- [ ] Code follows project conventions

### Security
- [ ] JWT secret key is strong (minimum 32 characters)
- [ ] Password hashing implemented
- [ ] SQL injection prevention (using EF Core parameterization)
- [ ] CORS whitelist configured for production domains
- [ ] HTTPS enforced in production
- [ ] No sensitive data logged
- [ ] Authentication/Authorization tested

### Testing
- [ ] All unit tests passing
- [ ] Integration tests passing (optional but recommended)
- [ ] API endpoints tested with Swagger/Postman
- [ ] Error handling verified
- [ ] Authentication flow verified

### Database
- [ ] Database migrations tested
- [ ] Backup strategy planned
- [ ] Connection pooling configured
- [ ] Logging database separate from application database
- [ ] Database user has appropriate permissions (not SA)

### Logging
- [ ] Logging database created
- [ ] Serilog configured for production (errors only, not debug)
- [ ] Log retention policy implemented
- [ ] Performance impact measured

### Configuration
- [ ] `appsettings.Production.json` created
- [ ] All secrets in Azure Key Vault or secure storage
- [ ] Database connection strings configured
- [ ] Correct environment variables set
- [ ] CORS origins configured
- [ ] Health check endpoints configured

### Documentation
- [ ] README.md updated
- [ ] API documentation complete
- [ ] Deployment instructions documented
- [ ] Rollback procedure documented

## 📋 Production Configuration

### appsettings.Production.json

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "api.yourdomain.com",
  "ConnectionStrings": {
    "DefaultConnection": "Server=prod-server;Database=SanadPlatformDb;User Id=appuser;Password=***;TrustServerCertificate=true;Encrypt=true;",
    "LoggingDatabase": "Server=prod-server;Database=SanadPlatformLogsDb;User Id=appuser;Password=***;TrustServerCertificate=true;Encrypt=true;"
  },
  "JwtSettings": {
    "SecretKey": "YOUR-PRODUCTION-SECRET-KEY-MINIMUM-32-CHARACTERS",
    "Issuer": "SanadPlatform",
    "Audience": "SanadPlatformAPI",
    "ExpiryMinutes": 60
  },
  "CorsSettings": {
    "AllowedOrigins": [
      "https://yourdomain.com",
      "https://www.yourdomain.com"
    ]
  }
}
```

### Environment Variables

Set in production environment:
```bash
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=https://+:443
ASPNETCORE_HTTPS_PORT=443
ASPNETCORE_Kestrel__Certificates__Default__Path=/path/to/certificate.pfx
ASPNETCORE_Kestrel__Certificates__Default__Password=certificate-password
```

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["SanadPlatform.API.csproj", "."]
RUN dotnet restore "SanadPlatform.API.csproj"

COPY . .
RUN dotnet build "SanadPlatform.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SanadPlatform.API.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=publish /app/publish .

EXPOSE 80 443

ENTRYPOINT ["dotnet", "SanadPlatform.API.dll"]
```

### docker-compose.yml

```yaml
version: '3.8'
services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "5001:443"
      - "5000:80"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__DefaultConnection=Server=mssql;Database=SanadPlatformDb;User Id=sa;Password=YourPassword123!
      - ConnectionStrings__LoggingDatabase=Server=mssql;Database=SanadPlatformLogsDb;User Id=sa;Password=YourPassword123!
    depends_on:
      - mssql
    networks:
      - sanad-network

  mssql:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=YourPassword123!
      - MSSQL_PID=Express
    ports:
      - "1433:1433"
    volumes:
      - mssql-data:/var/opt/mssql
    networks:
      - sanad-network

volumes:
  mssql-data:

networks:
  sanad-network:
    driver: bridge
```

## ☁️ Azure Deployment

### Deploy to Azure App Service

```bash
# Login to Azure
az login

# Create resource group
az group create --name sanad-api-rg --location eastus

# Create App Service plan
az appservice plan create \
  --name sanad-api-plan \
  --resource-group sanad-api-rg \
  --sku B2 \
  --is-linux

# Create App Service
az webapp create \
  --name sanad-api \
  --resource-group sanad-api-rg \
  --plan sanad-api-plan \
  --runtime "DOTNET|8.0"

# Configure connection strings
az webapp config connection-string set \
  --name sanad-api \
  --resource-group sanad-api-rg \
  --settings \
    DefaultConnection="Server=tcp:sanad-db.database.windows.net,1433;Initial Catalog=SanadPlatformDb;Persist Security Info=False;User ID=dbadmin;Password=***;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;" \
  --connection-string-type SQLAzure

# Configure Key Vault reference
az webapp config appsettings set \
  --name sanad-api \
  --resource-group sanad-api-rg \
  --settings \
    JwtSettings__SecretKey="@Microsoft.KeyVault(SecretUri=https://sanad-keyvault.vault.azure.net/secrets/JwtSecret/)" \
  --slot-settings

# Deploy from Git
git remote add azure <azure-git-url>
git push azure main
```

### Azure Key Vault Setup

```bash
# Create Key Vault
az keyvault create \
  --name sanad-keyvault \
  --resource-group sanad-api-rg \
  --location eastus

# Store secrets
az keyvault secret set \
  --vault-name sanad-keyvault \
  --name JwtSecret \
  --value "your-production-secret-key"

# Grant App Service access
az keyvault set-policy \
  --name sanad-keyvault \
  --object-id <app-service-managed-identity-id> \
  --secret-permissions get list
```

## 🔍 Post-Deployment Verification

### Health Checks
```bash
# Liveness
curl https://api.yourdomain.com/api/health/live

# Readiness
curl https://api.yourdomain.com/api/health/ready

# Version
curl https://api.yourdomain.com/api/health/version
```

### Functional Tests
```bash
# Register user
curl -X POST https://api.yourdomain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "confirmPassword": "TestPassword123!",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST https://api.yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'

# Get providers (with token)
curl https://api.yourdomain.com/api/providers/active \
  -H "Authorization: Bearer {token}"
```

### Performance Monitoring
- [ ] Response times acceptable (< 500ms for most endpoints)
- [ ] Error rate < 1%
- [ ] CPU usage < 70%
- [ ] Memory usage stable
- [ ] Database connections within pool

### Logging Verification
- [ ] Logs appearing in database
- [ ] Correlation IDs working
- [ ] No sensitive data in logs
- [ ] Query performance acceptable

## 📊 Monitoring Setup

### Application Insights (Azure)

```csharp
// In Program.cs
builder.Services.AddApplicationInsightsTelemetry();

var telemetryClient = builder.Services.BuildServiceProvider()
    .GetRequiredService<TelemetryClient>();
```

### Alerts to Configure
- [ ] High error rate (> 5% in 5 minutes)
- [ ] Response time degradation (> 1000ms)
- [ ] Database connection pool exhaustion
- [ ] High memory usage (> 80%)
- [ ] Disk space low (< 10% free)

### Log Alerts (SQL Server)

```sql
-- Alert if errors spike
SELECT 
    COUNT(*) as ErrorCount
FROM RequestLogs
WHERE Level = 'Error'
  AND TimeStamp > DATEADD(minute, -5, GETDATE())

-- Alert if slow requests increase
SELECT 
    COUNT(*) as SlowRequests
FROM RequestLogs
WHERE LogEvent LIKE '%ElapsedMilliseconds: [5-9][0-9]{2}%'
  AND TimeStamp > DATEADD(minute, -5, GETDATE())
```

## 🔄 Rollback Plan

### If Deployment Fails

1. **Immediate Actions**
   - [ ] Stop the API service
   - [ ] Revert to previous database schema (if changed)
   - [ ] Restart previous API version
   - [ ] Notify team

2. **Database Rollback**
   ```bash
   # If migrations were applied
   dotnet ef database update <PreviousMigration>
   ```

3. **Application Rollback**
   ```bash
   # Azure App Service
   az webapp deployment slot swap \
     --resource-group sanad-api-rg \
     --name sanad-api \
     --slot staging

   # Or Docker
   docker pull sanad-api:previous-version
   docker-compose up -d
   ```

## 📝 Maintenance Tasks

### Weekly
- [ ] Review error logs
- [ ] Monitor performance metrics
- [ ] Check database size growth

### Monthly
- [ ] Database maintenance (index fragmentation)
- [ ] Archive old logs
- [ ] Security updates for dependencies
  ```bash
  dotnet list package --outdated
  dotnet package update --minor
  ```

### Quarterly
- [ ] Load testing
- [ ] Disaster recovery drill
- [ ] Security audit
- [ ] Update documentation

## 🛑 Incident Response

### API Down

1. Check service status
2. Check logs in database
3. Verify database connectivity
4. Verify external dependencies
5. Restart service
6. Monitor recovery

### High Error Rate

1. Check recent deployments
2. Check database logs
3. Check external API dependencies
4. Roll back if necessary
5. Investigate root cause

### Performance Degradation

1. Check database query performance
2. Check memory/CPU usage
3. Review recent changes
4. Check cache hit rates
5. Consider load balancing

## ✅ Deployment Completion

- [ ] All checks passed
- [ ] Team notified of deployment
- [ ] Monitoring confirmed operational
- [ ] Rollback procedure documented
- [ ] Incident response team ready
- [ ] Post-deployment documentation updated

---

**Success Criteria:**
- ✅ API responds to health checks
- ✅ Authentication working
- ✅ Errors logged to database
- ✅ Performance acceptable
- ✅ Monitoring active
- ✅ Team trained

**Deployment completed successfully!** 🎉
