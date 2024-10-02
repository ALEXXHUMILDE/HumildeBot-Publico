# Humilde Bot

**Humilde** es un bot de Discord que ofrece una amplia variedad de funciones, desde moderación y votaciones hasta diversión y utilidades. Este bot está diseñado para ser útil y entretenido, proporcionando comandos para gestionar comunidades, realizar encuestas, además de un sistema de sugerencias interactivo.

<img src="https://cdn.discordapp.com/attachments/986117869597253634/1285250849697828914/fd9f627b51dc29febdf9ed76be728612.png?ex=66e996a1&is=66e84521&hm=1df609c25472af31249160d9a443d1e7d61de8032bce80dc4bcabf234e28a25b&" alt="Humilde Bot Logo" width="100"/>

## Características

- **Moderación**: Comandos para gestionar tu servidor, como expulsar o silenciar usuarios.
- **Diversión**: Comandos interactivos para entretener a los usuarios.
- **Encuestas**: Realiza encuestas y votaciones en el servidor de manera sencilla.
- **Utilidades**: Herramientas prácticas como sugerencias, mensajes de bienvenida y más.
- **Sistema de Sugerencias**: Gestión de sugerencias con votaciones, aprobación y rechazo por parte del staff.

## Instalación

Sigue estos pasos para clonar y ejecutar **Humilde Bot** en tu propio servidor:

### Requisitos previos

- [Node.js](https://nodejs.org/) (v16.9.0 o superior)
- [MongoDB](https://www.mongodb.com/) (Para gestionar sugerencias y encuestas)
- Un servidor de Discord donde puedas añadir el bot
- [Discord Developer Portal](https://discord.com/developers/applications) (Para obtener el token de tu bot)

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/ALEXXHUMILDE/HumildeBot-Publico.git
cd humilde-bot
```

### Paso 2: Instalar dependencias

Una vez en la carpeta del bot, instala las dependencias necesarias ejecutando:
```bash
npm install
```

### Paso 3: Configuración

Debes crear un archivo ``config.json`` en la carpeta raíz del proyecto con la siguiente estructura:
```json
{
  "token": "TU_TOKEN_DEL_BOT",
  "mongourl": "URL_DE_TU_BASE_DE_DATOS_DE_MONGODB",
  "color": "El color que tu quieras en HEX"
}
```

### Paso 4: Iniciar el bot

Inicia el bot ejecutando el siguiente comando:
```bash
node .
```

Si todo está configurado correctamente, el bot debería conectarse y estar listo para interactuar en tu servidor.

### Paso 5: Invitar el bot a tu servidor
Genera el enlace de invitación desde el [Discord Developer Portal](https://discord.com/developers/applications), selecciona los permisos y añade tu bot a tu servidor de Discord.

## Comandos Principales

### Moderación
``/kick``: Expulsa a un miembro del servidor.
``/timeout``: Banea a un usuario.
``/clear``: Silencia temporalmente a un miembro.

### Diversión
``/8ball``: Responde preguntas al estilo de la bola 8 mágica.
``/meme``: Envía un meme aleatorio.

### Utilidades
``/help``: Muestra todos los comandos disponibles organizados por categorías.

## Licencia
Este proyecto está bajo la licencia Apache License 2.0.
