const fs = require("fs");
const path = require("path");

const { normalizeNubariumPremium } = require("./normalizers/nubariumPremium");
const { buildImssViewModel } = require("./formatters/imssViewModel");
const { renderImssPdf } = require("./renderers/imssPdfRenderer");

function main() {
  try {
    const inputPath = path.join(__dirname, "../data/sample-premium.json");
    const outputPath = path.join(__dirname, "../output/imss_historial_laboral.pdf");

    if (!fs.existsSync(inputPath)) {
      throw new Error(`No se encontró el archivo JSON de entrada: ${inputPath}`);
    }

    const rawText = fs.readFileSync(inputPath, "utf8");
    const rawPayload = JSON.parse(rawText);

    const normalized = normalizeNubariumPremium(rawPayload);
    const viewModel = buildImssViewModel(normalized);

    renderImssPdf(viewModel, outputPath);

    console.log("✅ PDF generado correctamente");
    console.log(`📄 Archivo: ${outputPath}`);
    console.log(`👤 Nombre: ${viewModel.fullName}`);
    console.log(`📦 Empleos procesados: ${viewModel.jobs.length}`);
  } catch (error) {
    console.error("❌ Error al generar el PDF:");
    console.error(error.message);
    process.exit(1);
  }
}

main();