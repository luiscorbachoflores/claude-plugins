# status-band

Etiqueta junto a los modos de sesión, a la derecha del pie del prompt de Claude Code (donde aparece "auto mode on" y similares), en una sola línea: primero el porcentaje de contexto usado (`ctx NN%`, en un color que cambia según lo lleno que vaya: normal hasta 60%, aviso hasta 85%, crítico a partir de ahí), luego el consumo de 5 horas, el semanal (7 días) y el coste acumulado, en gris tenue. Si hay algún modo de sesión activo (ej. "auto mode on"), se añade detrás con ` & `, igual que hace Claude Code entre sus propias etiquetas. Se actualiza sola, sin tener que abrir `/status` ni `/context`.

El contexto se mide sobre la ventana del modelo; `/context` mide contra la ventana de compactación, normalmente algo menor, así que puede ir algo adelantado.

## Instalación

En el prompt de una sesión de Claude Code:

```
/plugin install status-band --marketplace luiscorbachoflores/claude-plugins
```

O desde una shell:

```
claude plugin install status-band --marketplace luiscorbachoflores/claude-plugins
```
