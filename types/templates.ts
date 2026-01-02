export interface DorkTemplate {
    name: string;
    description: string;
    platforms: {
        google?: string;
        shodan?: string;
        zoomeye?: string;
        censys?: string;
        fofa?: string;
    };
    credentials?: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    category: string;
}

export const PREDEFINED_TEMPLATES: Record<string, DorkTemplate> = {
    // ========== CÁMARAS IP ==========
    "hikvision_default": {
        name: "Hikvision - Default Login",
        description: "Cámaras Hikvision con panel de login expuesto y credenciales por defecto",
        platforms: {
            shodan: 'product:"Hikvision IP Camera" port:80,8000,554',
            zoomeye: 'app:"Hikvision-Webs" +country:"ES"',
            google: 'intitle:"DVR Login" inurl:"/doc/page/login.asp"',
            censys: 'services.http.response.headers.server:"Hikvision-Webs"'
        },
        credentials: "admin:12345, admin:admin",
        severity: 'HIGH',
        category: 'IP Cameras'
    },

    "dahua_exposed": {
        name: "Dahua DVR/NVR - Expuesto",
        description: "Sistemas de videovigilancia Dahua con acceso web",
        platforms: {
            shodan: 'Dahua port:37777',
            zoomeye: 'app:"Dahua-DVR"',
            google: 'intitle:"Web Service" "Dahua"',
            fofa: 'app="Dahua-视频监控"'
        },
        credentials: "admin:admin, 888888:888888",
        severity: 'HIGH',
        category: 'IP Cameras'
    },

    "axis_cameras": {
        name: "Axis Network Cameras",
        description: "Cámaras Axis con interfaz web accesible",
        platforms: {
            shodan: 'http.title:"AXIS" port:80',
            censys: 'services.http.response.body:"AXIS"',
            google: 'inurl:"/view/view.shtml" intitle:"Live View / - AXIS"'
        },
        credentials: "root:pass, admin:admin",
        severity: 'MEDIUM',
        category: 'IP Cameras'
    },

    "webcamxp_open": {
        name: "webcamXP/7 - Sin Autenticación",
        description: "Streams de webcamXP accesibles sin credenciales",
        platforms: {
            shodan: 'webcamxp',
            google: 'intitle:"webcamXP 5" OR intitle:"webcamXP 7"',
            censys: 'services.http.response.html_title:"webcamXP"'
        },
        credentials: "Sin autenticación requerida",
        severity: 'CRITICAL',
        category: 'IP Cameras'
    },

    "foscam_default": {
        name: "Foscam - Credenciales Default",
        description: "Cámaras Foscam con login por defecto",
        platforms: {
            shodan: 'Foscam',
            google: 'intitle:"FOSCAM" inurl:"/login.htm"'
        },
        credentials: "admin:(vacío), admin:admin",
        severity: 'HIGH',
        category: 'IP Cameras'
    },

    // ========== DIRECTORY LISTING (INDEX OF) ==========
    "apache_index": {
        name: "Apache - Directory Listing",
        description: "Servidores Apache con directorio expuesto",
        platforms: {
            google: 'intitle:"Index of /" "Apache" -inurl:html -inurl:htm -inurl:php',
            shodan: 'http.title:"Index of /"'
        },
        severity: 'MEDIUM',
        category: 'Directory Listing'
    },

    "backup_files_exposed": {
        name: "Index Of - Archivos de Backup",
        description: "Directorios con archivos .bak, .backup, .old, .sql expuestos",
        platforms: {
            google: 'intitle:"Index of" inurl:backup',
        },
        severity: 'HIGH',
        category: 'Directory Listing'
    },

    "admin_directories": {
        name: "Index Of - Directorios Admin",
        description: "Carpetas administrativas listadas públicamente",
        platforms: {
            google: 'intitle:"Index of" inurl:admin',
        },
        severity: 'HIGH',
        category: 'Directory Listing'
    },

    "config_files_index": {
        name: "Index Of - Archivos de Configuración",
        description: "Directorios con .conf, .config, .ini, .env expuestos",
        platforms: {
            google: 'intitle:"Index of /" +(".conf" | ".config" | ".ini" | ".env")',
        },
        severity: 'CRITICAL',
        category: 'Directory Listing'
    },

    "database_dumps": {
        name: "Index Of - Database Dumps",
        description: "Dumps de bases de datos accesibles",
        platforms: {
            google: 'intitle:"Index of /" +".sql" -inurl:html',
        },
        severity: 'CRITICAL',
        category: 'Directory Listing'
    },

    "log_files_exposed": {
        name: "Index Of - Archivos de Log",
        description: "Logs del servidor expuestos públicamente",
        platforms: {
            google: 'intitle:"Index of /" +".log"',
        },
        severity: 'MEDIUM',
        category: 'Directory Listing'
    },

    "ssh_keys_index": {
        name: "Index Of - SSH Keys",
        description: "Claves SSH privadas expuestas en directorios listados",
        platforms: {
            google: 'intitle:"Index of /" +"id_rsa" | "id_dsa"',
        },
        severity: 'CRITICAL',
        category: 'Directory Listing'
    },

    "uploads_directory": {
        name: "Index Of - Directorio Uploads",
        description: "Carpetas de uploads sin protección de índice",
        platforms: {
            google: 'intitle:"Index of" inurl:uploads',
        },
        severity: 'MEDIUM',
        category: 'Directory Listing'
    },

    // ========== DISPOSITIVOS IOT ==========
    "router_admin": {
        name: "Routers - Panel Admin Expuesto",
        description: "Paneles de administración de routers accesibles desde Internet",
        platforms: {
            shodan: 'http.title:"Router" port:80,8080',
            google: 'intitle:"Router Login" OR intitle:"ADSL Router"',
            censys: 'services.http.response.html_title:"Router"'
        },
        credentials: "admin:admin, admin:password",
        severity: 'HIGH',
        category: 'IoT Devices'
    },

    "printers_exposed": {
        name: "Impresoras de Red",
        description: "Impresoras con interfaz web de administración accesible",
        platforms: {
            shodan: 'port:9100 printer',
            google: 'intitle:"hp laserjet" OR intitle:"printer configuration"',
            zoomeye: 'device:"Printer"'
        },
        severity: 'MEDIUM',
        category: 'IoT Devices'
    },

    "smart_tvs": {
        name: "Smart TVs - UPnP Abierto",
        description: "Smart TVs con servicios UPnP expuestos",
        platforms: {
            shodan: 'upnp "Smart TV"',
            censys: 'services.service_name:"upnp"'
        },
        severity: 'LOW',
        category: 'IoT Devices'
    },

    "nas_devices": {
        name: "NAS - Network Attached Storage",
        description: "Dispositivos de almacenamiento en red expuestos (Synology, QNAP, WD)",
        platforms: {
            shodan: '"Synology" OR "QNAP" OR "WD My Cloud"',
            google: 'intitle:"Synology DiskStation" OR intitle:"QNAP Turbo NAS"'
        },
        credentials: "admin:admin",
        severity: 'HIGH',
        category: 'IoT Devices'
    },

    // ========== SERVICIOS CRÍTICOS ==========
    "rdp_open": {
        name: "RDP - Remote Desktop Expuesto",
        description: "Servicios RDP de Windows accesibles desde Internet sin VPN",
        platforms: {
            shodan: 'port:3389 "Remote Desktop"',
            censys: 'services.port:3389'
        },
        credentials: "Administrator:Password123, Administrator:Admin123",
        severity: 'CRITICAL',
        category: 'Critical Services'
    },

    "vnc_noauth": {
        name: "VNC - Sin Autenticación",
        description: "Servidores VNC sin protección por contraseña",
        platforms: {
            shodan: '"RFB 003.008" port:5900',
            censys: 'services.port:5900 services.vnc.authentication:"none"'
        },
        severity: 'CRITICAL',
        category: 'Critical Services'
    },

    "elasticsearch_open": {
        name: "Elasticsearch - Sin Autenticación",
        description: "Clusters Elasticsearch accesibles sin credenciales (puerto 9200)",
        platforms: {
            shodan: 'product:"Elastic" port:9200',
            google: 'intitle:"Elasticsearch Head"',
            censys: 'services.elasticsearch'
        },
        severity: 'CRITICAL',
        category: 'Critical Services'
    },

    "mongodb_exposed": {
        name: "MongoDB - Sin Contraseña",
        description: "Bases de datos MongoDB sin autenticación habilitada",
        platforms: {
            shodan: 'product:"MongoDB" port:27017 -authentication',
            censys: 'services.mongodb.authentication_enabled:false'
        },
        severity: 'CRITICAL',
        category: 'Critical Services'
    },

    "redis_open": {
        name: "Redis - Sin Auth",
        description: "Servidores Redis sin autenticación requerida (puerto 6379)",
        platforms: {
            shodan: 'product:"Redis" port:6379',
            censys: 'services.redis'
        },
        severity: 'CRITICAL',
        category: 'Critical Services'
    },

    "docker_api_exposed": {
        name: "Docker API - Expuesta",
        description: "Docker API sin autenticación en puertos 2375/2376",
        platforms: {
            shodan: 'product:"Docker" port:2375,2376',
            censys: 'services.port:2375'
        },
        severity: 'CRITICAL',
        category: 'Critical Services'
    },

    // ========== PANELES DE ADMINISTRACIÓN ==========
    "jenkins_exposed": {
        name: "Jenkins CI/CD",
        description: "Servidores Jenkins con dashboard de administración expuesto",
        platforms: {
            shodan: 'http.title:"Dashboard [Jenkins]"',
            google: 'intitle:"Dashboard [Jenkins]" inurl:"/login"'
        },
        severity: 'HIGH',
        category: 'Admin Panels'
    },

    "phpmyadmin": {
        name: "phpMyAdmin",
        description: "Paneles phpMyAdmin accesibles públicamente",
        platforms: {
            google: 'inurl:"/phpmyadmin/index.php"',
            shodan: 'http.title:"phpMyAdmin"'
        },
        credentials: "root:(vacío), root:root",
        severity: 'HIGH',
        category: 'Admin Panels'
    },

    "gitlab_public": {
        name: "GitLab - Repositorios Públicos",
        description: "Instancias GitLab con repositorios potencialmente expuestos",
        platforms: {
            google: 'inurl:"gitlab" intext:"sign in"',
            shodan: 'http.title:"GitLab"'
        },
        severity: 'MEDIUM',
        category: 'Admin Panels'
    },

    "wordpress_admin": {
        name: "WordPress - Login Panel",
        description: "Paneles de administración de WordPress (/wp-admin)",
        platforms: {
            google: 'inurl:"/wp-admin" OR inurl:"/wp-login.php"',
            shodan: 'http.html:"wp-login.php"'
        },
        credentials: "admin:admin, admin:password",
        severity: 'MEDIUM',
        category: 'Admin Panels'
    },

    "adminer_exposed": {
        name: "Adminer - Database Manager",
        description: "Adminer (gestor ligero de BD) expuesto sin restricciones",
        platforms: {
            google: 'intitle:"Adminer" inurl:"adminer.php"',
            shodan: 'http.title:"Login - Adminer"'
        },
        severity: 'HIGH',
        category: 'Admin Panels'
    },

    // ========== ARCHIVOS SENSIBLES ==========
    "env_files": {
        name: "Archivos .env Expuestos",
        description: "Variables de entorno con credenciales, API keys y secrets",
        platforms: {
            google: 'filetype:env "DB_PASSWORD"',
        },
        severity: 'CRITICAL',
        category: 'Sensitive Files'
    },

    "git_exposed": {
        name: "Repositorios .git Expuestos",
        description: "Carpetas .git accesibles públicamente (permite reconstruir código fuente)",
        platforms: {
            google: 'inurl:"/.git" intitle:"Index of /"',
        },
        severity: 'CRITICAL',
        category: 'Sensitive Files'
    },

    "aws_credentials": {
        name: "AWS Credentials Expuestas",
        description: "Archivos con credenciales de AWS (Access Key ID, Secret)",
        platforms: {
            google: 'filetype:json "aws_access_key_id"',
        },
        severity: 'CRITICAL',
        category: 'Sensitive Files'
    },

    "private_keys": {
        name: "Claves Privadas SSH/PGP",
        description: "Claves privadas expuestas en repositorios o servidores web",
        platforms: {
            google: 'filetype:pem "BEGIN RSA PRIVATE KEY"',
        },
        severity: 'CRITICAL',
        category: 'Sensitive Files'
    }
};

// Mapeo de categorías con nombres amigables
export const TEMPLATE_CATEGORIES: Record<string, string> = {
    "IP Cameras": "🎥 Cámaras IP y Videovigilancia",
    "Directory Listing": "📂 Listados de Directorios (Index Of)",
    "IoT Devices": "🔌 Dispositivos IoT",
    "Critical Services": "⚠️ Servicios Críticos Expuestos",
    "Admin Panels": "🔐 Paneles de Administración",
    "Sensitive Files": "🔑 Archivos Sensibles"
};
