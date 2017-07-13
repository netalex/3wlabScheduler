# 3wlab resource scheduler

scheduler di carico delle risorse umane di 3wlab, basato sul plugin jquery fullcalendar-scheduler.

---

ambiente di testing: json-server

json-server serve sia la pagina che il db in json su cui si appoggia.

fullcalendar lavora con date ISO8601. Json-server con unix timestamp.
attualmente il client si occupa della conversione da e verso unix timestamp, ma si suggerisce di gestire sul server di prod chiamate api che lavorino in ISO8601 per maggiore precisione e affidabilità.

* da terminale nella catella radice del progetto
* lanciare il server con il comando:
    - `json-server --watch .\src\json\Database.json --static . --routes .\src\json\routes.json`
* indirizzo di test temporaneo:
    - `http://localhost:3000/src/index2json.html`
