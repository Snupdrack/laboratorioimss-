const fs   = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const layout = require("../config/imssLayout");

function drawText(doc, text, cfg) {
  if (text === undefined || text === null || text === "") return;
  const value = String(text);

  if (cfg.align === "center") {
    doc.text(value, cfg.x - (cfg.width || 120) / 2, cfg.y, {
      width: cfg.width || 120,
      align: "center",
      lineBreak: false
    });
    return;
  }

  if (cfg.align === "right") {
    doc.text(value, cfg.x - (cfg.width || 100), cfg.y, {
      width: cfg.width || 100,
      align: "right",
      lineBreak: false
    });
    return;
  }

  doc.text(value, cfg.x, cfg.y, { lineBreak: false });
}

function drawJobBlock(doc, job, baseY) {
  drawText(doc, job.employerName, {
    x: layout.jobs.employerName.x,
    y: baseY + layout.jobs.employerName.yOffset,
    width: layout.jobs.employerName.width
  });
  drawText(doc, job.employerRegistration, {
    x: layout.jobs.employerRegistration.x,
    y: baseY + layout.jobs.employerRegistration.yOffset,
    width: layout.jobs.employerRegistration.width
  });
  drawText(doc, job.state, {
    x: layout.jobs.state.x,
    y: baseY + layout.jobs.state.yOffset,
    width: layout.jobs.state.width
  });
  drawText(doc, job.startDate, {
    x: layout.jobs.startDate.x,
    y: baseY + layout.jobs.startDate.yOffset,
    width: layout.jobs.startDate.width
  });
  drawText(doc, job.endDate, {
    x: layout.jobs.endDate.x,
    y: baseY + layout.jobs.endDate.yOffset,
    width: layout.jobs.endDate.width
  });
  drawText(doc, job.salary, {
    x: layout.jobs.salary.x,
    y: baseY + layout.jobs.salary.yOffset,
    align: layout.jobs.salary.align || "right",
    width: layout.jobs.salary.width
  });
}

function drawHeaderData(doc, data) {
  drawText(doc, data.fullName,        layout.person.fullName);
  drawText(doc, data.nss,             layout.person.nss);
  drawText(doc, data.curp,            layout.person.curp);
  drawText(doc, data.totalWeeks,      layout.summary.totalWeeks);
  drawText(doc, data.discountedWeeks, layout.summary.discountedWeeks);
  drawText(doc, data.reinstatedWeeks, layout.summary.reinstatedWeeks);

  // Fecha en formato DD/MM/YYYY sin modificar
  const fechaFormateada = String(data.issuedDate || "").trim();
  drawText(doc, fechaFormateada, layout.reportDate.full);
  drawText(doc, data.totalWeeks, layout.reportDate.totalWeeks);
}

function addTemplatePage(doc, templateName) {
  const templatePath = path.join(__dirname, "../../templates", templateName);
  if (!fs.existsSync(templatePath)) {
    throw new Error(`No se encontró la plantilla: ${templatePath}`);
  }
  doc.addPage({ size: [layout.page.width, layout.page.height], margin: 0 });
  doc.image(templatePath, 0, 0, {
    width:  layout.page.width,
    height: layout.page.height
  });
}

function renderImssPdf(data, outputPath) {
  const doc = new PDFDocument({ autoFirstPage: false });

  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  doc.pipe(fs.createWriteStream(outputPath));

  // ── Página 1 ─────────────────────────────────────────────────────────
  addTemplatePage(doc, layout.templates.firstPage);
  doc.font(layout.font.family).fontSize(layout.font.size).fillColor(layout.font.color);
  drawHeaderData(doc, data);

  const firstPageJobs = (data.jobs || []).slice(0, layout.jobs.firstPageCount);
  firstPageJobs.forEach((job, i) => {
    drawJobBlock(doc, job, layout.jobs.firstPageBlockY[i]);
  });

  // ── Páginas intermedias ───────────────────────────────────────────────
  const remainingJobs = (data.jobs || []).slice(layout.jobs.firstPageCount);
  for (let i = 0; i < remainingJobs.length; i += layout.jobs.nextPageCount) {
    const pageJobs = remainingJobs.slice(i, i + layout.jobs.nextPageCount);
    addTemplatePage(doc, layout.templates.nextPage);
    doc.font(layout.font.family).fontSize(layout.font.size).fillColor(layout.font.color);
    pageJobs.forEach((job, idx) => {
      drawJobBlock(doc, job, layout.jobs.startY + idx * layout.jobs.gapY);
    });
  }

  // ── Página final (siempre al último) ─────────────────────────────────
  addTemplatePage(doc, layout.templates.lastPage);

  doc.end();
}

module.exports = { renderImssPdf };