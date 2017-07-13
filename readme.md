# 3wlab resource scheduler

scheduler di carico delle risorse umane di 3wlab, basato sul plugin jquery fullcalendar-scheduler.

---

ambiente di testing: json-server

json-server serve sia la pagina che il db in json su cui si appoggia

* da terminale nella catella radice del progetto
* lanciare il server con il comando:
    - `json-server --watch .\src\json\Database.json --static . --routes .\src\json\routes.json`
* indirizzo di test temporaneo:
    - `http://localhost:3000/src/index2json.html`
