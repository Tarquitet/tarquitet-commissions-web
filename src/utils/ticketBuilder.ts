// src/utils/ticketBuilder.ts

export function generateTicketSummary(
  logic: any,
  discountInfo?: { isPromoActive: boolean; percentage: number; discountedTotal: number },
): string {
  const { baseSelection, extraChars, ychSelection, selections, multiSelections, total, paymentMethod, isFullcolor } =
    logic;

  if (!baseSelection) return 'Select a Base Style to generate the summary...';

  let text = `🎨 COMMISSION REQUEST - TARQUINET\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `✨ STYLE: ${baseSelection.tier}\n`;
  if (extraChars > 1) text += `👥 CHARACTERS: ${extraChars}\n`;
  if (ychSelection) text += `🖼️ YCH BASE: ${ychSelection.title}\n`;

  Object.entries(selections).forEach(([cat, val]) => {
    if (isFullcolor && (cat === 'SHADOW' || cat === 'LIGHT')) return;
    text += `🔹 ${cat}: ${val}\n`;
  });

  Object.entries(multiSelections).forEach(([cat, labels]: [string, any]) => {
    if (labels.length > 0) text += `📁 ${cat}: ${labels.join(', ')}\n`;
  });

  text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `💰 METHOD: ${paymentMethod}\n`;

  // AQUI APLICAMOS LA LÓGICA DEL DESCUENTO EN EL TEXTO
  if (discountInfo && discountInfo.isPromoActive) {
    text += `❌ ORIGINAL TOTAL: $${total.gross} USD\n`;
    text += `🔥 SYSTEM PROMO: -${discountInfo.percentage * 100}%\n`;
    text += `💵 FINAL TOTAL: $${discountInfo.discountedTotal.toFixed(2)} USD\n`;
  } else {
    text += `💵 TOTAL: $${total.gross} USD\n`;
  }

  text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

  // LOGICA DE REFERENCIAS CONDICIONAL
  if (ychSelection) {
    text += `🔗 References: Attach your character(s) for the "${ychSelection.title}" pose!`;
  } else {
    text += `🔗 References: Attach them on the form or directly on my DM!`;
  }

  return text;
}
