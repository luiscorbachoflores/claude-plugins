# status-band

Barra pegada a la derecha, encima del prompt de Claude Code, con el consumo de la sesión en una sola línea: ventana de 5 horas, semanal (7 días), coste acumulado y, al final en un color distinto al resto, el porcentaje de contexto usado (sobre la ventana del modelo; `/context` mide contra la ventana de compactación, normalmente algo menor, así que puede ir algo adelantado). El color del tramo `ctx` cambia según lo lleno que vaya: tono normal hasta 60%, aviso hasta 85%, crítico a partir de ahí. Lleva un margen superior para no pegarse al texto de encima.

Sustituye a `usage-band` (incluye toda su información) — no instales ambos a la vez, competirían por la misma banda.

## Instalación

En el prompt de una sesión de Claude Code:

```
/plugin install status-band --marketplace luiscorbachoflores/claude-plugins
```

O desde una shell:

```
claude plugin install status-band --marketplace luiscorbachoflores/claude-plugins
```
