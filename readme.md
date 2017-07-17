# 3wlab resource scheduler

scheduler di carico delle risorse umane di 3wlab, basato sul plugin jquery fullcalendar-scheduler.

---
versione come nodeJs app deployabile su azure 
---

ambiente di testing: json-server

json-server serve sia la pagina che il db in json su cui si appoggia.

fullcalendar lavora con date ISO8601. Json-server con unix timestamp.
attualmente il client si occupa della conversione da e verso unix timestamp, ma si suggerisce di gestire sul server di prod chiamate api che lavorino in ISO8601 per maggiore precisione e affidabilità.

comando: `node server.js`
