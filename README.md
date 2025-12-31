# OSINT Dork Generator

A sophisticated Open Source Intelligence (OSINT) reconnaissance tool powered by Anthropic's Claude 3.5 Sonnet. This application generates advanced search queries (dorks) for multiple platforms including Google, Shodan, ZoomEye, Censys, and FOFA.

## Features

- **Multi-Platform Support**: Generate dorks for Google, Shodan, ZoomEye, Censys, and FOFA.
- **AI-Powered Generation**: Uses Claude 3.5 Sonnet to construct context-aware search queries.
- **Predefined Templates**: Quick access to common reconnaissance tasks (Subdomain enumeration, Email harvesting, Exposed files, etc.).
- **Search History**: Local persistence of recent queries.
- **Cybersecurity Aesthetic**: Dark mode interface designed for security professionals.

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

## Legal Disclaimer

⚠️ **Authorized Use Only**
This tool is intended for educational purposes and authorized security assessments only. Using these search queries to target systems without explicit permission may violate laws such as the CFAA (Computer Fraud and Abuse Act) or GDPR. The user assumes all responsibility for actions taken with this tool.
