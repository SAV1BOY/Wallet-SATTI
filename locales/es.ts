export default {
  "common": {
    "save": "Guardar",
    "cancel": "Cancelar",
    "edit": "Editar",
    "delete": "Eliminar",
    "confirm": "Confirmar",
    "close": "Cerrar",
    "all": "Todos",
    "income": "Ingreso",
    "expenses": "Gasto",
    "balance": "Saldo",
    "other": "Otros",
    "of": "de",
    "remaining": "Restante",
    "overspent": "Excedido"
  },
  "nav": {
    "dashboard": "Panel",
    "transactions": "Cuentas",
    "savings": "Metas",
    "budgets": "Presup.",
    "reports": "Datos",
    "settings": "Ajustes",
    "add": "Añadir nuevo registro"
  },
  "header": {
    "reports": "Informes",
    "settings": "Ajustes"
  },
  "dashboard": {
    "monthBalance": "Balance del mes",
    "income": "Ingresos",
    "expenses": "Gastos",
    "accumulatedBalance": "Saldo Acumulado",
    "incomeVsExpenses": "Ingresos vs. Gastos (mes actual)",
    "monthlyFlow": "Flujo Mensual (Ingresos vs. Gastos)",
    "balanceEvolution": "Evolución y Variación del Saldo",
    "accumulatedBalanceShort": "Saldo Acumulado",
    "monthlyVariation": "Variación Mensual (%)",
    "incomeByCategory": "Ingresos por Categoría",
    "expensesByCategory": "Gastos por Categoría"
  },
  "transactions": {
    "searchPlaceholder": "Buscar registros...",
    "advancedFilters": "Filtros avanzados",
    "all": "Todos",
    "income": "Ingresos",
    "expenses": "Gastos",
    "noResults": "No hay resultados para los filtros aplicados.",
    "noEntries": "No hay {type} este mes.",
    "entryTypes": {
      "todos": "registros",
      "receitas": "ingresos",
      "despesas": "gastos"
    },
    "newEntry": "Nuevo Registro",
    "paid": "Pagado",
    "received": "Recibido",
    "overdue": "Vencido",
    "markUnpaid": "Marcar como no pagado",
    "markPaid": "Marcar como Pagado",
    "markReceived": "Marcar como Recibido"
  },
  "savings": {
    "myGoals": "Mis Metas",
    "newGoal": "Nueva Meta",
    "noGoalsMessage": "Aún no tienes ninguna meta de ahorro.",
    "createFirstGoal": "Crear mi primera meta",
    "targetFor": "Meta para: {date}",
    "addMoney": "Añadir Dinero",
    "goalReached": "🎉 ¡Meta Alcanzada!",
    "deleteGoalTitle": "Eliminar Meta",
    "deleteGoalMessage": "¿Estás seguro de que quieres eliminar la meta \"{name}\"?"
  },
  "budgets": {
    "monthBudget": "Presupuesto del Mes",
    "budgeted": "Presupuestado",
    "spent": "Gastado",
    "remaining": "Restante",
    "usedPercentage": "Has utilizado un <strong>{percentage}%</strong> de tu presupuesto total.",
    "noBudgets": "No hay presupuesto definido para este mes.",
    "setBudget": "Definir Presupuesto"
  },
  "reports": {
    "periodFilter": "Filtro de Período",
    "monthly": "Mensual",
    "quarterly": "Trimestral",
    "yearly": "Anual",
    "all": "Siempre",
    "month": "Mes",
    "year": "Año",
    "financialOverview": "Resumen Financiero",
    "exportCSV": "Exportar CSV",
    "finalAccumulatedBalance": "Saldo Acumulado Final",
    "accumulatedToDate": "Saldo Acumulado hasta {date}",
    "accumulatedToQuarter": "Saldo Acumulado hasta Q{quarter} {year}",
    "projectedBalance": "Saldo Proyectado ({years} año(s))",
    "summaryFor": "Resumen - {period}",
    "totalIncome": "Total Ingresos",
    "totalExpenses": "Total Gastos",
    "periodBalance": "Saldo del Período",
    "categoryBreakdown": "Desglose por Categoría",
    "noEntriesForPeriod": "No se encontraron registros para este período.",
    "paymentStatus": "Estado de Pagos",
    "paid": "Pagados",
    "pending": "Pendientes",
    "overdueEntries": "⚠️ Registros Vencidos",
    "overdueByDays": "Vencido hace {days} día(s)",
    "allTime": "Todo el Período",
    "yearOf": "Año de {year}",
    "quarterOfYear": "{quarter}º Trimestre de {year}"
  },
  "settings": {
    "title": "Ajustes",
    "darkMode": "Modo oscuro",
    "darkModeDescription": "Activar tema oscuro",
    "currency": "Moneda",
    "language": "Idioma",
    "data": "Datos",
    "resetData": "Restablecer todos los datos",
    "manageCategories": "Gestionar Categorías",
    "incomeCategories": "Categorías de Ingresos",
    "expenseCategories": "Categorías de Gastos",
    "add": "Añadir",
    "deleteCategoryDefaultWarning": "No se puede eliminar la categoría predeterminada \"Otros\".",
    "about": "Acerca de",
    "version": "Wallet SATTI v1.1"
  },
  "modals": {
    "newEntry": "Nuevo Registro",
    "editEntry": "Editar Registro",
    "entryDetailsTitle": "Detalles del {type}",
    "income": "Ingreso",
    "expense": "Gasto",
    "confirmAction": "Confirmar Acción",
    "editBudgets": "Editar Presupuesto - {month}",
    "newGoal": "Nueva Meta de Ahorro",
    "editGoal": "Editar Meta",
    "addToGoal": "Añadir a Meta: {name}",
    "newCategory": "Nueva Categoría",
    "editCategory": "Editar Categoría",
    "advancedFilters": "Filtros Avanzados",
    "fillRequiredFields": "Por favor, rellene todos los campos obligatorios: Descripción, Valor y Categoría.",
    "valueGreaterThanZero": "Por favor, introduzca un importe superior a cero.",
    "fillNameAndIcon": "Por favor, rellene el nombre y el icono (emoji)."
  },
  "entryForm": {
    "incomeValue": "Valor del Ingreso",
    "expenseValue": "Valor del Gasto",
    "description": "Descripción",
    "incomePlaceholder": "Salario",
    "expensePlaceholder": "Compras del mes",
    "category": "Categoría",
    "dueDate": "Fecha de Vencimiento",
    "recurrence": "Recurrencia",
    "recurrenceTypes": {
      "none": "No repetir",
      "always": "Siempre",
      "parcelado": "Cuotas"
    },
    "frequency": "Frecuencia",
    "frequencyTypes": {
      "monthly": "Mensual",
      "6m": "Cada 6 meses",
      "yearly": "Anual"
    },
    "parcels": "Número de cuotas",
    "saveEntry": "Guardar Registro",
    "saveChanges": "Guardar Cambios"
  },
  "entryDetail": {
    "value": "Valor",
    "dueDate": "Vencimiento",
    "status": {
      "paid": "✓ Pagado",
      "overdue": "⚠️ Vencido",
      "pending": "Pendiente"
    },
    "recurrence": {
      "parcelado": "Cuota {index}/{total}",
      "always": "Recurrente",
      "none": "Único"
    },
    "deleteOccurrence": "Eliminar esta ocurrencia",
    "endRecurrence": "Finalizar recurrencia",
    "deleteSeries": "Eliminar toda la serie",
    "deleteOccurrenceTitle": "Eliminar Ocurrencia",
    "deleteOccurrenceMessage": "¿Estás seguro de que quieres eliminar solo esta ocurrencia? La serie seguirá existiendo.",
    "endRecurrenceTitle": "Finalizar Recurrencia",
    "endRecurrenceMessage": "Esto evitará que se generen nuevas ocurrencias a partir de esta fecha. Las ocurrencias pasadas no se verán afectadas. ¿Quieres continuar?",
    "deleteSeriesTitle": "Eliminar Serie Completa",
    "deleteSeriesMessage": "Atención: Esto eliminará permanentemente TODAS las ocurrencias (pasadas y futuras) de este registro. Esta acción no se puede deshacer."
  },
  "editBudgets": {
    "description": "Establezca el importe máximo de gasto para cada categoría este mes. Déjelo en blanco o en 0,00 para no establecer un presupuesto.",
    "saveBudget": "Guardar Presupuesto"
  },
  "goalForm": {
    "name": "Nombre de la Meta",
    "namePlaceholder": "Viaje a Japón",
    "targetAmount": "Importe Objetivo",
    "targetAmountPlaceholder": "20000",
    "targetDate": "Fecha Objetivo (Opcional)",
    "saveGoal": "Guardar Meta"
  },
  "addToSavings": {
    "amountToAdd": "Importe a Añadir",
    "description": "Esta acción creará un nuevo gasto en la categoría \"Ahorros\" para mantener su balance correcto.",
    "addToSavings": "Añadir a Ahorros"
  },
  "categoryForm": {
    "name": "Nombre de la Categoría",
    "namePlaceholder": "Ej: Supermercado",
    "icon": "Icono (Emoji)",
    "color": "Color",
    "saveCategory": "Guardar Categoría"
  },
  "deleteCategory": {
    "title": "Eliminar Categoría",
    "message": "¿Estás seguro de que quieres eliminar la categoría \"{name}\"? Los registros existentes en esta categoría se moverán a \"Otros\"."
  },
  "resetData": {
    "title": "Restablecer Datos de la Aplicación",
    "message": "¿Estás seguro de que quieres restablecer todos los datos? Esto eliminará TODOS los registros, presupuestos y metas. Esta acción no se puede deshacer."
  },
  "filterForm": {
    "incomeCategories": "Categorías de Ingresos",
    "expenseCategories": "Categorías de Gastos",
    "filterByValue": "Filtrar por Valor",
    "anyValue": "Cualquier Valor",
    "greaterThan": "Mayor que",
    "lessThan": "Menor que",
    "equalTo": "Igual a",
    "filterByDate": "Filtrar por Fecha",
    "startDate": "Fecha de inicio",
    "endDate": "Fecha de fin",
    "clearFilters": "Limpiar Filtros",
    "applyFilters": "Aplicar Filtros"
  },
  "onboarding": {
    "step1": {
      "title": "¡Bienvenido a Wallet SATTI!",
      "content": "Este es un recorrido rápido para presentarte las principales funciones de la aplicación. ¿Empezamos?"
    },
    "step2": {
      "title": "Panel Principal",
      "content": "Aquí tienes un resumen de tu salud financiera, con balances mensuales, gráficos de flujo y saldo acumulado."
    },
    "step3": {
      "title": "Balance del Mes",
      "content": "Sigue rápidamente el total de ingresos, gastos y el saldo del mes seleccionado."
    },
    "step4": {
      "title": "Registros",
      "content": "En esta pestaña, puedes ver, filtrar y gestionar todas tus transacciones, pasadas y futuras."
    },
    "step5": {
      "title": "Añadir Registro",
      "content": "Usa este botón central para añadir nuevos ingresos o gastos de forma rápida y fácil."
    },
    "step6": {
      "title": "Metas de Ahorro",
      "content": "Crea y sigue tus metas financieras, ya sea para un viaje o un fondo de emergencia."
    },
    "step7": {
      "title": "Presupuestos",
      "content": "Define presupuestos mensuales por categoría para mantener tus gastos bajo control y evitar sorpresas."
    },
    "step8": {
      "title": "Informes Detallados",
      "content": "Para un análisis más profundo, explora informes y proyecciones en la pestaña 'Datos'."
    },
    "step9": {
      "title": "Ajustes",
      "content": "Personaliza la aplicación, gestiona tus categorías y cambia la moneda en la pestaña 'Ajustes'."
    },
    "step10": {
      "title": "¡Todo Listo!",
      "content": "Has completado el recorrido. ¡Ahora es tu turno! Empieza añadiendo tu primer registro y toma el control de tus finanzas."
    },
    "previous": "Anterior",
    "next": "Siguiente",
    "finish": "Finalizar",
    "start": "Empezar"
  },
  "categories": {
    "receita": {
      "salary": "Salario",
      "freelance": "Freelance",
      "business": "Negocios",
      "investment": "Inversiones",
      "other_income": "Otros"
    },
    "despesa": {
      "food": "Alimentación",
      "transport": "Transporte",
      "housing": "Vivienda",
      "health": "Salud",
      "education": "Educación",
      "entertainment": "Ocio",
      "savings": "Ahorros",
      "business_exp": "Gastos de Negocio",
      "tax": "Impuestos",
      "other_expense": "Otros"
    }
  },
  "charts": {
    "legend": {
        "income": "Ingresos",
        "expenses": "Gastos",
        "balance": "Saldo"
    }
  },
  "months": {
      "jan": "Ene", "feb": "Feb", "mar": "Mar", "apr": "Abr", "may": "May", "jun": "Jun", 
      "jul": "Jul", "aug": "Ago", "sep": "Sep", "oct": "Oct", "nov": "Nov", "dec": "Dic"
  }
}