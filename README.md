# siu-watcher (El vigilante del SIU)

Recordatorio para mi:
- Carpeta bot: lógica de negocio (playwright, scraping, cron jobs, etc). index.ts son las funciones que cumple el bot.
- Carpeta renderer: interfaz gráfica del user (render process). index.html es el estilo, renderer.ts controla la UI
- main.ts entry point (Crea ventana, carga iu /renderer.html, abrir cerrar ventanas, comunicar con render).