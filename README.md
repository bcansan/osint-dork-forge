# OSINT Dork Generator

A sophisticated Open Source Intelligence (OSINT) reconnaissance tool powered by Anthropic's Claude 3.5 Sonnet. This application generates advanced search queries (dorks) for multiple platforms including Google, Shodan, ZoomEye, Censys, and FOFA.

## Features

- **Multi-Platform Support**: Generate dorks for Google, Shodan, ZoomEye, Censys, and FOFA.
- **AI-Powered Generation**: Uses Claude 3.5 Sonnet to construct context-aware search queries.
- **Predefined Templates**: Quick access to common reconnaissance tasks (Subdomain enumeration, Email harvesting, Exposed files, etc.).
- **Search History**: Local persistence of recent queries.
- **Cybersecurity Aesthetic**: Dark mode interface designed for security professionals.

## 🎯 Categorías OSINT Especializadas

### 🎥 Cámaras IP y Videovigilancia
- Hikvision (credenciales default)
- Dahua DVR/NVR
- Axis Network Cameras
- webcamXP sin autenticación
- Foscam

### 📂 Directory Listing (Index Of)
- Archivos de backup (.bak, .old, .sql)
- Directorios admin
- Archivos de configuración (.conf, .ini, .env)
- Database dumps
- Logs del servidor
- SSH keys privadas
- Directorios uploads

### 🔌 Dispositivos IoT
- Routers (panel admin)
- Impresoras de red
- Smart TVs (UPnP)
- NAS (Synology, QNAP, WD)

### ⚠️ Servicios Críticos Expuestos
- RDP (Remote Desktop)
- VNC sin autenticación
- Elasticsearch
- MongoDB sin password
- Redis
- Docker API

### 🔐 Paneles de Administración
- Jenkins CI/CD
- phpMyAdmin
- GitLab
- WordPress
- Adminer

### 🔑 Archivos Sensibles
- .env files
- .git repositories
- AWS credentials
- SSH/PGP private keys

## ⚠️ IMPORTANTE - USO ÉTICO

Esta herramienta es exclusivamente para:
✅ Pruebas de penetración autorizadas
✅ Programas de bug bounty legítimos
✅ Auditorías de seguridad con permiso explícito
✅ Investigación educativa y académica

❌ El uso no autorizado puede constituir un delito según:
- Código Penal Español (Artículo 197)
- Computer Fraud and Abuse Act (CFAA)
- Legislación internacional aplicable

Siempre obtén autorización explícita antes de realizar reconocimiento en infraestructuras que no te pertenecen.

## Setup

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd osint-dork-tool
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment**:
    Create a `.env.local` file in the root directory and add your Anthropic API key:
    ```env
    ANTHROPIC_API_KEY=sk-ant-...
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## API Documentation

### POST /app/api/generate-dork

Generates dorks based on the provided parameters.

**Request Body**:
```json
{
  "platform": "google" | "shodan" | "zoomeye" | "censys" | "fofa",
  "parameters": {
    "target": "example.com",
    "infoType": "subdomains",
    "filters": "-www",
    "exclusions": "staging.example.com"
  },
  "templateInfo": {
      "name": "Template Name",
      "category": "Category",
      "severity": "HIGH",
      "description": "...",
      "credentials": "..."
  }
}
```

**Response**:
```json
{
  "dorks": "Markdown formatted string containing dorks and explanations"
}
```

## Deployment on Vercel

1.  Push your code to a Git repository (GitHub/GitLab).
2.  Import the project in Vercel.
3.  Add the `ANTHROPIC_API_KEY` to the Environment Variables settings in Vercel.
4.  Deploy.
