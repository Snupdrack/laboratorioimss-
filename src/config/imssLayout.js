module.exports = {
  page: {
    width: 612,
    height: 792
  },

  templates: {
    firstPage: "page1.png",   // 2550x3300px @ 300 DPI
    nextPage:  "page2.png",
    lastPage:  "pagef.png"
  },

  font: {
    family: "Helvetica",
    size: 9,
    color: "black"
  },

  // ─── Datos personales (página 1) ─────────────────────────────────────
  person: {
    fullName: { x: 47,  y: 192, width: 300 },
    nss:      { x: 68,  y: 219, width: 180 },
    curp:     { x: 74,  y: 239, width: 220 }
  },

  // ─── Fecha del reporte (esquina superior derecha, página 1) ──────────
  reportDate: {
    full:       { x: 482, y: 201, align: "center", width: 120 },
    totalWeeks: { x: 506, y: 237, align: "center", width: 50  }
  },

  // ─── Resumen de semanas (página 1) ───────────────────────────────────
  summary: {
    totalWeeks:      { x: 130, y: 313, align: "center", width: 80 },
    discountedWeeks: { x: 307, y: 313, align: "center", width: 60 },
    reinstatedWeeks: { x: 482, y: 313, align: "center", width: 60 }
  },

  // ─── Bloques de historial laboral ────────────────────────────────────
  //
  // page1: 4 bloques, posiciones Y medidas del vectorial (no uniformes)
  //   386, 475, 580, 685
  //
  // page2: 5 bloques uniformes, startY=174, gapY=105
  //
  jobs: {
    firstPageCount: 4,
    nextPageCount:  5,

    firstPageBlockY: [386, 475, 580, 685],

    startY: 174,
    gapY:   105,

    // Offsets dentro de cada bloque (medidos del vectorial)
    employerName:         { x: 147, yOffset:  0, width: 340 },
    employerRegistration: { x: 147, yOffset: 20, width: 180 },
    state:                { x: 147, yOffset: 40, width: 180 },
    startDate:            { x: 147, yOffset: 60, width: 80  },
    endDate:              { x: 312, yOffset: 60, width: 80  },
    salary:               { x: 568, yOffset: 60, width: 70, align: "right" }
  }
};