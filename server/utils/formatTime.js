function getPreviousQuarterHourUnix() {
    // Obtener la fecha y hora actual
    const currentDate = new Date();
    // Obtener el minuto actual
    const currentMinute = currentDate.getMinutes();
    // Obtener la hora actual
    let currentHour = currentDate.getHours();
    // Obtener el día actual
    let currentDay = currentDate.getDate(); // Obtener el día actual

    // Calcular el minuto del cuarto de hora anterior
    let previousQuarterHourMinute = 0;
    let previousQuarterHourHour = currentHour; // Hora por defecto

    if (currentMinute >= 0 && currentMinute < 15) {
        // Restar un día y una hora si la hora actual es 0
        if (currentHour === 0) {
            previousQuarterHourHour = 23;
            // Restar un día si la hora actual es 0
            if (currentDay === 1) {
                // Si es el primer día del mes, retrocede al último día del mes anterior
                currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
            } else {
                currentDay -= 1;
            }
        } else {
            previousQuarterHourHour -= 1;
        }
        previousQuarterHourMinute = 45;
    } else if (currentMinute >= 15 && currentMinute < 30) {
        previousQuarterHourMinute = 0;
    } else if (currentMinute >= 30 && currentMinute < 45) {
        previousQuarterHourMinute = 15;
    } else if (currentMinute >= 45) {
        previousQuarterHourMinute = 30;
    }

    // Configurar la fecha y hora actual con el minuto del cuarto de hora anterior
    const previousQuarterHourDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDay, // Usar el día actual ajustado
        previousQuarterHourHour,
        previousQuarterHourMinute
    );

    // Obtener el valor UNIX del cuarto de hora anterior
    const previousQuarterHourUnix = Math.floor(previousQuarterHourDate.getTime());
    return previousQuarterHourUnix;
}

module.exports = { getPreviousQuarterHourUnix };
