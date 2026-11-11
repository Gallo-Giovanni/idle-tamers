# Idle Tamers (nome provvisorio)

Idle auto-battler per mobile: la squadra avanza e combatte da sola, tu catturi le creature sconfitte (restano per sempre), le equipaggi e scegli la zona.

**Gioca:** https://gallo-giovanni.github.io/idle-tamers/  
Da Chrome su Android: menu ⋮ → *Installa app* per averlo come un'app vera.

## Struttura
- `src/core.js` — logica pura del gioco (testabile con Node)
- `src/ui.js` — interfaccia e grafica pixel
- `src/template.html` — layout e stile
- `tools/build.py` — unisce i tre file in `index.html`
- `tests/` — test e simulazioni di bilanciamento (`node tests/pace2.js`)
- `manifest.webmanifest`, `sw.js`, `icons/` — installazione come app (PWA)

Dopo ogni modifica in `src/`: `python3 tools/build.py`.

## Idee da valutare
- **Boss segreti**: con una probabilità bassissima compaiono al posto del boss normale della zona (aspetto e drop speciali, catturabili).
- **Aumento del guadagno offline**: oggi 4 ore (8 col Pass); decidere come e quando farlo crescere.
- **Classifica globale** del potere squadra e **sfondi diversi** per ogni pianeta.
