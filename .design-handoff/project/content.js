// === CONTENT DATA ===
const ROLE_CONTENT = {
  bellboy: {
    es: { name: 'Botones', short: 'Bellboy' },
    listening: {
      A1: { en: "Hello. I have two bags. Can you help me?", opts: [
        { ic: 'a', label: 'Ayudar con el equipaje', sub: 'Carry bags to room', correct: true },
        { ic: 'b', label: 'Dar indicaciones', sub: 'Give directions' },
        { ic: 'c', label: 'Llamar al restaurante', sub: 'Call restaurant' },
      ]},
      A2: { en: "Could you take my luggage up to room 412 please?", opts: [
        { ic: 'a', label: 'Llevar equipaje al cuarto 412', sub: 'Deliver to room', correct: true },
        { ic: 'b', label: 'Guardar equipaje en lobby', sub: 'Store in lobby' },
        { ic: 'c', label: 'Llamar un taxi', sub: 'Call a taxi' },
      ]},
      B1: { en: "I'm checking in a bit early — could you hold my bags until my room's ready?", opts: [
        { ic: 'a', label: 'Guardar maletas hasta que cuarto esté listo', sub: 'Hold luggage', correct: true },
        { ic: 'b', label: 'Cancelar la reservación', sub: 'Cancel booking' },
        { ic: 'c', label: 'Llevar maletas al cuarto de inmediato', sub: 'Deliver now' },
      ]},
      B2: { en: "Would it be possible to send someone up in about twenty minutes to collect my luggage? I'd like to settle in first.", opts: [
        { ic: 'a', label: 'Enviar a alguien en 20 min por el equipaje', sub: 'Pickup later', correct: true },
        { ic: 'b', label: 'Llevar equipaje ahora mismo', sub: 'Take bags now' },
        { ic: 'c', label: 'Cambiar de habitación', sub: 'Switch room' },
      ]},
    },
    speaking: {
      A1: { scenario: 'Un huésped llega al lobby con dos maletas grandes y parece perdido.', keywords: ['help', 'bags', 'room', 'follow', 'please'] },
      A2: { scenario: 'Un huésped le pide llevar su equipaje a la habitación 304, pero el cuarto aún no está listo.', keywords: ['luggage', 'room', 'not ready', 'hold', 'moment'] },
      B1: { scenario: 'Un huésped pregunta si puede guardar su equipaje después del check-out porque su vuelo sale en la noche.', keywords: ['store', 'luggage', 'check-out', 'flight', 'pick up'] },
      B2: { scenario: 'Un huésped VIP se queja de que una maleta llegó dañada durante el traslado al cuarto. Debe disculparse y ofrecer una solución.', keywords: ['apologize', 'damage', 'investigate', 'replace', 'manager'] },
    }
  },
  frontdesk: {
    es: { name: 'Recepción', short: 'Front Desk' },
    listening: {
      A1: { en: "Good morning. I have a reservation under Martinez.", opts: [
        { ic: 'a', label: 'Buscar reservación', sub: 'Find booking', correct: true },
        { ic: 'b', label: 'Ofrecer desayuno', sub: 'Offer breakfast' },
        { ic: 'c', label: 'Llamar un taxi', sub: 'Call taxi' },
      ]},
      A2: { en: "What time is breakfast included with my room?", opts: [
        { ic: 'a', label: 'Explicar horario del desayuno', sub: 'Breakfast hours', correct: true },
        { ic: 'b', label: 'Cambiar la habitación', sub: 'Change room' },
        { ic: 'c', label: 'Ofrecer tour de la ciudad', sub: 'City tour' },
      ]},
      B1: { en: "My booking said ocean view but this room faces the parking lot. This isn't what I paid for.", opts: [
        { ic: 'a', label: 'Disculparse y buscar otra habitación', sub: 'Apologize & relocate', correct: true },
        { ic: 'b', label: 'Explicar que no hay cambios', sub: 'No changes available' },
        { ic: 'c', label: 'Ofrecer late check-out', sub: 'Late check-out' },
      ]},
      B2: { en: "We booked through a third party and they charged us for breakfast — but your colleague just told us it's not included. Can you sort this out?", opts: [
        { ic: 'a', label: 'Revisar con OTA y resolver cobro', sub: 'Investigate & resolve', correct: true },
        { ic: 'b', label: 'Decir que no es su problema', sub: 'Deflect' },
        { ic: 'c', label: 'Cobrar el desayuno otra vez', sub: 'Charge again' },
      ]},
    },
    speaking: {
      A1: { scenario: 'Un huésped se acerca al mostrador y dice su nombre para hacer check-in.', keywords: ['welcome', 'reservation', 'key', 'room', 'enjoy'] },
      A2: { scenario: 'Un huésped pregunta qué está incluido en su tarifa y los horarios del desayuno.', keywords: ['rate', 'includes', 'breakfast', 'buffet', 'until'] },
      B1: { scenario: 'Un huésped regresa molesto porque el Wi-Fi no funciona en su habitación y tiene una llamada de trabajo en 10 minutos.', keywords: ['apologize', 'technical', 'send', 'right away', 'compensate'] },
      B2: { scenario: 'Una pareja reservó una suite para su aniversario vía OTA, pero su reservación no aparece en el sistema y el hotel está lleno.', keywords: ['apologize', 'confirm', 'sister hotel', 'upgrade', 'resolve'] },
    }
  },
  restaurant: {
    es: { name: 'Restaurante', short: 'Restaurant' },
    listening: {
      A1: { en: "Can I see the menu, please?", opts: [
        { ic: 'a', label: 'Traer el menú', sub: 'Bring menu', correct: true },
        { ic: 'b', label: 'Traer la cuenta', sub: 'Bring bill' },
        { ic: 'c', label: 'Llamar al chef', sub: 'Call chef' },
      ]},
      A2: { en: "What do you recommend that's not too spicy?", opts: [
        { ic: 'a', label: 'Recomendar un plato suave', sub: 'Suggest mild dish', correct: true },
        { ic: 'b', label: 'Traer salsa picante', sub: 'Bring hot sauce' },
        { ic: 'c', label: 'Cambiar de mesa', sub: 'Change table' },
      ]},
      B1: { en: "My daughter has a nut allergy — could you check if the dessert has any nuts in it?", opts: [
        { ic: 'a', label: 'Verificar con cocina sobre alergenos', sub: 'Check with kitchen', correct: true },
        { ic: 'b', label: 'Recomendar el postre sin verificar', sub: 'Recommend anyway' },
        { ic: 'c', label: 'Cancelar la orden completa', sub: 'Cancel order' },
      ]},
      B2: { en: "The steak is overcooked — I asked for medium rare and this is well done. Could you have the kitchen fire another one?", opts: [
        { ic: 'a', label: 'Disculparse, reemplazar el plato', sub: 'Apologize & replace', correct: true },
        { ic: 'b', label: 'Ofrecer postre de cortesía', sub: 'Offer dessert' },
        { ic: 'c', label: 'Explicar que está bien cocinado', sub: 'Defend kitchen' },
      ]},
    },
    speaking: {
      A1: { scenario: 'Un huésped se sienta y pide el menú.', keywords: ['welcome', 'menu', 'drink', 'water', 'moment'] },
      A2: { scenario: 'Un huésped pregunta qué plato recomienda que no sea muy picante.', keywords: ['recommend', 'mild', 'popular', 'delicious', 'try'] },
      B1: { scenario: 'Un huésped avisa que tiene alergia a los mariscos antes de ordenar su plato principal.', keywords: ['allergy', 'check', 'kitchen', 'safe', 'alternative'] },
      B2: { scenario: 'Un grupo de seis se queja de que la comida llegó fría y piden hablar con el gerente.', keywords: ['apologize', 'manager', 'replace', 'compensate', 'unacceptable'] },
    }
  }
};

const LEVELS = ['A1', 'A2', 'B1', 'B2'];
const LEVEL_DESC = {
  A1: 'Supervivencia',
  A2: 'Funcional',
  B1: 'Profesional',
  B2: 'Avanzado',
};

// === STORE CONTENT GLOBALLY ===
Object.assign(window, { ROLE_CONTENT, LEVELS, LEVEL_DESC });
